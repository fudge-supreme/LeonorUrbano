// Genera imágenes PLACEHOLDER para los proyectos de ejemplo a partir de projects.json.
// No sobrescribe archivos que ya existan: cuando Leonor ponga sus imágenes reales,
// este script las respeta. Uso: npm run images
import sharp from 'sharp';
import { readFile, mkdir, access } from 'node:fs/promises';

const projects = JSON.parse(await readFile('src/data/projects.json', 'utf8'));
const SIZES = { poster: [960, 1200], square: [1080, 1080], landscape: [1440, 960] };
const exists = (p) => access(p).then(() => true, () => false);

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function poster({ w, h, colors: [a, b, c, d], title, label, variant }) {
  const motifs = [
    // sol / círculos concéntricos
    `<circle cx="${w * 0.62}" cy="${h * 0.42}" r="${w * 0.36}" fill="${b}"/>
     <circle cx="${w * 0.62}" cy="${h * 0.42}" r="${w * 0.24}" fill="${c}"/>
     <circle cx="${w * 0.62}" cy="${h * 0.42}" r="${w * 0.1}" fill="${d}"/>`,
    // franjas diagonales
    `<g transform="rotate(-18 ${w / 2} ${h / 2})">${Array.from({ length: 9 }, (_, i) =>
      `<rect x="${-w * 0.3}" y="${i * h * 0.16 - h * 0.2}" width="${w * 1.6}" height="${h * 0.07}" fill="${i % 2 ? b : c}"/>`).join('')}</g>`,
    // damero
    `<g opacity=".9">${Array.from({ length: 36 }, (_, i) => {
      const x = (i % 6) * w / 6, y = Math.floor(i / 6) * h / 6;
      return (i + Math.floor(i / 6)) % 2 ? `<rect x="${x}" y="${y}" width="${w / 6}" height="${h / 6}" fill="${b}"/>` : '';
    }).join('')}</g><circle cx="${w / 2}" cy="${h * 0.45}" r="${w * 0.22}" fill="${c}"/>`,
    // ondas
    `${Array.from({ length: 7 }, (_, i) =>
      `<path d="M0 ${h * 0.2 + i * h * 0.1} Q ${w * 0.25} ${h * 0.12 + i * h * 0.1} ${w / 2} ${h * 0.2 + i * h * 0.1} T ${w} ${h * 0.2 + i * h * 0.1}" stroke="${i % 2 ? b : c}" stroke-width="${h * 0.035}" fill="none"/>`).join('')}`,
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0"/></filter></defs>
  <rect width="100%" height="100%" fill="${a}"/>
  ${motifs[variant % motifs.length]}
  <rect y="${h * 0.74}" width="100%" height="${h * 0.26}" fill="${a}"/>
  <rect width="100%" height="100%" filter="url(#g)"/>
  <text x="${w * 0.06}" y="${h * 0.86}" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="${Math.min(Math.min(w, h) * 0.12, (w * 0.88) / (title.length * 0.52))}" fill="${d}">${esc(title)}</text>
  <text x="${w * 0.06}" y="${h * 0.93}" font-family="Helvetica, Arial, sans-serif" font-size="${Math.min(w, h) * 0.032}" fill="${d}" opacity=".8">${esc(label)}</text>
</svg>`;
}

async function render(file, opts) {
  if (await exists(file)) return false;
  await sharp(Buffer.from(poster(opts))).webp({ quality: 80 }).toFile(file);
  return true;
}

let made = 0;
for (const [i, p] of projects.entries()) {
  if (!p.placeholder) continue;
  const dir = `public/projects/${p.slug}`;
  await mkdir(dir, { recursive: true });
  const [w, h] = SIZES[p.aspect] ?? SIZES.square;
  const label = 'PLACEHOLDER · reemplazar con la pieza real';
  made += await render(`${dir}/cover.webp`, { w, h, colors: p.colors, title: p.title, label, variant: i });
  for (let g = 1; g <= 3; g++) {
    const [gw, gh] = [[1080, 1350], [1080, 1080], [1440, 960]][g - 1];
    const rot = [...p.colors.slice(g % 4), ...p.colors.slice(0, g % 4)];
    made += await render(`${dir}/gallery-${g}.webp`, { w: gw, h: gh, colors: rot, title: `${p.title} · ${g}`, label, variant: i + g });
  }
  if (p.beforeAfter) {
    made += await render(`${dir}/before.webp`, { w: 1440, h: 960, colors: ['#DDDDDD', '#BBBBBB', '#999999', '#333333'], title: 'Antes', label, variant: 1 });
    made += await render(`${dir}/after.webp`, { w: 1440, h: 960, colors: p.colors, title: 'Después', label, variant: 0 });
  }
}
console.log(`✓ ${made} placeholders generados (los existentes no se tocan)`);
