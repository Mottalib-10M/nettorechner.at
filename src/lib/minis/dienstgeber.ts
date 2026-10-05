import { dienstgeberkosten } from '../engine/leistungen';
import { P } from '../engine/params';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was das Gehalt den Dienstgeber kostet', 'What the salary costs the employer'),
  cta: T(l, 'Dienstgeberkosten-Rechner', 'Employer cost calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 3000, unit: '€', max: 500000 }],
  run: ({ b }: Record<string, number>) => { const d = dienstgeberkosten(b, 'oberoesterreich');
    return { head: [T(l, 'Kosten pro Jahr', 'Cost per year'), eur(d.jahr, l)], rows: [[T(l, 'Lohnnebenkosten pro Monat', 'Payroll costs per month'), eur(d.monat, l)], [T(l, 'Aufschlag auf das Brutto', 'Mark-up on gross'), pct(d.aufschlag, l)]] as [string, string][], note: T(l, `Beispiel Oberösterreich (Zuschlag zum DB ${pct(P.dienstgeber.dz.oberoesterreich, l, 2)}).`, `Example Upper Austria (DB surcharge ${pct(P.dienstgeber.dz.oberoesterreich, l, 2)}).`) }; },
});
