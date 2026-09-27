import data from '../../src/data/playgroundProfiles.json';
import bases from '../../src/data/playgroundBases.json';
import environments from '../../src/data/playgroundEnvironments.json';
import { createPlaygroundRenderer } from '../../src/shared/playgroundRenderer.js';
import { createFountainModel } from '../../src/shared/playgroundFountain.js';
import { createQualityController } from '../../src/shared/playgroundQuality.js';
import { createTimeline } from '../../src/shared/playgroundTimeline.js';
const $=id=>document.getElementById(id),results=[];
async function measure(scene,requested){
 const profiles=scene==='ground'?data.profiles.filter(p=>p.scene==='ground').slice(0,4):['jawbreaker','willow-explosion','old-ironsides','whisky-business'].map(id=>data.profiles.find(p=>p.productId===id));
 const bg=scene==='ground'?environments.ground.wide:null;
 if(bg){const image=new Image();image.src=bg;await image.decode();}
 $('sky').style.backgroundImage=bg?`url(${bg})`:'none';
 const renderer=createPlaygroundRenderer($('sky'),profiles,false,createFountainModel,bases),clock=createTimeline(profiles),adaptive=createQualityController(requested,false);
 let effective=adaptive.snapshot().effective;renderer.setQuality(effective);
 return new Promise(resolve=>{
  let start=0,last=0,peakParticles=0,peakPoints=0,heapPeak=0;const costs=[],gaps=[],changes=[];
  function step(now){if(!start){start=now;clock.play(now);}const elapsed=(now-start)/1000,state=clock.tick(now),gap=last?now-last:0;last=now;
   const before=performance.now();renderer.draw(scene==='ground'?15+elapsed:state.position,state.selected,state.renderEvents);const cost=performance.now()-before,m=renderer.metrics();
   costs.push(cost);if(gap)gaps.push(gap);peakParticles=Math.max(peakParticles,m.activeParticles);peakPoints=Math.max(peakPoints,m.drawnPoints);heapPeak=Math.max(heapPeak,performance.memory?.usedJSHeapSize||0);
   const q=adaptive.sample(now,cost,gap);if(q.effective!==effective){effective=q.effective;renderer.setQuality(effective);changes.push({elapsed,effective});}
   $('state').textContent=`${scene} · ${requested} / ${effective} · ${elapsed.toFixed(1)} / 35 sec`;
   if(elapsed<35)return requestAnimationFrame(step);
   const p95=a=>a.slice().sort((a,b)=>a-b)[Math.floor(a.length*.95)]||0;
   results.push({scene,requested,effective,seconds:elapsed,fps:costs.length/elapsed,meanDrawMs:costs.reduce((a,b)=>a+b,0)/costs.length,p95DrawMs:p95(costs),maxDrawMs:Math.max(...costs),p95FrameMs:p95(gaps),over50ms:gaps.filter(g=>g>50).length,peakParticles,peakPoints,heapPeak,changes,buffer:[m.pixelWidth,m.pixelHeight],css:[$('sky').clientWidth,$('sky').clientHeight],image:bg,environment:{userAgent:navigator.userAgent,dpr:devicePixelRatio,cores:navigator.hardwareConcurrency}});
   $('metrics').textContent=JSON.stringify(results,null,2);renderer.destroy();resolve();
  }requestAnimationFrame(step);
 });
}
$('run').onclick=async()=>{$('run').disabled=true;results.length=0;for(const [scene,quality] of [['aerial','auto'],['aerial','high'],['ground','auto'],['ground','high']])await measure(scene,quality);$('state').textContent='Complete';$('run').disabled=false;};
