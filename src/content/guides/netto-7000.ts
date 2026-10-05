import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const B = 7000;
const k = kurz(B);
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const HBG = P.sv.hbg_monat, HBG_SZ = P.sv.hbg_sz_jahr;
const ueber = B - HBG, ohneDeckel = B * sv.satz, ersparnis = ohneDeckel - sv.summe;
const svSzSatz = P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av;
/** Weihnachtsremuneration: nur der Rest der Jahresgrenze für Sonderzahlungen ist beitragspflichtig. */
const wrBasis = HBG_SZ - k.uz.sz, wrFrei = k.wr.sz - wrBasis;
const ersparnisJahr = ersparnis * 12, ersparnisSz = k.uz.svSz - k.wr.svSz;
const svJahrQuote = k.svJahr / k.bruttoJahr;
const s40 = P.tarif.saetze[3], s48 = P.tarif.saetze[4];
/** Erstes volles Monatsbrutto mit 48 % Grenzsteuersatz (Motor). */
let ab48 = HBG;
while (lohnsteuerLaufend(ab48 - svLaufend(ab48).summe).grenzsteuersatz < s48) ab48++;
const grenzUnter = svLaufend(HBG).satz + (1 - svLaufend(HBG).satz) * s40;
const reihe = [B - 500, B, ab48 - 1, ab48, 8000].map((b) => {
  const s = svLaufend(b), g = lohnsteuerLaufend(b - s.summe).grenzsteuersatz;
  return { b, n: kurz(b).nettoMonat, g, gesamt: s.gedeckelt ? g : s.satz + (1 - s.satz) * g };
});
const wrNetto = k.wr.sz - k.wr.svSz - k.wr.lstSzFest, uzNetto = k.uz.sz - k.uz.svSz - k.uz.lstSzFest;

