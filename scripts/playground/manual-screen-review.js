// Development only: bounded streaming encoder for screenshots of the actual UI.
// Source timestamps are preserved; no recreated fireworks or invented interactions.
const $=id=>document.getElementById(id);
$('start').onclick=async()=>{
  $('start').disabled=true;
  try{
    const kind=new URLSearchParams(location.search).get('capture');
    const directory=kind==='aerial-batch'?'/artifacts/aerial-batch-recording/':kind==='depth'?'/artifacts/depth-recording/':kind==='depth-mixed'?'/artifacts/depth-mixed-recording/':'/artifacts/manual-shell-recording/',frames=await(await fetch(directory+'frames.json')).json();
    const load=async f=>createImageBitmap(await(await fetch(directory+f.file)).blob());
    let bitmap=await load(frames[0]);const canvas=$('output');canvas.width=bitmap.width;canvas.height=bitmap.height;
    const ctx=canvas.getContext('2d'),stream=canvas.captureStream(0),chunks=[],recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:2500000});
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
    recorder.onstop=()=>{stream.getTracks().forEach(t=>t.stop());const blob=new Blob(chunks,{type:'video/webm'}),reader=new FileReader();reader.onload=()=>{$('recording-data').value=reader.result;};reader.readAsDataURL(blob);$('result').src=URL.createObjectURL(blob);$('result').hidden=false;$('download').href=$('result').src;$('download').download='three-cakes-manual-shell.webm';$('download').hidden=false;$('state').textContent='Ready · actual UI capture, original timing · silent video; separate synthesized audio sample';$('start').disabled=false;};
    ctx.drawImage(bitmap,0,0);recorder.start();const start=performance.now();
    for(let i=0;i<frames.length;i++){
      const next=i+1<frames.length?load(frames[i+1]):null;
      const delay=frames[i].time-frames[0].time-(performance.now()-start);if(delay>0)await new Promise(resolve=>setTimeout(resolve,delay));
      ctx.drawImage(bitmap,0,0);await new Promise(requestAnimationFrame);stream.getVideoTracks()[0].requestFrame();bitmap.close();
      $('state').textContent=`Encoding ${i+1} / ${frames.length}`;if(next)bitmap=await next;
    }
    await new Promise(resolve=>setTimeout(resolve,200));recorder.stop();
  }catch(error){$('state').textContent=error.message;$('start').disabled=false;}
};
