import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { rechneJahr, standardJahr } from '../../lib/engine/jahr';
import { svLaufend, lohnsteuerLaufend } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const B = 4000;
const k = kurz(B);
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const s40 = P.tarif.saetze[3], S = P.sonderzahlungen;
/** Erstes volles Monatsbrutto mit 40 % Grenzsteuersatz (Motor). */
let ab40 = 3000;
while (lohnsteuerLaufend(ab40 - svLaufend(ab40).summe).grenzsteuersatz < s40) ab40++;
/** Grenzbelastung: laufend (SV + 40 % vom Rest) gegen Sonderzahlung im Sechstel (SV ohne AK/WF + 6 % vom Rest). */
const svSzSatz = P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av;
const grenzL = sv.satz + (1 - sv.satz) * s40;
const grenzSz = svSzSatz + (1 - svSzSatz) * S.stufen[1][1];
/** Erhöhung um 100 € im Monat: Wirkung auf zwölf laufende Bezüge und die zwei Sonderzahlungen. */
const E = 100, kE = kurz(B + E);
const plusLaufend = (kE.nettoMonat - k.nettoMonat) * 12, plusJahr = kE.nettoJahr - k.nettoJahr, plusSz = plusJahr - plusLaufend;
/** Prämie von 1.000 € mit der Weihnachtsremuneration: das Sechstel ist durch 13. und 14. Bezug schon ausgeschöpft. */
const PR = 1000;
const basis = rechneJahr(standardJahr(B));
const mitPr = rechneJahr(standardJahr(B).map((m, i) => (i === 10 ? { ...m, sz: (m.sz ?? 0) + PR } : m)));
const nov = mitPr.monate[10], prNetto = mitPr.netto - basis.netto;
const uzNetto = k.uz.sz - k.uz.svSz - k.uz.lstSzFest;

