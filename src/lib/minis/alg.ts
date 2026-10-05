import { arbeitslosengeld } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Arbeitslosengeld aus Ihrem letzten Gehalt', 'Unemployment benefit from your last salary'),
  cta: T(l, 'Arbeitslosengeld-Rechner', 'Unemployment benefit calculator'),
  inputs: [{ id: 'b', label: T(l, 'Monatsbrutto ohne Sonderzahlungen', 'Monthly gross without special payments'), def: 2600, unit: '€', max: 100000 }],
  run: ({ b }: Record<string, number>) => { const a = arbeitslosengeld(b);
    return { head: [T(l, 'Tagsatz', 'Daily rate'), eur(a.tagsatz, l, 2)], rows: [[T(l, 'pro Monat (30 Tage)', 'per month (30 days)'), eur(a.monat30, l)], [T(l, 'Grundbetrag 55 %', 'Basic amount 55%'), eur(a.grundbetrag, l, 2)], [T(l, 'Ergänzungsbetrag', 'Top-up'), eur(a.ergaenzung, l, 2)]] as [string, string][] }; },
});
