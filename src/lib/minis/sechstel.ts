import { rechneJahr } from '../engine/jahr';
import { T, eur, monatOptionen, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Passt Ihre Weihnachtsremuneration noch ins Sechstel?', 'Does your Christmas pay still fit in the sixth?'),
  cta: T(l, 'Urlaubsgeld- und Weihnachtsgeld-Rechner', 'Holiday and Christmas pay calculator'),
  inputs: [
    { id: 'b', label: T(l, 'Gehalt bis zur Erhöhung', 'Salary before the rise'), def: 3000, unit: '€', max: 500000 },
    { id: 'e', label: T(l, 'Erhöhung um', 'Rise of'), def: 300, unit: '€', max: 100000 },
    { id: 'm', label: T(l, 'Erhöhung ab', 'Rise from'), def: 7, options: monatOptionen(l) },
  ],
  run: ({ b, e, m }: Record<string, number>) => {
    const neu = b + e;
    const mon = Array.from({ length: 12 }, (_, i) => ({ laufend: i + 1 >= m ? neu : b, sz: i === 5 ? (6 >= m ? neu : b) : i === 10 ? (11 >= m ? neu : b) : 0 }));
    const j = rechneJahr(mon); const wr = j.monate[10];
    return { head: [T(l, 'Teil über dem Sechstel (November)', 'Part above the sixth (November)'), eur(wr.szUeberSechstel, l, 2)], rows: [[T(l, 'Sechstel im November', 'Sixth in November'), eur(wr.sechstel, l, 2)], [T(l, 'Mehrsteuer nach Tarif', 'Extra scale tax'), eur(wr.lstSzTarif, l, 2)], [T(l, 'Sechstel am Jahresende', 'Sixth at year end'), eur(j.sechstelEnde, l, 2)]] as [string, string][] };
  },
});
