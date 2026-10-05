import { kurz } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Jahresgehalt in Monatsbezüge und Netto umrechnen', 'Convert an annual salary to monthly pay and net'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'j', label: T(l, 'Jahresbrutto', 'Annual gross'), def: 50000, unit: '€', max: 5000000 }],
  run: ({ j }: Record<string, number>) => { const m = j / 14; const k = kurz(m);
    return { head: [T(l, 'Netto pro Monat', 'Net per month'), eur(k.nettoMonat, l)], rows: [[T(l, 'Monatsbrutto (÷ 14)', 'Monthly gross (÷ 14)'), eur(m, l)], [T(l, 'Jahresnetto', 'Annual net'), eur(k.nettoJahr, l)], [T(l, 'Netto im Schnitt pro Monat (÷ 12)', 'Average net per month (÷ 12)'), eur(k.nettoJahr / 12, l)]] as [string, string][] }; },
});
