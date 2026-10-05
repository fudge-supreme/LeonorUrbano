import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import { reducedMotion } from './env';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

export { gsap, ScrollTrigger, SplitText, Flip };

/** Velocidad de scroll suavizada (px/frame aprox.), compartida por marquee y carrusel. */
export const scroll = { velocity: 0 };

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function initSmoothScroll() {
  if (reducedMotion()) {
    let last = window.scrollY;
    gsap.ticker.add(() => {
      scroll.velocity = (window.scrollY - last) * 0.5;
      last = window.scrollY;
    });
    return;
  }
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.4, allowNestedScroll: true });
  lenis.on('scroll', (e: Lenis) => {
    scroll.velocity = e.velocity;
    ScrollTrigger.update();
  });
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anclas internas con scroll suave
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const target = document.querySelector(a.getAttribute('href')!);
    if (!target) return;
    e.preventDefault();
    lenis!.scrollTo(target as HTMLElement, { offset: -10, duration: 1.4 });
    (target as HTMLElement).setAttribute('tabindex', '-1');
    (target as HTMLElement).focus({ preventScroll: true });
  });
}

export function lockScroll(lock: boolean) {
  if (lenis) lock ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = lock ? 'hidden' : '';
}
