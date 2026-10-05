import { kurz } from '../engine/leistungen';
import { avab } from '../engine/lohn';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was der AVAB oder AEAB Ihnen monatlich bringt', 'What the sole earner or single parent credit adds each month'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 2500, unit: '€', max: 500000 }, { id: 'k', label: T(l, 'Kinder mit Familienbeihilfe', 'Children with family allowance'), def: 1, max: 15 }],
  run: ({ b, k }: Record<string, number>) => { const n = Math.round(k); const o = kurz(b), m = kurz(b, { avab: true, avabKinder: n });
    return { head: [T(l, 'Mehr netto pro Monat', 'Extra net per month'), eur(m.nettoMonat - o.nettoMonat, l, 2)], rows: [[T(l, 'Absetzbetrag im Jahr', 'Credit per year'), eur(avab(n), l)], [T(l, 'Wirksam über den Lohnzettel', 'Effective through payroll'), eur(m.nettoJahr - o.nettoJahr, l)]] as [string, string][], note: T(l, 'Was die Lohnsteuer übersteigt, wird über die Veranlagung erstattet.', 'Any amount above your wage tax is refunded through the tax assessment.') }; },
});
