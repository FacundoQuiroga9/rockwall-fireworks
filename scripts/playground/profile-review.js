// Development only: compare the production document against timestamped references.
import data from '../../src/data/playgroundProfiles.json';
import bases from '../../src/data/playgroundBases.json';
import { buildPlaygroundDocument } from '../../src/shared/playgroundDocument.js';
const select=document.getElementById('profile'),frame=document.querySelector('iframe');
for(const p of data.profiles){const option=document.createElement('option');option.value=p.productId;option.textContent=p.name;select.append(option);}
function show(){
  const profile=data.profiles.find(p=>p.productId===select.value);
  frame.contentWindow?.postMessage({type:'rockwall-destroy'},'*');
  document.getElementById('scope').textContent=`${profile.sampleLabel} · ${profile.source.url} · source ${profile.source.segmentStart}–${profile.source.segmentEnd} seconds. Compare shape, palette, rhythm and fade; physical scale is illustrative.`;
  frame.srcdoc=buildPlaygroundDocument({profiles:[profile],scene:profile.scene,skyline:location.origin+'/images/hero/dallas-skyline-2160.webp',bases:Object.fromEntries(Object.entries(bases).map(([id,b])=>[id,{...b,src:location.origin+b.src}]))});
}
select.onchange=show;select.value='arms-depot-16-pack';show();
