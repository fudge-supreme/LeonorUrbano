import { gsap, ScrollTrigger, SplitText } from '../lib/motion';
import { reducedMotion } from '../lib/env';

/**
 * Una sola orquestación por sección: cada [data-reveal-section] anima, al entrar,
 * sus titulares [data-split] (líneas con máscara) y luego sus [data-reveal] (escalonados).
 * Nada de fade-up genérico: los titulares suben por máscara y lo demás entra con un leve giro de papel.
 */
export function initReveals(root: ParentNode = document) {
  if (reducedMotion()) return;
  root.querySelectorAll<HTMLElement>('[data-reveal-section]:not([data-reveal-ready])').forEach((section) => {
    section.dataset.revealReady = '';
    const heads = [...section.querySelectorAll<HTMLElement>('[data-split]')];
    const items = [...section.querySelectorAll<HTMLElement>('[data-reveal]')];
    // Las líneas partidas se deshacen al terminar, para que el texto vuelva a fluir al redimensionar.
    const splits: SplitText[] = [];
    const tl = gsap.timeline({ paused: true, onComplete: () => splits.forEach((s) => s.revert()) });

    heads.forEach((h, i) => {
      const split = SplitText.create(h, { type: 'lines,words', mask: 'lines', linesClass: 'split-line' });
      splits.push(split);
      tl.from(split.words, { yPercent: 115, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.035 }, i * 0.12);
    });
    if (items.length) {
      tl.from(items, { y: 40, rotate: () => gsap.utils.random(-3, 3), autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06 }, heads.length ? 0.25 : 0);
    }
    ScrollTrigger.create({ trigger: section, start: 'top 78%', once: true, onEnter: () => tl.play() });
  });
}
