import { defineGuide } from '../../lib/guide-types';
import { svLaufend, lohnsteuerLaufend, tarif } from '../../lib/engine/lohn';
import { kurz } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

/** Lohnsteuer-Tabelle aus dem Motor: laufender Monatsbezug, alleinstehend, ohne Pendler, außerhalb Wiens. */
const BRUTTOS = [1500, 2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 9000];
const zeile = (b: number) => {
  const sv = svLaufend(b), l = lohnsteuerLaufend(b - sv.summe);
  return { b, sv: sv.summe, lst: l.lst, bem: l.bemessungJahr, gs: l.grenzsteuersatz, ds: b > 0 ? l.lst / b : 0, netto: b - sv.summe - l.lst };
};
const tab = BRUTTOS.map(zeile);
/** Rechenweg Schritt für Schritt bei 3.000 € brutto. */
const B = 3000;
const svB = svLaufend(B).summe, stpfl = B - svB;
const lB = lohnsteuerLaufend(stpfl);
const tarifJahrB = tarif(lB.bemessungJahr);
/** Bis zu welchem Monatsbrutto keine Lohnsteuer anfällt (auf den Euro, aus dem Motor). */
let nullBis = 1000;
while (lohnsteuerLaufend(nullBis + 1 - svLaufend(nullBis + 1).summe).lst === 0) nullBis++;
/** Ein Gehalt mit 40-%-Grenzsteuersatz: 5.000 €. */
const g5 = zeile(5000), k5 = kurz(5000);
const T = P.tarif, G = T.grenzen, S = T.saetze, G27 = T.grenzen_2027;
const WK = T.werbungskostenpauschale, VAB = P.absetzbetraege.verkehrsabsetzbetrag;
/** Steuer auf 100 € mehr bei 5.000 €: Grenzbelastung durch Lohnsteuer allein. */
const mehr5 = zeile(5100).lst - g5.lst;

