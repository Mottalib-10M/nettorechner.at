import { kurz } from '../engine/leistungen';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wie viel von der Gehaltserhöhung netto ankommt', 'How much of a pay rise reaches you net'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Bisheriges Brutto', 'Current gross'), def: 3000, unit: '€', max: 500000 }, { id: 'p', label: T(l, 'Erhöhung', 'Rise'), def: 3, unit: '%', max: 100, decimals: 1 }],
  run: ({ b, p }: Record<string, number>) => { const o = kurz(b), n = kurz(b * (1 + p / 100));
    return { head: [T(l, 'Mehr netto pro Monat', 'Extra net per month'), eur(n.nettoMonat - o.nettoMonat, l, 2)], rows: [[T(l, 'Mehr brutto pro Monat', 'Extra gross per month'), eur(b * p / 100, l, 2)], [T(l, 'Mehr netto im Jahr', 'Extra net per year'), eur(n.nettoJahr - o.nettoJahr, l)], [T(l, 'Netto-Anteil der Erhöhung', 'Net share of the rise'), pct(b * p > 0 ? (n.nettoMonat - o.nettoMonat) / (b * p / 100) : 0, l)]] as [string, string][] }; },
});
