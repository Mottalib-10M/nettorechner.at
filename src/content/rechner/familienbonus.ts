import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend, familienbonusMonat, tarif, type Steuerprofil } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const A = P.absetzbetraege;

/** Netto-Plus im Monat durch den Familienbonus (laufender Bezug, Arbeitsort außerhalb Wiens). */
const plus = (b: number, p: Steuerprofil) => { const sv = svLaufend(b).summe; return lohnsteuerLaufend(b - sv).lst - lohnsteuerLaufend(b - sv, p).lst; };
/** Kleinstes Monatsbrutto (auf 1 € genau), ab dem der volle Bonus als Netto ankommt. */
const vollAb = (p: Steuerprofil) => { const f = familienbonusMonat(p); let b = 600; while (plus(b, p) < f - 0.005 && b < 20000) b++; return b; };
const voll1 = vollAb({ kinderU18: 1 }), voll2 = vollAb({ kinderU18: 2 }), voll3 = vollAb({ kinderU18: 3 });
const vollGeteilt = vollAb({ kinderU18: 1, fbGeteilt: true }), vollUe18 = vollAb({ kinderUe18: 1 });

/** Tabelle: was der Bonus bei welchem Gehalt bringt, aus kurz(). */
const STUFEN = [1500, 2000, 2500, 3000, 3500, 4000];
const tab = STUFEN.map((b) => { const o = kurz(b).nettoMonat; return { b, k: [1, 2, 3].map((n) => kurz(b, { kinderU18: n }).nettoMonat - o) }; });

/** Beispiel 2.000 € brutto, zwei Kinder: nur ein Teil wirkt. */
const BSP = 2000;
const bspPlus = plus(BSP, { kinderU18: 2 }), bspMax = familienbonusMonat({ kinderU18: 2 });

/** Kindermehrbetrag (wie im Rechner): Tarifsteuer unter 700 € → Differenz, je weiteres Kind 700 € mehr. */
const KMB_B = 1500;
const kmbTarif = tarif(Math.max(0, (KMB_B - svLaufend(KMB_B).summe) * 12 - P.tarif.werbungskostenpauschale));
const kmb1 = kmbTarif >= A.kindermehrbetrag ? 0 : A.kindermehrbetrag - kmbTarif;

