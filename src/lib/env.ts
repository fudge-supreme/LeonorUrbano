const mq = (q: string) => window.matchMedia(q);

// En desarrollo, ?motion=on fuerza el movimiento completo aunque el sistema pida reducirlo (solo para probar).
const forceMotion = import.meta.env.DEV && new URLSearchParams(location.search).get('motion') === 'on';
export const reducedMotion = () => !forceMotion && mq('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => mq('(hover: hover) and (pointer: fine)').matches;
export const isMobile = () => mq('(max-width: 767px)').matches;

/** Escapa texto para interpolarlo en plantillas HTML. */
export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

/** Ejecuta `fn` la primera vez que `el` se acerca al viewport. */
export function whenNear(el: Element, fn: () => void, rootMargin = '300px') {
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      fn();
    }
  }, { rootMargin });
  io.observe(el);
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
