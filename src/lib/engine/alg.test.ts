/**
 * Arbeitslosengeld gegen die Richtwerttabelle der AK Niederösterreich (Antrag März 2026, 102 Zeilen,
 * davon 42 mit einem Familienzuschlag). Die Tabelle ist selbst eine Näherung der AMS-Berechnung:
 * wir verlangen höchstens 0,5 % Abweichung je Zeile und im Mittel unter 0,15 %.
 */
import { describe, expect, it } from 'vitest';
import fx from '../../../tests/fixtures/ak-alg-2026.json';
import { arbeitslosengeld, algDauer, notstandshilfe } from './leistungen';

describe('ALG gegen AK-Tabelle 2026', () => {
  const abw: number[] = [];
  for (const z of fx.zeilen) {
    it(`${z.brutto} €`, () => {
      const a = arbeitslosengeld(z.brutto, 0);
      const e = Math.abs(a.tagsatz - z.tagsatz) / z.tagsatz; abw.push(e);
      expect(e, `${a.tagsatz} statt ${z.tagsatz}`).toBeLessThanOrEqual(0.005);
      if (z.tagsatz1fz) {
        const f = arbeitslosengeld(z.brutto, 1);
        expect(Math.abs(f.tagsatz - z.tagsatz1fz) / z.tagsatz1fz, `${f.tagsatz} statt ${z.tagsatz1fz} (1 FZ)`).toBeLessThanOrEqual(0.005);
      }
    });
  }
  it('mittlere Abweichung unter 0,15 %', () => { expect(abw.reduce((s, x) => s + x, 0) / abw.length).toBeLessThan(0.0015); });
});

describe('Bezugsdauer § 18 AlVG', () => {
  it('Stufen', () => {
    expect(algDauer(100, 30)).toBe(20); expect(algDauer(156, 30)).toBe(30);
    expect(algDauer(312, 39)).toBe(30); expect(algDauer(312, 40)).toBe(39);
    expect(algDauer(468, 49)).toBe(39); expect(algDauer(468, 50)).toBe(52);
  });
});
describe('Notstandshilfe § 36 AlVG', () => {
  it('92 % über dem Richtsatz, Deckel nach sechs Monaten', () => {
    const a = arbeitslosengeld(3000);
    const n = notstandshilfe(a, 20);
    expect(n.quote).toBe(0.92); expect(n.tagsatz).toBeCloseTo(Math.round(a.grundbetrag * 92) / 100, 2);
    expect(notstandshilfe(a, 20, true).tagsatz).toBeCloseTo(43.61, 2);
    expect(notstandshilfe(a, 39, true).deckel).toBeNull();
  });
  it('95 % bei niedrigem Arbeitslosengeld', () => { expect(notstandshilfe(arbeitslosengeld(1500), 20).quote).toBe(0.95); });
});
