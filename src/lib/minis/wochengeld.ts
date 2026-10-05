import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Wochengeld aus Ihrem Netto', 'Maternity pay from your net earnings'),
  cta: T(l, 'Kinderbetreuungsgeld-Rechner', 'Childcare allowance calculator'),
  inputs: [{ id: 'n', label: T(l, 'Netto pro Monat (letzte 3 Monate)', 'Net per month (last 3 months)'), def: 2100, unit: '€', max: 100000 }, { id: 's', label: T(l, 'Sonderzahlungen pro Jahr', 'Special payments per year'), def: 2, options: [{ value: '1', label: T(l, 'eine', 'one') }, { value: '2', label: T(l, 'zwei', 'two') }, { value: '3', label: T(l, 'mehr als zwei', 'more than two') }] }],
  run: ({ n, s }: Record<string, number>) => { const z = P.kbg.wochengeld_sz_zuschlag; const q = s === 1 ? z.ein_monatsbezug : s === 2 ? z.zwei_monatsbezuege : z.mehr; const tag = n * 12 / 365 * (1 + q);
    return { head: [T(l, 'Wochengeld pro Tag (Schätzung)', 'Maternity pay per day (estimate)'), eur(tag, l, 2)], rows: [[T(l, 'Zuschlag für Sonderzahlungen', 'Special payment surcharge'), `${Math.round(q * 100)} %`], [T(l, 'für 30 Tage', 'for 30 days'), eur(tag * 30, l)]] as [string, string][] }; },
});
