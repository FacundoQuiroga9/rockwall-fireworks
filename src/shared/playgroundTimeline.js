// Independent automatic sequences and bounded per-product manual shell events.
// Self-contained: serialized into the offline WebView by catalog:sync.
export function createTimeline(profiles) {
  if (profiles.length > 4 || new Set(profiles.map(p => p.productId)).size !== profiles.length
    || profiles.some(p => !['aerial', 'ground', 'close'].includes(p.scene))
    || new Set(profiles.map(p => p.scene)).size > 1) throw new Error('Choose up to four unique profiles from one compatible scene');
  let selected = profiles.map((_, i) => i), position = 0, anchor = 0, cursor = -.000001;
  let state = 'idle', started = false, preview = false, pending = [];
  const manual = p => p.playback === 'manual-shell';
  const runs = new Map(), counts = profiles.map(() => 0);
  const autoDuration = () => Math.max(0, ...selected.filter(i => !manual(profiles[i])).map(i => profiles[i].playbackDuration ?? profiles[i].duration));
  const hasManual = () => selected.some(i => manual(profiles[i]));
  const end = () => Math.max(autoDuration(), ...[...runs].map(([i, r]) => r.start + profiles[i].duration));
  const duration = () => Math.max(0, ...selected.map(i => profiles[i].playbackDuration ?? profiles[i].duration));
  const renderEvents = () => Object.fromEntries(selected.filter(i => manual(profiles[i])).map(i => [i,
    preview ? profiles[i].events : runs.has(i) ? runs.get(i).events : [],
  ]));
  const shellState = i => {
    const p = profiles[i], limit = Number.isInteger(p.shellCount) && p.shellCount > 0 ? p.shellCount : null;
    const busy = runs.has(i) && position < runs.get(i).start + p.duration - .000001;
    return { index: i, launched: counts[i], limit, busy, complete: limit !== null && counts[i] >= limit,
      available: started && !preview && state !== 'paused' && !busy && (limit === null || counts[i] < limit) };
  };
  const snapshot = () => ({ state, position, duration: duration(), automaticDuration: autoDuration(), automaticPosition: Math.min(position, autoDuration()),
    selected: [...selected], started, preview, hasManual: hasManual(), shells: selected.filter(i => manual(profiles[i])).map(shellState), renderEvents: renderEvents() });
  function launch(i, now, first = false) {
    if (!selected.includes(i) || !manual(profiles[i]) || (!first && !shellState(i).available)) return false;
    const events = profiles[i].events.map(e => ({ ...e, id: `${e.id}:${counts[i] + 1}`, launch: e.launch + position, burst: e.burst + position }));
    runs.set(i, { start: position, events }); counts[i]++;
    // Events exactly at the resting cursor must be cued once on the next tick.
    events.forEach(event => { if (event.launch <= cursor) pending.push({ profile: i, event, type: 'launch', time: event.launch }); });
    if (state === 'waiting') { anchor = now - position * 1000; state = 'playing'; }
    return true;
  }
  function tick(now) {
    const cues = [];
    if (state === 'playing') {
      position = Math.min(end(), Math.max(position, (now - anchor) / 1000));
      cues.push(...pending); pending = [];
      selected.forEach(i => (manual(profiles[i]) ? runs.get(i)?.events || [] : profiles[i].events).forEach(event => {
        for (const type of ['launch', 'burst']) if (event[type] > cursor && event[type] <= position) cues.push({ profile: i, event, type, time: event[type] });
      }));
      cursor = position;
      if (position >= end()) state = hasManual() ? 'waiting' : 'ended';
    }
    return { ...snapshot(), cues: cues.sort((a, b) => a.time - b.time) };
  }
  function restart() { position = 0; cursor = -.000001; state = 'idle'; started = false; preview = false; pending = []; runs.clear(); counts.fill(0); return snapshot(); }
  return {
    snapshot, tick, restart, launch,
    resetShell(i) { if (!selected.includes(i) || !manual(profiles[i]) || shellState(i).busy || !shellState(i).complete) return false; counts[i] = 0; runs.delete(i); return true; },
    play(now) {
      if (state === 'ended' || (preview && hasManual())) restart();
      preview = false;
      if (!selected.length || state === 'playing') return snapshot();
      if (!started) { started = true; selected.filter(i => manual(profiles[i])).forEach(i => launch(i, now, true)); }
      anchor = now - position * 1000; state = end() > position ? 'playing' : hasManual() ? 'waiting' : 'ended';
      return snapshot();
    },
    pause(now) { tick(now); if (state === 'playing' || state === 'waiting') state = 'paused'; return snapshot(); },
    // Still inspection is a preview, never a launched shell or a change to My List.
    seek(time) { restart(); position = Math.max(0, Math.min(duration(), time)); cursor = position; state = 'paused'; preview = true; return snapshot(); },
    select(indices) {
      if (indices.length > 4 || new Set(indices).size !== indices.length || indices.some(i => !Number.isInteger(i) || !profiles[i])) throw new Error('Choose up to four valid profiles');
      selected = [...indices]; return restart();
    },
  };
}

