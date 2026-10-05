import { P } from '../engine/params';
import { kurz } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Unter oder über der Geringfügigkeitsgrenze?', 'Below or above the marginal-employment limit?'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Monatsverdienst brutto', 'Monthly earnings gross'), def: 520, unit: '€', max: 100000, decimals: 2 }],
  run: ({ b }: Record<string, number>) => { const g = P.sv.geringfuegigkeit; const k = kurz(b);
    return { head: [b <= g ? T(l, 'Geringfügig: netto = brutto', 'Marginal: net = gross') : T(l, 'Voll versichert: netto', 'Fully insured: net'), eur(k.nettoMonat, l, 2)], rows: [[T(l, 'Grenze 2026', 'Limit 2026'), eur(g, l, 2)], [T(l, 'Abstand zur Grenze', 'Distance to the limit'), eur(g - b, l, 2)], [T(l, 'Sozialversicherung', 'Social insurance'), eur(k.svMonat, l, 2)]] as [string, string][] }; },
});
