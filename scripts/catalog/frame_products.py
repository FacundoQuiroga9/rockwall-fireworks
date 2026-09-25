"""Deterministic framing; no synthesis, background recoloring, stretching or product crop.
Requires Pillow for alpha measurement and ImageMagick 7 for lossless geometry/resampling.
Original published files are archived once before replacement. Hero/featured originals stay untouched.
"""
import argparse,hashlib,json,math,os,subprocess
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[2]
MOBILE=ROOT.parent/'rockwall-fireworks-mobile'
DOC=ROOT/'docs/catalog/presentation-2026-09'
sha=lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
def atomic_json(path,data):
 tmp=path.with_suffix(path.suffix+'.tmp');tmp.write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n');tmp.replace(path)
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--ids',nargs='+');args=parser.parse_args()
 products=json.loads((ROOT/'src/data/products.json').read_text());assets=json.loads((ROOT/'docs/catalog/asset-identities.json').read_text());policy=json.loads((DOC/'framing-policy.json').read_text());audit=json.loads((DOC/'image-framing-audit.json').read_text()) if args.ids and (DOC/'image-framing-audit.json').exists() else []
 if args.ids and set(args.ids)-{p['id'] for p in products}:raise ValueError('Unknown product IDs')
 threshold=policy['objectAlphaThreshold'];margin=policy['minimumShadowMargin'];processed=0
 if args.ids:audit=[a for a in audit if a['id'] not in args.ids]
 for p in products:
  if args.ids and p['id'] not in args.ids:continue
  a=next(a for a in assets if a['id']==p['id']);current=ROOT/a['webPath']
  if p['featured']:
   audit.append(dict(id=p['id'],status='approved reference preserved',path=a['webPath']));continue
  original=DOC/'framing-originals'/current.name;original.parent.mkdir(exist_ok=True)
  if not original.exists():os.link(current,original)
  im=Image.open(original).convert('RGBA');alpha=im.getchannel('A');obj=alpha.point(lambda v:255 if v>threshold else 0).getbbox();shadow=alpha.getbbox()
  if not obj:raise ValueError(p['id']+' empty alpha')
  occupancy=policy['categories'].get(p['category'],policy['defaultOccupancy']);occupancy=policy['overrides'].get(p['id'],{}).get('occupancy',occupancy)
  cx=(obj[0]+obj[2])/2;cy=(obj[1]+obj[3])/2;span=max(obj[2]-obj[0],obj[3]-obj[1])
  # Include every nonzero-alpha pixel, including useful faint shadows, with at least 3% margin.
  side=math.ceil(max(span/occupancy,2*max(cx-shadow[0],shadow[2]-cx,cy-shadow[1],shadow[3]-cy)/(1-2*margin)))
  x=round(cx-side/2);y=round(cy-side/2);render_width=min(640,side)
  # Archive original mobile and responsive derivatives; originals never overwritten.
  for r,path in [(MOBILE,a['mobilePath']),*[(ROOT,r['path']) for r in a['responsive']]]:
   src=r/path;dest=DOC/'framing-originals'/('mobile-'+src.name if r==MOBILE else src.name)
   if not dest.exists():os.link(src,dest)
  outputs=[(ROOT/a['webPath'],render_width),(MOBILE/a['mobilePath'],render_width),*[(ROOT/r['path'],min(w,side)) for r,w in zip(a['responsive'],[320,480])]]
  for target,width in outputs:
   tmp=target.with_name(target.stem+'.framing-tmp'+target.suffix)
   subprocess.run(['magick',str(original),'-background','none','-virtual-pixel','transparent','-define',f'distort:viewport={side}x{side}{x:+d}{y:+d}','-filter','point','-distort','SRT','0','+repage','-filter','Lanczos','-resize',f'{width}x{width}','-quality','88',str(tmp)],check=True,stdout=subprocess.DEVNULL)
   tmp.replace(target)
  a['webSha256']=sha(current);a['mobileSha256']=sha(MOBILE/a['mobilePath'])
  for r in a['responsive']:r['sha256']=sha(ROOT/r['path'])
  a['framingSource']=str(original.relative_to(ROOT));a['framingSourceSha256']=sha(original)
  p['imageWidths']=[min(320,side),min(480,side),render_width]
  out=Image.open(current).convert('RGBA');b=out.getchannel('A').point(lambda v:255 if v>threshold else 0).getbbox();processed+=1
  audit.append(dict(id=p['id'],source=str(original.relative_to(ROOT)),sourceSha256=sha(original),objectBounds=obj,shadowBounds=shadow,viewport=[x,y,side,side],targetOccupancy=occupancy,outputWidth=render_width,actualOccupancy=round(max(b[2]-b[0],b[3]-b[1])/out.width,3),method='Transparent canvas reframing and downsampling only; no pixel synthesis; full alpha bounds retained.'))
 atomic_json(ROOT/'src/data/products.json',products);atomic_json(ROOT/'docs/catalog/asset-identities.json',assets);atomic_json(DOC/'image-framing-audit.json',audit)
 print(f'Framed {processed} photos in this run; featured references preserved. Audit covers {len(audit)} products.')
if __name__=='__main__':main()
