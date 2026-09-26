import data from '../../src/data/playgroundProfiles.json';
import bases from '../../src/data/playgroundBases.json';
import { createPlaygroundRenderer } from '../../src/shared/playgroundRenderer.js';
import { createFountainModel } from '../../src/shared/playgroundFountain.js';
import { createTimeline } from '../../src/shared/playgroundTimeline.js';
import { createQualityController } from '../../src/shared/playgroundQuality.js';
import { createPlaygroundAudio } from '../../src/shared/playgroundAudio.js';
const $=id=>document.getElementById(id);let cancelled=false,renderer,raf,audio;
const results=[];
$('stop').onclick=()=>{cancelled=true;cancelAnimationFrame(raf);renderer?.destroy();audio?.destroy();$('state').textContent='Stopped';$('batch').disabled=false;};
function measure(mode,requested,compact,duration=45){return new Promise(resolve=>{
  const ids=['band-of-brothers','ghost-killer','us-power','golden-peacock'];
  let profiles=data.profiles.filter(p=>mode==='ground'?p.scene==='ground':mode==='manual'?p.playback==='manual-shell':ids.includes(p.productId)).slice(0,4);
  if(mode==='stress')profiles=profiles.map(p=>({...p,events:p.events.map(e=>({...e,launch:0,burst:1}))}));
  const clock=createTimeline(profiles),adaptive=createQualityController(requested,compact);
  let quality=adaptive.snapshot().effective;renderer=createPlaygroundRenderer($('sky'),profiles,compact,createFountainModel,bases);renderer.setQuality(quality);
  let warmupStart=0,start=0,last=0,drawn=0,peakParticles=0,peakPoints=0,peakBudget=0,peakBytes=0,costs=[],gaps=[],changes=[];
  const step=now=>{
    if(cancelled)return resolve();if(!warmupStart)warmupStart=now;if(now-warmupStart<1300){renderer.draw(0,[]);raf=requestAnimationFrame(step);return;}if(!start){start=now;clock.play(now);}
    const seconds=(now-start)/1000;let state=clock.tick(now);
    if(mode==='manual')for(const shell of state.shells)if(shell.available)clock.launch(shell.index,now);
    state=clock.snapshot();
    if(!last||now-last>= (compact||quality==='low'?1000/30:1000/60)-1){
      const gap=last?now-last:0;last=now;
      const time=mode==='ground'?15+seconds:mode==='stress'?1.4+seconds%1.4:state.position;
      const before=performance.now();renderer.draw(time,state.selected,state.renderEvents);const cost=performance.now()-before,metrics=renderer.metrics();
      costs.push(cost);if(gap)gaps.push(gap);drawn++;peakParticles=Math.max(peakParticles,metrics.activeParticles);peakPoints=Math.max(peakPoints,metrics.drawnPoints);peakBudget=Math.max(peakBudget,metrics.budget);peakBytes=Math.max(peakBytes,performance.memory?.usedJSHeapSize||0);
      const q=adaptive.sample(now,cost,gap);if(q.effective!==quality){quality=q.effective;changes.push({seconds,quality});renderer.setQuality(quality);}
      $('state').textContent=`${mode} · requested ${requested} · effective ${quality} · ${compact?'compact':'desktop'} · ${seconds.toFixed(1)} / ${duration}s · ${metrics.activeParticles} active particles / ${metrics.drawnPoints} drawn points`;
    }
    if(seconds<duration){raf=requestAnimationFrame(step);return;}
    const percentile=(a,f)=>a.slice().sort((x,y)=>x-y)[Math.floor(a.length*f)]||0;
    results.push({mode,requested,compact,seconds:+seconds.toFixed(3),drawnFps:+(drawn/seconds).toFixed(2),meanDrawMs:+(costs.reduce((a,b)=>a+b,0)/costs.length).toFixed(3),p95DrawMs:percentile(costs,.95),maxDrawMs:Math.max(...costs),p95FrameMs:percentile(gaps,.95),over50ms:gaps.filter(x=>x>50).length,peakActiveParticles:peakParticles,peakDrawnPoints:peakPoints,peakBudget,heapPeakBytes:peakBytes,qualityChanges:changes,finalShellCounts:state.shells.map(s=>s.launched),css:`${$('sky').clientWidth}×${$('sky').clientHeight}`,pixels:`${$('sky').width}×${$('sky').height}`,dpr:devicePixelRatio,cores:navigator.hardwareConcurrency,userAgent:navigator.userAgent});
    $('metrics').textContent=JSON.stringify(results,null,2);renderer.destroy();resolve();
  };raf=requestAnimationFrame(step);
});}
$('batch').onclick=async()=>{cancelled=false;results.length=0;$('batch').disabled=true;for(const mode of ['aerial','ground','manual'])for(const quality of ['balanced','high']){if(cancelled)return;await measure(mode,quality,false);}if(!cancelled)await measure('ground','high',true);if(!cancelled)await measure('stress','high',false,15);$('state').textContent='Bounded suite complete';$('batch').disabled=false;};
$('audio').onclick=async()=>{
  $('audio').disabled=true;const chunks=[];let record,stream,peaks=[];
  audio=createPlaygroundAudio({onOutput(node,context){const destination=context.createMediaStreamDestination();node.connect(destination);stream=destination.stream;record=new MediaRecorder(stream,{mimeType:'audio/webm;codecs=opus'});record.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};record.onstop=()=>{const blob=new Blob(chunks,{type:'audio/webm'}),reader=new FileReader();reader.onload=()=>{$('audio-data').value=reader.result;};reader.readAsDataURL(blob);$('audio-result').src=URL.createObjectURL(blob);stream.getTracks().forEach(t=>t.stop());};}});
  audio.setVolume(.35);const success=await audio.enable(true);if(!success){$('audio-metrics').textContent=JSON.stringify(audio.snapshot());$('audio').disabled=false;return;}record.start();
  const event=data.profiles.find(p=>p.playback==='manual-shell').events[0],start=performance.now();let cues=0;
  const step=now=>{const time=(now-start)/1000;
    // Four overlapping launch/burst pairs, then a continuous fountain envelope.
    while(cues<8&&time>=(cues<4?cues*.12:1.2+(cues-4)*.12)){audio.cue(cues<4?'launch':'burst',event);cues++;}
    if(time>3&&time<6)audio.fountains([{id:0,intensity:Math.max(0,Math.min(1,(6-time)/1.2))}]);if(time>=6)audio.fountains([{id:0,intensity:0}]);
    const state=audio.snapshot();peaks.push({time,rms:state.rms,peak:state.peak,voices:state.voices});
    $('audio-metrics').textContent=JSON.stringify({state:state.state,volume:.35,time,peak:Math.max(...peaks.map(p=>p.peak)),maxRms:Math.max(...peaks.map(p=>p.rms)),maxVoices:Math.max(...peaks.map(p=>p.voices)),rms:state.rms,physicalOutput:'Not verified by this digital loopback'},null,2);
    if(time<7)requestAnimationFrame(step);else{record.stop();audio.destroy();$('audio').disabled=false;}
  };requestAnimationFrame(step);
};

$('balanced-ground').onclick=async()=>{cancelled=false;results.length=0;await measure('ground','balanced',false);$('state').textContent='Steady Balanced ground measurement complete';};
