# Local sky audit

Run after a production build. These diagnostics live only in ignored `dist/`
and are removed by the next build; the production app never imports them.

```sh
npm run build
mkdir -p dist/sky-audit
cp scripts/sky-audit/index.html dist/sky-audit/index.html
./node_modules/.bin/esbuild scripts/sky-audit/audit.js --bundle --format=esm --outfile=dist/sky-audit/audit.js
node scripts/sky-audit/make-preview-fixture.mjs
npm run preview -- --host 127.0.0.1 --port 4173
```

If preview already runs, reuse it. Open `/sky-audit/index.html` to measure the
actual renderer. Keep the page visible and don't interact during each 10-second
sample. Touch/reduced checkboxes simulate the policy inputs. Measure static,
paused and offscreen states separately. Timing covers JavaScript callbacks,
not GPU, power or a real mobile device. All samples are exploratory.

`/media-audit.html` loads the actual application with clearly labelled controls
for live JavaScript media-policy changes and an ISO test clock. It does not change
OS preferences, native CSS media queries, device hardware, or production data.
Reloading returns to the normal app. Use this fixture for UI checks, not as a
replacement for native reduced-motion and physical-device testing.
