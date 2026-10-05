// Genera las variantes del collage (AVIF/WebP en 3 tamaños), la imagen Open Graph
// y los recortes del collage usados en el caso «Urbano: identidad personal».
// Uso: npm run images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SRC = 'reference/collage-original.jpg';
const OUT = 'public/img';
await mkdir(OUT, { recursive: true });

for (const w of [640, 1280, 2250]) {
  const base = sharp(SRC).resize({ width: w });
  await base.clone().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/collage-${w}.avif`);
  await base.clone().webp({ quality: 78 }).toFile(`${OUT}/collage-${w}.webp`);
}
// Miniatura borrosa (LQIP) para pintar algo mientras carga
await sharp(SRC).resize({ width: 32 }).blur(1).webp({ quality: 40 }).toFile(`${OUT}/collage-lqip.webp`);
// Open Graph 1200×630
await sharp(SRC).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/og.jpg`);

// Recortes del collage para la galería del caso Urbano (coordenadas en px del original)
const crops = {
  'gallery-1': { left: 1450, top: 120, width: 800, height: 520 },  // parche + ojo turco
  'gallery-2': { left: 660, top: 200, width: 940, height: 940 },   // wordmark al centro
  'gallery-3': { left: 120, top: 700, width: 760, height: 479 },   // sardinas + escarabajo
  'gallery-4': { left: 0, top: 0, width: 760, height: 1100 },      // columna izquierda
};
const dir = 'public/projects/urbano-identidad-personal';
await mkdir(dir, { recursive: true });
for (const [name, region] of Object.entries(crops)) {
  await sharp(SRC).extract(region).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${dir}/${name}.webp`);
}
console.log('✓ collage optimizado, OG y recortes listos');
