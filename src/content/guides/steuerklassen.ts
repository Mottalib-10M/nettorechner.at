import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { avab } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

/** Beispiele aus dem Motor: 3.500 € brutto in verschiedenen Lebenslagen. */
const B = 3500;
const A = P.absetzbetraege;
const ledig = kurz(B);
const kind = kurz(B, { kinderU18: 1 });
const kindGeteilt = kurz(B, { kinderU18: 1, fbGeteilt: true });
const avab1 = kurz(B, { kinderU18: 1, avab: true });
const pendler = kurz(B, { pendler: 'klein', km: 30 });
const fall = [
  { de: 'ledig, ohne Kinder', en: 'single, no children', k: ledig },
  { de: 'verheiratet, ohne Kinder, Partner ohne Einkommen', en: 'married, no children, partner without income', k: ledig },
  { de: 'verheiratet, 1 Kind, Familienbonus geteilt', en: 'married, 1 child, child credit split', k: kindGeteilt },
  { de: 'verheiratet, 1 Kind, Familienbonus ganz', en: 'married, 1 child, full child credit', k: kind },
  { de: `wie oben, Partner verdient höchstens ${DE.eur(A.avab_partner_einkuenfte_max)} (Alleinverdiener)`, en: `as above, partner earns at most ${EN.eur(A.avab_partner_einkuenfte_max)} (sole earner)`, k: avab1 },
  { de: 'ledig, 30 km Arbeitsweg, Öffis zumutbar', en: 'single, 30 km commute, public transport possible', k: pendler },
];
const plusAvab = avab1.nettoMonat - kind.nettoMonat;

