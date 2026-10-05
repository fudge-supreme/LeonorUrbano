// Stickers. Por defecto son SVG placeholder (src/assets/stickers/*.svg).
// Si Leonor deja un PNG/WebP con el mismo nombre (p. ej. ojo.png), se usa ese en su lugar.
const raw = import.meta.glob('../assets/stickers/*.svg', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const bitmaps = import.meta.glob('../assets/stickers/*.{png,webp}', { query: '?url', import: 'default', eager: true }) as Record<string, string>;

const nameOf = (path: string) => path.split('/').pop()!.replace(/\.(svg|png|webp)$/, '');
const svgs: Record<string, string> = {};
const imgs: Record<string, string> = {};
for (const [path, svg] of Object.entries(raw)) svgs[nameOf(path)] = svg;
for (const [path, url] of Object.entries(bitmaps)) imgs[nameOf(path)] = url;

let uid = 0;
/** Devuelve el sticker listo para insertar (ids únicos en SVG para poder repetirlo en la página). */
export function sticker(name: string): string {
  if (imgs[name]) return `<img src="${imgs[name]}" alt="" draggable="false" loading="lazy" decoding="async" />`;
  const svg = svgs[name];
  if (!svg) return '';
  const p = `s${++uid}-`;
  return svg
    .replace(/id="([^"]+)"/g, `id="${p}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`)
    .replace('<svg ', '<svg focusable="false" ');
}
