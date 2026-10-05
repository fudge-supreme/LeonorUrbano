import { site, projects } from '../data';
import { esc } from '../lib/env';

/** Sección que enseña la anatomía de un caso, con una mini-página anotada. */
export function renderCaseDemo(el: HTMLElement) {
  const d = site.caseDemo;
  const ex = projects.find((p) => p.slug === d.exampleSlug) ?? projects[0];
  el.classList.add('paper');
  el.setAttribute('data-reveal-section', '');
  el.innerHTML = `
  <div class="wrap case-demo__grid">
    <div class="case-demo__copy">
      <p class="eyebrow" data-reveal>Template de detalle</p>
      <h2 class="case-demo__title display" id="case-demo-title" data-split>${esc(d.title)}</h2>
      <p class="case-demo__intro" data-reveal>${esc(d.intro)}</p>
      <ol class="case-demo__parts">
        ${d.parts.map((p, i) => `<li data-reveal data-part="${i}" tabindex="0"><span class="cond">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(p.label)}</b><p>${esc(p.text)}</p></div></li>`).join('')}
      </ol>
      <a class="btn btn--plum" href="/caso/${ex.slug}" data-open-case="${ex.slug}" data-magnetic data-reveal>${esc(d.cta)} <span class="arrow">↗</span></a>
    </div>

    <div class="case-demo__mock" aria-hidden="true" data-reveal>
      <div class="mini">
        <div class="mini__bar"><i></i><i></i><i></i><span>leonorurbano.com/caso/${esc(ex.slug)}</span></div>
        <div class="mini__page">
          <div class="mini__hero" data-zone="0" style="background-image:url('${ex.images.cover}')"><span class="display">${esc(ex.title)}</span></div>
          <div class="mini__row">
            <div class="mini__facts" data-zone="1"><i></i><i></i><i></i><i></i></div>
            <div class="mini__story" data-zone="2"><i></i><i></i><i></i></div>
          </div>
          <div class="mini__gallery" data-zone="3">${ex.images.gallery.slice(0, 3).map((g) => `<span style="background-image:url('${g}')"></span>`).join('')}</div>
          <div class="mini__row">
            <div class="mini__palette" data-zone="4">${ex.colors.map((c) => `<span style="--c:${c}"></span>`).join('')}</div>
            <div class="mini__mock" data-zone="5"><span></span></div>
          </div>
        </div>
        ${d.parts.map((_, i) => `<span class="mini__pin cond" data-pin="${i}">${i + 1}</span>`).join('')}
      </div>
      <span class="case-demo__note hand">¡así se ve!</span>
    </div>
  </div>`;
}

export function initCaseDemo(el: HTMLElement, openCase: (slug: string) => void) {
  const mini = el.querySelector<HTMLElement>('.mini')!;
  const zones = [...el.querySelectorAll<HTMLElement>('[data-zone]')];
  const pins = [...el.querySelectorAll<HTMLElement>('[data-pin]')];

  // Coloca cada pin en la esquina de su zona
  const place = () => {
    const mr = mini.getBoundingClientRect();
    zones.forEach((z) => {
      const r = z.getBoundingClientRect();
      const pin = pins[+z.dataset.zone!];
      pin.style.left = `${r.left - mr.left + 10}px`;
      pin.style.top = `${r.top - mr.top + 10}px`;
    });
  };
  place();
  new ResizeObserver(place).observe(mini);

  const highlight = (i: number | null) => {
    zones.forEach((z) => z.classList.toggle('is-on', +z.dataset.zone! === i));
    pins.forEach((p) => p.classList.toggle('is-on', +p.dataset.pin! === i));
    el.querySelectorAll('[data-part]').forEach((li) => li.classList.toggle('is-on', +(li as HTMLElement).dataset.part! === i));
  };
  el.querySelectorAll<HTMLElement>('[data-part]').forEach((li) => {
    const i = +li.dataset.part!;
    li.addEventListener('pointerenter', () => highlight(i));
    li.addEventListener('focus', () => highlight(i));
    li.addEventListener('pointerleave', () => highlight(null));
    li.addEventListener('blur', () => highlight(null));
  });

  el.querySelector<HTMLAnchorElement>('[data-open-case]')!.addEventListener('click', (e) => {
    e.preventDefault();
    openCase((e.currentTarget as HTMLElement).dataset.openCase!);
  });
}
