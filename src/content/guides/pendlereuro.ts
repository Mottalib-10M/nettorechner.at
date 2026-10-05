import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { pendlerpauschale, pendlereuro, lohnsteuerLaufend, svLaufend } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const A = P.absetzbetraege;
/** Beispiel des BMF: 35 km einfache Strecke, kleines Pauschale. Alle Ergebnisse aus dem Motor. */
const KM = 35;
const pe26 = pendlereuro('klein', KM), pe25 = KM * A.pendlereuro_je_km_2025, peZwei = pendlereuro('klein', KM, 'zweiDrittel'), peEins = pendlereuro('klein', KM, 'einDrittel');
const ohne = kurz(3000), mit = kurz(3000, { pendler: 'klein', km: KM });
const plusMonat = mit.nettoMonat - ohne.nettoMonat;
/** Anteil von Pendlereuro und Pauschale am Netto-Plus bei 3.000 €. */
const lMit = lohnsteuerLaufend(3000 - svLaufend(3000).summe, { pendler: 'klein', km: KM });
const peMonat = pe26 / 12, ppMonat = plusMonat - peMonat;
/** Familie mit zwei Kindern unter 18: der Familienbonus kommt zuerst, für den Pendlereuro bleibt im Lohnzettel nichts. */
const fam = kurz(3000, { kinderU18: 2 }), famP = kurz(3000, { kinderU18: 2, pendler: 'klein', km: KM });
/** Tabelle: Lohnsteuer pro Monat ohne und mit 35 km Pendelstrecke. */
const BRUTTOS = [1600, 2000, 2500, 3000, 4000];
const zeilen = BRUTTOS.map((b) => ({ b, o: kurz(b).lstMonat, m: kurz(b, { pendler: 'klein', km: KM }).lstMonat }));
/** Pendlereuro je Entfernung (großes Pauschale, damit jede Entfernung ab 2 km Anspruch hat). */
const KMS = [10, 20, 35, 50, 70];

