#!/usr/bin/env python3
"""Read-only reconciliation of Square exports; writes audit CSVs, never guesses matches.

Run from the web repository. Only reviewed-matches.json authorizes asset imports.
CSV identifiers are strings; when opening in Excel, import these columns as Text.
"""
import argparse
import csv
import hashlib
import json
import re
import unicodedata
import zipfile
from collections import Counter
from decimal import Decimal, InvalidOperation
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs/catalog/2026-08-square'
NS = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
UNKNOWN = 'Unknown'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def xlsx_sheets(path):
    with zipfile.ZipFile(path) as z:
        strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            strings = [''.join(t.text or '' for t in n.findall('.//s:t', NS))
                       for n in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('s:si', NS)]
        links = {n.attrib['Id']: n.attrib['Target'] for n in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
        result = {}
        for sheet in ET.fromstring(z.read('xl/workbook.xml')).findall('s:sheets/s:sheet', NS):
            rid = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
            target = links[rid]
            member = target.lstrip('/') if target.startswith('/') else 'xl/' + target
            rows = []
            for row in ET.fromstring(z.read(member)).findall('s:sheetData/s:row', NS):
                cells = {}
                for cell in row.findall('s:c', NS):
                    value = cell.findtext('s:v', '', NS)
                    if cell.attrib.get('t') == 's' and value:
                        value = strings[int(value)]
                    elif cell.attrib.get('t') == 'inlineStr':
                        value = ''.join(t.text or '' for t in cell.findall('.//s:t', NS))
                    letters = re.match(r'[A-Z]+', cell.attrib['r']).group()
                    col = 0
                    for letter in letters:
                        col = col * 26 + ord(letter) - 64
                    cells[col - 1] = value
                rows.append((int(row.attrib['r']), cells))
            result[sheet.attrib['name']] = rows
        return result


def clean(value):
    return re.sub(r'\s+', ' ', value).strip()


def key(value):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', value).lower())


def write_csv(name, rows, fields=None):
    fields = fields or list(rows[0])
    with (OUT / name).open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields, quoting=csv.QUOTE_ALL)
        writer.writeheader()
        writer.writerows(rows)


