import siteJson from './data/site.json';
import projectsJson from './data/projects.json';
import servicesJson from './data/services.json';
import pricingJson from './data/pricing.json';
import contactJson from './data/contact.json';
import type { Site, Project, Service, Pricing, Contact } from './types';

export const site = siteJson as Site;
export const projects = projectsJson as Project[];
export const services = servicesJson as Service[];
export const pricing = pricingJson as Pricing;
export const contact = contactJson as Contact;

/** Avisos amables en consola cuando un JSON tiene algo raro (útil al editar). */
if (import.meta.env.DEV) {
  const ids = new Set(services.map((s) => s.id));
  const slugs = new Set<string>();
  for (const p of projects) {
    if (slugs.has(p.slug)) console.warn(`[projects.json] slug repetido: ${p.slug}`);
    slugs.add(p.slug);
    for (const c of p.categories) if (!ids.has(c)) console.warn(`[projects.json] «${p.slug}» usa la categoría «${c}», que no existe en services.json`);
    if (p.colors?.length !== 4) console.warn(`[projects.json] «${p.slug}» debe tener exactamente 4 colores`);
    if (!['poster', 'square', 'landscape'].includes(p.aspect)) console.warn(`[projects.json] «${p.slug}»: aspect debe ser poster, square o landscape`);
  }
  if (!slugs.has(site.caseDemo.exampleSlug)) console.warn(`[site.json] caseDemo.exampleSlug «${site.caseDemo.exampleSlug}» no existe`);
}

export const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? id;
