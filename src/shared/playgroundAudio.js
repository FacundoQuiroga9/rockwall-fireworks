// Original synthesized cues; no recorded or third-party audio assets.
export function createPlaygroundAudio() {
  let context, master, compressor, noiseBuffer, enabled = false, volume = .35;
  const voices = new Set(), emitters = new Map();
  const stop = () => {
    for (const voice of voices) { try { voice.source.stop(); } catch { /* already ended */ } voice.dispose(); }
    voices.clear(); emitters.clear();
  };
  async function enable(value) {
    enabled = value;
    if (!value) { stop(); if (context) await context.suspend(); return false; }
    const AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContext) { enabled = false; return false; }
    if (!context) {
      context = new AudioContext(); master = context.createGain(); master.gain.value = volume * .16;
      compressor = context.createDynamicsCompressor(); compressor.threshold.value = -18; compressor.knee.value = 12; compressor.ratio.value = 12; compressor.attack.value = .004; compressor.release.value = .2;
      master.connect(compressor); compressor.connect(context.destination);
      noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const samples = noiseBuffer.getChannelData(0); let seed = 719;
      for (let i = 0; i < samples.length; i++) { seed = (seed * 1664525 + 1013904223) >>> 0; samples[i] = (seed / 4294967296 * 2 - 1) * .65; }
    }
    try { await context.resume(); } catch { enabled = false; }
    return enabled && context.state === 'running';
  }
  function voice(frequency, loop = false) {
    const source = context.createBufferSource(); source.buffer = noiseBuffer; source.loop = loop;
    const filter = context.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = frequency;
    const gain = context.createGain(); gain.gain.value = 0;
    source.connect(filter); filter.connect(gain); gain.connect(master);
    const entry = { source, gain, filter, dispose() { voices.delete(entry); source.disconnect(); filter.disconnect(); gain.disconnect(); } };
    source.onended = () => entry.dispose(); voices.add(entry); source.start(); return entry;
  }
  function cue(type, event) {
    if (!enabled || !context || context.state !== 'running' || voices.size >= 4) return;
    const duration = type === 'launch' ? .22 : event.shape === 'ring' ? .5 : .7;
    const entry = voice(type === 'launch' ? 900 : 420); const now = context.currentTime;
    entry.gain.gain.setValueAtTime(0, now); entry.gain.gain.linearRampToValueAtTime(type === 'launch' ? .18 : .65, now + .018); entry.gain.gain.exponentialRampToValueAtTime(.001, now + duration);
    entry.source.stop(now + duration);
  }
  function fountains(levels) {
    if (!enabled || !context || context.state !== 'running') return;
    const now = context.currentTime;
    for (const { id, intensity } of levels) {
      let entry = emitters.get(id);
      if (intensity > .0001 && !entry && voices.size < 4) { entry = voice(1600, true); emitters.set(id, entry); }
      if (!entry) continue;
      entry.gain.gain.setTargetAtTime(Math.max(0, intensity) * .12, now, .065);
      entry.filter.frequency.setTargetAtTime(850 + intensity * 750, now, .12);
      if (intensity <= .0001) {
        // Release the looping source after its envelope, before the visual tail ends.
        entry.source.stop(now + .45); emitters.delete(id);
      }
    }
  }
  return { enable, cue, fountains, stop,
    setVolume(value) { volume = Math.max(0, Math.min(1, value)); if (master) master.gain.setTargetAtTime(volume * .16, context.currentTime, .04); },
    suspend() { stop(); if (context) void context.suspend(); },
    async resume() { if (enabled && context) await context.resume(); },
    destroy() { enabled = false; stop(); if (context) void context.close(); },
  };
}
