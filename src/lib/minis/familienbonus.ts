import { kurz } from '../engine/leistungen';
import { familienbonusMonat } from '../engine/lohn';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wie viel Familienbonus wirkt bei Ihrem Gehalt?', 'How much Familienbonus works on your salary?'),
  cta: T(l, 'Familienbonus-Plus-Rechner', 'Familienbonus Plus calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 2400, unit: '€', max: 500000 }, { id: 'k', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 2, max: 15 }],
  run: ({ b, k }: Record<string, number>) => { const o = kurz(b), m = kurz(b, { kinderU18: Math.round(k) }); const max = familienbonusMonat({ kinderU18: Math.round(k) }) * 12;
    return { head: [T(l, 'Wirksamer Familienbonus pro Jahr', 'Effective Familienbonus per year'), eur(m.nettoJahr - o.nettoJahr, l)], rows: [[T(l, 'Höchstbetrag', 'Maximum'), eur(max, l)], [T(l, 'Netto pro Monat mit Bonus', 'Net per month with bonus'), eur(m.nettoMonat, l)], [T(l, 'Lohnsteuer pro Monat mit Bonus', 'Monthly wage tax with bonus'), eur(m.lstMonat, l)]] as [string, string][] }; },
});
