import { P } from '../engine/params';
import { svLaufend, lohnsteuerLaufend } from '../engine/lohn';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Verkehrsabsetzbetrag und Zuschlag bei Ihrem Einkommen', 'Transport credit and supplement at your income'),
  cta: T(l, 'Brutto-Netto-Rechner', 'Gross-to-net calculator'),
  inputs: [{ id: 'b', label: T(l, 'Brutto pro Monat', 'Gross per month'), def: 1700, unit: '€', max: 500000 }],
  run: ({ b }: Record<string, number>) => { const A = P.absetzbetraege; const sv = svLaufend(b).summe; const r = lohnsteuerLaufend(b - sv); const ek = r.bemessungJahr;
    const zuschlag = ek <= A.vab_zuschlag_bis ? A.vab_zuschlag : ek >= A.vab_zuschlag_einschleif_bis ? 0 : A.vab_zuschlag * (A.vab_zuschlag_einschleif_bis - ek) / (A.vab_zuschlag_einschleif_bis - A.vab_zuschlag_bis);
    return { head: [T(l, 'Verkehrsabsetzbetrag', 'Transport credit'), eur(A.verkehrsabsetzbetrag, l)], rows: [[T(l, 'Jahreseinkommen (laufend)', 'Annual income (regular)'), eur(ek, l)], [T(l, 'Zuschlag (Veranlagung)', 'Supplement (assessment)'), eur(zuschlag, l)], [T(l, 'Lohnsteuer pro Monat', 'Monthly wage tax'), eur(r.lst, l, 2)]] as [string, string][] }; },
});
