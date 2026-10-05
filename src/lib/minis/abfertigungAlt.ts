import { abfertigungAlt } from '../engine/leistungen';
import { T, eur, num, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Abfertigung alt nach Dienstjahren', 'Old-scheme severance by years of service'),
  cta: T(l, 'Abfertigungsrechner', 'Severance calculator'),
  inputs: [{ id: 'b', label: T(l, 'Letztes Monatsbrutto', 'Last monthly gross'), def: 3500, unit: '€', max: 500000 }, { id: 'j', label: T(l, 'Dienstjahre', 'Years of service'), def: 15, unit: T(l, 'Jahre', 'yrs'), max: 50 }],
  run: ({ b, j }: Record<string, number>) => { const r = abfertigungAlt(b, j);
    return { head: [T(l, 'Abfertigung brutto', 'Severance gross'), eur(r.brutto, l)], rows: [[T(l, 'Monatsentgelte', 'Months’ pay'), num(r.monate, l)], [T(l, 'Monatsentgelt inkl. Sonderzahlungen', 'Monthly pay incl. special payments'), eur(r.monatsentgelt, l)], [T(l, 'netto nach 6 %', 'net after 6%'), eur(r.netto, l)]] as [string, string][] }; },
});
