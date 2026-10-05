import { site } from '../data';
import { soundOn, setSound, pop } from './sound';
import { lockScroll, ScrollTrigger } from '../lib/motion';
import { sticker } from '../lib/stickers';

const LINKS = [
  ['#trabajos', 'Trabajos'],
  ['#servicios', 'Servicios'],
  ['#precios', 'Precios'],
  ['#sobre', 'Sobre mí'],
  ['#contacto', 'Contacto'],
] as const;

export function renderNav(el: HTMLElement) {
  el.innerHTML = `
  <div class="nav__bar glass">
    <a class="nav__brand" href="#inicio" aria-label="${site.brand} — inicio">
      <span class="nav__brand-word">URBANO<span class="nav__dot">.</span></span>
    </a>
    <nav class="nav__links" aria-label="Principal">
      ${LINKS.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
    </nav>
    <button class="nav__sound" type="button" aria-pressed="${soundOn()}" aria-label="Sonido">
      <span class="nav__eq" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="nav__sound-txt">${soundOn() ? 'sonido' : 'silencio'}</span>
    </button>
    <a class="nav__cta btn" href="#contacto" data-magnetic="0.25">Hablemos</a>
    <button class="nav__menu" type="button" aria-expanded="false" aria-controls="nav-sheet">
      <span class="nav__burger" aria-hidden="true"><i></i><i></i></span><span class="sr-only">Menú</span>
    </button>
  </div>
  <div class="nav__sheet" id="nav-sheet" hidden>
    <nav aria-label="Menú móvil">
      ${LINKS.map(([h, t], i) => `<a href="${h}" style="--i:${i}"><span class="micro">0${i + 1}</span>${t}</a>`).join('')}
    </nav>
    <div class="nav__sheet-stickers" aria-hidden="true">
      <span class="sticker" style="--r:-12deg">${sticker('ojo')}</span>
      <span class="sticker" style="--r:10deg">${sticker('parche')}</span>
      <span class="sticker" style="--r:-4deg">${sticker('estrella')}</span>
    </div>
    <p class="nav__sheet-foot">${site.city}, ${site.country}</p>
  </div>`;
}

export function initNav(el: HTMLElement) {
  const sound = el.querySelector<HTMLButtonElement>('.nav__sound')!;
  sound.addEventListener('click', () => {
    const on = !soundOn();
    setSound(on);
    sound.setAttribute('aria-pressed', String(on));
    sound.querySelector('.nav__sound-txt')!.textContent = on ? 'sonido' : 'silencio';
    pop();
  });

  // Menú móvil
  const btn = el.querySelector<HTMLButtonElement>('.nav__menu')!;
  const sheet = el.querySelector<HTMLElement>('.nav__sheet')!;
  const set = (open: boolean) => {
    btn.setAttribute('aria-expanded', String(open));
    el.classList.toggle('is-open', open);
    sheet.hidden = !open;
    lockScroll(open);
    if (open) sheet.querySelector('a')?.focus();
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  sheet.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && el.classList.contains('is-open')) { set(false); btn.focus(); } });

  // Se esconde al bajar, aparece al subir; se vuelve más sólida fuera del hero
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      el.classList.toggle('is-hidden', y > lastY && y > 400 && !el.classList.contains('is-open'));
      el.classList.toggle('is-solid', y > window.innerHeight * 0.8);
      lastY = y;
    },
  });
}
