import './styles/tokens.css';
import './styles/base.css';
import './styles/top.css';
import './styles/sections.css';
import './styles/case.css';

import { reducedMotion } from './lib/env';
import { initSmoothScroll, ScrollTrigger } from './lib/motion';
import { initGrain } from './modules/grain';
import { initCursor } from './modules/cursor';
import { initMagnetic, initSpecular } from './modules/magnetic';
import { initReveals } from './modules/reveal';
import { runPreloader } from './modules/preloader';
import { renderNav, initNav } from './modules/nav';
import { renderHero, initHero } from './modules/hero';
import { renderMarquee, initMarquee } from './modules/marquee';
import { renderWork, initWork } from './modules/work';
import { renderCaseDemo, initCaseDemo } from './modules/caseDemo';
import { renderServices, initServices } from './modules/services';
import { renderPricing, initPricing } from './modules/pricing';
import { renderProcess, initProcess } from './modules/process';
import { renderAbout, initAbout } from './modules/about';
import { renderContact, initContact } from './modules/contact';
import { renderFooter, initFooter } from './modules/footer';
import { openCase, initCaseRouting } from './modules/caseView';

const q = (s: string) => document.querySelector<HTMLElement>(s)!;

if (reducedMotion()) document.documentElement.classList.add('reduce-motion');

// 1. Pintar todo desde los JSON
const S = {
  nav: q('#nav'), hero: q('.hero'), marquee: q('.marquee'), work: q('.work'), demo: q('.case-demo'),
  services: q('.services'), pricing: q('.pricing'), process: q('.process'), about: q('.about'),
  contact: q('.contact'), footer: q('#footer'),
};
renderNav(S.nav);
renderHero(S.hero);
renderMarquee(S.marquee);
renderWork(S.work);
renderCaseDemo(S.demo);
renderServices(S.services);
renderPricing(S.pricing);
renderProcess(S.process);
renderAbout(S.about);
renderContact(S.contact);
renderFooter(S.footer);

// 2. Preloader + base
initGrain();
const intro = runPreloader();
initSmoothScroll();
initCursor();
initSpecular();
initNav(S.nav);
initHero(S.hero, intro);

// 3. El resto espera a las fuentes (los splits y medidas dependen de ellas)
const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]);
void fontsReady.then(() => {
  initMarquee(S.marquee);
  initWork(S.work, (slug, from) => openCase(slug, from));
  initCaseDemo(S.demo, (slug) => openCase(slug));
  initServices(S.services);
  initPricing(S.pricing);
  initProcess(S.process);
  initAbout(S.about);
  initContact(S.contact);
  initFooter(S.footer);
  initMagnetic();
  initReveals();
  initCaseRouting();
  ScrollTrigger.refresh();
});
