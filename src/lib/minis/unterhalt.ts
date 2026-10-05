import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Unterhaltsabsetzbetrag für Ihre Kinder', 'Child maintenance credit for your children'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'k', label: T(l, 'Kinder, für die Sie Unterhalt zahlen', 'Children you pay maintenance for'), def: 1, max: 10 }, { id: 'm', label: T(l, 'Monate voll gezahlt', 'Months paid in full'), def: 12, max: 12 }],
  run: ({ k, m }: Record<string, number>) => { const u = P.absetzbetraege.unterhaltsabsetzbetrag; const n = Math.round(k); let mon = 0; for (let i = 0; i < n; i++) mon += u[Math.min(i, 2)];
    return { head: [T(l, 'Absetzbetrag im Jahr', 'Credit per year'), eur(mon * Math.min(12, Math.round(m)), l)], rows: [[T(l, 'pro Monat', 'per month'), eur(mon, l)], [T(l, 'erstes / zweites / weiteres Kind', 'first / second / further child'), `${eur(u[0], l)} / ${eur(u[1], l)} / ${eur(u[2], l)}`]] as [string, string][] }; },
});
