import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { pendlerpauschale, pendlereuro } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const A = P.absetzbetraege, G = P.pendlerpauschale.gross;

/** Beispiel: 3.000 € brutto, 35 km, kleines Pauschale – aus dem Motor, nie von Hand. */
const ohne = kurz(3000), mit = kurz(3000, { pendler: 'klein', km: 35 });
const plusMonat = mit.nettoMonat - ohne.nettoMonat;

export default defineGuide({
  id: 'pendlerpauschale',
  group: 'rechner',
  order: 30,
  tool: 'pendler',
  related: ['pendlereuro', 'verkehrsabsetzbetrag', 'arbeitnehmerveranlagung', 'netto-3000', 'wien'],
  sources: ['estg16', 'estg33', 'bmfPendlerrechner', 'bmfPresse'],
  de: {
    slug: 'pendlerpauschale-rechner',
    nav: 'Pendlerpauschale-Rechner',
    card: 'Kleines und großes Pauschale, Pendlereuro 2026 und was davon netto im Lohnzettel ankommt.',
    title: 'Pendlerpauschale-Rechner 2026: Pendlereuro und Netto-Plus',
    description: 'Pendlerpauschale-Rechner 2026: kleine und große Pauschale, Pendlereuro 6 € je km, Aliquotierung nach Fahrten und was jede Stufe netto im Monat bringt.',
    h1: 'Pendlerpauschale und Pendlereuro 2026 berechnen',
    intro: 'Was die Pauschale für Ihren Arbeitsweg im Lohnzettel wirklich bringt, für alle sieben Stufen und mit dem verdreifachten Pendlereuro.',
    resume: `Wer bei ${DE.eur(3000)} brutto 35 Kilometer zur Arbeit pendelt und öffentliche Verkehrsmittel nutzen könnte, hat Anspruch auf das kleine Pendlerpauschale von ${DE.eur(pendlerpauschale('klein', 35))} im Jahr und auf ${DE.eur(pendlereuro('klein', 35))} Pendlereuro. Im Lohnzettel bringt das ${DE.eur(plusMonat, 2)} netto mehr pro Monat. Das Pauschale ist ein Freibetrag: Es senkt die Bemessungsgrundlage und wirkt daher mit Ihrem Grenzsteuersatz, also bei 30 Prozent Grenzsteuersatz mit knapp einem Drittel seines Betrags. Der Pendlereuro dagegen wird direkt von der Steuer abgezogen und beträgt seit Jänner 2026 ${DE.eur(A.pendlereuro_je_km)} je Kilometer der einfachen Strecke, dreimal so viel wie bis 2025. Ob das kleine oder das große Pauschale zusteht, entscheidet die Zumutbarkeit öffentlicher Verkehrsmittel, die der amtliche Pendlerrechner des Finanzministeriums feststellt. Beide Beträge gelten voll ab elf Fahrten im Monat, zu zwei Dritteln bei acht bis zehn und zu einem Drittel bei vier bis sieben Fahrten.`,
    faqs: [
      { q: 'Wie beantrage ich das Pendlerpauschale beim Arbeitgeber?', a: 'Sie füllen den Pendlerrechner des Finanzministeriums aus, drucken das Ergebnis als Formular L 34 EDV aus, unterschreiben es und geben es der Personalverrechnung. Ab dem Folgemonat zieht der Arbeitgeber Pauschale und Pendlereuro in jedem Lohnzettel ab. Ändern sich Wohnort oder Arbeitsstätte, müssen Sie das innerhalb eines Monats melden. Wer den Antrag versäumt, holt beides über die Arbeitnehmerveranlagung nach.' },
      { q: 'Was bringt mir das Pendlerpauschale, wenn ich kaum Lohnsteuer zahle?', a: `Im Lohnzettel nichts mehr, sobald die Lohnsteuer null ist. Über die Arbeitnehmerveranlagung bekommen Pendler aber eine SV-Rückerstattung: ${DE.pct(A.sv_rueckerstattung_quote)} der eigenen Sozialversicherungsbeiträge, höchstens ${DE.eur(A.sv_rueckerstattung_pendler_max)} im Jahr statt ${DE.eur(A.sv_rueckerstattung_max)} ohne Pendlerpauschale. Bei kleinen Einkommen kommt außerdem der erhöhte Verkehrsabsetzbetrag von ${DE.eur(A.vab_erhoeht)} zum Tragen. Den Antrag stellen Sie über FinanzOnline.` },
      { q: 'Zählen Homeoffice-Tage beim Pendlerpauschale?', a: 'Gezählt werden nur Tage, an denen Sie tatsächlich von der Wohnung zur Arbeitsstätte fahren. Mit elf oder mehr Fahrten im Monat steht die volle Pauschale zu, mit acht bis zehn zwei Drittel, mit vier bis sieben ein Drittel, darunter nichts. Wer drei Tage pro Woche im Homeoffice arbeitet, kommt meist auf acht bis zehn Fahrten und damit auf zwei Drittel von Pauschale und Pendlereuro.' },
      { q: 'Wann ist das große Pendlerpauschale möglich?', a: `Wenn die Benützung öffentlicher Verkehrsmittel zumindest auf der halben Strecke nicht zumutbar ist, etwa weil keine Verbindung besteht, die Fahrzeit zu lang ist oder eine Gehbehinderung vorliegt. Dann gibt es das Pauschale schon ab zwei Kilometern: ${DE.eur(G[0][2])} bis 20 Kilometer, ${DE.eur(G[1][2])} bis 40, ${DE.eur(G[2][2])} bis 60 und ${DE.eur(G[3][2])} darüber, jeweils im Jahr. Die Zumutbarkeit ermittelt der Pendlerrechner.` },
      { q: 'Steht mir mit einem Firmenauto ein Pendlerpauschale zu?', a: 'Nein, wenn Ihnen der Arbeitgeber ein Kraftfahrzeug für die Fahrten zwischen Wohnung und Arbeitsstätte zur Verfügung stellt, entfallen Pendlerpauschale und Pendlereuro. Ausgenommen sind ein Dienstfahrrad oder Elektrofahrrad: Damit bleibt der Anspruch bestehen. Ein vom Arbeitgeber bezahltes Öffi-Ticket verringert das Pauschale dagegen nur um die übernommenen Kosten.' },
    ],
    body: (h) => `
<h2>Was der Rechner zeigt</h2>
<p>Oben geben Sie Ihr Monatsbrutto, das Bundesland des Arbeitsorts, die Art des Pauschales, die Entfernung laut Pendlerrechner und die Zahl der Fahrten ein. Der Rechner lässt dann Ihren Lohnzettel zweimal laufen: einmal ohne, einmal mit Pendlerpauschale und Pendlereuro. Die Differenz ist das, was am Monatsende mehr auf dem Konto steht. Die Tabelle daneben wiederholt die Rechnung für jede der sieben Stufen, damit Sie sehen, was ein Umzug, ein neuer Arbeitsort oder die Einstufung als „groß“ ausmachen würde.</p>
<h2>Die Beträge 2026</h2>
${h.table(['Stufe', 'Entfernung (einfach)', 'Pauschale pro Jahr'], [
  ['klein', `${h.P.pendlerpauschale.klein[0][0]} bis ${h.P.pendlerpauschale.klein[0][1]} km`, h.eur(h.P.pendlerpauschale.klein[0][2])],
  ['klein', `über ${h.P.pendlerpauschale.klein[1][0]} bis ${h.P.pendlerpauschale.klein[1][1]} km`, h.eur(h.P.pendlerpauschale.klein[1][2])],
  ['klein', `über ${h.P.pendlerpauschale.klein[2][0]} km`, h.eur(h.P.pendlerpauschale.klein[2][2])],
  ['groß', `${h.P.pendlerpauschale.gross[0][0]} bis ${h.P.pendlerpauschale.gross[0][1]} km`, h.eur(h.P.pendlerpauschale.gross[0][2])],
  ['groß', `über ${h.P.pendlerpauschale.gross[1][0]} bis ${h.P.pendlerpauschale.gross[1][1]} km`, h.eur(h.P.pendlerpauschale.gross[1][2])],
  ['groß', `über ${h.P.pendlerpauschale.gross[2][0]} bis ${h.P.pendlerpauschale.gross[2][1]} km`, h.eur(h.P.pendlerpauschale.gross[2][2])],
  ['groß', `über ${h.P.pendlerpauschale.gross[3][0]} km`, h.eur(h.P.pendlerpauschale.gross[3][2])],
], `Pendlerpauschale nach § 16 Abs. 1 Z 6 EStG, Werte 2026`, ['l', 'l', 'r'])}
<p>Dazu kommt der Pendlereuro von ${h.eur(h.P.absetzbetraege.pendlereuro_je_km)} je Kilometer und Jahr (${h.src('estg33', '§ 33 Abs. 5 Z 4 EStG')}). Bei 35 Kilometern sind das ${h.eur(pendlereuro('klein', 35))} statt früher ${h.eur(35 * h.P.absetzbetraege.pendlereuro_je_km_2025)}; genau dieses Beispiel nennt auch das Finanzministerium in seiner ${h.src('bmfPresse', 'Mitteilung vom 30. Dezember 2025')}.</p>
<h2>Freibetrag und Absetzbetrag: der Unterschied in Euro</h2>
<p>Das Pauschale verringert das zu versteuernde Einkommen. Was es bringt, hängt deshalb vom Grenzsteuersatz ab: Bei 20 Prozent sind ${h.eur(h.P.pendlerpauschale.klein[0][2])} Pauschale ${h.eur(h.P.pendlerpauschale.klein[0][2] * 0.2)} weniger Steuer im Jahr, bei 40 Prozent ${h.eur(h.P.pendlerpauschale.klein[0][2] * 0.4)}. Der Pendlereuro wird dagegen von der fertig berechneten Steuer abgezogen, er ist für alle gleich viel wert, solange überhaupt Lohnsteuer anfällt. Wer wenig verdient, profitiert daher relativ mehr vom Pendlereuro, wer viel verdient, mehr vom Pauschale. Der Rechner kombiniert beides im echten Lohnzettel, mit Familienbonus und allen anderen Absetzbeträgen, statt nur „Pauschale mal Steuersatz“ zu rechnen.</p>
<h2>Entfernung und Zumutbarkeit: was der Pendlerrechner entscheidet</h2>
<p>Die Kilometer und die Frage „klein oder groß“ legen Sie nicht selbst fest. Maßgeblich ist das Ergebnis des ${h.src('bmfPendlerrechner', 'Pendlerrechners des BMF')}, der mit Ihrer Wohnadresse, der Arbeitsstätte und den Arbeitszeiten Fahrstrecke und Fahrzeit mit öffentlichen Verkehrsmitteln ermittelt. Ist die Fahrt mit den Öffis zumutbar, gilt das kleine Pauschale, sonst das große. Der Ausdruck dieses Rechners ist zugleich das Formular für den Arbeitgeber. Unser Rechner übernimmt Entfernung und Art einfach von dort.</p>
<h2>Mehrere Wohnsitze, Teilzeit und Werkverkehr</h2>
<p>Bei mehreren Wohnsitzen zählt entweder der Wohnsitz, der der Arbeitsstätte am nächsten liegt, oder der Familienwohnsitz. Wer Teilzeit arbeitet, rechnet in Fahrten pro Monat, nicht in Stunden: Vier lange Tage pro Woche ergeben rund 17 Fahrten und damit das volle Pauschale. Nutzen Sie an den meisten Arbeitstagen einen Werkverkehr des Arbeitgebers, steht das Pauschale nur für die Strecke zu, die der Werkverkehr nicht abdeckt. Alle diese Regeln stehen in ${h.src('estg16', '§ 16 Abs. 1 Z 6 EStG')}.</p>
<h2>Wenn die Lohnsteuer schon null ist</h2>
<p>Bei kleinen Einkommen reicht die Lohnsteuer oft nicht aus, um den Pendlereuro ganz abzuziehen. Dann hilft die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')}: Pendler bekommen bis zu ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_pendler_max)} ihrer Sozialversicherungsbeiträge zurück statt ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)}, und der ${h.a('verkehrsabsetzbetrag', 'Verkehrsabsetzbetrag')} steigt auf bis zu ${h.eur(h.P.absetzbetraege.vab_erhoeht)}. Die Erklärung zum Pendlereuro selbst steht auf der Seite zum ${h.a('pendlereuro', 'Pendlereuro 2026')}.</p>
`,
  },
  en: {
    slug: 'commuter-allowance-calculator',
    nav: 'Commuter allowance calculator',
    card: 'Small and large Pendlerpauschale, the 2026 commuter euro and what reaches your payslip.',
    title: 'Pendlerpauschale Calculator 2026: Commuter Euro and Net Gain',
    description: 'Pendlerpauschale calculator 2026 for Austria: small and large allowance, commuter euro of €6 per km, part-month rules and what each band adds to monthly pay.',
    h1: 'Commuter allowance and commuter euro 2026',
    intro: 'What the Austrian commuting tax break is really worth on your payslip, for all seven bands and with the tripled commuter euro.',
    resume: `If you earn ${EN.eur(3000)} gross and commute 35 kilometres to work on a route where public transport would be reasonable, you qualify for the small commuter allowance (kleines Pendlerpauschale) of ${EN.eur(pendlerpauschale('klein', 35))} a year plus a commuter euro (Pendlereuro) of ${EN.eur(pendlereuro('klein', 35))}. On your payslip that adds ${EN.eur(plusMonat, 2)} net per month. The allowance is a deduction: it lowers taxable pay, so it is worth your marginal tax rate times its amount, just under a third of it at a 30 percent marginal rate. The commuter euro is a credit taken straight off the tax, and since January 2026 it is ${EN.eur(A.pendlereuro_je_km)} per kilometre of the one-way distance, three times the 2025 amount. Whether you get the small or the large allowance depends on whether public transport is reasonable, which the Finance Ministry's official Pendlerrechner decides. Both apply in full from eleven commutes a month, two thirds with eight to ten and one third with four to seven.`,
    faqs: [
      { q: 'How do I claim the commuter allowance through my employer?', a: 'Run the Finance Ministry Pendlerrechner, print the result as form L 34 EDV, sign it and hand it to payroll. From the following month your employer deducts the allowance and the commuter euro on every payslip. Report a change of address or workplace within one month. If you never handed it in, you can still claim both in the annual employee tax assessment through FinanzOnline, the online tax office.' },
      { q: 'Is the commuter allowance worth anything if I pay almost no wage tax?', a: `Not on the payslip once wage tax reaches zero. In the annual tax assessment, however, commuters receive a social insurance refund of ${EN.pct(A.sv_rueckerstattung_quote)} of their own contributions, capped at ${EN.eur(A.sv_rueckerstattung_pendler_max)} instead of ${EN.eur(A.sv_rueckerstattung_max)} without the allowance, and low earners also get the higher transport credit of ${EN.eur(A.vab_erhoeht)}. You claim it through FinanzOnline after the end of the year.` },
      { q: 'Do home office days reduce the commuter allowance?', a: 'Only days on which you actually travel from home to the workplace count. Eleven or more trips a month give the full allowance, eight to ten give two thirds, four to seven one third, fewer give nothing. Someone working three days a week from home usually ends up with eight to ten trips and therefore two thirds of both the allowance and the commuter euro.' },
      { q: 'When can I get the large commuter allowance?', a: `When public transport is not reasonable for at least half of the route, because there is no connection, the journey takes too long or you have a walking disability. The large allowance starts at two kilometres: ${EN.eur(G[0][2])} up to 20 km, ${EN.eur(G[1][2])} up to 40, ${EN.eur(G[2][2])} up to 60 and ${EN.eur(G[3][2])} beyond, per year. The Pendlerrechner decides which applies to you.` },
      { q: 'Can I claim it if my employer gives me a company car?', a: 'No. If the employer provides a motor vehicle for the trip between home and work, both the commuter allowance and the commuter euro lapse. A company bicycle or e-bike is the exception and keeps the entitlement. A public transport pass paid by the employer only reduces the allowance by the amount the employer covers.' },
    ],
    body: (h) => `
<h2>What the calculator shows</h2>
<p>Enter your monthly gross, the federal state of your workplace, the type of allowance, the distance from the Pendlerrechner and the number of commutes. The calculator then runs your payslip twice, once without and once with the commuter allowance and commuter euro. The difference is what you gain at the end of each month. The table repeats the exercise for each of the seven bands, so you can see what a move, a new workplace or a “large” classification would change.</p>
<h2>The 2026 amounts</h2>
${h.table(['Band', 'One-way distance', 'Allowance per year'], [
  ['small', `${h.P.pendlerpauschale.klein[0][0]} to ${h.P.pendlerpauschale.klein[0][1]} km`, h.eur(h.P.pendlerpauschale.klein[0][2])],
  ['small', `over ${h.P.pendlerpauschale.klein[1][0]} to ${h.P.pendlerpauschale.klein[1][1]} km`, h.eur(h.P.pendlerpauschale.klein[1][2])],
  ['small', `over ${h.P.pendlerpauschale.klein[2][0]} km`, h.eur(h.P.pendlerpauschale.klein[2][2])],
  ['large', `${h.P.pendlerpauschale.gross[0][0]} to ${h.P.pendlerpauschale.gross[0][1]} km`, h.eur(h.P.pendlerpauschale.gross[0][2])],
  ['large', `over ${h.P.pendlerpauschale.gross[1][0]} to ${h.P.pendlerpauschale.gross[1][1]} km`, h.eur(h.P.pendlerpauschale.gross[1][2])],
  ['large', `over ${h.P.pendlerpauschale.gross[2][0]} to ${h.P.pendlerpauschale.gross[2][1]} km`, h.eur(h.P.pendlerpauschale.gross[2][2])],
  ['large', `over ${h.P.pendlerpauschale.gross[3][0]} km`, h.eur(h.P.pendlerpauschale.gross[3][2])],
], 'Commuter allowance under section 16(1)(6) of the Income Tax Act, 2026', ['l', 'l', 'r'])}
<p>On top comes the commuter euro of ${h.eur(h.P.absetzbetraege.pendlereuro_je_km)} per kilometre per year (${h.src('estg33', 'section 33(5)(4)')}). For 35 kilometres that is ${h.eur(pendlereuro('klein', 35))} instead of ${h.eur(35 * h.P.absetzbetraege.pendlereuro_je_km_2025)} before, the very example the Finance Ministry gave in its ${h.src('bmfPresse', 'announcement of 30 December 2025')}.</p>
<h2>Deduction versus credit, in euros</h2>
<p>The allowance reduces taxable income, so its value depends on your marginal rate: at 20 percent, ${h.eur(h.P.pendlerpauschale.klein[0][2])} of allowance save ${h.eur(h.P.pendlerpauschale.klein[0][2] * 0.2)} of tax a year; at 40 percent, ${h.eur(h.P.pendlerpauschale.klein[0][2] * 0.4)}. The commuter euro comes off the finished tax bill and is worth the same to everyone as long as there is wage tax to reduce. Lower earners therefore gain relatively more from the commuter euro, higher earners from the allowance. The calculator combines both on a real payslip, with Familienbonus Plus and the other credits, instead of multiplying allowance by tax rate.</p>
<h2>Distance and reasonableness: the Pendlerrechner decides</h2>
<p>You do not choose the kilometres or the small-or-large question yourself. What counts is the result of the ${h.src('bmfPendlerrechner', 'Finance Ministry Pendlerrechner')}, which uses your home address, workplace and working hours to work out route and travel time by public transport. If public transport is reasonable, the small allowance applies; otherwise the large one. Its printout doubles as the form for your employer. Our calculator simply takes distance and type from there.</p>
<h2>Second homes, part-time and company shuttles</h2>
<p>With several homes, either the one nearest the workplace or the family home counts. Part-timers count trips, not hours: four long days a week mean about 17 trips and the full allowance. If you use an employer shuttle on most working days, the allowance only covers the stretch the shuttle does not. All of this is in ${h.src('estg16', 'section 16(1)(6)')}.</p>
<h2>When wage tax is already zero</h2>
<p>On small salaries the wage tax is often too low to absorb the full commuter euro. That is where the ${h.a('arbeitnehmerveranlagung', 'employee tax assessment')} helps: commuters get back up to ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_pendler_max)} of their social insurance contributions instead of ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)}, and the ${h.a('verkehrsabsetzbetrag', 'transport credit')} rises to as much as ${h.eur(h.P.absetzbetraege.vab_erhoeht)}. The ${h.a('pendlereuro', 'commuter euro page')} explains the credit itself.</p>
`,
  },
});