export default defineGuide({
  id: 'netto-4000',
  group: 'betrag',
  order: 60,
  mini: 'nettoMonat',
  miniDefaults: { b: B },
  related: ['netto-3500', 'netto-5000', 'jahressechstel', 'sonderzahlungen', 'gehaltserhoehung'],
  sources: ['estg33', 'estg67', 'wkoBeitraege', 'bmfRechner'],
  de: {
    slug: '4000-euro-brutto-netto',
    nav: '4.000 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: laufend 40 % Grenzsteuersatz, beim 13. und 14. Gehalt nur ${DE.pct(S.stufen[1][1])}.`,
    title: '4000 Euro brutto in netto 2026: 40-%-Stufe in Österreich',
    description: `4000 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat, schon in der 40-%-Stufe, während Urlaubs- und Weihnachtsgeld nur mit ${DE.pct(S.stufen[1][1])} besteuert werden.`,
    h1: '4.000 Euro brutto: Netto zwischen 40 und 6 Prozent',
    intro: 'Bei diesem Gehalt gehen zwei Steuersätze weit auseinander: der für das laufende Gehalt und der für die Sonderzahlungen.',
    resume: `Von ${DE.eur(B)} brutto bleiben 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat, nach ${DE.eur(sv.summe, 2)} Sozialversicherung und ${DE.eur(lst.lst, 2)} Lohnsteuer. Hochgerechnet ergibt das eine Bemessungsgrundlage von ${DE.eur(lst.bemessungJahr)}, und weil die 30-Prozent-Stufe bei ${DE.eur(P.tarif.grenzen[2])} endet, liegt ein Teil davon schon in der 40-Prozent-Stufe; laut Rechner beginnt sie ab etwa ${DE.eur(ab40)} brutto. Für das laufende Gehalt heißt das: Von jedem zusätzlichen Euro gehen rund ${DE.pct(grenzL, 1)} an Sozialversicherung und Steuer. Urlaubszuschuss und Weihnachtsremuneration werden dagegen innerhalb des Jahressechstels weiter mit ${DE.pct(S.stufen[1][1])} besteuert, die Grenzbelastung liegt dort bei rund ${DE.pct(grenzSz, 1)}. So bringt der Urlaubszuschuss ${DE.eur(uzNetto, 2)} netto, deutlich mehr als ein Monatsgehalt. Eine Prämie hat diesen Vorteil nicht mehr, weil das Sechstel bei vierzehn gleichen Bezügen vollständig verbraucht ist: Von ${DE.eur(PR)} Prämie mit dem Weihnachtsgeld bleiben ${DE.eur(prNetto, 2)}. Das Jahresnetto beträgt ${DE.eur(k.nettoJahr)}.`,
    faqs: [
      { q: 'Warum ist bei 4.000 Euro brutto das Urlaubsgeld netto höher als ein Monatsgehalt?', a: `Weil die beiden Bezüge verschieden besteuert werden. Das Monatsgehalt durchläuft den Tarif, bei ${DE.eur(B)} bis in die 40-Prozent-Stufe, und trägt ${DE.eur(lst.lst, 2)} Lohnsteuer. Der Urlaubszuschuss wird mit dem festen Satz von ${DE.pct(S.stufen[1][1])} besteuert, nach einem Freibetrag von ${DE.eur(S.freibetrag)}, und zahlt keine AK-Umlage und keine Wohnbauförderung. Ergebnis: ${DE.eur(uzNetto, 2)} netto statt ${DE.eur(k.nettoMonat, 2)}.` },
      { q: 'Wie viel bleibt bei 4.000 Euro brutto von einer Prämie?', a: `Bei vierzehn gleichen Bezügen ist das Jahressechstel mit Urlaubszuschuss und Weihnachtsremuneration genau ausgeschöpft. Eine Prämie von ${DE.eur(PR)} im November liegt deshalb ganz darüber und wird wie laufender Bezug nach Tarif versteuert (§ 67 Abs. 10 EStG): ${DE.eur(nov.lstSzTarif, 2)} Lohnsteuer, netto bleiben ${DE.eur(prNetto, 2)}. Steuerfrei wäre dagegen eine Mitarbeiterprämie bis ${DE.eur(P.mitarbeiterpraemie_2026_max)}, die 2026 von Juli bis Dezember auf Grundlage einer lohngestaltenden Vorschrift bezahlt wird.` },
      { q: 'Was bringt bei 4.000 Euro brutto eine Erhöhung um 100 Euro im Monat aufs Jahr gerechnet?', a: `Netto ${DE.eur(plusJahr, 2)} mehr im Jahr. Davon kommen ${DE.eur(plusLaufend, 2)} aus den zwölf Monatsgehältern, die mit 40 Prozent Grenzsteuer belastet sind, und ${DE.eur(plusSz, 2)} aus den zwei Sonderzahlungen, die mitwachsen und nur ${DE.pct(S.stufen[1][1])} Lohnsteuer tragen. Von ${DE.eur(E * 14)} brutto mehr bleiben damit ${DE.pct(plusJahr / (E * 14), 1)}, ein besserer Schnitt als der Grenzsatz des Monatsgehalts vermuten lässt.` },
    ],
    body: (h) => `
<h2>Lohnzettel bei ${h.eur(B)} brutto</h2>
${h.table(['Position', 'Monatsgehalt', 'Urlaubszuschuss'], [
  ['Brutto', h.eur(B, 2), h.eur(k.uz.sz, 2)],
  ['Sozialversicherung', h.eur(sv.summe, 2), h.eur(k.uz.svSz, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.eur(k.uz.lstSzFest, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.eur(uzNetto, 2)],
], 'Außerhalb Wiens, ohne Kinder; Urlaubszuschuss im Juni', ['l', 'r', 'r'])}
<h2>Seit etwa ${h.eur(ab40)} brutto: die 40-Prozent-Stufe</h2>
<p>Die Bemessungsgrundlage von ${h.eur(lst.bemessungJahr)} im Jahr überschreitet die Grenze von ${h.eur(h.P.tarif.grenzen[2])} um ${h.eur(lst.bemessungJahr - h.P.tarif.grenzen[2])}. Nur dieser Teil wird mit 40 Prozent besteuert (${h.src('estg33', '§ 33 Abs. 1 EStG')}), alles darunter wie bisher. Der Durchschnitt bleibt deshalb niedrig: Die Lohnsteuer macht ${h.pct(lst.lst / B, 1)} des Monatsbruttos aus. Für Entscheidungen zählt aber der Grenzsatz, und der liegt mit Sozialversicherung bei ${h.pct(grenzL, 1)}.</p>
<h2>Laufend 40 Prozent, Sonderzahlung 6 Prozent</h2>
<p>Für den 13. und 14. Bezug gilt ein eigener Tarif (${h.src('estg67', '§ 67 Abs. 1 EStG')}): ${h.eur(S.freibetrag)} frei, dann ${h.pct(S.stufen[1][1])} bis zu einer Summe von ${h.eur(S.stufen[0][0] + S.stufen[1][0])} im Jahr. Bei ${h.eur(B)} reicht das für beide Sonderzahlungen. Sozialversicherung fällt auf Sonderzahlungen ohne AK-Umlage und Wohnbauförderung an (${h.src('wkoBeitraege', 'WKO')}), der Satz beträgt ${h.pct(svSzSatz, 2)}. Der Abstand zwischen beiden Welten ist bei diesem Gehalt so groß wie nie zuvor auf der Gehaltsskala.</p>
${h.table(['Von einem Euro brutto mehr', 'im Monatsgehalt', 'in einer Sonderzahlung'], [
  ['Sozialversicherung', h.pct(sv.satz, 2), h.pct(svSzSatz, 2)],
  ['Lohnsteuer auf den Rest', h.pct(s40), h.pct(S.stufen[1][1])],
  ['Abzüge insgesamt', h.pct(grenzL, 1), h.pct(grenzSz, 1)],
  ['bleibt netto', h.pct(1 - grenzL, 1), h.pct(1 - grenzSz, 1)],
], 'Grenzbelastung bei 4.000 € brutto, Sonderzahlung innerhalb des Jahressechstels', ['l', 'r', 'r'])}
<h2>Eine Erhöhung wirkt vierzehnmal</h2>
<p>Steigt das Monatsgehalt um ${h.eur(E)}, steigen Urlaubszuschuss und Weihnachtsremuneration mit. Im Jahr kommen netto ${h.eur(plusJahr, 2)} an: ${h.eur(plusLaufend, 2)} aus den zwölf Monaten und ${h.eur(plusSz, 2)} aus den beiden Sonderzahlungen. Der ${h.a('gehaltserhoehung', 'Gehaltserhöhungsrechner')} zeigt den Monatswert für jede Erhöhung.</p>
<h2>Prämien: das Sechstel ist schon voll</h2>
<p>Das Jahressechstel beträgt bei gleichbleibendem Gehalt ${h.eur(nov.sechstel)}, genau so viel wie die beiden Sonderzahlungen zusammen. Eine Prämie von ${h.eur(PR)} mit dem Weihnachtsgeld passt nicht mehr hinein und wird nach Tarif versteuert, im November also mit 40 Prozent: ${h.eur(nov.lstSzTarif, 2)} Lohnsteuer, netto ${h.eur(prNetto, 2)}. Wie das Sechstel wächst und schrumpft, erklärt der Ratgeber zum ${h.a('jahressechstel', 'Jahressechstel')}. Eine Ausnahme ist die steuerfreie Mitarbeiterprämie bis ${h.eur(h.P.mitarbeiterpraemie_2026_max)} im zweiten Halbjahr 2026, die das Sechstel weder erhöht noch verbraucht.</p>
<p>Weitere Fälle im ${h.a('home', 'Brutto-Netto-Rechner')}. Darunter: ${h.a('netto-3500', '3.500 Euro brutto')}, noch ganz in der 30-Prozent-Stufe; darüber: ${h.a('netto-5000', '5.000 Euro brutto')}.</p>
`,
  },
  en: {
    slug: '4000-euro-gross-to-net',
    nav: '€4,000 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: a 40% marginal rate on salary, only ${EN.pct(S.stufen[1][1])} on the 13th and 14th salary.`,
    title: '4000 Euro Gross to Net in Austria 2026: Into the 40% Band',
    description: `4000 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month, a 40% marginal rate on salary, while holiday and Christmas pay are still taxed at a flat ${EN.pct(S.stufen[1][1])} rate.`,
    h1: '4,000 euros gross: net pay between 40% and 6%',
    intro: 'At this salary two tax rates drift far apart: the one on your monthly pay and the one on the two extra salaries.',
    resume: `A gross salary of ${EN.eur(B)} a month leaves ${EN.eur(k.nettoMonat, 2)} net in Austria in 2026, after ${EN.eur(sv.summe, 2)} of social insurance and ${EN.eur(lst.lst, 2)} of wage tax. Projected over a year, your taxable base is ${EN.eur(lst.bemessungJahr)}; the 30 percent band stops at ${EN.eur(P.tarif.grenzen[2])}, so the top slice is already taxed at 40 percent. The calculator puts that threshold at about ${EN.eur(ab40)} gross. On your regular pay, each extra euro now loses about ${EN.pct(grenzL, 1)} to social insurance and tax. Holiday pay and Christmas pay, the special payments (Sonderzahlungen) most Austrian employees receive in June and November, are still taxed at a flat ${EN.pct(S.stufen[1][1])} within the annual sixth, so their marginal burden is only about ${EN.pct(grenzSz, 1)}. That is why holiday pay nets ${EN.eur(uzNetto, 2)}, well above a normal month. Bonuses do not share this advantage: with fourteen equal salaries the sixth is already used up, and a ${EN.eur(PR)} bonus paid in November leaves ${EN.eur(prNetto, 2)}. Annual net pay is ${EN.eur(k.nettoJahr)}.`,
    faqs: [
      { q: 'Why is holiday pay bigger than a normal month on 4,000 euros gross?', a: `The two are taxed differently. Your monthly salary goes through the regular scale, at this level up into the 40 percent band, and carries ${EN.eur(lst.lst, 2)} of wage tax. Holiday pay is taxed at a fixed ${EN.pct(S.stufen[1][1])} after a ${EN.eur(S.freibetrag)} allowance and pays no chamber levy or housing subsidy. The result is ${EN.eur(uzNetto, 2)} net against ${EN.eur(k.nettoMonat, 2)} for an ordinary month.` },
      { q: 'How much of a bonus do you keep on 4,000 euros gross?', a: `With fourteen equal salaries, holiday and Christmas pay fill the annual sixth exactly. A ${EN.eur(PR)} bonus in November therefore falls entirely outside it and is taxed like regular pay (section 67(10) Income Tax Act): ${EN.eur(nov.lstSzTarif, 2)} of wage tax, leaving ${EN.eur(prNetto, 2)}. The exception is the 2026 employee bonus (Mitarbeiterprämie) of up to ${EN.eur(P.mitarbeiterpraemie_2026_max)}, tax-free when paid between July and December on the basis of a collective agreement or similar rule.` },
      { q: 'What does a 100 euro monthly raise add per year at 4,000 euros?', a: `About ${EN.eur(plusJahr, 2)} net a year. Twelve monthly salaries, taxed at the 40 percent marginal rate, contribute ${EN.eur(plusLaufend, 2)}; the two special payments rise too and add ${EN.eur(plusSz, 2)}, taxed at only ${EN.pct(S.stufen[1][1])}. Out of ${EN.eur(E * 14)} extra gross you keep ${EN.pct(plusJahr / (E * 14), 1)}, a better share than the monthly marginal rate suggests.` },
    ],
    body: (h) => `
<h2>Your payslip at ${h.eur(B)} gross</h2>
${h.table(['Item', 'Monthly salary', 'Holiday pay'], [
  ['Gross', h.eur(B, 2), h.eur(k.uz.sz, 2)],
  ['Social insurance', h.eur(sv.summe, 2), h.eur(k.uz.svSz, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.eur(k.uz.lstSzFest, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.eur(uzNetto, 2)],
], 'Outside Vienna, no children; holiday pay in June', ['l', 'r', 'r'])}
<h2>From about ${h.eur(ab40)} gross: the 40 percent band</h2>
<p>Your annual taxable base of ${h.eur(lst.bemessungJahr)} passes the ${h.eur(h.P.tarif.grenzen[2])} line by ${h.eur(lst.bemessungJahr - h.P.tarif.grenzen[2])}. Only that slice is taxed at 40 percent (${h.src('estg33', 'section 33(1) Income Tax Act')}); everything below keeps its old rate. So the average stays moderate, with wage tax at ${h.pct(lst.lst / B, 1)} of monthly gross. For decisions the marginal rate matters, and including social insurance it is ${h.pct(grenzL, 1)}.</p>
<h2>40 percent on salary, 6 percent on special payments</h2>
<p>The 13th and 14th salary have their own scale (${h.src('estg67', 'section 67(1)')}): ${h.eur(S.freibetrag)} tax-free, then ${h.pct(S.stufen[1][1])} on a total of up to ${h.eur(S.stufen[0][0] + S.stufen[1][0])} a year, which covers both payments at this salary. Social insurance on them excludes the chamber levy and housing subsidy (${h.src('wkoBeitraege', 'Chamber of Commerce')}), at ${h.pct(svSzSatz, 2)}. At no lower salary is the gap between the two rates as wide as here.</p>
${h.table(['Out of one extra gross euro', 'in monthly salary', 'in a special payment'], [
  ['Social insurance', h.pct(sv.satz, 2), h.pct(svSzSatz, 2)],
  ['Wage tax on the rest', h.pct(s40), h.pct(S.stufen[1][1])],
  ['Total deductions', h.pct(grenzL, 1), h.pct(grenzSz, 1)],
  ['You keep', h.pct(1 - grenzL, 1), h.pct(1 - grenzSz, 1)],
], 'Marginal burden at 4,000 euros gross, special payment within the annual sixth', ['l', 'r', 'r'])}
<h2>A raise counts fourteen times</h2>
<p>When your monthly salary goes up by ${h.eur(E)}, holiday and Christmas pay follow. Over the year you gain ${h.eur(plusJahr, 2)} net: ${h.eur(plusLaufend, 2)} from twelve months and ${h.eur(plusSz, 2)} from the two special payments. The ${h.a('gehaltserhoehung', 'pay rise calculator')} gives the monthly figure for any raise.</p>
<h2>Bonuses: the sixth is already full</h2>
<p>With a steady salary the annual sixth is ${h.eur(nov.sechstel)}, exactly the sum of your two special payments. A ${h.eur(PR)} bonus paid with Christmas pay does not fit and is taxed on the regular scale, in November at 40 percent: ${h.eur(nov.lstSzTarif, 2)} of tax, ${h.eur(prNetto, 2)} net. The ${h.a('jahressechstel', 'annual sixth')} guide shows how the limit moves during the year. The tax-free employee bonus of up to ${h.eur(h.P.mitarbeiterpraemie_2026_max)} in the second half of 2026 neither uses nor raises the sixth.</p>
<p>Try other situations in the ${h.a('home', 'gross-to-net calculator')}. One step down, ${h.a('netto-3500', '3,500 euros gross')} is still fully in the 30 percent band; one step up, ${h.a('netto-5000', '5,000 euros gross')}.</p>
`,
  },
});
