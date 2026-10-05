import { P } from '../engine/params';
import { svLaufend, tarif } from '../engine/lohn';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Kindermehrbetrag für Alleinverdiener und Alleinerzieher', 'Kindermehrbetrag for sole earners and single parents'),
  cta: T(l, 'Familienbonus-Plus-Rechner', 'Familienbonus Plus calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat (14 Bezüge)', 'Gross per month (14 payments)'), def: 1400, unit: '€', max: 500000 }, { id: 'k', label: T(l, 'Kinder', 'Children'), def: 1, max: 15 }],
  run: ({ b, k }: Record<string, number>) => { const sv = svLaufend(b).summe; const est = tarif(Math.max(0, (b - sv) * 12 - P.tarif.werbungskostenpauschale)); const n = Math.round(k);
    const kmb = n > 0 && est < P.absetzbetraege.kindermehrbetrag * n ? Math.max(0, P.absetzbetraege.kindermehrbetrag * n - est) : 0;
    return { head: [T(l, 'Kindermehrbetrag im Jahr', 'Kindermehrbetrag per year'), eur(kmb, l)], rows: [[T(l, 'Tarifsteuer vor Absetzbeträgen', 'Scale tax before credits'), eur(est, l)], [T(l, 'Grenze', 'Threshold'), eur(P.absetzbetraege.kindermehrbetrag, l)], [T(l, 'Auszahlung über', 'Paid out via'), T(l, 'Veranlagung', 'tax assessment')]] as [string, string][] }; },
});