export default defineGuide({
  id: 'familienbonus',
  group: 'rechner',
  order: 40,
  tool: 'familienbonus',
  related: ['familienbonus-beantragen', 'kindermehrbetrag', 'alleinverdiener', 'unterhaltsabsetzbetrag', 'lohnsteuer'],
  sources: ['estg33', 'bmfFamilienbonus', 'ogvKindermehrbetrag'],
  de: {
    slug: 'familienbonus-plus-rechner',
    nav: 'Familienbonus-Plus-Rechner',
    card: 'Wie viel vom Familienbonus Plus bei Ihrem Gehalt wirklich wirkt, für ein bis drei Kinder und geteilt.',
    title: 'Familienbonus Plus Rechner 2026: wie viel bei Ihnen wirkt',
    description: `Familienbonus Plus 2026: bis ${DE.eur(A.familienbonus_monat_u18, 2)} je Kind und Monat, aber nur so viel wie Ihre Lohnsteuer. Ab welchem Brutto er bei 1, 2 oder 3 Kindern voll wirkt.`,
    h1: 'Wie viel Familienbonus Plus bei Ihrem Gehalt ankommt',
    intro: 'Der Bonus ist hoch, aber gedeckelt: Er senkt nur die Lohnsteuer, die Sie tatsächlich zahlen. Der Rechner zeigt, welcher Teil bei Ihnen wirkt.',
    resume: `Der Familienbonus Plus beträgt 2026 ${DE.eur(A.familienbonus_monat_u18, 2)} pro Monat für jedes Kind bis zum Monat seines 18. Geburtstags und ${DE.eur(A.familienbonus_monat_ue18, 2)} danach, solange Familienbeihilfe bezogen wird. Er ist ein Absetzbetrag und wird direkt von der Lohnsteuer abgezogen, aber nie weiter als bis auf null. Deshalb kommt er nur bei ausreichendem Gehalt in voller Höhe an: Für ein Kind unter 18 braucht es dafür rund ${DE.eur(voll1)} brutto im Monat, für zwei Kinder ${DE.eur(voll2)}, für drei ${DE.eur(voll3)} (Arbeitsort außerhalb Wiens, ohne weitere Absetzbeträge). Wer weniger verdient, verliert den Rest, außer er hat Anspruch auf den Kindermehrbetrag. Teilen sich beide Elternteile den Bonus je zur Hälfte, reicht für ein Kind schon ${DE.eur(vollGeteilt)} brutto, damit jede Hälfte ganz wirkt; das lohnt sich, wenn ein Elternteil zu wenig Steuer zahlt. Der Rechner zieht den Bonus in Ihrem Lohnzettel ab und zeigt, welcher Teil wirkt und welcher verfällt.`,
    faqs: [
      { q: 'Warum bekomme ich mit zwei Kindern nicht den ganzen Familienbonus Plus?', a: `Weil der Bonus nur Lohnsteuer ersetzen kann, die tatsächlich anfällt. Bei ${DE.eur(BSP)} brutto stünden für zwei Kinder ${DE.eur(bspMax, 2)} im Monat zu, wirken aber nur ${DE.eur(bspPlus, 2)}. Den vollen Betrag bekommen Sie mit zwei Kindern ab etwa ${DE.eur(voll2)} brutto. Der Rest verfällt, wenn kein Kindermehrbetrag zusteht. Eine Teilung mit dem anderen Elternteil kann helfen, wenn dieser mehr verdient.` },
      { q: 'Wann lohnt es sich, den Familienbonus Plus zwischen den Eltern zu teilen?', a: `Wenn ein Elternteil zu wenig Lohnsteuer zahlt, um den ganzen Bonus zu nutzen, der andere aber genug. Bei einer Teilung je zur Hälfte wirkt der halbe Bonus für ein Kind schon ab rund ${DE.eur(vollGeteilt)} brutto voll. Verdient ein Elternteil deutlich mehr, ist der volle Bonus bei ihm meist günstiger. Die Aufteilung ist bei gleichbleibenden Verhältnissen für das ganze Kalenderjahr einheitlich zu beantragen (§ 33 Abs. 3a EStG).` },
      { q: 'Was gilt beim Familienbonus Plus für Kinder ab 18 Jahren?', a: `Ab dem Monat nach dem 18. Geburtstag sinkt der Bonus auf ${DE.eur(A.familienbonus_monat_ue18, 2)} im Monat und steht nur zu, solange für das Kind Familienbeihilfe bezogen wird, etwa während Ausbildung oder Studium. Weil der Betrag kleiner ist, wirkt er schon ab rund ${DE.eur(vollUe18)} brutto voll. Im Rechner tragen Sie solche Kinder im Feld „Kinder ab 18 mit Familienbeihilfe“ ein.` },
      { q: 'Was ist der Kindermehrbetrag beim Familienbonus Plus?', a: `Ein Ausgleich für geringe Einkommen: Liegt Ihre Tarifsteuer unter ${DE.eur(A.kindermehrbetrag)} im Jahr, bekommen Sie die Differenz zu ${DE.eur(A.kindermehrbetrag)} je Kind über die Arbeitnehmerveranlagung ausbezahlt. Voraussetzung ist der Alleinverdiener- oder Alleinerzieherabsetzbetrag oder eine ebenfalls geringe Steuer des Partners. Bei ${DE.eur(KMB_B)} brutto und einem Kind sind das laut Rechner ${DE.eur(kmb1)} im Jahr.` },
    ],
    body: (h) => `
<h2>Was der Rechner zeigt</h2>
<p>Sie geben Ihr Bruttogehalt pro Monat, das Bundesland des Arbeitsorts, die Zahl der Kinder unter und ab 18 und eine allfällige Teilung ein. Der Rechner lässt Ihren Lohnzettel zweimal laufen, mit und ohne Bonus, und zeigt als große Zahl den Familienbonus, der bei Ihnen wirkt, daneben den möglichen Höchstbetrag. Liegt Ihre Steuer zu niedrig, erscheint der nicht nutzbare Rest als eigene Zeile. Wählen Sie Alleinverdiener oder Alleinerzieher, rechnet er auch den Kindermehrbetrag dazu.</p>
<h2>Der Bonus nach Gehalt und Kinderzahl</h2>
${h.table(['Brutto pro Monat', '1 Kind', '2 Kinder', '3 Kinder'], tab.map((z) => [h.eur(z.b), ...z.k.map((x) => h.eur(x, 2))]), 'Mehr Netto pro Monat durch den Familienbonus Plus, Kinder unter 18, Bonus voll beim selben Elternteil, Arbeitsort außerhalb Wiens', ['r', 'r', 'r', 'r'])}
<p>Bei ${h.eur(STUFEN[0])} brutto fällt keine Lohnsteuer an, der Bonus bringt im Lohnzettel nichts. Ab ${h.eur(voll1)} wirkt er für ein Kind voll, ab ${h.eur(voll2)} für zwei, ab ${h.eur(voll3)} für drei. Wo die Zeilen für zwei und drei Kinder gleich sind, ist die Lohnsteuer bereits aufgebraucht: ein drittes Kind bringt dort keinen Cent mehr im Lohnzettel.</p>
<h2>Warum der Bonus an der Lohnsteuer endet</h2>
<p>Der Familienbonus Plus ist nach ${h.src('estg33', '§ 33 Abs. 3a EStG')} ein Absetzbetrag. Er wird von der Tarifsteuer abgezogen, vor dem Verkehrsabsetzbetrag und den anderen Absetzbeträgen, und kann die Steuer nur bis auf null senken. Eine Auszahlung des Rests gibt es nicht; sie gibt es nur in Form des Kindermehrbetrags für Menschen mit sehr geringer Steuer. Deshalb verfällt bei mittleren Gehältern mit mehreren Kindern oft ein Teil, und deshalb ist die Aufteilung zwischen den Eltern mehr als eine Formalität.</p>
<h2>Teilen oder beim Besserverdiener lassen</h2>
<p>Der Bonus steht pro Kind einmal zu. Er kann ganz bei einem Elternteil oder je zur Hälfte bei beiden berücksichtigt werden. Faustregel aus dem Rechner: Liegt der Besserverdiener über der Schwelle für die volle Kinderzahl, ist der ganze Bonus dort am besten aufgehoben. Liegt er darunter und der andere Elternteil zahlt ebenfalls genug Lohnsteuer, kann die Teilung mehr herausholen. Mit einem Kind wirkt eine Hälfte ab ${h.eur(vollGeteilt)} brutto voll. Prüfen Sie beide Varianten im Rechner mit dem Feld „Familienbonus geteilt“. Ein Antrag lässt sich bis fünf Jahre nach Rechtskraft des Bescheids zurückziehen (${h.src('estg33', '§ 33 Abs. 3a Z 3 lit. e EStG')}); damit kann eine ungünstige Aufteilung später korrigiert werden. Voraussetzungen und Formulare beschreibt das ${h.src('bmfFamilienbonus', 'Finanzministerium')}.</p>
<h2>Kindermehrbetrag für kleine Einkommen</h2>
<p>Wer Anspruch auf den ${h.a('alleinverdiener', 'Alleinverdiener- oder Alleinerzieherabsetzbetrag')} hat und eine Tarifsteuer unter ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} im Jahr, bekommt die Differenz als ${h.a('kindermehrbetrag', 'Kindermehrbetrag')} ausbezahlt, für jedes weitere Kind ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} mehr (${h.src('ogvKindermehrbetrag', 'oesterreich.gv.at')}). Bei ${h.eur(KMB_B)} brutto und einem Kind beträgt die Tarifsteuer ${h.eur(kmbTarif, 2)} im Jahr, der Kindermehrbetrag ${h.eur(kmb1, 2)}. Er kommt erst mit der Arbeitnehmerveranlagung, nicht im Lohnzettel.</p>
<h2>Beantragen</h2>
<p>Damit der Bonus schon im laufenden Gehalt wirkt, beantragen Sie ihn beim Arbeitgeber; sonst bekommen Sie ihn rückwirkend über die Veranlagung. Wie das geht und welche Nachweise gebraucht werden, steht auf der Seite ${h.a('familienbonus-beantragen', 'Familienbonus beantragen')}. Zahlen Sie Unterhalt für ein Kind, das nicht bei Ihnen lebt, gelten eigene Regeln, siehe ${h.a('unterhaltsabsetzbetrag', 'Unterhaltsabsetzbetrag')}.</p>
`,
  },
  en: {
    slug: 'familienbonus-plus-calculator',
    nav: 'Familienbonus Plus calculator',
    card: 'How much of the Austrian child tax credit actually applies at your salary, for one to three children or shared.',
    title: 'Familienbonus Plus Calculator 2026: Child Tax Credit Austria',
    description: `Familienbonus Plus 2026: up to ${EN.eur(A.familienbonus_monat_u18, 2)} per child a month, capped at the wage tax you pay. See the gross salary at which 1, 2 or 3 children count in full.`,
    h1: 'How much Familienbonus Plus reaches your payslip',
    intro: 'The child tax credit is generous but capped: it only cancels wage tax you actually pay. The calculator shows how much of it works for you.',
    resume: `Familienbonus Plus, Austria's child tax credit, is worth ${EN.eur(A.familienbonus_monat_u18, 2)} a month in 2026 for each child up to the month of their 18th birthday and ${EN.eur(A.familienbonus_monat_ue18, 2)} afterwards, for as long as family allowance (Familienbeihilfe) is paid. It is deducted straight from your wage tax, but never below zero. That is why it only arrives in full on a sufficient salary: around ${EN.eur(voll1)} gross a month for one child under 18, ${EN.eur(voll2)} for two and ${EN.eur(voll3)} for three (workplace outside Vienna, no other credits). Below those amounts the unused part is lost unless you qualify for the Kindermehrbetrag, a small cash top-up for low earners. If both parents split the credit half and half, one child needs only ${EN.eur(vollGeteilt)} gross for each half to work in full, which helps when one partner pays too little tax. The calculator applies the credit to your payslip and shows which part works and which part is lost. Expats should note that the child must live in the EU, the EEA or Switzerland.`,
    faqs: [
      { q: 'Why do I not get the full Familienbonus Plus for my two children?', a: `Because the credit can only replace wage tax that is actually due. On ${EN.eur(BSP)} gross, two children would be worth ${EN.eur(bspMax, 2)} a month, yet only ${EN.eur(bspPlus, 2)} applies. You get the full amount for two children from about ${EN.eur(voll2)} gross. The rest is lost unless the Kindermehrbetrag applies. Splitting the credit with a higher-earning partner can recover part of it.` },
      { q: 'When should parents split the Familienbonus Plus between them?', a: `When one parent pays too little wage tax to use the whole credit and the other pays enough. With a 50/50 split, half the credit for one child works in full from about ${EN.eur(vollGeteilt)} gross. If one parent earns much more, keeping the full credit there is usually better. The split must be applied for consistently for the whole calendar year if circumstances stay the same (section 33(3a) of the Income Tax Act).` },
      { q: 'How much Familienbonus Plus is there for a child over 18?', a: `From the month after the 18th birthday the credit drops to ${EN.eur(A.familienbonus_monat_ue18, 2)} a month and only applies while family allowance is paid for the child, typically during training or university. Because it is smaller, it works in full from about ${EN.eur(vollUe18)} gross. Enter such children in the field for children aged 18 or over with family allowance.` },
      { q: 'What is the Kindermehrbetrag that comes with Familienbonus Plus?', a: `A top-up for low incomes. If your tax under the scale is below ${EN.eur(A.kindermehrbetrag)} a year, you receive the difference to ${EN.eur(A.kindermehrbetrag)} per child through the annual tax assessment. You need the sole earner or single parent credit, or a partner whose tax is also that low. On ${EN.eur(KMB_B)} gross with one child the calculator shows ${EN.eur(kmb1)} a year.` },
    ],
    body: (h) => `
<h2>What the calculator shows</h2>
<p>Enter your monthly gross salary, the federal state where you work, the number of children under and over 18 and whether you share the credit. The calculator runs your payslip twice, with and without the credit, and shows the Familienbonus that actually applies as the headline figure next to the possible maximum. If your tax is too low, the unusable remainder appears on its own line. Choose sole earner or single parent and it adds the Kindermehrbetrag.</p>
<h2>The credit by salary and number of children</h2>
${h.table(['Gross per month', '1 child', '2 children', '3 children'], tab.map((z) => [h.eur(z.b), ...z.k.map((x) => h.eur(x, 2))]), 'Extra net pay per month from Familienbonus Plus, children under 18, full credit with one parent, workplace outside Vienna', ['r', 'r', 'r', 'r'])}
<p>At ${h.eur(STUFEN[0])} gross there is no wage tax, so the credit adds nothing to the payslip. It works in full for one child from ${h.eur(voll1)}, for two from ${h.eur(voll2)} and for three from ${h.eur(voll3)}. Where the columns for two and three children show the same figure, the wage tax is already used up and a third child adds nothing on the payslip.</p>
<h2>Why the credit stops at your wage tax</h2>
<p>Under ${h.src('estg33', 'section 33(3a) of the Income Tax Act')} the Familienbonus Plus is a tax credit. It comes off the tax calculated on the scale, before the transport credit and other credits, and can only bring the tax down to zero. Nothing is paid out beyond that, apart from the Kindermehrbetrag for very low tax bills. On mid-range salaries with several children part of the credit is therefore often lost, which makes the split between parents a real decision rather than paperwork.</p>
<h2>Sharing it or keeping it with the higher earner</h2>
<p>Each child carries one credit. It can sit entirely with one parent or be split half and half. A rule of thumb from the calculator: if the higher earner is above the threshold for your number of children, keep the whole credit there. If not, and the other parent also pays enough wage tax, splitting can recover more. With one child, each half works in full from ${h.eur(vollGeteilt)} gross. Try both options with the split field. A claim can be withdrawn up to five years after the tax assessment becomes final (${h.src('estg33', 'section 33(3a)(3)(e)')}), so a poor choice can be corrected later. The ${h.src('bmfFamilienbonus', 'Finance Ministry')} describes the conditions and forms.</p>
<h2>Kindermehrbetrag for small incomes</h2>
<p>If you qualify for the ${h.a('alleinverdiener', 'sole earner or single parent credit')} and your tax under the scale is below ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} a year, the difference is paid out as the ${h.a('kindermehrbetrag', 'Kindermehrbetrag')}, plus ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} for each further child (${h.src('ogvKindermehrbetrag', 'oesterreich.gv.at')}). On ${h.eur(KMB_B)} gross with one child the tax is ${h.eur(kmbTarif, 2)} a year and the Kindermehrbetrag ${h.eur(kmb1, 2)}. It arrives with the annual tax assessment (Arbeitnehmerveranlagung), not on the payslip.</p>
<h2>Claiming it</h2>
<p>To have the credit in your monthly pay, claim it with your employer; otherwise you get it back through the annual assessment. The page on ${h.a('familienbonus-beantragen', 'claiming Familienbonus Plus')} explains the steps and the evidence needed. If you pay maintenance for a child who does not live with you, separate rules apply, see the ${h.a('unterhaltsabsetzbetrag', 'maintenance credit')}.</p>
`,
  },
});
