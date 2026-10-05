import { projects, contact, site, serviceName } from '../data';
import type { Project, Mockup } from '../types';
import { esc, reducedMotion, $$ } from '../lib/env';
import { gsap, lockScroll } from '../lib/motion';
import { fill, waLink } from '../lib/whatsapp';
import { initMagnetic } from './magnetic';
import { pop } from './sound';
import { setCursorLabel } from './cursor';

const root = () => document.getElementById('case')!;
let current: Project | null = null;
let returnFocus: HTMLElement | null = null;
let sourceImg: HTMLElement | null = null;
const baseTitle = document.title;

const pathSlug = () => location.pathname.match(/^\/caso\/([^/]+)\/?$/)?.[1] ?? null;

function mockupHTML(m: Mockup, p: Project) {
  if (m.type === 'phone') {
    const pool = [p.images.cover, ...p.images.gallery];
    const grid = Array.from({ length: 15 }, (_, n) => pool[n % pool.length]);
    return `<figure class="mock mock--phone">
      <div class="mock__phone"><div class="mock__notch"></div>
        <div class="mock__ig-head"><span class="mock__avatar" style="--c:${p.colors[0]}"></span><b>${esc(contact.instagramHandle.replace('@', ''))}</b></div>
        <div class="mock__ig-grid">${grid.map((src) => `<img src="${src}" alt="" loading="lazy" />`).join('')}</div>
      </div><figcaption>${esc(m.caption ?? '')}</figcaption></figure>`;
  }
  if (m.type === 'box') {
    return `<figure class="mock mock--box"><div class="mock__box" style="--c:${p.colors[0]};--c2:${p.colors[1]}">
      <div class="mock__face mock__face--front"><img src="${m.image}" alt="" loading="lazy" /></div>
      <div class="mock__face mock__face--side"></div><div class="mock__face mock__face--top"></div>
    </div><figcaption>${esc(m.caption ?? '')}</figcaption></figure>`;
  }
  return `<figure class="mock mock--tote"><div class="mock__tote" style="--c:${p.colors[2]}">
    <div class="mock__handle"></div><div class="mock__print"><img src="${m.image}" alt="" loading="lazy" /></div>
  </div><figcaption>${esc(m.caption ?? '')}</figcaption></figure>`;
}

