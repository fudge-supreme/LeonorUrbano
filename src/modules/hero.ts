import { site } from '../data';
import { esc, finePointer, reducedMotion, isMobile, whenNear } from '../lib/env';
import { gsap, ScrollTrigger } from '../lib/motion';
import { sticker } from '../lib/stickers';
import { wordmarkSVG } from './wordmark';
import { createStickerWorld } from './physics';

/** Stickers del hero: posición de casa en % del hero, rotación y forma del cuerpo físico. */
const HERO_STICKERS = [
  { name: 'ojo', x: 14, y: 26, rot: -8, size: 'm', shape: 'circle', mobile: true },
  { name: 'disco', x: 86, y: 24, rot: 6, size: 'm', shape: 'circle', mobile: true },
  { name: 'estrella', x: 80, y: 74, rot: 14, size: 'm', shape: 'circle', mobile: true },
  { name: 'cereza', x: 22, y: 76, rot: -12, size: 's', shape: 'box', mobile: true },
  { name: 'dados', x: 8, y: 54, rot: 10, size: 's', shape: 'box', mobile: false },
  { name: 'parche', x: 66, y: 88, rot: -5, size: 'l', shape: 'box', mobile: false },
  { name: 'pez', x: 92, y: 50, rot: -10, size: 's', shape: 'box', mobile: false },
  { name: 'camara', x: 36, y: 90, rot: 7, size: 's', shape: 'box', mobile: false },
];

export function renderHero(el: HTMLElement) {
  const rot = site.hero.rotating;
  el.innerHTML = `
  <div class="hero__layer hero__layer--back" data-depth="0.6">
    <picture>
      <source type="image/avif" srcset="/img/collage-640.avif 640w, /img/collage-1280.avif 1280w, /img/collage-2250.avif 2250w" sizes="100vw" />
      <source type="image/webp" srcset="/img/collage-640.webp 640w, /img/collage-1280.webp 1280w, /img/collage-2250.webp 2250w" sizes="100vw" />
      <img class="hero__collage" src="/img/collage-1280.webp" alt="Collage ilustrado por Leonor: conchas, peces, cámaras, flores, un ojo turco y un parche que dice «call me if you get lost», bajo una veladura violeta." fetchpriority="high" decoding="async" width="2250" height="1179" />
    </picture>
    <div class="hero__veil"></div>
  </div>

  <div class="hero__layer hero__layer--mid" data-depth="1.4" aria-hidden="true">
    <span class="spark" style="--x:30%;--y:20%;--s:1"></span>
    <span class="spark" style="--x:72%;--y:36%;--s:.7"></span>
    <span class="spark" style="--x:58%;--y:72%;--s:.9"></span>
    <span class="spark" style="--x:18%;--y:44%;--s:.6"></span>
    <span class="tape" style="left:40%;top:16%;transform:rotate(-14deg)"></span>
    <span class="tape" style="left:58%;top:80%;transform:rotate(9deg)"></span>
    <span class="hero__scribble hand">¡hola!</span>
  </div>

  <div class="hero__layer hero__layer--front" data-depth="2.4">
    <h1 class="hero__title">
      <span class="sr-only">${esc(site.name)} — ${esc(site.role)}</span>
      <span class="hero__signature hand" aria-hidden="true">${esc(site.hero.signature)}</span>
      <span class="hero__wordmark" aria-hidden="true">${wordmarkSVG({ id: 'wm-hero' })}</span>
    </h1>
    <p class="hero__role">${esc(site.role)}</p>
    <p class="hero__rotator" aria-label="${esc(rot.join(', '))}">
      <span class="hero__arrow" aria-hidden="true">→</span>
      <span class="hero__rot-window" aria-hidden="true">
        ${rot.map((w, i) => `<span class="hero__rot-word${i === 0 ? ' is-on' : ''}">${esc(w)}</span>`).join('')}
      </span>
    </p>
  </div>

  <div class="hero__stickers" aria-label="Stickers decorativos que se pueden arrastrar">
    ${HERO_STICKERS.map((s) => `
      <div class="hero__sticker sticker size-${s.size}${s.mobile ? '' : ' desk-only'}" data-physics data-x="${s.x}" data-y="${s.y}" data-rot="${s.rot}" data-shape="${s.shape}"
           style="left:${s.x}%;top:${s.y}%;--r:${s.rot}deg" aria-hidden="true"><div class="sticker__in">${sticker(s.name)}</div></div>`).join('')}
  </div>

  <div class="hero__foot">
    <span class="hero__pill glass"><span class="hero__live" aria-hidden="true"></span>${esc(site.city)}, ${esc(site.country)}</span>
    <span class="hero__pill glass hero__hint">${esc(site.hero.dragHint)} <span aria-hidden="true">✦</span></span>
  </div>`;
}