export function validateProfiles(data, catalog) {
  const errors = [];
  const ids = new Set();
  for (const profile of data.profiles) {
    const product = catalog.find((p) => p.id === profile.productId);
    if (!['aerial', 'ground', 'close'].includes(profile.scene) || (profile.stages && profile.scene !== 'ground')) errors.push(`${profile.productId}: invalid compatible scene`);
    if (!product || product.name !== profile.name || product.brand !== profile.brand || product.category !== profile.category) errors.push(`${profile.productId}: catalog identity changed`);
    if (ids.has(profile.productId)) errors.push('Duplicate profile');
    ids.add(profile.productId);
    if (profile.status !== 'reviewed' || !['cake', 'cake-sample', 'shell-sample', 'fountain-sample', 'fountain', 'candle-sample', 'spinner-sample', 'rocket-sample'].includes(profile.kind) || !(profile.duration > 0) || (!profile.kind.startsWith('fountain') && profile.events.length !== profile.observedShots)) errors.push(`${profile.productId}: invalid review or duration`);
    if (Math.abs(profile.source.segmentEnd - profile.source.segmentStart - profile.duration) > 0.01) errors.push('Source segment duration differs');
    let previous = -1;
    const eventIds = new Set();
    for (const event of profile.events) {
      if (eventIds.has(event.id) || !Number.isFinite(event.launch) || !Number.isFinite(event.burst) || event.launch < 0 || event.burst < event.launch || event.burst < previous || event.burst >= profile.duration || !(event.life > 0) || !['palm', 'peony', 'ring', 'palm-glitter', 'flower', 'ghost', 'willow', 'color-peony', 'bouquet', 'ghost-peony', 'wander', 'comet', 'spinner'].includes(event.shape) || !event.colors.length || event.colors.some((color) => !/^#[a-f\d]{6}$/i.test(color))) errors.push(`${profile.productId}: invalid event ${event.id}`);
      eventIds.add(event.id); previous = event.burst;
    }
    if (profile.kind.startsWith('fountain')) {
      const ending = profile.ending;
      if (!ending || !['simulation', 'observed'].includes(ending.kind) || !(ending.fadeStart >= 0) || !(ending.emissionEnd > ending.fadeStart) || !(ending.tailSeconds > 0 && ending.tailSeconds <= 3) || profile.playbackDuration !== Math.max(profile.duration, ending.emissionEnd + ending.tailSeconds)) errors.push('Invalid fountain ending');
      if (profile.kind === 'fountain-sample' && ending?.kind !== 'simulation') errors.push('Excerpt must retain a simulation closure');
      let end = 0;
      for (const stage of profile.stages || []) {
        if (stage.start !== end || stage.end <= stage.start || stage.end > profile.duration || stage.height <= 0 || stage.height > 1 || !stage.colors?.length) errors.push('Invalid fountain stages');
        end = stage.end;
      }
      if (end !== profile.duration || profile.events.length || profile.observedShots !== null) errors.push('Invalid fountain coverage');
    }
    if (profile.playback === 'manual-shell' && (profile.kind !== 'shell-sample' || (profile.shellCount != null && (!Number.isInteger(profile.shellCount) || profile.shellCount <= 0)))) errors.push('Invalid retail shell limit');
    if (profile.kind === 'shell-sample' && (profile.playback !== 'manual-shell' || (profile.shellCount != null && profile.shellCount !== product?.shellPackage?.shellCount))) errors.push('Shell controls must use the confirmed retail count');
    if (profile.kind === 'shell-sample' && profile.events.length !== 1) errors.push('A shell sample must not fire the whole package');
  }
  return errors;
}
