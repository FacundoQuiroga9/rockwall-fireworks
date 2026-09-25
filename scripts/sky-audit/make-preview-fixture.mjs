import { readFile, writeFile } from 'node:fs/promises';
// Local-only fixture in ignored dist/. Never imported by the production app.
// Media-policy simulation is explicitly labelled; it is not OS/device emulation.
const html = await readFile(new URL('../../dist/index.html', import.meta.url), 'utf8');
const fixture = `<script>
(() => {
  history.replaceState(null, '', '/#top');
  const native = window.matchMedia.bind(window);
  const queries = new Map();
  window.matchMedia = query => {
    if (!['(pointer: coarse)', '(prefers-reduced-motion: reduce)'].includes(query)) return native(query);
    if (!queries.has(query)) {
      const source = new EventTarget(); source.matches = false; source.media = query; queries.set(query, source);
    }
    return queries.get(query);
  };
  addEventListener('DOMContentLoaded', () => {
    const toolbar = document.createElement('aside'); toolbar.setAttribute('aria-label','Media policy simulation');
    toolbar.style.cssText = 'position:fixed;bottom:8px;left:8px;z-index:2000;background:white;color:#00051e;padding:10px;border:2px solid #ff5215;font:12px system-ui';
    toolbar.innerHTML = '<strong>SIMULATION · not a physical device</strong> <button type="button" id="audit-touch">Toggle touch policy</button> <button type="button" id="audit-reduce">Toggle reduced motion policy</button> <input aria-label="Test clock ISO timestamp" id="audit-clock" value="2026-03-01T18:00:00Z"><button type="button" id="audit-apply">Apply test clock</button> <button type="button" id="audit-dismiss">Hide audit controls</button>';
    document.body.append(toolbar);
    const toggle = query => { const source = window.matchMedia(query); source.matches = !source.matches; source.dispatchEvent(new Event('change')); };
    document.getElementById('audit-touch').onclick = () => toggle('(pointer: coarse)');
    document.getElementById('audit-reduce').onclick = () => toggle('(prefers-reduced-motion: reduce)');
    document.getElementById('audit-apply').onclick = () => { const time = Date.parse(document.getElementById('audit-clock').value); if (Number.isFinite(time)) { Date.now = () => time; document.dispatchEvent(new Event('visibilitychange')); } };
    document.getElementById('audit-dismiss').onclick = () => toolbar.remove();
  });
})();
</script>`;
await writeFile(new URL('../../dist/media-audit.html', import.meta.url), html.replace('<head>', '<head>' + fixture));
