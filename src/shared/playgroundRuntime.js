// Self-contained runtime: dependencies passed explicitly, including in minified builds.
export function mountPlayground(config, makeTimeline, makeRenderer, makeAudio, makeFountain) {
  const $ = (id) => document.getElementById(id);
  const clock = makeTimeline(config.profiles);
  const renderer = makeRenderer($('sky'), config.profiles, config.compact, makeFountain, config.bases);
  const audio = makeAudio();
  const fountains = config.profiles.map((p) => p.stages ? makeFountain(p) : null);
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = config.reducedMotion || motion.matches;
  let animationChosen = false;
  let lastKnownTime = performance.now();
  let raf = 0, previousFrame = 0, previousReport = 0, sound = false, disposed = false;
  let frames = 0, totalCost = 0, maxCost = 0, particles = 0, quality = config.compact ? 'balanced' : 'high';
  let elapsedFrames = 0, firstFrame = 0, metrics = null;
  const send = (payload) => {
    const message = JSON.stringify({ type: 'rockwall-playground', ...payload });
    if (globalThis.ReactNativeWebView) globalThis.ReactNativeWebView.postMessage(message);
    else parent.postMessage(JSON.parse(message), '*');
  };
  const format = (n) => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
  function update() {
    const state = clock.snapshot();
    $('play').textContent = state.state === 'playing' ? 'Pause' : state.state === 'ended' ? 'Replay' : reduced && !animationChosen ? 'Play animation' : state.state === 'paused' ? 'Continue' : 'Play selection';
    $('play').disabled = !state.selected.length; $('restart').disabled = !state.selected.length; $('moment').disabled = !state.selected.length;
    $('progress').max = state.duration; $('progress').value = state.position;
    $('time').textContent = `${format(state.position)} / ≈ ${format(state.duration)}`;
    $('progress').setAttribute('aria-valuetext', `${Math.round(state.position)} of approximately ${Math.round(state.duration)} seconds`);
    const label = state.state === 'ended' ? 'Preview complete' : state.state === 'playing' ? 'Playing' : state.state === 'paused' ? 'Paused' : 'Ready · press Play selection';
    if ($('state').textContent !== label) $('state').textContent = label;
    document.querySelectorAll('[data-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === (state.selected.length > 1 ? 'all' : String(state.selected[0])))));
    document.querySelectorAll('.pane-label').forEach((label, i) => { label.style.opacity = state.selected.includes(i) ? '1' : '.4'; });
    send({ state: state.state, position: state.position, duration: state.duration, metrics });
  }
  function stop(useLastFrame = false) {
    // A native background command can arrive after the WebView was suspended.
    // Freeze the last rendered time rather than counting time spent in background.
    clock.pause(useLastFrame === true ? lastKnownTime : performance.now()); cancelAnimationFrame(raf); raf = 0; audio.suspend();
    renderer.draw(clock.snapshot().position, clock.snapshot().selected); update();
  }
  function frame(now) {
    if (disposed || clock.snapshot().state !== 'playing') return;
    // A stalled frame cannot produce a catch-up audio barrage.
    const gap = previousFrame ? now - previousFrame : 0;
    lastKnownTime = now;
    const state = clock.tick(now);
    if (gap < 250) state.cues.forEach((cue) => { if (state.position - cue.time < .15) audio.cue(cue.type, cue.event); });
    audio.fountains(fountains.map((model, i) => ({ id: i, intensity: model && state.selected.includes(i) ? model.emission(state.position).intensity : 0 })));
    const interval = config.compact || quality === 'low' ? 1000 / 30 : 1000 / 60;
    if (now - previousFrame >= interval - 1 || state.state === 'ended') {
      previousFrame = now;
      const before = performance.now(); particles = renderer.draw(state.position, state.selected);
      const cost = performance.now() - before; frames++; totalCost += cost; maxCost = Math.max(maxCost, cost);
      if (!firstFrame) firstFrame = now; else elapsedFrames++;
      if ($('quality').value === 'auto' && cost > 15 && frames > 12) { quality = 'low'; renderer.setQuality(quality); }
    }
    if (now - previousReport > 300 || state.state === 'ended') {
      previousReport = now;
      metrics = { frames, fps: firstFrame && now > firstFrame ? +(elapsedFrames * 1000 / (now - firstFrame)).toFixed(1) : 0, meanDrawMs: frames ? +(totalCost / frames).toFixed(2) : 0, maxDrawMs: +maxCost.toFixed(2), particles, quality, simultaneousProducts: state.selected.length, width: Math.round($('sky').clientWidth), height: Math.round($('sky').clientHeight) };
      $('metrics').textContent = `${metrics.fps} drawn fps · ${metrics.meanDrawMs} ms mean draw · ${quality} · ${particles} particles`;
      update();
    }
    if (state.state === 'playing') raf = requestAnimationFrame(frame);
    else { raf = 0; audio.stop(); }
  }
  $('play').onclick = async () => {
    if (!clock.snapshot().selected.length || disposed) return;
    if (clock.snapshot().state === 'playing') { stop(); return; }
    if (reduced && !animationChosen) clock.restart();
    animationChosen = true;
    if (sound) await audio.resume();
    if (disposed || document.hidden) return;
    previousFrame = 0; previousReport = 0; firstFrame = 0; elapsedFrames = 0;
    lastKnownTime = performance.now(); clock.play(lastKnownTime); update(); cancelAnimationFrame(raf); raf = requestAnimationFrame(frame);
  };
  $('restart').onclick = () => { stop(); clock.restart(); renderer.draw(0, clock.snapshot().selected); update(); };
  $('sound').onclick = async () => {
    sound = await audio.enable(!sound);
    if (disposed) { audio.destroy(); return; }
    $('sound').textContent = sound ? 'Sound on' : 'Sound off';
    $('sound').setAttribute('aria-pressed', String(sound));
    $('sound-note').textContent = sound ? 'Synthesized cues · not real loudness' : 'Sound starts off. Enable it to hear synthesized cues.';
  };
  $('volume').oninput = (event) => audio.setVolume(Number(event.target.value));
  $('quality').onchange = (event) => { quality = event.target.value === 'auto' ? config.compact ? 'balanced' : 'high' : event.target.value; renderer.setQuality(quality); renderer.draw(clock.snapshot().position, clock.snapshot().selected); };
  document.querySelectorAll('[data-mode]').forEach((button) => { button.onclick = () => {
    stop(); clock.select(button.dataset.mode === 'all' ? config.profiles.map((_, i) => i) : [Number(button.dataset.mode)]); renderer.draw(0, clock.snapshot().selected); update();
  }; });
  const momentsForSelection = () => [...new Set(clock.snapshot().selected.flatMap((i) => { const p = config.profiles[i]; if (p.stages) return p.stages.map((s) => (s.start + s.end) / 2); return p.events.filter((_, i) => i === 0 || i === Math.floor(p.events.length / 2) || i === p.events.length - 1).map((e) => Math.min(p.duration, e.burst + (e.shape === 'bouquet' ? 1.15 : .7))); }))].sort((a, b) => a - b);
  $('moment').onclick = () => {
    if (!config.profiles.length) return;
    stop(); const moments = momentsForSelection(); const next = moments.find((t) => t > clock.snapshot().position + .05) ?? moments[0]; clock.seek(next); renderer.draw(next, clock.snapshot().selected); update();
  };
  const hidden = () => { if (document.hidden) stop(true); };
  const message = (event) => { if (event.source === parent && event.data?.type === 'rockwall-pause') stop(true); };
  const motionChange = () => { reduced = motion.matches; if (reduced) { stop(); animationChosen = false; } $('motion-note').hidden = !reduced; update(); };
  const pageHidden = () => stop(true);
  document.addEventListener('visibilitychange', hidden); globalThis.addEventListener('pagehide', pageHidden); globalThis.addEventListener('message', message); motion.addEventListener('change', motionChange);
  function destroy() {
    if (disposed) return; stop(); disposed = true; globalThis.removeEventListener('unload', destroy); audio.destroy(); renderer.destroy();
    document.removeEventListener('visibilitychange', hidden); globalThis.removeEventListener('pagehide', pageHidden); globalThis.removeEventListener('message', message); motion.removeEventListener('change', motionChange);
  }
  globalThis.rockwallPlayback = { pause: () => stop(true), destroy };
  globalThis.addEventListener('unload', destroy, { once: true });
  $('motion-note').hidden = !reduced;
  if (reduced && config.profiles.length) { const moment = momentsForSelection()[0]; clock.seek(moment); renderer.draw(moment, clock.snapshot().selected); }
  update();
}
