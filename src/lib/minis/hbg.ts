import { P } from '../engine/params';
import { svLaufend } from '../engine/lohn';
import { T, eur, pct, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was die Höchstbeitragsgrundlage bei Ihnen deckelt', 'What the contribution ceiling caps for you'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 8000, unit: '€', max: 1000000 }],
  run: ({ b }: Record<string, number>) => { const s = svLaufend(b); const ohne = b * s.satz;
    return { head: [T(l, 'SV pro Monat', 'Social insurance per month'), eur(s.summe, l, 2)], rows: [[T(l, 'ohne Deckel wären es', 'without the ceiling it would be'), eur(ohne, l, 2)], [T(l, 'Ersparnis durch den Deckel', 'Saving from the ceiling'), eur(ohne - s.summe, l, 2)], [T(l, 'Effektiver SV-Satz', 'Effective rate'), pct(b > 0 ? s.summe / b : 0, l)], [T(l, 'Grenze 2026', 'Ceiling 2026'), eur(P.sv.hbg_monat, l)]] as [string, string][] }; },
});
