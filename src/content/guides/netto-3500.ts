import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const B = 3500;
const k = kurz(B);
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const G40 = P.tarif.grenzen[2], s30 = P.tarif.saetze[2], s40 = P.tarif.saetze[3];
/** Erstes volles Monatsbrutto mit 40 % Grenzsteuersatz (Motor). */
let ab40 = B;
while (lohnsteuerLaufend(ab40 - svLaufend(ab40).summe).grenzsteuersatz < s40) ab40++;
const luftJahr = G40 - lst.bemessungJahr, luftMonat = ab40 - 1 - B;
/** Netto von 100 € brutto mehr, in der 30- und in der 40-%-Stufe. */
const je100_30 = 100 * (1 - sv.satz) * (1 - s30), je100_40 = 100 * (1 - sv.satz) * (1 - s40);
/** Beispiel: Erhöhung um 3 % (Ist-Lohn-Erhöhung) und Stufen der Tabelle. */
const e3 = kurz(B * 1.03);
const stufen = [B, B + 100, ab40 - 1, ab40, ab40 + 100, 4000].map((b) => ({ b, r: kurz(b), g: lohnsteuerLaufend(b - svLaufend(b).summe).grenzsteuersatz }));
const uzNetto = k.uz.sz - k.uz.svSz - k.uz.lstSzFest, wrNetto = k.wr.sz - k.wr.svSz - k.wr.lstSzFest;

