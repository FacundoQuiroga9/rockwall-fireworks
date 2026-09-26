import profiles from '../../src/data/playgroundProfiles.json';
import bases from '../../src/data/playgroundBases.json';
import { buildPlaygroundDocument } from '../../src/shared/playgroundDocument.js';
document.querySelector('iframe').srcdoc=buildPlaygroundDocument({profiles:profiles.profiles.filter(p=>p.kind.startsWith('fountain')),scene:'ground',skyline:'',compact:true,reducedMotion:true,bases:Object.fromEntries(Object.entries(bases).map(([id,b])=>[id,{...b,src:location.origin+b.src}]))});