export default defineGuide({
  id: 'lohnsteuer',
  group: 'lohn',
  order: 10,
  mini: 'lohnsteuer',
  related: ['sozialversicherung', 'lohnzettel', 'jahresgehalt', 'arbeitnehmerveranlagung', 'verkehrsabsetzbetrag', 'familienbonus'],
  sources: ['estg33', 'bmfPresse', 'bmfRechner'],
  de: {
    slug: 'lohnsteuer-tabelle',
    nav: 'Lohnsteuer-Tabelle 2026',
    card: 'Tarifstufen 2026, der Rechenweg im Lohnzettel und die Lohnsteuer für Monatsgehälter von 1.500 bis 9.000 Euro.',
    title: 'Lohnsteuer 2026: Tarifstufen, Tabelle und Rechenweg',
    description: `Lohnsteuer 2026 in Österreich: Tarifstufen von ${DE.pct(S[0])} bis ${DE.pct(S[6])}, der Rechenweg im Lohnzettel und eine Tabelle für ${DE.eur(BRUTTOS[0])} bis ${DE.eur(BRUTTOS[9])} Bruttogehalt im Monat.`,
    h1: 'Lohnsteuer in Österreich: Tarif, Tabelle und Rechenweg',
    intro: 'Wie aus dem Jahrestarif des Einkommensteuergesetzes die Lohnsteuer auf Ihrem Monatszettel wird, und warum der Grenzsteuersatz nicht Ihre Steuerquote ist.',
    resume: `Die Lohnsteuer 2026 folgt dem Tarif des § 33 EStG: Jahreseinkommen bis ${DE.eur(G[0])} bleiben steuerfrei, darüber gelten ${DE.pct(S[1])}, ab ${DE.eur(G[1])} ${DE.pct(S[2])}, ab ${DE.eur(G[2])} ${DE.pct(S[3])}, ab ${DE.eur(G[3])} ${DE.pct(S[4])}, ab ${DE.eur(G[4])} ${DE.pct(S[5])} und über einer Million ${DE.pct(S[6])}. Die Grenzen wurden für 2026 um ${DE.pct(T.indexierung_2026, 2)} angehoben. Im Lohnzettel rechnet der Arbeitgeber das laufende Monatsgehalt nach Abzug der Sozialversicherung mal zwölf, zieht ${DE.eur(WK)} Werbungskostenpauschale ab, wendet den Tarif an, zieht Absetzbeträge wie den Verkehrsabsetzbetrag von ${DE.eur(VAB)} ab und teilt durch zwölf. Bei ${DE.eur(B)} brutto ergibt das ${DE.eur(lB.lst, 2)} Lohnsteuer im Monat, bei ${DE.eur(5000)} sind es ${DE.eur(g5.lst, 2)}. Bis etwa ${DE.eur(nullBis)} Monatsbrutto fällt keine Lohnsteuer an. Der Grenzsteuersatz sagt, was vom nächsten Euro weggeht; die tatsächliche Belastung liegt weit darunter, bei ${DE.eur(5000)} brutto etwa ${DE.pct(g5.ds, 1)} des Bruttos.`,
    faqs: [
      { q: 'Ab welchem Monatsgehalt zahlt man in Österreich Lohnsteuer?', a: `Bei einem alleinstehenden Angestellten ohne Pendlerpauschale wird ab rund ${DE.eur(nullBis + 1)} brutto im Monat erstmals Lohnsteuer fällig. Darunter bleibt die Bemessungsgrundlage zwar über der Nullstufe von ${DE.eur(G[0])}, aber der Verkehrsabsetzbetrag von ${DE.eur(VAB)} im Jahr deckt die Tarifsteuer noch ab. Mit Familienbonus Plus oder Alleinverdienerabsetzbetrag verschiebt sich die Schwelle deutlich nach oben (§ 33 EStG).` },
      { q: 'Warum ist die Lohnsteuer im Lohnzettel niedriger als mein Steuersatz?', a: `Weil der Tarif in Stufen wirkt. Der Satz Ihrer Stufe gilt nur für den Teil des Einkommens darüber, alles darunter wird mit den niedrigeren Sätzen oder gar nicht besteuert, und danach werden Absetzbeträge abgezogen. Bei ${DE.eur(5000)} brutto liegt der Grenzsteuersatz bei ${DE.pct(g5.gs)}, die Lohnsteuer von ${DE.eur(g5.lst, 2)} macht aber nur ${DE.pct(g5.ds, 1)} des Bruttogehalts aus.` },
      { q: 'Wie stark wurden die Lohnsteuerstufen 2026 angehoben?', a: `Um ${DE.pct(T.indexierung_2026, 2)}, so hat es das Finanzministerium Ende Dezember 2025 angekündigt. Die erste Stufe beginnt damit bei ${DE.eur(G[0])} statt darunter, die 40-Prozent-Stufe bei ${DE.eur(G[2])}. Die Anpassung gleicht die kalte Progression teilweise aus. Für 2027 sind die neuen Grenzen bereits kundgemacht: Die Nullstufe reicht dann bis ${DE.eur(G27[0])}, die 40-Prozent-Stufe beginnt bei ${DE.eur(G27[2])}.` },
      { q: 'Werden Urlaubs- und Weihnachtsgeld nach der Lohnsteuertabelle besteuert?', a: `Nein. Der Tarif und damit die Lohnsteuertabelle gelten nur für die zwölf laufenden Bezüge. Der 13. und 14. Bezug werden innerhalb des Jahressechstels mit festen Sätzen besteuert: ${DE.eur(P.sonderzahlungen.freibetrag)} im Jahr frei, danach ${DE.pct(P.sonderzahlungen.stufen[1][1])} (§ 67 EStG). Nur was über das Sechstel hinausgeht, rutscht in den Tarif. Deshalb ist die Steuerquote auf das Jahresbrutto niedriger als die monatliche Lohnsteuer vermuten lässt.` },
      { q: 'Bekomme ich zu viel bezahlte Lohnsteuer zurück?', a: `Oft ja, über die Arbeitnehmerveranlagung. Der Arbeitgeber rechnet jeden Monat so, als ob das Gehalt das ganze Jahr gleich bliebe. Schwankt das Einkommen, beginnt der Job erst im Herbst oder haben Sie Werbungskosten über ${DE.eur(WK)}, Sonderausgaben oder außergewöhnliche Belastungen, rechnet das Finanzamt das Jahr neu. Die Lohnsteuer des Lohnzettels ist damit eine Vorauszahlung auf die Einkommensteuer.` },
    ],
    body: (h) => `
<h2>Der Tarif 2026 Stufe für Stufe</h2>
<p>Österreich besteuert Löhne mit einem Stufentarif. Maßgeblich ist das Jahreseinkommen, also das, was nach Abzug der Sozialversicherung, der Werbungskosten und weiterer Freibeträge bleibt. Jede Stufe hat ihren eigenen Satz, der nur auf den Teil des Einkommens innerhalb dieser Stufe wirkt (${h.src('estg33', '§ 33 Abs. 1 EStG')}).</p>
${h.table(['Jahreseinkommen 2026', 'Satz für diesen Teil', 'Grenze 2027'], [
  [`bis ${h.eur(G[0])}`, h.pct(S[0]), h.eur(G27[0])],
  [`über ${h.eur(G[0])} bis ${h.eur(G[1])}`, h.pct(S[1]), h.eur(G27[1])],
  [`über ${h.eur(G[1])} bis ${h.eur(G[2])}`, h.pct(S[2]), h.eur(G27[2])],
  [`über ${h.eur(G[2])} bis ${h.eur(G[3])}`, h.pct(S[3]), h.eur(G27[3])],
  [`über ${h.eur(G[3])} bis ${h.eur(G[4])}`, h.pct(S[4]), h.eur(G27[4])],
  [`über ${h.eur(G[4])} bis ${h.eur(G[5])}`, h.pct(S[5]), 'unverändert'],
  [`über ${h.eur(G[5])}`, h.pct(S[6]), 'befristet bis 2029'],
], 'Tarif nach § 33 Abs. 1 EStG; rechte Spalte: obere Grenze der Stufe im Jahr 2027', ['l', 'r', 'r'])}
<p>Die Grenzen 2026 liegen um ${h.pct(T.indexierung_2026, 2)} über jenen von 2025; das Finanzministerium hat die Anhebung von Tarifstufen und den wichtigsten Absetzbeträgen am 30. Dezember 2025 bekanntgegeben (${h.src('bmfPresse', 'BMF-Pressemitteilung')}). Die Werte für 2027 stehen schon im Gesetzestext, als Anmerkung zu § 33 nach BGBl. II Nr. 260/2026. Wer Gehaltsverhandlungen für das kommende Jahr vorbereitet, kann also bereits mit der neuen Nullstufe von ${h.eur(G27[0])} rechnen; diese Seite und der Rechner bleiben bis Jahresende beim Tarif 2026.</p>
<h2>Vom Monatsgehalt zur Lohnsteuer: der Rechenweg</h2>
<p>Der Tarif ist ein Jahrestarif, ausbezahlt wird aber monatlich. Die Lohnverrechnung behilft sich, indem sie den laufenden Monatsbezug aufs Jahr hochrechnet, die Jahressteuer ermittelt und wieder durch zwölf teilt. Der amtliche ${h.src('bmfRechner', 'Brutto-Netto-Rechner des Finanzministeriums')} geht genauso vor. Am Beispiel von ${h.eur(B)} brutto im Monat, außerhalb Wiens, ohne Kinder und ohne Pendlerpauschale:</p>
<ol>
<li>Bruttobezug ${h.eur(B, 2)} minus Sozialversicherung ${h.eur(svB, 2)} ergibt ${h.eur(stpfl, 2)} steuerpflichtig im Monat.</li>
<li>Mal zwölf und minus ${h.eur(WK)} Werbungskostenpauschale: Bemessungsgrundlage ${h.eur(lB.bemessungJahr, 2)} im Jahr.</li>
<li>Tarif darauf: ${h.eur(tarifJahrB, 2)} Einkommensteuer im Jahr.</li>
<li>Minus Verkehrsabsetzbetrag ${h.eur(VAB)}; Familienbonus Plus, Alleinverdienerabsetzbetrag oder Pendlereuro kämen hier ebenfalls weg.</li>
<li>Geteilt durch zwölf: ${h.eur(lB.lst, 2)} Lohnsteuer im Monat.</li>
</ol>
<p>Zwei Dinge fallen auf. Die Werbungskostenpauschale wirkt bei allen Arbeitnehmerinnen und Arbeitnehmern automatisch, ohne Antrag. Und die Absetzbeträge mindern die Steuer selbst, nicht die Bemessungsgrundlage: ${h.eur(VAB)} Verkehrsabsetzbetrag sind ${h.eur(VAB / 12, 2)} weniger Lohnsteuer in jedem Monat, ganz gleich, wie hoch das Gehalt ist. Was die einzelnen Absetzbeträge bringen, steht bei ${h.a('verkehrsabsetzbetrag', 'Verkehrsabsetzbetrag')}, ${h.a('familienbonus', 'Familienbonus Plus')} und ${h.a('alleinverdiener', 'Alleinverdienerabsetzbetrag')}.</p>
<h2>Lohnsteuer-Tabelle 2026 nach Monatsbrutto</h2>
${h.table(['Monatsbrutto', 'Sozialversicherung', 'Lohnsteuer', 'Grenzsteuersatz', 'Lohnsteuer in % vom Brutto', 'Netto laufend'], tab.map((z) => [h.eur(z.b), h.eur(z.sv, 2), h.eur(z.lst, 2), h.pct(z.gs), h.pct(z.ds, 1), h.eur(z.netto, 2)]), 'Laufender Bezug 2026, alleinstehend, außerhalb Wiens, ohne Pendlerpauschale; Werte aus dem Rechner dieser Seite, geprüft gegen den BMF-Rechner', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Tabelle zeigt die Lohnsteuer eines gewöhnlichen Monats. Im Juni und November, wenn Urlaubszuschuss und Weihnachtsremuneration dazukommen, steht im Lohnzettel zusätzlich eine eigene Zeile für die Sonderzahlung mit festem Steuersatz; die laufende Lohnsteuer bleibt gleich. Ab ${h.eur(h.P.sv.hbg_monat)} brutto wächst die Sozialversicherung nicht mehr mit, deshalb steigt die Lohnsteuer im obersten Bereich der Tabelle schneller als darunter.</p>
<!--mini:lohnsteuer-->
<h2>Grenzsteuersatz und Durchschnittssteuersatz</h2>
<p>Der Grenzsteuersatz ist der Satz der Stufe, in der Ihr letzter Euro liegt. Er beantwortet die Frage, wie viel von einer Gehaltserhöhung, einer Überstunde oder einer Prämie nach dem Tarif an Steuer weggeht. Der Durchschnittssteuersatz ist die gesamte Lohnsteuer geteilt durch das Einkommen. Er beschreibt, wie stark Ihr Gehalt insgesamt belastet ist.</p>
<p>Bei ${h.eur(5000)} brutto liegt die Bemessungsgrundlage bei ${h.eur(g5.bem)} im Jahr, also in der Stufe mit ${h.pct(g5.gs)}. Von ${h.eur(100)} mehr Brutto kostet allein die Lohnsteuer ${h.eur(mehr5, 2)}, weil vorher noch Sozialversicherung abgeht. Die Lohnsteuer auf das ganze Monatsgehalt beträgt dagegen nur ${h.pct(g5.ds, 1)} des Bruttos. Rechnet man die steuerlich begünstigten Sonderzahlungen mit ein, sinkt die Quote weiter: Von ${h.eur(k5.bruttoJahr)} Jahresbrutto bleiben ${h.eur(k5.nettoJahr)} netto.</p>
<p>Ein verbreiteter Irrtum ist, dass man durch einen Sprung in die nächste Stufe weniger netto hat als vorher. Das kann beim Tarif nicht passieren, weil der höhere Satz nur den Teil über der Grenze trifft. Netto-Sprünge nach unten gibt es in Österreich nur bei der Sozialversicherung, an den Grenzen der Staffel zur Arbeitslosenversicherung; dazu mehr unter ${h.a('sozialversicherung', 'Sozialversicherungsbeiträge')}.</p>
<h2>Wann die Lohnsteuer des Arbeitgebers nicht stimmt</h2>
<p>Die monatliche Hochrechnung unterstellt ein ganzes Jahr mit gleichem Gehalt. Das passt für viele, aber nicht für alle. Wer erst im September zu arbeiten beginnt, zahlt von Anfang an Lohnsteuer, als ob er zwölf Monate so verdienen würde; das tatsächliche Jahreseinkommen liegt aber viel niedriger. Wer zwei Arbeitgeber gleichzeitig hat, bekommt bei jedem den Verkehrsabsetzbetrag und die unteren Stufen, und zahlt in der Veranlagung nach. In beiden Fällen gleicht die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} die Differenz aus. Den Jahreslohnzettel, auf dem die Lohnsteuer des ganzen Jahres steht, erklärt die Seite zum ${h.a('lohnzettel', 'Lohnzettel')}.</p>
`,
  },
  en: {
    slug: 'wage-tax-table',
    nav: 'Wage tax table 2026',
    card: 'The 2026 tax brackets, how payroll turns them into a monthly figure, and the wage tax on salaries from 1,500 to 9,000 euros.',
    title: 'Wage Tax Austria 2026: Lohnsteuer Brackets and Table',
    description: `Austrian wage tax 2026 (Lohnsteuer): brackets from ${EN.pct(S[0])} to ${EN.pct(S[6])}, how payroll works it out each month, and a table for ${EN.eur(BRUTTOS[0])} to ${EN.eur(BRUTTOS[9])} of monthly gross pay.`,
    h1: 'Wage tax in Austria: brackets, table and the payroll method',
    intro: 'How the annual scale of the Income Tax Act becomes the wage tax line on your monthly payslip, and why your top rate is not what you actually pay.',
    resume: `Austrian wage tax (Lohnsteuer, the income tax your employer withholds) follows the scale in section 33 of the Income Tax Act. In 2026 annual income up to ${EN.eur(G[0])} is tax-free, the next slice is taxed at ${EN.pct(S[1])}, income above ${EN.eur(G[1])} at ${EN.pct(S[2])}, above ${EN.eur(G[2])} at ${EN.pct(S[3])}, above ${EN.eur(G[3])} at ${EN.pct(S[4])}, above ${EN.eur(G[4])} at ${EN.pct(S[5])} and above one million at ${EN.pct(S[6])}. The brackets rose by ${EN.pct(T.indexierung_2026, 2)} for 2026. On the payslip (Lohnzettel), payroll takes your regular monthly pay after social insurance, multiplies by twelve, deducts a flat ${EN.eur(WK)} for work expenses, applies the scale, subtracts tax credits such as the ${EN.eur(VAB)} transport credit and divides by twelve. On ${EN.eur(B)} gross that gives ${EN.eur(lB.lst, 2)} a month; on ${EN.eur(5000)} it is ${EN.eur(g5.lst, 2)}. Below roughly ${EN.eur(nullBis)} gross no wage tax is due. Your marginal rate is what the next euro costs; the real burden is far lower, about ${EN.pct(g5.ds, 1)} of gross pay at ${EN.eur(5000)}.`,
    faqs: [
      { q: 'At what monthly salary does Austrian wage tax start?', a: `For a single employee with no commuter allowance, wage tax first appears at about ${EN.eur(nullBis + 1)} gross a month. Below that the taxable base can already exceed the ${EN.eur(G[0])} zero bracket, but the ${EN.eur(VAB)} annual transport credit still wipes out the tax. If you claim Familienbonus Plus for a child or the sole earner credit, the starting point moves well higher (section 33 of the Income Tax Act).` },
      { q: 'Why is the wage tax on my Austrian payslip lower than my tax bracket?', a: `Because the scale works in slices. Your bracket rate applies only to the income inside that bracket; everything below is taxed at lower rates or not at all, and tax credits come off afterwards. At ${EN.eur(5000)} gross your marginal rate is ${EN.pct(g5.gs)}, yet the wage tax of ${EN.eur(g5.lst, 2)} is only ${EN.pct(g5.ds, 1)} of your gross salary.` },
      { q: 'How will the Austrian wage tax brackets change in 2027?', a: `The 2027 limits are already published in the Federal Law Gazette (BGBl. II No. 260/2026) and shown in the official consolidated text of section 33. The zero bracket will reach ${EN.eur(G27[0])}, the ${EN.pct(S[2])} band will start at ${EN.eur(G27[1])}, the ${EN.pct(S[3])} band at ${EN.eur(G27[2])} and the ${EN.pct(S[4])} band at ${EN.eur(G27[3])}. Until December 2026 payroll keeps applying the 2026 brackets shown above.` },
      { q: 'Does the wage tax table apply to my 13th and 14th salary?', a: `No. The scale and this table cover only the twelve regular monthly payments. Holiday pay and Christmas pay, the two extra salaries most Austrian employees receive, are taxed at fixed rates within the annual sixth: the first ${EN.eur(P.sonderzahlungen.freibetrag)} a year free, then ${EN.pct(P.sonderzahlungen.stufen[1][1])} (section 67). Only the part above the sixth falls into the scale.` },
      { q: 'Can I get overpaid Austrian wage tax refunded?', a: `Often, yes, through the annual employee tax assessment (Arbeitnehmerveranlagung). Payroll assumes each month's salary runs all year. If you arrived in Austria mid-year, had months without pay, or have work expenses above the ${EN.eur(WK)} flat amount, the tax office recalculates the year and refunds the difference. Monthly wage tax is effectively an advance on your income tax.` },
    ],
    body: (h) => `
<h2>The 2026 brackets</h2>
<p>Austria taxes employment income on a stepped scale. What counts is annual income after social insurance, work expenses and other allowances. Each bracket has its own rate, applied only to the slice of income inside it (${h.src('estg33', 'section 33(1) of the Income Tax Act')}). There are no tax classes as in Germany and no church tax on the payslip: everyone with the same pay and the same credits pays the same wage tax.</p>
${h.table(['Annual income 2026', 'Rate on this slice', 'Upper limit in 2027'], [
  [`up to ${h.eur(G[0])}`, h.pct(S[0]), h.eur(G27[0])],
  [`${h.eur(G[0])} to ${h.eur(G[1])}`, h.pct(S[1]), h.eur(G27[1])],
  [`${h.eur(G[1])} to ${h.eur(G[2])}`, h.pct(S[2]), h.eur(G27[2])],
  [`${h.eur(G[2])} to ${h.eur(G[3])}`, h.pct(S[3]), h.eur(G27[3])],
  [`${h.eur(G[3])} to ${h.eur(G[4])}`, h.pct(S[4]), h.eur(G27[4])],
  [`${h.eur(G[4])} to ${h.eur(G[5])}`, h.pct(S[5]), 'unchanged'],
  [`above ${h.eur(G[5])}`, h.pct(S[6]), 'until 2029'],
], 'Scale under section 33(1); right column: upper limit of each bracket in 2027', ['l', 'r', 'r'])}
<p>Each 2026 limit is ${h.pct(T.indexierung_2026, 2)} above its 2025 value. The Finance Ministry announced this inflation adjustment, which also lifts the main tax credits, on 30 December 2025 (${h.src('bmfPresse', 'ministry press release')}). Austria indexes its brackets every year to offset “cold progression”, the creep into higher bands caused by pay rises that only match inflation. The 2027 figures are already in the law, so if you are negotiating a contract that starts in January you can plan with a zero bracket of ${h.eur(G27[0])}. This site keeps calculating with 2026 values until the year ends.</p>
<h2>How payroll gets from your salary to the wage tax line</h2>
<p>The scale is annual, but you are paid monthly. Austrian payroll solves this by annualising: it takes the regular monthly pay, multiplies it by twelve, applies the scale and divides the result by twelve again. The ${h.src('bmfRechner', 'official calculator of the Finance Ministry')} uses the same method. Worked through for ${h.eur(B)} gross a month, outside Vienna, no children, no commuter allowance:</p>
<ol>
<li>Gross pay ${h.eur(B, 2)} less social insurance ${h.eur(svB, 2)} leaves ${h.eur(stpfl, 2)} taxable per month.</li>
<li>Times twelve, less the ${h.eur(WK)} flat work-expense allowance (Werbungskostenpauschale): taxable base ${h.eur(lB.bemessungJahr, 2)} a year.</li>
<li>Scale applied: ${h.eur(tarifJahrB, 2)} income tax a year.</li>
<li>Less the transport credit (Verkehrsabsetzbetrag) of ${h.eur(VAB)}; child credits or the commuter euro would come off here too.</li>
<li>Divided by twelve: ${h.eur(lB.lst, 2)} wage tax per month.</li>
</ol>
<p>The flat work-expense amount is automatic, no application needed. Tax credits reduce the tax itself rather than the base, so the ${h.eur(VAB)} transport credit is worth ${h.eur(VAB / 12, 2)} a month at any salary level, provided there is that much tax to absorb it. You will find the details on the pages about the ${h.a('verkehrsabsetzbetrag', 'transport credit')}, ${h.a('familienbonus', 'Familienbonus Plus')} and the ${h.a('alleinverdiener', 'sole earner credit')}.</p>
<h2>Wage tax table 2026 by monthly gross</h2>
${h.table(['Monthly gross', 'Social insurance', 'Wage tax', 'Marginal rate', 'Wage tax as % of gross', 'Regular net'], tab.map((z) => [h.eur(z.b), h.eur(z.sv, 2), h.eur(z.lst, 2), h.pct(z.gs), h.pct(z.ds, 1), h.eur(z.netto, 2)]), 'Regular monthly pay 2026, single, outside Vienna, no commuter allowance; figures from this site’s engine, tested against the official calculator', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>This is the tax on an ordinary month. In June and November, when holiday pay and Christmas pay arrive, your payslip shows an extra line for the special payment with its own fixed rate, while the regular wage tax stays the same. From ${h.eur(h.P.sv.hbg_monat)} gross, social insurance stops growing because of the contribution ceiling, which is why wage tax climbs faster at the top of the table.</p>
<!--mini:lohnsteuer-->
<h2>Marginal rate versus average rate</h2>
<p>Your marginal rate is the rate of the bracket your last euro falls into. It tells you how much tax a pay rise, an overtime hour or a bonus taxed on the scale will cost. Your average rate is total wage tax divided by income, the share of your whole salary that goes to the tax office.</p>
<p>At ${h.eur(5000)} gross the annual taxable base is ${h.eur(g5.bem)}, inside the ${h.pct(g5.gs)} band. Of ${h.eur(100)} extra gross, wage tax alone takes ${h.eur(mehr5, 2)}, because social insurance comes off first. Yet wage tax on the whole monthly salary is only ${h.pct(g5.ds, 1)} of gross. Add the favourably taxed 13th and 14th salaries and the share falls further: ${h.eur(k5.bruttoJahr)} of annual gross leaves ${h.eur(k5.nettoJahr)} net.</p>
<p>Many newcomers fear that crossing into a higher bracket can leave them with less money. Under the scale that is impossible, since the higher rate only touches the part above the limit. The only real cliffs in Austrian payroll are in social insurance, at the steps of the reduced unemployment contribution; see ${h.a('sozialversicherung', 'social insurance contributions')}.</p>
<h2>When the employer's figure is not your final tax</h2>
<p>Annualising assumes a full year at the same salary. If you move to Austria and start work in September, payroll taxes you from day one as if you earned that salary for twelve months, although your real annual income is much lower. If you hold two jobs at once, each employer grants the transport credit and the lower brackets, and the tax office collects the difference later. Either way, the ${h.a('arbeitnehmerveranlagung', 'employee tax assessment')} settles the year. The annual payslip that summarises your wage tax is explained under ${h.a('lohnzettel', 'Lohnzettel')}.</p>
`,
  },
});
