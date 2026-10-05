import { P } from '../engine/params';
import { arbeitslosengeld } from '../engine/leistungen';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Was ein Zuverdienst 2026 beim Arbeitslosengeld kostet', 'What a side job costs you on benefit in 2026'),
  cta: T(l, 'Arbeitslosengeld-Rechner', 'Unemployment benefit calculator'),
  inputs: [{ id: 'b', label: T(l, 'Früheres Monatsbrutto', 'Previous monthly gross'), def: 2400, unit: '€', max: 100000 }, { id: 'z', label: T(l, 'Geplanter Zuverdienst im Monat', 'Planned side earnings per month'), def: 300, unit: '€', max: 10000 }],
  run: ({ b, z }: Record<string, number>) => { const a = arbeitslosengeld(b); const ueber = z > P.sv.geringfuegigkeit;
    return { head: [T(l, 'Arbeitslosengeld pro Monat', 'Benefit per month'), eur(ueber ? 0 : a.monat30, l)], rows: [[T(l, 'Zuverdienst', 'Side earnings'), eur(z, l)], [T(l, 'Geringfügigkeitsgrenze', 'Marginal limit'), eur(P.sv.geringfuegigkeit, l, 2)], [T(l, 'Status', 'Status'), ueber ? T(l, 'nicht arbeitslos: kein ALG in diesem Monat', 'not unemployed: no benefit this month') : T(l, 'nur in Ausnahmefällen erlaubt (seit 2026)', 'only allowed in exceptions (since 2026)')]] as [string, string][] }; },
});
