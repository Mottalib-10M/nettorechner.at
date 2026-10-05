import { defineGuide } from '../../lib/guide-types';
import { svLaufend, tarif } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const A = P.absetzbetraege;
const KMB = A.kindermehrbetrag, TAGE = A.kindermehrbetrag_mindest_tage, GR = A.kindermehrbetrag_einkommensgrenzen;
/** Einkommen und Tarifsteuer aus dem Motor: laufender Bezug 14-mal im Jahr, Sonderzahlungen mit festen Sätzen (nicht im Tarif). */
const fall = (b: number) => {
  const einkommen = Math.max(0, (b - svLaufend(b).summe) * 12 - P.tarif.werbungskostenpauschale);
  const est = tarif(einkommen);
  return { b, einkommen, est, k1: Math.max(0, KMB - est), k2: Math.max(0, 2 * KMB - est) };
};
const BRUTTOS = [900, 1200, 1400, 1600, 1800, 2000];
const F = BRUTTOS.map(fall);
const f1400 = fall(1400), f1800 = fall(1800), f1200 = fall(1200);
const sv1400 = svLaufend(1400).summe;

export default defineGuide({
  id: 'kindermehrbetrag',
  group: 'absetz',
  order: 30,
  mini: 'kindermehrbetrag',
  miniHref: 'familienbonus',
  related: ['familienbonus', 'familienbonus-beantragen', 'alleinverdiener', 'arbeitnehmerveranlagung', 'kinderbetreuungsgeld'],
  sources: ['estg33', 'ogvKindermehrbetrag', 'bmfFamilienbonus'],
  de: {
    slug: 'kindermehrbetrag',
    nav: 'Kindermehrbetrag',
    card: `Bis zu ${DE.eur(KMB)} je Kind als Gutschrift, wenn die Steuer zu niedrig für den Familienbonus ist: Bedingungen und Beispiele.`,
    title: `Kindermehrbetrag 2026: bis ${DE.eur(KMB)} je Kind bei wenig Steuer`,
    description: `Kindermehrbetrag 2026: bis ${DE.eur(KMB)} je Kind, wenn Ihre Tarifsteuer darunter liegt. Wer ihn bekommt, welche Einkommensgrenzen gelten, wie er ausbezahlt wird.`,
    h1: 'Der Kindermehrbetrag: Geld für Eltern, die kaum Steuer zahlen',
    intro: 'Für Eltern, bei denen der Familienbonus Plus mangels Lohnsteuer ins Leere geht, zahlt das Finanzamt die Differenz bis zu einem festen Betrag je Kind aus.',
    resume: `Der Kindermehrbetrag ist eine Gutschrift für Eltern mit kleinem Einkommen: Liegt die Einkommensteuer nach dem Tarif, also vor allen Absetzbeträgen, unter ${DE.eur(KMB)}, erstattet das Finanzamt die Differenz bis ${DE.eur(KMB)}, für jedes weitere Kind um ${DE.eur(KMB)} mehr (§ 33 Abs. 7 EStG). Er steht zu, wenn Sie Anspruch auf den Alleinverdiener- oder Alleinerzieherabsetzbetrag haben oder wenn auch Ihr Partner unter dieser Steuergrenze bleibt; im zweiten Fall bekommt ihn nur, wer die Familienbeihilfe bezieht. Dazu müssen Sie an mindestens ${TAGE} Tagen im Jahr steuerpflichtige Einkünfte gehabt oder das ganze Jahr nur Kinderbetreuungsgeld, Wochengeld oder Pflegekarenzgeld bezogen haben. Bei einem Kind liegt die Grenze laut Finanzministerium bei einem Einkommen von ${DE.eur(GR[0])} im Jahr 2026. Eine Alleinerzieherin mit ${DE.eur(1400)} brutto hat eine Tarifsteuer von ${DE.eur(f1400.est, 2)} und bekommt ${DE.eur(f1400.k1, 2)} Kindermehrbetrag. Ausbezahlt wird er nur über die Arbeitnehmerveranlagung, nie im Lohnzettel.`,
    faqs: [
      { q: 'Wie hoch ist der Kindermehrbetrag bei zwei Kindern?', a: `Die Grenze verdoppelt sich auf ${DE.eur(2 * KMB)} Tarifsteuer, erstattet wird die Differenz. Bei ${DE.eur(1800)} brutto im Monat liegt die Tarifsteuer bei ${DE.eur(f1800.est, 2)}: Mit einem Kind gibt es ${DE.eur(f1800.k1, 2)}, mit zwei Kindern ${DE.eur(f1800.k2, 2)}. Laut Finanzministerium liegt die Einkommensgrenze 2026 bei zwei Kindern bei ${DE.eur(GR[1])}, bei drei Kindern bei ${DE.eur(GR[2])}.` },
      { q: 'Muss ich den Kindermehrbetrag extra beantragen?', a: 'Ein eigenes Formular gibt es nicht, ein Kreuz aber schon. Das Finanzamt berechnet den Kindermehrbetrag in der Arbeitnehmerveranlagung, wenn Sie in der Erklärung bestätigen, dass die Voraussetzungen vorliegen: im Formular L 1 unter Punkt 5.2, in der Einkommensteuererklärung E 1 unter Punkt 4.2. In FinanzOnline ist die Frage Teil des Ablaufs. Der Arbeitgeber kann den Betrag nicht auszahlen.' },
      { q: 'Bekomme ich den Kindermehrbetrag, wenn ich das ganze Jahr nur Kinderbetreuungsgeld beziehe?', a: `Ja, das ist einer der Hauptfälle. Wer im gesamten Kalenderjahr nur Kinderbetreuungsgeld, Wochengeld oder Pflegekarenzgeld bezogen hat, erfüllt die Voraussetzung auch ohne ${TAGE} Tage Arbeit. Diese Leistungen sind steuerfrei, die Tarifsteuer ist daher null und der volle Betrag von ${DE.eur(KMB)} je Kind möglich, wenn Sie alleinerziehend sind oder Ihr Partner ebenfalls unter der Steuergrenze bleibt.` },
      { q: 'Steht der Kindermehrbetrag zu, wenn mein Partner gut verdient?', a: `In der Regel nicht. Mit Partner führen nur zwei Wege dorthin: Beide haben eine Tarifsteuer unter ${DE.eur(KMB)}, oder einer ist Alleinverdiener, weil der andere höchstens ${DE.eur(A.avab_partner_einkuenfte_max)} Einkünfte im Jahr hat; dann zählt die Steuer des Alleinverdieners selbst. Zahlt der gut verdienende Partner ${DE.eur(KMB)} Tarifsteuer oder mehr, scheitern beide Wege. Dann sollte er den ganzen Familienbonus Plus beantragen.` },
      { q: 'Was zählt beim Kindermehrbetrag als Einkommensteuer?', a: `Die Steuer nach dem Tarif des § 33 Abs. 1 EStG auf das Jahreseinkommen, vor Familienbonus, Verkehrsabsetzbetrag und allen anderen Absetzbeträgen. Urlaubs- und Weihnachtsgeld, die mit festen Sätzen versteuert werden, zählen nicht dazu. Das Einkommen ist das Brutto der laufenden Bezüge minus Sozialversicherung, Werbungskosten von mindestens ${DE.eur(P.tarif.werbungskostenpauschale)} und gegebenenfalls Pendlerpauschale.` },
    ],
    body: (h) => `
<h2>Wofür es den Kindermehrbetrag gibt</h2>
<p>Der Familienbonus Plus senkt die Steuer, aber höchstens auf null. Wer wenig verdient, kann ihn deshalb kaum nutzen. Für diese Eltern gibt es den Kindermehrbetrag nach ${h.src('estg33', '§ 33 Abs. 7 EStG')}: Das Finanzamt zahlt die Differenz zwischen der Tarifsteuer und ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} je Kind aus. Laut ${h.src('ogvKindermehrbetrag', 'oesterreich.gv.at')} erhalten Personen mit geringem Einkommen ihn unter bestimmten Voraussetzungen statt des Familienbonus, und er kann nur in der Arbeitnehmerveranlagung oder Einkommensteuererklärung berücksichtigt werden.</p>
<h2>Die drei Voraussetzungen</h2>
<ol>
<li><strong>Einkünfte oder bestimmte Leistungen:</strong> an mindestens ${TAGE} Tagen im Kalenderjahr steuerpflichtige Einkünfte aus Arbeit oder Betrieb, oder im ganzen Jahr ausschließlich Kinderbetreuungsgeld, Wochengeld oder Pflegekarenzgeld.</li>
<li><strong>Niedrige Steuer:</strong> Die Einkommensteuer nach dem Tarif liegt unter ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} für ein Kind, unter ${h.eur(2 * h.P.absetzbetraege.kindermehrbetrag)} für zwei und so weiter. Gezählt werden die Kinder, für die Sie oder Ihr Partner mehr als sechs Monate Familienbeihilfe bekommen haben.</li>
<li><strong>Familienlage:</strong> Ihnen steht der ${h.a('alleinverdiener', 'Alleinverdiener- oder Alleinerzieherabsetzbetrag')} zu, oder auch Ihr Partner hat Einkünfte mit einer Tarifsteuer unter derselben Grenze. Im zweiten Fall erhält nur der Elternteil, der die Familienbeihilfe bezieht, den Kindermehrbetrag.</li>
</ol>
<h2>Einkommensgrenzen 2026</h2>
<p>Das ${h.src('bmfFamilienbonus', 'Finanzministerium')} rechnet die Steuergrenze in Einkommen um. Einkommen ist dabei nicht Ihr Brutto, sondern das Jahreseinkommen nach Sozialversicherung und Werbungskosten, ohne die mit festen Sätzen versteuerten Sonderzahlungen.</p>
${h.table(['Kinder', 'Steuergrenze', 'Einkommen 2026 bis'], h.P.absetzbetraege.kindermehrbetrag_einkommensgrenzen.map((g, i) => [String(i + 1), `unter ${h.eur((i + 1) * h.P.absetzbetraege.kindermehrbetrag)}`, h.eur(g)]), 'Einkommensgrenzen laut BMF für das Jahr 2026', ['l', 'r', 'r'])}
<h2>Beispiele aus dem Rechenmotor</h2>
<p>Die Tabelle zeigt für verschiedene Monatsgehälter, 14-mal im Jahr bezahlt, das Jahreseinkommen, die Tarifsteuer und den Kindermehrbetrag, der daraus folgt, wenn die übrigen Voraussetzungen erfüllt sind.</p>
${h.table(['Brutto pro Monat', 'Einkommen im Jahr', 'Tarifsteuer', 'mit 1 Kind', 'mit 2 Kindern'], F.map((f) => [h.eur(f.b), h.eur(f.einkommen), h.eur(f.est, 2), h.eur(f.k1, 2), h.eur(f.k2, 2)]), 'Laufende Bezüge ohne Pendlerpauschale; Kindermehrbetrag pro Jahr', ['l', 'r', 'r', 'r', 'r'])}
<p>Bei ${h.eur(1200)} brutto im Monat ist die Tarifsteuer null, der volle Betrag fließt: ${h.eur(f1200.k1)} für ein Kind. Danach sinkt der Kindermehrbetrag um jeden Euro Steuer. Bei ${h.eur(1800)} ist er für ein Kind schon aufgebraucht, für zwei Kinder bleiben ${h.eur(f1800.k2, 2)}. Ein Pendlerpauschale senkt das Einkommen und kann den Betrag deshalb erhöhen.</p>
<h2>Schritt für Schritt: Alleinerzieherin mit ${h.eur(1400)}</h2>
<p>Eine Alleinerzieherin arbeitet Teilzeit und verdient ${h.eur(1400)} brutto, 14-mal im Jahr. Von jedem laufenden Gehalt gehen ${h.eur(sv1400, 2)} Sozialversicherung ab. Zwölf laufende Bezüge nach Sozialversicherung, minus ${h.eur(h.P.tarif.werbungskostenpauschale)} Werbungskostenpauschale, ergeben ein Einkommen von ${h.eur(f1400.einkommen, 2)}. Die ersten ${h.eur(h.P.tarif.grenzen[0])} sind steuerfrei, der Rest kostet ${h.pct(h.P.tarif.saetze[1])}: Tarifsteuer ${h.eur(f1400.est, 2)}. Das liegt unter ${h.eur(h.P.absetzbetraege.kindermehrbetrag)}, also erstattet das Finanzamt ${h.eur(f1400.k1, 2)}. Urlaubs- und Weihnachtsgeld spielen keine Rolle, sie sind mit festen Sätzen besteuert. Hätte sie zwei Kinder, wären es ${h.eur(f1400.k2, 2)}.</p>
<p>Übersehen wird der Kindermehrbetrag vor allem in zwei Fällen: von Eltern, die wegen geringer Lohnsteuer glauben, eine Veranlagung lohne sich nicht, und von Paaren, bei denen beide in Teilzeit oder Karenz sind. Gerade im zweiten Fall bleiben beide oft unter der Steuergrenze, und die Familienbeihilfe beziehende Person hat Anspruch.</p>
<!--mini:kindermehrbetrag-->
<h2>Wie er ausbezahlt wird</h2>
<p>Im Lohnzettel taucht der Kindermehrbetrag nie auf. Er kommt erst mit dem Bescheid der Arbeitnehmerveranlagung, meist im Frühjahr oder Sommer des Folgejahres. Damit das Finanzamt ihn berücksichtigt, bestätigen Sie in der Erklärung, dass die Voraussetzungen vorliegen: im Formular L 1 unter Punkt 5.2. Wer nur steuerfreie Leistungen wie Kinderbetreuungsgeld bezogen hat und deshalb nie eine Veranlagung machen musste, sollte sie für den Kindermehrbetrag trotzdem abgeben.</p>
<h2>Warum der Arbeitgeber ihn nicht kennt</h2>
<p>Die Personalverrechnung sieht nur Ihr eigenes Gehalt und die Erklärungen, die Sie mit dem Formular E 30 abgegeben haben. Ob Ihr Partner ebenfalls unter der Steuergrenze bleibt, ob Sie im ganzen Jahr nur Kinderbetreuungsgeld bezogen haben oder an wie vielen Tagen Sie gearbeitet haben, weiß nur das Finanzamt. Deshalb läuft der Kindermehrbetrag ausschließlich über die Veranlagung, und zwar über die Erklärung des Elternteils, dem er zusteht. Wer auf die Abrechnung des Arbeitgebers wartet, wartet vergeblich.</p>
<h2>Kindermehrbetrag und andere Gutschriften</h2>
<p>Für Alleinerziehende mit kleinem Einkommen kommt meist mehr als ein Betrag zusammen. Der Alleinerzieherabsetzbetrag wird ebenfalls erstattet, wenn die Steuer unter null fällt; dazu kann die SV-Rückerstattung kommen. Der Kindermehrbetrag wird daneben eigenständig berechnet, weil er an der Steuer vor allen Absetzbeträgen ansetzt. Der Familienbonus selbst ist dagegen nie auszahlbar. Was der Familienbonus bei Ihrem Gehalt im Lohnzettel bewirkt, zeigt der ${h.a('familienbonus', 'Familienbonus-Plus-Rechner')}; wie Eltern ihn untereinander aufteilen, steht auf der Seite ${h.a('familienbonus-beantragen', 'Familienbonus beantragen')}.</p>
`,
  },
  en: {
    slug: 'child-tax-supplement',
    nav: 'Kindermehrbetrag (child supplement)',
    card: `Up to ${EN.eur(KMB)} per child paid out when your tax is too low to use Familienbonus Plus: conditions and examples.`,
    title: `Kindermehrbetrag 2026: Up to ${EN.eur(KMB)} per Child on Low Pay`,
    description: `Kindermehrbetrag 2026 in Austria: up to ${EN.eur(KMB)} per child when your scale tax is lower. Who qualifies, 2026 income limits and how your tax return pays it.`,
    h1: 'The Kindermehrbetrag: cash for parents who pay little tax',
    intro: 'When Familienbonus Plus is wasted because you pay almost no wage tax, the tax office pays out the gap up to a fixed amount per child.',
    resume: `The Kindermehrbetrag, literally “child extra amount”, is a refundable payment for parents on low incomes in Austria. If your income tax on the scale, before any credits, is below ${EN.eur(KMB)}, the tax office pays you the difference up to ${EN.eur(KMB)}, plus another ${EN.eur(KMB)} for each further child (section 33(7) of the Income Tax Act). You qualify if you are entitled to the sole earner or single parent credit, or if your partner also stays below that tax line; in the second case only the parent receiving family allowance gets it. You also need taxable income on at least ${TAGE} days of the year, or to have received only childcare allowance, maternity pay (Wochengeld) or care leave allowance all year. For one child the Finance Ministry puts the 2026 income limit at ${EN.eur(GR[0])}. A single parent earning ${EN.eur(1400)} gross a month has a scale tax of ${EN.eur(f1400.est, 2)} and receives ${EN.eur(f1400.k1, 2)}. It is only paid through the annual tax return, never on the payslip.`,
    faqs: [
      { q: 'How much is the Kindermehrbetrag with two children?', a: `The tax line doubles to ${EN.eur(2 * KMB)} and you receive the difference. At ${EN.eur(1800)} gross a month the scale tax is ${EN.eur(f1800.est, 2)}: one child brings ${EN.eur(f1800.k1, 2)}, two children ${EN.eur(f1800.k2, 2)}. The Finance Ministry gives the 2026 income limits as ${EN.eur(GR[1])} for two children and ${EN.eur(GR[2])} for three.` },
      { q: 'Is there a separate application for the Kindermehrbetrag?', a: 'There is no separate form, but there is a box. The tax office calculates the Kindermehrbetrag in your annual tax assessment once you confirm that you meet the conditions: point 5.2 on form L 1 for employees, point 4.2 on form E 1 for the income tax return. In FinanzOnline the question is part of the process. Your employer cannot pay it.' },
      { q: 'Can I get the Kindermehrbetrag if I only received childcare allowance all year?', a: `Yes, that is one of the main cases. If you received nothing but childcare allowance (Kinderbetreuungsgeld), maternity pay or care leave allowance for the whole calendar year, you meet the condition without ${TAGE} days of work. These benefits are tax-free, so your scale tax is zero and the full ${EN.eur(KMB)} per child is possible if you are a single parent or your partner also stays below the tax line.` },
      { q: 'Does a well-paid partner rule out the Kindermehrbetrag?', a: `Usually yes. With a partner there are only two routes: both of you have a scale tax below ${EN.eur(KMB)}, or one of you is the sole earner because the other has no more than ${EN.eur(A.avab_partner_einkuenfte_max)} of income a year, in which case the sole earner’s own tax decides. If the well-paid partner’s scale tax is ${EN.eur(KMB)} or more, both routes fail. That partner should then claim the whole Familienbonus Plus.` },
      { q: 'Which tax figure decides the Kindermehrbetrag?', a: `The tax on your annual income under the scale in section 33(1), before Familienbonus Plus, the transport credit and any other credits. Holiday and Christmas pay taxed at the fixed special rates do not count. Income means regular gross pay minus social insurance, work expenses of at least ${EN.eur(P.tarif.werbungskostenpauschale)} and any commuter allowance.` },
    ],
    body: (h) => `
<h2>Why the Kindermehrbetrag exists</h2>
<p>Familienbonus Plus, Austria’s child tax credit, reduces tax but never below zero. Low earners therefore get little or nothing from it. Those parents have the Kindermehrbetrag under ${h.src('estg33', 'section 33(7) of the Income Tax Act')}: the tax office pays out the difference between the scale tax and ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} per child. According to the government portal ${h.src('ogvKindermehrbetrag', 'oesterreich.gv.at')}, people with low income receive it instead of Familienbonus Plus under certain conditions, and it can only be granted through the annual tax assessment or income tax return.</p>
<h2>The three conditions</h2>
<ol>
<li><strong>Income or specific benefits:</strong> taxable employment or business income on at least ${TAGE} days of the calendar year, or nothing but childcare allowance, maternity pay or care leave allowance for the whole year.</li>
<li><strong>Low tax:</strong> your income tax on the scale is below ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} for one child, below ${h.eur(2 * h.P.absetzbetraege.kindermehrbetrag)} for two and so on. Children count if you or your partner received family allowance for them for more than six months.</li>
<li><strong>Family situation:</strong> you are entitled to the ${h.a('alleinverdiener', 'sole earner or single parent credit')}, or your partner’s own scale tax is also below the same line. In that second case only the parent receiving family allowance gets the Kindermehrbetrag.</li>
</ol>
<h2>Income limits for 2026</h2>
<p>The ${h.src('bmfFamilienbonus', 'Finance Ministry')} translates the tax line into income. Income here is not your gross pay but your annual income after social insurance and work expenses, without holiday and Christmas pay taxed at fixed rates.</p>
${h.table(['Children', 'Tax line', 'Income 2026 up to'], h.P.absetzbetraege.kindermehrbetrag_einkommensgrenzen.map((g, i) => [String(i + 1), `below ${h.eur((i + 1) * h.P.absetzbetraege.kindermehrbetrag)}`, h.eur(g)]), 'Income limits published by the Finance Ministry for 2026', ['l', 'r', 'r'])}
<h2>Worked examples</h2>
<p>For several monthly salaries paid 14 times a year, the table shows annual income, scale tax and the resulting Kindermehrbetrag, assuming the other conditions are met.</p>
${h.table(['Gross per month', 'Annual income', 'Scale tax', 'one child', 'two children'], F.map((f) => [h.eur(f.b), h.eur(f.einkommen), h.eur(f.est, 2), h.eur(f.k1, 2), h.eur(f.k2, 2)]), 'Regular pay without commuter allowance; Kindermehrbetrag per year', ['l', 'r', 'r', 'r', 'r'])}
<p>At ${h.eur(1200)} gross a month the scale tax is zero and the full amount is paid: ${h.eur(f1200.k1)} for one child. Above that, every euro of tax reduces the supplement by a euro. At ${h.eur(1800)} it is used up for one child, while two children still bring ${h.eur(f1800.k2, 2)}. A commuter allowance lowers income and can therefore raise the payment.</p>
<h2>Step by step: a single parent on ${h.eur(1400)}</h2>
<p>A single mother works part-time for ${h.eur(1400)} gross, paid 14 times a year. Each regular salary loses ${h.eur(sv1400, 2)} to social insurance. Twelve regular salaries after social insurance, minus the ${h.eur(h.P.tarif.werbungskostenpauschale)} flat work-expense deduction, give income of ${h.eur(f1400.einkommen, 2)}. The first ${h.eur(h.P.tarif.grenzen[0])} are tax-free and the rest is taxed at ${h.pct(h.P.tarif.saetze[1])}: scale tax ${h.eur(f1400.est, 2)}. That is below ${h.eur(h.P.absetzbetraege.kindermehrbetrag)}, so the tax office pays ${h.eur(f1400.k1, 2)}. Holiday and Christmas pay play no part because they are taxed at fixed rates. With two children she would receive ${h.eur(f1400.k2, 2)}.</p>
<!--mini:kindermehrbetrag-->
<h2>How it is paid</h2>
<p>You will never see the Kindermehrbetrag on a payslip. It arrives with the assessment notice for your annual tax return, usually in the spring or summer of the following year. Confirm in the return that you meet the conditions, at point 5.2 of form L 1. If you received only tax-free benefits such as childcare allowance and were never required to file, file anyway to get it.</p>
<h2>How it combines with other payments</h2>
<p>Single parents on low pay often receive more than one amount. The single parent credit is also refunded when tax drops below zero, and a social insurance refund may be added. The Kindermehrbetrag is calculated separately on top, because it starts from the tax before any credits. Familienbonus Plus itself is never paid out in cash. To see what Familienbonus Plus does on your payslip, use the ${h.a('familienbonus', 'Familienbonus Plus calculator')}; how parents share it is explained on ${h.a('familienbonus-beantragen', 'claiming Familienbonus Plus')}.</p>
`,
  },
});
