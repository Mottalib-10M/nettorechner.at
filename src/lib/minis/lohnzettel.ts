import { svLaufend, lohnsteuerLaufend } from '../engine/lohn';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihr Lohnzettel Zeile für Zeile', 'Your payslip line by line'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto laut Lohnzettel', 'Gross on your payslip'), def: 2900, unit: '€', max: 500000, decimals: 2 }],
  run: ({ b }: Record<string, number>) => { const s = svLaufend(b); const r = lohnsteuerLaufend(b - s.summe);
    return { head: [T(l, 'Auszahlung', 'Payout'), eur(b - s.summe - r.lst, l, 2)], rows: [[T(l, 'SV-Beitrag DN', 'Employee social insurance'), eur(s.summe, l, 2)], [T(l, 'Lohnsteuerbemessung (Monat)', 'Taxable pay (month)'), eur(b - s.summe, l, 2)], [T(l, 'Lohnsteuer', 'Wage tax'), eur(r.lst, l, 2)]] as [string, string][] }; },
});
