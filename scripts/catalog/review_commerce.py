"""Build reviewable commercial evidence from already approved identity links.

Does not read/write the external Square originals or infer eligibility from names.
Run deliberately when the approved ledger changes, then review the resulting JSON.
"""
import csv
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DOC = ROOT / 'docs/catalog'
OUT = DOC / 'my-list-2026-09'
read = lambda path: json.loads(path.read_text())


def write(path, value):
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False) + '\n')


def main():
    products = read(ROOT / 'src/data/products.json')
    baseline = read(OUT / 'baseline.json')['products']
    rows = list(csv.DictReader((DOC / '2026-08-square/inventory-master.csv').open(encoding='utf-8-sig')))
    byrow = {int(r['csv_row']): r for r in rows}
    bytoken = {r['square_token']: r for r in rows}
    links = {}
    for review in read(DOC / '2026-08-square/existing-links.json') + read(DOC / '2026-08-square/reviewed-matches.json'):
        links.setdefault(review['id'], []).append(bytoken[review['squareToken']])
    for review in read(DOC / 'enrichment-2026-09/reviewed-products.json'):
        links.setdefault(review['id'], []).extend(byrow[n] for n in review['squareRows'])
    evidence, cakes, bogo = [], [], []
    for product in products:
        old = next(p for p in baseline if p['id'] == product['id'])
        linked = list({r['square_token']: r for r in links.get(product['id'], [])}.values())
        fields = {}
        sources = [{k: r[k] for k in ['square_token', 'square_sku', 'gtin', 'original_name', 'original_variation', 'square_category', 'csv_row', 'xlsx_sheet', 'xlsx_row']} for r in linked]
        if linked:
            fields['storeCodes'] = [{'token': r['square_token'], 'sku': r['square_sku'], 'gtin': r['gtin'], 'sourceRow': int(r['csv_row'])} for r in linked]
        # Classify only product gram values or the explicit commercial category.
        if old['category'] == 'Cakes':
            text = ' '.join([old.get('presentation', '')] + [r['original_name'] + ' ' + r['square_category'] for r in linked])
            grams = sorted(set(re.findall(r'\b(200|250|350|500)\s*(?:grams?|g)\b', text, re.I)))
            fixed = bool(re.search(r'\b(?:[346]-cake|[46] cakes)\b', old.get('presentation', '')))
            conflict = product['id'] == 'old-ironsides'
            if fixed:
                category, reason = 'Cake Packs', 'Verified complete retail pack; not a single cake. Gram class per component not established.'
                fields['saleUnit'] = 'pack'
            elif len(grams) == 1 and not conflict:
                category, reason = grams[0] + 'g Cakes', 'Explicit gram class in approved presentation or linked Square name/category, not shipping weight.'
            else:
                category = 'Cakes - Size Unconfirmed'
                reason = 'Conflicting gram classifications in prior evidence.' if conflict else 'No explicit verified gram class for this exact identity.'
            fields['category'] = category
            fields['cakeClass'] = {'status': 'confirmed' if category.endswith('g Cakes') else 'unconfirmed', 'grams': int(grams[0]) if category.endswith('g Cakes') else None}
            cakes.append({'id': product['id'], 'name': product['name'], 'category': category, 'reason': reason, 'approvedPresentation': old.get('presentation'), 'sources': sources})
        marked = [r for r in linked if re.search(r'(?<![A-Za-z])BOGO(?![A-Za-z])', r['original_name'] + ' ' + r['original_variation'], re.I)]
        if marked:
            fields['bogo'] = {'eligibilityStatus': 'pending', 'evidenceStatus': 'source-marked', 'promotionId': 'bogo-store', 'group': fields.get('category', product['category']), 'sourceTokens': [r['square_token'] for r in marked]}
            bogo.append({'id': product['id'], 'name': product['name'], 'category': fields['bogo']['group'], 'sources': sources, 'currentValidity': 'awaiting-store-confirmation'})
        if fields:
            evidence.append({'id': product['id'], 'name': product['name'], 'image': product['image'], 'fields': fields, 'sources': sources})
    write(OUT / 'commercial-review.json', evidence)
    write(OUT / 'cake-classification.json', cakes)
    write(OUT / 'bogo-evidence.json', {'sourceMarkedRows': [r for r in rows if re.search(r'(?<![A-Za-z])BOGO(?![A-Za-z])', r['original_name'] + ' ' + r['original_variation'], re.I)], 'publishedProducts': bogo})
    print(json.dumps({'publishedBogo': len(bogo), 'cakes': Counter(x['category'] for x in cakes)}, indent=2))


if __name__ == '__main__':
    main()
