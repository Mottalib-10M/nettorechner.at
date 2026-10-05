import { defineGuide } from '../../lib/guide-types';
import { kbgEinkommensabhaengig } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const W = P.wochengeld, Z = P.kbg.wochengeld_sz_zuschlag, K = P.kbg;
const WOCHEN = W.schutzfrist_wochen_vor + W.schutzfrist_wochen_nach;
/** Beispiel: 2.100 € netto im Schnitt der letzten drei Monate, zwei Sonderzahlungen im Jahr (Motor). */
const NETTO = 2100;
const bsp = kbgEinkommensabhaengig(NETTO);
const bsp1 = kbgEinkommensabhaengig(NETTO, Z.ein_monatsbezug), bsp3 = kbgEinkommensabhaengig(NETTO, Z.mehr);
const NETTOS = [1400, 1800, 2100, 2600, 3200];
const zeilen = NETTOS.map((n) => ({ n, r: kbgEinkommensabhaengig(n) }));
const hoch = zeilen[zeilen.length - 1];

export default defineGuide({
  id: 'wochengeld',
  group: 'leistungen',
  order: 55,
  mini: 'wochengeld',
  miniHref: 'kinderbetreuungsgeld',
  related: ['kinderbetreuungsgeld', 'kbg-einkommensabhaengig', 'kbg-zuverdienst', 'alleinverdiener', 'kindermehrbetrag'],
  sources: ['ogvWochengeld', 'oegkWochengeld', 'kbgEa'],
  de: {
    slug: 'wochengeld',
    nav: 'Wochengeld',
    card: 'Was Angestellte im Mutterschutz bekommen: Netto der letzten drei Monate je Tag plus Zuschlag für Sonderzahlungen.',
    title: 'Wochengeld 2026: Höhe, Berechnung und Dauer im Mutterschutz',
    description: `Wochengeld 2026 für Angestellte: Netto der letzten ${W.bemessung_monate} Monate je Tag plus ${DE.pct(Z.zwei_monatsbezuege)} Zuschlag. Bei ${DE.eur(NETTO)} netto ${DE.eur(bsp.wochengeldTag, 2)} am Tag. Dauer, Antrag, Kinderbetreuungsgeld.`,
    h1: 'Wochengeld im Mutterschutz: so viel zahlt die Krankenkasse',
    intro: 'Wie die ÖGK das Wochengeld aus Ihrem Nettogehalt berechnet, wie lange es läuft und warum es später auch das einkommensabhängige Kinderbetreuungsgeld bestimmt.',
    resume: `Das Wochengeld ersetzt Angestellten während des Mutterschutzes das Einkommen. Es läuft ${W.schutzfrist_wochen_vor} Wochen vor dem voraussichtlichen Geburtstermin, am Tag der Entbindung und ${W.schutzfrist_wochen_nach} Wochen danach, bei Mehrlings-, Früh- oder Kaiserschnittgeburten ${W.schutzfrist_wochen_nach_besonders} Wochen danach. Bemessen wird es am durchschnittlichen Nettoverdienst der letzten ${W.bemessung_monate} vollen Kalendermonate vor Beginn des Mutterschutzes, umgerechnet auf den Tag; Urlaubs- und Weihnachtsgeld bleiben dabei außen vor und werden durch einen pauschalen Zuschlag ersetzt: ${DE.pct(Z.ein_monatsbezug)} bei Sonderzahlungen bis zu einem Monatsbezug, ${DE.pct(Z.zwei_monatsbezuege)} bis zu zwei und ${DE.pct(Z.mehr)} darüber. Wer im Schnitt ${DE.eur(NETTO)} netto im Monat verdient hat und 14 Gehälter bekommt, erhält rund ${DE.eur(bsp.wochengeldTag, 2)} am Tag, etwa ${DE.eur(bsp.wochengeldTag * 30)} für 30 Tage. Das Wochengeld ist steuerfrei, wird monatlich im Nachhinein ausbezahlt und kann ab Beginn der achten Woche vor dem Termin beantragt werden. Es ist zugleich die Grundlage des einkommensabhängigen Kinderbetreuungsgeldes: Dieses beträgt ${DE.pct(K.ea_quote)} des Wochengeldes, im Beispiel ${DE.eur(bsp.tagsatz, 2)} am Tag.`,
    faqs: [
      { q: 'Welche drei Monate zählen für die Höhe des Wochengeldes?', a: `Die drei vollen Kalendermonate vor dem Monat, in dem der Mutterschutz beginnt. Beginnt die Schutzfrist am 20. Mai, zählen Februar, März und April; der Mai selbst bleibt außen vor. Maßgeblich ist das Netto, also Brutto minus Sozialversicherung und tatsächlich abgezogener Lohnsteuer, ohne Sonderzahlungen. Fehlzeiten mit Krankengeld oder unbezahltem Urlaub verkleinern den Teiler, statt den Schnitt zu drücken.` },
      { q: 'Lohnt es sich, den Familienbonus vor dem Wochengeld beim Arbeitgeber zu beantragen?', a: `Ja, wenn bereits ein Kind da ist. Die ÖGK zieht vom Brutto nur die Lohnsteuer ab, die der Arbeitgeber tatsächlich einbehalten hat. Familienbonus, Alleinverdienerabsetzbetrag oder Pendlerpauschale, die über das Formular beim Arbeitgeber laufen, erhöhen das Netto der drei Monate und damit das Wochengeld. Was erst Jahre später in der Arbeitnehmerveranlagung zurückkommt, zählt dafür nicht; so hat es auch der Oberste Gerichtshof entschieden.` },
      { q: 'Wie hoch ist der Sonderzahlungszuschlag beim Wochengeld?', a: `Er hängt davon ab, wie viele Sonderzahlungen Sie im Jahr bekommen: ${DE.pct(Z.ein_monatsbezug)} bei bis zu einem Monatsbezug, ${DE.pct(Z.zwei_monatsbezuege)} bei bis zu zwei und ${DE.pct(Z.mehr)} bei mehr als zwei. Wer 14 Gehälter bekommt, hat den mittleren Satz. Bei ${DE.eur(NETTO)} netto macht der Unterschied zwischen einem und mehr als zwei Monatsbezügen ${DE.eur(bsp3.wochengeldTag - bsp1.wochengeldTag, 2)} am Tag aus. Einmalprämien werden nicht ins Netto gerechnet.` },
      { q: 'Wie hängen Wochengeld und einkommensabhängiges Kinderbetreuungsgeld zusammen?', a: `Direkt: Für Mütter, die Wochengeld bezogen haben, beträgt das einkommensabhängige Kinderbetreuungsgeld ${DE.pct(K.ea_quote)} des Wochengeldes, höchstens ${DE.eur(K.ea_tag_max, 2)} am Tag. Danach prüft die Krankenkasse anhand des Steuerbescheids des Jahres vor der Geburt, ob ein höherer Tagsatz herauskommt; die Günstigkeitsrechnung kann den Betrag nur erhöhen. Ein höheres Wochengeld bedeutet deshalb auch ein höheres Kinderbetreuungsgeld.` },
      { q: 'Wie viel Wochengeld bekommen Mütter, die Arbeitslosengeld beziehen?', a: `Wer vor dem Mutterschutz eine Leistung nach dem Arbeitslosenversicherungsgesetz bezieht, also Arbeitslosengeld oder Notstandshilfe, bekommt grundsätzlich ${DE.pct(W.alvg_faktor)} der zuletzt bezogenen Leistung als Wochengeld. Geringfügig Beschäftigte mit Selbstversicherung erhalten einen Fixbetrag von ${DE.eur(W.fix_geringfuegig_selbstversichert_tag, 2)} am Tag. Den Antrag stellen Sie mit der Mitteilung über den Leistungsanspruch des AMS.` },
      { q: 'Verlängert sich das Wochengeld, wenn das Baby früher kommt?', a: `Ja, in Grenzen. Kommt das Kind früher als erwartet, verkürzt sich die Frist vor der Geburt, und die Frist danach verlängert sich entsprechend, höchstens auf ${W.schutzfrist_wochen_nach_max} Wochen. Bei einer Frühgeburt, bei Mehrlingen oder Kaiserschnitt dauert die Schutzfrist nach der Geburt ohnehin ${W.schutzfrist_wochen_nach_besonders} statt ${W.schutzfrist_wochen_nach} Wochen. Das Wochengeld läuft so lange wie die Schutzfrist.` },
    ],
    body: (h) => `
<h2>Wann es Wochengeld gibt</h2>
<p>Werdende Mütter dürfen ab der achten Woche vor dem voraussichtlichen Geburtstermin nicht mehr beschäftigt werden. Für diese Zeit zahlt nicht der Arbeitgeber, sondern die Krankenkasse, bei den meisten Angestellten die ÖGK, das Wochengeld. Laut ${h.src('ogvWochengeld', 'oesterreich.gv.at')} gilt:</p>
<ul>
<li><strong>vor der Geburt:</strong> ${h.num(h.P.wochengeld.schutzfrist_wochen_vor)} Wochen, berechnet nach dem ärztlich bestätigten Termin;</li>
<li><strong>am Tag der Entbindung;</strong></li>
<li><strong>nach der Geburt:</strong> ${h.num(h.P.wochengeld.schutzfrist_wochen_nach)} Wochen, bei Mehrlings-, Früh- oder Kaiserschnittgeburten ${h.num(h.P.wochengeld.schutzfrist_wochen_nach_besonders)} Wochen.</li>
</ul>
<p>Kommt das Kind früher, verlängert sich die Frist danach, höchstens auf ${h.num(h.P.wochengeld.schutzfrist_wochen_nach_max)} Wochen. Hat eine Fachärztin, der Arbeitsinspektionsarzt oder die Amtsärztin schon vorher ein Beschäftigungsverbot ausgesprochen, gibt es Wochengeld auch für diese Zeit. Wer im Mutterschutz zusätzlich Einkommen bezieht, riskiert, dass das Wochengeld in dieser Höhe ruht.</p>
<h2>Die Berechnung für Angestellte</h2>
<p>Das Wochengeld soll das Einkommen weder kürzen noch erhöhen. Grundlage ist deshalb das Netto, das Sie zuletzt tatsächlich verdient haben. Die ${h.src('oegkWochengeld', 'ÖGK')} rechnet so:</p>
<ol>
<li><strong>Zeitraum:</strong> die drei vollen Kalendermonate vor dem Monat, in dem der Mutterschutz beginnt.</li>
<li><strong>Netto:</strong> laufende Geld- und Sachbezüge, auch über der Höchstbeitragsgrundlage, minus Dienstnehmeranteil zur Sozialversicherung und minus der vom Arbeitgeber einbehaltenen Lohnsteuer. Urlaubs- und Weihnachtsgeld werden herausgerechnet.</li>
<li><strong>Je Tag:</strong> Das Netto der drei Monate wird durch die Kalendertage geteilt.</li>
<li><strong>Zuschlag:</strong> Für die Sonderzahlungen kommen ${h.pct(Z.ein_monatsbezug)}, ${h.pct(Z.zwei_monatsbezuege)} oder ${h.pct(Z.mehr)} dazu, je nachdem ob Sie bis zu einen, bis zu zwei oder mehr als zwei Monatsbezüge an Sonderzahlungen erhalten.</li>
</ol>
${h.table(['Netto pro Monat', 'Wochengeld pro Tag', `für ${WOCHEN} Wochen`, 'einkommensabh. KBG pro Tag'], zeilen.map((z) => [h.eur(z.n), h.eur(z.r.wochengeldTag, 2), h.eur(z.r.wochengeldTag * 7 * WOCHEN), h.eur(z.r.tagsatz, 2)]), `Schätzung mit 14 Bezügen (Zuschlag ${h.pct(Z.zwei_monatsbezuege)}), Kalendertage im Jahresschnitt; Rechenmotor dieser Seite`, ['l', 'r', 'r', 'r'])}
<p>Die Tabelle rechnet mit dem Jahresschnitt an Kalendertagen; die ÖGK teilt durch die tatsächlichen Tage der drei Monate, deshalb weicht der Bescheid um einige Cent ab. Die Spalte für ${WOCHEN} Wochen entspricht der Regel-Schutzfrist ohne den Tag der Entbindung.</p>
<!--mini:wochengeld-->
<h2>Was ins Netto zählt und was nicht</h2>
<ul>
<li><strong>Zählt:</strong> laufende Überstunden der drei Monate, Provisionen aus laufenden Umsätzen, Sachbezüge wie ein Dienstauto, wenn es im Mutterschutz zurückgegeben wird.</li>
<li><strong>Zählt nicht:</strong> Sonderzahlungen (dafür der Zuschlag), Einmalprämien für besondere Leistungen, Nachzahlungen für frühere Zeiträume, Sachbezüge, die weiterlaufen, und Aufwandsentschädigungen.</li>
<li><strong>Lücken:</strong> Krankenstand mit halbem Entgelt oder unbezahlter Urlaub werden aus dem Zeitraum genommen; der Teiler wird kleiner, der Tagesschnitt bleibt fair.</li>
</ul>
<p>Ein Detail mit Wirkung: Die ÖGK zieht nur die Lohnsteuer ab, die laut Personalverrechnung tatsächlich angefallen ist. Haben Sie Familienbonus, Alleinverdienerabsetzbetrag oder Pendlerpauschale beim Arbeitgeber beantragt, ist Ihr Netto höher, und damit das Wochengeld. Eine spätere Arbeitnehmerveranlagung ändert daran nichts. Wer schon ein Kind hat, sollte das Formular E 30 deshalb vor Beginn der drei Monate abgeben.</p>
<h2>Vom Wochengeld zum Kinderbetreuungsgeld</h2>
<p>Das Wochengeld wirkt über den Mutterschutz hinaus. Für Mütter, die es bezogen haben, beträgt das ${h.a('kbg-einkommensabhaengig', 'einkommensabhängige Kinderbetreuungsgeld')} ${h.pct(K.ea_quote)} des Wochengeldes, höchstens ${h.eur(K.ea_tag_max, 2)} am Tag (${h.src('kbgEa', 'Bundeskanzleramt')}). Im Beispiel mit ${h.eur(NETTO)} netto sind das ${h.eur(bsp.tagsatz, 2)}. Ab rund ${h.eur(hoch.n)} netto stößt man an den Höchstbetrag: Dort liegt das Wochengeld bei ${h.eur(hoch.r.wochengeldTag, 2)}, das Kinderbetreuungsgeld bleibt bei ${h.eur(hoch.r.tagsatz, 2)}. Anschließend prüft die Krankenkasse mit dem Steuerbescheid des Jahres vor der Geburt, ob ein höherer Tagsatz zusteht; diese Günstigkeitsrechnung kann nur erhöhen.</p>
<h2>Antrag und Auszahlung</h2>
<p>Den Antrag stellen Sie ab Beginn der achten Woche vor dem Termin bei Ihrer Krankenkasse. Nötig sind die Arbeits- und Entgeltbestätigung, die der Arbeitgeber ausstellt, und die ärztliche Bestätigung des Geburtstermins oder das Freistellungszeugnis. Nach der Geburt folgen Geburtsurkunde und gegebenenfalls die Bestätigung des Spitals über Frühgeburt, Mehrlinge oder Kaiserschnitt. Ausbezahlt wird monatlich im Nachhinein.</p>
<p>Das Wochengeld ist steuerfrei. Bei der Partnergrenze des ${h.a('alleinverdiener', 'Alleinverdienerabsetzbetrags')} zählt es trotzdem als Einkommen der Mutter. Andere Gruppen bekommen andere Beträge: Bezieherinnen von Arbeitslosengeld oder Notstandshilfe ${h.pct(h.P.wochengeld.alvg_faktor)} der Leistung, geringfügig Beschäftigte mit Selbstversicherung ${h.eur(h.P.wochengeld.fix_geringfuegig_selbstversichert_tag, 2)} am Tag, Selbständige ohne Betriebshilfe unter Umständen ${h.eur(h.P.wochengeld.fix_selbstaendig_tag, 2)} am Tag.</p>
`,
  },
  en: {
    slug: 'maternity-pay-wochengeld',
    nav: 'Maternity pay (Wochengeld)',
    card: 'What employees on maternity leave receive: net pay of the last three months per day plus a special payment surcharge.',
    title: 'Wochengeld 2026: Austrian Maternity Pay, Amount and Duration',
    description: `Wochengeld 2026, Austria’s maternity pay: net pay of the last ${W.bemessung_monate} months per day plus ${EN.pct(Z.zwei_monatsbezuege)}. On ${EN.eur(NETTO)} net, ${EN.eur(bsp.wochengeldTag, 2)} a day. Duration, claim, childcare allowance.`,
    h1: 'Wochengeld: what the health insurer pays during maternity leave',
    intro: 'How ÖGK, Austria’s health insurer, works out maternity pay from your net salary, how long it runs and why it later sets your earnings-related childcare allowance.',
    resume: `Wochengeld is Austria’s maternity pay: it replaces an employee’s income during the statutory maternity protection period (Mutterschutz). It runs for ${W.schutzfrist_wochen_vor} weeks before the expected due date, on the day of birth and for ${W.schutzfrist_wochen_nach} weeks afterwards, or ${W.schutzfrist_wochen_nach_besonders} weeks after multiple, premature or caesarean births. It is based on your average net pay over the last ${W.bemessung_monate} full calendar months before maternity protection starts, converted to a daily rate. Holiday and Christmas pay are left out and replaced by a flat surcharge: ${EN.pct(Z.ein_monatsbezug)} if your special payments total up to one month’s salary, ${EN.pct(Z.zwei_monatsbezuege)} up to two and ${EN.pct(Z.mehr)} above that. With average net pay of ${EN.eur(NETTO)} a month and 14 salaries a year you receive about ${EN.eur(bsp.wochengeldTag, 2)} a day, roughly ${EN.eur(bsp.wochengeldTag * 30)} per 30 days. Wochengeld is tax-free, paid monthly in arrears and can be claimed from the start of the eighth week before the due date. It also sets the earnings-related childcare allowance, which is ${EN.pct(K.ea_quote)} of it, ${EN.eur(bsp.tagsatz, 2)} a day in the example.`,
    faqs: [
      { q: 'Which three months count towards my Wochengeld?', a: 'The three full calendar months before the month in which maternity protection begins. If it starts on 20 May, February, March and April count and May itself does not. What matters is net pay: gross minus social insurance and the wage tax actually withheld, excluding special payments. Days on sick pay or unpaid leave shrink the divisor instead of dragging the average down.' },
      { q: 'Should I file form E 30 with my employer before the Wochengeld reference months?', a: 'Yes, if you already have a child or commute. ÖGK deducts only the wage tax your employer actually withheld. Familienbonus Plus, the sole earner credit or the commuter allowance applied through payroll raise your net pay for the three months and therefore your maternity pay. Relief that only arrives later through the annual tax return does not count, as Austria’s Supreme Court has confirmed.' },
      { q: 'How large is the special payment surcharge on Wochengeld?', a: `It depends on how much you receive in special payments a year: ${EN.pct(Z.ein_monatsbezug)} for up to one monthly salary, ${EN.pct(Z.zwei_monatsbezuege)} for up to two and ${EN.pct(Z.mehr)} for more than two. With 14 salaries a year you get the middle rate. At ${EN.eur(NETTO)} net the gap between one and more than two monthly salaries is ${EN.eur(bsp3.wochengeldTag - bsp1.wochengeldTag, 2)} a day. One-off bonuses are excluded from net pay.` },
      { q: 'How does Wochengeld affect the earnings-related childcare allowance?', a: `Directly. For mothers who received maternity pay, the earnings-related childcare allowance (einkommensabhängiges Kinderbetreuungsgeld) is ${EN.pct(K.ea_quote)} of the Wochengeld, capped at ${EN.eur(K.ea_tag_max, 2)} a day. The health insurer then checks the tax assessment for the year before the birth to see whether a higher rate results; that comparison can only raise the amount. Higher maternity pay therefore means a higher childcare allowance.` },
      { q: 'How much Wochengeld do women on unemployment benefit receive?', a: `If you receive unemployment benefit or emergency assistance under the Unemployment Insurance Act before maternity protection starts, your Wochengeld is generally ${EN.pct(W.alvg_faktor)} of the benefit you last received. Women in marginal employment with voluntary self-insurance get a flat ${EN.eur(W.fix_geringfuegig_selbstversichert_tag, 2)} a day. You claim with the statement of entitlement issued by the AMS, the public employment service.` },
      { q: 'Is Wochengeld paid for longer if the baby arrives early?', a: `Yes, within limits. If the baby comes earlier than expected, the period before birth is shorter and the period after it is extended accordingly, up to ${W.schutzfrist_wochen_nach_max} weeks. After a premature birth, a multiple birth or a caesarean, the period after birth is ${W.schutzfrist_wochen_nach_besonders} instead of ${W.schutzfrist_wochen_nach} weeks anyway. Maternity pay runs as long as the protection period.` },
    ],
    body: (h) => `
<h2>When Wochengeld is paid</h2>
<p>From the eighth week before the expected due date, pregnant employees in Austria may no longer work. For this period your employer stops paying salary and the health insurer, for most employees ÖGK, pays Wochengeld instead. According to ${h.src('ogvWochengeld', 'oesterreich.gv.at')}:</p>
<ul>
<li><strong>before birth:</strong> ${h.num(h.P.wochengeld.schutzfrist_wochen_vor)} weeks, based on the due date certified by your doctor;</li>
<li><strong>on the day of birth;</strong></li>
<li><strong>after birth:</strong> ${h.num(h.P.wochengeld.schutzfrist_wochen_nach)} weeks, or ${h.num(h.P.wochengeld.schutzfrist_wochen_nach_besonders)} weeks after multiple, premature or caesarean births.</li>
</ul>
<p>If the baby arrives early, the period after birth is extended, up to ${h.num(h.P.wochengeld.schutzfrist_wochen_nach_max)} weeks. If a specialist, a labour inspectorate doctor or a public health officer has already banned you from working earlier (individual employment ban), Wochengeld covers that time too. Additional income during maternity protection can cause the Wochengeld to be suspended up to that amount.</p>
<h2>How it is calculated for employees</h2>
<p>Wochengeld is meant to neither cut nor raise your income, so it starts from the net pay you actually earned most recently. ${h.src('oegkWochengeld', 'ÖGK')} works as follows:</p>
<ol>
<li><strong>Period:</strong> the three full calendar months before the month in which maternity protection starts.</li>
<li><strong>Net pay:</strong> regular pay in cash and in kind, even above the contribution ceiling, minus your social insurance share and the wage tax your employer withheld. Holiday and Christmas pay are taken out.</li>
<li><strong>Per day:</strong> net pay for the three months is divided by the number of calendar days.</li>
<li><strong>Surcharge:</strong> ${h.pct(Z.ein_monatsbezug)}, ${h.pct(Z.zwei_monatsbezuege)} or ${h.pct(Z.mehr)} is added for special payments, depending on whether yours add up to one, two or more than two monthly salaries.</li>
</ol>
${h.table(['Net per month', 'Wochengeld per day', `for ${WOCHEN} weeks`, 'earnings-related KBG per day'], zeilen.map((z) => [h.eur(z.n), h.eur(z.r.wochengeldTag, 2), h.eur(z.r.wochengeldTag * 7 * WOCHEN), h.eur(z.r.tagsatz, 2)]), `Estimate with 14 salaries (surcharge ${h.pct(Z.zwei_monatsbezuege)}), average calendar days; our engine`, ['l', 'r', 'r', 'r'])}
<p>The table uses the average number of calendar days per year; ÖGK divides by the actual days of your three months, so the decision may differ by a few cents. The ${WOCHEN}-week column covers the standard protection period without the day of birth.</p>
<!--mini:wochengeld-->
<h2>What counts as net pay</h2>
<ul>
<li><strong>Counts:</strong> regular overtime in the three months, commission earned on ongoing sales, benefits in kind such as a company car that you hand back during maternity protection.</li>
<li><strong>Does not count:</strong> special payments (covered by the surcharge), one-off performance bonuses, back pay for earlier periods, benefits in kind you keep, and expense allowances.</li>
<li><strong>Gaps:</strong> sick leave on half pay or unpaid leave are taken out of the period; the divisor shrinks and the daily average stays fair.</li>
</ul>
<p>One detail matters in euros: ÖGK deducts only the wage tax that payroll actually withheld. If you claimed Familienbonus Plus, the sole earner credit or the commuter allowance through your employer, your net pay is higher, and so is your Wochengeld. A later annual tax return does not change that. If you already have a child, hand form E 30 to payroll before the three reference months begin.</p>
<h2>From Wochengeld to childcare allowance</h2>
<p>Wochengeld matters beyond maternity protection. For mothers who received it, the ${h.a('kbg-einkommensabhaengig', 'earnings-related childcare allowance')} is ${h.pct(K.ea_quote)} of the Wochengeld, capped at ${h.eur(K.ea_tag_max, 2)} a day (${h.src('kbgEa', 'Federal Chancellery')}). In the example on ${h.eur(NETTO)} net that is ${h.eur(bsp.tagsatz, 2)}. From around ${h.eur(hoch.n)} net you hit the cap: Wochengeld is then ${h.eur(hoch.r.wochengeldTag, 2)} but the childcare allowance stays at ${h.eur(hoch.r.tagsatz, 2)}. Afterwards the insurer compares the result with your tax assessment for the year before the birth; this comparison can only raise the rate.</p>
<h2>Claiming and payment</h2>
<p>Apply to your health insurer from the start of the eighth week before the due date. You need the employment and earnings confirmation (Arbeits- und Entgeltbestätigung) from your employer and a medical certificate of the due date, or the exemption certificate for an early employment ban. After the birth, add the birth certificate and, where relevant, the hospital’s confirmation of a premature, multiple or caesarean birth. Payment is monthly in arrears.</p>
<p>Wochengeld is tax-free, yet it counts as the mother’s income for the partner limit of the ${h.a('alleinverdiener', 'sole earner credit')}. Other groups receive different amounts: women on unemployment benefit or emergency assistance ${h.pct(h.P.wochengeld.alvg_faktor)} of that benefit, marginal employees with self-insurance ${h.eur(h.P.wochengeld.fix_geringfuegig_selbstversichert_tag, 2)} a day, and self-employed women without farm or business help possibly ${h.eur(h.P.wochengeld.fix_selbstaendig_tag, 2)} a day.</p>
`,
  },
});
