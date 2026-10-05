import { defineGuide } from '../../lib/guide-types';
import { rechneJahr, standardJahr } from '../../lib/engine/jahr';
import { svLaufend, lohnsteuerLaufend, tarif } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiel aus dem Motor: Angestellte mit 3.200 € brutto, Lohnzettel für Juni und November. */
const B = 3200;
const jahr = rechneJahr(standardJahr(B));
const jun = jahr.monate[5], nov = jahr.monate[10];
const sv = svLaufend(B);
const bmg = B - sv.summe;
const lst = lohnsteuerLaufend(bmg);
const jahresTarif = tarif(lst.bemessungJahr);
const szBasisNov = nov.sz - nov.svSz;
const szSatz = P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av;
const auszahlungMonat = B - sv.summe - lst.lst;

export default defineGuide({
  id: 'lohnzettel',
  group: 'lohn',
  order: 70,
  mini: 'lohnzettel',
  miniDefaults: { b: B },
  related: ['sozialversicherung', 'lohnsteuer', 'sonderzahlungen', 'arbeitnehmerveranlagung', 'jahressechstel'],
  sources: ['ogvLohnzettel', 'wkoBeitraege', 'estg33', 'estg67'],
  de: {
    slug: 'lohnzettel-verstehen',
    nav: 'Lohnzettel verstehen',
    card: 'Jede Zeile der Gehaltsabrechnung erklärt: Bruttobezug, SV, Bemessungsgrundlage, Lohnsteuer, Sonderzahlung, L16.',
    title: 'Lohnzettel verstehen 2026: jede Zeile Ihrer Abrechnung',
    description: `Lohnzettel 2026 Zeile für Zeile: Bei ${DE.eur(B)} brutto gehen ${DE.eur(sv.summe, 2)} SV und ${DE.eur(lst.lst, 2)} Lohnsteuer ab. Dazu Sonderzahlung, L16 und die Kontrolle mit dem Rechner.`,
    h1: 'Den Lohnzettel lesen: Zeile für Zeile',
    intro: 'Was auf der monatlichen Gehaltsabrechnung steht, wie die Lohnverrechnung von Brutto zu Auszahlung kommt und wo Sie Fehler finden.',
    resume: `Ein österreichischer Lohnzettel führt in vier Schritten vom Brutto zur Auszahlung: Bruttobezug, minus Sozialversicherung des Dienstnehmers, ergibt die Lohnsteuerbemessungsgrundlage, davon geht die Lohnsteuer ab. Bei ${DE.eur(B)} brutto im Monat sind das 2026 ${DE.eur(sv.summe, 2)} Sozialversicherung (${DE.pct(sv.satz, 2)}), eine Bemessungsgrundlage von ${DE.eur(bmg, 2)} und ${DE.eur(lst.lst, 2)} Lohnsteuer, ausgezahlt werden ${DE.eur(auszahlungMonat, 2)}. Die Lohnsteuer wird dabei aufs Jahr hochgerechnet: Bemessungsgrundlage mal zwölf, minus ${DE.eur(P.tarif.werbungskostenpauschale)} Werbungskostenpauschale, Tarif nach § 33 EStG, geteilt durch zwölf, minus der Absetzbeträge wie dem Verkehrsabsetzbetrag von ${DE.eur(P.absetzbetraege.verkehrsabsetzbetrag)} im Jahr. In den Monaten mit Urlaubszuschuss und Weihnachtsremuneration steht die Sonderzahlung in eigenen Zeilen: Sozialversicherung ohne Arbeiterkammerumlage und Wohnbauförderung, Lohnsteuer mit festen Sätzen, im November bei diesem Gehalt ${DE.eur(nov.lstSzFest, 2)}. Nach Jahresende übermittelt der Arbeitgeber den Jahreslohnzettel L16 bis Ende Februar elektronisch an das Finanzamt; Sie sehen ihn in FinanzOnline.`,
    faqs: [
      { q: 'Warum stimmt die Lohnsteuer auf meinem Lohnzettel nicht mit dem Steuertarif überein?', a: `Weil die Lohnverrechnung den Monat aufs Jahr hochrechnet und Absetzbeträge abzieht. Bei ${DE.eur(B)} brutto ergeben ${DE.eur(bmg, 2)} Bemessungsgrundlage mal zwölf minus ${DE.eur(P.tarif.werbungskostenpauschale)} ein Jahreseinkommen von ${DE.eur(lst.bemessungJahr, 2)}. Der Tarif darauf sind ${DE.eur(jahresTarif, 2)}, ein Zwölftel davon ${DE.eur(lst.tarifMonat, 2)}. Abzüglich eines Zwölftels Verkehrsabsetzbetrag bleiben ${DE.eur(lst.lst, 2)} Lohnsteuer (§ 33 EStG).` },
      { q: 'Was bedeutet die Lohnsteuerbemessungsgrundlage auf dem Lohnzettel?', a: `Es ist der Betrag, auf den die Lohnsteuer gerechnet wird: Bruttobezug minus Sozialversicherung des Dienstnehmers, minus steuerfreie Teile wie begünstigte Überstundenzuschläge und gegebenenfalls Pendlerpauschale und Gewerkschaftsbeitrag. Bei ${DE.eur(B)} ohne solche Posten sind es ${DE.eur(bmg, 2)}. Sonderzahlungen innerhalb des Jahressechstels zählen nicht dazu, sie haben eine eigene Zeile mit festen Steuersätzen.` },
      { q: 'Warum ist die Sozialversicherung im Lohnzettel bei der Sonderzahlung niedriger?', a: `Weil von Urlaubszuschuss und Weihnachtsremuneration keine Arbeiterkammerumlage und kein Wohnbauförderungsbeitrag abgezogen werden. Es bleiben Kranken-, Pensions- und Arbeitslosenversicherung, zusammen ${DE.pct(szSatz, 2)} statt ${DE.pct(sv.satz, 2)}. Bei ${DE.eur(B)} Weihnachtsremuneration sind das ${DE.eur(nov.svSz, 2)}. Die Sätze stehen in der Übersicht der Wirtschaftskammer zum Beitragswesen 2026.` },
      { q: 'Wo finde ich den Jahreslohnzettel L16 und bis wann muss er da sein?', a: 'Der Arbeitgeber muss den Lohnzettel L16 nach Ablauf des Kalenderjahres grundsätzlich bis Ende Februar elektronisch über ELDA an das Finanzamt übermitteln. Sie sehen ihn danach in Ihrem Steuerakt in FinanzOnline. Ein Papierlohnzettel ist nur ohne technische Möglichkeit erlaubt und muss dann bis Ende Jänner übermittelt werden. Für die Arbeitnehmerveranlagung brauchen Sie ihn nicht beizulegen.' },
      { q: 'Wie kontrolliere ich meinen Lohnzettel mit einem Rechner?', a: `Tragen Sie den Bruttobezug ohne Sonderzahlung in den Rechner ein, dazu Bundesland, Kinder mit Familienbonus und Pendlerpauschale, wie sie auf dem Lohnzettel stehen. Stimmen Sozialversicherung und Lohnsteuer auf den Cent, ist der laufende Monat richtig. Abweichungen kommen meist von Überstunden, Sachbezügen, einem Eintritt im Monat oder Aufrollungen, die ein einfacher Rechner bei ${DE.eur(B)} nicht kennt.` },
    ],
    body: (h) => `
<h2>Der Monatslohnzettel bei ${h.eur(B)} brutto</h2>
<p>Jede Gehaltsabrechnung sieht je nach Lohnprogramm anders aus, die Reihenfolge ist aber fast immer dieselbe. So sieht ein regulärer Monat einer Angestellten außerhalb Wiens aus, ohne Kinder und ohne Pendlerpauschale:</p>
${h.table(['Zeile', 'Betrag', 'woher'], [
  ['Bruttobezug (Gehalt laut Vertrag oder Kollektivvertrag)', h.eur(B, 2), 'Dienstvertrag'],
  [`Krankenversicherung ${h.pct(h.P.sv.dn.kv, 2)}`, `− ${h.eur(sv.kv, 2)}`, 'Sozialversicherung'],
  [`Pensionsversicherung ${h.pct(h.P.sv.dn.pv, 2)}`, `− ${h.eur(sv.pv, 2)}`, 'Sozialversicherung'],
  [`Arbeitslosenversicherung ${h.pct(sv.satz - h.P.sv.dn.kv - h.P.sv.dn.pv - h.P.sv.dn.ak - h.P.sv.dn.wf, 2)}`, `− ${h.eur(sv.av, 2)}`, 'Sozialversicherung'],
  [`Arbeiterkammerumlage ${h.pct(h.P.sv.dn.ak, 2)}`, `− ${h.eur(sv.ak, 2)}`, 'Sozialversicherung'],
  [`Wohnbauförderungsbeitrag ${h.pct(h.P.sv.dn.wf, 2)}`, `− ${h.eur(sv.wf, 2)}`, 'Sozialversicherung'],
  ['<strong>Lohnsteuerbemessungsgrundlage</strong>', `<strong>${h.eur(bmg, 2)}</strong>`, 'Brutto minus SV'],
  ['Lohnsteuer', `− ${h.eur(lst.lst, 2)}`, '§ 33 EStG'],
  ['<strong>Auszahlung</strong>', `<strong>${h.eur(auszahlungMonat, 2)}</strong>`, 'aufs Konto'],
], 'Laufender Monat 2026, berechnet mit unserem Motor', ['l', 'r', 'l'])}
<h3>Bruttobezug</h3>
<p>Ganz oben steht das Gehalt laut Vertrag, darunter oft Zulagen, Überstunden, Provisionen oder Sachbezüge wie ein Firmenwagen zur Privatnutzung. Sachbezüge erhöhen Sozialversicherung und Lohnsteuer, werden aber nicht ausgezahlt; sie tauchen daher im Brutto auf und weiter unten noch einmal als Abzug.</p>
<h3>Sozialversicherung des Dienstnehmers</h3>
<p>Die Sozialversicherung erscheint entweder als eine Summe oder aufgeteilt in ihre Teile. Die Sätze 2026 stammen aus der ${h.src('wkoBeitraege', 'Übersicht der WKO zum Beitragswesen')}. Viele Lohnzettel nennen zusätzlich die Beitragsgruppe, einen Kurzcode der Österreichischen Gesundheitskasse, der festlegt, welche Sätze für Ihr Dienstverhältnis gelten; für Angestellte und Arbeiter sind die Sätze 2026 gleich. Unterhalb von ${h.eur(h.P.sv.av_staffel[2][0])} brutto ist der Satz der Arbeitslosenversicherung geringer, unterhalb von ${h.eur(h.P.sv.av_staffel[0][0])} null. Gelegentlich gibt es weitere Zeilen:</p>
<ul>
<li><strong>Zusatzbeitrag für mitversicherte Angehörige:</strong> ${h.pct(h.P.sv.zusatzbeitrag_angehoerige, 2)} der Beitragsgrundlage samt Sonderzahlungen, etwa für einen Ehepartner ohne eigene Versicherung.</li>
<li><strong>Schlechtwetterentschädigungsbeitrag:</strong> ${h.pct(h.P.sv.schlechtwetter_dn, 2)} für Arbeiter in Betrieben, die unter das Bauarbeiter-Schlechtwetterentschädigungsgesetz fallen.</li>
<li><strong>Gewerkschaftsbeitrag:</strong> wenn Sie ihn über den Arbeitgeber zahlen; er mindert die Lohnsteuerbemessungsgrundlage.</li>
</ul>
<h3>Lohnsteuerbemessungsgrundlage und Lohnsteuer</h3>
<p>Die Lohnsteuer rechnet die Lohnverrechnung nicht für den Monat, sondern für ein gedachtes Jahr, so wie der ${h.src('estg33', 'Tarif nach § 33 EStG')} es vorsieht:</p>
${h.table(['Schritt', 'Betrag'], [
  ['Bemessungsgrundlage im Monat', h.eur(bmg, 2)],
  ['× 12', h.eur(bmg * 12, 2)],
  [`− Werbungskostenpauschale`, `− ${h.eur(h.P.tarif.werbungskostenpauschale, 2)}`],
  ['= Jahresbemessungsgrundlage', h.eur(lst.bemessungJahr, 2)],
  ['Tarifsteuer im Jahr', h.eur(jahresTarif, 2)],
  ['÷ 12', h.eur(lst.tarifMonat, 2)],
  [`− Verkehrsabsetzbetrag (${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)} ÷ 12)`, `− ${h.eur(lst.vab / 12, 2)}`],
  ['= Lohnsteuer im Monat', h.eur(lst.lst, 2)],
], `Bei ${h.eur(B)} brutto, Grenzsteuersatz ${h.pct(lst.grenzsteuersatz, 0)}`, ['l', 'r'])}
<p>Kinder mit Familienbonus Plus, der Alleinverdiener- oder Alleinerzieherabsetzbetrag und Pendlerpauschale oder Pendlereuro werden nur berücksichtigt, wenn Sie sie dem Arbeitgeber mit Formular gemeldet haben. Fehlen sie auf dem Lohnzettel, holen Sie sie in der ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} nach. Die ausführliche Herleitung steht auf der Seite zur ${h.a('lohnsteuer', 'Lohnsteuer')}.</p>
<!--mini:lohnsteuer-->

<h2>Der Lohnzettel mit Sonderzahlung</h2>
<p>Im Juni und im November kommt meist ein zweiter Block dazu. Die Sonderzahlung hat eigene Zeilen, weil sie anders verbeitragt und versteuert wird (${h.src('estg67', '§ 67 EStG')}).</p>
${h.table(['Zeile', 'Juni (Urlaubszuschuss)', 'November (Weihnachtsremuneration)'], [
  ['Sonderzahlung brutto', h.eur(jun.sz, 2), h.eur(nov.sz, 2)],
  [`SV Sonderzahlung ${h.pct(szSatz, 2)}`, `− ${h.eur(jun.svSz, 2)}`, `− ${h.eur(nov.svSz, 2)}`],
  ['Lohnsteuer mit festen Sätzen', `− ${h.eur(jun.lstSzFest, 2)}`, `− ${h.eur(nov.lstSzFest, 2)}`],
  ['Jahressechstel zu diesem Zeitpunkt', h.eur(jun.sechstel, 2), h.eur(nov.sechstel, 2)],
], `Gleiches Gehalt von ${h.eur(B)} das ganze Jahr`, ['l', 'r', 'r'])}
<p>Im Juni ist die Lohnsteuer niedriger, weil die ersten ${h.eur(h.P.sonderzahlungen.freibetrag)} im Jahr steuerfrei sind. Im November wird der ganze Betrag nach Sozialversicherung, ${h.eur(szBasisNov, 2)}, mit ${h.pct(h.P.sonderzahlungen.stufen[1][1], 0)} versteuert. Steht auf Ihrem Lohnzettel ein Betrag „über dem Sechstel“ oder eine Zeile „sonstiger Bezug nach Tarif“, war die Sonderzahlung größer als das ${h.a('jahressechstel', 'Jahressechstel')}. Mehr dazu im ${h.a('sonderzahlungen', 'Rechner für Urlaubs- und Weihnachtsgeld')}.</p>

<h2>Der Jahreslohnzettel L16</h2>
<p>Nach Ablauf des Jahres meldet der Arbeitgeber Ihre Bezüge, Beiträge und Steuern gesammelt an das Finanzamt. Laut ${h.src('ogvLohnzettel', 'oesterreich.gv.at')} geschieht das grundsätzlich bis Ende Februar des Folgejahres elektronisch über ELDA; ein Papierlohnzettel ist nur zulässig, wenn die technischen Voraussetzungen fehlen, und muss dann bis Ende Jänner beim Finanzamt sein. Sie können den L16 in Ihrem elektronischen Steuerakt in FinanzOnline einsehen. Er ist die Grundlage der Arbeitnehmerveranlagung und auch der automatischen Gutschrift, wenn Sie keinen Antrag stellen.</p>
<p>Prüfen Sie dort vor allem drei Dinge: ob alle Arbeitgeber des Jahres einen Lohnzettel geschickt haben, ob die einbehaltene Lohnsteuer mit der Summe Ihrer Monatsabrechnungen übereinstimmt und ob Familienbonus und Pendlerpauschale in der Höhe erfasst sind, die Ihnen zusteht.</p>

<h2>Typische Fehler, die Sie selbst finden</h2>
<ul>
<li><strong>Wohnbauförderung in Wien:</strong> Seit 2026 beträgt der Dienstnehmeranteil ${h.pct(h.P.sv.dn.wf_wien, 2)} statt ${h.pct(h.P.sv.dn.wf, 2)}. Arbeiten Sie in Wien und steht noch der alte Satz auf dem Lohnzettel, stimmt die Abrechnung nicht.</li>
<li><strong>Arbeitslosenversicherung nach einer Gehaltsänderung:</strong> Rutscht das Brutto über oder unter ${h.eur(h.P.sv.av_staffel[0][0])}, ${h.eur(h.P.sv.av_staffel[1][0])} oder ${h.eur(h.P.sv.av_staffel[2][0])}, muss sich der Satz im selben Monat ändern.</li>
<li><strong>Familienbonus doppelt:</strong> Beantragen beide Elternteile beim Arbeitgeber den vollen Betrag, folgt eine Pflichtveranlagung mit Nachzahlung.</li>
<li><strong>Pendlerpauschale veraltet:</strong> Nach einem Umzug oder Jobwechsel muss die Änderung binnen eines Monats gemeldet werden, sonst stimmt die Lohnsteuer nicht mehr.</li>
</ul>

<h2>Kontrolle in drei Minuten</h2>
<ol>
<li>Bruttobezug des Monats ohne Sonderzahlung in den Rechner oben eintragen.</li>
<li>Sozialversicherung vergleichen. Stimmt sie nicht, liegt es meist an Überstunden, Sachbezügen oder einem Teilmonat.</li>
<li>Lohnsteuer vergleichen, mit denselben Angaben zu Kindern, Pendlerpauschale und Bundesland wie auf dem Lohnzettel. Kleine Abweichungen entstehen durch Aufrollungen nach einer Gehaltsänderung.</li>
</ol>
`,
  },
  en: {
    slug: 'austrian-payslip-explained',
    nav: 'Payslip explained',
    card: 'Every line of an Austrian payslip (Lohnzettel) explained: gross pay, social insurance, taxable pay, wage tax, bonuses, L16.',
    title: 'Payslip in Austria 2026: Your Lohnzettel Line by Line',
    description: `Austrian payslip (Lohnzettel) 2026 line by line: on ${EN.eur(B)} gross, ${EN.eur(sv.summe, 2)} social insurance and ${EN.eur(lst.lst, 2)} wage tax come off. Bonus lines and the L16 explained.`,
    h1: 'Reading your Austrian payslip, line by line',
    intro: 'For anyone puzzling over their first Austrian payslip: what each line means and how payroll gets from gross salary to the amount in your account.',
    resume: `An Austrian payslip (Lohnzettel or Gehaltsabrechnung) gets from gross to net in four steps: gross pay, minus your social insurance, gives the taxable base for wage tax (Lohnsteuerbemessungsgrundlage), from which wage tax is deducted. On ${EN.eur(B)} gross a month in 2026 that means ${EN.eur(sv.summe, 2)} social insurance (${EN.pct(sv.satz, 2)}), a taxable base of ${EN.eur(bmg, 2)} and ${EN.eur(lst.lst, 2)} wage tax, leaving ${EN.eur(auszahlungMonat, 2)} paid out. Wage tax is worked out on an annual basis: taxable base times twelve, minus the ${EN.eur(P.tarif.werbungskostenpauschale)} flat work-expense allowance, then the tax scale, divided by twelve, minus credits such as the ${EN.eur(P.absetzbetraege.verkehrsabsetzbetrag)} annual transport credit. In June and November, holiday and Christmas pay appear in separate lines: social insurance without the Chamber of Labour levy and housing contribution, and wage tax at fixed rates, ${EN.eur(nov.lstSzFest, 2)} in November on this salary. After year end your employer sends the annual payslip, form L16, to the tax office by the end of February; you can view it in FinanzOnline, the tax portal.`,
    faqs: [
      { q: 'Why does the wage tax on my Austrian payslip not match the tax bands?', a: `Because payroll scales the month up to a year and then deducts credits. On ${EN.eur(B)} gross, the taxable base of ${EN.eur(bmg, 2)} times twelve, minus ${EN.eur(P.tarif.werbungskostenpauschale)}, gives ${EN.eur(lst.bemessungJahr, 2)} a year. Tax on that is ${EN.eur(jahresTarif, 2)}, or ${EN.eur(lst.tarifMonat, 2)} a month. Subtract one twelfth of the transport credit and you reach the ${EN.eur(lst.lst, 2)} on the payslip, as section 33 of the Income Tax Act prescribes.` },
      { q: 'What is the Lohnsteuerbemessungsgrundlage on my payslip?', a: `It is the amount wage tax is calculated on: gross pay minus your social insurance, minus tax-free items such as qualifying overtime premiums and, where they apply, the commuter allowance and union dues. On ${EN.eur(B)} with none of those, it is ${EN.eur(bmg, 2)}. Holiday and Christmas pay within the annual sixth are not part of it; they have their own line taxed at fixed rates.` },
      { q: 'Why is social insurance lower on the bonus lines of my payslip?', a: `Because holiday and Christmas pay carry neither the Chamber of Labour levy nor the housing contribution. Only health, pension and unemployment insurance remain, ${EN.pct(szSatz, 2)} in total instead of ${EN.pct(sv.satz, 2)}. On ${EN.eur(B)} of Christmas pay that is ${EN.eur(nov.svSz, 2)}. The rates are listed in the Austrian Chamber of Commerce overview of 2026 contributions.` },
      { q: 'Where do I find my annual L16 payslip and when is it due?', a: 'Your employer must send the L16 annual payslip to the tax office electronically, through the ELDA system, by the end of February after the calendar year. You can then view it in your tax file on FinanzOnline. Paper forms are only allowed where electronic filing is technically impossible, and are due by the end of January. You never need to attach it to your tax return.' },
    ],
    body: (h) => `
<h2>A monthly payslip on ${h.eur(B)} gross</h2>
<p>Payslips look different depending on the payroll software, but the order is almost always the same. This is a regular month for a salaried employee outside Vienna with no children and no commuter allowance:</p>
${h.table(['Line', 'Amount', 'What it is'], [
  ['Bruttobezug (gross pay under your contract or collective agreement)', h.eur(B, 2), 'contract'],
  [`Krankenversicherung, health insurance ${h.pct(h.P.sv.dn.kv, 2)}`, `− ${h.eur(sv.kv, 2)}`, 'social insurance'],
  [`Pensionsversicherung, pension ${h.pct(h.P.sv.dn.pv, 2)}`, `− ${h.eur(sv.pv, 2)}`, 'social insurance'],
  [`Arbeitslosenversicherung, unemployment ${h.pct(sv.satz - h.P.sv.dn.kv - h.P.sv.dn.pv - h.P.sv.dn.ak - h.P.sv.dn.wf, 2)}`, `− ${h.eur(sv.av, 2)}`, 'social insurance'],
  [`Arbeiterkammerumlage, Chamber of Labour ${h.pct(h.P.sv.dn.ak, 2)}`, `− ${h.eur(sv.ak, 2)}`, 'social insurance'],
  [`Wohnbauförderung, housing ${h.pct(h.P.sv.dn.wf, 2)}`, `− ${h.eur(sv.wf, 2)}`, 'social insurance'],
  ['<strong>Lohnsteuerbemessungsgrundlage, taxable pay</strong>', `<strong>${h.eur(bmg, 2)}</strong>`, 'gross minus SI'],
  ['Lohnsteuer, wage tax', `− ${h.eur(lst.lst, 2)}`, 'section 33'],
  ['<strong>Auszahlung, paid out</strong>', `<strong>${h.eur(auszahlungMonat, 2)}</strong>`, 'to your account'],
], 'Regular month 2026, calculated with our engine', ['l', 'r', 'l'])}
<h3>Gross pay</h3>
<p>The top lines show your contractual salary, often followed by allowances, overtime, commission or benefits in kind (Sachbezug), such as a company car you may use privately. Benefits in kind raise social insurance and tax but are not paid out, so they appear in gross pay and again further down as a deduction.</p>
<h3>Employee social insurance</h3>
<p>Social insurance appears either as one total or split into its parts. The 2026 rates come from the ${h.src('wkoBeitraege', 'Chamber of Commerce overview')}. Many payslips also show a contribution group (Beitragsgruppe), a short code from ÖGK, Austria's main health insurer, that sets which rates apply to your job; for salaried and blue-collar staff the 2026 rates are identical. Below ${h.eur(h.P.sv.av_staffel[2][0])} gross the unemployment rate is reduced, and below ${h.eur(h.P.sv.av_staffel[0][0])} it is zero. You may also see:</p>
<ul>
<li><strong>Zusatzbeitrag:</strong> ${h.pct(h.P.sv.zusatzbeitrag_angehoerige, 2)} of your contribution base including special payments, if a dependant such as a spouse without own cover is co-insured with you.</li>
<li><strong>Schlechtwetterentschädigungsbeitrag:</strong> ${h.pct(h.P.sv.schlechtwetter_dn, 2)} bad-weather contribution for blue-collar workers in construction firms.</li>
<li><strong>Gewerkschaftsbeitrag:</strong> union dues, if deducted by your employer; they lower your taxable pay.</li>
</ul>
<h3>Taxable pay and wage tax</h3>
<p>Payroll does not tax the month on its own; it works out tax for a notional year, as the ${h.src('estg33', 'scale in section 33 of the Income Tax Act')} requires:</p>
${h.table(['Step', 'Amount'], [
  ['Taxable pay this month', h.eur(bmg, 2)],
  ['× 12', h.eur(bmg * 12, 2)],
  ['− flat work-expense allowance', `− ${h.eur(h.P.tarif.werbungskostenpauschale, 2)}`],
  ['= annual taxable base', h.eur(lst.bemessungJahr, 2)],
  ['tax on the scale per year', h.eur(jahresTarif, 2)],
  ['÷ 12', h.eur(lst.tarifMonat, 2)],
  [`− transport credit (${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)} ÷ 12)`, `− ${h.eur(lst.vab / 12, 2)}`],
  ['= wage tax this month', h.eur(lst.lst, 2)],
], `On ${h.eur(B)} gross, marginal rate ${h.pct(lst.grenzsteuersatz, 0)}`, ['l', 'r'])}
<p>The child tax credit (Familienbonus Plus), the sole earner or single parent credit and the commuter allowance only appear if you filed the matching form with your employer. If they are missing, you can claim them afterwards in your ${h.a('arbeitnehmerveranlagung', 'annual tax assessment')}. The ${h.a('lohnsteuer', 'wage tax page')} explains the scale in detail.</p>
<!--mini:lohnsteuer-->

<h2>Payslips with holiday or Christmas pay</h2>
<p>Most Austrian employees receive a 13th and 14th salary, paid as holiday pay (Urlaubszuschuss) in June and Christmas pay (Weihnachtsremuneration) in November. They get their own block because they are charged and taxed differently (${h.src('estg67', 'section 67')}).</p>
${h.table(['Line', 'June (holiday pay)', 'November (Christmas pay)'], [
  ['Special payment, gross', h.eur(jun.sz, 2), h.eur(nov.sz, 2)],
  [`SI on special payment ${h.pct(szSatz, 2)}`, `− ${h.eur(jun.svSz, 2)}`, `− ${h.eur(nov.svSz, 2)}`],
  ['Wage tax at fixed rates', `− ${h.eur(jun.lstSzFest, 2)}`, `− ${h.eur(nov.lstSzFest, 2)}`],
  ['Annual sixth at that point', h.eur(jun.sechstel, 2), h.eur(nov.sechstel, 2)],
], `Same salary of ${h.eur(B)} all year`, ['l', 'r', 'r'])}
<p>June's tax is lower because the first ${h.eur(h.P.sonderzahlungen.freibetrag)} of special payments each year are tax-free. In November the whole amount after social insurance, ${h.eur(szBasisNov, 2)}, is taxed at ${h.pct(h.P.sonderzahlungen.stufen[1][1], 0)}. If your payslip shows an amount "über dem Sechstel" or a line for "sonstiger Bezug nach Tarif", the payment exceeded your ${h.a('jahressechstel', 'annual sixth')}. The ${h.a('sonderzahlungen', 'holiday and Christmas pay calculator')} shows why.</p>

<h2>The annual payslip, form L16</h2>
<p>After the year ends, your employer reports your total pay, contributions and taxes to the tax office. According to ${h.src('ogvLohnzettel', 'oesterreich.gv.at')}, this is normally done electronically through ELDA by the end of February of the following year; a paper L16 is only allowed where electronic filing is not possible and must then arrive by the end of January. You can see it in your electronic tax file in FinanzOnline. It is the basis for the annual tax assessment and for the automatic refund if you file nothing.</p>
<p>Check three things there: that every employer you had during the year has sent one, that the wage tax withheld matches the total of your monthly payslips, and that the child credit and commuter allowance are recorded at the amount you are entitled to.</p>

<h2>Common mistakes you can spot yourself</h2>
<ul>
<li><strong>Vienna housing contribution:</strong> from 2026 the employee share is ${h.pct(h.P.sv.dn.wf_wien, 2)} instead of ${h.pct(h.P.sv.dn.wf, 2)}. If you work in Vienna and the old rate still appears, the payslip is wrong.</li>
<li><strong>Unemployment insurance after a pay change:</strong> if your gross crosses ${h.eur(h.P.sv.av_staffel[0][0])}, ${h.eur(h.P.sv.av_staffel[1][0])} or ${h.eur(h.P.sv.av_staffel[2][0])}, the rate must change in the same month.</li>
<li><strong>Child credit claimed twice:</strong> if both parents claim the full amount through payroll, a compulsory assessment with a back payment follows.</li>
<li><strong>Outdated commuter allowance:</strong> after moving house or job, changes must be reported within a month.</li>
</ul>

<h2>A three-minute check</h2>
<ol>
<li>Enter the month's gross pay without special payments into the calculator above.</li>
<li>Compare social insurance. A mismatch usually comes from overtime, benefits in kind or a part month.</li>
<li>Compare wage tax using the same children, commuter allowance and federal state as on the payslip. Small gaps come from recalculations after a pay change.</li>
</ol>
`,
  },
});
