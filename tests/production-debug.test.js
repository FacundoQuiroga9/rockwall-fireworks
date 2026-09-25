import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'vite';

// Even a production build named "development" must use Vite's DEV=false guard.
// Build in memory so this regression test never replaces the local preview.
test('production bundles exclude the debug interface, date parser and panel CSS', async () => {
  const result = await build({
    mode: 'development', logLevel: 'silent',
    // Opting in must not override production, even with a misleading mode name.
    define: { 'import.meta.env.VITE_COUNTDOWN_DEBUG': '"true"' },
    build: { write: false, emptyOutDir: false },
  });
  const bundles = Array.isArray(result) ? result : [result];
  const text = bundles.flatMap(bundle => bundle.output).map(file => file.type === 'chunk' ? file.code : String(file.source)).join('\n');
  for (const marker of ['Countdown debug', 'Freeze simulated time', 'Configured season checks', 'This local time does not exist', '.countdown-debug', 'debug-date']) {
    assert.equal(text.includes(marker), false, `Production contains development marker: ${marker}`);
  }
  assert.ok(text.includes('Season in progress'));
  assert.ok(text.includes('Call to schedule your visit'));
});
