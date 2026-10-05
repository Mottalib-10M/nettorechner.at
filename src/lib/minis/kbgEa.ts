import { kbgEinkommensabhaengig } from '../engine/leistungen';
import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Einkommensabhängiges KBG aus Ihrem Netto', 'Earnings-related allowance from your net pay'),
  cta: T(l, 'Kinderbetreuungsgeld-Rechner', 'Childcare allowance calculator'),
  inputs: [{ id: 'n', label: T(l, 'Netto pro Monat vor der Geburt', 'Net per month before birth'), def: 2200, unit: '€', max: 100000 }],
  run: ({ n }: Record<string, number>) => { const e = kbgEinkommensabhaengig(n);
    return { head: [T(l, 'pro Tag', 'per day'), eur(e.tagsatz, l, 2)], rows: [[T(l, 'pro Monat (30 Tage)', 'per month (30 days)'), eur(e.monat, l)], [T(l, 'Wochengeld geschätzt', 'Estimated maternity pay'), eur(e.wochengeldTag, l, 2)], [T(l, 'Höchstbetrag', 'Maximum'), eur(P.kbg.ea_tag_max, l, 2)]] as [string, string][] }; },
});
