import { kurz } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Gleiches Netto, ob ledig oder verheiratet', 'Same net pay, single or married'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Ihr Brutto pro Monat', 'Your gross per month'), def: 3000, unit: '€', max: 500000 }, { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 0, max: 10 }],
  run: ({ b, k }: Record<string, number>) => { const n = Math.round(k); const ledig = kurz(b), mitKind = kurz(b, { kinderU18: n, fbGeteilt: true });
    return { head: [T(l, 'Netto pro Monat', 'Net per month'), eur(ledig.nettoMonat, l)], rows: [[T(l, 'verheiratet, ohne Kinder', 'married, no children'), eur(ledig.nettoMonat, l)], [T(l, 'mit Kindern, Familienbonus geteilt', 'with children, Familienbonus split'), eur(mitKind.nettoMonat, l)]] as [string, string][] }; },
});
