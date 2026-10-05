import { site, contact, services } from '../data';
import { esc } from '../lib/env';
import { sticker } from '../lib/stickers';
import { fill, waLink } from '../lib/whatsapp';

const ICONS = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></svg>',
  be: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8.2 11.4c.9-.4 1.4-1.2 1.4-2.2 0-2-1.5-2.7-3.4-2.7H1v11.1h5.4c2 0 3.9-1 3.9-3.2 0-1.4-.7-2.5-2.1-3Zm-4.8-3h2.3c.9 0 1.6.2 1.6 1.2 0 .9-.6 1.2-1.4 1.2H3.4V8.4Zm2.6 7.3H3.4v-3h2.7c1.1 0 1.8.5 1.8 1.6 0 1.1-.8 1.4-1.9 1.4ZM20.9 13.2c0-2.6-1.5-4.4-4.1-4.4-2.5 0-4.2 1.9-4.2 4.4 0 2.6 1.6 4.4 4.2 4.4 2 0 3.3-.9 3.9-2.8h-2c-.2.7-1.1 1.1-1.8 1.1-1.3 0-2-.8-2-2.1h6v-.6Zm-6-1c.1-1.1.8-1.8 1.9-1.8 1.2 0 1.7.7 1.8 1.8h-3.7ZM14.3 6.9h4.8v1.2h-4.8z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="m3.5 7 8.5 6 8.5-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
};

export function renderContact(el: HTMLElement) {
  const general = waLink(contact.messages.general);
  el.setAttribute('data-reveal-section', '');
  el.innerHTML = `
  <div class="contact__bg" aria-hidden="true"></div>
  <div class="wrap contact__grid">
    <div class="contact__head">
      <h2 class="contact__title cond" id="contact-title" data-split>${esc(site.contact.title)}</h2>
      <div class="contact__patch sticker" aria-hidden="true">${sticker('parche')}</div>
      <p class="contact__intro" data-reveal>${esc(site.contact.intro)}</p>
    </div>

    <ul class="contact__links">
      <li data-reveal><a class="big-link big-link--wa" href="${general}" target="_blank" rel="noopener" data-magnetic="0.3">${ICONS.wa}<span><b>WhatsApp</b><small>${esc(contact.whatsappDisplay)}</small></span><span class="arrow" aria-hidden="true">↗</span></a></li>
      <li data-reveal><a class="big-link" href="${contact.instagram}" target="_blank" rel="noopener" data-magnetic="0.3">${ICONS.ig}<span><b>Instagram</b><small>${esc(contact.instagramHandle)}</small></span><span class="arrow" aria-hidden="true">↗</span></a></li>
      <li data-reveal><a class="big-link" href="${contact.behance}" target="_blank" rel="noopener" data-magnetic="0.3">${ICONS.be}<span><b>Behance</b><small>portfolio extendido</small></span><span class="arrow" aria-hidden="true">↗</span></a></li>
      <li data-reveal><a class="big-link" href="mailto:${contact.email}" data-magnetic="0.3">${ICONS.mail}<span><b>Correo</b><small>${esc(contact.email)}</small></span><span class="arrow" aria-hidden="true">↗</span></a></li>
    </ul>

    <form class="contact__form glass" novalidate data-reveal>
      <p class="contact__form-title display">Arma tu mensaje</p>
      <div class="field"><label for="f-name">Nombre</label><input id="f-name" name="name" autocomplete="name" required /></div>
      <div class="field-row">
        <div class="field"><label for="f-service">Servicio</label>
          <select id="f-service" name="service">${services.map((s) => `<option>${esc(s.name)}</option>`).join('')}<option>Otro</option></select></div>
        <div class="field"><label for="f-budget">Presupuesto</label>
          <select id="f-budget" name="budget">${contact.budgets.map((b) => `<option>${esc(b)}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label for="f-msg">Mensaje</label><textarea id="f-msg" name="message" rows="4" required placeholder="Cuéntame de tu marca y qué necesitas"></textarea></div>
      <p class="contact__error" role="alert"></p>
      <button class="btn contact__send" type="submit" data-magnetic="0.2">${ICONS.wa}Enviar por WhatsApp <span class="arrow">↗</span></button>
      <p class="micro contact__note">Se abre WhatsApp con tu mensaje listo. No guardamos tus datos.</p>
    </form>

    <p class="contact__place"><span class="hero__live" aria-hidden="true"></span>${esc(site.city)}, ${esc(site.country)} · <span class="contact__clock"></span></p>
  </div>`;
}

export function initContact(el: HTMLElement) {
  const form = el.querySelector<HTMLFormElement>('.contact__form')!;
  const err = el.querySelector<HTMLElement>('.contact__error')!;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    if (!name || !message) {
      err.textContent = !name ? 'Escribe tu nombre, porfa.' : 'Cuéntame un poquito en el mensaje.';
      (form.querySelector<HTMLElement>(!name ? '#f-name' : '#f-msg'))!.focus();
      return;
    }
    err.textContent = '';
    const text = fill(contact.messages.form, { name, message, service: String(data.get('service')), budget: String(data.get('budget')) });
    window.open(waLink(text), '_blank', 'noopener');
  });

  // Hora local en Caracas
  const clock = el.querySelector<HTMLElement>('.contact__clock')!;
  const fmt = new Intl.DateTimeFormat('es-VE', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Caracas' });
  const tick = () => (clock.textContent = `son las ${fmt.format(new Date())}`);
  tick();
  setInterval(tick, 30_000);
}
