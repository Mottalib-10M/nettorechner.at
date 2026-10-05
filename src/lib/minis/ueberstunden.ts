import { ueberstunden } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Überstunden: was netto bleibt', 'Overtime: what you keep net'),
  cta: T(l, 'Überstundenrechner', 'Overtime calculator'),
  inputs: [{ id: 'b', label: T(l, 'Monatsbrutto', 'Monthly gross'), def: 3000, unit: '€', max: 500000 }, { id: 'h', label: T(l, 'Überstunden im Monat', 'Overtime hours this month'), def: 12, unit: 'h', max: 200, decimals: 1 }],
  run: ({ b, h }: Record<string, number>) => { const r = ueberstunden(b, 40, h);
    return { head: [T(l, 'Mehr netto', 'Extra net'), eur(r.nettoMehr, l, 2)], rows: [[T(l, 'Mehr brutto', 'Extra gross'), eur(r.bruttoMehr, l, 2)], [T(l, 'steuerfreier Zuschlag', 'tax-free premium'), eur(r.steuerfreierZuschlag, l, 2)], [T(l, 'Stundenlohn (40 h)', 'Hourly pay (40 h)'), eur(r.stundenlohn, l, 2)]] as [string, string][] }; },
});
