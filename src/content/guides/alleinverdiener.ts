import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { avab } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const A = P.absetzbetraege;
const GRENZE = A.avab_partner_einkuenfte_max;
/** Wirkung im Lohnzettel: mehr netto pro Monat mit AVAB/AEAB für 1, 2 und 3 Kinder (Motor). */
const BRUTTOS = [1500, 1800, 2000, 2500, 3000];
const zeilen = BRUTTOS.map((b) => { const o = kurz(b); return { b, lst: o.lstMonat, k: [1, 2, 3].map((n) => kurz(b, { avab: true, avabKinder: n }).nettoMonat - o.nettoMonat) }; });
const z1800 = zeilen[1], z2500 = zeilen[3], z1500 = zeilen[0];

export default defineGuide({
  id: 'alleinverdiener',
  group: 'absetz',
  order: 40,
  mini: 'avab',
  miniHref: 'home',
  related: ['kindermehrbetrag', 'familienbonus', 'unterhaltsabsetzbetrag', 'arbeitnehmerveranlagung', 'wochengeld'],
  sources: ['estg33', 'bmfAvab'],
  de: {
    slug: 'alleinverdienerabsetzbetrag',
    nav: 'Alleinverdiener und Alleinerzieher',
    card: `${DE.eur(avab(1))} bis ${DE.eur(avab(3))} und mehr im Jahr: wer den AVAB oder AEAB bekommt, wie hoch der Partner verdienen darf und wie Sie ihn beantragen.`,
    title: 'Alleinverdienerabsetzbetrag 2026: AVAB und AEAB im Überblick',
    description: `Alleinverdienerabsetzbetrag 2026: ${DE.eur(avab(1))} mit einem Kind, ${DE.eur(avab(2))} mit zwei. Partnergrenze ${DE.eur(GRENZE)}, Alleinerzieher, Antrag mit E 30 und Erstattung als Negativsteuer.`,
    h1: 'Alleinverdiener- und Alleinerzieherabsetzbetrag 2026',
    intro: 'Wer als Alleinverdiener oder Alleinerzieherin mit Kind einen eigenen Absetzbetrag bekommt, wie viel davon im Lohnzettel wirkt und was über die Veranlagung zurückkommt.',
    resume: `Der Alleinverdienerabsetzbetrag (AVAB) und der Alleinerzieherabsetzbetrag (AEAB) betragen 2026 ${DE.eur(avab(1))} im Jahr mit einem Kind, ${DE.eur(avab(2))} mit zwei Kindern und ${DE.eur(A.avab_je_weiteres_kind)} mehr für jedes weitere Kind (§ 33 Abs. 4 EStG). Ohne Kind gibt es keinen der beiden. Den AVAB bekommt, wer mehr als sechs Monate im Jahr verheiratet, verpartnert oder in Lebensgemeinschaft lebt, wenn der Partner höchstens ${DE.eur(GRENZE)} Einkünfte im Jahr hat; steuerfreies Wochengeld zählt dabei mit, Kinderbetreuungsgeld nicht. Den AEAB bekommt, wer mit mindestens einem Kind mehr als sechs Monate nicht in einer Partnerschaft lebt. Beide sind Absetzbeträge: Bei ${DE.eur(2500)} brutto bringt der AVAB mit einem Kind ${DE.eur(z2500.k[0], 2)} netto mehr im Monat. Reicht die Lohnsteuer nicht aus, wird der Rest in der Arbeitnehmerveranlagung als Negativsteuer ausbezahlt. Beantragen können Sie ihn laufend beim Arbeitgeber mit dem Formular E 30 oder nachträglich in der Veranlagung, die Sie in jedem Fall abgeben sollten.`,
    faqs: [
      { q: 'Wie viel darf mein Partner für den Alleinverdienerabsetzbetrag verdienen?', a: `Höchstens ${DE.eur(GRENZE)} Einkünfte im Kalenderjahr. Gemeint ist nicht das Brutto, sondern Brutto minus Sozialversicherung, Werbungskosten (mindestens ${DE.eur(P.tarif.werbungskostenpauschale)}) und Pendlerpauschale; Sonderzahlungen zählen, soweit sie über der Freigrenze liegen. Mitgerechnet werden steuerfreies Wochengeld und endbesteuerte Kapitalerträge, nicht aber Kinderbetreuungsgeld, Arbeitslosengeld, Notstandshilfe oder Familienbeihilfe. Maßgeblich sind die Einkünfte des ganzen Jahres, auch vor einer Heirat.` },
      { q: 'Wer bekommt den Alleinerzieherabsetzbetrag nach einer Trennung im Laufe des Jahres?', a: 'Entscheidend ist die Zahl der Monate: Den Alleinerzieherabsetzbetrag gibt es, wenn Sie mit mindestens einem Kind mehr als sechs Monate im Kalenderjahr nicht in einer Partnerschaft leben und mehr als sechs Monate Familienbeihilfe beziehen. Trennen Sie sich im Mai, erfüllen Sie das; trennen Sie sich im September, meist nicht. Dann kann im Trennungsjahr der Alleinverdienerabsetzbetrag in Frage kommen, wenn die Partnergrenze eingehalten ist.' },
      { q: 'Bekomme ich den Alleinverdienerabsetzbetrag auch ohne Lohnsteuer ausbezahlt?', a: `Ja. Ergibt sich in der Arbeitnehmerveranlagung eine Steuer unter null, wird der Alleinverdiener- oder Alleinerzieherabsetzbetrag insoweit erstattet (§ 33 Abs. 8 Z 1 EStG). Bei ${DE.eur(1500)} brutto zahlt man keine Lohnsteuer, im Lohnzettel bringt der Absetzbetrag dort nichts; über die Veranlagung kommen bis zu ${DE.eur(avab(1))} mit einem Kind zurück. Dafür müssen Sie die Veranlagung abgeben.` },
      { q: 'Kann ich den Alleinverdienerabsetzbetrag bei zwei Arbeitgebern beantragen?', a: 'Nein, nur bei einem. Wer gleichzeitig mehrere Dienstverhältnisse hat, darf die Erklärung mit dem Formular E 30 nur einem Arbeitgeber geben. Fallen die Voraussetzungen weg, etwa weil der Partner mehr verdient oder die Ehe geschieden wird, melden Sie das binnen eines Monats mit dem Formular E 31. Nach Ablauf des Jahres müssen Sie dann eine Arbeitnehmerveranlagung abgeben.' },
      { q: 'Was passiert, wenn ich den Alleinverdienerabsetzbetrag in der Veranlagung vergesse?', a: 'Dann versteuert das Finanzamt nach. Auch wenn der Arbeitgeber den Absetzbetrag das ganze Jahr berücksichtigt hat, müssen Sie die Angaben dazu in der Arbeitnehmerveranlagung erneut ausfüllen. Fehlen sie, rechnet das Finanzamt ohne ihn, und die monatliche Entlastung wird als Nachzahlung zurückgefordert. Das Finanzministerium nennt das ausdrücklich eine ungewollte Nachversteuerung.' },
    ],
    body: (h) => `
<h2>Zwei Absetzbeträge, ein Betrag</h2>
<p>Das Gesetz kennt zwei Situationen mit denselben Beträgen: den Alleinverdiener, der mit Kind und einem Partner ohne nennenswertes Einkommen lebt, und die Alleinerzieherin, die mit Kind ohne Partner lebt. Beide stehen in ${h.src('estg33', '§ 33 Abs. 4 Z 1 und 2 EStG')}, beide setzen mindestens ein Kind voraus, für das mehr als sechs Monate im Jahr Familienbeihilfe und Kinderabsetzbetrag bezogen werden. Das Kind muss sich ständig in der EU, im EWR oder in der Schweiz aufhalten.</p>
${h.table(['Kinder', 'Absetzbetrag im Jahr', 'pro Monat'], [1, 2, 3, 4].map((n) => [String(n), h.eur(avab(n)), h.eur(avab(n) / 12, 2)]), 'AVAB und AEAB 2026 nach § 33 Abs. 4 EStG', ['l', 'r', 'r'])}
<p>Die Beträge werden jedes Jahr um zwei Drittel der Inflationsrate angehoben, samt der Partnergrenze; die Werte der Vorjahre listet das ${h.src('bmfAvab', 'Finanzministerium')}. Wer eine Veranlagung für ein früheres Jahr nachholt, rechnet daher mit etwas niedrigeren Beträgen.</p>
<h2>Alleinverdiener: die Partnergrenze</h2>
<p>Den AVAB bekommt, wer mehr als sechs Monate im Jahr verheiratet oder eingetragen verpartnert ist und nicht dauernd getrennt lebt, oder mehr als sechs Monate in einer Lebensgemeinschaft. Der Partner darf höchstens ${h.eur(GRENZE)} Einkünfte im Kalenderjahr haben. Erfüllen beide die Voraussetzung, etwa ein Studentenpaar mit Kind, bekommt ihn der Partner mit den höheren Einkünften; bei gleich hohen Einkünften der haushaltsführende.</p>
<p>Die Einkünfte des Partners sind nicht sein Brutto. Abgezogen werden Sozialversicherung, Gewerkschaftsbeitrag, Pendlerpauschale und Werbungskosten, mindestens das Pauschale von ${h.eur(h.P.tarif.werbungskostenpauschale)}. Hinzu kommen Sonderzahlungen über der Freigrenze und Abfertigungen. Bei den steuerfreien Einkünften gibt es eine Falle:</p>
<ul>
<li><strong>Zählt mit:</strong> steuerfreies Wochengeld, endbesteuerte Zinsen und Dividenden, steuerfreie Auslandsbezüge und Einkünfte als Aushilfskraft.</li>
<li><strong>Zählt nicht:</strong> Kinderbetreuungsgeld, Familienbeihilfe, Arbeitslosengeld, Notstandshilfe, Unterhaltszahlungen.</li>
</ul>
<p>Wer im Jahr der Geburt einige Monate ${h.a('wochengeld', 'Wochengeld')} bezieht, kann dadurch über die Grenze kommen, obwohl sie den Rest des Jahres nur Kinderbetreuungsgeld bekommt. Für die Grenze gilt immer das ganze Jahr, also auch Einkünfte vor einer Heirat oder nach einer Scheidung.</p>
<h2>Alleinerzieher: mehr als sechs Monate allein</h2>
<p>Den AEAB bekommt, wer mit mindestens einem Kind mehr als sechs Monate im Kalenderjahr nicht in einer Gemeinschaft mit einem Ehe- oder Lebenspartner lebt und mehr als sechs Monate Familienbeihilfe bezieht. Auf das Einkommen des anderen Elternteils kommt es nicht an. Wer den Unterhalt für das Kind zahlt, bekommt nicht den AEAB, sondern den ${h.a('unterhaltsabsetzbetrag', 'Unterhaltsabsetzbetrag')}.</p>
<h2>Was im Lohnzettel ankommt</h2>
<p>Als Absetzbetrag wird der AVAB oder AEAB von der Lohnsteuer abgezogen, und zwar erst nach dem Familienbonus Plus. Die Tabelle zeigt, wie viel netto im Monat er bei verschiedenen Gehältern ausmacht.</p>
${h.table(['Brutto pro Monat', 'Lohnsteuer ohne', '1 Kind', '2 Kinder', '3 Kinder'], zeilen.map((z) => [h.eur(z.b), h.eur(z.lst, 2), ...z.k.map((x) => h.eur(x, 2))]), 'Mehr netto pro Monat durch AVAB/AEAB, ohne Familienbonus, 14 Bezüge; Rechenmotor dieser Seite', ['l', 'r', 'r', 'r', 'r'])}
<p>Bei ${h.eur(1500)} fällt keine Lohnsteuer an, der Absetzbetrag hat im Lohnzettel nichts zu mindern. Bei ${h.eur(1800)} ist die Lohnsteuer von ${h.eur(z1800.lst, 2)} die Obergrenze. Erst ab etwa ${h.eur(2500)} wirkt der volle Betrag jeden Monat. Kommt der Familienbonus dazu, verbraucht er die Lohnsteuer zuerst, und der AVAB oder AEAB wandert ganz in die Veranlagung.</p>
<!--mini:avab-->
<h2>Negativsteuer: der Rest kommt über die Veranlagung</h2>
<p>Der AVAB und der AEAB gehören zu den wenigen Absetzbeträgen, die auch ausbezahlt werden. Ergibt sich in der Arbeitnehmerveranlagung eine Steuer unter null, erstattet das Finanzamt sie insoweit (${h.src('estg33', '§ 33 Abs. 8 Z 1 EStG')}). Im Beispiel mit ${h.eur(1500)} brutto und einem Kind bekommt man über die Veranlagung bis zu ${h.eur(avab(1))} im Jahr, obwohl der Lohnzettel keinen Cent zeigt. Wer wenig verdient, sollte die Veranlagung deshalb in jedem Fall abgeben. Ist die Tarifsteuer sehr niedrig, kann zusätzlich der ${h.a('kindermehrbetrag', 'Kindermehrbetrag')} zustehen, für den der AVAB oder AEAB eine der Voraussetzungen ist.</p>
<h2>Beantragen und melden</h2>
<p>Während des Jahres erklären Sie den Anspruch dem Arbeitgeber mit dem Formular E 30, bei mehreren Dienstverhältnissen nur einem. Fallen die Voraussetzungen weg, melden Sie das binnen eines Monats mit dem Formular E 31 und geben nach Jahresende eine Arbeitnehmerveranlagung ab. Nachträglich holen Sie den Absetzbetrag in der ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} nach. Tragen Sie ihn dort auch dann ein, wenn der Arbeitgeber ihn schon berücksichtigt hat, sonst wird er nachversteuert.</p>
`,
  },
  en: {
    slug: 'sole-earner-single-parent-credit',
    nav: 'Sole earner and single parent credit',
    card: `${EN.eur(avab(1))} to ${EN.eur(avab(3))} or more a year: who gets the AVAB or AEAB, how much a partner may earn and how to claim.`,
    title: 'Alleinverdienerabsetzbetrag 2026: Sole Earner Credit Guide',
    description: `Alleinverdienerabsetzbetrag 2026 in Austria: ${EN.eur(avab(1))} with one child, ${EN.eur(avab(2))} with two. Partner limit ${EN.eur(GRENZE)}, single parents, claiming with E 30 and refunds.`,
    h1: 'Sole earner and single parent tax credit in 2026',
    intro: 'Who qualifies for Austria’s sole earner or single parent credit, how much of it reaches the payslip and what the annual tax return pays back.',
    resume: `Austria’s sole earner credit (Alleinverdienerabsetzbetrag, AVAB) and single parent credit (Alleinerzieherabsetzbetrag, AEAB) are worth ${EN.eur(avab(1))} a year with one child in 2026, ${EN.eur(avab(2))} with two and ${EN.eur(A.avab_je_weiteres_kind)} more for each further child (section 33(4) of the Income Tax Act). Without a child there is neither. The AVAB goes to someone married, in a registered partnership or cohabiting for more than six months of the year whose partner has income of no more than ${EN.eur(GRENZE)}; tax-free maternity pay counts towards that limit, childcare allowance does not. The AEAB goes to someone who lives with at least one child and without a partner for more than six months. Both are tax credits: on ${EN.eur(2500)} gross the AVAB with one child adds ${EN.eur(z2500.k[0], 2)} net a month. If your wage tax is too low to absorb it, the remainder is paid out as a refund in the annual tax assessment. Claim it on the payslip with form E 30 or afterwards in the tax return, which you should file in any case.`,
    faqs: [
      { q: 'How much may my partner earn for me to get the sole earner credit?', a: `No more than ${EN.eur(GRENZE)} of income in the calendar year. That means gross pay minus social insurance, work expenses (at least ${EN.eur(P.tarif.werbungskostenpauschale)}) and any commuter allowance; special payments count where they exceed the exemption limit. Tax-free maternity pay and investment income taxed at source are included, childcare allowance, unemployment benefit and family allowance are not. The whole year counts, including income before a wedding.` },
      { q: 'Who gets the single parent credit after a separation during the year?', a: 'It comes down to months. The single parent credit applies if you live with at least one child and without a partner for more than six months of the calendar year and receive family allowance for more than six months. Separate in May and you qualify; separate in September and you usually do not. In that year the sole earner credit may apply instead, provided the partner income limit was met.' },
      { q: 'Is the sole earner credit paid out if I pay no wage tax?', a: `Yes. If the annual tax assessment produces a tax below zero, the sole earner or single parent credit is refunded to that extent (section 33(8)(1)). On ${EN.eur(1500)} gross no wage tax is due, so the credit does nothing on the payslip, but the tax return pays back up to ${EN.eur(avab(1))} with one child. You only get it if you file.` },
      { q: 'Can I claim the sole earner credit with two employers?', a: 'No, with one only. If you hold more than one job at the same time, give the E 30 declaration to just one employer. If the conditions lapse during the year, for instance because your partner starts earning more or you divorce, tell your employer within one month on form E 31 and file an annual tax return after the year ends.' },
      { q: 'What happens if I leave the sole earner credit out of my tax return?', a: 'The tax office claws it back. Even if your employer applied the credit all year, you must fill in the relevant section again in your annual tax assessment. If you leave it blank, the office calculates without the credit and asks you to repay the monthly relief. The Finance Ministry explicitly warns of this unintended back taxation.' },
    ],
    body: (h) => `
<h2>Two credits, one amount</h2>
<p>Austrian law covers two situations with identical amounts: the sole earner living with a child and a partner who earns little, and the single parent living with a child and no partner. Both are in ${h.src('estg33', 'section 33(4)(1) and (2) of the Income Tax Act')}, and both require at least one child for whom family allowance (Familienbeihilfe) and the child credit paid with it are received for more than six months of the year. The child must live permanently in the EU, the EEA or Switzerland.</p>
${h.table(['Children', 'Credit per year', 'per month'], [1, 2, 3, 4].map((n) => [String(n), h.eur(avab(n)), h.eur(avab(n) / 12, 2)]), 'AVAB and AEAB 2026 under section 33(4)', ['l', 'r', 'r'])}
<p>The amounts, and the partner income limit, rise each year by two thirds of the inflation rate; the ${h.src('bmfAvab', 'Finance Ministry')} lists earlier years. If you file a return for a past year, expect slightly lower figures.</p>
<h2>Sole earner: the partner’s income limit</h2>
<p>You qualify as a sole earner if, for more than six months of the year, you are married or in a registered partnership and not permanently separated, or you cohabit. Your partner may have no more than ${h.eur(GRENZE)} of income in the calendar year. If both partners meet the conditions, a student couple with a baby for example, the one with higher income gets it; with equal income, the one running the household.</p>
<p>Your partner’s income is not their gross pay. Social insurance, union dues, commuter allowance and work expenses, at least the flat ${h.eur(h.P.tarif.werbungskostenpauschale)}, are deducted; special payments above the exemption limit and severance pay are added. Tax-free income is where people get caught out:</p>
<ul>
<li><strong>Counts:</strong> tax-free maternity pay (Wochengeld), interest and dividends taxed at source, tax-free foreign assignment pay and casual-worker income.</li>
<li><strong>Does not count:</strong> childcare allowance, family allowance, unemployment benefit, emergency assistance, maintenance received.</li>
</ul>
<p>A mother who draws ${h.a('wochengeld', 'maternity pay')} for a few months in the year of birth can therefore cross the limit even though she receives only childcare allowance for the rest of the year. The limit always looks at the full year, including income before a wedding or after a divorce.</p>
<h2>Single parent: more than six months alone</h2>
<p>The single parent credit goes to someone who lives with at least one child and without a spouse or partner for more than six months of the calendar year and receives family allowance for more than six months. The other parent’s income is irrelevant. The parent who pays maintenance does not get this credit but the ${h.a('unterhaltsabsetzbetrag', 'child maintenance credit')}.</p>
<h2>What reaches your payslip</h2>
<p>As a credit, the AVAB or AEAB comes off your wage tax, after Familienbonus Plus. The table shows the extra net pay per month at different salaries.</p>
${h.table(['Gross per month', 'Wage tax without', '1 child', '2 children', '3 children'], zeilen.map((z) => [h.eur(z.b), h.eur(z.lst, 2), ...z.k.map((x) => h.eur(x, 2))]), 'Extra net pay per month from AVAB/AEAB, no Familienbonus, 14 salaries; our engine', ['l', 'r', 'r', 'r', 'r'])}
<p>At ${h.eur(1500)} there is no wage tax for the credit to reduce. At ${h.eur(1800)} the wage tax of ${h.eur(z1800.lst, 2)} is the ceiling. Only from about ${h.eur(2500)} does the full amount work every month. Add Familienbonus Plus and it uses up the wage tax first, pushing the AVAB or AEAB entirely into the tax return.</p>
<!--mini:avab-->
<h2>Negative tax: the rest comes with the tax return</h2>
<p>The AVAB and AEAB are among the few Austrian credits that are paid out in cash. If your annual tax assessment shows tax below zero, the tax office refunds them to that extent (${h.src('estg33', 'section 33(8)(1)')}). In the example on ${h.eur(1500)} gross with one child, the return brings up to ${h.eur(avab(1))} a year although the payslip shows nothing. Low earners should therefore always file the annual return. If the scale tax is very low, the ${h.a('kindermehrbetrag', 'Kindermehrbetrag')} may apply on top, and the AVAB or AEAB is one of the ways to qualify for it.</p>
<h2>Claiming and reporting changes</h2>
<p>During the year you declare your entitlement to your employer on form E 30, and to one employer only if you have several jobs. If the conditions lapse, report it within a month on form E 31 and file a tax return after the year ends. You can always claim afterwards in the ${h.a('arbeitnehmerveranlagung', 'annual employee tax assessment')}. Enter it there even if payroll already applied it, or it will be taxed back.</p>
`,
  },
});
