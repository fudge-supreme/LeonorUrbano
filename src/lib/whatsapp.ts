import { contact } from '../data';

/** Rellena {variables} de una plantilla de contact.json. */
export const fill = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

export const waLink = (text: string) =>
  `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