export function initHero(el: HTMLElement, intro: Promise<void>) {
  const front = el.querySelector<HTMLElement>('.hero__layer--front')!;
  const layers = [...el.querySelectorAll<HTMLElement>('[data-depth]')];
  const squiggle = el.querySelector<SVGPathElement>('.wm-squiggle')!;
  const reduce = reducedMotion();

  // Línea rotativa de servicios
  const words = [...el.querySelectorAll<HTMLElement>('.hero__rot-word')];
  let i = 0;
  if (!reduce) {
    setInterval(() => {
      const cur = words[i];
      i = (i + 1) % words.length;
      const next = words[i];
      gsap.to(cur, { yPercent: -110, rotate: -6, duration: 0.6, ease: 'expo.in', onComplete: () => cur.classList.remove('is-on') });
      next.classList.add('is-on');
      gsap.fromTo(next, { yPercent: 110, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.8, ease: 'expo.out', delay: 0.35 });
    }, 2200);
  }

  // Entrada tras el preloader
  void intro.then(() => {
    if (reduce) return;
    const len = squiggle.getTotalLength();
    gsap.timeline()
      .from(el.querySelector('.hero__collage'), { scale: 1.18, duration: 1.8, ease: 'expo.out' }, 0)
      .from(el.querySelectorAll('.hero__wordmark .wm-l'), { yPercent: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05 }, 0.1)
      .fromTo(squiggle, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.4)
      .from(el.querySelector('.hero__signature'), { opacity: 0, scale: 0.6, rotate: -20, duration: 1, ease: 'elastic.out(1, 0.5)' }, 0.6)
      .from(el.querySelectorAll('.hero__role, .hero__rotator, .hero__pill'), { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, 0.7)
      .from(el.querySelectorAll('.hero__sticker .sticker__in'), { scale: 0, rotate: -90, duration: 0.8, ease: 'back.out(2)', stagger: 0.06, clearProps: 'scale,rotate' }, 0.6);
  });

  if (reduce) return;

  // Parallax por capas: mouse (desktop) o giroscopio (móvil)
  const movers = layers.map((l) => ({
    d: parseFloat(l.dataset.depth!),
    x: gsap.quickTo(l, 'x', { duration: 1.2, ease: 'power3' }),
    y: gsap.quickTo(l, 'y', { duration: 1.2, ease: 'power3' }),
  }));
  const move = (nx: number, ny: number) => movers.forEach((m) => { m.x(nx * m.d * 12); m.y(ny * m.d * 10); });
  if (finePointer()) {
    el.addEventListener('pointermove', (e) => move(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5));
  } else if ('DeviceOrientationEvent' in window) {
    const onTilt = (e: DeviceOrientationEvent) => move(((e.gamma ?? 0) / 45) * 0.5, (((e.beta ?? 45) - 45) / 45) * 0.5);
    const DOE = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof DOE.requestPermission === 'function') {
      // iOS pide permiso: se solicita con el primer toque en el hero
      el.addEventListener('touchend', () => DOE.requestPermission!().then((s) => s === 'granted' && window.addEventListener('deviceorientation', onTilt)).catch(() => {}), { once: true });
    } else {
      window.addEventListener('deviceorientation', onTilt);
    }
  }

  // Parallax de scroll: el collage baja lento y el wordmark se aleja
  gsap.timeline({ scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true } })
    .to(el.querySelector('.hero__layer--back picture'), { yPercent: 18, ease: 'none' }, 0)
    .to(front, { yPercent: -30, scale: 0.9, ease: 'none' }, 0)
    .to(el.querySelector('.hero__veil'), { opacity: 0.85, ease: 'none' }, 0);

  // Física de stickers (Matter.js bajo demanda)
  const stickers = el.querySelector<HTMLElement>('.hero__stickers')!;
  if (isMobile()) stickers.querySelectorAll('.desk-only').forEach((n) => n.remove());
  whenNear(stickers, () => {
    void createStickerWorld(stickers, 'float').then(() => ScrollTrigger.refresh());
  }, '0px');
}
