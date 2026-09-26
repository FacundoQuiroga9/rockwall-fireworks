// A single seeded field in normalized scene coordinates. Independent of products,
// animation time, device size and quality; never tiled or regenerated per frame.
export function starPositions() {
  let seed = 390172;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  return Array.from({ length: 190 }, () => ({ x: random() * 100, y: random() * 100, size: .65 + random() * 1.25, opacity: .13 + random() ** 2 * .48, tone: ['#dae4f2','#f1e6d5','#bbcce3'][Math.floor(random() * 3)], phase: random() * -30, period: 16 + random() * 19 }));
}
export function starMarkup() {
  return starPositions().map(s => `<i style="left:${s.x.toFixed(3)}%;top:${s.y.toFixed(3)}%;width:${s.size.toFixed(2)}px;height:${s.size.toFixed(2)}px;background:${s.tone};opacity:${s.opacity.toFixed(3)};animation-delay:${s.phase.toFixed(2)}s;animation-duration:${s.period.toFixed(2)}s"></i>`).join('');
}