function caseHTML(p: Project) {
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const wa = waLink(fill(contact.messages.project, { project: p.title }));
  const facts: [string, string][] = [
    ['Cliente', p.client], ['Año', String(p.year)], ['Rol', p.role],
    ['Servicios', p.categories.map(serviceName).join(', ')], ['Herramientas', p.tools.join(', ')], ['Duración', p.duration],
  ];
  return `
  <div class="case__scroll" data-lenis-prevent>
    <button class="case__close" type="button" aria-label="Cerrar caso" data-cursor="cerrar">
      <span aria-hidden="true">✕</span><span class="micro">esc</span>
    </button>

    <header class="case__hero">
      <div class="case__hero-media"><img class="case__hero-img" src="${p.images.cover}" alt="${esc(p.title)}: portada del proyecto" /></div>
      <div class="case__hero-scrim"></div>
      <div class="case__hero-text wrap">
        <p class="case__eyebrow eyebrow">${p.categories.map(serviceName).map(esc).join(' · ')}</p>
        <h2 class="case__title display" id="case-title">${esc(p.title)}</h2>
        <p class="case__lead">${esc(p.short)}</p>
      </div>
      ${p.placeholder ? '<p class="case__placeholder micro">Proyecto de ejemplo · contenido placeholder</p>' : ''}
    </header>

    <div class="case__body paper">
      <section class="case__intro wrap" aria-label="Ficha y relato">
        <dl class="case__facts">
          ${facts.map(([k, v]) => `<div><dt class="micro">${k}</dt><dd>${esc(v)}</dd></div>`).join('')}
        </dl>
        <ol class="case__story">
          ${[['Reto', p.challenge], ['Idea', p.idea], ['Solución', p.solution]].map(([k, v], n) => `
            <li><span class="case__num cond">0${n + 1}</span><h3 class="display">${k}</h3><p>${esc(v)}</p></li>`).join('')}
        </ol>
      </section>

      <section class="case__section wrap" aria-label="Entregables">
        <ul class="case__deliverables">${p.deliverables.map((d) => `<li class="chip">${esc(d)}</li>`).join('')}</ul>
      </section>

      <section class="case__section wrap" aria-labelledby="case-gallery">
        <h3 class="case__h display" id="case-gallery">Galería</h3>
        <div class="case__masonry">
          ${p.images.gallery.map((src, n) => `<button type="button" class="case__shot" data-index="${n}" data-cursor="abrir" aria-label="Ampliar imagen ${n + 1}">
            <img src="${src}" alt="${esc(p.title)}, imagen ${n + 1}" loading="lazy" /></button>`).join('')}
        </div>
      </section>

      ${p.beforeAfter ? `
      <section class="case__section wrap" aria-labelledby="case-ba">
        <h3 class="case__h display" id="case-ba">Antes / después</h3>
        <div class="ba" style="--pos:50%">
          <img src="${p.beforeAfter.after}" alt="Después" loading="lazy" />
          <div class="ba__before"><img src="${p.beforeAfter.before}" alt="Antes" loading="lazy" /></div>
          <div class="ba__handle" aria-hidden="true"><span>◀ ▶</span></div>
          <span class="ba__tag ba__tag--l micro">antes</span><span class="ba__tag ba__tag--r micro">después</span>
          <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Comparar antes y después" />
        </div>
      </section>` : ''}

      <section class="case__section wrap" aria-labelledby="case-palette">
        <h3 class="case__h display" id="case-palette">Paleta</h3>
        <ul class="case__palette">
          ${p.colors.map((c) => `<li><button type="button" class="swatch" style="--c:${c}" data-copy="${c}" data-cursor="copiar">
            <span class="swatch__chip"></span><span class="swatch__hex cond">${c}</span><span class="micro">clic para copiar</span></button></li>`).join('')}
        </ul>
      </section>

      ${p.images.mockups.length ? `
      <section class="case__section wrap" aria-labelledby="case-mock">
        <h3 class="case__h display" id="case-mock">En el mundo real</h3>
        <div class="case__mockups">${p.images.mockups.map((m) => mockupHTML(m, p)).join('')}</div>
      </section>` : ''}

      ${p.video ? `<section class="case__section wrap"><video src="${p.video}" controls playsinline preload="none"></video></section>` : ''}

      <section class="case__cta wrap">
        <p class="display">¿Te gustó?</p>
        <a class="btn btn--plum case__want" href="${wa}" target="_blank" rel="noopener" data-magnetic>Quiero algo así <span class="arrow">↗</span></a>
      </section>

      <nav class="case__pager" aria-label="Otros proyectos">
        ${[['prev', '← anterior', prev], ['next', 'siguiente →', next]].map(([k, label, q]) => {
          const pr = q as Project;
          return `<a class="case__pager-link case__pager-link--${k}" href="/caso/${pr.slug}" data-slug="${pr.slug}" data-cursor="ver ↗">
            <span class="micro">${label}</span><span class="display">${esc(pr.title)}</span>
            <img class="case__pager-preview" src="${pr.images.cover}" alt="" loading="lazy" /></a>`;
        }).join('')}
      </nav>
    </div>
  </div>`;
}

// ---------- Lightbox ----------
function openLightbox(p: Project, index: number) {
  const lb = document.getElementById('lightbox')!;
  let i = index;
  const render = () => {
    lb.innerHTML = `<button class="lightbox__close" type="button" aria-label="Cerrar imagen">✕</button>
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Imagen anterior">←</button>
      <img src="${p.images.gallery[i]}" alt="${esc(p.title)}, imagen ${i + 1}" />
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Imagen siguiente">→</button>
      <p class="lightbox__count micro">${i + 1} / ${p.images.gallery.length}</p>`;
    lb.querySelector<HTMLButtonElement>('.lightbox__close')!.focus();
  };
  const go = (d: number) => { i = (i + d + p.images.gallery.length) % p.images.gallery.length; render(); };
  const close = () => { lb.hidden = true; lb.innerHTML = ''; document.removeEventListener('keydown', onKey, true); root().querySelector<HTMLElement>(`.case__shot[data-index="${index}"]`)?.focus(); };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'Tab') trap(e, lb);
  };
  lb.onclick = (e) => {
    const t = e.target as Element;
    if (t.closest('.lightbox__close') || t === lb) close();
    else if (t.closest('.lightbox__nav--prev')) go(-1);
    else if (t.closest('.lightbox__nav--next')) go(1);
  };
  document.addEventListener('keydown', onKey, true);
  lb.hidden = false;
  render();
}

function trap(e: KeyboardEvent, container: HTMLElement) {
  const f = $$<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', container).filter((x) => x.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function toast(msg: string) {
  const t = document.getElementById('toast')!;
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout((t as unknown as { _h: number })._h);
  (t as unknown as { _h: number })._h = window.setTimeout(() => t.classList.remove('is-on'), 1800);
}

