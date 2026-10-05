import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const A = P.absetzbetraege;
const FB = A.familienbonus_monat_u18, FB18 = A.familienbonus_monat_ue18, ALTER = A.familienbonus_altersgrenze, RJ = A.familienbonus_rueckziehung_jahre;
/** Paar mit einem Kind: Mutter 1.500 € brutto (keine Lohnsteuer), Vater 3.000 €. Alles aus dem Motor. */
const mutter = kurz(1500), vater = kurz(3000);
const mutterHalb = kurz(1500, { kinderU18: 1, fbGeteilt: true }).nettoMonat - mutter.nettoMonat;
const vaterGanz = kurz(3000, { kinderU18: 1 }).nettoMonat - vater.nettoMonat;
const vaterHalb = kurz(3000, { kinderU18: 1, fbGeteilt: true }).nettoMonat - vater.nettoMonat;
const verlustJahr = (vaterGanz - vaterHalb - mutterHalb) * 12;
/** Alleinverdienende Person mit 2.000 € und zwei Kindern unter 18: wie viel vom Bonus im Lohnzettel wirkt. */
const zwei = kurz(2000), zweiFb = kurz(2000, { kinderU18: 2 }).nettoMonat - zwei.nettoMonat;

export default defineGuide({
  id: 'familienbonus-beantragen',
  group: 'absetz',
  order: 20,
  mini: 'familienbonusAntrag',
  miniHref: 'familienbonus',
  related: ['familienbonus', 'kindermehrbetrag', 'unterhaltsabsetzbetrag', 'alleinverdiener', 'arbeitnehmerveranlagung'],
  sources: ['bmfFamilienbonus', 'estg33'],
  de: {
    slug: 'familienbonus-plus-beantragen',
    nav: 'Familienbonus beantragen',
    card: 'Formular E 30 beim Arbeitgeber oder Beilage L 1k in der Veranlagung: ganz oder halb, getrennte Eltern, Kind ab 18.',
    title: 'Familienbonus Plus beantragen 2026: E 30, L 1k, Aufteilung',
    description: `Familienbonus Plus beantragen 2026: mit E 30 beim Arbeitgeber oder L 1k in der Veranlagung, ganz oder halb, ${DE.eur(FB * 12)} je Kind, getrennte Eltern und ab ${ALTER} Jahren.`,
    h1: 'Familienbonus Plus beantragen: Formular, Aufteilung, Fristen',
    intro: 'Wer den Familienbonus wo beantragt, wann die Aufteilung zwischen den Eltern Geld kostet und was bei Trennung oder Volljährigkeit zu tun ist.',
    resume: `Den Familienbonus Plus beantragen Sie entweder laufend beim Arbeitgeber mit dem Formular E 30 oder nachträglich in der Arbeitnehmerveranlagung, über FinanzOnline oder auf Papier mit der Beilage L 1k für jedes Kind. Er beträgt ${DE.eur(FB, 2)} im Monat je Kind bis zum Monat des ${ALTER}. Geburtstags und danach ${DE.eur(FB18, 2)}, solange Familienbeihilfe bezogen wird. Antragsberechtigt sind die Person, die die Familienbeihilfe bezieht, und ihr Partner oder bei getrennten Eltern der Elternteil, der den Unterhalt zahlt. Beide zusammen bekommen je Kind höchstens einen ganzen Bonus: einer ganz, oder jeder die Hälfte. Beantragen beide zu viel, erhält jeder nur die Hälfte. Weil der Bonus höchstens die eigene Tarifsteuer auf null senkt, geht bei der Teilung Geld verloren, wenn ein Elternteil wenig verdient: Im Beispiel mit ${DE.eur(1500)} und ${DE.eur(3000)} brutto sind es ${DE.eur(verlustJahr)} im Jahr. Wer in der Veranlagung den Bonus nicht erneut einträgt, muss nachzahlen. Ein Antrag kann bis ${RJ} Jahre nach Rechtskraft des Bescheids zurückgezogen werden.`,
    faqs: [
      { q: 'Muss ich den Familienbonus Plus in der Arbeitnehmerveranlagung noch einmal beantragen?', a: 'Ja. Auch wenn der Arbeitgeber den Familienbonus Plus schon das ganze Jahr im Lohnzettel abgezogen hat, müssen Sie ihn in der Arbeitnehmerveranlagung erneut eintragen, in FinanzOnline oder mit der Beilage L 1k. Sonst rechnet das Finanzamt ohne Bonus und es kommt zu einer ungewollten Nachzahlung. In der Veranlagung dürfen Sie auch eine andere Aufteilung wählen als beim Arbeitgeber, so steht es auf der Seite des Finanzministeriums.' },
      { q: 'Wann beantragt man den Familienbonus besser ganz statt halb?', a: `Wenn ein Elternteil so wenig Lohnsteuer zahlt, dass er seine Hälfte nicht ausschöpfen kann. Bei ${DE.eur(1500)} brutto fällt keine Lohnsteuer an, die halbe Bonushälfte bringt dort ${DE.eur(mutterHalb, 2)} im Monat. Beantragt der andere Elternteil mit ${DE.eur(3000)} den ganzen Bonus, wirken ${DE.eur(vaterGanz, 2)} statt ${DE.eur(vaterHalb, 2)}. Die Aufteilung muss bei gleichbleibenden Verhältnissen für das ganze Jahr einheitlich sein.` },
      { q: 'Was passiert mit dem Familienbonus Plus, wenn das Kind 18 wird?', a: `Bis zum Ende des Monats, in dem das Kind ${ALTER} wird, gibt es ${DE.eur(FB, 2)} im Monat, danach ${DE.eur(FB18, 2)}, solange Familienbeihilfe bezogen wird. Der Arbeitgeber muss die Berücksichtigung mit dem Geburtstag einstellen. Für den reduzierten Betrag geben Sie ihm ein neues Formular E 30 mit dem Nachweis über die Familienbeihilfe. Fällt die Familienbeihilfe weg, endet auch der Bonus.` },
      { q: 'Welche Unterlagen braucht der Arbeitgeber für den Familienbonus-Antrag mit E 30?', a: 'Das ausgefüllte und unterschriebene Formular E 30 und Nachweise über den Bezug der Familienbeihilfe; wer als getrennter Elternteil beantragt, legt Nachweise über die Unterhaltsleistung bei. Bei einem Jobwechsel geben Sie das Formular auch dem neuen Arbeitgeber. Ändern sich die Verhältnisse, etwa durch Trennung, Wechsel der Beihilfenbezieherin oder Wegfall der Familienbeihilfe, melden Sie das mit dem Formular E 31.' },
      { q: 'Kann ich einen Familienbonus-Antrag später zurückziehen?', a: `Ja, bis ${RJ} Jahre nach Rechtskraft des Bescheids (§ 33 Abs. 3a Z 3 lit. e EStG). Das Zurückziehen wirkt als rückwirkendes Ereignis für Sie und für den anderen Elternteil; dessen Bescheid kann geändert werden, und er darf dann den ganzen Bonus beantragen. Das ist der Weg, wenn sich nachträglich zeigt, dass eine Teilung Geld gekostet hat.` },
      { q: 'Warum fragt das Finanzamt beim Familienbonus nach der Sozialversicherungsnummer des Kindes?', a: 'Weil das Gesetz es verlangt: In der Steuererklärung ist für jedes Kind, für das der Familienbonus Plus beantragt wird, die österreichische Sozialversicherungsnummer oder die Kennnummer der Europäischen Krankenversicherungskarte anzugeben (§ 33 Abs. 3a Z 6 EStG). Damit prüft das Finanzamt, dass für dasselbe Kind insgesamt nicht mehr als ein ganzer Bonus berücksichtigt wird. Lebt das Kind in einem anderen EU-Staat, nutzen Sie die Kennnummer der dortigen Karte.' },
    ],
    body: (h) => `
<h2>Zwei Wege zum Familienbonus</h2>
<p>Der Familienbonus Plus ist ein Absetzbetrag nach ${h.src('estg33', '§ 33 Abs. 3a EStG')} und wird nie automatisch gewährt. Sie haben zwei Wege, die sich nicht ausschließen:</p>
<ul>
<li><strong>Beim Arbeitgeber, mit dem Formular E 30:</strong> Der Bonus senkt dann jeden Monat die Lohnsteuer. Sie haben das Geld sofort, nicht erst im Folgejahr.</li>
<li><strong>In der Arbeitnehmerveranlagung:</strong> über FinanzOnline oder auf Papier mit der Beilage L 1k, eine Beilage je Kind. Wenn sich die Familienverhältnisse im Jahr geändert haben, verwenden Sie stattdessen die Beilage L 1k-bF, die eine Betrachtung Monat für Monat erlaubt.</li>
</ul>
<p>Wichtig ist die Verbindung der beiden Wege: Wer den Bonus beim Arbeitgeber hatte und eine Veranlagung abgibt, muss ihn dort noch einmal eintragen. Das ${h.src('bmfFamilienbonus', 'Finanzministerium')} warnt ausdrücklich vor der ungewollten Nachzahlung, wenn das vergessen wird.</p>
<h2>Wer antragsberechtigt ist</h2>
<p>Den Bonus gibt es nur für ein Kind, für das österreichische Familienbeihilfe bezogen wird und das sich ständig in der EU, im EWR oder in der Schweiz aufhält. Eine Ausgleichs- oder Differenzzahlung des Finanzamts gilt als Bezug von Familienbeihilfe. Beantragen dürfen zwei Personen: wer die Familienbeihilfe bezieht und entweder deren Ehe- oder Lebenspartner oder, bei getrennten Eltern, der Elternteil, der gesetzlichen Unterhalt zahlt und dem der ${h.a('unterhaltsabsetzbetrag', 'Unterhaltsabsetzbetrag')} zusteht. Als Partner zählt, wer verheiratet ist, in eingetragener Partnerschaft oder mehr als sechs Monate im Jahr in Lebensgemeinschaft lebt.</p>
<h2>Ganz oder halb: die Aufteilung</h2>
<p>Je Kind gibt es höchstens einen ganzen Bonus von ${h.eur(h.P.absetzbetraege.familienbonus_monat_u18, 2)} im Monat. Es gibt drei Varianten: Die beihilfenbeziehende Person beantragt alles, der andere Elternteil beantragt alles, oder beide beantragen je die Hälfte. Beantragen beide zusammen mehr als einen ganzen Bonus, berücksichtigt das Finanzamt bei jedem die Hälfte.</p>
<p>Die Wahl ist keine Formsache. Der Bonus kann die Steuer nur bis null senken, ein ungenutzter Rest verfällt. Ein Beispiel aus unserem Rechenmotor mit einem Kind unter ${ALTER}:</p>
${h.table(['Variante', 'Elternteil mit ' + h.eur(1500), 'Elternteil mit ' + h.eur(3000), 'Summe pro Monat'], [
  ['je die Hälfte', h.eur(mutterHalb, 2), h.eur(vaterHalb, 2), h.eur(mutterHalb + vaterHalb, 2)],
  ['ganz beim besser Verdienenden', h.eur(0, 2), h.eur(vaterGanz, 2), h.eur(vaterGanz, 2)],
], 'Mehr netto im Monat durch den Familienbonus Plus, Bruttobezüge 14-mal im Jahr', ['l', 'r', 'r', 'r'])}
<p>Bei ${h.eur(1500)} brutto fällt keine Lohnsteuer an; die halbe Bonushälfte geht dort ins Leere. Die Teilung kostet die Familie ${h.eur(verlustJahr)} im Jahr. Dasselbe gilt für eine Person mit ${h.eur(2000)} brutto und zwei Kindern: Von ${h.eur(2 * h.P.absetzbetraege.familienbonus_monat_u18, 2)} Bonus wirken im Lohnzettel nur ${h.eur(zweiFb, 2)}, weil die Lohnsteuer nicht höher ist. Liegt die Steuer beider Eltern niedrig, lohnt ein Blick auf den ${h.a('kindermehrbetrag', 'Kindermehrbetrag')}, der dann statt des Bonus erstattet werden kann.</p>
<!--mini:familienbonusAntrag-->
<h2>Getrennte Eltern</h2>
<p>Zahlt ein Elternteil Unterhalt für ein Kind, das nicht in seinem Haushalt lebt, kann er den Bonus ganz oder zur Hälfte beantragen, aber nur für die Monate, in denen er den Unterhalt voll geleistet hat und ihm der Unterhaltsabsetzbetrag zusteht. Wurde das ganze Jahr kein Unterhalt gezahlt, steht ihm kein Bonus zu; die beihilfenbeziehende Person kann dann den ganzen Bonus beantragen oder ihn mit einem neuen Partner teilen. Nachzahlungen von Unterhalt zählen im Jahr der Zahlung und tilgen zuerst die älteste offene Schuld dieses Jahres. Wurde der Unterhalt nicht vollständig erfüllt, ist die Beilage L 1k-bF zu verwenden. Naturalunterhalt zählt ebenfalls, muss aber auf Verlangen schriftlich belegt werden.</p>
<h2>Änderungen im Laufe des Jahres</h2>
<p>Zieht ein Paar zusammen, heiratet, trennt sich oder stirbt ein Partner, ist die Beilage L 1k-bF das richtige Formular, weil der Bonus dann Monat für Monat zugeordnet wird. Beim Arbeitgeber melden Sie solche Änderungen mit dem Formular E 31. Ab dem Geburtsmonat des Kindes kann der Bonus beantragt werden; im Geburtsjahr gibt es ihn also nur für die Monate ab der Geburt. Bei einem Jobwechsel gehört das Formular E 30 auch zum neuen Arbeitgeber, sonst fehlt der Bonus ab dem ersten Gehalt dort.</p>
<h2>Zurückziehen bis ${RJ} Jahre</h2>
<p>Hat sich eine Aufteilung im Nachhinein als ungünstig erwiesen, lässt sich das korrigieren. Ein Antrag kann bis ${RJ} Jahre nach Rechtskraft des Bescheids zurückgezogen werden; das gilt für beide Eltern als rückwirkendes Ereignis, und der andere Elternteil darf danach den ganzen Bonus beantragen. Wie viel der Bonus bei Ihrem Gehalt netto bringt, rechnet der ${h.a('familienbonus', 'Familienbonus-Plus-Rechner')} mit beiden Varianten durch.</p>
`,
  },
  en: {
    slug: 'familienbonus-plus-claim',
    nav: 'Claiming Familienbonus Plus',
    card: 'Form E 30 via your employer or L 1k in the tax return: full or half share, separated parents, children over 18.',
    title: 'Familienbonus Plus 2026: How to Claim with E 30 and L 1k',
    description: `Claiming Familienbonus Plus in 2026: form E 30 via your employer or L 1k in your tax return, full or half share, ${EN.eur(FB * 12)} per child, separated parents and age ${ALTER}.`,
    h1: 'How to claim Familienbonus Plus: forms, splitting, deadlines',
    intro: 'Who claims Austria’s child tax credit where, when splitting it between parents costs money, and what to do after a separation or an 18th birthday.',
    resume: `You claim Familienbonus Plus, Austria’s child tax credit, either through your employer with form E 30, so it lowers wage tax every month, or afterwards in the annual employee tax assessment (Arbeitnehmerveranlagung), online via FinanzOnline or on paper with one L 1k schedule per child. It is worth ${EN.eur(FB, 2)} a month per child until the month of the ${ALTER}th birthday and ${EN.eur(FB18, 2)} after that, as long as family allowance (Familienbeihilfe) is paid. Two people may claim: the parent receiving family allowance and their partner, or, for separated parents, the parent paying child maintenance. Together they get at most one full credit per child, either one claims all of it or each takes half; if both claim too much, each gets half. Because the credit can only reduce your own tax to zero, splitting loses money when one parent earns little: with ${EN.eur(1500)} and ${EN.eur(3000)} gross salaries the loss is ${EN.eur(verlustJahr)} a year. Leave it out of your tax return and you will be asked to pay it back. A claim can be withdrawn up to ${RJ} years after the assessment becomes final.`,
    faqs: [
      { q: 'If payroll already applies Familienbonus Plus, must I claim it again in my tax return?', a: 'Yes. Even if your employer deducted Familienbonus Plus all year, you have to enter it again when you file your annual tax assessment, in FinanzOnline or on schedule L 1k. Otherwise the tax office calculates without it and you face an unexpected bill. The Finance Ministry also allows a different split in the tax return from the one you gave your employer.' },
      { q: 'When should one parent claim the full Familienbonus instead of half each?', a: `When the other parent pays too little wage tax to use their half. At ${EN.eur(1500)} gross there is no wage tax, so a half credit is worth ${EN.eur(mutterHalb, 2)} a month there. If the parent earning ${EN.eur(3000)} claims the whole credit, ${EN.eur(vaterGanz, 2)} take effect instead of ${EN.eur(vaterHalb, 2)}. The split must be the same for the whole year unless your family situation changes.` },
      { q: 'What happens to my Familienbonus Plus claim when my child turns 18?', a: `Up to the end of the month in which the child turns ${ALTER} the credit is ${EN.eur(FB, 2)} a month, afterwards ${EN.eur(FB18, 2)}, provided family allowance continues. Your employer must stop applying it at the birthday. For the reduced amount, hand in a new form E 30 together with proof of family allowance. When family allowance ends, the credit ends with it.` },
      { q: 'What does my employer need with form E 30 for Familienbonus Plus?', a: 'The completed and signed form E 30 plus proof that family allowance is paid; a separated parent claiming as maintenance payer adds proof of the maintenance payments. When you change jobs, give the form to the new employer as well. If your situation changes, for instance separation, a switch of the parent receiving family allowance or loss of the allowance, report it on form E 31.' },
      { q: 'Can I withdraw a Familienbonus Plus claim later?', a: `Yes, up to ${RJ} years after the tax assessment becomes final (section 33(3a)(3)(e) of the Income Tax Act). Withdrawal counts as a retroactive event for you and for the other parent, whose assessment can be reopened; the other parent may then claim the full credit. This is the fix when a 50/50 split turns out to have wasted money.` },
      { q: 'Why does the tax office ask for my child’s social security number for Familienbonus Plus?', a: 'Because the law requires it: for every child you claim Familienbonus Plus for, the return must show the Austrian social security number or the personal number on the European Health Insurance Card (section 33(3a)(6)). It lets the tax office check that no child is credited more than once in total. If your child lives in another EU country, use the number on that country’s card.' },
    ],
    body: (h) => `
<h2>Two ways to claim</h2>
<p>Familienbonus Plus is a tax credit under ${h.src('estg33', 'section 33(3a) of the Income Tax Act')}, and nobody gets it automatically. There are two routes, and you can use both:</p>
<ul>
<li><strong>Through your employer with form E 30:</strong> the credit then reduces wage tax on every payslip, so you have the money straight away rather than a year later.</li>
<li><strong>In the annual tax assessment:</strong> online through FinanzOnline, the tax office portal, or on paper with schedule L 1k, one per child. If your family situation changed during the year, use schedule L 1k-bF instead, which assigns the credit month by month.</li>
</ul>
<p>The two routes are linked. If payroll applied the credit and you then file a return, you must claim it there again. The ${h.src('bmfFamilienbonus', 'Finance Ministry')} explicitly warns of an unwanted back payment otherwise.</p>
<h2>Who may claim</h2>
<p>The credit exists only for a child who receives Austrian family allowance and lives permanently in the EU, the EEA or Switzerland. A top-up payment from the Austrian tax office for a child living abroad (Ausgleichs- or Differenzzahlung) counts as family allowance. Two people may claim: the person receiving family allowance and either their spouse or partner or, for separated parents, the parent who pays statutory child maintenance and qualifies for the ${h.a('unterhaltsabsetzbetrag', 'child maintenance credit')}. A partner means a spouse, a registered partner or someone living with the recipient for more than six months of the year.</p>
<h2>Full or half: splitting the credit</h2>
<p>Each child carries at most one full credit of ${h.eur(h.P.absetzbetraege.familienbonus_monat_u18, 2)} a month. The options are: the allowance recipient claims all of it, the other parent claims all of it, or both claim half. If the two claims add up to more than one full credit, the tax office gives each of you half.</p>
<p>The choice matters in euros. The credit can only bring tax down to zero, and any unused part is lost. An example from our engine with one child under ${ALTER}:</p>
${h.table(['Option', 'Parent on ' + h.eur(1500), 'Parent on ' + h.eur(3000), 'Total per month'], [
  ['half each', h.eur(mutterHalb, 2), h.eur(vaterHalb, 2), h.eur(mutterHalb + vaterHalb, 2)],
  ['all to the higher earner', h.eur(0, 2), h.eur(vaterGanz, 2), h.eur(vaterGanz, 2)],
], 'Extra net pay per month from Familienbonus Plus, salaries paid 14 times a year', ['l', 'r', 'r', 'r'])}
<p>At ${h.eur(1500)} gross no wage tax is due, so half the credit evaporates there. Splitting costs this family ${h.eur(verlustJahr)} a year. The same happens to a single earner on ${h.eur(2000)} with two children: of ${h.eur(2 * h.P.absetzbetraege.familienbonus_monat_u18, 2)} of credit, only ${h.eur(zweiFb, 2)} works on the payslip because the wage tax is no higher. If both parents pay little tax, look at the ${h.a('kindermehrbetrag', 'Kindermehrbetrag')}, a refundable amount that can replace the credit.</p>
<!--mini:familienbonusAntrag-->
<h2>Separated parents</h2>
<p>A parent paying maintenance for a child who does not live with them can claim all or half of the credit, but only for months in which maintenance was paid in full and the maintenance credit applies. If no maintenance at all was paid during the year, that parent gets no credit; the parent receiving family allowance may then claim it in full or share it with a new partner. Late maintenance payments count in the year they are paid and clear the oldest open month of that year first. Where maintenance was not fully paid, use schedule L 1k-bF. Maintenance in kind counts too, but you must be able to prove it in writing on request.</p>
<h2>Changes during the year</h2>
<p>Moving in together, marrying, separating or the death of a partner all call for schedule L 1k-bF, because the credit is then assigned month by month. On the payroll side you report such changes with form E 31. You can claim from the month the child is born, so in the year of birth only the months from birth onwards count. When you change jobs, form E 30 must go to the new employer too, or your first payslips there will lack the credit.</p>
<h2>Withdrawing a claim within ${RJ} years</h2>
<p>A split that turned out badly can be repaired. You may withdraw a claim up to ${RJ} years after the assessment becomes final; it counts as a retroactive event for both parents, and the other parent can then claim the full credit. To see what the credit adds to your own pay in both variants, use the ${h.a('familienbonus', 'Familienbonus Plus calculator')}.</p>
`,
  },
});
