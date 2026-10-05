/** Kennzahlen der Prüfung gegen amtliche Rechner, aus den Testdaten gelesen (nie von Hand in Texte schreiben). */
import bmf from '../../tests/fixtures/bmf-2026.json';
import ak from '../../tests/fixtures/ak-alg-2026.json';
import { kurz, arbeitslosengeld } from './engine/leistungen';
import { svLaufend, lohnsteuerLaufend } from './engine/lohn';

export const BMF_FAELLE = bmf.faelle.length;
export const BMF_DATUM = bmf.abgerufen;
export const BMF_BETRAEGE = new Set(bmf.faelle.map((f) => f.brutto)).size;
export const BMF_MIN = Math.min(...bmf.faelle.map((f) => f.brutto));
export const BMF_MAX = Math.max(...bmf.faelle.map((f) => f.brutto));
export const AK_ZEILEN = ak.zeilen.length;
export const AK_DATUM = ak.abgerufen;
const abw = ak.zeilen.map((z) => Math.abs(arbeitslosengeld(z.brutto).tagsatz - z.tagsatz) / z.tagsatz);
export const AK_MITTEL = abw.reduce((s, x) => s + x, 0) / abw.length;
export const AK_MAX = Math.max(...abw);

/** Höchstes Monatsbrutto (auf 10 € genau) ohne laufende Lohnsteuer, ohne Absetzbeträge außer VAB. */
export function lstFreiBis(): number {
  let b = 500;
  while (b < 5000) { const sv = svLaufend(b + 10).summe; if (lohnsteuerLaufend(b + 10 - sv).lst > 0) break; b += 10; }
  return b;
}
/** Beispielwerte für Texte, aus dem Motor. */
export const beispiel = (brutto: number, wien = false) => {
  const k = kurz(brutto, { wien });
  return { ...k, uzNetto: k.uz.sz - k.uz.svSz - k.uz.lstSzFest, wrNetto: k.wr.sz - k.wr.svSz - k.wr.lstSzFest };
};