function wire(p: Project) {
  const el = root();
  el.querySelector('.case__close')!.addEventListener('click', () => closeCase());
  el.querySelectorAll<HTMLButtonElement>('.case__shot').forEach((b) => b.addEventListener('click', () => openLightbox(p, +b.dataset.index!)));
  el.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy!); toast(`Copiado ${b.dataset.copy}`); } catch { toast(b.dataset.copy!); }
    pop(1.4);
    gsap.fromTo(b.querySelector('.swatch__chip'), { scale: 0.8 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  }));
  const ba = el.querySelector<HTMLElement>('.ba');
  ba?.querySelector<HTMLInputElement>('.ba__range')!.addEventListener('input', (e) => ba.style.setProperty('--pos', `${(e.target as HTMLInputElement).value}%`));
  el.querySelectorAll<HTMLAnchorElement>('.case__pager-link').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    openCase(a.dataset.slug!, null, true);
  }));
  // Preview flotante en hover del pager
  el.querySelectorAll<HTMLElement>('.case__pager-link').forEach((a) => {
    const img = a.querySelector<HTMLElement>('.case__pager-preview')!;
    a.addEventListener('pointermove', (e) => {
      const r = a.getBoundingClientRect();
      img.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -110%) rotate(-4deg)`;
    });
  });
  initMagnetic(el);

  if (!reducedMotion()) {
    const sc = el.querySelector<HTMLElement>('.case__scroll')!;
    // Parallax del hero dentro del overlay
    const hero = el.querySelector<HTMLElement>('.case__hero-img')!;
    sc.addEventListener('scroll', () => { hero.style.transform = `translateY(${sc.scrollTop * 0.3}px) scale(${1 + sc.scrollTop * 0.0002})`; }, { passive: true });
    gsap.from(el.querySelectorAll('.case__title, .case__lead, .case__eyebrow'), { y: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.25 });
  }
}

const onKey = (e: KeyboardEvent) => {
  if (!current || !document.getElementById('lightbox')!.hidden) return;
  if (e.key === 'Escape') closeCase();
  if (e.key === 'Tab') trap(e, root());
};

function swap(p: Project) {
  const el = root();
  el.innerHTML = caseHTML(p);
  el.style.setProperty('--accent', p.colors[0]);
  el.hidden = false;
  current = p;
  document.title = `${p.title} — ${site.name}`;
  wire(p);
}

/** Abre un caso. `from` es la imagen de la tarjeta para la transición compartida. */
export function openCase(slug: string, from?: HTMLElement | null, replace = false) {
  const p = projects.find((x) => x.slug === slug);
  if (!p) return;
  const url = `/caso/${slug}`;
  if (location.pathname !== url) history[replace || current ? 'replaceState' : 'pushState']({ case: slug }, '', url);
  if (!current) returnFocus = document.activeElement as HTMLElement;
  sourceImg = from ?? null;

  const run = () => {
    setCursorLabel(null);
    swap(p);
    lockScroll(true);
    document.addEventListener('keydown', onKey);
    root().querySelector<HTMLElement>('.case__close')!.focus({ preventScroll: true });
  };

  const vt = (document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }).startViewTransition;
  if (vt && !reducedMotion()) {
    if (from) from.style.viewTransitionName = 'case-hero';
    const t = vt.call(document, () => {
      if (from) from.style.viewTransitionName = '';
      run();
      root().querySelector<HTMLElement>('.case__hero-img')!.style.viewTransitionName = 'case-hero';
    });
    void t.finished.finally(() => { const h = root().querySelector<HTMLElement>('.case__hero-img'); if (h) h.style.viewTransitionName = ''; });
  } else if (!reducedMotion()) {
    run();
    gsap.from(root(), { clipPath: 'inset(50% 50% 50% 50% round 24px)', duration: 0.9, ease: 'expo.inOut' });
  } else {
    run();
  }
}

export function closeCase(fromPop = false) {
  if (!current) return;
  const done = () => {
    setCursorLabel(null);
    root().hidden = true;
    root().innerHTML = '';
    current = null;
    document.title = baseTitle;
    lockScroll(false);
    document.removeEventListener('keydown', onKey);
    returnFocus?.focus({ preventScroll: true });
  };
  if (!fromPop) history.pushState({}, '', '/');
  const vt = (document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }).startViewTransition;
  const target = sourceImg && document.contains(sourceImg) && sourceImg.closest('.card:not(.is-hidden)') ? sourceImg : null;
  if (vt && !reducedMotion() && target) {
    root().querySelector<HTMLElement>('.case__hero-img')!.style.viewTransitionName = 'case-hero';
    const t = vt.call(document, () => {
      done();
      target.style.viewTransitionName = 'case-hero';
    });
    void t.finished.finally(() => (target.style.viewTransitionName = ''));
  } else if (!reducedMotion()) {
    gsap.to(root(), { opacity: 0, y: 40, duration: 0.4, ease: 'power2.in', onComplete: () => { gsap.set(root(), { clearProps: 'all' }); done(); } });
  } else done();
}

export function initCaseRouting() {
  window.addEventListener('popstate', () => {
    const slug = pathSlug();
    if (slug) openCase(slug, null, true);
    else closeCase(true);
  });
  const slug = pathSlug();
  if (slug) openCase(slug);
}
