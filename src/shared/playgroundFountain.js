// Pure, bounded emission sampling. Each birth owns its parameters for its whole life.
// No frame accumulation: pause, seek and resume sample the same particle identities.
export function createFountainModel(profile) {
  const noise = (seed) => { const n = Math.sin(seed * 12.9898) * 43758.5453; return n - Math.floor(n); };
  const smooth = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
  const ending = profile.ending;
  const maxLife = ending.tailSeconds;
  const rate = 150;
  const seed = profile.stages.reduce((n, s) => n + s.end * 97, 714);
  function emission(time) {
    const index = Math.max(0, profile.stages.findLastIndex((s) => s.start <= time));
    const next = profile.stages[index];
    const previous = profile.stages[Math.max(0, index - 1)];
    const mix = index ? smooth((time - next.start) / Math.max(.001, next.transitionSeconds ?? .7)) : 1;
    const blend = (key, fallback) => (previous[key] ?? fallback) * (1 - mix) + (next[key] ?? fallback) * mix;
    const exhaustion = 1 - smooth((time - ending.fadeStart) / (ending.emissionEnd - ending.fadeStart));
    const power = time < 0 || time >= ending.emissionEnd ? 0 : smooth(time / .35) * exhaustion;
    return { power, mix, previous, next, height: blend('height') * (.35 + .65 * power), spread: blend('spread'), intensity: blend('intensity') * power, density: blend('density', 1) * power, clusters: blend('clusters', 0) };
  }
  function particles(time, capacity = 1) {
    const result = [];
    // At most rate * maxLife candidates, regardless of playback length or phase count.
    for (let id = Math.max(0, Math.ceil((time - maxLife) * rate)); id <= Math.floor(Math.min(time, ending.emissionEnd) * rate); id++) {
      const born = id / rate;
      const salt = seed + id * 43;
      const life = maxLife * (.64 + noise(salt + 9) * .36);
      const age = time - born;
      if (age < 0 || age >= life || noise(salt + 19) > capacity) continue;
      const state = emission(born);
      if (state.power <= 0 || noise(salt + 21) > state.density) continue;
      // Select a palette at birth. Never interpolate saturated colors into grey.
      const birthStage = noise(salt + 27) < state.mix ? state.next : state.previous;
      const palette = birthStage.colors;
      const jets = birthStage.jets || [{ nozzle: 0, tilt: 0 }];
      const jet = jets[id % jets.length];
      const color = palette[Math.floor(noise(salt + 29) * palette.length)];
      const u = age / life;
      const spread = (noise(salt) - .5) * state.spread + jet.tilt * .62;
      const lift = state.height * (.48 + noise(salt + 1) * .52) * (1 - Math.abs(jet.tilt) * .28);
      result.push({ id, born, life, color, spread, lift, nozzle: jet.nozzle, intensity: state.intensity,
        x: spread * u, y: -4 * u * (1 - u) * lift,
        alpha: smooth(age / .08) * Math.pow(1 - u, .65) * state.intensity,
        cluster: noise(salt + 31) < state.clusters * .13,
        clusterRadius: u > .38 && u < .78 ? Math.sin((u - .38) / .4 * Math.PI) : 0,
        u,
      });
    }
    return result;
  }
  return { emission, particles, maxLife, emissionEnd: ending.emissionEnd, playbackEnd: Math.max(profile.duration, ending.emissionEnd + maxLife) };
}
