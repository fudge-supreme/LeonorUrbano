import { site } from '../data';
import { esc, reducedMotion } from '../lib/env';
import { ScrollTrigger } from '../lib/motion';

export function renderProcess(el: HTMLElement) {
  const p = site.process;
  el.setAttribute('data-reveal-section', '');
  el.innerHTML = `
  <div class="wrap">
    <p class="eyebrow" data-reveal>Proceso</p>
    <h2 class="process__title display" id="process-title" data-split>${esc(p.title)}</h2>
  </div>
  <div class="process__stage wrap">
    <svg class="process__yarn" aria-hidden="true"><path class="process__yarn-shadow"/><path class="process__yarn-path"/></svg>
    <ol class="process__steps">
      ${p.steps.map((s, i) => `
      <li class="step" style="--i:${i}">
        <span class="step__knot" aria-hidden="true"></span>
        <span class="step__num cond">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="step__title display">${esc(s.title)}</h3>
        <p class="step__text">${esc(s.text)}</p>
      </li>`).join('')}
    </ol>
  </div>`;
}

/** Hilo de lana que se desenrolla con el scroll y conecta los nudos de cada paso. */
export function initProcess(el: HTMLElement) {
  const stage = el.querySelector<HTMLElement>('.process__stage')!;
  const svg = el.querySelector<SVGSVGElement>('.process__yarn')!;
  const path = el.querySelector<SVGPathElement>('.process__yarn-path')!;
  const shadow = el.querySelector<SVGPathElement>('.process__yarn-shadow')!;
  const knots = [...el.querySelectorAll<HTMLElement>('.step__knot')];
  const steps = [...el.querySelectorAll<HTMLElement>('.step')];
  let len = 0;
  let st: ScrollTrigger | null = null;

  const build = () => {
    const sr = stage.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${sr.width} ${sr.height}`);
    svg.setAttribute('width', String(sr.width));
    svg.setAttribute('height', String(sr.height));
    const pts = knots.map((k) => {
      const r = k.getBoundingClientRect();
      return { x: r.left - sr.left + r.width / 2, y: r.top - sr.top + r.height / 2 };
    });
    // Curvas que se arquean POR ENCIMA de los nudos (el texto va debajo), con un rizo de lana entre pasos
    const lift = Math.min(150, stage.clientWidth * 0.08);
    let d = `M ${pts[0].x - 70} ${pts[0].y - lift} Q ${pts[0].x - 30} ${pts[0].y - 10} ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      const mx = (a.x + b.x) / 2;
      const top = Math.min(a.y, b.y) - lift;
      d += ` C ${a.x + 20} ${a.y - lift * 0.9}, ${mx - 40} ${top}, ${mx} ${top + 16}`;
      // rizo pequeño
      d += ` c 18 10 26 -18 6 -24 c -18 -6 -26 20 -4 30`;
      d += ` S ${b.x - 20} ${b.y - lift * 0.9}, ${b.x} ${b.y}`;
    }
    const last = pts[pts.length - 1];
    d += ` C ${last.x + 30} ${last.y - lift * 0.6}, ${last.x + 80} ${last.y - lift}, ${last.x + 110} ${last.y - lift * 1.2}`; // cabo suelto
    path.setAttribute('d', d);
    shadow.setAttribute('d', d);
    len = path.getTotalLength();
    path.style.strokeDasharray = shadow.style.strokeDasharray = `${len}`;
  };
  build();
  new ResizeObserver(() => { build(); update(st?.progress ?? (reducedMotion() ? 1 : 0)); }).observe(stage);

  const update = (p: number) => {
    path.style.strokeDashoffset = shadow.style.strokeDashoffset = `${len * (1 - p)}`;
    steps.forEach((s, i) => s.classList.toggle('is-on', p >= (i + 0.2) / steps.length - 0.02 || p > 0.98));
  };

  if (reducedMotion()) { update(1); return; }
  st = ScrollTrigger.create({
    trigger: stage, start: 'top 70%', end: 'bottom 60%', scrub: 0.8,
    onUpdate: (self) => update(self.progress),
  });
  update(0);
}
