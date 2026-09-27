import { useEffect, useRef, useState } from 'react';

// Native horizontal scrolling for touch/trackpads, optional mouse drag. There
// is no snapping, timer, wheel interception or vertical page scroll override.
export default function ProductRail({ children, resetKey }) {
  const rail = useRef(null), gesture = useRef(null), suppressClick = useRef(false);
  const [edges, setEdges] = useState({ before: false, after: false });
  useEffect(() => {
    const node = rail.current;
    const update = () => setEdges({ before: node.scrollLeft > 2, after: node.scrollLeft + node.clientWidth < node.scrollWidth - 2 });
    node.scrollLeft = 0; update();
    const observer = new ResizeObserver(update); observer.observe(node);
    node.addEventListener('scroll', update, { passive: true });
    return () => { observer.disconnect(); node.removeEventListener('scroll', update); };
  }, [resetKey]);
  const move = direction => rail.current.scrollBy({ left: direction * rail.current.clientWidth * .75, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  const finish = event => {
    if (gesture.current?.dragged) suppressClick.current = true;
    gesture.current = null; rail.current.classList.remove('is-dragging');
    if (rail.current.hasPointerCapture(event.pointerId)) rail.current.releasePointerCapture(event.pointerId);
  };
  return <div className="playground-rail" data-before={edges.before} data-after={edges.after}>
    <button type="button" className="playground-rail-arrow" aria-label="Previous products" aria-controls="playground-products" disabled={!edges.before} onClick={() => move(-1)}>‹</button>
    <div id="playground-products" className="playground-products" ref={rail} role="group" aria-label="Available fireworks"
      onPointerDown={event => {
        suppressClick.current = false;
        if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a,input,select')) return;
        gesture.current = { x: event.clientX, y: event.clientY, left: rail.current.scrollLeft, dragged: false };
      }}
      onPointerMove={event => {
        const g = gesture.current; if (!g) return;
        const dx = event.clientX - g.x;
        if (!g.dragged && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(event.clientY - g.y)) {
          g.dragged = true; rail.current.setPointerCapture(event.pointerId); rail.current.classList.add('is-dragging');
        }
        if (g.dragged) { event.preventDefault(); rail.current.scrollLeft = g.left - dx; }
      }} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={() => { gesture.current = null; rail.current.classList.remove('is-dragging'); }}
      onDragStart={event => event.preventDefault()}
      onClickCapture={event => { if (suppressClick.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
      onFocusCapture={event => {
        const a = event.target.getBoundingClientRect(), b = rail.current.getBoundingClientRect();
        if (a.left < b.left + 6) rail.current.scrollBy({ left: a.left - b.left - 6 });
        else if (a.right > b.right - 6) rail.current.scrollBy({ left: a.right - b.right + 6 });
      }}
      onKeyDown={event => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const cards = [...rail.current.querySelectorAll('.playground-product')], current = cards.indexOf(document.activeElement);
        if (current < 0) return;
        event.preventDefault();
        cards[event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : Math.max(0, Math.min(cards.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)))].focus({ preventScroll: true });
      }}>{children}</div>
    <button type="button" className="playground-rail-arrow" aria-label="Next products" aria-controls="playground-products" disabled={!edges.after} onClick={() => move(1)}>›</button>
  </div>;
}
