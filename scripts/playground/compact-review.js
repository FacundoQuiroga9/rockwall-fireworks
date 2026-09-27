// Development review of the exact compact document; browser evidence is not native evidence.
import profiles from '../../src/data/playgroundProfiles.json';
import bases from '../../src/data/playgroundBases.json';
import { buildPlaygroundDocument } from '../../src/shared/playgroundDocument.js';
const params=new URLSearchParams(location.search),shells=params.get('scene')==='aerial';
const selected=shells?profiles.profiles.filter(p=>['ghostacular-24-pack','bump-bear','band-of-brothers','golden-peacock'].includes(p.productId)):profiles.profiles.filter(p=>p.kind.startsWith('fountain')).slice(0,4);
document.querySelector('iframe').srcdoc=buildPlaygroundDocument({profiles:selected,scene:shells?'aerial':'ground',skyline:location.origin+'/images/hero/dallas-skyline-2160.webp',compact:true,reducedMotion:true,bases:Object.fromEntries(Object.entries(bases).map(([id,b])=>[id,{...b,src:location.origin+b.src}]))});
