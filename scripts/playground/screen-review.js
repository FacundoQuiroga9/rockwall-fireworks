// Development-only encoding of a continuous capture of the actual public UI.
// The source frames are local, ignored artifacts, never synthetic stage renders.
const $=id=>document.getElementById(id);
$('start').onclick=async()=>{
  $('start').disabled=true;
  try {
    const frames=await (await fetch('/artifacts/scene-recording/frames.json')).json();
    const images=await Promise.all(frames.map(async f=>createImageBitmap(await (await fetch(`/artifacts/scene-recording/${f.file}`)).blob())));
    const canvas=$('output');canvas.width=images[0].width;canvas.height=images[0].height;
    const context=canvas.getContext('2d'),chunks=[],stream=canvas.captureStream(30);
    const recorder=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9',videoBitsPerSecond:2400000});
    recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
    recorder.onstop=()=>{
      stream.getTracks().forEach(t=>t.stop());
      const blob=new Blob(chunks,{type:'video/webm'}),reader=new FileReader();
      reader.onload=()=>{$('recording-data').value=reader.result;};reader.readAsDataURL(blob);
      $('result').src=URL.createObjectURL(blob);$('result').hidden=false;$('download').href=$('result').src;$('download').download='automatic-scene-switch.webm';$('download').hidden=false;
      $('state').textContent='Recording ready · continuous UI capture, original timestamps';$('start').disabled=false;
    };
    context.drawImage(images[0],0,0);recorder.start();const start=performance.now();
    for(let i=0;i<frames.length;i++){
      const delay=frames[i].time-frames[0].time-(performance.now()-start);
      if(delay>0)await new Promise(resolve=>setTimeout(resolve,delay));
      context.drawImage(images[i],0,0);
      await new Promise(requestAnimationFrame);
      stream.getVideoTracks()[0].requestFrame();
      await new Promise(requestAnimationFrame);
      images[i].close();
      $('state').textContent=`Encoding ${i+1} / ${frames.length} · ${((performance.now()-start)/1000).toFixed(1)} s`;
    }
    await new Promise(resolve=>setTimeout(resolve,170));recorder.stop();
  }catch(error){$('state').textContent=error.message;$('start').disabled=false;}
};
$('review-end').onclick=()=>{
  const video=$('result');video.pause();
  video.currentTime=Math.max(0,video.duration-.1);
  video.scrollIntoView({block:'center'});
};
