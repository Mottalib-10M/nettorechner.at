import { svLaufend, avSatz } from '../engine/lohn';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihr Sozialversicherungsbeitrag Posten für Posten', 'Your social insurance contribution item by item'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 2400, unit: '€', max: 1000000 }],
  run: ({ b }: Record<string, number>) => { const s = svLaufend(b);
    return { head: [T(l, 'SV pro Monat', 'Social insurance per month'), eur(s.summe, l, 2)], rows: [[T(l, 'Satz insgesamt', 'Total rate'), pct(s.satz, l, 2)], [T(l, 'Pensionsversicherung', 'Pension'), eur(s.pv, l, 2)], [T(l, 'Krankenversicherung', 'Health'), eur(s.kv, l, 2)], [T(l, `Arbeitslosenversicherung (${pct(avSatz(b), l, 2)})`, `Unemployment (${pct(avSatz(b), l, 2)})`), eur(s.av, l, 2)]] as [string, string][] }; },
});