export default defineGuide({
  id: 'netto-7000',
  group: 'betrag',
  order: 90,
  mini: 'hbg',
  miniDefaults: { b: B },
  miniHref: 'hoechstbeitragsgrundlage',
  related: ['netto-6000', 'netto-10000', 'hoechstbeitragsgrundlage', 'sonderzahlungen', 'dienstgeberkosten'],
  sources: ['oegkWerte', 'wkoBeitraege', 'estg33', 'bmfRechner'],
  de: {
    slug: '7000-euro-brutto-netto',
    nav: '7.000 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: Sozialversicherung gedeckelt, von jedem Euro darüber bleiben ${DE.num((1 - s40) * 100)} Cent.`,
    title: '7000 Euro brutto in netto 2026: über der Beitragsgrenze',
    description: `7000 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat, Sozialversicherung gedeckelt bei ${DE.eur(HBG)}, und die 48-%-Stufe beginnt bei etwa ${DE.eur(ab48)}.`,
    h1: '7.000 Euro brutto: Netto mit gedeckelter Sozialversicherung',
    intro: 'Was die Höchstbeitragsgrundlage bei diesem Gehalt spart, beim Monatsgehalt und bei der Weihnachtsremuneration, und wie nah die nächste Steuerstufe ist.',
    resume: `Von ${DE.eur(B)} brutto bleiben 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat. Die Sozialversicherung beträgt ${DE.eur(sv.summe, 2)} und steigt nicht weiter, weil sie nur bis zur Höchstbeitragsgrundlage von ${DE.eur(HBG)} berechnet wird; die ${DE.eur(ueber)} darüber sind beitragsfrei. Ohne Deckel wären es ${DE.eur(ohneDeckel, 2)}. Die Sonderzahlungen haben eine eigene Jahresgrenze von ${DE.eur(HBG_SZ)}, und weil Urlaubszuschuss und Weihnachtsremuneration zusammen ${DE.eur(2 * B)} ergeben, bleiben im November ${DE.eur(wrFrei)} beitragsfrei. Netto bringt die Weihnachtsremuneration trotzdem ${DE.eur(wrNetto, 2)} und damit weniger als der Urlaubszuschuss (${DE.eur(uzNetto, 2)}), weil der Steuerfreibetrag schon im Juni verbraucht ist. Von jedem Euro über ${DE.eur(HBG)} gehen nur noch ${DE.pct(s40)} Lohnsteuer ab, Sie behalten ${DE.num((1 - s40) * 100)} Cent statt rund ${DE.num((1 - grenzUnter) * 100)}. Das gilt aber nur kurz: Laut Rechner beginnt ab etwa ${DE.eur(ab48)} brutto die 48-Prozent-Stufe, denn die hochgerechnete Bemessungsgrundlage von ${DE.eur(lst.bemessungJahr)} liegt nur ${DE.eur(P.tarif.grenzen[3] - lst.bemessungJahr)} unter ${DE.eur(P.tarif.grenzen[3])}. Das Jahresnetto beträgt ${DE.eur(k.nettoJahr)}.`,
    faqs: [
      { q: 'Wie viel spart die Höchstbeitragsgrundlage bei 7.000 Euro brutto?', a: `Beim Monatsgehalt ${DE.eur(ersparnis, 2)} im Monat, ${DE.eur(ersparnisJahr, 2)} im Jahr, weil nur ${DE.eur(ueber)} über der Grenze von ${DE.eur(HBG)} liegen. Dazu kommt die Grenze für Sonderzahlungen von ${DE.eur(HBG_SZ)} im Jahr. Bei der Weihnachtsremuneration sind nur noch ${DE.eur(wrBasis)} beitragspflichtig, die Sozialversicherung beträgt ${DE.eur(k.wr.svSz, 2)} statt ${DE.eur(k.uz.svSz, 2)} beim Urlaubszuschuss. Insgesamt zahlen Sie ${DE.pct(svJahrQuote, 2)} Ihres Jahresbruttos an Sozialversicherung statt ${DE.pct(sv.satz, 2)}.` },
      { q: 'Wie viel bleibt bei 7.000 Euro brutto von 100 Euro Gehaltserhöhung?', a: `Rund ${DE.eur(100 * (1 - s40))}, solange das neue Gehalt unter etwa ${DE.eur(ab48)} bleibt. Über der Höchstbeitragsgrundlage fällt keine Sozialversicherung mehr an, nur Lohnsteuer mit dem Grenzsatz von ${DE.pct(s40)}. Ab der 48-Prozent-Stufe sind es noch ${DE.eur(100 * (1 - s48))}. Weil die Sonderzahlungen mitwachsen und mit ${DE.pct(P.sonderzahlungen.stufen[1][1])} besteuert werden, liegt der Jahresgewinn etwas höher als zwölfmal der Monatswert.` },
      { q: 'Warum zahlt man bei 7.000 Euro brutto auf das Weihnachtsgeld weniger Beiträge, aber mehr Steuer?', a: `Die Sozialversicherung auf Sonderzahlungen endet bei ${DE.eur(HBG_SZ)} im Kalenderjahr. Der Urlaubszuschuss im Juni ist voll beitragspflichtig, von der Weihnachtsremuneration nur noch ${DE.eur(wrBasis)}: ${DE.eur(ersparnisSz, 2)} weniger Beiträge. Gleichzeitig fehlt im November der Freibetrag von ${DE.eur(P.sonderzahlungen.freibetrag)}, den der Urlaubszuschuss verbraucht hat, die Lohnsteuer steigt auf ${DE.eur(k.wr.lstSzFest, 2)}. Unterm Strich bleiben ${DE.eur(wrNetto, 2)} im November und ${DE.eur(uzNetto, 2)} im Juni.` },
    ],
    body: (h) => `
<h2>Lohnzettel bei ${h.eur(B)}: zwei Grenzen im Spiel</h2>
${h.table(['Position', 'Monatsgehalt', 'Urlaubszuschuss', 'Weihnachtsremuneration'], [
  ['Brutto', h.eur(B, 2), h.eur(k.uz.sz, 2), h.eur(k.wr.sz, 2)],
  ['beitragspflichtig', h.eur(HBG, 2), h.eur(k.uz.sz, 2), h.eur(wrBasis, 2)],
  ['Sozialversicherung', h.eur(sv.summe, 2), h.eur(k.uz.svSz, 2), h.eur(k.wr.svSz, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.eur(k.uz.lstSzFest, 2), h.eur(k.wr.lstSzFest, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.eur(uzNetto, 2), h.eur(wrNetto, 2)],
], 'Außerhalb Wiens, ohne Kinder; Urlaubszuschuss im Juni, Weihnachtsremuneration im November', ['l', 'r', 'r', 'r'])}
<h2>Die Sozialversicherung endet bei ${h.eur(HBG)}</h2>
<p>Die Höchstbeitragsgrundlage 2026 beträgt ${h.eur(HBG)} im Monat (${h.src('oegkWerte', 'ÖGK')}). Bei ${h.eur(B)} sind ${h.eur(ueber)} beitragsfrei, die Beiträge bleiben bei ${h.eur(sv.summe, 2)}. Der Effekt ist hier noch klein, ${h.eur(ersparnis, 2)} im Monat, wächst aber mit jedem Euro: Bei ${h.eur(8000)} brutto spart der Deckel schon ${h.eur(8000 * sv.satz - sv.summe, 2)}. Der Mini-Rechner oben zeigt die Ersparnis für jedes Gehalt.</p>
<h2>Weihnachtsremuneration: nur noch ${h.eur(wrBasis)} verbeitragt</h2>
<p>Für Sonderzahlungen gilt eine Jahresgrenze von ${h.eur(HBG_SZ)} (${h.src('wkoBeitraege', 'WKO')}). Der Urlaubszuschuss verbraucht davon ${h.eur(k.uz.sz)}, für die Weihnachtsremuneration bleiben ${h.eur(wrBasis)}. Die übrigen ${h.eur(wrFrei)} sind beitragsfrei, der Abzug beträgt ${h.pct(svSzSatz, 2)} von ${h.eur(wrBasis)}. Wird die Weihnachtsremuneration vor dem Urlaubszuschuss bezahlt, kehrt sich das Bild um. Mehr zur Reihenfolge im Ratgeber zu den ${h.a('sonderzahlungen', 'Sonderzahlungen')}.</p>
<h2>${h.num((1 - s40) * 100)} Cent je Euro, bis etwa ${h.eur(ab48)}</h2>
<p>Zwischen ${h.eur(HBG)} und der 48-Prozent-Stufe liegt ein schmaler Bereich, in dem ein zusätzlicher Euro nur Lohnsteuer kostet: ${h.pct(s40)} nach ${h.src('estg33', '§ 33 Abs. 1 EStG')}. Darunter kamen noch ${h.pct(svLaufend(HBG).satz, 2)} Sozialversicherung dazu, darüber steigt der Steuersatz auf ${h.pct(s48)}.</p>
${h.table(['Monatsbrutto', 'Grenzsteuersatz', 'Abzug vom nächsten Euro', 'Netto im Monat'], reihe.map((r) => [h.eur(r.b), h.pct(r.g), h.pct(r.gesamt, 1), h.eur(r.n, 2)]), 'Laufender Bezug, Abzug = Sozialversicherung (unter der Grenze) plus Lohnsteuer', ['r', 'r', 'r', 'r'])}
<h2>Was vom Jahresbrutto bleibt</h2>
<p>Über das ganze Jahr verdienen Sie ${h.eur(k.bruttoJahr)} brutto. Davon gehen ${h.eur(k.svJahr, 2)} an die Sozialversicherung, das sind ${h.pct(svJahrQuote, 2)} statt der vollen ${h.pct(sv.satz, 2)}, und ${h.eur(k.lstJahr, 2)} an Lohnsteuer. Netto bleiben ${h.eur(k.nettoJahr)}, also ${h.pct(k.nettoJahr / k.bruttoJahr, 1)} des Bruttos. Der Abstand zum vollen Beitragssatz setzt sich aus zwei kleinen Posten zusammen: ${h.eur(ersparnisJahr, 2)} aus den zwölf Monatsgehältern und ${h.eur(ersparnisSz, 2)} aus der Weihnachtsremuneration. Richtig spürbar wird der Deckel erst einige hundert Euro höher.</p>
<p>Auch die Sozialversicherungsbeiträge des Dienstgebers enden an dieser Grenze, Dienstgeberbeitrag, Kommunalsteuer und Mitarbeitervorsorge dagegen fallen auf das volle Gehalt an. Was es den Betrieb insgesamt kostet, zeigt der ${h.a('dienstgeberkosten', 'Dienstgeberkosten-Rechner')}. Die Grenze im Detail erklärt der Ratgeber zur ${h.a('hoechstbeitragsgrundlage', 'Höchstbeitragsgrundlage')}.</p>
<p>Ihr eigener Fall im ${h.a('home', 'Brutto-Netto-Rechner')}. Darunter: ${h.a('netto-6000', '6.000 Euro brutto')} mit voller Sozialversicherung; darüber: ${h.a('netto-10000', '10.000 Euro brutto')} in der 48-Prozent-Stufe.</p>
`,
  },
  en: {
    slug: '7000-euro-gross-to-net',
    nav: '€7,000 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: social insurance capped, you keep ${EN.num((1 - s40) * 100)} cents of each euro above the cap.`,
    title: '7000 Euro Gross to Net in Austria 2026: Above the Ceiling',
    description: `7000 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month, social insurance capped at ${EN.eur(HBG)}, and the 48% tax band starting at about ${EN.eur(ab48)} gross a month.`,
    h1: '7,000 euros gross: net pay with capped social insurance',
    intro: 'What the contribution ceiling saves you at this salary, on the monthly pay and on the Christmas payment, and how close the next tax band is.',
    resume: `On ${EN.eur(B)} gross a month you take home ${EN.eur(k.nettoMonat, 2)} in Austria in 2026. Social insurance is ${EN.eur(sv.summe, 2)} and goes no higher, because contributions are charged only up to the ceiling (Höchstbeitragsgrundlage) of ${EN.eur(HBG)}; the ${EN.eur(ueber)} above it are contribution-free. Without the cap you would pay ${EN.eur(ohneDeckel, 2)}. Your special payments have their own annual limit of ${EN.eur(HBG_SZ)}. Holiday pay and Christmas pay add up to ${EN.eur(2 * B)}, so ${EN.eur(wrFrei)} of the November payment are free of contributions. It still nets only ${EN.eur(wrNetto, 2)}, less than holiday pay at ${EN.eur(uzNetto, 2)}, because the tax allowance was used up in June. Each euro above ${EN.eur(HBG)} now loses only ${EN.pct(s40)} wage tax, so you keep ${EN.num((1 - s40) * 100)} cents instead of roughly ${EN.num((1 - grenzUnter) * 100)}. That window is narrow. The calculator puts the start of the 48 percent band at about ${EN.eur(ab48)} gross, since your projected taxable base of ${EN.eur(lst.bemessungJahr)} is only ${EN.eur(P.tarif.grenzen[3] - lst.bemessungJahr)} below ${EN.eur(P.tarif.grenzen[3])}. Annual net pay is ${EN.eur(k.nettoJahr)}.`,
    faqs: [
      { q: 'How much does the contribution ceiling save on 7,000 euros gross?', a: `On the monthly salary, ${EN.eur(ersparnis, 2)} a month or ${EN.eur(ersparnisJahr, 2)} a year, since only ${EN.eur(ueber)} sit above the ${EN.eur(HBG)} ceiling. The special-payment ceiling of ${EN.eur(HBG_SZ)} a year adds to that. Only ${EN.eur(wrBasis)} of your Christmas pay is insured, so it carries ${EN.eur(k.wr.svSz, 2)} of social insurance against ${EN.eur(k.uz.svSz, 2)} on holiday pay. Over the year you pay ${EN.pct(svJahrQuote, 2)} of gross in contributions instead of ${EN.pct(sv.satz, 2)}.` },
      { q: 'How much of a 100 euro raise do you keep on 7,000 euros gross?', a: `About ${EN.eur(100 * (1 - s40))}, as long as the new salary stays below roughly ${EN.eur(ab48)}. Above the contribution ceiling no social insurance is due, only wage tax at your ${EN.pct(s40)} marginal rate. In the 48 percent band you keep ${EN.eur(100 * (1 - s48))}. Because holiday and Christmas pay rise too and are taxed at ${EN.pct(P.sonderzahlungen.stufen[1][1])}, the annual gain is a little more than twelve times the monthly one.` },
      { q: 'Why does Christmas pay on 7,000 euros gross carry less social insurance but more tax?', a: `Social insurance on special payments stops at ${EN.eur(HBG_SZ)} per calendar year. Holiday pay in June is fully insured; of the November Christmas payment only ${EN.eur(wrBasis)} is, which saves ${EN.eur(ersparnisSz, 2)}. At the same time the ${EN.eur(P.sonderzahlungen.freibetrag)} tax allowance was used up in June, so wage tax rises to ${EN.eur(k.wr.lstSzFest, 2)}. The net result is ${EN.eur(wrNetto, 2)} in November against ${EN.eur(uzNetto, 2)} in June.` },
    ],
    body: (h) => `
<h2>Payslip at ${h.eur(B)}: two ceilings at work</h2>
${h.table(['Item', 'Monthly salary', 'Holiday pay', 'Christmas pay'], [
  ['Gross', h.eur(B, 2), h.eur(k.uz.sz, 2), h.eur(k.wr.sz, 2)],
  ['Insured amount', h.eur(HBG, 2), h.eur(k.uz.sz, 2), h.eur(wrBasis, 2)],
  ['Social insurance', h.eur(sv.summe, 2), h.eur(k.uz.svSz, 2), h.eur(k.wr.svSz, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.eur(k.uz.lstSzFest, 2), h.eur(k.wr.lstSzFest, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.eur(uzNetto, 2), h.eur(wrNetto, 2)],
], 'Outside Vienna, no children; holiday pay in June, Christmas pay in November', ['l', 'r', 'r', 'r'])}
<h2>Social insurance stops at ${h.eur(HBG)}</h2>
<p>The 2026 contribution ceiling is ${h.eur(HBG)} a month (${h.src('oegkWerte', 'ÖGK health insurer')}). At ${h.eur(B)}, ${h.eur(ueber)} are free of contributions and the deduction stays at ${h.eur(sv.summe, 2)}. The saving is small here, ${h.eur(ersparnis, 2)} a month, but it grows with every euro: at ${h.eur(8000)} gross the cap already saves ${h.eur(8000 * sv.satz - sv.summe, 2)}. The mini calculator above shows the saving for any salary.</p>
<h2>Christmas pay: only ${h.eur(wrBasis)} insured</h2>
<p>Special payments have an annual ceiling of ${h.eur(HBG_SZ)} (${h.src('wkoBeitraege', 'Chamber of Commerce')}). Holiday pay uses ${h.eur(k.uz.sz)} of it, leaving ${h.eur(wrBasis)} for Christmas pay. The remaining ${h.eur(wrFrei)} are contribution-free, and the deduction is ${h.pct(svSzSatz, 2)} of ${h.eur(wrBasis)}. If your employer pays Christmas pay first, the picture reverses. The ${h.a('sonderzahlungen', 'special payments')} guide covers the order of payments.</p>
<h2>${h.num((1 - s40) * 100)} cents per euro, up to about ${h.eur(ab48)}</h2>
<p>Between ${h.eur(HBG)} and the 48 percent band lies a narrow range where an extra euro costs only wage tax: ${h.pct(s40)} under ${h.src('estg33', 'section 33(1) Income Tax Act')}. Below it, ${h.pct(svLaufend(HBG).satz, 2)} of social insurance came on top; above it, the tax rate rises to ${h.pct(s48)}.</p>
${h.table(['Monthly gross', 'Marginal tax rate', 'Deduction on next euro', 'Net per month'], reihe.map((r) => [h.eur(r.b), h.pct(r.g), h.pct(r.gesamt, 1), h.eur(r.n, 2)]), 'Regular pay; deduction = social insurance (below the ceiling) plus wage tax', ['r', 'r', 'r', 'r'])}
<h2>What is left of the annual gross</h2>
<p>Over the year you earn ${h.eur(k.bruttoJahr)} gross. Social insurance takes ${h.eur(k.svJahr, 2)}, or ${h.pct(svJahrQuote, 2)} rather than the full ${h.pct(sv.satz, 2)}, and wage tax ${h.eur(k.lstJahr, 2)}. You keep ${h.eur(k.nettoJahr)}, ${h.pct(k.nettoJahr / k.bruttoJahr, 1)} of gross. The gap to the full contribution rate is made of two small items: ${h.eur(ersparnisJahr, 2)} from twelve monthly salaries and ${h.eur(ersparnisSz, 2)} from the Christmas payment. The cap only starts to matter a few hundred euros higher.</p>
<p>Your employer's social insurance contributions stop at the same ceiling, while payroll taxes such as the family fund contribution, municipal tax and severance fund contribution still apply to the full salary. The ${h.a('dienstgeberkosten', 'employer cost calculator')} shows the full cost of your salary. The ${h.a('hoechstbeitragsgrundlage', 'contribution ceiling guide')} explains the rules in depth.</p>
<p>Your own case in the ${h.a('home', 'gross-to-net calculator')}. Below: ${h.a('netto-6000', '6,000 euros gross')} with full social insurance; above: ${h.a('netto-10000', '10,000 euros gross')} in the 48 percent band.</p>
`,
  },
});
