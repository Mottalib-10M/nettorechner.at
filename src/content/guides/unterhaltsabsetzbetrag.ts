import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const U = P.absetzbetraege.unterhaltsabsetzbetrag;
const A = P.absetzbetraege;
/** Monatlicher Absetzbetrag für n Kinder: erstes, zweites, jedes weitere. */
const monat = (n: number) => Array.from({ length: n }, (_, i) => U[Math.min(i, 2)]).reduce((s, x) => s + x, 0);
/** Beispiel Teilzahlung: 300 € Unterhalt im Monat vereinbart, im Jahr nur 3.000 € gezahlt. */
const RATE = 300, GEZAHLT = 3000;
const volleMonate = Math.min(12, Math.floor(GEZAHLT / RATE));
/** Familienbonus beim Unterhaltszahler mit 3.000 € brutto: ganz oder halb (Motor). */
const z = kurz(3000), fbGanz = kurz(3000, { kinderU18: 1 }).nettoMonat - z.nettoMonat, fbHalb = kurz(3000, { kinderU18: 1, fbGeteilt: true }).nettoMonat - z.nettoMonat;
const lstNachFb = kurz(3000, { kinderU18: 1 }).lstMonat;

export default defineGuide({
  id: 'unterhaltsabsetzbetrag',
  group: 'absetz',
  order: 60,
  mini: 'unterhalt',
  miniHref: 'familienbonus',
  related: ['familienbonus-beantragen', 'familienbonus', 'alleinverdiener', 'arbeitnehmerveranlagung', 'lohnsteuer'],
  sources: ['estg33', 'bmfUnterhalt', 'bmfFamilienbonus'],
  de: {
    slug: 'unterhaltsabsetzbetrag',
    nav: 'Unterhaltsabsetzbetrag',
    card: `${DE.eur(U[0])}, ${DE.eur(U[1])} oder ${DE.eur(U[2])} im Monat je Kind für Eltern, die Alimente zahlen, und was das für den Familienbonus heißt.`,
    title: 'Unterhaltsabsetzbetrag 2026: was Alimente-Zahler absetzen',
    description: `Unterhaltsabsetzbetrag 2026: ${DE.eur(U[0])}, ${DE.eur(U[1])} und ${DE.eur(U[2])} im Monat je Kind, nur für voll bezahlte Monate. Voraussetzungen, Teilzahlungen, Familienbonus Plus für Zahler.`,
    h1: 'Der Unterhaltsabsetzbetrag für Eltern, die Alimente zahlen',
    intro: 'Was getrennt lebende Eltern für den gezahlten Kindesunterhalt von der Steuer abziehen dürfen und warum jeder nicht voll bezahlte Monat zählt.',
    resume: `Der Unterhaltsabsetzbetrag steht Eltern zu, die für ein Kind außerhalb ihres Haushalts den gesetzlichen Unterhalt zahlen. Er beträgt 2026 ${DE.eur(U[0])} im Monat für das erste Kind, ${DE.eur(U[1])} für das zweite und ${DE.eur(U[2])} für jedes weitere (§ 33 Abs. 4 Z 3 EStG). Bei zwei Kindern sind das ${DE.eur(monat(2) * 12)} im Jahr. Voraussetzung ist, dass weder der Zahler noch sein im Haushalt lebender Partner für das Kind Familienbeihilfe bezieht und dass das Kind in der EU, im EWR oder in der Schweiz lebt. Es zählen nur Monate, für die der Unterhalt rechnerisch voll bezahlt wurde: Wer ${DE.eur(RATE)} im Monat schuldet und im Jahr ${DE.eur(GEZAHLT)} zahlt, bekommt den Betrag für ${volleMonate} Monate. Der Absetzbetrag wirkt erst in der Arbeitnehmerveranlagung und wird nicht als Negativsteuer ausbezahlt. Er ist zugleich der Schlüssel zum Familienbonus Plus: Der Unterhaltszahler kann den Bonus ganz oder halb beantragen, aber nur für die Monate, in denen ihm der Unterhaltsabsetzbetrag zusteht.`,
    faqs: [
      { q: 'Bekomme ich den Unterhaltsabsetzbetrag, wenn ich die Alimente nur teilweise gezahlt habe?', a: `Nur für die Monate, die rechnerisch voll gedeckt sind. Wer ${DE.eur(RATE)} im Monat schuldet und im Jahr ${DE.eur(GEZAHLT)} überweist, hat ${volleMonate} volle Monate erfüllt und bekommt ${DE.eur(U[0] * volleMonate)} statt ${DE.eur(U[0] * 12)} für ein Kind. Die Zahlungen tilgen zuerst den am weitesten zurückliegenden Monat. Für Monate ohne Absetzbetrag gibt es dann auch keinen Familienbonus Plus beim Zahler.` },
      { q: 'Zählen Unterhaltsnachzahlungen für den Unterhaltsabsetzbetrag im Vorjahr?', a: 'Nein. Nachzahlungen werden ausschließlich im Kalenderjahr der Zahlung berücksichtigt (§ 33 Abs. 4 Z 3 lit. e EStG). Wer im März Rückstände aus dem Vorjahr begleicht, kann damit im Vorjahr keine Monate mehr auffüllen. Im Zahlungsjahr tilgt das Geld die älteste offene Verpflichtung dieses Jahres. Rückstände möglichst noch vor Jahresende zu begleichen, sichert deshalb den Absetzbetrag für das laufende Jahr.' },
      { q: 'Gibt es den Unterhaltsabsetzbetrag für ein volljähriges Kind?', a: 'Nur, wenn für das Kind noch Familienbeihilfe bezogen wird, typischerweise beim anderen Elternteil während einer Ausbildung. Das Finanzministerium hält fest: Für volljährige Kinder, für die keine Familienbeihilfe ausbezahlt wird, steht kein Unterhaltsabsetzbetrag zu. Zahlen Sie für ein studierendes Kind weiterhin Unterhalt und läuft die Beihilfe, bleibt der Absetzbetrag; endet sie, endet auch er.' },
      { q: 'Kann der Unterhaltszahler den Familienbonus Plus beim Arbeitgeber beantragen?', a: `Ja, mit dem Formular E 30 und Nachweisen über die Unterhaltszahlungen. Bei ${DE.eur(3000)} brutto bringt der ganze Bonus für ein Kind unter ${A.familienbonus_altersgrenze} ${DE.eur(fbGanz, 2)} netto mehr im Monat, der halbe ${DE.eur(fbHalb, 2)}. Wie aufgeteilt wird, stimmen Sie mit dem Elternteil ab, der die Familienbeihilfe bezieht. Den Unterhaltsabsetzbetrag selbst berücksichtigt der Arbeitgeber dagegen nicht, er kommt erst mit der Veranlagung.` },
      { q: 'Was gilt beim Unterhaltsabsetzbetrag, wenn das Kind außerhalb der EU lebt?', a: 'Dann gibt es keinen Unterhaltsabsetzbetrag, denn er ist auf Kinder in der EU, im EWR und in der Schweiz beschränkt. Für ein nicht haushaltszugehöriges Kind in einem anderen Staat kann der Zahler stattdessen die Hälfte des angemessenen Unterhalts als außergewöhnliche Belastung geltend machen, so das Finanzministerium. Den Familienbonus Plus gibt es für ein solches Kind ebenfalls nicht.' },
    ],
    body: (h) => `
<h2>Wer den Unterhaltsabsetzbetrag bekommt</h2>
<p>Getrennt lebende Eltern teilen sich die Kosten eines Kindes: Der eine Elternteil hat das Kind im Haushalt und bezieht die Familienbeihilfe, der andere zahlt Unterhalt. Für diesen zweiten Elternteil gibt es den Unterhaltsabsetzbetrag nach ${h.src('estg33', '§ 33 Abs. 4 Z 3 EStG')}. Er setzt voraus:</p>
<ul>
<li>Sie leisten für das Kind den gesetzlichen Unterhalt, nachweisbar, in Geld oder als Naturalunterhalt.</li>
<li>Das Kind gehört nicht zu Ihrem Haushalt.</li>
<li>Weder Ihnen noch Ihrem nicht dauernd getrennt lebenden Partner wird für das Kind Familienbeihilfe gewährt.</li>
<li>Das Kind lebt ständig in der EU, im EWR oder in der Schweiz.</li>
</ul>
<p>Erfüllen mehrere Personen für dasselbe Kind die Voraussetzungen, steht der Absetzbetrag nur einmal zu.</p>
<h2>Die Beträge 2026</h2>
${h.table(['Kinder mit Unterhalt', 'pro Monat', 'im Jahr bei voller Zahlung'], [1, 2, 3, 4].map((n) => [String(n), h.eur(monat(n)), h.eur(monat(n) * 12)]), `Unterhaltsabsetzbetrag 2026: ${h.eur(U[0])} für das erste, ${h.eur(U[1])} für das zweite, ${h.eur(U[2])} für jedes weitere Kind`, ['l', 'r', 'r'])}
<p>Die Beträge steigen jedes Jahr mit zwei Dritteln der Inflationsrate; die Werte früherer Jahre stehen beim ${h.src('bmfUnterhalt', 'Finanzministerium')}. Es kommt nicht darauf an, wie hoch der Unterhalt ist: Wer mehr zahlt als vorgeschrieben, bekommt keinen höheren Absetzbetrag.</p>
<h2>Nur volle Monate zählen</h2>
<p>Das Gesetz rechnet streng: Wird die Unterhaltspflicht im Jahr nicht zur Gänze erfüllt, steht der Absetzbetrag nur für jene Monate zu, für die rechnerisch der volle Unterhalt bezahlt wurde. Jede Zahlung tilgt zuerst den am weitesten zurückliegenden offenen Monat. Ein Beispiel: Vorgeschrieben sind ${h.eur(RATE)} im Monat, gezahlt wurden im Jahr ${h.eur(GEZAHLT)}. Das deckt ${volleMonate} volle Monate. Für ein Kind gibt es ${h.eur(U[0] * volleMonate)} statt ${h.eur(U[0] * 12)}.</p>
<p>Nachzahlungen zählen ausschließlich im Jahr, in dem sie fließen. Wer Rückstände aus dem Vorjahr im Frühling begleicht, verbessert damit nicht den Bescheid des Vorjahres. Gibt es weder eine behördliche Festsetzung noch einen schriftlichen Vertrag noch eine schriftliche Bestätigung des anderen Elternteils, zieht das Finanzamt laut ${h.src('bmfFamilienbonus', 'BMF')} die Durchschnittsbedarfssätze als Maßstab heran. Eine schriftliche Vereinbarung erspart daher Diskussionen.</p>
<!--mini:unterhalt-->
<h2>Wann und wie er wirkt</h2>
<p>Anders als der Familienbonus Plus wird der Unterhaltsabsetzbetrag nicht im Lohnzettel berücksichtigt. Er wirkt erst im Nachhinein, wenn Sie die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} abgeben; dort tragen Sie Kinder, Zeitraum und Höhe der Zahlungen ein. Er senkt eine vorhandene Steuer, wird aber nicht ausbezahlt, wenn Ihre Steuer schon null ist: § 33 Abs. 8 EStG nennt bei der Erstattung nur den Alleinverdiener- und den Alleinerzieherabsetzbetrag sowie die SV-Rückerstattung. Wer gut verdient, merkt ihn voll; bei ${h.eur(3000)} brutto liegt die Lohnsteuer selbst nach dem ganzen Familienbonus noch bei ${h.eur(lstNachFb, 2)} im Monat, genug für den Absetzbetrag eines Kindes.</p>
<h2>Was Sie für die Veranlagung bereithalten</h2>
<p>Das Finanzamt fragt beim Unterhaltsabsetzbetrag nach, wenn die Angaben nicht zusammenpassen. Halten Sie deshalb drei Dinge griffbereit: die Grundlage der Unterhaltspflicht, also Beschluss, Vergleich oder schriftliche Vereinbarung mit der monatlichen Höhe; die Zahlungsbelege für jeden Monat des Jahres, am einfachsten als Dauerauftrag mit eindeutigem Verwendungszweck; und bei Naturalunterhalt eine schriftliche Bestätigung des anderen Elternteils. Wer zusätzlich den Familienbonus Plus beantragt, braucht die Sozialversicherungsnummer des Kindes.</p>
<h2>Der Weg zum Familienbonus Plus</h2>
<p>Der Unterhaltsabsetzbetrag ist auch die Eintrittskarte zum Familienbonus Plus. Der Unterhaltszahler und der Elternteil mit Familienbeihilfe können den Bonus aufteilen: einer ganz, oder jeder zur Hälfte. Der Zahler bekommt ihn aber nur für Monate, in denen ihm der Unterhaltsabsetzbetrag zusteht. Wurde das ganze Jahr kein Unterhalt geleistet, steht ihm kein Bonus zu.</p>
${h.table(['Variante beim Zahler', 'mehr netto pro Monat', 'im Jahr'], [
  ['ganzer Familienbonus', h.eur(fbGanz, 2), h.eur(fbGanz * 12, 2)],
  ['halber Familienbonus', h.eur(fbHalb, 2), h.eur(fbHalb * 12, 2)],
], `Unterhaltszahler mit ${h.eur(3000)} brutto, ein Kind unter ${A.familienbonus_altersgrenze}, ohne Unterhaltsabsetzbetrag (der kommt in der Veranlagung dazu)`, ['l', 'r', 'r'])}
<p>Wie die Eltern den Bonus beantragen und was bei unvollständigem Unterhalt mit der Beilage L 1k-bF zu tun ist, erklärt die Seite ${h.a('familienbonus-beantragen', 'Familienbonus beantragen')}.</p>
<h2>Abgrenzung zum Alleinerzieherabsetzbetrag</h2>
<p>Der Elternteil, bei dem das Kind lebt, bekommt nicht den Unterhaltsabsetzbetrag, sondern unter Umständen den ${h.a('alleinverdiener', 'Alleinerzieherabsetzbetrag')}. Die beiden schließen sich für dasselbe Kind gegenseitig aus, ergänzen sich aber innerhalb der getrennten Familie: Der eine hat das Kind und die Beihilfe, der andere zahlt und setzt ab. Lebt das Kind später beim zahlenden Elternteil und wechselt die Familienbeihilfe zu ihm, endet der Unterhaltsabsetzbetrag mit diesem Monat; ab dann kann der Alleinerzieherabsetzbetrag in Frage kommen, wenn die übrigen Voraussetzungen erfüllt sind.</p>
`,
  },
  en: {
    slug: 'child-maintenance-credit',
    nav: 'Child maintenance credit',
    card: `${EN.eur(U[0])}, ${EN.eur(U[1])} or ${EN.eur(U[2])} a month per child for parents paying child support, and what it means for Familienbonus Plus.`,
    title: 'Unterhaltsabsetzbetrag 2026: Tax Credit for Child Support',
    description: `Unterhaltsabsetzbetrag 2026 in Austria: ${EN.eur(U[0])}, ${EN.eur(U[1])} and ${EN.eur(U[2])} a month per child, only for months fully paid. Conditions, part payments, Familienbonus Plus.`,
    h1: 'The child maintenance credit for parents who pay support',
    intro: 'What separated parents in Austria can take off their tax for child support paid, and why every month not paid in full counts against you.',
    resume: `The Unterhaltsabsetzbetrag is Austria’s tax credit for parents who pay statutory child maintenance (Unterhalt, often called Alimente) for a child living outside their household. In 2026 it is ${EN.eur(U[0])} a month for the first child, ${EN.eur(U[1])} for the second and ${EN.eur(U[2])} for each further child (section 33(4)(3) of the Income Tax Act); for two children that is ${EN.eur(monat(2) * 12)} a year. It applies only if neither you nor a partner living with you receives family allowance for the child, and if the child lives in the EU, the EEA or Switzerland. Only months for which maintenance was paid in full count: if you owe ${EN.eur(RATE)} a month and pay ${EN.eur(GEZAHLT)} in the year, you get the credit for ${volleMonate} months. The credit only takes effect in the annual tax assessment and is never paid out as negative tax. It is also your key to Familienbonus Plus: a paying parent may claim all or half of that credit, but only for months in which the maintenance credit applies.`,
    faqs: [
      { q: 'Do I get the child maintenance credit if I paid only part of the maintenance?', a: `Only for months that are covered in full. If you owe ${EN.eur(RATE)} a month and transfer ${EN.eur(GEZAHLT)} over the year, you have met ${volleMonate} full months and get ${EN.eur(U[0] * volleMonate)} instead of ${EN.eur(U[0] * 12)} for one child. Payments clear the oldest open month first. For months without the maintenance credit you also lose Familienbonus Plus as the paying parent.` },
      { q: 'Do back payments of maintenance count for the previous year’s credit?', a: 'No. Back payments only count in the calendar year in which they are paid (section 33(4)(3)(e)). Clearing last year’s arrears in March cannot fill up months of last year. In the year of payment the money settles the oldest open month of that year. Paying arrears before the year ends therefore protects the credit for the current year.' },
      { q: 'Can I claim the child maintenance credit for a child over 18?', a: 'Only while family allowance is still paid for the child, typically to the other parent during education or training. The Finance Ministry states that there is no maintenance credit for adult children for whom no family allowance is paid. If you keep paying maintenance for a student and the allowance continues, the credit continues; once the allowance ends, so does the credit.' },
      { q: 'Can a maintenance-paying parent claim Familienbonus Plus through payroll?', a: `Yes, with form E 30 and proof of the maintenance payments. On ${EN.eur(3000)} gross, the full credit for one child under ${A.familienbonus_altersgrenze} adds ${EN.eur(fbGanz, 2)} net a month, half of it ${EN.eur(fbHalb, 2)}. Agree the split with the parent who receives family allowance. The maintenance credit itself is not applied by your employer; it only comes with the annual tax return.` },
      { q: 'What applies to the child maintenance credit if my child lives outside the EU?', a: 'Then there is no maintenance credit, because it is limited to children in the EU, the EEA and Switzerland. According to the Finance Ministry, for a child in another country who is not part of your household you can instead deduct half of the appropriate maintenance as an extraordinary expense (außergewöhnliche Belastung). Familienbonus Plus is not available for such a child either.' },
    ],
    body: (h) => `
<h2>Who gets the credit</h2>
<p>After a separation one parent usually has the child at home and receives family allowance (Familienbeihilfe), while the other pays maintenance. The paying parent can claim the credit under ${h.src('estg33', 'section 33(4)(3) of the Income Tax Act')} if:</p>
<ul>
<li>you pay statutory maintenance for the child and can prove it, in money or in kind;</li>
<li>the child does not belong to your household;</li>
<li>neither you nor a partner you live with receives family allowance for the child;</li>
<li>the child lives permanently in the EU, the EEA or Switzerland.</li>
</ul>
<p>If several people meet the conditions for the same child, the credit is granted only once.</p>
<h2>The 2026 amounts</h2>
${h.table(['Children supported', 'per month', 'per year if paid in full'], [1, 2, 3, 4].map((n) => [String(n), h.eur(monat(n)), h.eur(monat(n) * 12)]), `Maintenance credit 2026: ${h.eur(U[0])} for the first, ${h.eur(U[1])} for the second, ${h.eur(U[2])} for each further child`, ['l', 'r', 'r'])}
<p>The amounts rise every year by two thirds of the inflation rate; the ${h.src('bmfUnterhalt', 'Finance Ministry')} lists earlier years. The size of your maintenance does not matter: paying more than required does not raise the credit.</p>
<h2>Only full months count</h2>
<p>The rule is strict. If you did not meet your maintenance obligation in full during the year, the credit applies only to months for which the full amount was paid on a running calculation, and each payment clears the oldest open month first. Example: ${h.eur(RATE)} a month is owed and ${h.eur(GEZAHLT)} was paid over the year. That covers ${volleMonate} full months, so one child brings ${h.eur(U[0] * volleMonate)} instead of ${h.eur(U[0] * 12)}.</p>
<p>Back payments count only in the year they are made; settling last year’s arrears in spring does not improve last year’s assessment. Where there is no court order, no written agreement and no written confirmation from the other parent, the tax office uses standard average needs rates as a yardstick, according to the ${h.src('bmfFamilienbonus', 'Finance Ministry')}. A written agreement saves arguments later.</p>
<!--mini:unterhalt-->
<h2>When and how it works</h2>
<p>Unlike Familienbonus Plus, the maintenance credit is not applied on your payslip. It only takes effect when you file the ${h.a('arbeitnehmerveranlagung', 'annual employee tax assessment')}, where you enter the children, the period and the amounts paid. It reduces tax you actually owe but is not paid out if your tax is already zero: section 33(8) lists only the sole earner and single parent credits and the social insurance refund as refundable. Higher earners feel the full effect; on ${h.eur(3000)} gross, wage tax is still ${h.eur(lstNachFb, 2)} a month even after the full Familienbonus Plus, enough to absorb the credit for one child.</p>
<h2>What to keep ready for the tax return</h2>
<p>The tax office asks questions when the figures do not match. Keep three things to hand: the basis of the obligation, meaning a court decision, settlement or written agreement stating the monthly amount; proof of payment for every month, easiest as a standing order with a clear reference; and, for maintenance in kind, written confirmation from the other parent. If you also claim Familienbonus Plus, you need the child’s social security number.</p>
<h2>Your route to Familienbonus Plus</h2>
<p>The maintenance credit also opens the door to Familienbonus Plus. The paying parent and the parent with family allowance may split that credit: one takes all of it, or each takes half. The paying parent gets it only for months in which the maintenance credit applies, and if no maintenance at all was paid during the year, not at all.</p>
${h.table(['Option for the paying parent', 'extra net per month', 'per year'], [
  ['full Familienbonus Plus', h.eur(fbGanz, 2), h.eur(fbGanz * 12, 2)],
  ['half Familienbonus Plus', h.eur(fbHalb, 2), h.eur(fbHalb * 12, 2)],
], `Paying parent on ${h.eur(3000)} gross, one child under ${A.familienbonus_altersgrenze}, before the maintenance credit (added in the tax return)`, ['l', 'r', 'r'])}
<p>How parents claim and what to do with schedule L 1k-bF when maintenance was incomplete is explained under ${h.a('familienbonus-beantragen', 'claiming Familienbonus Plus')}.</p>
<h2>How it differs from the single parent credit</h2>
<p>The parent the child lives with does not get the maintenance credit but may get the ${h.a('alleinverdiener', 'single parent credit')}. For the same child the two exclude each other, yet within a separated family they complement each other: one parent has the child and the allowance, the other pays and deducts.</p>
`,
  },
});
