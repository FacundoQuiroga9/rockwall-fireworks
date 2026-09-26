import { createFountainModel } from './playgroundFountain.js';

// This self-contained function also runs in the offline native WebView.
// Every particle is sampled from absolute profile time, never accumulated frames.
export function createPlaygroundRenderer(canvas, profiles, compact, makeFountain = createFountainModel, bases = {}) {
  const context = canvas.getContext('2d', { alpha: true });
  let width = 1, height = 1, quality = compact ? 'balanced' : 'high';
  let profileLimit = 1000, destroyed = false;
  const fountains = profiles.map((p) => p.stages ? makeFountain(p) : null);
  const images = new Map();
  if (typeof Image !== 'undefined') for (const [id, base] of Object.entries(bases)) {
    const image = new Image();
    image.onload = () => { if (!destroyed) draw(lastTime, active); };
    image.src = base.src; images.set(id, image);
  }
  let lastTime = 0, active = profiles.map((_, i) => i), count = 0;
  const noise = (seed) => { const n = Math.sin(seed * 12.9898) * 43758.5453; return n - Math.floor(n); };
  const resize = () => {
    const rect = canvas.getBoundingClientRect(); width = rect.width; height = rect.height;
    const ratio = Math.min(globalThis.devicePixelRatio || 1, compact ? 1.25 : 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0); draw(lastTime, active);
  };
  function dot(x, y, radius, color, alpha) {
    if (alpha <= 0 || count >= profileLimit) return;
    count++; context.fillStyle = color;
    if (radius > 1) { context.globalAlpha = Math.min(.18, alpha * .2); context.beginPath(); context.arc(x, y, radius * 2.8, 0, Math.PI * 2); context.fill(); }
    context.globalAlpha = Math.min(0.95, alpha * 1.2);
    context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
  }
  function draw(time, selected) {
    lastTime = time; active = selected; count = 0;
    context.clearRect(0, 0, width, height);
    const panes = profiles.length;
    // Camera scale never depends on the selection count. One panoramic world.
    const scale = Math.min(width / 1800, height / 850);
    const budget = compact ? 420 : 1000;
    const share = Math.floor(budget / Math.max(1, selected.length));
    profiles.forEach((profile, pane) => {
      if (!selected.includes(pane) || (!profile.stages && time >= profile.duration)) return;
      profileLimit = Math.min(budget, count + share);
      context.save();
      const cx = width * (panes === 1 ? .5 : .17 + pane * .66 / (panes - 1));
      const cy = Math.max(45, height * .25);
      const capacity = (quality === 'low' ? 0.42 : quality === 'balanced' ? 0.68 : 1) / Math.max(1, selected.length * .55);
      if (profile.stages) {
        const model = fountains[pane];
        const state = model.emission(time);
        const sparks = model.particles(time, capacity * .66);
        const base = bases[profile.productId];
        const photo = images.get(profile.productId);
        const floor = height * .87;
        // Geometry comes from a replaceable presentation asset, never the effect profile.
        const bodyHeight = Math.min(86, height * .145) * (base?.scale ?? 1);
        const crop = base?.crop || [0, 0, 1, 1];
        const bodyWidth = bodyHeight * (base?.aspect ?? .75);
        const left = cx - bodyWidth / 2, top = floor - bodyHeight;
        const nozzleX = left + bodyWidth * (base?.nozzle?.[0] ?? .5);
        const nozzleY = top + bodyHeight * (base?.nozzle?.[1] ?? .08);
        const tailLight = sparks.reduce((total, p) => total + p.alpha, 0) / 180;
        const light = Math.min(1, state.intensity * .7 + tailLight * .4);
        context.globalAlpha = .65; context.fillStyle = '#020508';
        context.beginPath(); context.ellipse(cx, floor + 1, bodyWidth * .7, bodyHeight * .09, 0, 0, Math.PI * 2); context.fill();
        // Stable dimensions and source crop before and after the photo loads.
        if (photo?.complete && photo.naturalWidth) {
          context.globalAlpha = .62 + light * .28;
          context.drawImage(photo, crop[0], crop[1], crop[2], crop[3], left, top, bodyWidth, bodyHeight);
        }
        if (light > .001) {
          const glow = context.createRadialGradient(nozzleX, nozzleY, 0, nozzleX, nozzleY, bodyHeight * 1.5);
          glow.addColorStop(0, `rgba(255,219,160,${light * .13})`); glow.addColorStop(1, 'rgba(255,219,160,0)');
          context.globalAlpha = 1; context.fillStyle = glow;
          context.fillRect(nozzleX - bodyHeight * 1.5, nozzleY - bodyHeight * 1.5, bodyHeight * 3, bodyHeight * 3);
        }
        // A short luminous core responds continuously; old sparks keep their birth state.
        const coreStages = [[state.previous, 1 - state.mix], [state.next, state.mix]];
        for (const [stage, weight] of coreStages) {
          const jets = stage.jets || [{ nozzle: 0, tilt: 0 }];
          for (const outlet of jets) {
            const uv = base?.nozzles?.[outlet.nozzle] || base?.nozzle || [.5,.08];
            const ox = left + bodyWidth * uv[0], oy = top + bodyHeight * uv[1];
            for (let line = 0; line < 5 && state.intensity * weight > .001; line++) {
              const length = height * .72 * state.height * (.1 + line * .014);
              context.globalAlpha = state.intensity * weight * .18 / jets.length;
              context.strokeStyle = '#ffe4b7'; context.lineWidth = 1;
              context.beginPath(); context.moveTo(ox + (line - 2) * .5, oy);
              context.lineTo(ox + (line - 2) * 2 + outlet.tilt * length * .62, oy - length); context.stroke();
            }
          }
        }
        const sprayWidth = Math.min(width, height * .8);
        for (const p of sparks) {
          const outlet = base?.nozzles?.[p.nozzle] || base?.nozzle || [.5,.08];
          const x = left + bodyWidth * outlet[0] + p.x * sprayWidth, y = top + bodyHeight * outlet[1] + p.y * height * .72;
          context.globalAlpha = p.alpha * .5; context.strokeStyle = p.color; context.lineWidth = compact ? .7 : 1;
          context.beginPath(); context.moveTo(x, y); context.lineTo(x - p.spread * sprayWidth * .016, y + (p.u < .5 ? 5 : -3)); context.stroke();
          dot(x, y, compact ? 1.05 : 1.5, p.color, p.alpha);
          if (quality !== 'low') dot(x - p.spread * 3, y + 3, .6, p.color, p.alpha * .25);
          if (p.cluster && p.clusterRadius && quality !== 'low') for (let arm = 0; arm < 5; arm++) {
            const a = arm * Math.PI * 2 / 5, r = p.clusterRadius * 13;
            dot(x + Math.cos(a) * r, y + Math.sin(a) * r, .85, '#f7dfb0', p.alpha * .75);
          }
        }
        context.restore(); return;
      }
      for (const event of profile.events) {
        const age = time - event.burst;
        const ex = cx + event.x * 700 * scale;
        if (time >= event.launch && age < 0 && event.launchVisible) {
          const progress = (time - event.launch) / Math.max(0.05, event.burst - event.launch);
          for (let t = 0; t < 6; t++) dot(ex, (height * .83) * (1 - progress) + cy * progress + t * 3 * scale, Math.max(.5, 1.3 * scale), event.launchColor || '#efcf98', .48 * (1 - t / 6));
        }
        if (age < 0 || age > event.life) continue;
        if (event.shape === 'bouquet') {
          const clusters = Math.max(6, Math.round((event.clusters ?? 24) * capacity));
          for (let i = 0; i < clusters; i++) {
            const salt = event.seed + i * 73, angle = noise(salt) * Math.PI * 2;
            const radial = (40 + noise(salt + 1) * 110) * (1 - Math.exp(-age * 1.9));
            const x = ex + Math.cos(angle) * radial * scale, y = cy + (Math.sin(angle) * radial + age * age * 14) * scale;
            const delay = (event.clusterDelay ?? .7) + noise(salt + 3) * .28;
            if (event.branchTrails && age < delay + .1) {
              const before = Math.max(0, age - .18), r0 = (40 + noise(salt + 1) * 110) * (1 - Math.exp(-before * 1.9));
              context.globalAlpha = Math.max(0, 1 - age / (delay + .1)) * .65;
              context.strokeStyle = event.branchColor || '#e2eafb'; context.lineWidth = Math.max(.65, scale);
              context.beginPath(); context.moveTo(ex + Math.cos(angle) * r0 * scale, cy + (Math.sin(angle) * r0 + before * before * 14) * scale); context.lineTo(x, y); context.stroke();
            }
            dot(x, y, Math.max(.5, scale), event.branchColor || '#e2eafb', Math.max(0, 1 - age / 1.1) * .65);
            const bloom = age - delay;
            const arms = event.clusterArms ?? 10, colors = event.clusterColors || ['#edc185'];
            if (bloom >= 0 && bloom < 1.4) for (let arm = 0; arm < arms; arm++) {
              const a = arm / arms * Math.PI * 2, r = (1 - Math.exp(-bloom * 4)) * (9 + noise(salt + 7) * 12) * scale;
              dot(x + Math.cos(a) * r, y + Math.sin(a) * r + bloom * bloom * 6 * scale, Math.max(.55, scale * (event.clusterPointSize ?? 1)), colors[arm % colors.length], Math.sin(Math.min(1, bloom / .12) * Math.PI / 2) * Math.pow(1 - bloom / 1.4, .7));
            }
          }
          continue;
        }
        const willow = event.shape === 'willow';
        const ghostPeony = event.shape === 'ghost-peony';
        const wander = event.shape === 'wander';
        const colorPeony = event.shape === 'color-peony' || ghostPeony || wander;
        const ghost = event.shape === 'ghost';
        const flower = event.shape === 'flower';
        const palm = event.shape.startsWith('palm') || ghost || willow;
        const ring = event.shape === 'ring';
        const n = colorPeony ? Math.round((event.arms || 55) * capacity) : willow ? Math.round((event.arms || 60) * capacity) : palm ? (event.arms || 9) : Math.round((ring ? 58 : 115) * capacity);
        const radius = event.radius ?? (flower ? 105 : ring ? 147 : palm ? 158 : 155);
        const grow = (t) => 1 - Math.exp(-Math.max(0, t) * 2.05);
        const fade = Math.pow(Math.max(0, 1 - age / event.life), .75);
        for (let i = 0; i < n; i++) {
          const seed = event.seed + i * 37;
          const angle = i / n * Math.PI * 2 + (palm ? -.35 : noise(seed) * .12);
          const radial = ring ? .94 + noise(seed + 1) * .06 : palm ? (event.radialMin ?? .77) + noise(seed + 1) * (1 - (event.radialMin ?? .77)) : Math.sqrt(noise(seed + 1)) * .7 + .3;
          // Wandering stars change direction after opening. Deterministic curves keep
          // pause/seek stable; they do not accumulate particles or create emitters.
          const turn = (t) => wander ? Math.max(0, t - .3) * 16 * Math.sin(t * (5 + noise(seed + 2) * 3) + seed) : 0;
          const px = (t) => ex + (Math.cos(angle) * radius * radial * grow(t) + turn(t)) * scale;
          const py = (t) => cy + (Math.sin(angle) * radius * radial * grow(t) + (ghost ? 7 : willow ? 12 : 20) * t * t + turn(t) * .5) * scale;
          const color = colorPeony ? event.colors[Math.floor(i / n * event.colors.length)] : ghost ? ((i / n + age * .22) % 1 < .5 ? event.colors[0] : event.colors[1]) : ring && age > 1.3 && noise(seed + 7) > .72 ? '#dddbda' : event.colors[i % event.colors.length];
          if (ghostPeony) {
            // Separate fading stars by sector; never replace the whole burst's
            // color in one frame or blend saturated colors into grey.
            const phase = Math.max(0, Math.min(1, (age - .55 - i / n * .55) / .55));
            const alpha = phase * phase * (3 - 2 * phase);
            dot(px(age), py(age), Math.max(.7, 2 * scale), color, fade * (1 - alpha));
            dot(px(age), py(age), Math.max(.65, 1.6 * scale), event.ghostColor || '#798fd5', fade * alpha);
            continue;
          }
          if (wander && age > .3) {
            context.globalAlpha = fade * .75; context.strokeStyle = '#e7eaf2'; context.lineWidth = Math.max(.65, scale);
            context.beginPath();
            for (let j = 0; j <= 4; j++) { const t = Math.max(.3, age - .13 + j * .0325); if (!j) context.moveTo(px(t), py(t)); else context.lineTo(px(t), py(t)); }
            context.stroke();
          }
          if (palm) {
            const trailColor = event.trailColor || (event.shape === 'palm-glitter' || willow ? '#f8cd91' : '#dce5fc');
            const trailSeconds = event.trailSeconds ?? .34;
            context.globalAlpha = fade * .7; context.strokeStyle = trailColor; context.lineWidth = Math.max(.65, 1.25 * scale);
            context.beginPath();
            for (let j = 0; j <= 10; j++) { const t = Math.max(0, age - trailSeconds + j * trailSeconds / 10); if (!j) context.moveTo(px(t), py(t)); else context.lineTo(px(t), py(t)); }
            context.stroke();
            const tails = quality === 'low' ? 3 : 5;
            for (let trail = tails; trail >= 1; trail--) {
              const t = Math.max(0, age - trail * .035);
              dot(px(t), py(t), Math.max(.6, (2 - trail / tails) * scale), event.trailColor || (event.shape === 'palm-glitter' || willow ? '#f8cd91' : '#cedbf6'), fade * .52 * (1 - trail / (tails + 2)));
            }
          }
          const glitter = !palm && !ring && !flower && !colorPeony && age > .72;
          // Smooth, low-contrast shimmer, not a flash or full-frame white fill.
          const intensity = glitter ? .5 + .22 * Math.sin(age * 7 + seed) : 1;
          if (flower && age > .25 && i % 6 === 0) {
            for (let j = 0; j < 3; j++) dot(px(age) + Math.cos(seed + j * 2.1) * age * 9 * scale, py(age) + Math.sin(seed + j * 2.1) * age * 9 * scale, Math.max(.5, scale), '#eecb91', fade * .45);
          }
          dot(px(age), py(age), Math.max(.65, (palm ? 2.7 : 2.0) * scale), wander && age > .7 ? '#e7eaf2' : glitter && age > 1.05 ? '#dae5ff' : color, fade * intensity);
          if (ring && age > .48) {
            const t = age - .48;
            dot(ex + Math.cos(angle) * radius * .52 * grow(t) * scale, cy + (Math.sin(angle) * radius * .52 * grow(t) + 14 * t * t) * scale, Math.max(.6, 1.35 * scale), color, fade * .75);
          }
        }
        if (palm && !ghost && !willow && age > .18) {
          const glitterCount = Math.round((event.glitterCount ?? (event.shape === 'palm-glitter' ? 105 : 42)) * capacity);
          for (let i = 0; i < glitterCount; i++) {
            const seed = event.seed + i * 91;
            const angle = noise(seed) * Math.PI * 2;
            const radius2 = radius * (.25 + noise(seed + 3) * .7) * grow(age);
            dot(ex + Math.cos(angle) * radius2 * scale, cy + (Math.sin(angle) * radius2 + 24 * age * age) * scale, Math.max(.5, .95 * scale), '#dae2f5', fade * (.24 + noise(seed + 5) * .35));
          }
        }
      }
      context.restore();
    });
    context.globalAlpha = 1;
    return count;
  }
  const observer = new ResizeObserver(resize); observer.observe(canvas); resize();
  return { draw, setQuality(value) { quality = value; }, destroy() { destroyed = true; images.forEach((image) => { image.onload = null; }); images.clear(); observer.disconnect(); context.clearRect(0, 0, width, height); } };
}
