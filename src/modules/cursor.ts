import { gsap } from '../lib/motion';
import { finePointer, reducedMotion } from '../lib/env';

/**
 * Cursor custom: punto amarillo + anillo con lerp.
 * Estados por atributo en cualquier elemento:
 *   data-cursor="ver ↗" | "arrastra" | "copiar" | "abrir" …  → anillo grande con texto
 *   a, button, [data-cursor-hover]                           → anillo crece
 */
export function initCursor() {
  if (!finePointer()) return;
  const root = document.querySelector<HTMLElement>('.cursor')!;
  const dot = root.querySelector<HTMLElement>('.cursor__dot')!;
  const ring = root.querySelector<HTMLElement>('.cursor__ring')!;
  const label = root.querySelector<HTMLElement>('.cursor__label')!;
  document.body.classList.add('has-cursor');

  const slow = reducedMotion() ? 0.01 : 0.5;
  const dx = gsap.quickTo(dot, 'x', { duration: 0.01 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.01 });
  const rx = gsap.quickTo(ring, 'x', { duration: slow, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: slow, ease: 'power3' });

  let current: Element | null = null;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    root.classList.remove('is-hidden');
    const t = (e.target as Element).closest('[data-cursor], a, button, [data-cursor-hover], input, select, textarea, summary, label');
    if (t === current) return;
    current = t;
    const text = t?.getAttribute('data-cursor');
    root.classList.toggle('is-label', !!text);
    root.classList.toggle('is-hover', !!t && !text);
    label.textContent = text ?? '';
  }, { passive: true });
  document.addEventListener('pointerleave', () => root.classList.add('is-hidden'));
  window.addEventListener('pointerdown', () => root.classList.add('is-down'));
  window.addEventListener('pointerup', () => root.classList.remove('is-down'));
}

/** Permite que un módulo cambie la etiqueta del cursor temporalmente (p. ej. «arrastrando»). */
export function setCursorLabel(text: string | null) {
  const root = document.querySelector<HTMLElement>('.cursor');
  if (!root) return;
  root.classList.toggle('is-label', !!text);
  root.querySelector<HTMLElement>('.cursor__label')!.textContent = text ?? '';
}
