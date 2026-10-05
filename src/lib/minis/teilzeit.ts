import { kurz } from '../engine/leistungen';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Teilzeit: wie viel netto bei weniger Stunden?', 'Part-time: how much net with fewer hours?'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'v', label: T(l, 'Vollzeitgehalt brutto (38,5 oder 40 h)', 'Full-time gross (38.5 or 40 h)'), def: 3200, unit: '€', max: 500000 }, { id: 'p', label: T(l, 'Teilzeit in Prozent', 'Part-time share'), def: 60, unit: '%', max: 100 }],
  run: ({ v, p }: Record<string, number>) => { const t = v * p / 100; const kv = kurz(v), kt = kurz(t);
    return { head: [T(l, 'Netto pro Monat in Teilzeit', 'Part-time net per month'), eur(kt.nettoMonat, l)], rows: [[T(l, 'Brutto in Teilzeit', 'Part-time gross'), eur(t, l)], [T(l, 'Vollzeit netto', 'Full-time net'), eur(kv.nettoMonat, l)], [T(l, 'Netto im Verhältnis zur Vollzeit', 'Net relative to full-time'), pct(kv.nettoMonat > 0 ? kt.nettoMonat / kv.nettoMonat : 0, l)]] as [string, string][] }; },
});
