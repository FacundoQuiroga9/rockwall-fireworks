"""Read-only image audit and review contact sheets, grouped by category."""
import json,math
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[2];OUT=ROOT/'docs/catalog/presentation-2026-09';SHEETS=OUT/'contact-sheets';SHEETS.mkdir(exist_ok=True)
products=json.loads((ROOT/'src/data/products.json').read_text());audit=[]
for p in products:
 im=Image.open(ROOT/'public'/p['image'].lstrip('/')).convert('RGBA');a=im.getchannel('A');b=a.point(lambda v:255 if v>16 else 0).getbbox()
 assert b and a.getextrema()[0]==0,p['id']
 edge=[a.getpixel((x,y)) for x,y in [(0,0),(im.width-1,0),(0,im.height-1),(im.width-1,im.height-1)]]
 audit.append(dict(id=p['id'],category=p['category'],width=im.width,height=im.height,alpha=a.getextrema(),objectBounds=b,occupancy=round(max(b[2]-b[0],b[3]-b[1])/max(im.size),3),cornerAlpha=edge,bytes=(ROOT/'public'/p['image'].lstrip('/')).stat().st_size))
items=sorted(products,key=lambda p:(p['category'],p['name']))
for offset in range(0,len(items),30):
 sheet=Image.new('RGB',(1000,960),'#102039');draw=ImageDraw.Draw(sheet)
 for n,p in enumerate(items[offset:offset+30]):
  x=n%5*200;y=n//5*160
  im=Image.open(ROOT/'public'/p['image'].lstrip('/')).convert('RGBA');im.thumbnail((120,120))
  sheet.paste(im,(x+(200-im.width)//2,y),im);draw.text((x+5,y+121),p['id'][:30],fill='white');draw.text((x+5,y+140),p['category'],fill='#ffb69a')
 sheet.save(SHEETS/f'catalog-{offset//30+1:02}.jpg',quality=86)
(OUT/'resource-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
print(len(audit),'images audited;',math.ceil(len(items)/30),'category contact sheets; all alpha corners',all(not any(a['cornerAlpha']) for a in audit))