export default defineGuide({
  id: 'netto-3500',
  group: 'betrag',
  order: 50,
  mini: 'gehaltserhoehung',
  miniDefaults: { b: B, p: 3 },
  related: ['netto-3000', 'netto-4000', 'gehaltserhoehung', 'lohnsteuer', 'arbeitnehmerveranlagung'],
  sources: ['estg33', 'estg67', 'bmfVeranlagung', 'bmfRechner'],
  de: {
    slug: '3500-euro-brutto-netto',
    nav: '3.500 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: die letzte Stufe vor 40 % Lohnsteuer, noch ${DE.eur(luftMonat)} Spielraum.`,
    title: '3500 Euro brutto in netto 2026: Abstand zur 40-%-Stufe',
    description: `3500 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat, ${DE.eur(k.nettoJahr)} im Jahr, und wie viel Gehaltserhöhung noch mit 30 % statt mit 40 % besteuert wird.`,
    h1: '3.500 Euro brutto: Netto und Spielraum bis 40 Prozent',
    intro: 'Wie viel bei diesem Gehalt netto bleibt und wie weit eine Erhöhung noch im 30-Prozent-Bereich liegt.',
    resume: `Ein Gehalt von ${DE.eur(B)} brutto ergibt 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat, nach ${DE.eur(sv.summe, 2)} Sozialversicherung und ${DE.eur(lst.lst, 2)} Lohnsteuer. Aufs Jahr hochgerechnet beträgt die Bemessungsgrundlage ${DE.eur(lst.bemessungJahr)}. Sie liegt in der 30-Prozent-Stufe, die bei ${DE.eur(G40)} endet; bis dorthin fehlen ${DE.eur(luftJahr)} im Jahr. Laut Rechner beginnt die 40-Prozent-Stufe ab etwa ${DE.eur(ab40)} brutto im Monat, eine Erhöhung um bis zu ${DE.eur(luftMonat)} wird also noch vollständig mit 30 Prozent besteuert. Von ${DE.eur(100)} brutto mehr bleiben in diesem Bereich rund ${DE.eur(je100_30, 2)} netto, jenseits der Grenze nur ${DE.eur(je100_40, 2)}. Wer die Grenze überschreitet, verliert trotzdem nie Geld: Der höhere Satz gilt nur für den Teil darüber. Urlaubszuschuss und Weihnachtsremuneration werden unabhängig davon mit festen Sätzen besteuert und bringen ${DE.eur(uzNetto, 2)} und ${DE.eur(wrNetto, 2)} netto. Das Jahresnetto beträgt ${DE.eur(k.nettoJahr)} bei ${DE.eur(k.bruttoJahr)} brutto, die Abzüge machen ${DE.pct((k.svJahr + k.lstJahr) / k.bruttoJahr, 1)} aus.`,
    faqs: [
      { q: 'Wie viel Erhöhung verträgt ein Gehalt von 3.500 Euro, bevor 40 Prozent Steuer anfallen?', a: `Bis etwa ${DE.eur(ab40 - 1)} brutto im Monat, also rund ${DE.eur(luftMonat)} mehr. Ab dann übersteigt die hochgerechnete Bemessungsgrundlage ${DE.eur(G40)} im Jahr und jeder weitere Euro wird mit 40 Prozent besteuert (§ 33 Abs. 1 EStG). Überstunden im selben Monat schieben das Gehalt näher an die Grenze; der Rechner zeigt den Grenzsteuersatz für jeden Betrag.` },
      { q: 'Was bleibt bei 3.500 Euro brutto von einer Erhöhung um 3 Prozent?', a: `Drei Prozent sind ${DE.eur(B * 0.03)} brutto im Monat. Netto steigt das Gehalt von ${DE.eur(k.nettoMonat, 2)} auf ${DE.eur(e3.nettoMonat, 2)}, also um ${DE.eur(e3.nettoMonat - k.nettoMonat, 2)}, im Jahr mit beiden Sonderzahlungen um ${DE.eur(e3.nettoJahr - k.nettoJahr)}. Die neue Summe liegt noch unter der 40-Prozent-Stufe. Bei Sonderzahlungen kommt mehr an, weil dort nur ${DE.pct(P.sonderzahlungen.stufen[1][1])} Lohnsteuer anfallen.` },
      { q: 'Lohnt sich die Arbeitnehmerveranlagung bei 3.500 Euro brutto?', a: `Meist ja, wenn Sie Ausgaben haben, die die Lohnverrechnung nicht kennt. Werbungskosten über dem Pauschale von ${DE.eur(P.tarif.werbungskostenpauschale)}, etwa Fortbildung oder Arbeitsmittel, senken die Steuer bei diesem Gehalt um 30 Cent je Euro. Wer ${DE.eur(500)} Kurskosten selbst bezahlt, bekommt rund ${DE.eur((500 - P.tarif.werbungskostenpauschale) * s30)} zurück. Den Antrag können Sie bis zum Ende des fünften Jahres nach dem Steuerjahr stellen (BMF).` },
    ],
    body: (h) => `
<h2>Lohnzettel bei ${h.eur(B)} brutto</h2>
${h.table(['Position', 'Monat', 'Jahr mit 14 Bezügen'], [
  ['Bruttobezug', h.eur(B, 2), h.eur(k.bruttoJahr)],
  ['Sozialversicherung', h.eur(sv.summe, 2), h.eur(k.svJahr, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.eur(k.lstJahr, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
], 'Außerhalb Wiens, ohne Kinder und Pendlerpauschale; Jahr inklusive Urlaubszuschuss und Weihnachtsremuneration', ['l', 'r', 'r'])}
<h2>Noch ${h.eur(luftJahr)} bis zur 40-Prozent-Stufe</h2>
<p>Die Lohnverrechnung rechnet jedes Monatsgehalt auf ein Jahr hoch: (${h.eur(B)} minus ${h.eur(sv.summe, 2)} Sozialversicherung) mal zwölf, minus ${h.eur(h.P.tarif.werbungskostenpauschale)} Werbungskostenpauschale, ergibt ${h.eur(lst.bemessungJahr)}. Der Tarif (${h.src('estg33', '§ 33 Abs. 1 EStG')}) besteuert davon den Teil zwischen ${h.eur(h.P.tarif.grenzen[1])} und ${h.eur(G40)} mit 30 Prozent. Erst was ${h.eur(G40)} übersteigt, fällt in die 40-Prozent-Stufe. Umgerechnet auf das Monatsbrutto liegt diese Schwelle bei etwa ${h.eur(ab40)}.</p>
${h.table(['Monatsbrutto', 'Grenzsteuersatz', 'Netto im Monat', 'Netto im Jahr'], stufen.map(({ b, r, g }) => [h.eur(b), h.pct(g), h.eur(r.nettoMonat, 2), h.eur(r.nettoJahr, 2)]), 'Grenzsteuersatz = Steuer auf den nächsten Euro des laufenden Bezugs', ['r', 'r', 'r', 'r'])}
<h2>Was eine Erhöhung von hier aus bringt</h2>
<p>Bis zur Schwelle kostet jeder zusätzliche Euro ${h.pct(sv.satz, 2)} Sozialversicherung und vom Rest 30 Prozent Lohnsteuer. Von ${h.eur(100)} mehr bleiben ${h.eur(je100_30, 2)}. Darüber sind es ${h.eur(je100_40, 2)}, weil sich nur der Steuersatz ändert, nicht der Beitrag. Eine kollektivvertragliche Erhöhung von drei Prozent (${h.eur(B * 0.03)}) bleibt noch ganz im 30-Prozent-Bereich und bringt ${h.eur(e3.nettoMonat - k.nettoMonat, 2)} netto im Monat. Der Mini-Rechner oben rechnet jeden Prozentsatz durch; Hintergründe im Ratgeber zur ${h.a('gehaltserhoehung', 'Gehaltserhöhung')}.</p>
<p>Die Sonderzahlungen spielen dabei nicht mit. Urlaubszuschuss und Weihnachtsremuneration werden innerhalb des Jahressechstels mit ${h.pct(h.P.sonderzahlungen.stufen[1][1])} besteuert (${h.src('estg67', '§ 67 EStG')}), egal in welcher Tarifstufe das laufende Gehalt liegt. Eine Erhöhung zählt dort mit dem gleichen niedrigen Satz, solange die Summe der Sonderzahlungen unter ${h.eur(h.P.sonderzahlungen.stufen[0][0] + h.P.sonderzahlungen.stufen[1][0])} bleibt.</p>
<h2>Die Steuer, die Sie selbst noch senken können</h2>
<p>Bei einem Grenzsteuersatz von 30 Prozent ist jeder Euro an Werbungskosten über dem Pauschale 30 Cent wert. Das betrifft Fortbildung, Fachliteratur, Arbeitsmittel oder Fahrtkosten, die über das Pendlerpauschale hinausgehen. Erstattet wird das nicht im Monat, sondern mit der ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} (${h.src('bmfVeranlagung', 'BMF')}). Kommt das Gehalt später über die Schwelle, steigt dieser Wert auf 40 Cent. Umgekehrt lohnt es sich, eine größere Ausgabe in ein Jahr zu legen, in dem das Einkommen ohnehin hoch ist.</p>
<p>Den eigenen Fall rechnen Sie im ${h.a('home', 'Brutto-Netto-Rechner')}. Die Nachbarseiten: ${h.a('netto-3000', '3.000 Euro brutto')} mit dem vollen Beitrag zur Arbeitslosenversicherung, ${h.a('netto-4000', '4.000 Euro brutto')} schon in der 40-Prozent-Stufe.</p>
`,
  },
  en: {
    slug: '3500-euro-gross-to-net',
    nav: '€3,500 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: the last step before 40% tax, with ${EN.eur(luftMonat)} of headroom.`,
    title: '3500 Euro Gross to Net in Austria 2026: Room Before 40%',
    description: `3500 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month, ${EN.eur(k.nettoJahr)} a year, and how much of a pay rise is still taxed at 30 percent rather than 40 percent.`,
    h1: '3,500 euros gross: net pay and headroom below 40%',
    intro: 'What you take home at this salary and how far a raise can go before the next tax band starts.',
    resume: `On ${EN.eur(B)} gross a month you take home ${EN.eur(k.nettoMonat, 2)} in Austria in 2026, after ${EN.eur(sv.summe, 2)} of social insurance and ${EN.eur(lst.lst, 2)} of wage tax. Payroll projects each month to a full year, which here gives a taxable base of ${EN.eur(lst.bemessungJahr)}. That is inside the 30 percent band, which runs to ${EN.eur(G40)}, leaving ${EN.eur(luftJahr)} a year of headroom. The calculator places the start of the 40 percent band at about ${EN.eur(ab40)} gross a month, so a raise of up to ${EN.eur(luftMonat)} is still taxed entirely at 30 percent. In that range ${EN.eur(100)} more gross leaves about ${EN.eur(je100_30, 2)} net; beyond it, ${EN.eur(je100_40, 2)}. Crossing the line never cuts your pay, because the higher rate only applies to the slice above it. The 13th and 14th salary are taxed separately at fixed rates and bring ${EN.eur(uzNetto, 2)} and ${EN.eur(wrNetto, 2)} net. The year totals ${EN.eur(k.nettoJahr)} net from ${EN.eur(k.bruttoJahr)} gross, with deductions of ${EN.pct((k.svJahr + k.lstJahr) / k.bruttoJahr, 1)}.`,
    faqs: [
      { q: 'How big a raise can a 3,500 euro salary take before 40 percent tax?', a: `Up to about ${EN.eur(ab40 - 1)} gross a month, roughly ${EN.eur(luftMonat)} more. Beyond that, your projected annual taxable income passes ${EN.eur(G40)} and each further euro is taxed at 40 percent (section 33(1) Income Tax Act). Overtime in the same month pushes the salary closer to the line, and the calculator shows the marginal rate for any amount you enter.` },
      { q: 'What does a 3 percent raise on 3,500 euros gross leave you?', a: `Three percent is ${EN.eur(B * 0.03)} gross a month. Net pay rises from ${EN.eur(k.nettoMonat, 2)} to ${EN.eur(e3.nettoMonat, 2)}, up ${EN.eur(e3.nettoMonat - k.nettoMonat, 2)}, or ${EN.eur(e3.nettoJahr - k.nettoJahr)} a year including both special payments. The new salary is still below the 40 percent band. More of the raise survives on the 13th and 14th salary, where wage tax is only ${EN.pct(P.sonderzahlungen.stufen[1][1])}.` },
      { q: 'Is filing a tax return worth it on 3,500 euros gross?', a: `Usually, if you paid work-related costs yourself. Expenses above the ${EN.eur(P.tarif.werbungskostenpauschale)} flat allowance, such as training or equipment, cut your tax by 30 cents per euro at this salary. A ${EN.eur(500)} course you paid for returns about ${EN.eur((500 - P.tarif.werbungskostenpauschale) * s30)}. The Arbeitnehmerveranlagung, the employee tax return, can be filed until the end of the fifth year after the tax year, according to the Finance Ministry.` },
    ],
    body: (h) => `
<h2>Payslip at ${h.eur(B)} gross</h2>
${h.table(['Item', 'Month', 'Year with 14 salaries'], [
  ['Gross pay', h.eur(B, 2), h.eur(k.bruttoJahr)],
  ['Social insurance', h.eur(sv.summe, 2), h.eur(k.svJahr, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.eur(k.lstJahr, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
], 'Outside Vienna, no children, no commuter allowance; year includes holiday and Christmas pay', ['l', 'r', 'r'])}
<h2>${h.eur(luftJahr)} left before the 40 percent band</h2>
<p>Austrian payroll treats every monthly salary as if it were paid all year: (${h.eur(B)} minus ${h.eur(sv.summe, 2)} social insurance) times twelve, less the ${h.eur(h.P.tarif.werbungskostenpauschale)} flat work-expense allowance, gives ${h.eur(lst.bemessungJahr)}. The scale (${h.src('estg33', 'section 33(1) Income Tax Act')}) taxes the slice between ${h.eur(h.P.tarif.grenzen[1])} and ${h.eur(G40)} at 30 percent. Only income above ${h.eur(G40)} reaches 40 percent, which in monthly gross terms means about ${h.eur(ab40)}.</p>
${h.table(['Monthly gross', 'Marginal tax rate', 'Net per month', 'Net per year'], stufen.map(({ b, r, g }) => [h.eur(b), h.pct(g), h.eur(r.nettoMonat, 2), h.eur(r.nettoJahr, 2)]), 'Marginal rate = tax on the next euro of regular pay', ['r', 'r', 'r', 'r'])}
<h2>What a raise from here is worth</h2>
<p>Up to the line, each extra euro costs ${h.pct(sv.satz, 2)} social insurance and 30 percent tax on what remains, so ${h.eur(100)} more gross means ${h.eur(je100_30, 2)} net. Past it you keep ${h.eur(je100_40, 2)}; the contribution rate does not change, only the tax. A three percent collective-agreement increase (${h.eur(B * 0.03)}) stays fully in the 30 percent band and adds ${h.eur(e3.nettoMonat - k.nettoMonat, 2)} a month. Use the mini calculator above for any percentage, or read the ${h.a('gehaltserhoehung', 'pay rise guide')}.</p>
<p>Special payments (Sonderzahlungen) follow their own rules. Within the annual sixth, holiday and Christmas pay are taxed at ${h.pct(h.P.sonderzahlungen.stufen[1][1])} (${h.src('estg67', 'section 67')}) whatever band your regular salary is in, as long as their total stays below ${h.eur(h.P.sonderzahlungen.stufen[0][0] + h.P.sonderzahlungen.stufen[1][0])}.</p>
<h2>Tax you can still bring down yourself</h2>
<p>With a 30 percent marginal rate, every euro of work expenses above the flat allowance is worth 30 cents back: training, professional books, work equipment or travel costs not covered by the commuter allowance. Nothing changes on the monthly payslip; the refund comes with the ${h.a('arbeitnehmerveranlagung', 'employee tax return')} (${h.src('bmfVeranlagung', 'Finance Ministry')}). Once your pay moves past the line, the same expenses return 40 cents per euro.</p>
<p>Check your own figures in the ${h.a('home', 'gross-to-net calculator')}. Neighbouring amounts: ${h.a('netto-3000', '3,000 euros gross')} with the full unemployment contribution, and ${h.a('netto-4000', '4,000 euros gross')}, already in the 40 percent band.</p>
`,
  },
});
