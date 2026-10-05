import { kurz } from '../engine/leistungen';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Netto aus diesem Bruttogehalt', 'Net pay from this gross salary'),
  cta: T(l, 'Zum vollständigen Brutto-Netto-Rechner', 'Open the full gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 3000, unit: '€', max: 1000000 }],
  run: ({ b }: Record<string, number>) => { const k = kurz(b);
    return { head: [T(l, 'Netto pro Monat', 'Net per month'), eur(k.nettoMonat, l)], rows: [[T(l, 'Sozialversicherung', 'Social insurance'), eur(k.svMonat, l)], [T(l, 'Lohnsteuer', 'Wage tax'), eur(k.lstMonat, l)], [T(l, 'Jahresnetto (14 Bezüge)', 'Annual net (14 payments)'), eur(k.nettoJahr, l)], [T(l, 'Abzüge vom Jahresbrutto', 'Deductions from annual gross'), pct((k.svJahr + k.lstJahr) / Math.max(1, k.bruttoJahr), l)]] as [string, string][] }; },
});
