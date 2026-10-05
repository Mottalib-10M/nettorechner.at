import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Familienbonus: ganz oder geteilt beantragen?', 'Familienbonus: claim it in full or split?'),
  cta: T(l, 'Familienbonus-Plus-Rechner', 'Familienbonus Plus calculator'),
  inputs: [{ id: 'k1', label: T(l, 'Kinder unter 18', 'Children under 18'), def: 1, max: 15 }, { id: 'k2', label: T(l, 'Kinder ab 18', 'Children 18+'), def: 0, max: 15 }],
  run: ({ k1, k2 }: Record<string, number>) => { const a = P.absetzbetraege; const voll = (Math.round(k1) * a.familienbonus_monat_u18 + Math.round(k2) * a.familienbonus_monat_ue18) * 12;
    return { head: [T(l, 'Familienbonus pro Jahr', 'Familienbonus per year'), eur(voll, l, 2)], rows: [[T(l, 'je Elternteil bei Teilung', 'per parent if split'), eur(voll / 2, l, 2)], [T(l, 'pro Monat und Kind unter 18', 'per month and child under 18'), eur(a.familienbonus_monat_u18, l, 2)], [T(l, 'pro Monat und Kind ab 18', 'per month and child 18+'), eur(a.familienbonus_monat_ue18, l, 2)]] as [string, string][] }; },
});
