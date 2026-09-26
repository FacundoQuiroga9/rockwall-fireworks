import { createQualityController } from './playgroundQuality.js';
// Self-contained runtime: factories are serialized explicitly for the offline app.
export function mountPlayground(config, makeTimeline, makeRenderer, makeAudio, makeFountain, makeQuality = createQualityController) {
  const $ = id => document.getElementById(id);
  const clock = makeTimeline(config.profiles);
  const renderer = makeRenderer($('sky'), config.profiles, config.compact, makeFountain, config.bases);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const fountains = config.profiles.map(p => p.stages ? makeFountain(p) : null);
  let reduced = config.reducedMotion || motion.matches, animationChosen = false;
  let raf = 0, qualityRaf = 0, disposed = false, starting = false, sound = false, soundFailed = false;
  let lastKnownTime = performance.now(), previousFrame = 0, previousReport = 0;
  let frames = 0, totalCost = 0, maxCost = 0, particles = 0, firstFrame = 0, metrics = null;
  const preferences = {
    volume: Number.isFinite(config.preferences?.volume) ? Math.max(0, Math.min(1, config.preferences.volume)) : .35,
    quality: ['auto','high','balanced','low'].includes(config.preferences?.quality) ? config.preferences.quality : 'auto',
    sound: typeof config.preferences?.sound === 'boolean' ? config.preferences.sound : null,
  };
  const adaptive = makeQuality(preferences.quality, config.compact);
  let quality = adaptive.snapshot().effective;
  const audio = makeAudio({ onState: () => { if (!disposed) soundUI(); } });
  const launchPending = new Set();
  const send = payload => {
    const message = JSON.stringify({ type: 'rockwall-playground', ...payload });
    if (globalThis.ReactNativeWebView) globalThis.ReactNativeWebView.postMessage(message);
    else parent.postMessage(JSON.parse(message), '*');
  };
  const save = () => send({ preferences });
  const draw = state => renderer.draw(state.position, state.selected, state.renderEvents);
  $('volume').value = preferences.volume; audio.setVolume(preferences.volume);
  $('quality').value = preferences.quality; renderer.setQuality(quality);
  const format = n => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2,'0')}`;
  function soundUI() {
    const status = audio.snapshot?.();
    const running = status ? status.running : sound;
    const paused = sound && clock.snapshot().state !== 'playing' && !soundFailed;
    $('sound').textContent = preferences.sound === false ? 'Sound off' : soundFailed || (sound && !running && !paused) ? 'Retry sound' : running ? 'Sound on' : paused ? 'Sound paused' : preferences.sound === null ? 'Sound with Play' : 'Enable sound';
    $('sound').setAttribute('aria-pressed', String(running || paused));
    $('sound-note').textContent = soundFailed ? 'Audio could not start. Tap Retry sound. Check your device volume if needed.' : preferences.sound === false ? 'Muted. Your choice is saved.' : preferences.volume === 0 ? 'Volume is zero. Raise it to hear the effects.' : running ? 'Synthesized launch, burst and fountain sounds.' : 'Sound starts with Play. Use the sound control to mute or enable it.';
  }
  function qualityUI() {
    const q = adaptive.snapshot();
    const text = q.adjusted ? `${q.requested[0].toUpperCase() + q.requested.slice(1)} · adjusted to ${q.effective} for smoother playback` : `${q.requested === 'auto' ? 'Auto · ' : ''}${q.effective}`;
    if ($('quality-state') && $('quality-state').textContent !== text) $('quality-state').textContent = text;
    const labels = {auto:'Auto (recommended)',high:'High',balanced:'Balanced',low:'Low'};
    for (const option of $('quality').options || []) { const label = `${labels[option.value]}${q.adjusted && option.value === q.requested ? ` → ${q.effective}` : ''}`; if (option.textContent !== label) option.textContent = label; }
  }
  function update() {
    const state = clock.snapshot();
    $('motion-note').hidden = !reduced || animationChosen;
    $('play').textContent = state.state === 'playing' ? 'Pause' : state.state === 'waiting' ? 'Sequences complete' : state.state === 'ended' ? 'Replay' : reduced && !animationChosen ? 'Play animation' : state.state === 'paused' ? 'Continue' : 'Play selection';
    $('play').disabled = !state.selected.length || starting || state.state === 'waiting'; $('restart').disabled = !state.selected.length; $('moment').disabled = !state.selected.length;
    $('progress').hidden = !state.automaticDuration;
    $('progress').max = state.automaticDuration || 1; $('progress').value = state.automaticPosition;
    $('time').textContent = state.automaticDuration ? `Sequence ${format(state.automaticPosition)} / ≈ ${format(Math.round(state.automaticDuration))}` : state.hasManual ? 'Individual launches · no fixed duration' : '0:00';
    $('progress').setAttribute('aria-valuetext', `${Math.round(state.automaticPosition)} of approximately ${Math.round(state.automaticDuration)} automatic seconds`);
    const label = state.preview ? state.hasManual ? 'Still preview · Play starts from the beginning' : 'Still preview · Continue from here' : state.state === 'waiting' ? 'Ready for another shell' : state.state === 'ended' ? 'Preview complete' : state.state === 'playing' ? 'Playing' : state.state === 'paused' ? 'Paused' : 'Ready · press Play selection';
    if ($('state').textContent !== label) $('state').textContent = label;
    document.querySelectorAll('.pane-label').forEach((label, i) => { label.style.opacity = state.selected.includes(i) ? '1' : '.4'; });
    for (const shell of state.shells) {
      const button = $(`launch-${shell.index}`), reset = $(`reset-shell-${shell.index}`), status = $(`shell-count-${shell.index}`);
      if (!button) continue;
      const countLabel = `${shell.launched}${shell.limit ? ` / ${shell.limit}` : ''} launched${shell.complete ? ' · Complete' : ''}`;
      if (status.textContent !== countLabel) status.textContent = countLabel;
      button.textContent = shell.busy ? 'Playing shell' : shell.complete ? 'All launched' : shell.limit ? `Launch ${shell.launched + 1} / ${shell.limit}` : 'Launch shell';
      button.disabled = !shell.available || launchPending.has(shell.index);
      button.setAttribute('aria-label', `${config.profiles[shell.index].name}: ${button.textContent}`);
      reset.hidden = !shell.complete; reset.disabled = shell.busy || state.state === 'paused';
    }
    soundUI(); qualityUI();
    send({ state: state.state, position: state.position, duration: state.automaticDuration, shells: state.shells, metrics });
  }
  function stop(useLastFrame = false) {
    clock.pause(useLastFrame === true ? lastKnownTime : performance.now()); cancelAnimationFrame(raf); cancelAnimationFrame(qualityRaf); raf = 0; qualityRaf = 0; audio.suspend(); draw(clock.snapshot()); update();
  }
  function frame(now) {
    if (disposed || clock.snapshot().state !== 'playing') return;
    const interval = config.compact || quality === 'low' ? 1000 / 30 : 1000 / 60;
    const gap = previousFrame ? now - previousFrame : 0;
    lastKnownTime = now;
    const state = clock.tick(now);
    if (gap < 250) state.cues.forEach(cue => { if (state.position - cue.time < .15) audio.cue(cue.type, cue.event); });
    audio.fountains(fountains.map((model, i) => ({ id: i, intensity: model && state.selected.includes(i) ? model.emission(state.position).intensity : 0 })));
    if (gap >= interval - 1 || !previousFrame || state.state !== 'playing') {
      previousFrame = now;
      const before = performance.now(); particles = draw(state);
      const cost = performance.now() - before; frames++; totalCost += cost; maxCost = Math.max(maxCost, cost); if (!firstFrame) firstFrame = now;
      const q = adaptive.sample(now, cost, gap); if (quality !== q.effective) { quality = q.effective; renderer.setQuality(quality); qualityUI(); }
    }
    if (now - previousReport > 300 || state.state !== 'playing') {
      previousReport = now;
      metrics = { frames, fps: firstFrame && now > firstFrame ? +((frames - 1) * 1000 / (now - firstFrame)).toFixed(1) : 0, meanDrawMs: frames ? +(totalCost / frames).toFixed(2) : 0, maxDrawMs: +maxCost.toFixed(2), particles, quality, requestedQuality: preferences.quality, ...renderer.metrics?.(), audio: audio.snapshot?.(), simultaneousProducts: state.selected.length, width: Math.round($('sky').clientWidth), height: Math.round($('sky').clientHeight) };
      $('metrics').textContent = `${metrics.fps} drawn fps · ${metrics.meanDrawMs} ms mean draw · ${quality} · ${particles} drawn points · audio ${metrics.audio?.state || 'unavailable'}`;
      update();
    }
    if (state.state === 'playing') raf = requestAnimationFrame(frame);
    else { raf = 0; audio.stop(); update(); }
  }
  async function startSound() {
    if (preferences.sound === false) return;
    sound = await audio.enable(true); soundFailed = !sound;
    if (disposed) { audio.destroy(); return; } soundUI();
  }
  $('play').onclick = async () => {
    if (!clock.snapshot().selected.length || disposed || starting) return;
    if (clock.snapshot().state === 'playing') { stop(); return; }
    if (clock.snapshot().state === 'waiting') return;
    starting = true; update(); await startSound(); starting = false;
    if (disposed || document.hidden) return;
    if (reduced && !animationChosen) clock.restart(); animationChosen = true;
    previousFrame = 0; previousReport = 0; firstFrame = 0; frames = 0; totalCost = 0; maxCost = 0;
    lastKnownTime = performance.now(); clock.play(lastKnownTime); update(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  };
  $('restart').onclick = () => { stop(); clock.restart(); draw(clock.snapshot()); update(); };
  $('sound').onclick = async () => {
    const mute = !soundFailed && (sound || preferences.sound === null);
    preferences.sound = !mute; save();
    if (mute) { sound = false; soundFailed = false; await audio.enable(false); } else await startSound();
    if (!disposed) soundUI();
  };
  $('volume').oninput = event => { preferences.volume = Number(event.target.value); audio.setVolume(preferences.volume); save(); soundUI(); };
  $('quality').onchange = event => { preferences.quality = event.target.value; quality = adaptive.set(preferences.quality).effective; renderer.setQuality(quality); draw(clock.snapshot()); qualityUI(); save();
    // A bounded redraw also makes quality changes visible in a paused still.
    const until = performance.now() + 1250;
    cancelAnimationFrame(qualityRaf);
    const redraw = now => { if (disposed || clock.snapshot().state === 'playing') return; draw(clock.snapshot()); if (now < until) qualityRaf = requestAnimationFrame(redraw); else qualityRaf = 0; };
    if (clock.snapshot().state !== 'playing') qualityRaf = requestAnimationFrame(redraw);
  };
  config.profiles.forEach((profile, i) => {
    if (profile.playback !== 'manual-shell') return;
    $(`launch-${i}`).onclick = async () => {
      if (launchPending.has(i) || !clock.snapshot().shells.find(s => s.index === i)?.available) return;
      launchPending.add(i); update(); await startSound(); launchPending.delete(i);
      if (disposed || document.hidden || !clock.launch(i, performance.now())) return;
      previousFrame = 0; firstFrame = 0; frames = 0; totalCost = 0; maxCost = 0; lastKnownTime = performance.now(); update(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
    };
    $(`reset-shell-${i}`).onclick = () => { if (clock.resetShell(i)) { draw(clock.snapshot()); update(); } };
  });
  document.querySelectorAll('[data-mode]').forEach(button => { button.onclick = () => { stop(); clock.select(button.dataset.mode === 'all' ? config.profiles.map((_, i) => i) : [Number(button.dataset.mode)]); draw(clock.snapshot()); update(); }; });
  const momentsForSelection = () => [...new Set(clock.snapshot().selected.flatMap(i => { const p = config.profiles[i]; return p.stages ? p.stages.map(s => (s.start + s.end) / 2) : p.events.filter((_, j) => j === 0 || j === Math.floor(p.events.length / 2) || j === p.events.length - 1).map(e => Math.min(p.duration, e.burst + (e.shape === 'bouquet' ? 1.15 : .7))); }))].sort((a, b) => a - b);
  $('moment').onclick = () => { if (!config.profiles.length) return; stop(); const moments = momentsForSelection(); const next = moments.find(t => t > clock.snapshot().position + .05) ?? moments[0]; clock.seek(next); draw(clock.snapshot()); update(); };
  const hidden = () => { if (document.hidden) stop(true); };
  const message = event => { if (event.source !== parent) return; if (event.data?.type === 'rockwall-pause') stop(true); if (event.data?.type === 'rockwall-destroy') destroy(); };
  const motionChange = () => { reduced = motion.matches; if (reduced) { stop(); animationChosen = false; } $('motion-note').hidden = !reduced; update(); };
  const pageHidden = () => stop(true);
  document.addEventListener('visibilitychange', hidden); globalThis.addEventListener('pagehide', pageHidden); globalThis.addEventListener('message', message); motion.addEventListener('change', motionChange);
  function destroy() {
    if (disposed) return; stop(); disposed = true; globalThis.removeEventListener('unload', destroy); audio.destroy(); renderer.destroy();
    document.removeEventListener('visibilitychange', hidden); globalThis.removeEventListener('pagehide', pageHidden); globalThis.removeEventListener('message', message); motion.removeEventListener('change', motionChange);
  }
  globalThis.rockwallPlayback = { pause: () => stop(true), destroy };
  globalThis.addEventListener('unload', destroy, { once: true }); $('motion-note').hidden = !reduced;
  if (reduced && config.profiles.length) { clock.seek(momentsForSelection()[0]); draw(clock.snapshot()); }
  update();
}
