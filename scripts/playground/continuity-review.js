// Development-only real-time review. Not imported by the app or production build.
import data from '../../src/data/playgroundProfiles.json';
import bases from '../../src/data/playgroundBases.json';
import { createPlaygroundRenderer } from '../../src/shared/playgroundRenderer.js';
import { createFountainModel } from '../../src/shared/playgroundFountain.js';
const $ = (id) => document.getElementById(id);
const output = $('output'), ctx = output.getContext('2d');
let renderer, raf, record, stream, lastDraw = 0, elapsed = 0, previous = 0, paused = false, report, run;
const fairies = data.profiles.find((p) => p.productId === 'fairies-in-a-jar');
function finish() {
  cancelAnimationFrame(raf); previous = 0;
  if (record?.state === 'recording') record.stop();
  if (report?.frames) {
    const sorted = report.costs.sort((a,b) => a-b);
    const metrics = { mode:run.mode, compact:run.compact, quality:run.compact?'balanced':'high', frames:report.frames, elapsedSeconds:+elapsed.toFixed(2), fps:+(report.frames/elapsed).toFixed(1), meanDrawMs:+(report.total/report.frames).toFixed(3), p95DrawMs:sorted[Math.floor(sorted.length*.95)], maxDrawMs:report.max, maxParticles:report.particles, canvas:'1280 × 640 CSS px', dpr:devicePixelRatio, userAgent:navigator.userAgent, concurrency:navigator.hardwareConcurrency };
    $('metrics').textContent = JSON.stringify(metrics,null,2);
    $('data').href=URL.createObjectURL(new Blob([JSON.stringify(metrics,null,2)],{type:'application/json'}));$('data').download=`performance-${run.mode}-${run.compact?'compact':'high'}.json`;$('data').hidden=false;
  }
  $('state').textContent = run.mode === 'record' ? 'Complete · renderer has no live particles' : 'Measurement complete';
}
function step(now) {
  if (paused) {previous=0;raf=requestAnimationFrame(step);return;}
  if(previous)elapsed+=(now-previous)/1000;previous=now;
  if (run.compact && now-lastDraw < 1000/30-1 && elapsed<run.duration) {raf=requestAnimationFrame(step);return;}
  lastDraw=now;
  const time = run.mode==='record' ? elapsed < 8 ? 16+elapsed : 57+elapsed-8 : run.mode==='dense' ? elapsed : 15+elapsed;
  const before=performance.now(), count=renderer.draw(time,[0,1,2,3].slice(0,run.profiles.length)), cost=performance.now()-before;
  report.frames++;report.total+=cost;report.max=Math.max(report.max,cost);report.particles=Math.max(report.particles,count);report.costs.push(cost);
  ctx.fillStyle='#050b14';ctx.fillRect(0,0,1280,710);
  ctx.fillStyle='#1e2625';ctx.fillRect(0,70+640*.84,1280,640*.16);
  ctx.drawImage($('sky'),0,70,1280,640);
  ctx.fillStyle='#ffcd88';ctx.font='22px system-ui';ctx.fillText(run.mode==='record'?'Fairies in a Jar · continuous emission + natural exhaustion':run.mode==='dense'?'Four dense aerial products · stress fixture':'Four fountains · stress fixture',24,30);
  ctx.fillStyle='#c2cbda';ctx.font='17px system-ui';ctx.fillText(`${run.mode==='record'?(elapsed<8?'Segment 1 · stage transition':'Segment 2 · exhaustion, then last embers'):'Production renderer'} · Profile time ${time.toFixed(2)} s · ${count} drawn particles`,24,56);
  if(record?.state==='recording')stream.getVideoTracks()[0].requestFrame();
  $('state').textContent=`Playing · ${elapsed.toFixed(1)} s`;
  if (elapsed >= run.duration) finish(); else raf=requestAnimationFrame(step);
}
async function start(mode,compact=false) {
  if(record?.state==='recording')return;
  cancelAnimationFrame(raf);renderer?.destroy();elapsed=0;previous=0;lastDraw=0;paused=false;
  let profiles=[fairies];
  if(mode==='dense')profiles=Array.from({length:4},(_,i)=>({...data.profiles[1],productId:`stress-${i}`,events:data.profiles[1].events.map(e=>({...e,launch:0,burst:1}))}));
  if(mode==='ground')profiles=[fairies,...data.profiles.filter(p=>p.kind==='fountain-sample'),{...fairies,productId:'fairies-copy'}];
  renderer=createPlaygroundRenderer($('sky'),profiles,compact,createFountainModel,{...bases,'fairies-copy':bases[fairies.productId]});
  run={mode,compact,profiles,duration:mode==='record'?27:10};report={frames:0,total:0,max:0,particles:0,costs:[]};
  await Promise.all(Object.values(bases).map(base=>new Promise(resolve=>{const image=new Image();image.onload=resolve;image.onerror=resolve;image.src=base.src;})));
  await new Promise(requestAnimationFrame);
  if(mode==='record'){
    const chunks=[];stream=output.captureStream(0);record=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:2200000});
    record.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
    record.onstop=async()=>{const blob=new Blob(chunks,{type:'video/webm'});stream.getTracks().forEach(t=>t.stop());const reader=new FileReader();reader.onload=()=>{$('recording-data').value=reader.result;};reader.readAsDataURL(blob);$('result').src=URL.createObjectURL(blob);$('result').hidden=false;$('download').href=$('result').src;$('download').download='fountain-transition-and-exhaustion.webm';$('download').hidden=false;$('state').textContent='Recording ready · transition and full exhaustion';};record.start();
  }
  raf=requestAnimationFrame(step);
}
$('record').onclick=()=>start('record');$('dense').onclick=()=>start('dense');$('ground').onclick=()=>start('ground');$('compact').onclick=()=>start('ground',true);
$('pause').onclick=()=>{paused=!paused;};$('reset').onclick=()=>{finish();renderer?.destroy();};
