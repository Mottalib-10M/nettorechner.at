/** Bilder für soziale Netzwerke (1200×630), je Sprache: Flaggenlogo + Titel. Berührt die Icons nicht. */
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const PUBLIC = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const logo = readFileSync(join(PUBLIC, 'logo.svg'), 'utf8').replace(/<svg([^>]*)>/, '<svg$1 width="120" height="120">');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const V = [
  { file: 'og-de.png', brand: 'Nettorechner', t1: 'Brutto-Netto-Rechner', t2: 'Österreich 2026', sub: '13. und 14. Gehalt · Pendlerpauschale · geprüft am BMF-Rechner' },
  { file: 'og-en.png', brand: 'Nettorechner', t1: 'Gross-to-net calculator', t2: 'Austria 2026', sub: '13th and 14th salary · commuter allowance · checked vs BMF' },
];
for (const v of V) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#fff"/>
  <rect y="0" width="1200" height="10" fill="#C8102E"/><rect y="10" width="1200" height="10" fill="#fff"/><rect y="20" width="1200" height="10" fill="#C8102E"/>
  <g transform="translate(80,80)">${logo.replace(/^[\s\S]*?<svg/, '<svg')}</g>
  <text x="225" y="155" font-family="Georgia, serif" font-size="40" font-weight="700" fill="#0f172a">${esc(v.brand)}</text>
  <text x="80" y="330" font-family="Georgia, serif" font-size="78" font-weight="700" fill="#0f172a">${esc(v.t1)}</text>
  <text x="80" y="420" font-family="Georgia, serif" font-size="78" font-weight="700" fill="#8c0b20">${esc(v.t2)}</text>
  <text x="80" y="520" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#334155">${esc(v.sub)}</text></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(join(PUBLIC, v.file)); console.log('✓', v.file);
}
