"""Print-only thumbnails from approved alpha assets; product originals are untouched."""
import hashlib
import io
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[2]
products = json.loads((root / 'src/data/products.json').read_text())
thumbnails = {}
for product in products:
    source = root / ('public' + product['image'])
    image = Image.open(source).convert('RGBA')
    image.thumbnail((112, 112), Image.Resampling.LANCZOS)
    paper = Image.new('RGB', image.size, 'white')
    paper.paste(image, mask=image.getchannel('A'))
    buffer = io.BytesIO()
    paper.save(buffer, 'JPEG', quality=75, optimize=True)
    thumbnails[product['id']] = {'width': image.width, 'height': image.height, 'hex': buffer.getvalue().hex(), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest()}
target = root / 'src/data/pdfThumbnails.json'
temp = target.with_suffix('.json.tmp')
temp.write_text(json.dumps(thumbnails, separators=(',', ':')) + '\n')
temp.replace(target)
print(f'Prepared {len(thumbnails)} print-only thumbnails; source photographs unchanged.')
