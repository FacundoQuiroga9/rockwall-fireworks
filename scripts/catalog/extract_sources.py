"""Extract evidence from downloaded pages for human review. Never approves products."""
import json, re, html, gzip
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[2]
CACHE=ROOT/'artifacts/catalog-continuation'

class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip=0; self.parts=[]; self.images=[]; self.meta={}
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag in ['script','style','svg','noscript']: self.skip+=1
        if tag=='img': self.images.append(a)
        if tag=='meta': self.meta[a.get('property',a.get('name',''))]=a.get('content','')
    def handle_endtag(self,tag):
        if tag in ['script','style','svg','noscript']: self.skip=max(0,self.skip-1)
    def handle_data(self,data):
        if not self.skip and data.strip(): self.parts.append(data.strip())

def flatten(data):
    if isinstance(data,dict):
        yield data
        for key in ['@graph','mainEntity']: yield from flatten(data.get(key,[]))
    elif isinstance(data,list):
        for item in data: yield from flatten(item)

def extract(item):
    p=CACHE/item['file']
    if not p.exists() and not p.with_suffix(p.suffix+'.gz').exists():return {**item,'text':'','products':[],'images':[],'meta':{}}
    try: t=p.read_text() if p.exists() else gzip.decompress(p.with_suffix(p.suffix+'.gz').read_bytes()).decode()
    except UnicodeDecodeError: return {**item,'text':'Non-HTML resource; requires direct inspection','products':[],'images':[],'meta':{}}
    parser=Parser();parser.feed(t);ld=[]
    for block in re.findall(r'<script[^>]*type=[\"\']application/ld\+json[\"\'][^>]*>(.*?)</script>',t,re.S):
        try:ld.extend(flatten(json.loads(block)))
        except (ValueError,TypeError): pass
    products=[{k:v for k,v in obj.items() if k in ['name','description','brand','sku','gtin','gtin12','gtin13','mpn','image','url','category']} for obj in ld if obj.get('@type')=='Product']
    return {**item,'text':'\n'.join(parser.parts),'products':products,'images':parser.images,'meta':parser.meta,'youtube':list(dict.fromkeys(re.findall(r'(?:youtube\.com/(?:embed/|watch\?v=)|youtu\.be/)([a-zA-Z0-9_-]{11})',html.unescape(t))))}

if __name__=='__main__':
    sources=[extract(x) for x in json.loads((CACHE/'fetch-results.json').read_text())]
    (CACHE/'extracted-sources.json').write_text(json.dumps(sources,indent=2,ensure_ascii=False)+'\n')
    print(f'{len(sources)} sources extracted for review')
