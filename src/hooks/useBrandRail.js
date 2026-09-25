import { useEffect, useRef, useState } from 'react';

export function useBrandRail(rowRef) {
  const [edges, setEdges] = useState({ start: true, end: false });
  const drag = useRef(null);
  const suppressClick = useRef(false);
  useEffect(() => {
    const row = rowRef.current;
    const measure = () => setEdges({ start: row.scrollLeft <= 1, end: row.scrollLeft + row.clientWidth >= row.scrollWidth - 1 });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    row.addEventListener('scroll', measure, { passive: true });
    return () => { observer.disconnect(); row.removeEventListener('scroll', measure); };
  }, [rowRef]);
  const finish = (event) => {
    if (drag.current?.moved) {
      suppressClick.current = true;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drag.current = null;
    event.currentTarget.classList.remove('is-dragging');
  };
  return {
    edges,
    advance(direction) {
      const row = rowRef.current;
      row.scrollBy({ left: direction * row.clientWidth * .75, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    },
    handlers: {
      onPointerDown(event) {
        suppressClick.current = false;
        if (event.pointerType === 'mouse' && event.button === 0) drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
      },
      onPointerMove(event) {
        const state = drag.current;
        if (!state) return;
        const distance = event.clientX - state.x;
        if (Math.abs(distance) > 6 || state.moved) {
          state.moved = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.classList.add('is-dragging');
          event.currentTarget.scrollLeft = state.left - distance;
          event.preventDefault();
        }
      },
      onPointerUp: finish,
      onPointerCancel: finish,
      onLostPointerCapture: finish,
      onClickCapture(event) {
        if (suppressClick.current && event.detail !== 0) { event.preventDefault(); event.stopPropagation(); }
        suppressClick.current = false;
      },
      onDragStart(event) { event.preventDefault(); },
    },
  };
}
