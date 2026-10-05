import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Zuverdienst neben dem Kinderbetreuungsgeld 2026', 'Earnings alongside childcare allowance in 2026'),
  cta: T(l, 'Kinderbetreuungsgeld-Rechner', 'Childcare allowance calculator'),
  inputs: [{ id: 'z', label: T(l, 'Geplanter Zuverdienst im Kalenderjahr', 'Planned earnings in the calendar year'), def: 9000, unit: '€', max: 500000 }, { id: 's', label: T(l, 'System', 'Scheme'), def: 0, options: [{ value: '0', label: T(l, 'KBG-Konto', 'Account') }, { value: '1', label: T(l, 'einkommensabhängig', 'earnings-related') }] }],
  run: ({ z, s }: Record<string, number>) => { const g = s ? P.kbg.zuverdienst_ea : P.kbg.zuverdienst_konto;
    return { head: [z <= g ? T(l, 'Innerhalb der Grenze', 'Within the limit') : T(l, 'Über der Grenze um', 'Above the limit by'), eur(Math.max(0, z - g), l)], rows: [[T(l, 'Zuverdienstgrenze', 'Earnings limit'), eur(g, l)], [T(l, 'Spielraum', 'Headroom'), eur(Math.max(0, g - z), l)]] as [string, string][], note: T(l, 'Was über der Grenze liegt, wird zurückgefordert (Einschleifregelung).', 'Anything above the limit is reclaimed (gradual clawback).') }; },
});
