"""Summarize saved public research; never approves imports or guesses brands."""
import csv,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
AUDIT=ROOT/'docs/catalog/enrichment-2026-09'
rows=list(csv.DictReader((ROOT/'docs/catalog/2026-08-square/pending-products.csv').open(encoding='utf-8-sig')))
results=[]
for file in sorted((ROOT/'artifacts/catalog-experience').glob('research-batch-*.json')):results+=json.loads(file.read_text())
lookup={r['square_token']:batch for batch in results for r in batch.get('rows',[])}
winco={r['square_token']:r for r in json.loads((AUDIT/'winco-upc-candidates.json').read_text())['matches']}
index_path=AUDIT/'research-index.json'
index=json.loads(index_path.read_text()) if index_path.exists() else {}
for r in rows:
    batch=lookup.get(r['square_token'])
    if not batch: continue
    code=r['gtin'] or r['square_sku']; sources=[]
    for block in re.split(r'-{20,}',batch['result']):
        if code and code in block:
            match=re.search(r'^([^\n]+?) \((https?://[^\s]+)\)',block.strip(),re.M)
            if match and any(word in (match[1]+match[2]).lower() for word in ['firework','pyro','pyrotech']):
                sources.append(dict(title=match[1],url=match[2]))
    query=next((q['q'] for rr,q in zip(batch['rows'],batch['queries']) if rr['square_token']==r['square_token']), '')
    index[r['square_token']]={'query':query,'sources':sources}
missing=[r['square_token'] for r in rows if r['square_token'] not in index and r['square_token'] not in winco]
if missing: raise SystemExit(f'Missing research inputs for {len(missing)} rows; existing reports were not overwritten.')
# Compact, versioned evidence index: re-running does not depend on ignored caches.
index_path.write_text(json.dumps(index,indent=2,ensure_ascii=False)+'\n')
reviewed={str(row):p for p in json.loads((AUDIT/'reviewed-products.json').read_text()) for row in p['squareRows']}
manual={p['csv_row']:p for p in json.loads((AUDIT/'pending-reviews.json').read_text())}
continuation_path=ROOT/'docs/catalog/continuation-2026-09-24/row-decisions.json'
continuation={p['csv_row']:p for p in json.loads(continuation_path.read_text())} if continuation_path.exists() else {}
ledger=[]
for r in rows:
    research=index.get(r['square_token']);sources=list(research['sources']) if research else []
    if r['square_token'] in winco:sources.insert(0,dict(title='Winco UPC reference 2022',url='https://www.wincofireworks.com/wp-content/uploads/2022/03/UPC-Excel-List_3.25.2022_r2.pdf'))
    approval=reviewed.get(r['csv_row'])
    review=manual.get(r['csv_row'])
    status='incorporated' if approval else 'candidate_requires_package_review' if sources else 'no_verified_identity'
    reason='Exact identity, package, photograph and video reviewed.' if approval else 'Code found in public source; package/brand/image and any conflicts still need individual verification.' if sources else 'No verified product identity from the searched code/name. Generic names and store SKUs are insufficient to assign a photo.'
    urls=approval['sources'] if approval else review['sources'] if review else [s['url'] for s in sources]
    item={**r,'research_status':review['status'] if review and not approval else status,'product_id':approval['id'] if approval else '', 'verified_brand':approval['brand'] or 'Unknown' if approval else review['verified_brand'] if review else 'Unknown', 'manufacturer_code':approval.get('manufacturerCode','Unknown') if approval else review['manufacturer_code'] if review else 'Unknown', 'verified_video':approval.get('previewVideo') or '' if approval else review.get('verified_video','') if review else '', 'research_query':research['query'] if research else 'Compared code against official Winco UPC reference', 'research_sources':' | '.join(urls),'research_reason':approval['evidence'] if approval else review['reason'] if review else reason,'required_next_step':'' if approval else review['required_next_step'] if review else 'Verify manufacturer/model and exact retail package; inspect and acquire its authentic photo. Video is optional.'}
    decision=continuation.get(r['csv_row'])
    if decision:
        assert decision['square_token']==r['square_token'], 'Continuation row identity changed'
        item['research_query']=' | '.join(decision['queries'])
        if not approval:
            assert decision['status'] not in ['incorporated','linked_existing'], 'Missing product approval for published audit row'
            item.update(research_status=decision['status'],product_id=decision['product_id'],verified_brand=decision['verified_brand'],manufacturer_code=decision['manufacturer_code'],research_sources=' | '.join(decision['sources']),research_reason=decision['reason'],required_next_step=decision['required_next_step'])
        elif decision['status']=='duplicate':
            item['research_status']='duplicate'
    ledger.append(item)
resolved={'incorporated','linked_existing','duplicate','excluded'}
for name,data in [('research-ledger.csv',ledger),('pending-products.csv',[r for r in ledger if r['research_status'] not in resolved]),('identified-missing-images.csv',[r for r in ledger if r['research_status']=='identified_missing_image']),('conflicts.csv',[r for r in ledger if r['research_status']=='data_conflict'])]:
    temporary=AUDIT/(name+'.tmp')
    with temporary.open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.DictWriter(f,fieldnames=ledger[0].keys(),quoting=csv.QUOTE_ALL);w.writeheader();w.writerows(data)
    temporary.replace(AUDIT/name)
from collections import Counter
summary=dict(original_pending_variant_rows=len(rows),researched_search_rows=len(index),winco_comparison_rows=len(winco),statuses=dict(Counter(r['research_status'] for r in ledger)),published_new_products=len(set(r['product_id'] for r in ledger if r['product_id'])))
(AUDIT/'research-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps(summary,indent=2))
