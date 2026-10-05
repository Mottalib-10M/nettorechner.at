import { defineGuide } from '../../lib/guide-types';
import { svLaufend, lohnsteuerLaufend, tarif } from '../../lib/engine/lohn';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

const A = P.absetzbetraege, V = P.veranlagung, WKP = P.tarif.werbungskostenpauschale;

/**
 * Vereinfachte Veranlagung nur für laufende Bezüge, ohne Kinder und ohne Pendlerpauschale (§ 33 Abs. 5 und 8 EStG):
 * Einkommen = Summe (Brutto − SV) − Werbungskosten (mindestens das Pauschale); Steuer = Tarif − Verkehrsabsetzbetrag − Zuschlag.
 * Ist sie negativ, werden 55 % der SV-Beiträge erstattet, höchstens 496 € plus Zuschlag (SV-Bonus), höchstens die Steuer unter null.
 * Sonderzahlungen mit festen Sätzen gehören nicht zum Einkommen und bleiben unberührt.
 */
function zuschlag(e: number): number {
  if (e <= A.vab_zuschlag_bis) return A.vab_zuschlag;
  if (e >= A.vab_zuschlag_einschleif_bis) return 0;
  return A.vab_zuschlag * (A.vab_zuschlag_einschleif_bis - e) / (A.vab_zuschlag_einschleif_bis - A.vab_zuschlag_bis);
}
function veranlagung(monate: number[], wk = 0) {
  const sv = monate.reduce((s, b) => s + svLaufend(b).summe, 0);
  const lstLohn = monate.reduce((s, b) => s + lohnsteuerLaufend(b - svLaufend(b).summe).lst, 0);
  const e = Math.max(0, monate.reduce((s, b) => s + b, 0) - sv - Math.max(WKP, wk));
  const z = zuschlag(e);
  const st = tarif(e) - A.verkehrsabsetzbetrag - z;
  const steuer = Math.max(0, st);
  const erstattung = st < 0 ? Math.min(-st, A.sv_rueckerstattung_quote * sv, A.sv_rueckerstattung_max + z) : 0;
  return { e, sv, lstLohn, steuer: r2(steuer), erstattung: r2(erstattung), gutschrift: r2(lstLohn - steuer + erstattung), zuschlag: z };
}
/** Fall 1: Eintritt im Juli mit 3.000 € (sechs Monate). */
const eintritt = veranlagung([3000, 3000, 3000, 3000, 3000, 3000]);
/** Fall 2: Teilzeit 1.350 € das ganze Jahr: keine Lohnsteuer, aber SV-Rückerstattung. */
const TZ = 1350;
const teilzeit = veranlagung(Array(12).fill(TZ));
/** Fall 3: 3.200 € ganzjährig, 900 € Werbungskosten (Fachliteratur, Kurs, Arbeitsmittel). */
const WK = 900;
const wkFall = veranlagung(Array(12).fill(3200), WK);

