import { arbeitslosengeld, notstandshilfe } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Notstandshilfe nach dem Arbeitslosengeld', 'Emergency assistance after unemployment benefit'),
  cta: T(l, 'Arbeitslosengeld-Rechner', 'Unemployment benefit calculator'),
  inputs: [{ id: 'b', label: T(l, 'Früheres Monatsbrutto', 'Previous monthly gross'), def: 2600, unit: '€', max: 100000 }, { id: 'w', label: T(l, 'Bezogene ALG-Wochen', 'Weeks of benefit received'), def: 20, options: [{ value: '20', label: '20' }, { value: '30', label: '30' }, { value: '39', label: '39' }, { value: '52', label: '52' }] }],
  run: ({ b, w }: Record<string, number>) => { const a = arbeitslosengeld(b); const n = notstandshilfe(a, w), n6 = notstandshilfe(a, w, true);
    return { head: [T(l, 'Notstandshilfe pro Tag', 'Emergency assistance per day'), eur(n.tagsatz, l, 2)], rows: [[T(l, 'Arbeitslosengeld vorher', 'Benefit before'), eur(a.tagsatz, l, 2)], [T(l, 'ab dem 7. Monat', 'from month 7'), eur(n6.tagsatz, l, 2)], [T(l, 'pro Monat (30 Tage)', 'per month (30 days)'), eur(n.monat30, l)]] as [string, string][] }; },
});
