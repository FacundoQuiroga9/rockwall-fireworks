import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyManualCorrections, applyVideoCorrections, applyCommercialCorrections } from '../scripts/catalog/sync.mjs';
import { filterCatalog, getCatalogBrands } from '../src/utils/productData.js';
import { addProduct, addPromotion, assessList, canPair, dissolveGroup, emptyList, getBogoState, isBogoIdentified, parseList, promotionIsSelectable, promotionProgress, removeGroup, reviewGroup, setBogoPartner, setPromotionItem, startBogo } from '../src/shared/myList.js';
import { createListPdf } from '../src/shared/listPdf.js';
const read = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const products = read('../src/data/products.json');
const offers = read('../src/data/promotions.json');
const old = read('../docs/catalog/iteration-2026-09-25/baseline.json').products;
const get = id => products.find(p => p.id === id);
const bogo = offers.find(p => p.id === 'bogo-store');
const today = '2026-09-25';

test('regression: real pending BOGO inventory yields eight results without enabling any current benefit', () => {
  const marked = filterCatalog(products, {bogoOnly:true, offers, today});
  const evidence = read('../docs/catalog/my-list-2026-09/bogo-evidence.json').publishedProducts;
  assert.equal(marked.length, 8);
  assert.deepEqual(marked.map(p => p.id).sort(), evidence.map(p => p.id).sort());
  assert.ok(marked.every(p => isBogoIdentified(p) && !getBogoState(p, offers, today).active));
  assert.equal(filterCatalog(products, {bogoOnly:true, offers:[]}).length, 8);
  for (const product of [{name:'BOGO test',category:'Firecrackers'}, {...marked[0], bogo:{...marked[0].bogo,sourceTokens:[]}}]) assert.equal(isBogoIdentified(product),false);
});
test('real BOGO results combine brand, category, query and favorites and fully reset', () => {
  const opts={bogoOnly:true,offers,today};
  assert.equal(filterCatalog(products,{...opts,brand:'Black Cat'}).length,5);
  assert.equal(filterCatalog(products,{...opts,category:'Firecrackers'}).length,5);
  assert.deepEqual(filterCatalog(products,{...opts,brand:'Black Cat',category:'Firecrackers',query:'200'}).map(p=>p.id),['black-cat-200-pack']);
  assert.deepEqual(filterCatalog(products,{...opts,brand:'Black Cat',category:'Firecrackers',query:'200',favorites:['black-cat-50-pack']}).map(p=>p.id),[]);
  assert.equal(filterCatalog(products,{...opts,category:'500g Cakes'}).length,0);
  assert.equal(filterCatalog(products,{bogoOnly:false}).length,302);
});
test('real cross-brand BOGO pairs preserve explicit units with no invented free assignment', () => {
  const a=get('black-cat-200-pack'),b=get('m-5000-world-class-12-pack');
  assert.equal(canPair(a,b,bogo),true);
  assert.equal(canPair(a,get('freedoms-wings'),bogo),false);
  assert.equal(canPair(a,get('m-5000-cutting-edge-12-pack'),bogo),false);
  let list=addProduct(emptyList(),a,3);list=startBogo(list,list.groups[0].id,products,bogo);
  assert.equal(assessList(list,products,offers,today).total,3);
  const group=list.groups.find(g=>g.kind==='bogo');list=setBogoPartner(list,group.id,b,products,bogo);
  const restored=parseList(JSON.stringify(list)); const result=assessList(restored,products,offers,today);
  assert.deepEqual([result.total,result.free,result.pending,result.priceTotal],[4,0,2,null]);
  assert.equal(result.groups.find(g=>g.kind==='bogo').items[0].paid,null);
  assert.equal(assessList(dissolveGroup(restored,group.id),products,offers,today).total,4);
});
test('Boomer is suppressed in the master without deleting its product or conflating Boom Wow', () => {
  const corrected=applyManualCorrections(old,read('../docs/catalog/manual-corrections.json'));
  assert.equal(corrected.find(p=>p.id==='poopy-puppy').brand,'');
  assert.equal(corrected.length,old.length);assert.equal(getCatalogBrands(corrected).includes('Boomer'),false);
  assert.equal(corrected.filter(p=>p.brand==='Boom Wow').length,old.filter(p=>p.brand==='Boom Wow').length);
  assert.equal(get('super-magnum-12-pack').brand,'World-Class');assert.equal(get('silent-treatment').brand,'Fox');
});
test('Captain Sam classification persists and saved selections require explicit review', () => {
  const updated=applyCommercialCorrections(old,read('../docs/catalog/iteration-2026-09-25/cake-corrections.json'));
  assert.equal(updated.find(p=>p.id==='captain-sam').category,'200g Cakes');
  assert.equal(updated.find(p=>p.id==='mass-confusion').category,'Cakes - Size Unconfirmed');
  assert.equal(updated.find(p=>p.id==='mass-confusion').presentation,'45 shots');
  for(const id of ['captain-sam','poopy-puppy','mass-confusion']) {
    let list=addProduct(emptyList(),old.find(p=>p.id===id),2);const gid=list.groups[0].id;
    const result=assessList(list,products,offers,today);assert.equal(result.pending,2);assert.equal(result.groups[0].items[0].changed,true);
    assert.equal(list.groups[0].items[0].snapshot.category,old.find(p=>p.id===id).category);
    list=reviewGroup(list,gid,products,offers);assert.equal(assessList(list,products,offers,today).pending,0);assert.equal(list.groups[0].items[0].quantity,2);
  }
});
test('2026 flyer offers retain explicit expiry and incomplete identities cannot become selectable by changing dates', () => {
  const archived=offers.filter(p=>p.campaign==='independence-day-2026');assert.equal(archived.length,6);
  for(const offer of archived) {
    assert.equal(promotionIsSelectable(offer,today),false);
    assert.equal(promotionIsSelectable({...offer,status:'confirmed',validityConfirmed:true,validThrough:'2026-12-31'},today),false);
    assert.equal(addPromotion(emptyList(),offer,products,[],today).groups.length,0);
    assert.ok(offer.sourceDocument.sha256);assert.ok(offer.sourceDocument.page);
    for(const id of offer.illustratedIds||[]) assert.ok(get(id),id);
  }
  assert.equal(archived.filter(p=>p.validThrough==='2026-07-04').length,3);
  assert.ok(archived.every(p=>p.eligibilityConfirmed===false));
});
test('choice and fixed promotion selection counts, editing, restoring and removal never duplicate units', () => {
  const [a,b]=products;const offer={id:'test-choice',revision:'1',name:'TEST ONLY',kind:'choice',status:'confirmed',validityConfirmed:true,validFrom:'2026-09-01',validThrough:'2026-09-30',eligibilityConfirmed:true,requiredQuantity:3,eligibleIds:[a.id,b.id],limitsConfirmed:true,stackingConfirmed:true,conditions:[]};
  let list=addPromotion(emptyList(),offer,products,[{productId:a.id,quantity:1}],today);const gid=list.groups[0].id;
  assert.deepEqual(promotionProgress(offer,list.groups[0].items),{selected:1,remaining:2,excess:0});
  assert.equal(assessList(list,products,[offer],today).groups[0].state,'incomplete');
  list=setPromotionItem(list,gid,1,b,2,offer,today);list=parseList(JSON.stringify(list));
  assert.deepEqual(promotionProgress(offer,list.groups[0].items),{selected:3,remaining:0,excess:0});
  assert.equal(assessList(list,products,[offer],today).groups[0].state,'complete');
  assert.equal(assessList(list,products,[{...offer,revision:'2'}],today).pending,3);
  assert.equal(assessList(list,products,[offer],'2026-10-01').pending,3);
  assert.deepEqual(startBogo(list,gid,products,bogo),list);
  assert.equal(assessList(dissolveGroup(list,gid),products,offers,today).total,3);
  assert.equal(removeGroup(list,gid).groups.length,0);
  const fixed={...offer,id:'test-fixed',kind:'fixed',components:[{productId:a.id,quantity:1},{productId:b.id,quantity:2}]};
  assert.deepEqual(addPromotion(emptyList(),fixed,products,[],today).groups[0].items.map(({productId,quantity})=>({productId,quantity})),fixed.components);
  assert.equal(promotionIsSelectable({...fixed,components:[{productId:a.id,quantity:2}]},today),false);
});
test('PDF keeps names, brands, category, units and conditions but no stock codes or descriptions', () => {
  const product={...get('party-sparklers-display'),name:'PDF NAME',description:'PRIVATE_DESCRIPTION',manufacturerCode:'PRIVATE_MODEL',storeCodes:[{token:'PRIVATE_TOKEN',sku:'PRIVATE_SKU',gtin:'PRIVATE_GTIN'}]};
  const list=addProduct(emptyList(),product,2);const assessment=assessList(list,[product],[],today);
  const pdf=Buffer.from(createListPdf(assessment,{generatedAt:'2026-09-25T12:00:00Z'})).toString('ascii');
  for(const value of ['PRIVATE_DESCRIPTION','PRIVATE_MODEL','PRIVATE_TOKEN','PRIVATE_SKU','PRIVATE_GTIN','SKU']) assert.ok(!pdf.includes(value),value);
  for(const value of ['PDF NAME','Display of 20 packs','Winda','Sparklers','PAID','FREE','TOTAL']) assert.ok(pdf.includes(value),value);
  assert.ok(pdf.includes('1 0 0 1 36 '));assert.ok(!pdf.includes('/Subtype /Image'));
  assert.equal(list.groups[0].items[0].snapshot.storeCodes[0].sku,'PRIVATE_SKU');
});
test('approved video overlays survive stale imports and reject identity substitution', () => {
  const reviews=read('../docs/catalog/iteration-2026-09-25/video-research.json');
  const corrected=applyVideoCorrections(products.map(p=>({...p,previewVideo:''})),reviews);
  for(const r of reviews) assert.equal(corrected.find(p=>p.id===r.id).previewVideo,r.previewVideo);
  assert.throws(()=>applyVideoCorrections(products,[{...reviews[0],brand:'Wrong brand'}]),/Video identity/);
  assert.deepEqual(products.map(p=>p.id),old.map(p=>p.id));
});
