import { P } from '../engine/params';
import { kurz } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Vom Stundenlohn zum Monatsnetto', 'From hourly wage to monthly net'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 's', label: T(l, 'Stundenlohn brutto', 'Hourly wage gross'), def: 16, unit: '€', max: 1000, decimals: 2 }, { id: 'w', label: T(l, 'Wochenstunden', 'Hours per week'), def: 40, unit: 'h', max: 60, decimals: 1 }],
  run: ({ s, w }: Record<string, number>) => { const b = s * w * P.ueberstunden.wochen_je_monat; const k = kurz(b);
    return { head: [T(l, 'Netto pro Monat', 'Net per month'), eur(k.nettoMonat, l)], rows: [[T(l, 'Monatsbrutto (× 4,33 Wochen)', 'Monthly gross (× 4.33 weeks)'), eur(b, l)], [T(l, 'Netto pro Stunde', 'Net per hour'), eur(b > 0 ? k.nettoMonat / (w * P.ueberstunden.wochen_je_monat) : 0, l, 2)], [T(l, 'Jahresnetto (14 Bezüge)', 'Annual net (14 payments)'), eur(k.nettoJahr, l)]] as [string, string][] }; },
});
