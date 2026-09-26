// Time is measured in seconds. Pure clock, shared by Canvas and the native WebView.
export function createTimeline(profiles) {
  // Guard every entry point, including native documents and restored selections.
  // Keep this self-contained: it is serialized into the offline runtime.
  if (profiles.length > 4 || new Set(profiles.map((p) => p.productId)).size !== profiles.length
    || profiles.some((p) => !['aerial', 'ground'].includes(p.scene))
    || new Set(profiles.map((p) => p.scene)).size > 1) throw new Error('Choose up to four unique profiles from one compatible scene');
  let selected = profiles.map((_, index) => index);
  let position = 0;
  let anchor = 0;
  let cursor = -0.000001;
  let state = 'idle';
  const duration = () => Math.max(0, ...selected.map((i) => (profiles[i].playbackDuration ?? profiles[i].duration)));
  const snapshot = () => ({ state, position, duration: duration(), selected: [...selected] });
  function tick(now) {
    const cues = [];
    if (state === 'playing') {
      position = Math.min(duration(), Math.max(position, (now - anchor) / 1000));
      selected.forEach((i) => profiles[i].events.forEach((event) => {
        for (const type of ['launch', 'burst']) {
          const time = event[type];
          if (time > cursor && time <= position) cues.push({ profile: i, event, type, time });
        }
      }));
      cursor = position;
      if (position >= duration()) state = 'ended';
    }
    return { ...snapshot(), cues: cues.sort((a, b) => a.time - b.time) };
  }
  function restart() { position = 0; cursor = -0.000001; state = 'idle'; return snapshot(); }
  return {
    snapshot, tick, restart,
    play(now) {
      if (state === 'ended') restart();
      if (duration() > 0 && state !== 'playing') { anchor = now - position * 1000; state = 'playing'; }
      return snapshot();
    },
    pause(now) { tick(now); if (state === 'playing') state = 'paused'; return snapshot(); },
    seek(time) { position = Math.max(0, Math.min(duration(), time)); cursor = position; state = 'paused'; return snapshot(); },
    select(indices) {
      if (indices.length > 4 || new Set(indices).size !== indices.length || indices.some((i) => !profiles[i])) throw new Error('Choose up to four valid profiles');
      selected = [...indices]; return restart();
    },
  };
}

export function validateProfiles(data, catalog) {
  const errors = [];
  const ids = new Set();
  for (const profile of data.profiles) {
    const product = catalog.find((p) => p.id === profile.productId);
    if (!['aerial', 'ground'].includes(profile.scene) || (profile.stages ? profile.scene !== 'ground' : profile.scene !== 'aerial')) errors.push(`${profile.productId}: invalid compatible scene`);
    if (!product || product.name !== profile.name || product.brand !== profile.brand || product.category !== profile.category) errors.push(`${profile.productId}: catalog identity changed`);
    if (ids.has(profile.productId)) errors.push('Duplicate profile');
    ids.add(profile.productId);
    if (profile.status !== 'reviewed' || !['cake', 'cake-sample', 'shell-sample', 'fountain-sample', 'fountain'].includes(profile.kind) || !(profile.duration > 0) || (!profile.kind.startsWith('fountain') && profile.events.length !== profile.observedShots)) errors.push(`${profile.productId}: invalid review or duration`);
    if (Math.abs(profile.source.segmentEnd - profile.source.segmentStart - profile.duration) > 0.01) errors.push('Source segment duration differs');
    let previous = -1;
    const eventIds = new Set();
    for (const event of profile.events) {
      if (eventIds.has(event.id) || !Number.isFinite(event.launch) || !Number.isFinite(event.burst) || event.launch < 0 || event.burst < event.launch || event.burst < previous || event.burst >= profile.duration || !(event.life > 0) || !['palm', 'peony', 'ring', 'palm-glitter', 'flower', 'ghost', 'willow', 'color-peony', 'bouquet', 'ghost-peony', 'wander'].includes(event.shape) || !event.colors.length || event.colors.some((color) => !/^#[a-f\d]{6}$/i.test(color))) errors.push(`${profile.productId}: invalid event ${event.id}`);
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
    if (profile.kind === 'shell-sample' && profile.events.length !== 1) errors.push('A shell sample must not fire the whole package');
  }
  return errors;
}
