import { createNightSky } from '../../src/components/hero/createNightSky.js';
import { createResponsiveSky, skyMediaQueries } from '../../src/components/hero/createResponsiveSky.js';
const $ = id => document.getElementById(id);
const nativeRaf = window.requestAnimationFrame.bind(window);
const nativeCancel = window.cancelAnimationFrame.bind(window);
let callbacks = 0, jsTime = 0, maxTime = 0, draws = 0, initializations = 0, destroyed = 0;
const pending = new Set();
window.requestAnimationFrame = callback => {
  const id = nativeRaf(time => {
    pending.delete(id);
    const start = performance.now(); callback(time);
    const elapsed = performance.now() - start;
    callbacks++; jsTime += elapsed; maxTime = Math.max(maxTime, elapsed);
  });
  pending.add(id); return id;
};
window.cancelAnimationFrame = id => { pending.delete(id); nativeCancel(id); };
const simulated = {};
for (const [key, id] of [['touch','touch'],['reduced','reduced']]) {
  const input = $(id); const listeners = new Set();
  simulated[skyMediaQueries[key]] = { get matches() { return input.checked; }, addEventListener(_, cb) { listeners.add(cb); }, removeEventListener(_, cb) { listeners.delete(cb); } };
  input.addEventListener('change', () => { [...listeners].forEach(cb => cb()); update(); });
}
let session, paused = false, mode = 'none';
function update() {
  $('state').textContent = ` Mode: ${mode}; canvases: ${$('host').children.length}; pending RAF: ${pending.size}; initialized: ${initializations}; destroyed: ${destroyed}; callbacks: ${callbacks}`;
}
function mount() {
  session?.destroy();
  session = createResponsiveSky($('host'), {
    matchMedia: query => simulated[query] ?? window.matchMedia(query),
    createEngine(canvas) {
      initializations++;
      const context = canvas.getContext('2d');
      const clear = context.clearRect.bind(context);
      context.clearRect = (...args) => { draws++; return clear(...args); };
      const engine = createNightSky(canvas);
      return { setPaused: value => engine.setPaused(value), destroy() { destroyed++; engine.destroy(); } };
    },
    onModeChange(next) { mode = next; $('static').hidden = next === 'animated'; update(); },
  });
  session.setPaused(paused); update();
}
$('pause').onclick = () => { paused = !paused; session?.setPaused(paused); $('pause').textContent = paused ? 'Resume' : 'Pause'; update(); };
$('hide').onclick = () => { $('stage').classList.toggle('hidden'); $('hide').textContent = $('stage').classList.contains('hidden') ? 'Show stage' : 'Hide stage'; setTimeout(update, 200); };
$('destroy').onclick = () => { session?.destroy(); session = null; mode = 'destroyed'; update(); };
$('mount').onclick = mount;
const longTasks = [];
const visibilityEvents = [];
document.addEventListener('visibilitychange', () => {
  setTimeout(() => { visibilityEvents.push({ visibility: document.visibilityState, callbacks, pendingRAF: pending.size }); update(); }, 100);
});
const observer = new PerformanceObserver(list => longTasks.push(...list.getEntries()));
observer.observe({type: 'longtask', buffered: false});
$('measure').onclick = () => {
  $('measure').disabled = true;
  callbacks = 0; jsTime = 0; maxTime = 0; draws = 0; longTasks.length = 0;
  const start = performance.now();
  $('results').textContent = 'Measuring 10 seconds… Keep this tab in front.';
  setTimeout(() => {
    const report = { mode, durationMs: Math.round(performance.now()-start), viewport: [innerWidth,innerHeight], devicePixelRatio, userAgent:navigator.userAgent, hardwareConcurrency:navigator.hardwareConcurrency, simulatedTouch:$('touch').checked, simulatedReducedMotion:$('reduced').checked, canvasCount:$('host').children.length, rafCallbacks:callbacks, drawCalls:draws, callbackJsMs:Number(jsTime.toFixed(2)), maximumCallbackMs:Number(maxTime.toFixed(2)), longTasks:longTasks.map(t=>Number(t.duration.toFixed(2))), pendingRAF:pending.size, visibility:document.visibilityState, visibilityEvents: [...visibilityEvents] };
    $('results').textContent = JSON.stringify(report,null,2); $('measure').disabled = false; update();
  },10000);
};
window.addEventListener('pagehide',()=>{session?.destroy();observer.disconnect();});
mount();
