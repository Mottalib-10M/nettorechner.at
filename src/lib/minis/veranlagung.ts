import { P } from '../engine/params';
import { svLaufend, lohnsteuerLaufend } from '../engine/lohn';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was zusätzliche Werbungskosten zurückbringen', 'What extra work expenses bring back'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 3200, unit: '€', max: 500000 }, { id: 'w', label: T(l, 'Werbungskosten im Jahr', 'Work expenses per year'), def: 600, unit: '€', max: 100000 }],
  run: ({ b, w }: Record<string, number>) => { const sv = svLaufend(b).summe; const r = lohnsteuerLaufend(b - sv); const ueber = Math.max(0, w - P.tarif.werbungskostenpauschale);
    return { head: [T(l, 'Ungefähre Gutschrift', 'Approximate refund'), eur(ueber * r.grenzsteuersatz, l)], rows: [[T(l, 'über dem Pauschale von', 'above the flat amount of'), eur(P.tarif.werbungskostenpauschale, l)], [T(l, 'Grenzsteuersatz', 'Marginal rate'), pct(r.grenzsteuersatz, l, 0)]] as [string, string][], note: T(l, 'Näherung: Betrag über dem Pauschale × Grenzsteuersatz.', 'Approximation: amount above the flat allowance × marginal rate.') }; },
});
