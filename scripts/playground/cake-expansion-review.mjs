// Local QA: the production document and renderer, without Vite reloads during captures.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { buildPlaygroundDocument } from '../../src/shared/playgroundDocument.js';
const read = path => JSON.parse(readFileSync(path));
const data = read('src/data/playgroundProfiles.json'), bases = read('src/data/playgroundBases.json'), environments = read('src/data/playgroundEnvironments.json');
const ids = read('docs/catalog/cake-expansion-2026-09-29/new-profile-ids.json');
const groups = Object.fromEntries([...ids, 'ghost-rings', 'hot-as-hell', 'pirate-captain'].map(id => [data.profiles.find(p => p.productId === id).name, { scene: 'aerial', ids: [id] }]));
Object.assign(groups, {
  'Four new cakes': { scene: 'aerial', ids },
  'Four reduced motion': { scene: 'aerial', ids, reducedMotion: true },
  'Three new + Nishiki': { scene: 'aerial', ids: ['alien-attack', 'viva-mexico', 'forever-loyal', 'nishiki-blast-6-pack'] },
});
const origin = 'http://127.0.0.1:5173';
const documents = Object.fromEntries(Object.entries(groups).map(([name,group]) => [name,buildPlaygroundDocument({
  profiles: group.ids.map(id=>data.profiles.find(p=>p.productId===id)), scene: group.scene,
  skyline: origin+'/images/hero/dallas-skyline-2160.webp', environment: environments[group.scene] ? origin+environments[group.scene].wide : undefined,
  bases: Object.fromEntries(Object.entries(bases).map(([id,b])=>[id,{...b,src:origin+b.src}])),
  preferences:{sound:false,quality:'auto',volume:.35}, reducedMotion:!!group.reducedMotion,
})]));
let shell=readFileSync('scripts/playground/cakes-review.html','utf8').replace('cake ascent batch','cake expansion review').replace('<script type="module" src="./cakes-review.js"></script>','');
let js=readFileSync('scripts/playground/cakes-review.js','utf8');
js=js.slice(js.indexOf('const params='));
const start=js.indexOf(' const profiles=groups[name]'),end=js.indexOf('\n}',start);
js=js.slice(0,start)+` start=performance.now();peakParticles=peakPoints=peakHeap=reports=0;qualityChanges=[];previousQuality='';frame.srcdoc=documents[name];document.getElementById('scope').textContent=name;`+js.slice(end);
js=js.replace("show('Sky Ink');","show('Alien Attack');");
js=js.replace('let start=0,','let awaitingReady=true,start=0,').replace('start=performance.now();peakParticles','awaitingReady=true;start=performance.now();peakParticles').replace('const state=event.data,m=state.metrics;reports++;',"const state=event.data,m=state.metrics;if(awaitingReady){if(state.state!=='idle'&&state.state!=='paused')return;awaitingReady=false;}reports++;");
mkdirSync('public/artifacts',{recursive:true});writeFileSync('public/artifacts/cake-expansion-review.html',shell+'<script>const groups='+JSON.stringify(groups)+';const documents='+JSON.stringify(documents).replaceAll('</script','<\\/script')+';'+js+'</script>');
console.log(origin+'/artifacts/cake-expansion-review.html');
