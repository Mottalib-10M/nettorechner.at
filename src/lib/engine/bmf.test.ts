/**
 * Abgleich mit dem amtlichen BMF-Brutto-Netto-Rechner 2026 (RECETTE §17.4 Punkt 8).
 * 408 Fälle, abgerufen am 2026-10-05 über die JSON-Schnittstelle des Rechners (tests/fixtures/bmf-2026.json):
 * 34 Bruttobeträge von 600 bis 20.000 € × 12 Profile (Tirol, Wien, Kinder, geteilter Familienbonus,
 * AVAB, kleines und großes Pendlerpauschale). Toleranz: 1 Cent pro Posten.
 */
import { describe, expect, it } from 'vitest';
import fixture from '../../../tests/fixtures/bmf-2026.json';
import { rechneJahr, standardJahr } from './jahr';
import type { Steuerprofil, PendlerArt } from './lohn';

interface Opt { land: string; kinder?: number; k018?: number; k18?: number; geteilt?: boolean; avab?: boolean; pendler?: string; km?: number }
export function profilAus(o: Opt): Steuerprofil {
  const art: PendlerArt = !o.pendler || o.pendler === 'keine' ? 'keine' : o.pendler.endsWith('gross') ? 'gross' : 'klein';
  return { wien: o.land === 'wien', kinderU18: o.k018 ?? 0, kinderUe18: o.k18 ?? 0, fbGeteilt: !!o.geteilt, avab: !!o.avab, avabKinder: o.kinder ?? 0, pendler: art, km: o.km ?? 0 };
}

describe('BMF-Rechner 2026: 408 Fälle', () => {
  for (const f of fixture.faelle) {
    it(`${f.fall} · ${f.brutto} €`, () => {
      const j = rechneJahr(standardJahr(f.brutto), profilAus(f.opt as Opt));
      const jan = j.monate[0], juni = j.monate[5], nov = j.monate[10];
      expect(jan.svLaufend).toBeCloseTo(f.sv, 2);
      expect(Math.abs(jan.lstLaufend - f.lst)).toBeLessThanOrEqual(0.011);
      expect(juni.svSz).toBeCloseTo(f.svUZ, 2);
      expect(Math.abs(juni.lstSzFest - f.lstUZ)).toBeLessThanOrEqual(0.011);
      expect(nov.svSz).toBeCloseTo(f.svWR, 2);
      expect(Math.abs(nov.lstSzFest - f.lstWR)).toBeLessThanOrEqual(0.011);
      expect(Math.abs(j.netto - f.nettoJahr)).toBeLessThanOrEqual(0.13);
    });
  }
});
