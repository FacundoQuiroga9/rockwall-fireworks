// Local review artifact: production document without a live-reload client.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { buildPlaygroundDocument } from '../../src/shared/playgroundDocument.js';
const data=JSON.parse(readFileSync('src/data/playgroundProfiles.json'));
const ids=JSON.parse(readFileSync('docs/catalog/playground-cakes-2026-09/new-profile-ids.json'));
const groups=Object.fromEntries([...ids,'strobing-willow'].map(id=>[data.profiles.find(p=>p.productId===id).name,[id]]));
groups['Three cakes + Nishiki']=['sky-ink','wild-west','wild-horses','nishiki-blast-6-pack'];
groups['Four dense cakes']=['whacky-tobacky','magnum-tremors','migraine','neon-jellyfish'];
const documents=Object.fromEntries(Object.entries(groups).map(([name,ids])=>[name,buildPlaygroundDocument({profiles:ids.map(id=>data.profiles.find(p=>p.productId===id)),scene:'aerial',skyline:'http://localhost:5173/images/hero/dallas-skyline-2160.webp',preferences:{sound:false,quality:'auto',volume:.35}})]));
let shell=readFileSync('scripts/playground/cakes-review.html','utf8').replace('<script type="module" src="./cakes-review.js"></script>','');
let js=readFileSync('scripts/playground/cakes-review.js','utf8');
js=js.slice(js.indexOf('const params='));const start=js.indexOf(' const profiles=groups[name]'),end=js.indexOf('\n}',start);
js=js.slice(0,start)+` start=performance.now();peakParticles=peakPoints=peakHeap=reports=0;qualityChanges=[];previousQuality='';frame.srcdoc=documents[name];document.getElementById('scope').textContent=name;`+js.slice(end);
mkdirSync('public/artifacts',{recursive:true});writeFileSync('public/artifacts/cakes-review.html',shell+'<script>const groups='+JSON.stringify(groups)+';const documents='+JSON.stringify(documents).replaceAll('</script','<\\/script')+';'+js+'</script>');
console.log('http://localhost:5173/artifacts/cakes-review.html');
