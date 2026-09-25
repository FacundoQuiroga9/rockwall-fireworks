import { useEffect } from 'react';

const sequences = {
  line: { frames: [{ transform: 'translateY(110%) rotate(2deg)' }, { transform: 'translateY(0) rotate(0)' }], duration: 680, stagger: 110 },
  product: { frames: [
    { transform: 'perspective(1000px) translateY(38px) rotateX(5deg) rotateY(-6deg) rotateZ(-2deg) scale(.96)', opacity: .3 },
    { transform: 'perspective(1000px) translateY(-5px) rotateX(0) rotateY(1deg) rotateZ(.4deg) scale(1)', opacity: 1, offset: .75 },
    { transform: 'perspective(1000px) translateY(0) rotateX(0) rotateY(0) rotateZ(0) scale(1)' },
  ], duration: 900, stagger: 0 },
  brand: { frames: [{ transform: 'translateY(22px) rotate(-8deg) scale(.8)', opacity: 0 }, { transform: 'translateY(-3px) rotate(2deg) scale(1.03)', opacity: 1, offset: .72 }, { transform: 'none' }], duration: 560, stagger: 48 },
  trail: { frames: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], duration: 600, stagger: 0 },
  photo: { frames: [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], duration: 750, stagger: 0 },
  graphic: { frames: [{ transform: 'rotate(-10deg) scale(.9)', opacity: 0 }, { transform: 'rotate(-4deg) scale(1)', opacity: 1 }], duration: 700, stagger: 0 },
  clock: { frames: [{ transform: 'translateX(35px)', opacity: 0 }, { transform: 'none', opacity: 1 }], duration: 600, stagger: 0 },
  calendar: { frames: [{ transform: 'translateY(12px)', opacity: 0 }, { transform: 'none', opacity: 1 }], duration: 420, stagger: 60 },
  copy: { frames: [{ opacity: 0 }, { opacity: 1 }], duration: 500, stagger: 60 },
};

// No hidden default styles; each sequence plays once per mount and cancels on
// reduced motion or unmount. Nested title masks own their own choreography.
export const useReveal = () => {
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const running = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (media.matches) return;
        const elements = [...target.querySelectorAll('[data-motion], [data-reveal-item]')]
          .filter(element => element.closest('[data-reveal]') === target);
        elements.forEach((element, index) => {
          const sequence = sequences[element.dataset.motion] ?? sequences.copy;
          const animation = element.animate(sequence.frames, {
            duration: sequence.duration, delay: Math.min(index * sequence.stagger, 430),
            easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards',
          });
          running.add(animation);
          animation.onfinish = animation.oncancel = () => running.delete(animation);
        });
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    const stopMotion = () => { if (media.matches) [...running].forEach(animation => animation.cancel()); };
    media.addEventListener('change', stopMotion);
    return () => {
      observer.disconnect();
      [...running].forEach(animation => animation.cancel());
      media.removeEventListener('change', stopMotion);
    };
  }, []);
};
