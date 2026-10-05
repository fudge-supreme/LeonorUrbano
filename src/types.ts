export type Aspect = 'poster' | 'square' | 'landscape';

export interface Mockup {
  type: 'phone' | 'box' | 'tote';
  image: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  client: string;
  year: number;
  role: string;
  categories: string[]; // ids de services.json
  colors: [string, string, string, string];
  aspect: Aspect;
  short: string;
  challenge: string;
  idea: string;
  solution: string;
  deliverables: string[];
  tools: string[];
  duration: string;
  images: { cover: string; gallery: string[]; mockups: Mockup[] };
  beforeAfter?: { before: string; after: string };
  video: string | null;
  placeholder: boolean;
}

export interface Service {
  id: string;
  name: string;
  sticker: string;
  anim: string;
  short: string;
  includes: string[];
  delivery: string;
}

export interface PriceItem {
  id: string;
  name: string;
  from: number;
  unit: string;
  includes: string[];
  recommended?: boolean;
  note?: string;
}

export interface Pricing {
  currency: string;
  referential: boolean;
  services: PriceItem[];
  packages: PriceItem[];
  paymentMethods: { name: string; detail: string }[];
  faq: { q: string; a: string }[];
}

export interface Contact {
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  instagram: string;
  instagramHandle: string;
  behance: string;
  budgets: string[];
  messages: { general: string; project: string; pricing: string; form: string };
}

export interface Site {
  name: string;
  brand: string;
  role: string;
  city: string;
  country: string;
  seo: { title: string; description: string; url: string; ogImage: string };
  hero: { signature: string; rotating: string[]; dragHint: string; skip: string };
  marquee: { top: string[]; bottom: string[] };
  work: { title: string; hint: string; allLabel: string };
  caseDemo: { title: string; intro: string; parts: { label: string; text: string }[]; cta: string; exampleSlug: string };
  services: { title: string; intro: string };
  pricing: { title: string; notice: string; bcvRate: number; bcvDate: string; showBolivares: boolean; disclaimer: string };
  process: { title: string; steps: { title: string; text: string }[] };
  about: { title: string; quote: string; bio: string[]; photo: string; photoCaption: string; tools: string[] };
  contact: { title: string; intro: string };
  footer: { credit: string; top: string };
}
