import { pricing, site, contact } from '../data';
import type { PriceItem } from '../types';
import { esc, reducedMotion } from '../lib/env';
import { gsap } from '../lib/motion';
import { fill, waLink } from '../lib/whatsapp';
import { initMagnetic } from './magnetic';

const usd = (n: number) => `$${n.toLocaleString('es-VE')}`;
const bs = (n: number) => `Bs. ${Math.round(n * site.pricing.bcvRate).toLocaleString('es-VE')}`;
const showBs = () => site.pricing.showBolivares && site.pricing.bcvRate > 0;

function ticket(p: PriceItem, i: number) {
  const price = `desde ${usd(p.from)}${p.unit ? ` ${p.unit}` : ''}`;
  const wa = waLink(fill(contact.messages.pricing, { item: p.name, price }));
  return `
  <li class="ticket${p.recommended ? ' ticket--reco' : ''}" style="--i:${i}">
    ${p.recommended ? '<span class="ticket__stamp cond" aria-label="Recomendado">recomendado</span>' : ''}
    <div class="ticket__top">
      <h3 class="ticket__name display">${esc(p.name)}</h3>
      <p class="ticket__price"><span class="micro">desde</span><span class="ticket__amount cond">${usd(p.from)}</span>${p.unit ? `<span class="ticket__unit">${esc(p.unit)}</span>` : ''}</p>
      ${showBs() ? `<p class="ticket__bs micro">≈ ${bs(p.from)}</p>` : ''}
    </div>
    <div class="ticket__perf" aria-hidden="true"></div>
    <div class="ticket__bottom">
      <ul>${p.includes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      ${p.note ? `<p class="ticket__note micro">${esc(p.note)}</p>` : ''}
      <a class="btn ${p.recommended ? '' : 'btn--plum'} ticket__cta" href="${wa}" target="_blank" rel="noopener" data-magnetic="0.2">Lo quiero <span class="arrow">↗</span></a>
    </div>
    <span class="ticket__code micro" aria-hidden="true">Nº ${String(i + 1).padStart(4, '0')} · LU</span>
  </li>`;
}

export function renderPricing(el: HTMLElement) {
  const s = site.pricing;
  el.classList.add('paper');
  el.setAttribute('data-reveal-section', '');
  el.innerHTML = `
  <div class="wrap">
    <div class="pricing__head">
      <div>
        <p class="eyebrow" data-reveal>Inversión</p>
        <h2 class="pricing__title display" id="pricing-title" data-split>${esc(s.title)}</h2>
      </div>
      <p class="pricing__notice" data-reveal><span class="pricing__flag" aria-hidden="true"><i></i><i></i><i></i></span>${esc(s.notice)}</p>
    </div>
    <div class="pricing__toggle" role="group" aria-label="Ver precios" data-reveal>
      <button type="button" aria-pressed="true" data-set="services">por servicio</button>
      <button type="button" aria-pressed="false" data-set="packages">paquetes</button>
      <span class="pricing__pill" aria-hidden="true"></span>
    </div>
    <ul class="pricing__tickets" data-lenis-prevent-touch>${pricing.services.map(ticket).join('')}</ul>
    <p class="pricing__disclaimer micro" data-reveal>* ${esc(s.disclaimer)}${showBs() ? ` Tasa BCV${s.bcvDate ? ` del ${esc(s.bcvDate)}` : ''}: Bs. ${s.bcvRate.toLocaleString('es-VE')} por USD.` : ''}</p>

    <div class="pricing__lower">
      <div class="pricing__pay" data-reveal>
        <h3 class="display">Formas de pago</h3>
        <ul>${pricing.paymentMethods.map((m) => `<li><b>${esc(m.name)}</b><span>${esc(m.detail)}</span></li>`).join('')}</ul>
      </div>
      <div class="pricing__faq" data-reveal>
        <h3 class="display">Preguntas frecuentes</h3>
        ${pricing.faq.map((f) => `<details class="faq"><summary>${esc(f.q)}<span class="faq__icon" aria-hidden="true"></span></summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join('')}
      </div>
    </div>
  </div>`;
}

export function initPricing(el: HTMLElement) {
  const list = el.querySelector<HTMLElement>('.pricing__tickets')!;
  const btns = [...el.querySelectorAll<HTMLButtonElement>('.pricing__toggle button')];
  const toggle = el.querySelector<HTMLElement>('.pricing__toggle')!;
  btns.forEach((b, i) => b.addEventListener('click', () => {
    if (b.getAttribute('aria-pressed') === 'true') return;
    btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    toggle.style.setProperty('--x', String(i));
    const items = b.dataset.set === 'packages' ? pricing.packages : pricing.services;
    const swap = () => { list.innerHTML = items.map(ticket).join(''); initMagnetic(list); };
    if (reducedMotion()) return swap();
    gsap.to(list.children, { y: 30, rotate: 3, opacity: 0, duration: 0.25, stagger: 0.02, ease: 'power2.in', onComplete: () => {
      swap();
      gsap.from(list.children, { y: 60, rotate: () => gsap.utils.random(-6, 6), opacity: 0, duration: 0.8, stagger: 0.05, ease: 'back.out(1.4)' });
    } });
  }));
}
