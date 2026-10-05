import { kurz } from '../engine/leistungen';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was vom 13. und 14. Gehalt netto bleibt', 'What remains of the 13th and 14th salary'),
  cta: T(l, 'Sonderzahlungen Monat für Monat rechnen', 'Calculate special payments month by month'),
  inputs: [{ id: 'b', label: T(l, 'Monatsbrutto', 'Monthly gross'), def: 2800, unit: '€', max: 500000 }],
  run: ({ b }: Record<string, number>) => { const k = kurz(b); const uz = k.uz.sz - k.uz.svSz - k.uz.lstSzFest, wr = k.wr.sz - k.wr.svSz - k.wr.lstSzFest;
    return { head: [T(l, 'Urlaubszuschuss netto', 'Holiday pay net'), eur(uz, l)], rows: [[T(l, 'Weihnachtsremuneration netto', 'Christmas pay net'), eur(wr, l)], [T(l, 'Laufendes Monatsnetto zum Vergleich', 'Regular monthly net for comparison'), eur(k.nettoMonat, l)], [T(l, 'Steuer auf beide zusammen', 'Tax on both together'), eur(k.uz.lstSzFest + k.wr.lstSzFest, l)], [T(l, 'Netto-Quote der Sonderzahlungen', 'Net share of special payments'), pct(b > 0 ? (uz + wr) / (2 * b) : 0, l)]] as [string, string][] }; },
});
