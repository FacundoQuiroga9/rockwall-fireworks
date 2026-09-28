// macOS Apache 2.4 preview, isolated from /etc/apache2 and the system service.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'artifacts/apache-preview');
mkdirSync(output, { recursive: true });
// Separate fixtures exercise old uploaded directories without contaminating dist.
const site = resolve(output, 'site');
rmSync(site, { recursive: true, force: true });
cpSync(resolve(root, 'dist'), site, { recursive: true });
for (const directory of ['playground', 'products', 'untouched-real-dir']) mkdirSync(resolve(site, directory), { recursive: true });
writeFileSync(resolve(site, 'untouched-real-dir/probe.txt'), 'real file preserved\n');
const modules = ['mpm_prefork', 'authz_core', 'unixd', 'mime', 'dir', 'log_config', 'rewrite', 'negotiation'];
const config = `ServerRoot "/usr"
Listen 127.0.0.1:4180
ServerName localhost
${modules.map(m => `LoadModule ${m}_module /usr/libexec/apache2/mod_${m}.so`).join('\n')}
PidFile "${output}/httpd.pid"
ErrorLog "${output}/error.log"
LogLevel warn
TypesConfig /etc/apache2/mime.types
DocumentRoot "${site}"
<Directory "${site}">
  Require all granted
  Options +FollowSymLinks +MultiViews
  AllowOverride All
</Directory>
`;
const file = resolve(output, 'httpd.conf');
writeFileSync(file, config);
const syntaxOnly = process.argv.includes('--syntax');
// httpd -t alone does not read per-request .htaccess. Include it explicitly
// inside Directory for syntax checking; actual HTTP still requires the server.
if (syntaxOnly) writeFileSync(file, config.replace('</Directory>', `Include "${site}/.htaccess"\n</Directory>`));
console.log(syntaxOnly ? 'Parsing the actual .htaccess in Apache Directory context (no HTTP proof).' : 'Apache preview: http://127.0.0.1:4180/playground — Ctrl+C to stop.');
const child = spawn('/usr/sbin/httpd', ['-f', file, syntaxOnly ? '-t' : '-DFOREGROUND'], { stdio: 'inherit' });
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
process.on('SIGINT', () => child.kill('SIGINT'));
process.on('SIGTERM', () => child.kill('SIGTERM'));