def run(csv_path, xlsx_path, source):
    OUT.mkdir(parents=True, exist_ok=True)
    with csv_path.open(encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        reader.fieldnames  # Consume the header before recording physical lines.
        previous_line = reader.line_num
        rows, csv_lines = [], {}
        for row in reader:
            rows.append(row)
            csv_lines[row['Token']] = (previous_line + 1, reader.line_num)
            previous_line = reader.line_num
    sheets = xlsx_sheets(xlsx_path)
    item_rows = [(n, cells) for n, cells in sheets['Items'] if any(cells.values())]
    headers = item_rows[0][1]
    excel = {r['Token']: (n, r) for n, cells in item_rows[1:]
             for r in [{h: cells.get(c, '') for c, h in headers.items()}]}
    assert len(rows) == len({r['Token'] for r in rows}) == len(excel)
    assert set(excel) == {r['Token'] for r in rows}
    differences, formatting = [], []
    for n, row in enumerate(rows, 2):
        for field, value in row.items():
            other = excel[row['Token']][1][field]
            if value != other:
                numeric_equal = False
                if field == 'Price':
                    try:
                        numeric_equal = Decimal(value) == Decimal(other)
                    except InvalidOperation:
                        pass
                entry = {'token': row['Token'], 'csvRow': n, 'field': field, 'csv': value, 'xlsx': other}
                (formatting if numeric_equal else differences).append(entry)
    # Never silently prefer one source when a substantive conflict appears.
    if differences:
        (OUT / 'unresolved-source-differences.json').write_text(json.dumps(differences, indent=2))
        raise ValueError('Substantive source differences require review before import')
    component_rows = [cells for _, cells in sheets['Component Inventory'] if any(cells.values())]
    assert len(component_rows) == 1, 'Review nonempty component inventory before continuing'
    reviewed = json.loads((OUT / 'reviewed-matches.json').read_text())
    approved = {p['squareToken']: p for p in reviewed}
    assert len(approved) == len(reviewed)
    candidates = []
    for file in ['products.json', 'gender-reveal.json']:
        for i, p in enumerate(json.loads((source / 'public' / file).read_text())):
            candidates.append(dict(p, sourceFile=file, sourceIndex=i))
    for p in reviewed:
        row = rows[p['squareCsvRow'] - 2]
        assert row['Token'] == p['squareToken'] and row['Item Name'] == p['squareName']
        candidate = next(c for c in candidates if c['sourceFile'] == p['sourceFile'] and c['sourceIndex'] == p['sourceIndex'])
        assert (candidate['name'], candidate['image'], candidate['brand']) == (p['sourceName'], p['sourceImage'], p['sourceBrand'])
        assert digest(source / 'public' / p['sourceImage'].lstrip('/')) == p['sourceImageSha256']

    # Existing approved Rockwall assets can establish identity independently of
    # Dynamite. These are NOT new imports and their IDs/assets remain untouched.
    existing_rows = {
        396: ('futurama-artillery', 'Raccoon', '12-piece pack', 'Approved Rockwall package says Futurama Artillery, Raccoon, 12 shells; Square specifies Futurama 12pcs.'),
        621: ('neon-beef', UNKNOWN, '5-inch shells · 24 pack', 'Approved Rockwall package says Neon Beef, 5 inch and 24; Square agrees.'),
        855: ('star-light', UNKNOWN, 'Assortment', 'Approved Rockwall Star Light assortment matches Square Starlight and Family Pack Assortments category.'),
        899: ('the-reaper', 'Raccoon', '500 gram', 'Approved Rockwall Raccoon The Reaper cake is marked 500 gram; Square agrees.'),
    }
    conflicts = {
        91: 'Item name describes automotive LED bulbs but Square category says Roman Candles; identity is corrupt, do not publish.',
        92: 'Automotive LED-bulb item name conflicts with roman-candle variation and category; identity requires correction.',
        738: 'Square name specifies 6 inch; Square category and photographed RDXplosion package specify 1.75 inch. Confirm whether length/caliber or a wrong variant before matching.',
        814: 'Square Skybolt specifies five sticks; Firehawk source photo shows a freestanding missile. Presentation does not agree.',
        215: 'Square Neon Diablo is a 6-pack; source is a 24-pack. A matching 6-pack image is needed.',
    }
    # Candidate aliases help review only; they NEVER authorize an import.
    aliases = {449: [76], 534: [59], 75: [45, 145], 359: [65], 36: [46],
               786: [46], 743: [18], 527: [], 360: [65]}
    generic_source_names = {'pop', 'redbox', 'evolution', '5inchshells', 'colorsmoke', 'canistershells'}
    skus = Counter(r['SKU'] for r in rows if r['SKU'])
    names = Counter(r['Item Name'] for r in rows)
    master, matches, pending, existing_links = [], [], [], []
    explicit_brands = ['Black Cat', 'Monkey Mania', 'Raccoon', 'Winda', 'Brothers', 'Firehawk', 'World Class', 'Boomer', 'T-Sky', 'Bright Star', 'Happy Family']
    for n, r in enumerate(rows, 2):
        a = approved.get(r['Token'])
        name = clean(r['Item Name'])
        # Keep uncertain abbreviations, specifications and promotional markers
        # in the audit name. Only reviewed display names receive editorial fixes.
        normalized = a['name'] if a else clean(re.sub(r'(?i)\bBOGO\b', '', name)).strip(' -')
        normalization_note = 'Reviewed commercial name; specifications retained separately' if a else ('Whitespace cleaned; historical BOGO marker removed from display name only' if re.search(r'(?i)\bBOGO\b', name) else 'Whitespace cleaned; uncertain abbreviations retained')
        brand = next((b for b in explicit_brands if b.lower() in name.lower()), UNKNOWN)
        presentation = a['presentation'] if a else (clean(r['Variation Name']) if r['Variation Name'] != 'Regular' else UNKNOWN)
        found = []
        target = key(name)
        for c in candidates:
            candidate_key = key(c['name'])
            if candidate_key in generic_source_names or len(candidate_key) < 6:
                continue
            if candidate_key in target or target in candidate_key:
                found.append(c)
        if n in aliases:
            found = [c for c in candidates if c['sourceFile'] == 'products.json' and c['sourceIndex'] in aliases[n]]
        status = 'probable' if found else 'no_match'
        evidence = 'Name identifies a candidate only; manufacturer and exact presentation have not been established.' if found else 'No sufficiently specific candidate identified in the two Dynamite catalog files.'
        needed = 'Manufacturer or UPC/model, exact package/variant and corresponding photo/video.'
        product_id = ''
        if n in conflicts:
            status, evidence = 'conflict', conflicts[n]
        if n in range(140, 146):
            status, evidence = 'conflict', 'Armed Forces generation/pack differs or is unspecified; source metadata says Raccoon but photographed branding says World Class. Do not conflate 2.0–6.0 or a three-pack.'
        if n in (325, 326):
            evidence = 'Two Square tokens have the same Diwali Dazzler name but different SKUs. Source cannot distinguish their presentations; do not merge.'
        if n in (437, 438, 439, 440):
            status, evidence = 'conflict', 'Handheld Snowcone source shows a multi-piece display; Square variants differ in color/SKU. Unit vs display-pack identity is not established.'
        if n in (357, 358, 360):
            evidence = 'Festival Balls variants have different named brands/box colors. Monkey Mania yellow-box assets do not establish identity of this variant.'
        if n == 527:
            evidence = 'Square Knight Rider 96 Shot Fiesta resembles approved Night Rider 96 Shot Monkey Mania, but brand/name difference remains unresolved; existing item preserved, no duplicate imported.'
        if a:
            status, evidence, needed = 'confirmed', a['evidence'], ''
            product_id, brand = a['id'], a['sourceBrand']
            found = [c for c in candidates if c['sourceFile'] == a['sourceFile'] and c['sourceIndex'] == a['sourceIndex']]
        elif n in existing_rows:
            product_id, brand, presentation, evidence = existing_rows[n]
            status, needed = 'existing_rockwall', ''
            existing_links.append({'squareToken': r['Token'], 'id': product_id, 'evidence': evidence})
        candidate_text = ' | '.join(f"{c['sourceFile']}[{c['sourceIndex']}] {c['name']} / {c.get('brand', UNKNOWN)} / {c['image']}" for c in found)
        record = {
            'square_token': r['Token'], 'square_sku': r['SKU'], 'gtin': r['GTIN'],
            'original_name': r['Item Name'], 'normalized_name': normalized, 'normalization_note': normalization_note,
            'brand': brand, 'square_category': r['Categories'] or UNKNOWN,
            'catalog_category': a['category'] if a else UNKNOWN,
            'original_variation': r['Variation Name'], 'presentation': presentation,
            'specifications_in_original_name': ' | '.join(m.group().strip() for m in re.finditer(r'(?i)\d+(?:\.\d+)?\s*(?:[\"″]|inch(?:es)?|shot[s]?|shell[s]?|break[s]?|gram[s]?|g\b|pack|pcs|pc\b|ct\b|sticks|minute[s]?)', name)) or UNKNOWN,
            'reference_handle': excel[r['Token']][1]['Reference Handle'],
            'csv_file': str(csv_path), 'csv_row': n,
            'csv_line_start': csv_lines[r['Token']][0], 'csv_line_end': csv_lines[r['Token']][1],
            'xlsx_file': str(xlsx_path),
            'xlsx_sheet': 'Items', 'xlsx_row': excel[r['Token']][0],
            'same_name_rows': names[r['Item Name']],
            'duplicate_sku_rows': skus[r['SKU']] if r['SKU'] else 0,
            'match_status': status, 'rockwall_product_id': product_id,
            'dynamite_candidates': candidate_text or UNKNOWN, 'evidence': evidence,
        }
        master.append(record)
        matches.append({k: record[k] for k in ['square_token', 'original_name', 'original_variation', 'match_status', 'rockwall_product_id', 'dynamite_candidates', 'evidence']})
        if not product_id:
            pending.append({**{k: record[k] for k in ['square_token', 'square_sku', 'gtin', 'original_name', 'normalized_name', 'brand', 'square_category', 'original_variation', 'presentation', 'specifications_in_original_name']},
                            'pending_group': status, 'reason': evidence, 'dynamite_candidates': candidate_text or UNKNOWN,
                            'missing_information_or_resources': needed, 'csv_row': n,
                            'csv_line_start': csv_lines[r['Token']][0], 'csv_line_end': csv_lines[r['Token']][1],
                            'xlsx_sheet': 'Items', 'xlsx_row': excel[r['Token']][0]})
    write_csv('inventory-master.csv', master)
    write_csv('matches-and-evidence.csv', matches)
    write_csv('pending-products.csv', pending)
    missing_asset_fields = list(pending[0])
    write_csv('pending-missing-assets.csv', [], missing_asset_fields)
    empty_layout_rows = [dict(source_file=str(xlsx_path), sheet=sheet, row=n, reason='Empty export layout row; no token or product data') for sheet, sheet_rows in sheets.items() for n, cells in sheet_rows if not any(cells.values())]
    write_csv('excluded-records.csv', empty_layout_rows, ['source_file', 'sheet', 'row', 'reason'])
    write_csv('duplicate-skus.csv', [dict(square_sku=sku, rows=' | '.join(str(n) for n, r in enumerate(rows, 2) if r['SKU'] == sku), reason='Same SKU in multiple variant records; not automatically merged') for sku, count in skus.items() if count > 1])
    (OUT / 'existing-links.json').write_text(json.dumps(existing_links, ensure_ascii=False, indent=2) + '\n')
    baseline_ids = {'the-reaper', 'alien-attack', 'festival-balls-reloadable', 'neon-beef', 'diablo', 'night-rider', 'futurama-artillery', 'festival-balls-artillery', 'star-light', 'action-zone'}
    stats = dict(csv_data_rows=len(rows), xlsx_items_data_rows=len(excel), xlsx_component_inventory_data_rows=0,
                 reconciled_variant_records=len(master), regular_variant_rows=sum(r['Variation Name'] == 'Regular' for r in rows),
                 named_variant_rows=sum(r['Variation Name'] != 'Regular' for r in rows), distinct_square_names=len(names),
                 same_name_groups=sum(v > 1 for v in names.values()), duplicate_sku_groups=sum(v > 1 for v in skus.values()),
                 substantive_source_differences=len(differences), numeric_price_format_differences=len(formatting),
                 dynamite_catalog_entries=len(candidates), confirmed_dynamite_products=len(reviewed),
                 existing_products_retained=len(baseline_ids), existing_products_linked=sum(bool(r['rockwall_product_id'] in baseline_ids) for r in master),
                 new_products_added=sum(p['id'] not in baseline_ids for p in reviewed),
                 unique_products_resolved_in_square=len({r['rockwall_product_id'] for r in master if r['rockwall_product_id']}),
                 pending_variant_records=len(pending), pending_by_status=dict(Counter(r['pending_group'] for r in pending)),
                 confirmed_missing_assets=0, excluded_data_records=0, excluded_empty_layout_rows=len(empty_layout_rows),
                 price_display_normalizations=sum(1 for r in rows if re.fullmatch(r'\d+(?:\.\d+)?', r['Price']) and r['Price'] != str(Decimal(r['Price']).normalize())),
                 source_hashes={str(p): digest(p) for p in [csv_path, xlsx_path, source / 'public/products.json', source / 'public/gender-reveal.json']})
    (OUT / 'summary.json').write_text(json.dumps(stats, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(stats, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--csv', type=Path, required=True)
    parser.add_argument('--xlsx', type=Path, required=True)
    parser.add_argument('--dynamite', type=Path, required=True)
    args = parser.parse_args()
    run(args.csv, args.xlsx, args.dynamite)
