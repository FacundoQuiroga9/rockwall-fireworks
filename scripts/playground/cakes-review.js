// Development-only review of the production document, not a second renderer.
import data from '../../src/data/playgroundProfiles.json';
import bases from '../../src/data/playgroundBases.json';
import { buildPlaygroundDocument } from '../../src/shared/playgroundDocument.js';
const groups={"Dreams from Heaven":["dreams-from-heaven"],"Whacky Tobacky": ["whacky-tobacky"], "Magnum Tremors": ["magnum-tremors"], "Migraine": ["migraine"], "Neon Jellyfish": ["neon-jellyfish"], "Sky Ink": ["sky-ink"], "Wild Horses": ["wild-horses"], "Pyro Pilot": ["pyro-pilot"], "Wild West": ["wild-west"], "Nation Ovation": ["nation-ovation"], "Strobing Willow": ["strobing-willow"], "Three cakes + Nishiki": ["sky-ink", "wild-west", "wild-horses", "nishiki-blast-6-pack"], "Four dense cakes": ["whacky-tobacky", "magnum-tremors", "migraine", "neon-jellyfish"]};
const params=new URLSearchParams(location.search),compact=params.has('compact'),frame=document.querySelector('iframe');
if(params.has('wide'))document.body.style.maxWidth='none';
if(compact)document.body.className=params.has('landscape')?'landscape':'compact';
// Fit the complete production viewport into the review window without changing its camera.
function fitReview(){const w=compact?(params.has('landscape')?844:390):(params.has('wide')?1920:1310),h=compact?(params.has('landscape')?560:760):(params.has('wide')?620:820);const scale=Math.min(1,(innerWidth-24)/w,(innerHeight-112)/h);frame.style.width=w+'px';frame.style.height=h+'px';frame.style.maxWidth='none';frame.style.transform=`scale(${scale})`;const viewport=document.getElementById('review-viewport');viewport.style.width=(w+2)*scale+'px';viewport.style.height=(h+2)*scale+'px';}
addEventListener('resize',fitReview);fitReview();
let start=0,peakParticles=0,peakPoints=0,peakHeap=0,reports=0,qualityChanges=[],previousQuality='';
function show(name){
 frame.contentWindow?.postMessage({type:'rockwall-destroy'},'*');
 const profiles=groups[name].map(id=>data.profiles.find(p=>p.productId===id));
 start=performance.now();peakParticles=peakPoints=peakHeap=reports=0;qualityChanges=[];previousQuality='';
 frame.srcdoc=buildPlaygroundDocument({profiles,scene:profiles[0].scene,skyline:location.origin+'/images/hero/dallas-skyline-2160.webp',compact,reducedMotion:params.has('reduced'),preferences:{sound:false,quality:'auto',volume:.35},bases:Object.fromEntries(Object.entries(bases).map(([id,b])=>[id,{...b,src:location.origin+b.src}]))});
 document.getElementById('scope').textContent=profiles.map(p=>`${p.name}: ${p.sampleLabel}; ${p.shellEffects?.length || 0} documented shell effects`).join(' · ');
}
for(const name of Object.keys(groups)){const button=document.createElement('button');button.textContent=name;button.onclick=()=>show(name);document.querySelector('nav').append(button);}
addEventListener('message',event=>{
 if(event.source!==frame.contentWindow||event.data?.type!=='rockwall-playground')return;
 const state=event.data,m=state.metrics;reports++;
 if(m){peakParticles=Math.max(peakParticles,m.activeParticles||0);peakPoints=Math.max(peakPoints,m.drawnPoints||0);peakHeap=Math.max(peakHeap,performance.memory?.usedJSHeapSize||0);if(m.quality!==previousQuality){qualityChanges.push({time:state.position,quality:m.quality});previousQuality=m.quality;}}
 document.getElementById('metrics').textContent=JSON.stringify({elapsedMs:Math.round(performance.now()-start),reports,peakParticles,peakPoints,peakHeap,qualityChanges,...state,environment:{compact,userAgent:navigator.userAgent,dpr:devicePixelRatio,cores:navigator.hardwareConcurrency}},null,2);
});
show('Sky Ink');
