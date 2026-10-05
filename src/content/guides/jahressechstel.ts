import { defineGuide } from '../../lib/guide-types';
import { rechneJahr } from '../../lib/engine/jahr';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: Erhöhung von 3.000 auf 3.300 € ab Juli; Teilzeit ab Juli (4.000 → 2.000 €). */
const erh = rechneJahr(Array.from({ length: 12 }, (_, i) => ({ laufend: i < 6 ? 3000 : 3300, sz: i === 5 ? 3000 : i === 10 ? 3300 : 0 })));
const tz = rechneJahr(Array.from({ length: 12 }, (_, i) => ({ laufend: i < 6 ? 4000 : 2000, sz: i === 5 ? 4000 : i === 10 ? 4000 : 0 })));
const nov = erh.monate[10], tnov = tz.monate[10];
const S = P.sonderzahlungen;

export default defineGuide({
  id: 'jahressechstel',
  group: 'lohn',
  order: 30,
  mini: 'sechstel',
  miniHref: 'sonderzahlungen',
  related: ['sonderzahlungen', 'dreizehntes-gehalt', 'gehaltserhoehung', 'teilzeit', 'ueberstunden'],
  sources: ['estg67', 'estg124b', 'bmfRechner'],
  de: {
    slug: 'jahressechstel',
    nav: 'Jahressechstel',
    card: 'Wann Urlaubs- und Weihnachtsgeld nur 6 % kosten und wann der Tarif zuschlägt, mit Kontrollrechnung.',
    title: 'Jahressechstel 2026: Sechstelüberhang und Kontrollrechnung',
    description: 'Jahressechstel 2026: welcher Teil von Urlaubs- und Weihnachtsgeld 6 % kostet, wann der Überhang nach Tarif versteuert wird und was die Kontrollrechnung ändert.',
    h1: 'Das Jahressechstel: wann Sonderzahlungen begünstigt sind',
    intro: 'Die Grenze, an der Urlaubs- und Weihnachtsgeld vom Sondersteuersatz in den normalen Tarif kippen, und warum sie sich im Laufe des Jahres bewegt.',
    resume: `Das Jahressechstel ist die Obergrenze, bis zu der Urlaubszuschuss, Weihnachtsremuneration und Prämien mit den festen Sätzen des § 67 EStG besteuert werden: die ersten ${DE.eur(S.freibetrag)} im Jahr steuerfrei, danach ${DE.pct(S.stufen[1][1])} bis zu einer Summe von ${DE.eur(S.stufen[0][0] + S.stufen[1][0])}. Es beträgt ein Sechstel der bis zum Auszahlungsmonat bezahlten laufenden Bezüge, aufs Jahr hochgerechnet. Bei gleichbleibendem Gehalt sind das genau zwei Monatsgehälter, die beiden Sonderzahlungen passen hinein. Steigt das Gehalt im Sommer, hinkt das Sechstel hinterher: Bei einer Erhöhung von ${DE.eur(3000)} auf ${DE.eur(3300)} ab Juli liegen im November ${DE.eur(nov.szUeberSechstel, 2)} der Weihnachtsremuneration über dem Sechstel und kosten ${DE.eur(nov.lstSzTarif, 2)} Lohnsteuer nach dem Tarif. Im Dezember holt die Kontrollrechnung den Großteil davon zurück. Sinkt das Gehalt dagegen, etwa durch Teilzeit, kann es am Jahresende zur Nachversteuerung kommen. Ist das Sechstel nicht höher als ${DE.eur(S.freigrenze_sechstel)}, bleiben die Sonderzahlungen ganz steuerfrei.`,
    faqs: [
      { q: 'Wie berechnet die Lohnverrechnung das Sechstel im Juni?', a: `Sie zählt die laufenden Bezüge von Jänner bis Juni zusammen, den Juni eingeschlossen, teilt durch sechs Monate, rechnet auf zwölf Monate hoch und nimmt davon ein Sechstel. Bei ${DE.eur(3000)} im Monat ergibt das ${DE.eur(6000)}. Laufend bezahlte Überstunden samt Zuschlägen und Zulagen erhöhen das Sechstel; nach § 3 EStG steuerfreie laufende Bezüge zählen grundsätzlich nicht mit (§ 67 Abs. 2 EStG).` },
      { q: 'Was passiert mit einer Prämie, die nicht mehr ins Sechstel passt?', a: `Der Teil über dem Sechstel wird im Auszahlungsmonat wie ein laufender Bezug nach dem Lohnsteuertarif versteuert (§ 67 Abs. 10 EStG). Wer zwei volle Sonderzahlungen bekommt, hat das Sechstel damit meist ausgeschöpft: Eine Bilanzprämie im Dezember kostet dann den Grenzsteuersatz, bei mittleren Gehältern 30 oder 40 Prozent, statt ${DE.pct(S.stufen[1][1])}. Die Sozialversicherung bleibt die einer Sonderzahlung.` },
      { q: 'Bekomme ich die Mehrsteuer aus dem Sechstelüberhang zurück?', a: `Oft ja, schon im Dezember: Beim letzten Gehalt des Jahres ermittelt der Arbeitgeber das Kontrollsechstel aus allen tatsächlich bezahlten laufenden Bezügen. Ist es größer als das, was mit festen Sätzen versteuert wurde, wird der Überhang bis dorthin mit ${DE.pct(S.stufen[1][1])} neu versteuert (§ 77 Abs. 4a Z 2 EStG). Im Beispiel mit der Erhöhung ab Juli beträgt die Gutschrift ${DE.eur(-erh.kontrolle.mehrsteuer, 2)}.` },
      { q: 'Wann muss ich am Jahresende nachzahlen?', a: `Wenn mehr Sonderzahlungen mit festen Sätzen versteuert wurden, als ein Sechstel der im Jahr tatsächlich bezahlten laufenden Bezüge ausmacht. Typisch ist ein Wechsel in Teilzeit im Herbst bei Weihnachtsremuneration nach altem Gehalt: Im Beispiel mit ${DE.eur(4000)} bis Juni und ${DE.eur(2000)} ab Juli werden ${DE.eur(tz.kontrolle.ueberhang, 2)} nachversteuert, Mehrsteuer ${DE.eur(tz.kontrolle.mehrsteuer, 2)}. Bei Austritt, Elternkarenz, Krankengeld und weiteren gesetzlichen Fällen entfällt das.` },
      { q: 'Gilt das Sechstel für jede Firma getrennt?', a: 'Ja. Das Jahressechstel berechnet jeder Arbeitgeber nur aus den Bezügen, die er selbst bezahlt. Wer im Laufe des Jahres den Job wechselt, hat bei jedem Arbeitgeber ein eigenes Sechstel und einen eigenen Freibetrag. In der Arbeitnehmerveranlagung werden die Sonderzahlungen beider Arbeitgeber zusammengeführt, und dabei kann ein Teil des doppelt gewährten Freibetrags wieder verloren gehen.' },
    ],
    body: (h) => `
<h2>Die Regel in einem Satz</h2>
<p>Sonderzahlungen werden nur insoweit mit den festen Sätzen des ${h.src('estg67', '§ 67 Abs. 1 EStG')} besteuert, als sie ein Sechstel der laufenden Bezüge nicht überschreiten. Das Gesetz spricht vom Jahressechstel; die Lohnverrechnung prüft es bei jeder einzelnen Auszahlung neu, und am Jahresende noch einmal mit allen tatsächlich bezahlten Gehältern.</p>
<h2>Wie das Sechstel bei jeder Auszahlung entsteht</h2>
<p>Maßgeblich sind die laufenden Bezüge, die bis zum Auszahlungsmonat bereits geflossen sind, den laufenden Bezug dieses Monats eingeschlossen. Sie werden auf ein Kalenderjahr umgerechnet: Summe geteilt durch die Zahl der Monate, mal zwölf. Ein Sechstel davon ist das Jahressechstel. Davon abgezogen wird, was im selben Jahr schon an Sonderzahlungen mit festen Sätzen versteuert wurde; der Rest ist der Spielraum für die nächste Zahlung.</p>
${h.table(['Zahlung', 'Sechstel zu diesem Zeitpunkt', 'bereits verbraucht', 'Spielraum'], [
  ['Urlaubszuschuss Juni', h.eur(erh.monate[5].sechstel, 2), h.eur(0), h.eur(erh.monate[5].sechstel, 2)],
  ['Weihnachtsremuneration November', h.eur(nov.sechstel, 2), h.eur(erh.monate[5].szImSechstel, 2), h.eur(nov.szImSechstel, 2)],
], `Beispiel: ${h.eur(3000)} bis Juni, ${h.eur(3300)} ab Juli, Sonderzahlungen jeweils in Höhe des aktuellen Gehalts`, ['l', 'r', 'r', 'r'])}
<p>Im Beispiel passt der Urlaubszuschuss genau, von der Weihnachtsremuneration aber nur ${h.eur(nov.szImSechstel, 2)}. Die übrigen ${h.eur(nov.szUeberSechstel, 2)} landen im Novembergehalt und werden dort mit dem Grenzsteuersatz besteuert: ${h.eur(nov.lstSzTarif, 2)} Lohnsteuer statt rund ${h.eur(nov.szUeberSechstel * (1 - nov.svSz / nov.sz) * h.P.sonderzahlungen.stufen[1][1], 2)} mit dem festen Satz.</p>
<h2>Die Kontrollrechnung im Dezember</h2>
<p>Beim letzten laufenden Bezug des Jahres muss der Arbeitgeber ein Kontrollsechstel bilden: ein Sechstel aller im Jahr tatsächlich bezahlten laufenden Bezüge. Zwei Fälle sind möglich, beide stehen in ${h.src('estg67', '§ 77 Abs. 4a EStG')}, der in § 67 Abs. 2 ausdrücklich genannt wird.</p>
<h3>Zu viel begünstigt: Nachversteuerung</h3>
<p>Wurde mehr mit festen Sätzen versteuert, als das Kontrollsechstel erlaubt, wird der Überhang durch Aufrollen nach dem Tarif besteuert. Das trifft vor allem Menschen, deren laufendes Gehalt in der zweiten Jahreshälfte sinkt, etwa durch Teilzeit, während die Weihnachtsremuneration noch nach dem alten Gehalt bemessen ist. Im Beispiel mit ${h.eur(4000)} bis Juni und ${h.eur(2000)} ab Juli liegen ${h.eur(tz.kontrolle.ueberhang, 2)} über dem Kontrollsechstel; die Mehrsteuer beträgt ${h.eur(tz.kontrolle.mehrsteuer, 2)}.</p>
<p>Die Nachversteuerung entfällt, wenn im Kalenderjahr einer dieser Fälle vorliegt: Elternkarenz, Krankengeld, Rehabilitationsgeld, Pflegekarenz oder Pflegeteilzeit, Familienhospizkarenz, Wiedereingliederungsteilzeit, Präsenz- oder Zivildienst, Altersteilzeitgeld, Teilpension, oder das Dienstverhältnis endet und im selben Jahr beginnt kein neues beim selben Arbeitgeber oder im Konzern.</p>
<h3>Zu wenig begünstigt: Gutschrift</h3>
<p>Wurde weniger mit festen Sätzen versteuert, als das Kontrollsechstel erlaubt, und lag eine Sonderzahlung zuvor über dem Sechstel, wird dieser Teil nachträglich mit den festen Sätzen versteuert. Genau das passiert nach einer Gehaltserhöhung im Sommer: Das Kontrollsechstel enthält alle zwölf Gehälter und ist daher größer als das Novembersechstel. Im Beispiel kommen ${h.eur(-erh.kontrolle.mehrsteuer, 2)} im Dezember zurück.</p>
<!--mini:sechstel-->
<h2>Was das Sechstel erhöht und was nicht</h2>
<ul>
<li><strong>Erhöht es:</strong> laufende Überstundenentlohnung samt Zuschlägen, Zulagen, Provisionen und Sachbezüge, die laufend bezahlt werden. Wer regelmäßig Überstunden macht, hat ein größeres Sechstel als sein Grundgehalt vermuten lässt.</li>
<li><strong>Erhöht es nicht:</strong> nach § 3 EStG steuerfreie laufende Bezüge, mit wenigen Ausnahmen; außerdem sonstige Bezüge, die nach dem Tarif versteuert werden.</li>
<li><strong>Verbraucht es nicht:</strong> steuerfreie sonstige Bezüge, etwa die Mitarbeiterprämie von bis zu ${h.eur(h.P.mitarbeiterpraemie_2026_max)} in der zweiten Jahreshälfte 2026 (${h.src('estg124b', '§ 124b EStG')}).</li>
</ul>
<h2>Freibetrag und Freigrenze</h2>
<p>Zwei Zahlen wirken neben dem Sechstel. Der Freibetrag von ${h.eur(h.P.sonderzahlungen.freibetrag)} gilt einmal im Jahr und wird von der ersten Sonderzahlung verbraucht, meist vom Urlaubszuschuss. Die Freigrenze von ${h.eur(h.P.sonderzahlungen.freigrenze_sechstel)} bezieht sich auf das Sechstel selbst: Ist es nicht höher, fällt auf die Sonderzahlungen gar keine Lohnsteuer an. Das betrifft Monatsgehälter bis ${h.eur(h.P.sonderzahlungen.freigrenze_sechstel / 2)}, also vor allem Teilzeit und geringe Vollzeitlöhne.</p>
<h2>Gehaltsplanung mit dem Sechstel</h2>
<p>Wer eine Erhöhung verhandelt, kann den Zeitpunkt mitbedenken: Eine Erhöhung ab Jänner verschiebt nichts, eine ab Herbst erzeugt zunächst einen Überhang, der im Dezember meist zurückkommt. Bei einem Jobwechsel zur Jahresmitte lohnt ein Blick auf die Endabrechnung, denn anteilige Sonderzahlungen werden oft gemeinsam mit dem letzten Gehalt ausbezahlt. Rechnen Sie Ihren eigenen Verlauf im ${h.a('sonderzahlungen', 'Urlaubsgeld- und Weihnachtsgeld-Rechner')} nach; dort lassen sich Erhöhung, Eintritt, Austritt, Prämie und Überstunden Monat für Monat eintragen. Was eine Erhöhung insgesamt netto bringt, zeigt die Seite zur ${h.a('gehaltserhoehung', 'Gehaltserhöhung')}; die Grundregeln zu Urlaubszuschuss und Weihnachtsremuneration stehen beim ${h.a('dreizehntes-gehalt', '13. und 14. Gehalt')}.</p>
`,
  },
  en: {
    slug: 'annual-sixth-rule',
    nav: 'Annual sixth (Jahressechstel)',
    card: 'When holiday and Christmas pay cost only 6% and when the normal scale applies, with the year-end check.',
    title: 'Jahressechstel 2026: The Annual Sixth Rule Explained',
    description: 'Jahressechstel 2026 explained: which part of Austrian holiday and Christmas pay is taxed at 6%, when the excess hits the scale, how the December check works.',
    h1: 'The annual sixth: when special payments get the low rate',
    intro: 'The line at which holiday and Christmas pay drop from the special rate into the normal scale, and why it moves during the year.',
    resume: `The annual sixth (Jahressechstel) is the ceiling up to which holiday pay, Christmas pay and bonuses are taxed at the fixed rates of section 67 of the Income Tax Act: the first ${EN.eur(S.freibetrag)} a year tax-free, then ${EN.pct(S.stufen[1][1])} up to a total of ${EN.eur(S.stufen[0][0] + S.stufen[1][0])}. It equals one sixth of the regular pay received up to the month of payment, scaled up to a full year. With a constant salary that is exactly two monthly salaries, so both special payments fit. If your salary rises in summer, the sixth lags behind: with a rise from ${EN.eur(3000)} to ${EN.eur(3300)} from July, ${EN.eur(nov.szUeberSechstel, 2)} of the November Christmas pay sit above the sixth and cost ${EN.eur(nov.lstSzTarif, 2)} of wage tax on the normal scale. The December control calculation gives most of that back. If your salary falls instead, for instance after moving to part-time, you may be taxed extra at year end. If the sixth does not exceed ${EN.eur(S.freigrenze_sechstel)}, special payments are entirely tax-free.`,
    faqs: [
      { q: 'How does payroll work out the sixth in June?', a: `It adds up regular pay from January to June, June included, divides by six months, scales up to twelve months and takes one sixth. At ${EN.eur(3000)} a month that gives ${EN.eur(6000)}. Regular overtime including its premiums and allowances raise the sixth; regular pay that is tax-free under section 3 generally does not count (section 67(2) of the Income Tax Act).` },
      { q: 'What happens to a bonus that no longer fits into the sixth?', a: `The part above the sixth is taxed in the month of payment like regular pay, on the normal wage tax scale (section 67(10)). If you already received two full special payments, the sixth is usually used up, so a year-end bonus in December costs your marginal rate, 30 or 40 percent on mid-range salaries, instead of ${EN.pct(S.stufen[1][1])}. Social insurance is still charged as on a special payment.` },
      { q: 'Do I get the extra tax on the excess back?', a: `Often yes, in December. With the last salary of the year your employer forms a control sixth from all regular pay actually paid. If it is larger than what was taxed at fixed rates, the excess is re-taxed at ${EN.pct(S.stufen[1][1])} up to that limit (section 77(4a)(2)). In the example with a raise from July, the December refund is ${EN.eur(-erh.kontrolle.mehrsteuer, 2)}.` },
      { q: 'When do I have to pay extra at year end?', a: `When more special payments were taxed at fixed rates than one sixth of the regular pay actually received in the year. A typical case is switching to part-time in autumn while Christmas pay follows the old salary: with ${EN.eur(4000)} until June and ${EN.eur(2000)} from July, ${EN.eur(tz.kontrolle.ueberhang, 2)} are re-taxed, costing ${EN.eur(tz.kontrolle.mehrsteuer, 2)}. Leaving the job, parental leave, sick pay and other statutory cases cancel this.` },
      { q: 'Does each employer apply its own sixth?', a: 'Yes. Each employer calculates the annual sixth only from the pay it pays itself. If you change jobs during the year, each employer has its own sixth and grants its own tax-free allowance. In the annual tax assessment the special payments from both employers are combined, and part of the doubled allowance can be lost again at that point.' },
    ],
    body: (h) => `
<h2>The rule in one sentence</h2>
<p>Special payments are taxed at the fixed rates of ${h.src('estg67', 'section 67(1) of the Income Tax Act')} only to the extent that they do not exceed one sixth of regular pay. The law calls it the annual sixth; payroll checks it again at every payment, and once more at year end against every salary actually paid.</p>
<h2>How the sixth is set at each payment</h2>
<p>What counts is the regular pay already received up to the payment month, including that month’s salary. It is converted to a calendar year: the total divided by the number of months, times twelve. One sixth of that is the annual sixth. Whatever was already taxed at fixed rates in the same year is subtracted; the rest is the room left for the next payment.</p>
${h.table(['Payment', 'Sixth at that point', 'already used', 'room left'], [
  ['Holiday pay, June', h.eur(erh.monate[5].sechstel, 2), h.eur(0), h.eur(erh.monate[5].sechstel, 2)],
  ['Christmas pay, November', h.eur(nov.sechstel, 2), h.eur(erh.monate[5].szImSechstel, 2), h.eur(nov.szImSechstel, 2)],
], `Example: ${h.eur(3000)} until June, ${h.eur(3300)} from July, each special payment equal to the current salary`, ['l', 'r', 'r', 'r'])}
<p>In the example the holiday pay fits exactly, but only ${h.eur(nov.szImSechstel, 2)} of the Christmas pay do. The remaining ${h.eur(nov.szUeberSechstel, 2)} are added to the November salary and taxed at the marginal rate: ${h.eur(nov.lstSzTarif, 2)} of wage tax instead of about ${h.eur(nov.szUeberSechstel * (1 - nov.svSz / nov.sz) * h.P.sonderzahlungen.stufen[1][1], 2)} at the fixed rate.</p>
<h2>The December control calculation</h2>
<p>With the last regular salary of the year, the employer must form a control sixth: one sixth of all regular pay actually received in the year. Two outcomes are possible, both set out in ${h.src('estg67', 'section 77(4a)')}, which section 67(2) refers to.</p>
<h3>Too much at the low rate: extra tax</h3>
<p>If more was taxed at fixed rates than the control sixth allows, the excess is re-taxed on the scale. This mainly hits people whose regular salary falls in the second half of the year, for example through part-time work, while Christmas pay still follows the old salary. In the example with ${h.eur(4000)} until June and ${h.eur(2000)} from July, ${h.eur(tz.kontrolle.ueberhang, 2)} sit above the control sixth and the extra tax is ${h.eur(tz.kontrolle.mehrsteuer, 2)}.</p>
<p>No extra tax applies if, during the calendar year, any of these occurred: parental leave, sick pay, rehabilitation pay, care leave or care part-time, family hospice leave, reintegration part-time, military or civilian service, partial retirement benefit, partial pension, or the employment ended without a new one with the same employer or group in that year.</p>
<h3>Too little at the low rate: refund</h3>
<p>If less was taxed at fixed rates than the control sixth allows and part of a special payment had earlier gone above the sixth, that part is re-taxed at the fixed rates. This is exactly what happens after a summer pay rise: the control sixth covers all twelve salaries and is larger than November’s sixth. In the example ${h.eur(-erh.kontrolle.mehrsteuer, 2)} come back in December.</p>
<!--mini:sechstel-->
<h2>What raises the sixth and what does not</h2>
<ul>
<li><strong>Raises it:</strong> overtime pay including premiums, allowances, commissions and benefits in kind paid on a regular basis. Regular overtime means a larger sixth than your base salary suggests.</li>
<li><strong>Does not raise it:</strong> regular pay that is tax-free under section 3, with a few exceptions; nor special payments that end up taxed on the scale.</li>
<li><strong>Does not use it up:</strong> tax-free special payments, such as the employee bonus (Mitarbeiterprämie) of up to ${h.eur(h.P.mitarbeiterpraemie_2026_max)} in the second half of 2026 (${h.src('estg124b', 'section 124b')}).</li>
</ul>
<h2>Allowance and exemption limit</h2>
<p>Two more figures work alongside the sixth. The ${h.eur(h.P.sonderzahlungen.freibetrag)} allowance applies once a year and is used up by the first special payment, usually holiday pay. The ${h.eur(h.P.sonderzahlungen.freigrenze_sechstel)} exemption limit refers to the sixth itself: if the sixth is no higher, no wage tax falls on the special payments at all. That covers monthly salaries up to ${h.eur(h.P.sonderzahlungen.freigrenze_sechstel / 2)}, mainly part-time and low full-time wages.</p>
<h2>Planning pay around the sixth</h2>
<p>When negotiating a raise, the timing matters: a raise from January changes nothing, one from autumn first creates an excess that usually returns in December. When changing jobs mid-year, look at the final settlement, because pro-rata special payments are often paid with the last salary. Run your own year through the ${h.a('sonderzahlungen', 'holiday and Christmas pay calculator')}, where raise, start, exit, bonus and overtime can be entered month by month. The ${h.a('gehaltserhoehung', 'pay rise page')} shows what a raise brings overall.</p>
`,
  },
});