export default defineGuide({
  id: 'pendlereuro',
  group: 'absetz',
  order: 10,
  mini: 'pendlereuro',
  miniHref: 'pendlerpauschale',
  related: ['pendlerpauschale', 'verkehrsabsetzbetrag', 'arbeitnehmerveranlagung', 'lohnsteuer', 'netto-3000'],
  sources: ['estg33', 'bmfPresse', 'estg16'],
  de: {
    slug: 'pendlereuro',
    nav: 'Pendlereuro 2026',
    card: `Seit Jänner ${DE.eur(A.pendlereuro_je_km)} je Kilometer statt ${DE.eur(A.pendlereuro_je_km_2025)}: was der verdreifachte Absetzbetrag bringt und wann er verpufft.`,
    title: `Pendlereuro 2026: ${DE.eur(A.pendlereuro_je_km)} je Kilometer statt ${DE.eur(A.pendlereuro_je_km_2025)} im Vorjahr`,
    description: `Pendlereuro 2026: ${DE.eur(A.pendlereuro_je_km)} je Kilometer der einfachen Strecke, bei 35 km ${DE.eur(pe26)} im Jahr. Wann er voll wirkt, wann er verpufft und was er neben dem Pauschale bringt.`,
    h1: 'Der Pendlereuro 2026: dreimal so viel wie im Vorjahr',
    intro: 'Was der verdreifachte Pendlereuro direkt von Ihrer Lohnsteuer abzieht und in welchen Fällen davon im Lohnzettel nichts ankommt.',
    resume: `Der Pendlereuro beträgt seit Jänner 2026 ${DE.eur(A.pendlereuro_je_km)} pro Jahr für jeden Kilometer der einfachen Strecke zwischen Wohnung und Arbeitsstätte, bis 2025 waren es ${DE.eur(A.pendlereuro_je_km_2025)}. Er ist ein Absetzbetrag nach § 33 Abs. 5 Z 4 EStG: Er wird von der fertig berechneten Lohnsteuer abgezogen und ist deshalb für jeden Euro wert, unabhängig vom Grenzsteuersatz. Wer ${KM} Kilometer pendelt, bekommt ${DE.eur(pe26)} im Jahr statt ${DE.eur(pe25)}, also ${DE.eur(pe26 - pe25)} mehr; genau dieses Beispiel nennt das Finanzministerium. Den Pendlereuro gibt es nur, wenn ein Pendlerpauschale zusteht, und er wird genauso aliquotiert: voll ab elf Fahrten im Monat, zu zwei Dritteln bei acht bis zehn und zu einem Drittel bei vier bis sieben Fahrten. Bei ${DE.eur(3000)} brutto und ${KM} Kilometern bringt er allein ${DE.eur(peMonat, 2)} netto im Monat und damit mehr als das kleine Pauschale selbst. Ist die Lohnsteuer schon null, etwa wegen des Familienbonus, hilft er erst in der Arbeitnehmerveranlagung über die SV-Rückerstattung von bis zu ${DE.eur(A.sv_rueckerstattung_pendler_max)}.`,
    faqs: [
      { q: 'Muss ich den Pendlereuro getrennt vom Pendlerpauschale beantragen?', a: `Nein. Der Pendlereuro hängt am Pendlerpauschale und wird mit demselben Ausdruck des Pendlerrechners beantragt, dem Formular L 34 EDV. Ihr Arbeitgeber berücksichtigt dann beide Beträge im Lohnzettel. Wer das Formular nicht abgegeben hat, beantragt Pauschale und Pendlereuro gemeinsam in der Arbeitnehmerveranlagung. Ohne Anspruch auf ein Pauschale gibt es auch keinen Pendlereuro (§ 33 Abs. 5 Z 4 EStG).` },
      { q: 'Wie viel bringt der Pendlereuro bei 20 Kilometern Arbeitsweg?', a: `Bei 20 Kilometern einfacher Strecke sind es ${DE.eur(20 * A.pendlereuro_je_km)} im Jahr, ${DE.eur(20 * A.pendlereuro_je_km / 12)} pro Monat, statt ${DE.eur(20 * A.pendlereuro_je_km_2025)} im Jahr 2025. Voraussetzung ist ein Pauschale: Das kleine beginnt genau bei 20 Kilometern, das große schon bei zwei, wenn öffentliche Verkehrsmittel auf mindestens der halben Strecke unzumutbar sind. Die Entfernung legt der Pendlerrechner des Finanzministeriums fest, nicht der Tacho.` },
      { q: 'Bekomme ich den Pendlereuro auch mit Homeoffice-Tagen?', a: `Ja, aber anteilig. Für den Pendlereuro gelten die Fahrtenregeln des Pendlerpauschales: Bei ${KM} Kilometern stehen mit elf oder mehr Fahrten im Monat ${DE.eur(pe26)} im Jahr zu, mit acht bis zehn Fahrten ${DE.eur(peZwei)} und mit vier bis sieben Fahrten ${DE.eur(peEins)}. Wer an weniger als vier Tagen im Monat ins Büro fährt, bekommt weder Pauschale noch Pendlereuro.` },
      { q: 'Warum ändert der höhere Pendlereuro bei mir mit Familienbonus nichts am Lohnzettel?', a: `Weil der Familienbonus Plus als erster Absetzbetrag abgezogen wird und die Lohnsteuer oft schon allein auf null senkt. Bei ${DE.eur(3000)} brutto mit zwei Kindern unter 18 beträgt die Lohnsteuer ${DE.eur(fam.lstMonat, 2)}, mit ${KM} Kilometern Pendelstrecke ${DE.eur(famP.lstMonat, 2)}. Der Pendlereuro geht trotzdem nicht verloren: Er drückt die Steuer in der Veranlagung unter null und erhöht so die SV-Rückerstattung bis ${DE.eur(A.sv_rueckerstattung_pendler_max)}.` },
      { q: 'Zählt der Pendlereuro auch, wenn ich mit Bahn oder Bus pendle?', a: `Ja. Der Pendlereuro hängt nicht am Verkehrsmittel, sondern am Anspruch auf das Pendlerpauschale. Wer mit Zug, Bus oder Fahrrad fährt, bekommt ihn genauso wie Autofahrer, solange das Pauschale zusteht; das Finanzministerium betont das in seiner Mitteilung zur Erhöhung ausdrücklich. Ausgeschlossen ist er dagegen, wenn der Arbeitgeber für den Arbeitsweg ein Firmenauto zur Verfügung stellt.` },
    ],
    body: (h) => `
<h2>Was sich 2026 geändert hat</h2>
<p>Bis Ende 2025 brachte jeder Kilometer des Arbeitswegs ${h.eur(h.P.absetzbetraege.pendlereuro_je_km_2025)} Steuerersparnis im Jahr. Seit 1. Jänner 2026 sind es ${h.eur(h.P.absetzbetraege.pendlereuro_je_km)}. Das Finanzministerium hat die Verdreifachung in seiner ${h.src('bmfPresse', 'Mitteilung vom 30. Dezember 2025')} mit einem Beispiel erklärt: ${KM} Kilometer einfache Strecke ergeben ${h.eur(pe26 - pe25)} mehr im Jahr. Die Erhöhung betrifft den Pendlereuro und kommt allen Pendlern mit Pauschale zugute, unabhängig davon, wie viel sie verdienen.</p>
${h.table(['Einfache Strecke', 'Pendlereuro 2025', 'Pendlereuro 2026', 'pro Monat 2026'], KMS.map((k) => [`${k} km`, h.eur(pendlereuro('gross', k) / h.P.absetzbetraege.pendlereuro_je_km * h.P.absetzbetraege.pendlereuro_je_km_2025), h.eur(pendlereuro('gross', k)), h.eur(pendlereuro('gross', k) / 12, 2)]), 'Pendlereuro bei vollem Anspruch (elf oder mehr Fahrten im Monat), unter 20 km nur mit großem Pauschale', ['l', 'r', 'r', 'r'])}
<h2>Absetzbetrag statt Freibetrag</h2>
<p>Das Pendlerpauschale und der Pendlereuro werden oft in einem Atemzug genannt, wirken aber an verschiedenen Stellen der Steuerberechnung. Das Pauschale nach ${h.src('estg16', '§ 16 Abs. 1 Z 6 EStG')} mindert das Einkommen, auf das der Tarif angewendet wird. Der Pendlereuro nach ${h.src('estg33', '§ 33 Abs. 5 Z 4 EStG')} kommt erst danach: Er wird von der Steuer abgezogen, die sich aus dem Tarif ergibt. Ein Absetzbetrag von ${h.eur(pe26)} senkt die Steuer um genau ${h.eur(pe26)}, im 20-Prozent-Bereich genauso wie im 40-Prozent-Bereich.</p>
<p>Bei ${h.eur(3000)} brutto liegt der Grenzsteuersatz bei ${h.pct(lMit.grenzsteuersatz)}. Das kleine Pauschale von ${h.eur(pendlerpauschale('klein', KM))} spart deshalb rund ${h.eur(ppMonat, 2)} im Monat, der Pendlereuro dagegen ${h.eur(peMonat, 2)}. Zusammen sind es ${h.eur(plusMonat, 2)} mehr netto. Seit der Verdreifachung ist der Pendlereuro bei mittleren Einkommen und mittleren Entfernungen also der größere der beiden Posten. Wer nur die Pauschale im Kopf hat, unterschätzt, was der Arbeitsweg 2026 steuerlich wert ist.</p>
<h2>Fahrten im Monat und weitere Regeln</h2>
<p>Für den Pendlereuro gelten die Bestimmungen des Pendlerpauschales sinngemäß, das Gesetz verweist ausdrücklich darauf. Daraus folgt:</p>
<ul>
<li><strong>Aliquotierung:</strong> elf oder mehr Fahrten im Monat geben den vollen Pendlereuro, acht bis zehn zwei Drittel, vier bis sieben ein Drittel. Bei ${KM} Kilometern sind das ${h.eur(pe26)}, ${h.eur(peZwei)} oder ${h.eur(peEins)} im Jahr.</li>
<li><strong>Entfernung:</strong> maßgeblich ist die Strecke laut Pendlerrechner, nicht die tatsächlich gefahrene.</li>
<li><strong>Firmenauto:</strong> Stellt der Arbeitgeber ein Kraftfahrzeug für den Arbeitsweg zur Verfügung, entfallen Pauschale und Pendlereuro. Ein Dienstfahrrad schadet nicht.</li>
<li><strong>Mehrere Arbeitsstätten oder Wohnsitze:</strong> Der Pendlereuro folgt der Entfernung, die für das Pauschale gilt, also dem nächstgelegenen Wohnsitz oder dem Familienwohnsitz.</li>
</ul>
<!--mini:pendlereuro-->
<h2>Wenn der Pendlereuro im Lohnzettel verpufft</h2>
<p>Ein Absetzbetrag kann im Lohnzettel nur so weit wirken, wie Lohnsteuer vorhanden ist. Bei kleinen Gehältern ist das schnell erreicht. Die Tabelle zeigt die monatliche Lohnsteuer ohne Pendeln und mit ${KM} Kilometern und kleinem Pauschale; die Differenz enthält Pauschale, Pendlereuro und bei kleinen Einkommen den höheren Verkehrsabsetzbetrag.</p>
${h.table(['Brutto pro Monat', 'Lohnsteuer ohne Pendeln', `Lohnsteuer mit ${KM} km`, 'Ersparnis pro Monat'], zeilen.map((z) => [h.eur(z.b), h.eur(z.o, 2), h.eur(z.m, 2), h.eur(z.o - z.m, 2)]), 'Laufender Bezug, 14 Gehälter, ohne Kinder; Werte aus unserem Rechenmotor', ['l', 'r', 'r', 'r'])}
<p>Bei ${h.eur(BRUTTOS[0])} brutto sinkt die Lohnsteuer schon auf ${h.eur(zeilen[0].m, 2)}, obwohl die Absetzbeträge noch mehr hergeben würden. Ähnlich ist es bei Familien: Der Familienbonus Plus wird nach § 33 Abs. 2 EStG als erster Absetzbetrag abgezogen, alle anderen kommen danach. Bei ${h.eur(3000)} brutto mit zwei Kindern unter 18 bleibt mit und ohne Pendlerpauschale eine Lohnsteuer von ${h.eur(famP.lstMonat, 2)}; der Pendlereuro hat im Lohnzettel keinen Platz mehr.</p>
<h2>Wie der Pendlereuro dann trotzdem ankommt</h2>
<p>Verloren ist er nicht. In der ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} rechnet das Finanzamt das ganze Jahr neu. Drücken Verkehrsabsetzbetrag und Pendlereuro die Steuer unter null, werden ${h.pct(h.P.absetzbetraege.sv_rueckerstattung_quote)} der eigenen Sozialversicherungsbeiträge erstattet, für Pendler mit Pauschale bis zu ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_pendler_max)} im Jahr statt ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)}. Bei Einkommen bis ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)} kommt der SV-Bonus von bis zu ${h.eur(h.P.absetzbetraege.vab_zuschlag)} dazu. Die Erstattung ist mit der negativen Steuer begrenzt; der Pendlereuro hilft also, diese Grenze zu erreichen. Wer wenig verdient und weit fährt, sollte die Veranlagung deshalb nie auslassen, auch wenn der Lohnzettel bereits null Lohnsteuer zeigt.</p>
<h2>Was der Pendlereuro nicht ist</h2>
<p>Er ist keine Fahrtkostenerstattung des Arbeitgebers und kein Zuschuss zum Klimaticket. Er erscheint nicht als eigene Zeile mit Geld auf dem Konto, sondern als niedrigere Lohnsteuer. Auf dem Lohnzettel steht er meist gemeinsam mit dem Pendlerpauschale. Und er hängt nicht davon ab, ob Sie mit dem Auto, dem Zug oder dem Rad fahren. Wie viel Ihr eigener Arbeitsweg im Monat bringt, berechnet der ${h.a('pendlerpauschale', 'Pendlerpauschale-Rechner')} mit Ihrem Bruttogehalt; dort sehen Sie auch, ob das kleine oder das große Pauschale den Ausschlag gibt. Wie der Verkehrsabsetzbetrag bei kleinen Einkommen steigt, erklärt die Seite zum ${h.a('verkehrsabsetzbetrag', 'Verkehrsabsetzbetrag')}.</p>
`,
  },
  en: {
    slug: 'commuter-euro',
    nav: 'Commuter euro 2026',
    card: `Since January ${EN.eur(A.pendlereuro_je_km)} per kilometre instead of ${EN.eur(A.pendlereuro_je_km_2025)}: what the tripled tax credit brings and when it is lost.`,
    title: `Pendlereuro 2026: Austria’s Commuter Euro Tripled to ${EN.eur(A.pendlereuro_je_km)}/km`,
    description: `Pendlereuro 2026 in Austria: ${EN.eur(A.pendlereuro_je_km)} per km of your one-way commute, ${EN.eur(pe26)} a year for 35 km. How the credit works, when it is lost on payroll, how to recover it.`,
    h1: 'The commuter euro in 2026: three times last year’s amount',
    intro: 'What the tripled Pendlereuro takes straight off your wage tax, and the cases in which your payslip shows none of it.',
    resume: `The Pendlereuro, Austria’s commuter euro, is worth ${EN.eur(A.pendlereuro_je_km)} a year for every kilometre of the one-way distance between home and work since January 2026, up from ${EN.eur(A.pendlereuro_je_km_2025)} in 2025. It is a tax credit under section 33(5)(4) of the Income Tax Act: it comes off the wage tax already calculated, so each euro of it is a euro of tax saved, whatever your marginal rate. A ${KM} km commute now earns ${EN.eur(pe26)} a year instead of ${EN.eur(pe25)}, an extra ${EN.eur(pe26 - pe25)}, the exact example the Finance Ministry used. You only get it if you qualify for the commuter allowance (Pendlerpauschale), and it is reduced the same way: full from eleven commutes a month, two thirds with eight to ten, one third with four to seven. On ${EN.eur(3000)} gross with a ${KM} km commute it adds ${EN.eur(peMonat, 2)} net a month on its own, more than the small allowance itself. If your wage tax is already zero, for example because of Familienbonus Plus, it pays off only in the annual tax return, through a social insurance refund of up to ${EN.eur(A.sv_rueckerstattung_pendler_max)}.`,
    faqs: [
      { q: 'Do I need a separate claim for the Pendlereuro?', a: `No. The commuter euro is tied to the commuter allowance and claimed with the same printout from the Finance Ministry Pendlerrechner, form L 34 EDV, which you hand to payroll. Your employer then applies both on every payslip. If you never handed the form in, claim allowance and commuter euro together in your annual employee tax assessment (Arbeitnehmerveranlagung). Without an allowance there is no commuter euro.` },
      { q: 'What is the Pendlereuro worth for a 50 km commute?', a: `For 50 km one way it is ${EN.eur(50 * A.pendlereuro_je_km)} a year, or ${EN.eur(50 * A.pendlereuro_je_km / 12)} a month, compared with ${EN.eur(50 * A.pendlereuro_je_km_2025)} in 2025. That assumes you commute on at least eleven days a month. The distance is the one the Pendlerrechner calculates from your address and workplace, not what your car shows, and it also decides whether you get the small or the large allowance.` },
      { q: 'Is the commuter euro reduced if I work from home part of the week?', a: `Yes, in steps. The commuter euro follows the trip rules of the allowance: for ${KM} km you get ${EN.eur(pe26)} a year with eleven or more trips a month, ${EN.eur(peZwei)} with eight to ten trips and ${EN.eur(peEins)} with four to seven. Three home office days a week usually mean eight to ten trips. Fewer than four trips a month means no allowance and no commuter euro.` },
      { q: 'Why does the higher Pendlereuro not change my payslip when I claim Familienbonus Plus?', a: `Because Familienbonus Plus is deducted first and often brings wage tax down to zero on its own. On ${EN.eur(3000)} gross with two children under 18, wage tax is ${EN.eur(fam.lstMonat, 2)} a month, with a ${KM} km commute ${EN.eur(famP.lstMonat, 2)}. The commuter euro is not lost: in the annual tax return it pushes your tax below zero and raises the social insurance refund, capped at ${EN.eur(A.sv_rueckerstattung_pendler_max)}.` },
      { q: 'Does the commuter euro apply to train and bus commuters too?', a: 'Yes. It depends on qualifying for the commuter allowance, not on how you travel. Train, bus and bicycle commuters receive it exactly like drivers, as long as the allowance applies; the Finance Ministry stressed this when it announced the increase. It is excluded, however, when your employer provides a company car for the trip between home and work.' },
    ],
    body: (h) => `
<h2>What changed in 2026</h2>
<p>Until the end of 2025 each kilometre of your commute saved ${h.eur(h.P.absetzbetraege.pendlereuro_je_km_2025)} of tax a year. Since 1 January 2026 it saves ${h.eur(h.P.absetzbetraege.pendlereuro_je_km)}. The Finance Ministry explained the change in its ${h.src('bmfPresse', 'announcement of 30 December 2025')} with one example: a ${KM} km one-way commute brings ${h.eur(pe26 - pe25)} more per year. The increase concerns the commuter euro and reaches every commuter with an allowance, regardless of salary.</p>
${h.table(['One-way distance', 'Commuter euro 2025', 'Commuter euro 2026', 'per month 2026'], KMS.map((k) => [`${k} km`, h.eur(pendlereuro('gross', k) / h.P.absetzbetraege.pendlereuro_je_km * h.P.absetzbetraege.pendlereuro_je_km_2025), h.eur(pendlereuro('gross', k)), h.eur(pendlereuro('gross', k) / 12, 2)]), 'Full entitlement (eleven or more trips a month); below 20 km only with the large allowance', ['l', 'r', 'r', 'r'])}
<h2>A credit, not a deduction</h2>
<p>Expats often meet two Austrian terms here. A Freibetrag is a deduction from taxable income; an Absetzbetrag is a credit against the tax itself. The commuter allowance under ${h.src('estg16', 'section 16(1)(6)')} is a deduction, so it saves your marginal rate times its amount. The commuter euro under ${h.src('estg33', 'section 33(5)(4)')} is a credit, so ${h.eur(pe26)} of commuter euro saves exactly ${h.eur(pe26)} of tax, whether you sit in the 20 or the 40 percent band.</p>
<p>At ${h.eur(3000)} gross a month your marginal rate is ${h.pct(lMit.grenzsteuersatz)}. The small allowance of ${h.eur(pendlerpauschale('klein', KM))} therefore saves about ${h.eur(ppMonat, 2)} a month, while the commuter euro saves ${h.eur(peMonat, 2)}. Together your payslip shows ${h.eur(plusMonat, 2)} more net pay. Since the tripling, the commuter euro is the larger of the two items for average salaries and average distances.</p>
<h2>Trips per month and other rules</h2>
<p>The law applies the allowance rules to the commuter euro by cross-reference. In practice:</p>
<ul>
<li><strong>Part-month trips:</strong> eleven or more trips a month give the full amount, eight to ten two thirds, four to seven one third. For ${KM} km that is ${h.eur(pe26)}, ${h.eur(peZwei)} or ${h.eur(peEins)} a year.</li>
<li><strong>Distance:</strong> the distance set by the Pendlerrechner counts, not the route you actually drive.</li>
<li><strong>Company car:</strong> if your employer gives you a motor vehicle for the commute, both allowance and commuter euro lapse. A company bike does not affect them.</li>
<li><strong>Several homes:</strong> the commuter euro follows the distance used for the allowance, from the home nearest to work or from the family home.</li>
</ul>
<!--mini:pendlereuro-->
<h2>When the payslip cannot use it</h2>
<p>A credit can only reduce tax that exists. On lower salaries the monthly wage tax runs out quickly. The table compares monthly wage tax without a commute and with a ${KM} km commute on the small allowance; the saving combines allowance, commuter euro and, on low incomes, the higher transport credit (Verkehrsabsetzbetrag).</p>
${h.table(['Gross per month', 'Wage tax, no commute', `Wage tax, ${KM} km`, 'Saving per month'], zeilen.map((z) => [h.eur(z.b), h.eur(z.o, 2), h.eur(z.m, 2), h.eur(z.o - z.m, 2)]), 'Regular monthly pay, 14 salaries a year, no children; figures from our engine', ['l', 'r', 'r', 'r'])}
<p>At ${h.eur(BRUTTOS[0])} gross the wage tax already drops to ${h.eur(zeilen[0].m, 2)}, although the credits would cover more. Families hit the same wall: section 33(2) deducts Familienbonus Plus first and every other credit afterwards. At ${h.eur(3000)} gross with two children under 18, wage tax is ${h.eur(famP.lstMonat, 2)} with or without the commute, so the commuter euro has nothing left to reduce on the payslip.</p>
<h2>How you still get the money</h2>
<p>File the ${h.a('arbeitnehmerveranlagung', 'annual employee tax assessment')}. The tax office recalculates the whole year, and if the transport credit and commuter euro push your tax below zero, it refunds ${h.pct(h.P.absetzbetraege.sv_rueckerstattung_quote)} of your own social insurance contributions, up to ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_pendler_max)} a year for commuters instead of ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)}. With income up to ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)} a social insurance bonus of up to ${h.eur(h.P.absetzbetraege.vab_zuschlag)} is added. The refund cannot exceed the negative tax, and the commuter euro is what helps you reach that ceiling. Low earners with long commutes should therefore always file, even when the payslip already shows zero wage tax.</p>
<h2>What the commuter euro is not</h2>
<p>It is not a travel reimbursement from your employer and not a subsidy for the Klimaticket, Austria’s nationwide transport pass. It never arrives as a separate payment; you see it as lower wage tax, usually on the same payslip line as the allowance. Your mode of transport does not matter. To see what your own commute is worth each month, use the ${h.a('pendlerpauschale', 'commuter allowance calculator')} with your gross salary; it also shows whether the small or large allowance makes the difference. How the transport credit rises on low incomes is covered on the ${h.a('verkehrsabsetzbetrag', 'transport credit page')}.</p>
`,
  },
});
