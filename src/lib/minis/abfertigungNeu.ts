import { abfertigungNeu } from '../engine/leistungen';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Ihr Guthaben in der Vorsorgekasse', 'Your balance in the provision fund'),
  cta: T(l, 'Abfertigungsrechner', 'Severance calculator'),
  inputs: [{ id: 'b', label: T(l, 'Monatsbrutto', 'Monthly gross'), def: 3000, unit: '€', max: 500000 }, { id: 'j', label: T(l, 'Beitragsjahre', 'Years of contributions'), def: 10, unit: T(l, 'Jahre', 'yrs'), max: 50, decimals: 1 }],
  run: ({ b, j }: Record<string, number>) => { const r = abfertigungNeu(b, j, 0);
    return { head: [T(l, 'Eingezahlt (ohne Erträge)', 'Paid in (before returns)'), eur(r.einzahlungen, l)], rows: [[T(l, 'pro Jahr', 'per year'), eur(r.beitraegeJahr, l, 2)], [T(l, 'nach 6 % Steuer', 'after 6% tax'), eur(r.einzahlungen * (1 - P.abfertigung.steuersatz), l)], [T(l, 'Auszahlung möglich', 'Payout possible'), r.anspruch ? T(l, 'ja, je nach Ende', 'yes, depending on how it ends') : T(l, 'nein, unter 3 Jahren', 'no, under 3 years')]] as [string, string][] }; },
});
