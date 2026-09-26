import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyCommercialCorrections, run } from '../scripts/catalog/sync.mjs';
import { addProduct, assessList, emptyList, reviewGroup } from '../src/shared/myList.js';
const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url)));
const corrections=read('../docs/catalog/playground-scenes-2026-09/owner-cake-corrections.json');
const before=read('../docs/catalog/playground-scenes-2026-09/catalog-before.json');
const products=read('../src/data/products.json'),promotions=read('../src/data/promotions.json');
test('exact owner-confirmed cakes survive sync and reject changed variants',()=>{
  assert.equal(run({check:true}).result,'PASS');
  for(const c of corrections){
    const p=products.find(p=>p.id===c.id),old=before.find(p=>p.id===c.id);
    assert.equal(p.category,'500g Cakes');assert.deepEqual(p.cakeClass,{status:'confirmed',grams:500});
    for(const key of ['id','slug','image','brand','presentation','storeCodes','bogo'])assert.deepEqual(p[key],old[key],key);
    assert.equal(c.provenance.kind,'owner-confirmation');
    assert.deepEqual(applyCommercialCorrections([old],[c]),[p]);
    for(const mismatch of [{brand:'Another brand'},{presentation:'Another package'},{storeCodes:[]}])assert.throws(()=>applyCommercialCorrections([{...old,...mismatch}],[c]),/Commercial.*changed/);
  }
  const old=products.find(p=>p.id==='old-ironsides');assert.equal(old.category,'Cakes - Size Unconfirmed');assert.equal(old.cakeClass.grams,null);
  assert.deepEqual(old.bogo,before.find(p=>p.id===old.id).bogo);
});
test('reclassified saved picks retain quantities and require existing review without new benefits',()=>{
  for(const c of corrections){
    const old=before.find(p=>p.id===c.id),saved=addProduct(emptyList(),old,3);
    const assessed=assessList(saved,products,promotions,'2026-09-26');
    assert.equal(assessed.total,3);assert.equal(assessed.pending,3);assert.equal(assessed.free,0);
    assert.equal(saved.groups[0].items[0].snapshot.category,'Cakes - Size Unconfirmed');
    const reviewed=reviewGroup(saved,saved.groups[0].id,products,promotions);
    assert.equal(reviewed.groups[0].items[0].quantity,3);assert.equal(reviewed.groups[0].items[0].snapshot.category,'500g Cakes');
    assert.equal(assessList(reviewed,products,promotions,'2026-09-26').free,0);
  }
});
