const PALETTES = [
  ['255, 158, 83', '255, 213, 132'],
  ['120, 171, 255', '192, 156, 255'],
  ['255, 158, 83', '255, 213, 132', '120, 171, 255'],
  ['246, 147, 194', '192, 156, 255'],
  ['116, 220, 201', '255, 213, 132'],
];

function profileFor(width) {
  if (width <= 700) return {
    stars: 130, particles: [14, 22, 30], concurrent: 2,
    interval: [2.8, 4.2], fps: 24, pixelRatio: 1.25, trails: 2,
  };
  if (width <= 1100) return {
    stars: 220, particles: [20, 32, 46], concurrent: 2,
    interval: [2.1, 3.5], fps: 30, pixelRatio: 1.5, trails: 3,
  };
  return {
    stars: 360, particles: [26, 42, 62], concurrent: 3,
    interval: [1.65, 2.8], fps: 30, pixelRatio: 1.5, trails: 3,
  };
}

// Visible time only: offscreen/background pauses never fast-forward a burst.
export function createNightSky(canvas) {
  const context = canvas.getContext('2d');
  if (!context) return { setPaused() {}, destroy() {} };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1;
  let height = 1;
  let profile = profileFor(width);
  let stars = [];
  let fireworks = [];
  let clock = 0;
  let nextLaunch = 0.65;
  let launchIndex = 0;
  let frame = null;
  let previousTime = null;
  let inView = false;
  let paused = false;
  let destroyed = false;

  const random = (min, max) => min + Math.random() * (max - min);
  const canAnimate = () => !destroyed && !paused && inView &&
    document.visibilityState !== 'hidden' && !reducedMotion.matches;

  function launch() {
    const compact = width <= 700;
    const size = [1, 0, 2, 1, 0][launchIndex % 5];
    // Keep the main bursts in open sky; the lower launches pass behind Dallas.
    const positions = compact
      ? [[0.87, 0.42], [0.12, 0.6], [0.8, 0.53], [0.08, 0.72], [0.91, 0.64]]
      : [[0.56, 0.25], [0.92, 0.2], [0.76, 0.25], [0.59, 0.57], [0.94, 0.52]];
    const [px, py] = positions[launchIndex % positions.length];
    const palette = PALETTES[launchIndex % PALETTES.length];
    const count = profile.particles[size];
    const radius = Math.min(width * (compact ? [0.09, 0.16, 0.23][size] : [0.05, 0.085, 0.135][size]), [85, 145, 210][size]);
    const life = [2.1, 2.8, 3.4][size];
    fireworks.push({
      born: clock,
      x: width * (px + random(-0.025, 0.025)),
      y: height * (py + random(-0.025, 0.025)),
      ascent: random(0.85, 1.55),
      drift: random(-0.06, 0.06) * width,
      radius,
      life,
      rise: radius * random(1.1, 1.65),
      color: palette[0],
      wind: random(-5, 5),
      squash: random(0.82, 1),
      particles: Array.from({ length: count }, (_, index) => ({
        angle: index * Math.PI * 2 / count + random(-0.025, 0.025),
        speed: random(size === 0 ? 0.8 : 0.45, 1),
        life: life * random(0.7, 1),
        color: palette[index % palette.length],
      })),
    });
    launchIndex += 1;
    // Breathing space after each little group, with occasional overlapping bursts.
    nextLaunch = clock + random(...profile.interval) + (launchIndex % 5 === 0 ? 2.4 : 0);
  }

  function drawFirework(firework) {
    const age = clock - firework.born;
    context.lineCap = 'round';
    if (age < firework.ascent) {
      const progress = age / firework.ascent;
      const alpha = Math.sin(progress * Math.PI) * 0.46;
      context.strokeStyle = `rgba(${firework.color}, ${alpha})`;
      context.lineWidth = 1.15;
      context.beginPath();
      for (let step = 0; step < 5; step += 1) {
        const t = Math.max(0, progress - step * 0.025);
        const x = firework.x - firework.drift * (1 - t) ** 2;
        const y = firework.y + firework.rise * (1 - t) ** 1.6;
        if (step === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      return;
    }
    const burstAge = age - firework.ascent;
    for (const particle of firework.particles) {
      if (burstAge > particle.life) continue;
      // Soft onset rather than a bright core flash; particles gradually fall away.
      const opacity = Math.min(burstAge / 0.28, 1) *
        (1 - burstAge / particle.life) ** 1.15 * 0.88;
      const headDistance = firework.radius * particle.speed * (1 - Math.exp(-burstAge * 1.45));
      const tailTime = Math.max(0, burstAge - 0.14);
      const tailDistance = firework.radius * particle.speed * (1 - Math.exp(-tailTime * 1.45));
      context.strokeStyle = `rgba(${particle.color}, ${opacity * 0.35})`;
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(
        firework.x + Math.cos(particle.angle) * tailDistance + firework.wind * tailTime,
        firework.y + Math.sin(particle.angle) * tailDistance * firework.squash + tailTime * tailTime * 9,
      );
      context.lineTo(
        firework.x + Math.cos(particle.angle) * headDistance + firework.wind * burstAge,
        firework.y + Math.sin(particle.angle) * headDistance * firework.squash + burstAge * burstAge * 9,
      );
      context.stroke();
      for (let trail = profile.trails - 1; trail >= 0; trail -= 1) {
        const t = Math.max(0, burstAge - trail * 0.075);
        const distance = firework.radius * particle.speed * (1 - Math.exp(-t * 1.45));
        const x = firework.x + Math.cos(particle.angle) * distance + firework.wind * t;
        const y = firework.y + Math.sin(particle.angle) * distance * firework.squash + t * t * 9;
        context.fillStyle = `rgba(${particle.color}, ${opacity * (1 - trail * 0.3)})`;
        context.beginPath();
        context.arc(x, y, trail === 0 ? 1.35 : 0.85, 0, Math.PI * 2);
        context.fill();
      }
    }
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      const shimmer = reducedMotion.matches ? 0.85 :
        0.85 + Math.sin(clock * star.speed + star.phase) * 0.14;
      context.fillStyle = `rgba(${star.color}, ${star.alpha * shimmer})`;
      context.beginPath();
      context.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
      context.fill();
    }
    if (reducedMotion.matches) return;
    fireworks.forEach(drawFirework);
  }

  function tick(time) {
    frame = null;
    if (!canAnimate()) return;
    if (previousTime === null) previousTime = time;
    const delta = time - previousTime;
    if (delta >= 1000 / profile.fps) {
      clock += Math.min(delta / 1000, 0.1);
      previousTime = time;
      fireworks = fireworks.filter(item => clock - item.born < item.ascent + item.life);
      if (clock >= nextLaunch && fireworks.length < profile.concurrent) launch();
      draw();
    }
    frame = window.requestAnimationFrame(tick);
  }

  function sync() {
    if (frame !== null) window.cancelAnimationFrame(frame);
    frame = null;
    previousTime = null;
    if (destroyed) return;
    draw();
    if (canAnimate()) frame = window.requestAnimationFrame(tick);
  }

  function resize() {
    if (destroyed) return;
    const bounds = canvas.getBoundingClientRect();
    const nextWidth = Math.max(1, bounds.width);
    const nextHeight = Math.max(1, bounds.height);
    const nextProfile = profileFor(nextWidth);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, nextProfile.pixelRatio);
    // Browser chrome/URL bars can resize without changing the hero itself.
    // Preserve the scene and paused frame if its drawing surface is unchanged.
    if (width === nextWidth && height === nextHeight &&
      canvas.width === Math.round(nextWidth * pixelRatio) &&
      canvas.height === Math.round(nextHeight * pixelRatio)) return;
    width = nextWidth;
    height = nextHeight;
    profile = nextProfile;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const noise = seed => {
      const value = Math.sin(seed * 127.1) * 43758.5453;
      return value - Math.floor(value);
    };
    stars = Array.from({ length: profile.stars }, (_, index) => {
      const layer = index % 10 < 6 ? 0 : index % 10 < 9 ? 1 : 2;
      return {
        x: noise(index + 1),
        y: noise(index + 611),
        size: [0.4, 0.8, 1.25][layer] + noise(index + 207) * 0.3,
        alpha: [0.4, 0.64, 0.84][layer],
        color: ['167, 192, 235', '223, 230, 255', '255, 222, 176'][index % 3],
        phase: index * 1.7,
        speed: 0.2 + (index % 5) * 0.06,
      };
    });
    fireworks = [];
    nextLaunch = clock + 0.65;
    sync();
  }

  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  }, { threshold: 0 });
  const resizeObserver = new ResizeObserver(resize);
  intersection.observe(canvas);
  resizeObserver.observe(canvas);
  reducedMotion.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('resize', resize);
  resize();

  return {
    setPaused(value) {
      paused = value;
      sync();
    },
    destroy() {
      destroyed = true;
      if (frame !== null) window.cancelAnimationFrame(frame);
      intersection.disconnect();
      resizeObserver.disconnect();
      reducedMotion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', resize);
      context.clearRect(0, 0, width, height);
    },
  };
}
