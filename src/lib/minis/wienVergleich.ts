import { kurz } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wien gegen die anderen Bundesländer', 'Vienna versus the other states'),
  cta: T(l, 'Brutto-Netto-Rechner Wien', 'Vienna gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 3000, unit: '€', max: 500000 }],
  run: ({ b }: Record<string, number>) => { const w = kurz(b, { wien: true }), a = kurz(b);
    return { head: [T(l, 'Weniger netto in Wien pro Jahr', 'Less net in Vienna per year'), eur(a.nettoJahr - w.nettoJahr, l, 2)], rows: [[T(l, 'Netto pro Monat Wien', 'Net per month Vienna'), eur(w.nettoMonat, l, 2)], [T(l, 'Netto pro Monat übrige Länder', 'Net per month other states'), eur(a.nettoMonat, l, 2)], [T(l, 'Unterschied pro Monat', 'Difference per month'), eur(a.nettoMonat - w.nettoMonat, l, 2)]] as [string, string][] }; },
});
