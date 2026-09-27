// Local QA: the production document and renderer, without Vite reloads during captures.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { buildPlaygroundDocument } from '../../src/shared/playgroundDocument.js';
const read = path => JSON.parse(readFileSync(path));
const data = read('src/data/playgroundProfiles.json'), bases = read('src/data/playgroundBases.json'), environments = read('src/data/playgroundEnvironments.json');
const ids = read('docs/catalog/playground-environments-2026-09/new-profile-ids.json');
const groups = Object.fromEntries(ids.map(id => [data.profiles.find(p => p.productId === id).name, { scene: 'aerial', ids: [id] }]));
Object.assign(groups, {
  'Close-up empty': { scene: 'ground', ids: [] },
  'Close-up one': { scene: 'ground', ids: ['fairies-in-a-jar'] },
  'Close-up four': { scene: 'ground', ids: data.profiles.filter(p => p.scene === 'ground').slice(0,4).map(p => p.productId) },
  'Open Field empty': { scene: 'close', ids: [] },
  'Open Field effects': { scene: 'close', ids: data.profiles.filter(p => p.scene === 'close').map(p => p.productId) },
  'Four new cakes': { scene: 'aerial', ids: ['jawbreaker','willow-explosion','old-ironsides','whisky-business'] },
  'Three new cakes + Nishiki': { scene: 'aerial', ids: ['jawbreaker','willow-explosion','old-ironsides','nishiki-blast-6-pack'] },
  'Dallas empty': { scene: 'aerial', ids: [] },
});
const origin = 'http://localhost:5173';
const documents = Object.fromEntries(Object.entries(groups).map(([name,group]) => [name,buildPlaygroundDocument({
  profiles: group.ids.map(id=>data.profiles.find(p=>p.productId===id)), scene: group.scene,
  skyline: origin+'/images/hero/dallas-skyline-2160.webp', environment: environments[group.scene] ? origin+environments[group.scene].wide : undefined,
  bases: Object.fromEntries(Object.entries(bases).map(([id,b])=>[id,{...b,src:origin+b.src}])),
  preferences:{sound:false,quality:'auto',volume:.35},
})]));
let shell=readFileSync('scripts/playground/cakes-review.html','utf8').replace('cake ascent batch','environment and cake batch').replace('<script type="module" src="./cakes-review.js"></script>','');
let js=readFileSync('scripts/playground/cakes-review.js','utf8');
js=js.slice(js.indexOf('const params='));const start=js.indexOf(' const profiles=groups[name]'),end=js.indexOf('\n}',start);
js=js.slice(0,start)+` start=performance.now();peakParticles=peakPoints=peakHeap=reports=0;qualityChanges=[];previousQuality='';frame.srcdoc=documents[name];document.getElementById('scope').textContent=name;`+js.slice(end);
js=js.replace("show('Sky Ink');","show('Close-up empty');");
mkdirSync('public/artifacts',{recursive:true});writeFileSync('public/artifacts/environments-review.html',shell+'<script>const groups='+JSON.stringify(groups)+';const documents='+JSON.stringify(documents).replaceAll('</script','<\\/script')+';'+js+'</script>');
console.log(origin+'/artifacts/environments-review.html');
