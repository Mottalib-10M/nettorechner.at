import { kbgKonto } from '../engine/leistungen';
import { T, eur, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Tagsatz beim Kinderbetreuungsgeld-Konto', 'Daily rate on the childcare account'),
  cta: T(l, 'Kinderbetreuungsgeld-Rechner', 'Childcare allowance calculator'),
  inputs: [{ id: 't', label: T(l, 'Bezugsdauer ab Geburt', 'Duration from birth'), def: 500, unit: T(l, 'Tage', 'days'), max: 1063 }],
  run: ({ t }: Record<string, number>) => { const k = kbgKonto(t, t > 851);
    return { head: [T(l, 'pro Tag', 'per day'), eur(k.tagsatz, l, 2)], rows: [[T(l, 'pro Monat (30 Tage)', 'per month (30 days)'), eur(k.monat, l)], [T(l, 'gesamt', 'total'), eur(k.gesamt, l)], [T(l, 'Tage gerechnet', 'days used'), num(k.tage, l)]] as [string, string][] }; },
});