export default defineGuide({
  id: 'arbeitnehmerveranlagung',
  group: 'lohn',
  order: 80,
  mini: 'veranlagung',
  related: ['lohnzettel', 'kindermehrbetrag', 'familienbonus-beantragen', 'verkehrsabsetzbetrag', 'pendlerpauschale', 'lohnsteuer'],
  sources: ['ogvVeranlagung', 'ogvAntragslos', 'bmfVeranlagung', 'estg33'],
  de: {
    slug: 'arbeitnehmerveranlagung',
    nav: 'Arbeitnehmerveranlagung',
    card: 'Steuerausgleich 2026: wann er Geld bringt, wann er Pflicht ist, wie die automatische Gutschrift funktioniert.',
    title: 'Arbeitnehmerveranlagung 2026: Steuerausgleich, Fristen',
    description: `Arbeitnehmerveranlagung 2026: ${DE.num(V.antrag_frist_jahre)} Jahre Zeit, automatische Gutschrift ab ${DE.eur(V.antragslos_min_gutschrift)}, Pflicht ab ${DE.eur(V.pflicht_einkommen)} Einkommen. Was der Steuerausgleich Ihnen zurückbringt.`,
    h1: 'Die Arbeitnehmerveranlagung: Lohnsteuer zurückholen',
    intro: 'Wer zu viel Lohnsteuer bezahlt hat, wann das Finanzamt von selbst überweist und in welchen Fällen eine Erklärung Pflicht ist.',
    resume: `Mit der Arbeitnehmerveranlagung, umgangssprachlich Steuerausgleich, rechnet das Finanzamt die Lohnsteuer eines Jahres neu, so als hätten Sie gleichmäßig verdient, und berücksichtigt, was die Lohnverrechnung nicht wusste. Den Antrag mit dem Formular L1 oder über FinanzOnline können Sie ${DE.num(V.antrag_frist_jahre)} Jahre lang stellen, für ${P.year} also bis Ende ${P.year + V.antrag_frist_jahre}. Geld bringt er vor allem nach einem Eintritt oder Jobwechsel unter dem Jahr, bei Werbungskosten über dem Pauschale von ${DE.eur(WKP)}, bei Familienbonus, Alleinverdiener- oder Pendlerpauschale, die der Arbeitgeber nicht kannte, und bei kleinem Einkommen: Dann gibt es als SV-Rückerstattung ${DE.pct(A.sv_rueckerstattung_quote)} der Sozialversicherung zurück, höchstens ${DE.eur(A.sv_rueckerstattung_max)}, mit Pendlerpauschale ${DE.eur(A.sv_rueckerstattung_pendler_max)}, dazu bis zu ${DE.eur(A.vab_zuschlag)} SV-Bonus. Wer im Juli mit ${DE.eur(3000)} brutto beginnt, bekommt so rund ${DE.eur(eintritt.gutschrift)} zurück. Stellen Sie keinen Antrag und hatten nur Lohneinkünfte, überweist das Finanzamt eine Gutschrift ab ${DE.eur(V.antragslos_min_gutschrift)} auch automatisch. Pflicht ist die Erklärung bei mehr als ${DE.eur(V.pflicht_einkommen)} Einkommen in bestimmten Fällen, etwa bei zwei gleichzeitigen Dienstverhältnissen.`,
    faqs: [
      { q: 'Wie viele Jahre rückwirkend kann ich die Arbeitnehmerveranlagung machen?', a: `Fünf Jahre. Der Antrag kann bis zum Ablauf des fünften Jahres nach dem Veranlagungsjahr gestellt werden, für ${P.year} also bis 31. Dezember ${P.year + V.antrag_frist_jahre}. Das gilt auch, wenn das Finanzamt schon eine automatische Veranlagung durchgeführt hat: Ihre eigene Erklärung ersetzt dann den Bescheid. Kommt bei einer freiwilligen Veranlagung eine Nachzahlung heraus, können Sie den Antrag zurückziehen.` },
      { q: 'Wann macht das Finanzamt die Arbeitnehmerveranlagung automatisch?', a: `Wenn Sie bis 30. Juni des Folgejahres keine Erklärung abgegeben haben, nur lohnsteuerpflichtige Einkünfte hatten und die Daten eine Gutschrift ergeben. Erwartet das Finanzamt, dass Sie selbst Ausgaben geltend machen, wartet es zunächst; spätestens nach Ablauf des zweiten Folgejahres veranlagt es automatisch, wenn die Gutschrift mindestens ${DE.eur(V.antragslos_min_gutschrift)} beträgt. Grundlage ist § 41 Abs. 2a EStG.` },
      { q: 'Wann ist die Arbeitnehmerveranlagung Pflicht?', a: `Wenn Ihr Einkommen ${DE.eur(V.pflicht_einkommen)} übersteigt und ein Pflichtgrund vorliegt: etwa zwei gleichzeitige Dienstverhältnisse, die nicht gemeinsam versteuert wurden, ein zu Unrecht berücksichtigter Alleinverdiener-, erhöhter Verkehrsabsetzbetrag, Familienbonus oder Pendlerpauschale, oder andere Einkünfte über ${DE.eur(V.veranlagungsfreibetrag)}. Frist ist der 30. April, online der 30. Juni des Folgejahres. Bei Krankengeld fordert das Finanzamt die Erklärung an.` },
      { q: 'Wie viel bringt die SV-Rückerstattung in der Arbeitnehmerveranlagung bei Teilzeit?', a: `Bei ${DE.eur(TZ)} brutto im Monat zahlen Sie auf das laufende Gehalt keine Lohnsteuer, haben aber ${DE.eur(teilzeit.sv)} laufende Sozialversicherung im Jahr. Weil Verkehrsabsetzbetrag und Zuschlag die Steuer unter null drücken, erstattet das Finanzamt ${DE.eur(teilzeit.erstattung, 2)}. Grenze ist die Steuer unter null, höchstens ${DE.pct(A.sv_rueckerstattung_quote)} der Beiträge und ${DE.eur(A.sv_rueckerstattung_max)} plus Zuschlag (§ 33 Abs. 8 EStG).` },
      { q: `Lohnt sich die Arbeitnehmerveranlagung bei Werbungskosten unter ${DE.eur(WKP)}?`, a: `Für die Werbungskosten nicht, weil das Pauschale von ${DE.eur(WKP)} schon in jeder Lohnabrechnung abgezogen wird. Erst was darüber liegt, senkt die Steuer, mit Ihrem Grenzsteuersatz. Bei ${DE.eur(3200)} brutto und ${DE.eur(WK)} Werbungskosten im Jahr sind das ${DE.eur(wkFall.gutschrift, 2)}. Andere Gründe wie Kirchenbeitrag, Spenden oder ein Jobwechsel können sich trotzdem lohnen.` },
      { q: 'Kann ich den Familienbonus in der Arbeitnehmerveranlagung nachholen?', a: `Ja. Haben Sie den Familienbonus Plus nicht beim Arbeitgeber beantragt, beantragen Sie ihn mit der Beilage L1k in der Veranlagung, rückwirkend bis zu fünf Jahre. Er beträgt ${DE.eur(A.familienbonus_monat_u18, 2)} pro Monat und Kind unter 18. Ist Ihre Steuer zu gering, kann stattdessen ein Kindermehrbetrag von bis zu ${DE.eur(A.kindermehrbetrag)} je Kind ausbezahlt werden, wenn die Voraussetzungen erfüllt sind.` },
    ],
    body: (h) => `
<h2>Warum zu viel Lohnsteuer bezahlt wird</h2>
<p>Die Lohnverrechnung rechnet jeden Monat so, als würden Sie das ganze Jahr gleich viel verdienen (${h.src('ogvVeranlagung', 'oesterreich.gv.at')}). Wer erst im Juli beginnt, zahlt deshalb von Juli bis Dezember Lohnsteuer wie jemand mit dem vollen Jahresgehalt. Die Veranlagung setzt das tatsächliche Jahreseinkommen an, zieht die Absetzbeträge für das ganze Jahr ab und erstattet die Differenz. Außerdem kennt der Arbeitgeber viele Ihrer Ausgaben nicht: Fachliteratur, Kurse, Arbeitsmittel, Kinderbetreuungskosten oder Krankheitskosten.</p>

<h2>Drei typische Fälle mit Zahlen</h2>
${h.table(['Fall', 'Lohnsteuer bezahlt', 'Steuer laut Veranlagung', 'SV-Rückerstattung', 'Gutschrift'], [
  [`Eintritt im Juli, ${h.eur(3000)} brutto`, h.eur(eintritt.lstLohn, 2), h.eur(eintritt.steuer, 2), h.eur(eintritt.erstattung, 2), `<strong>${h.eur(eintritt.gutschrift, 2)}</strong>`],
  [`Teilzeit ${h.eur(TZ)} brutto, ganzjährig`, h.eur(teilzeit.lstLohn, 2), h.eur(teilzeit.steuer, 2), h.eur(teilzeit.erstattung, 2), `<strong>${h.eur(teilzeit.gutschrift, 2)}</strong>`],
  [`${h.eur(3200)} brutto, ${h.eur(WK)} Werbungskosten`, h.eur(wkFall.lstLohn, 2), h.eur(wkFall.steuer, 2), h.eur(wkFall.erstattung, 2), `<strong>${h.eur(wkFall.gutschrift, 2)}</strong>`],
], 'Nur laufende Bezüge 2026, ohne Kinder und Pendlerpauschale; Sonderzahlungen bleiben mit ihren festen Sätzen unverändert', ['l', 'r', 'r', 'r', 'r'])}
<p>Im ersten Fall liegt das Einkommen aus sechs Monaten bei ${h.eur(eintritt.e)}, also unter ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)}. Damit steht der volle Zuschlag zum ${h.a('verkehrsabsetzbetrag', 'Verkehrsabsetzbetrag')} zu, die Steuer wird negativ, und zur bezahlten Lohnsteuer kommt eine SV-Rückerstattung. Im zweiten Fall wird nie Lohnsteuer einbehalten; das Geld kommt allein aus der Rückerstattung, begrenzt durch die Steuer unter null. Im dritten Fall bringen die ${h.eur(WK - h.P.tarif.werbungskostenpauschale)} über dem Pauschale den Grenzsteuersatz zurück.</p>
<!--mini:kindermehrbetrag-->

<h2>Was Sie in der Veranlagung geltend machen</h2>
<p>Laut ${h.src('bmfVeranlagung', 'Finanzministerium')} lassen sich mit dem Formular L1 und seinen Beilagen unter anderem diese Posten beantragen:</p>
<ul>
<li><strong>Werbungskosten</strong> über ${h.eur(h.P.tarif.werbungskostenpauschale)}: Fortbildung, Fachliteratur, Arbeitsmittel, Gewerkschaftsbeitrag, soweit nicht schon vom Arbeitgeber abgezogen.</li>
<li><strong>Pendlerpauschale und Pendlereuro</strong>, wenn sie nicht schon in der Lohnverrechnung berücksichtigt wurden (${h.a('pendlerpauschale', 'Pendlerrechner')}).</li>
<li><strong>Alleinverdiener- und Alleinerzieherabsetzbetrag</strong>; laut BMF auch dann zu beantragen, wenn er bereits beim Arbeitgeber geltend gemacht wurde.</li>
<li><strong>Familienbonus Plus und Unterhaltsabsetzbetrag</strong> mit der Beilage L1k, außerdem der ${h.a('kindermehrbetrag', 'Kindermehrbetrag')} und der Mehrkindzuschlag.</li>
<li><strong>Sonderausgaben</strong>, die nicht automatisch gemeldet werden; Spenden und Kirchenbeitrag übermitteln die Organisationen selbst.</li>
<li><strong>Außergewöhnliche Belastungen</strong> mit der Beilage L1ab, etwa wegen einer Behinderung.</li>
</ul>
<p>Belege legen Sie nicht bei, Sie müssen sie aber sieben Jahre aufbewahren. Auch den ${h.a('lohnzettel', 'Jahreslohnzettel L16')} schickt der Arbeitgeber selbst.</p>

<h2>Negativsteuer: SV-Rückerstattung und SV-Bonus</h2>
<p>Wer so wenig verdient, dass die Absetzbeträge höher sind als die Tarifsteuer, bekommt einen Teil der Sozialversicherung zurück. Nach ${h.src('estg33', '§ 33 Abs. 8 EStG')} sind es ${h.pct(h.P.absetzbetraege.sv_rueckerstattung_quote, 0)} der Beiträge, höchstens ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)}; mit Anspruch auf Pendlerpauschale höchstens ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_pendler_max)}. Wer Anspruch auf den Zuschlag zum Verkehrsabsetzbetrag hat (Einkommen bis ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)}, eingeschliffen bis ${h.eur(h.P.absetzbetraege.vab_zuschlag_einschleif_bis)}), bekommt dazu den SV-Bonus von bis zu ${h.eur(h.P.absetzbetraege.vab_zuschlag)}. Die Erstattung ist immer auf die Steuer unter null begrenzt und läuft nur über die Veranlagung, nie über den Lohnzettel.</p>

<h2>Die automatische Veranlagung</h2>
<p>Seit es die ${h.src('ogvAntragslos', 'antragslose Arbeitnehmerveranlagung')} gibt, verfällt eine Gutschrift seltener. Das Finanzamt veranlagt ohne Antrag, wenn bis 30. Juni des Folgejahres keine Erklärung eingegangen ist, nur lohnsteuerpflichtige Einkünfte vorliegen und sich eine Gutschrift ergibt. Rechnet es damit, dass Sie selbst noch Ausgaben geltend machen, wartet es; spätestens nach Ablauf des zweiten Folgejahres wird bei einer Gutschrift von mindestens ${h.eur(h.P.veranlagung.antragslos_min_gutschrift)} jedenfalls veranlagt. Wer zum ersten Mal betroffen ist, bekommt in der zweiten Jahreshälfte ein Schreiben mit den gespeicherten Kontodaten.</p>
<p>Die automatische Veranlagung kennt nur, was dem Finanzamt gemeldet wurde. Werbungskosten, Alleinverdienerabsetzbetrag oder Familienbonus fehlen darin. Sie können innerhalb der fünf Jahre trotzdem eine eigene Erklärung abgeben; der automatische Bescheid wird dann aufgehoben.</p>

<h2>Pflichtveranlagung: wann Sie müssen</h2>
<p>Eine Erklärung ist Pflicht, wenn das Einkommen ${h.eur(h.P.veranlagung.pflicht_einkommen)} übersteigt und ein Pflichtgrund vorliegt. Die häufigsten laut ${h.src('bmfVeranlagung', 'BMF')}:</p>
<ul>
<li>zwei oder mehr gleichzeitige lohnsteuerpflichtige Bezüge, die nicht gemeinsam versteuert wurden, etwa zwei Teilzeitjobs;</li>
<li>Alleinverdiener- oder Alleinerzieherabsetzbetrag, erhöhter Verkehrsabsetzbetrag, Familienbonus oder Pendlerpauschale wurden berücksichtigt, obwohl die Voraussetzungen fehlten;</li>
<li>andere Einkünfte, etwa aus Vermietung oder einem Werkvertrag, von mehr als ${h.eur(h.P.veranlagung.veranlagungsfreibetrag)} im Jahr; dann ist es eine Einkommensteuererklärung E1;</li>
<li>ein Freibetragsbescheid wurde in der Lohnverrechnung berücksichtigt, oder es gab Bezüge aus dem Insolvenz-Entgelt-Fonds.</li>
</ul>
<p>Die Frist endet am 30. April, bei Abgabe über FinanzOnline am 30. Juni des Folgejahres. Bei zwei gleichzeitigen Jobs folgt oft eine Nachzahlung, weil jeder Arbeitgeber nur sein eigenes Gehalt versteuert hat; danach setzt das Finanzamt meist Vorauszahlungen fest.</p>
`,
  },
  en: {
    slug: 'employee-tax-assessment',
    nav: 'Annual tax assessment',
    card: 'Austria’s employee tax return (Arbeitnehmerveranlagung) in 2026: when it pays, when it is mandatory, how the automatic refund works.',
    title: 'Arbeitnehmerveranlagung 2026: Austria’s Employee Tax Refund',
    description: `Austrian employee tax assessment 2026: ${EN.num(V.antrag_frist_jahre)} years to file, automatic refunds from ${EN.eur(V.antragslos_min_gutschrift)}, mandatory above ${EN.eur(V.pflicht_einkommen)} in some cases. What a typical refund looks like.`,
    h1: 'The Arbeitnehmerveranlagung: getting wage tax back in Austria',
    intro: 'For employees in Austria: how the annual tax assessment recalculates your wage tax, when the tax office pays out on its own and when filing is compulsory.',
    resume: `The Arbeitnehmerveranlagung, often called Steuerausgleich, is Austria's annual tax assessment for employees: the tax office recalculates a year's wage tax as if you had earned evenly, and adds what your employer did not know. You file it on form L1 or online in FinanzOnline, the tax portal, and you have ${EN.num(V.antrag_frist_jahre)} years to do so, so ${P.year} can be filed until the end of ${P.year + V.antrag_frist_jahre}. It pays off mainly if you started or changed jobs during the year, had work expenses above the ${EN.eur(WKP)} flat allowance, missed the child credit, sole earner credit or commuter allowance in payroll, or earned little: low earners get back ${EN.pct(A.sv_rueckerstattung_quote)} of their social insurance, up to ${EN.eur(A.sv_rueckerstattung_max)}, or ${EN.eur(A.sv_rueckerstattung_pendler_max)} with the commuter allowance, plus a bonus of up to ${EN.eur(A.vab_zuschlag)}. Someone who starts in July on ${EN.eur(3000)} gross gets about ${EN.eur(eintritt.gutschrift)} back. If you file nothing and only had employment income, the tax office pays refunds of ${EN.eur(V.antragslos_min_gutschrift)} or more automatically. Filing is mandatory above ${EN.eur(V.pflicht_einkommen)} of income in specific cases, for example two jobs at the same time.`,
    faqs: [
      { q: 'How far back can I file an Austrian employee tax assessment?', a: `Five years. You can file until the end of the fifth year after the tax year, so ${P.year} until 31 December ${P.year + V.antrag_frist_jahre}. This also applies if the tax office has already issued an automatic assessment: your own return then replaces it. If a voluntary assessment shows that you owe money and there is no mandatory reason to file, you can withdraw it.` },
      { q: 'When does the Austrian tax office do my assessment automatically?', a: `If you have not filed by 30 June of the following year, had only employment income, and the data shows a refund. If the tax office expects you to claim expenses yourself, it waits; by the end of the second following year it assesses you anyway when the refund is at least ${EN.eur(V.antragslos_min_gutschrift)}. First-timers receive a letter in the second half of the year confirming the bank account to be used.` },
      { q: 'When is filing the Austrian employee tax assessment compulsory?', a: `When your income exceeds ${EN.eur(V.pflicht_einkommen)} and a specific reason applies: for example two jobs at once that were not taxed together, a sole earner credit, higher transport credit, child credit or commuter allowance granted without the conditions being met, or other income above ${EN.eur(V.veranlagungsfreibetrag)}. The deadline is 30 April, or 30 June when filing online, of the following year.` },
      { q: 'How much social insurance refund can a part-timer get in Austria?', a: `On ${EN.eur(TZ)} gross a month you pay no wage tax on your regular salary but ${EN.eur(teilzeit.sv)} a year in regular social insurance. Because the transport credit and its supplement push your tax below zero, the tax office refunds ${EN.eur(teilzeit.erstattung, 2)}. The refund is capped at the negative tax, at ${EN.pct(A.sv_rueckerstattung_quote)} of contributions and at ${EN.eur(A.sv_rueckerstattung_max)} plus the supplement, under section 33(8) of the Income Tax Act.` },
      { q: 'Can I claim the Austrian child credit afterwards in the tax assessment?', a: `Yes. If you did not claim the Familienbonus Plus through your employer, add it with the L1k supplement in your assessment, up to five years back. It is worth ${EN.eur(A.familienbonus_monat_u18, 2)} a month per child under 18. If your tax is too low to use it, a cash Kindermehrbetrag of up to ${EN.eur(A.kindermehrbetrag)} per child may be paid instead, provided the conditions are met.` },
    ],
    body: (h) => `
<h2>Why too much wage tax is withheld</h2>
<p>Payroll works out each month as if you would earn the same all year (${h.src('ogvVeranlagung', 'oesterreich.gv.at')}). If you arrive in Austria and start in July, you pay wage tax from July to December like someone on a full annual salary. The assessment uses your actual income for the year, deducts the full annual credits and refunds the difference. Your employer also knows nothing about many of your costs: professional books, courses, work equipment, childcare or medical expenses.</p>

<h2>Three typical cases in figures</h2>
${h.table(['Case', 'Wage tax withheld', 'Tax per assessment', 'SI refund', 'Refund total'], [
  [`Start in July, ${h.eur(3000)} gross`, h.eur(eintritt.lstLohn, 2), h.eur(eintritt.steuer, 2), h.eur(eintritt.erstattung, 2), `<strong>${h.eur(eintritt.gutschrift, 2)}</strong>`],
  [`Part-time ${h.eur(TZ)} gross, full year`, h.eur(teilzeit.lstLohn, 2), h.eur(teilzeit.steuer, 2), h.eur(teilzeit.erstattung, 2), `<strong>${h.eur(teilzeit.gutschrift, 2)}</strong>`],
  [`${h.eur(3200)} gross, ${h.eur(WK)} work expenses`, h.eur(wkFall.lstLohn, 2), h.eur(wkFall.steuer, 2), h.eur(wkFall.erstattung, 2), `<strong>${h.eur(wkFall.gutschrift, 2)}</strong>`],
], 'Regular pay only, 2026, no children or commuter allowance; holiday and Christmas pay keep their fixed-rate tax', ['l', 'r', 'r', 'r', 'r'])}
<p>In the first case, six months of income come to ${h.eur(eintritt.e)}, below ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)}. That unlocks the full supplement to the ${h.a('verkehrsabsetzbetrag', 'transport credit')}, the tax turns negative, and on top of the wage tax you paid you receive a social insurance refund. In the second case no wage tax was ever withheld; the money comes from the refund alone, capped at the negative tax. In the third, the ${h.eur(WK - h.P.tarif.werbungskostenpauschale)} above the flat allowance return your marginal rate.</p>
<!--mini:kindermehrbetrag-->

<h2>What you can claim</h2>
<p>According to the ${h.src('bmfVeranlagung', 'Finance Ministry')}, form L1 and its supplements cover, among other things:</p>
<ul>
<li><strong>Work expenses</strong> (Werbungskosten) above ${h.eur(h.P.tarif.werbungskostenpauschale)}: training, professional literature, work equipment, union dues not already deducted by your employer.</li>
<li><strong>Commuter allowance and commuter euro</strong>, if payroll did not already apply them (${h.a('pendlerpauschale', 'commuter calculator')}).</li>
<li><strong>Sole earner and single parent credit</strong>; the ministry says to claim it here even if your employer already applied it.</li>
<li><strong>Child credit and maintenance credit</strong> on supplement L1k, plus the ${h.a('kindermehrbetrag', 'Kindermehrbetrag')} and the large-family supplement.</li>
<li><strong>Special expenses</strong> not reported automatically; donations and church contributions are reported by the organisations.</li>
<li><strong>Extraordinary burdens</strong> on supplement L1ab, for instance due to a disability.</li>
</ul>
<p>Do not attach receipts, but keep them for seven years. Your employer sends the ${h.a('lohnzettel', 'annual L16 payslip')} directly.</p>

<h2>Negative tax: the social insurance refund</h2>
<p>If your credits exceed the tax on the scale, part of your social insurance comes back. Under ${h.src('estg33', 'section 33(8) of the Income Tax Act')} it is ${h.pct(h.P.absetzbetraege.sv_rueckerstattung_quote, 0)} of contributions, up to ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)}; with a commuter allowance up to ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_pendler_max)}. If you qualify for the transport credit supplement (income up to ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)}, phased out by ${h.eur(h.P.absetzbetraege.vab_zuschlag_einschleif_bis)}), the cap rises by up to ${h.eur(h.P.absetzbetraege.vab_zuschlag)}, the so-called SV-Bonus. The refund never exceeds the negative tax and only comes through the assessment, never through payroll.</p>

<h2>The automatic assessment</h2>
<p>With the ${h.src('ogvAntragslos', 'automatic assessment')} (antragslose Arbeitnehmerveranlagung), fewer refunds go unclaimed. The tax office acts without a return if none arrived by 30 June of the following year, you had employment income only, and a refund results. If it expects you to claim expenses, it waits; by the end of the second following year it assesses anyway when the refund is at least ${h.eur(h.P.veranlagung.antragslos_min_gutschrift)}. First-timers get a letter in the second half of the year listing the bank details on file.</p>
<p>The automatic version only knows what has been reported. Work expenses, the sole earner credit or the child credit are missing. You can still file your own return within the five years, and the automatic notice is then cancelled.</p>

<h2>When filing is mandatory</h2>
<p>A return is compulsory if your income exceeds ${h.eur(h.P.veranlagung.pflicht_einkommen)} and one of the listed reasons applies. The most common, according to the ${h.src('bmfVeranlagung', 'ministry')}:</p>
<ul>
<li>two or more simultaneous employments that were not taxed together, such as two part-time jobs;</li>
<li>a sole earner or single parent credit, higher transport credit, child credit or commuter allowance was applied without the conditions being met;</li>
<li>other income, such as rent or freelance work, above ${h.eur(h.P.veranlagung.veranlagungsfreibetrag)} a year, in which case you file the income tax return E1;</li>
<li>an exemption notice was applied in payroll, or you received payments from the insolvency fund.</li>
</ul>
<p>The deadline is 30 April, or 30 June when filed through FinanzOnline, of the following year. Two simultaneous jobs often lead to a back payment, since each employer only taxed its own salary; the tax office then usually sets advance payments.</p>
`,
  },
});
