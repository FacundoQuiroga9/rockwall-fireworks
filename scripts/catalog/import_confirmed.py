#!/usr/bin/env python3
"""Import only reviewed matches. Requires Pillow; does not write to source repos."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
AUDIT = ROOT / 'docs/catalog/2026-08-square'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(source, mobile):
    raise SystemExit('Historical importer retired to protect enriched fields and stable slugs. Edit src/data/products.json, then run npm run catalog:sync and npm run catalog:check. See docs/catalog/README.md.')
    reviewed = json.loads((AUDIT / 'reviewed-matches.json').read_text())
    source_products = json.loads((source / 'public/products.json').read_text())
    products_path = ROOT / 'src/data/products.json'
    products = json.loads(products_path.read_text())
    by_id = {p['id']: p for p in products}
    assets = []
    for review in reviewed:
        p = source_products[review['sourceIndex']]
        original = source / 'public' / review['sourceImage'].lstrip('/')
        assert sha(original) == review['sourceImageSha256']
        assert p['name'] == review['sourceName'] and p['brand'] == review['sourceBrand']
        id = review['id']
        existing = by_id.get(id)
        if existing and existing['featured']:
            # Approved assets, order and original video URLs are immutable.
            existing.update(brand=review['sourceBrand'], presentation=review['presentation'])
            continue
        im = Image.open(original).convert('RGBA')
        widths = []
        outputs = []
        for width, suffix in [(320, '-320'), (480, '-480'), (640, '')]:
            copy = im.copy()
            copy.thumbnail((width, width), Image.Resampling.LANCZOS)
            output = ROOT / f'public/images/products/{id}{suffix}.webp'
            copy.save(output, 'WEBP', quality=86, method=6)
            widths.append(copy.width)
            outputs.append({'path': str(output.relative_to(ROOT)), 'sha256': sha(output), 'bytes': output.stat().st_size, 'width': copy.width, 'height': copy.height})
        mobile_image = mobile / f'assets/products/{id}.png'
        copy = im.copy()
        copy.thumbnail((640, 640), Image.Resampling.LANCZOS)
        copy.save(mobile_image, 'PNG', optimize=True)
        product = dict(id=id, name=review['name'], category=review['category'],
                       brand=review['sourceBrand'], presentation=review['presentation'],
                       image=f'/images/products/{id}.webp', imageWidths=widths,
                       featured=False, previewVideo=p.get('videoLink') or None,
                       sortOrder=existing['sortOrder'] if existing else len(products) + 1)
        if existing:
            existing.update(product)
        else:
            products.append(product)
            by_id[id] = product
        assets.append(dict(id=id, source_image=review['sourceImage'], source_sha256=sha(original),
                           source_width=im.width, source_height=im.height,
                           source_video=p.get('videoLink') or None, web=outputs,
                           mobile={'path': str(mobile_image.relative_to(mobile)), 'sha256': sha(mobile_image), 'bytes': mobile_image.stat().st_size},
                           review='Packaging and photo reviewed visually; no Dynamite watermark. Resize/encoding only, no generated content or upscaling.'))
    assert len(products) == len(by_id)
    assert sum(p['featured'] for p in products) == 10
    products_path.write_text(json.dumps(products, ensure_ascii=False, indent=2) + '\n')

    # Keep the app self-contained; its module retains the existing public exports.
    mobile_data = []
    for p in products:
        record = {k: p[k] for k in ['id', 'name', 'category', 'featured', 'sortOrder']}
        record['imageKey'] = p['id']
        for field in ['brand', 'presentation']:
            if p.get(field):
                record[field] = p[field]
        if p.get('previewVideo'):
            record['previewVideoUrl'] = p['previewVideo']
        mobile_data.append(record)
    text = "import { Product } from '@/src/types/product';\n\n"
    text += '// Square/Dynamite reconciliation: see docs/catalog/README.md. Existing IDs are permanent.\n'
    text += 'export const products: readonly Product[] = ' + json.dumps(mobile_data, ensure_ascii=False, indent=2) + ';\n\n'
    text += "export const featuredProducts = products\n  .filter((product) => product.featured)\n  .sort((first, second) => first.sortOrder - second.sortOrder);\n\n"
    text += "export const productCategories = [...new Set(products.map((product) => product.category))];\n\n"
    text += "export const getProductById = (id: string | undefined) => products.find((product) => product.id === id);\n"
    (mobile / 'src/data/products.ts').write_text(text)
    types = mobile / 'src/types/product.ts'
    old = types.read_text()
    tail = old[old.index('export type ProductId'):]
    if 'brand?: string;' not in tail:
        tail = tail.replace('  category: string;', '  category: string;\n  brand?: string;\n  presentation?: string;')
    types.write_text('export const productIds = ' + json.dumps([p['id'] for p in products], indent=2) + ' as const;\n\n' + tail)
    mapping = "import { ProductId } from '@/src/types/product';\n\nexport const productImages: Record<ProductId, number> = {\n"
    mapping += ''.join(f"  '{p['id']}': require('../../assets/products/{p['id']}.png'),\n" for p in products)
    (mobile / 'src/data/productImages.ts').write_text(mapping + '};\n')
    snapshot_dir = mobile / 'docs/catalog'
    snapshot_dir.mkdir(parents=True, exist_ok=True)
    preserved = json.loads((AUDIT / 'preserved-catalog.json').read_text())
    (snapshot_dir / 'web-catalog-snapshot.json').write_text(json.dumps({'products': products, 'preservedAssetHashes': preserved['mobileAssetHashes']}, ensure_ascii=False, indent=2) + '\n')
    (AUDIT / 'asset-provenance.json').write_text(json.dumps(assets, ensure_ascii=False, indent=2) + '\n')
    print(f'{len(products)} products; {len(assets)} new resource sets; 10 original IDs/assets retained.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--dynamite', type=Path, required=True)
    parser.add_argument('--mobile', type=Path, required=True)
    args = parser.parse_args()
    run(args.dynamite, args.mobile)
