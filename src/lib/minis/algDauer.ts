import { algDauer } from '../engine/leistungen';
import { T, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wie lange Sie Arbeitslosengeld bekommen', 'How long you receive unemployment benefit'),
  cta: T(l, 'Arbeitslosengeld-Rechner', 'Unemployment benefit calculator'),
  inputs: [{ id: 'a', label: T(l, 'Alter bei Antrag', 'Age when claiming'), def: 42, unit: T(l, 'Jahre', 'yrs'), max: 70 }, { id: 'j', label: T(l, 'Versicherte Jahre in den letzten 10 Jahren', 'Insured years in the last 10'), def: 7, unit: T(l, 'Jahre', 'yrs'), max: 15, decimals: 1 }],
  run: ({ a, j }: Record<string, number>) => { const w = algDauer(Math.round(j * 52), a);
    return { head: [T(l, 'Bezugsdauer', 'Duration'), `${num(w, l)} ${T(l, 'Wochen', 'weeks')}`], rows: [[T(l, 'in Tagen', 'in days'), num(w * 7, l)], [T(l, 'Versicherungswochen', 'Insured weeks'), num(Math.round(j * 52), l)]] as [string, string][] }; },
});