export default defineGuide({
  id: 'steuerklassen',
  group: 'lohn',
  order: 75,
  mini: 'steuerklasse',
  related: ['familienbonus', 'alleinverdiener', 'unterhaltsabsetzbetrag', 'pendlerpauschale', 'lohnsteuer'],
  sources: ['estg33', 'bmfAbsetzbetraege', 'bmfAvab'],
  de: {
    slug: 'steuerklassen-oesterreich',
    nav: 'Steuerklassen in Österreich?',
    card: 'Warum es in Österreich keine Steuerklassen gibt und welche Absetzbeträge die Lohnsteuer stattdessen senken.',
    title: 'Steuerklassen Österreich 2026: warum es keine gibt',
    description: `Steuerklassen gibt es in Österreich 2026 nicht: Jeder wird einzeln besteuert. Was die Lohnsteuer stattdessen senkt, vom Familienbonus bis ${DE.eur(A.avab_1_kind)} Alleinverdiener.`,
    h1: 'Steuerklassen in Österreich: was es stattdessen gibt',
    intro: 'Für alle, die aus Deutschland kommen und auf dem Lohnzettel vergeblich eine Steuerklasse suchen: wie Familie, Ehe und Arbeitsweg hier die Lohnsteuer verändern.',
    resume: `In Österreich gibt es keine Steuerklassen. Jeder Mensch wird mit seinem eigenen Einkommen nach demselben Tarif des § 33 EStG besteuert, verheiratet oder nicht, und Ehepaare werden nicht gemeinsam veranlagt. Eine Heirat ändert die Lohnsteuer deshalb für sich allein nicht: Bei ${DE.eur(B)} brutto bleiben 2026 ledig wie verheiratet ${DE.eur(ledig.nettoMonat, 2)} netto im Monat. Was die Steuer senkt, sind Absetzbeträge, die an Kinder, Lebensumstände und Arbeitsweg anknüpfen. Der Familienbonus Plus zieht ${DE.eur(A.familienbonus_monat_u18, 2)} pro Monat und Kind unter 18 direkt von der Steuer ab. Der Alleinverdienerabsetzbetrag von ${DE.eur(A.avab_1_kind)} im Jahr mit einem Kind steht nur zu, wenn mindestens ein Kind da ist und der Partner höchstens ${DE.eur(A.avab_partner_einkuenfte_max)} im Jahr verdient; Alleinerziehende bekommen denselben Betrag. Wer Unterhalt für ein Kind außerhalb des Haushalts zahlt, erhält den Unterhaltsabsetzbetrag ab ${DE.eur(A.unterhaltsabsetzbetrag[0])} im Monat, Pendler das Pendlerpauschale und den Pendlereuro. All das beantragen Sie beim Arbeitgeber oder holen es in der Arbeitnehmerveranlagung nach.`,
    faqs: [
      { q: 'Welche Steuerklasse habe ich in Österreich als Verheirateter?', a: `Keine, denn das österreichische Recht kennt keine Steuerklassen. Ihr Lohn wird allein nach Ihrem eigenen Einkommen und dem Tarif des § 33 EStG besteuert. Die Ehe allein bringt steuerlich nichts. Erst mit einem Kind kann ein Alleinverdienerabsetzbetrag von ${DE.eur(A.avab_1_kind)} im Jahr zustehen, wenn der Partner höchstens ${DE.eur(A.avab_partner_einkuenfte_max)} verdient; dazu kommt der Familienbonus Plus für jedes Kind.` },
      { q: 'Gibt es in Österreich statt Steuerklassen ein Ehegattensplitting?', a: `Nein. Österreich besteuert jeden Ehepartner einzeln, ein Splitting der Einkommen gibt es nicht. Verdient ein Partner viel und der andere wenig, zahlt der Gutverdiener seine Lohnsteuer wie ein Lediger. Ausgleich gibt es nur über Absetzbeträge, und die setzen in der Regel Kinder voraus. Mit einem Kind unter 18 und vollem Familienbonus steigt das Netto bei ${DE.eur(B)} brutto um ${DE.eur(kind.nettoMonat - ledig.nettoMonat, 2)} im Monat.` },
      { q: 'Was ersetzt die Steuerklasse für Alleinerziehende in Österreich?', a: `Der Alleinerzieherabsetzbetrag. Er steht zu, wenn Sie mehr als sechs Monate im Jahr mit mindestens einem Kind ohne Partner leben und für das Kind mehr als sechs Monate Familienbeihilfe beziehen. 2026 sind es ${DE.eur(A.avab_1_kind)} mit einem Kind, ${DE.eur(A.avab_2_kinder)} mit zwei und ${DE.eur(A.avab_je_weiteres_kind)} mehr für jedes weitere. Ist die Steuer zu gering, wird er in der Veranlagung ausbezahlt.` },
      { q: 'Muss ich meinem österreichischen Arbeitgeber statt einer Steuerklasse etwas melden?', a: `Nur, wenn Sie Absetzbeträge schon im laufenden Lohn haben möchten: Familienbonus Plus, Alleinverdiener- oder Alleinerzieherabsetzbetrag und Pendlerpauschale beantragen Sie mit einem Formular beim Arbeitgeber. Ohne Meldung rechnet die Lohnverrechnung wie für eine Person ohne Kinder mit ${DE.eur(A.verkehrsabsetzbetrag)} Verkehrsabsetzbetrag. Nichts geht verloren, denn alles lässt sich bis zu fünf Jahre rückwirkend in der Arbeitnehmerveranlagung nachholen.` },
      { q: 'Wie viel bringt der Alleinverdienerabsetzbetrag im Vergleich zu einer deutschen Steuerklasse?', a: `Einen festen Betrag statt eines anderen Tarifs: ${DE.eur(avab(1))} im Jahr mit einem Kind, ${DE.eur(avab(2))} mit zwei, ${DE.eur(avab(3))} mit drei Kindern. Bei ${DE.eur(B)} brutto sind das ${DE.eur(plusAvab, 2)} mehr netto im Monat. Der Betrag hängt nicht von Ihrem Einkommen ab, nur davon, dass der Partner höchstens ${DE.eur(A.avab_partner_einkuenfte_max)} im Jahr verdient (BMF).` },
    ],
    body: (h) => `
<h2>Individualbesteuerung statt Steuerklassen</h2>
<p>Wer aus Deutschland nach Österreich zieht, sucht auf dem ersten Lohnzettel meist eine Steuerklasse. Es gibt sie nicht. Der ${h.src('estg33', 'Einkommensteuertarif nach § 33 EStG')} gilt für jede Person gleich und wird nur auf ihr eigenes Einkommen angewendet. Eine Zusammenveranlagung von Ehepaaren und ein Splitting der Einkommen gibt es nicht; jeder Partner hat seine eigene Arbeitnehmerveranlagung. Der Familienstand allein ändert die Lohnsteuer also nicht, und ein Wechsel der Kombination nach der Hochzeit ist weder nötig noch möglich.</p>
<p>Was die Lohnsteuer individuell macht, sind Absetzbeträge. Sie werden nicht vom Einkommen, sondern direkt von der berechneten Steuer abgezogen; jeder Euro Absetzbetrag ist ein Euro weniger Steuer, unabhängig vom Grenzsteuersatz. Dazu kommen Freibeträge wie das Pendlerpauschale, die das Einkommen mindern.</p>

<h2>Was die Lohnsteuer in Österreich verändert</h2>
${h.table(['Absetzbetrag', 'Höhe 2026', 'Voraussetzung'], [
  ['Verkehrsabsetzbetrag', `${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)} im Jahr`, 'jeder Arbeitnehmer, automatisch'],
  ['Familienbonus Plus', `${h.eur(h.P.absetzbetraege.familienbonus_monat_u18, 2)} pro Monat und Kind unter 18, ${h.eur(h.P.absetzbetraege.familienbonus_monat_ue18, 2)} ab 18`, 'Familienbeihilfe für das Kind, Antrag'],
  ['Alleinverdienerabsetzbetrag', `${h.eur(h.P.absetzbetraege.avab_1_kind)} (1 Kind), ${h.eur(h.P.absetzbetraege.avab_2_kinder)} (2 Kinder), +${h.eur(h.P.absetzbetraege.avab_je_weiteres_kind)} je weiteres`, `Kind, Partner verdient höchstens ${h.eur(h.P.absetzbetraege.avab_partner_einkuenfte_max)}`],
  ['Alleinerzieherabsetzbetrag', 'wie Alleinverdiener', 'mehr als 6 Monate ohne Partner, Familienbeihilfe'],
  ['Unterhaltsabsetzbetrag', `${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[0])} / ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[1])} / ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[2])} pro Monat`, 'Unterhalt für Kind außerhalb des Haushalts'],
  ['Pendlereuro', `${h.eur(h.P.absetzbetraege.pendlereuro_je_km)} je km einfacher Strecke im Jahr`, 'Anspruch auf Pendlerpauschale'],
], `Quelle: ${h.src('bmfAbsetzbetraege', 'BMF, Steuerabsetzbeträge im Überblick')}`, ['l', 'l', 'l'])}

<h2>Ein Gehalt, sechs Lebenslagen</h2>
<p>Wie wenig der Familienstand und wie viel Kinder und Arbeitsweg ausmachen, zeigt dasselbe Bruttogehalt von ${h.eur(B)} in verschiedenen Situationen:</p>
${h.table(['Situation', 'Netto pro Monat', 'Unterschied zu ledig'], fall.map((f) => [f.de, h.eur(f.k.nettoMonat, 2), h.eur(f.k.nettoMonat - ledig.nettoMonat, 2)]), 'Laufender Monat 2026, außerhalb Wiens, Familienbonus für ein Kind unter 18', ['l', 'r', 'r'])}
<p>Die zweite Zeile ist für viele Zuzügler die Überraschung: Verheiratet ohne Kinder und mit einem Partner ohne Einkommen ergibt dasselbe Netto wie ledig. Der ${h.a('alleinverdiener', 'Alleinverdienerabsetzbetrag')} setzt laut ${h.src('bmfAvab', 'BMF')} mindestens ein Kind voraus, für das Familienbeihilfe bezogen wird. Erst dann zählt die Grenze von ${h.eur(h.P.absetzbetraege.avab_partner_einkuenfte_max)} für die Einkünfte des Partners. Zu den Einkünften des Partners zählen dabei auch Wochengeld und manche steuerfreie Auslandsbezüge, nicht aber Kinderbetreuungsgeld, Arbeitslosengeld oder Familienbeihilfe.</p>
<!--mini:avab-->

<h2>Der Familienbonus: der größte Hebel</h2>
<p>Mit ${h.eur(h.P.absetzbetraege.familienbonus_monat_u18 * 12, 2)} im Jahr pro Kind unter 18 ist der ${h.a('familienbonus', 'Familienbonus Plus')} der wichtigste Absetzbetrag. Er wird höchstens bis zur Höhe der Lohnsteuer berücksichtigt und kann zwischen den Eltern geteilt werden, jeder bekommt dann die Hälfte. Bei ${h.eur(B)} brutto wirkt er voll. Wer wenig Steuer zahlt, bekommt in bestimmten Fällen stattdessen den ${h.a('kindermehrbetrag', 'Kindermehrbetrag')} ausbezahlt.</p>

<h2>Getrennt lebend, Unterhalt, Patchwork</h2>
<p>Wer für ein Kind Unterhalt zahlt, das nicht im eigenen Haushalt lebt, bekommt den ${h.a('unterhaltsabsetzbetrag', 'Unterhaltsabsetzbetrag')}: ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[0])} pro Monat für das erste, ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[1])} für das zweite und ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[2])} für jedes weitere Kind, aber nur für Monate, in denen der volle Unterhalt bezahlt wurde. Beantragt wird er in der Arbeitnehmerveranlagung mit der Beilage L1k. Der Familienbonus kann in diesem Fall zwischen dem Elternteil mit Familienbeihilfe und dem unterhaltspflichtigen Elternteil aufgeteilt werden.</p>

<h2>Wo der Partner doch eine Rolle spielt</h2>
<p>Ganz ohne Bezug zum Partner ist das österreichische System nicht. Der Kindermehrbetrag von bis zu ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} je Kind steht nach § 33 Abs. 7 EStG nur zu, wenn der Alleinverdiener- oder Alleinerzieherabsetzbetrag zusteht oder auch der Partner weniger als ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} Steuer zahlt. Beim Alleinverdienerabsetzbetrag zählt das Einkommen des Partners samt Urlaubs- und Weihnachtsgeld über der Freigrenze, abzüglich Sozialversicherung und mindestens ${h.eur(h.P.tarif.werbungskostenpauschale)} Werbungskosten. Erfüllen beide Partner die Voraussetzungen, bekommt ihn der mit den höheren Einkünften. Das sind aber Bedingungen für einzelne Absetzbeträge, keine gemeinsame Besteuerung.</p>

<h2>Der Arbeitsweg</h2>
<p>Das ${h.a('pendlerpauschale', 'Pendlerpauschale')} senkt die Bemessungsgrundlage, der Pendlereuro die Steuer direkt. Bei 30 Kilometern mit zumutbaren Öffis steigt das Netto im Beispiel um ${h.eur(pendler.nettoMonat - ledig.nettoMonat, 2)} im Monat, mehr als die Heirat je bringen kann. Wer wenig verdient und pendelt, bekommt außerdem einen erhöhten Verkehrsabsetzbetrag.</p>

<h2>Was Zuzügler konkret tun</h2>
<ol>
<li>Beim Eintritt dem Arbeitgeber Kinder, Alleinverdiener- oder Alleinerzieherstatus und Pendelstrecke melden; dafür gibt es Formulare des Finanzministeriums.</li>
<li>Familienbeihilfe beim Finanzamt beantragen, denn sie ist Voraussetzung für Familienbonus und Alleinverdienerabsetzbetrag.</li>
<li>Nach dem ersten Jahr die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} machen. Wer im Laufe des Jahres zugezogen ist, bekommt dabei oft Lohnsteuer zurück, weil die Lohnverrechnung so gerechnet hat, als hätte er das ganze Jahr gleich viel verdient.</li>
</ol>
`,
  },
  en: {
    slug: 'tax-classes-austria',
    nav: 'Tax classes in Austria?',
    card: 'Why Austria has no tax classes like Germany, and which credits lower your wage tax instead.',
    title: 'Tax Classes Austria 2026: Why There Are None and What Counts',
    description: `Austria has no tax classes in 2026: everyone is taxed individually. What lowers your wage tax instead, from the child credit to the ${EN.eur(A.avab_1_kind)} sole earner credit.`,
    h1: 'Tax classes in Austria: what replaces them',
    intro: 'For newcomers, especially from Germany, looking for a tax class on their Austrian payslip: how marriage, children and commuting actually change your wage tax.',
    resume: `Austria has no tax classes (Steuerklassen). Every person is taxed on their own income under the same scale in section 33 of the Income Tax Act, married or not, and couples are never assessed jointly. Getting married therefore does not change your wage tax by itself: on ${EN.eur(B)} gross a month in 2026 you take home ${EN.eur(ledig.nettoMonat, 2)}, single or married. What lowers the tax are credits (Absetzbeträge) tied to children, family circumstances and your commute. The child tax credit, Familienbonus Plus, takes ${EN.eur(A.familienbonus_monat_u18, 2)} a month per child under 18 straight off your tax. The sole earner credit of ${EN.eur(A.avab_1_kind)} a year with one child is only available if you have at least one child and your partner earns no more than ${EN.eur(A.avab_partner_einkuenfte_max)} a year; single parents get the same amount. If you pay maintenance for a child living elsewhere you get a monthly maintenance credit from ${EN.eur(A.unterhaltsabsetzbetrag[0])}, and commuters get the commuter allowance and commuter euro. You claim all of these through your employer or later in your annual tax assessment.`,
    faqs: [
      { q: 'Which tax class do I get in Austria as a married employee?', a: `None. Austrian law has no tax classes; your pay is taxed on your own income under section 33 of the Income Tax Act. Marriage alone brings no tax advantage. Only with a child can you claim the sole earner credit of ${EN.eur(A.avab_1_kind)} a year, provided your partner earns at most ${EN.eur(A.avab_partner_einkuenfte_max)}, on top of the Familienbonus Plus for each child. Single or married, the same gross gives the same net.` },
      { q: 'Is there income splitting for couples in Austria instead of tax classes?', a: `No. Each spouse is taxed separately, and there is no splitting of incomes between partners. If one earns a lot and the other little, the higher earner pays wage tax like a single person. Relief comes only through credits, and they generally require children. With one child under 18 and the full child credit, net pay on ${EN.eur(B)} gross rises by ${EN.eur(kind.nettoMonat - ledig.nettoMonat, 2)} a month.` },
      { q: 'Do I need to tell my Austrian employer anything instead of a tax class?', a: `Only if you want credits applied in your monthly pay: the Familienbonus Plus, the sole earner or single parent credit and the commuter allowance are claimed with a form given to your employer. Without it, payroll treats you as a person without children, with the ${EN.eur(A.verkehrsabsetzbetrag)} transport credit only. Nothing is lost, as everything can be claimed up to five years back in the annual tax assessment.` },
      { q: 'What does the Austrian sole earner credit compare to a German tax class?', a: `It is a fixed amount rather than a different scale: ${EN.eur(avab(1))} a year with one child, ${EN.eur(avab(2))} with two and ${EN.eur(avab(3))} with three. On ${EN.eur(B)} gross that is ${EN.eur(plusAvab, 2)} more net each month. It does not depend on your own income, only on your partner earning at most ${EN.eur(A.avab_partner_einkuenfte_max)} a year and on receiving family allowance for a child, according to the Finance Ministry.` },
    ],
    body: (h) => `
<h2>Individual taxation, no classes</h2>
<p>People moving from Germany usually look for their tax class on their first Austrian payslip. There is none. The ${h.src('estg33', 'income tax scale in section 33 of the Income Tax Act')} is the same for everyone and is applied to each person's own income only. Couples are not assessed jointly and incomes are not split; each partner files their own annual tax assessment (Arbeitnehmerveranlagung). Your marital status alone does not change your wage tax, so there is nothing to choose or switch after a wedding.</p>
<p>What makes Austrian wage tax personal are credits (Absetzbeträge). They are deducted from the tax itself, not from income, so each euro of credit is a euro less tax whatever your marginal rate. Allowances such as the commuter allowance (Pendlerpauschale) reduce taxable income instead.</p>

<h2>What changes your wage tax in Austria</h2>
${h.table(['Credit', 'Amount 2026', 'Condition'], [
  ['Transport credit (Verkehrsabsetzbetrag)', `${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)} a year`, 'every employee, automatic'],
  ['Child credit (Familienbonus Plus)', `${h.eur(h.P.absetzbetraege.familienbonus_monat_u18, 2)} a month per child under 18, ${h.eur(h.P.absetzbetraege.familienbonus_monat_ue18, 2)} from 18`, 'family allowance for the child, claim needed'],
  ['Sole earner credit (Alleinverdienerabsetzbetrag)', `${h.eur(h.P.absetzbetraege.avab_1_kind)} (1 child), ${h.eur(h.P.absetzbetraege.avab_2_kinder)} (2), +${h.eur(h.P.absetzbetraege.avab_je_weiteres_kind)} each further`, `a child, partner earns at most ${h.eur(h.P.absetzbetraege.avab_partner_einkuenfte_max)}`],
  ['Single parent credit (Alleinerzieherabsetzbetrag)', 'same as sole earner', 'over 6 months without partner, family allowance'],
  ['Maintenance credit (Unterhaltsabsetzbetrag)', `${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[0])} / ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[1])} / ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[2])} a month`, 'maintenance for a child living elsewhere'],
  ['Commuter euro (Pendlereuro)', `${h.eur(h.P.absetzbetraege.pendlereuro_je_km)} per km one way, per year`, 'entitled to the commuter allowance'],
], `Source: ${h.src('bmfAbsetzbetraege', 'Finance Ministry overview of tax credits')}`, ['l', 'l', 'l'])}

<h2>One salary, six situations</h2>
<p>The same gross salary of ${h.eur(B)} shows how little marital status matters and how much children and commuting do:</p>
${h.table(['Situation', 'Net per month', 'Difference to single'], fall.map((f) => [f.en, h.eur(f.k.nettoMonat, 2), h.eur(f.k.nettoMonat - ledig.nettoMonat, 2)]), 'Regular month 2026, outside Vienna, child credit for one child under 18', ['l', 'r', 'r'])}
<p>The second row surprises most newcomers: married with no children and a partner without income gives the same net as single. The ${h.a('alleinverdiener', 'sole earner credit')} requires, according to the ${h.src('bmfAvab', 'Finance Ministry')}, at least one child for whom family allowance (Familienbeihilfe) is paid. Only then does the ${h.eur(h.P.absetzbetraege.avab_partner_einkuenfte_max)} limit on your partner's income matter. That limit includes maternity pay and some tax-free foreign income, but not childcare allowance, unemployment benefit or family allowance.</p>
<!--mini:avab-->

<h2>The child credit: the biggest lever</h2>
<p>At ${h.eur(h.P.absetzbetraege.familienbonus_monat_u18 * 12, 2)} a year per child under 18, the ${h.a('familienbonus', 'Familienbonus Plus')} is the most valuable credit. It can only reduce tax to zero, not below, and parents may split it, each taking half. On ${h.eur(B)} gross it applies in full. Low earners may instead receive the ${h.a('kindermehrbetrag', 'Kindermehrbetrag')}, a cash top-up paid through the tax assessment.</p>

<h2>Separated parents and maintenance</h2>
<p>If you pay maintenance for a child who does not live with you, you get the ${h.a('unterhaltsabsetzbetrag', 'maintenance credit')}: ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[0])} a month for the first, ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[1])} for the second and ${h.eur(h.P.absetzbetraege.unterhaltsabsetzbetrag[2])} for each further child, only for months in which you paid maintenance in full. You claim it in the annual tax assessment with the L1k supplement form. The child credit can then be split between the parent receiving family allowance and the parent paying maintenance.</p>

<h2>Your commute</h2>
<p>The ${h.a('pendlerpauschale', 'commuter allowance')} lowers your taxable income and the commuter euro lowers the tax itself. With a 30 km commute and usable public transport, net pay in the example rises by ${h.eur(pendler.nettoMonat - ledig.nettoMonat, 2)} a month, more than marriage ever could. Low earners who commute also get a higher transport credit.</p>

<h2>What to do when you move to Austria</h2>
<ol>
<li>When you start, tell your employer about children, sole earner or single parent status and your commute, using the Finance Ministry's forms.</li>
<li>Apply for family allowance at the tax office; it is the gateway to the child credit and the sole earner credit.</li>
<li>After your first year, file the ${h.a('arbeitnehmerveranlagung', 'annual tax assessment')}. If you arrived mid-year you will often get wage tax back, because payroll taxed you as if you had earned the same amount all year.</li>
</ol>
`,
  },
});
