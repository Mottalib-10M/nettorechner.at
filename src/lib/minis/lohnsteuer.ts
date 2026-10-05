import { svLaufend, lohnsteuerLaufend } from '../engine/lohn';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Lohnsteuer und Grenzsteuersatz bei Ihrem Gehalt', 'Wage tax and marginal rate on your salary'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 3500, unit: '€', max: 1000000 }],
  run: ({ b }: Record<string, number>) => { const sv = svLaufend(b).summe; const r = lohnsteuerLaufend(b - sv);
    return { head: [T(l, 'Lohnsteuer pro Monat', 'Wage tax per month'), eur(r.lst, l, 2)], rows: [[T(l, 'Bemessungsgrundlage im Jahr', 'Annual taxable base'), eur(r.bemessungJahr, l)], [T(l, 'Grenzsteuersatz', 'Marginal rate'), pct(r.grenzsteuersatz, l, 0)], [T(l, 'Durchschnitt vom Brutto', 'Average of gross'), pct(b > 0 ? r.lst / b : 0, l)], [T(l, 'Verkehrsabsetzbetrag im Jahr', 'Transport credit per year'), eur(r.vab, l)]] as [string, string][] }; },
});
