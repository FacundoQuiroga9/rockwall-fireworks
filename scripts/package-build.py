"""Package the upload root, including dotfiles; never rely on a dist/* glob."""
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json

root = Path(__file__).resolve().parent.parent
dist = root / 'dist'
output = root / 'artifacts' / 'upload'
output.mkdir(parents=True, exist_ok=True)
archive = output / 'rockwall-fireworks-build.zip'
assert (dist / '.htaccess').read_bytes() == (root / 'public/.htaccess').read_bytes()
assert (dist / 'index.html').is_file()
assert not (dist / 'artifacts').exists(), 'Run npm run build to exclude QA artifacts'
files = sorted(p for p in dist.rglob('*') if p.is_file())
with ZipFile(archive, 'w', ZIP_DEFLATED) as bundle:
    for path in files:
        bundle.write(path, path.relative_to(dist).as_posix())
with ZipFile(archive) as bundle:
    assert bundle.read('.htaccess') == (root / 'public/.htaccess').read_bytes()
    assert bundle.testzip() is None
manifest = {
    'archive': archive.name,
    'sha256': sha256(archive.read_bytes()).hexdigest(),
    'files': len(files),
    'bytes': archive.stat().st_size,
    'htaccessSha256': sha256((dist / '.htaccess').read_bytes()).hexdigest(),
    'root': 'index.html and .htaccess at archive root; extract contents into domain document root',
}
(output / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps(manifest, indent=2))
