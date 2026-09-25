"""Import only manually reviewed exact identities. Does not research or auto-approve names."""
import argparse, csv, hashlib, json, shutil
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/catalog/enrichment-2026-09'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--dynamite', type=Path, required=True)
    parser.add_argument('--ids', nargs='+', help='Import only these reviewed IDs; leave approved existing photos untouched')
    args = parser.parse_args()
    master_path = ROOT / 'src/data/products.json'
    products = json.loads(master_path.read_text())
    approvals = json.loads((AUDIT / 'reviewed-products.json').read_text())
    if args.ids:
        assert set(args.ids) <= {p['id'] for p in approvals}, 'Unknown approval ID'
        approvals = [p for p in approvals if p['id'] in args.ids]
    rows = list(csv.DictReader((ROOT/'docs/catalog/2026-08-square/pending-products.csv').open(encoding='utf-8-sig')))
    assets_path = ROOT / 'docs/catalog/asset-identities.json'
    assets = json.loads(assets_path.read_text())
    sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    for approval in approvals:
        linked = [r for r in rows if int(r['csv_row']) in approval['squareRows']]
        assert len(linked) == len(approval['squareRows'])
        assert all(approval['identityCode'] in [r['square_sku'], r['gtin']] for r in linked)
        product_id = approval['id']
        source = ROOT / approval['referenceImage'] if approval.get('referenceImage') else args.dynamite / 'public/products' / approval['sourceImage']
        reference = source if approval.get('referenceImage') else AUDIT / 'references' / (product_id + '-original.png')
        if not reference.exists(): shutil.copyfile(source, reference)
        assert sha(reference) == sha(source), 'Source photo changed: review before importing'
        if approval.get('sourceImageSha256'): assert sha(source) == approval['sourceImageSha256'], 'Approved source hash changed'
        image = Image.open(source).convert('RGBA')
        assert image.getchannel('A').getextrema()[0] == 0, 'Expected a real transparent product photo'
        image.thumbnail((640,640), Image.Resampling.LANCZOS)
        existing_asset = next((a for a in assets if a['id'] == product_id), None)
        mobile_path = Path(existing_asset['mobilePath']) if existing_asset else Path('assets/products') / (product_id + '.webp')
        assert str(mobile_path) in [f'assets/products/{product_id}.png', f'assets/products/{product_id}.webp']
        mobile_output = ROOT.parent/'rockwall-fireworks-mobile'/mobile_path
        if mobile_path.suffix == '.png': image.save(mobile_output, optimize=True)
        else: image.save(mobile_output, quality=88, method=6)
        web_path = Path('public/images/products') / (product_id + '.webp')
        widths=[];responsive=[]
        for width in [320,480,640]:
            variant=image.copy();variant.thumbnail((width,width),Image.Resampling.LANCZOS)
            output=web_path if width==640 else web_path.with_name(product_id+f'-{width}.webp')
            variant.save(ROOT/output,quality=88,method=6)
            widths.append(variant.width)
            if width!=640: responsive.append(dict(path=str(output),sha256=sha(ROOT/output)))
        product = {k: approval[k] for k in ['id','name','brand','category','presentation','description','features','manufacturerCode','previewVideo'] if k in approval}
        previous=next((p for p in products if p['id']==product_id),None)
        product.update(slug=product_id,image='/'+str(web_path.relative_to('public')),imageWidths=widths,featured=False,sortOrder=previous['sortOrder'] if previous else max(p['sortOrder'] for p in products)+1)
        products=[p for p in products if p['id']!=product_id]+[product]
        assets=[a for a in assets if a['id']!=product_id]+[dict(id=product_id,identity=f"{approval['brand']} {approval.get('manufacturerCode', 'exact UPC')} / {approval['identityCode']}",sourceSha256=sha(source),webPath=str(web_path),webSha256=sha(ROOT/web_path),mobilePath=str(mobile_path),mobileSha256=sha(ROOT.parent/'rockwall-fireworks-mobile'/mobile_path),responsive=responsive)]
    master_path.write_text(json.dumps(products,indent=2,ensure_ascii=False)+'\n')
    assets_path.write_text(json.dumps(assets,indent=2)+'\n')
    print(f'{len(approvals)} reviewed enrichments; {len(products)} catalog products')
if __name__=='__main__': main()
