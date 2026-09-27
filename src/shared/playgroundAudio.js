// Original synthesized noise, impulses and tones. No sampled/third-party recordings.
export function createPlaygroundAudio(options = {}) {
  let context, master, compressor, analyser, noiseBuffer, enabled = false, volume = .35;
  let error = '', disposed = false, revision = 0;
  const voices = new Set(), emitters = new Map();
  const notify = () => options.onState?.(snapshot());
  const stop = () => {
    for (const voice of [...voices]) { try { voice.source.stop(); } catch { /* already ended */ } voice.dispose(); }
    voices.clear(); emitters.clear();
  };
  function snapshot() {
    let rms = 0, peak = 0;
    if (analyser) { const samples = new Float32Array(analyser.fftSize); analyser.getFloatTimeDomainData(samples); for (const s of samples) { rms += s * s; peak = Math.max(peak, Math.abs(s)); } rms = Math.sqrt(rms / samples.length); }
    return { enabled, state: context?.state || 'uninitialized', running: enabled && context?.state === 'running', error, voices: voices.size, rms, peak };
  }
  async function enable(value) {
    if (disposed) return false;
    const token = ++revision; enabled = value; error = '';
    if (!value) { stop(); try { await context?.suspend(); } catch { /* state is reported below */ } notify(); return false; }
    try {
      if (disposed) return false;
      const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AudioContext && !options.contextFactory) throw new Error('Audio is unavailable in this browser.');
      if (!context) {
        context = options.contextFactory ? options.contextFactory() : new AudioContext();
        master = context.createGain(); master.gain.value = volume * .65;
        compressor = context.createDynamicsCompressor(); compressor.threshold.value = -16; compressor.knee.value = 14; compressor.ratio.value = 8; compressor.attack.value = .003; compressor.release.value = .22;
        master.connect(compressor); compressor.connect(context.destination);
        if (context.createAnalyser) { analyser = context.createAnalyser(); analyser.fftSize = 512; compressor.connect(analyser); }
        options.onOutput?.(compressor, context); // Optional development recorder; never used by product UI.
        context.onstatechange = notify;
        noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
        const samples = noiseBuffer.getChannelData(0); let seed = 719, low = 0;
        for (let i = 0; i < samples.length; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; const white = seed / 4294967296 * 2 - 1; low = low * .96 + white * .16; samples[i] = Math.max(-.9, Math.min(.9, low * 1.5 + white * .28)); }
      }
      let timer;
      try { await Promise.race([context.resume(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Audio did not start. Tap Retry sound.')), 2500); })]); }
      finally { clearTimeout(timer); }
      if (disposed || token !== revision) return false;
      if (context.state !== 'running') throw new Error('Audio is suspended. Tap Retry sound.');
      notify(); return true;
    } catch (failure) { error = failure.message || 'Audio could not start. Tap Retry sound.'; notify(); return false; }
  }
  function voice(frequency, loop = false, tone = false) {
    const source = tone ? context.createOscillator() : context.createBufferSource();
    if (tone) { source.type = 'sine'; source.frequency.value = frequency; } else { source.buffer = noiseBuffer; source.loop = loop; }
    const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = frequency;
    const gain = context.createGain(); gain.gain.value = 0;
    source.connect(filter); filter.connect(gain); gain.connect(master);
    let released = false;
    const entry = { source, gain, filter, dispose() { if (released) return; released = true; voices.delete(entry); source.disconnect(); filter.disconnect(); gain.disconnect(); } };
    source.onended = () => entry.dispose(); voices.add(entry); source.start(); return entry;
  }
  function cue(type, event) {
    if (!enabled || !context || context.state !== 'running' || voices.size >= 10) return;
    if (type === 'burst' && ['comet','spinner'].includes(event.shape) && !event.risingReport) return; // Only an explicitly reviewed report.
    const launch = type === 'launch', duration = launch ? event.shape === 'spinner' ? .85 : .25 : event.shape === 'ring' ? .65 : .95;
    const entry = voice(launch ? 2300 : 1700), now = context.currentTime;
    const level = (launch ? .24 : .78) / Math.sqrt(Math.max(1, voices.size / 2));
    entry.gain.gain.setValueAtTime(0, now); entry.gain.gain.linearRampToValueAtTime(level, now + .012); entry.gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    entry.filter.frequency.setTargetAtTime(launch ? 850 : 250, now + .03, .15); entry.source.stop(now + duration);
    if (!launch && context.createOscillator && voices.size < 12) {
      const bass = voice(90, false, true); bass.source.frequency.exponentialRampToValueAtTime(38, now + .22);
      bass.gain.gain.setValueAtTime(level * .48, now); bass.gain.gain.exponentialRampToValueAtTime(.0001, now + .38); bass.source.stop(now + .4);
    }
  }
  function fountains(levels) {
    if (!enabled || !context || context.state !== 'running') return;
    const now = context.currentTime;
    for (const { id, intensity } of levels) {
      let entry = emitters.get(id);
      if (intensity > .0001 && !entry && voices.size < 10) { entry = voice(2400, true); emitters.set(id, entry); }
      if (!entry) continue;
      entry.gain.gain.setTargetAtTime(Math.max(0, intensity) * .32 / Math.sqrt(Math.max(1, levels.filter(l => l.intensity > .0001).length)), now, .065);
      entry.filter.frequency.setTargetAtTime(1100 + intensity * 1200, now, .12);
      if (intensity <= .0001) { entry.source.stop(now + .45); emitters.delete(id); }
    }
  }
  return { enable, cue, fountains, stop, snapshot,
    setVolume(value) { volume = Math.max(0, Math.min(1, value)); if (master) master.gain.setTargetAtTime(volume * .65, context.currentTime, .04); },
    suspend() { stop(); if (context) void context.suspend().catch(() => {}); },
    resume() { return enabled ? enable(true) : Promise.resolve(false); },
    destroy() { disposed = true; revision++; enabled = false; stop(); if (context) { context.onstatechange = null; void context.close().catch(() => {}); } },
  };
}
