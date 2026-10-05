import { defineGuide } from '../../lib/guide-types';
import { kurz, dienstgeberkosten } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

/** Jahresbrutto mit 14 Bezügen: Monatsbrutto = Jahresbrutto ÷ 14. */
const JAHRE = [30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000, 90000, 100000];
const zeile = (j: number) => { const m = j / 14, k = kurz(m); return { j, m, k, quote: k.nettoJahr / j, lstQuote: k.lstJahr / j, svQuote: k.svJahr / j }; };
const tab = JAHRE.map(zeile);
const J = 50000, x = zeile(J);
/** Dasselbe Jahresbrutto in zwölf Teilen ohne Sonderzahlungen. */
const zwoelf = (j: number) => kurz(j / 12, {}, 0);
const x12 = zwoelf(J);
const vgl = [40000, 50000, 70000].map((j) => ({ j, v14: zeile(j).k.nettoJahr, v12: zwoelf(j).nettoJahr }));
/** Falsch geteilt: ÷ 12 statt ÷ 14 ergibt ein zu hohes Monatsbrutto. */
const falsch = J / 12;
const S = P.sonderzahlungen;
/** Dienstgeberkosten für das Beispiel, Arbeitsort Wien. */
const dg = dienstgeberkosten(J / 14, 'wien');

export default defineGuide({
  id: 'jahresgehalt',
  group: 'lohn',
  order: 40,
  mini: 'jahresgehalt',
  related: ['dreizehntes-gehalt', 'stundenlohn', 'lohnsteuer', 'netto-brutto', 'dienstgeberkosten', 'gehaltserhoehung'],
  sources: ['estg33', 'estg67', 'bmfRechner'],
  de: {
    slug: 'jahresgehalt-brutto-netto',
    nav: 'Jahresgehalt brutto netto',
    card: 'Jahresbrutto durch 14 statt durch 12: Monatsgehalt, Monatsnetto und Jahresnetto von 30.000 bis 100.000 Euro.',
    title: 'Jahresgehalt brutto netto 2026: Österreich mit 14 Bezügen',
    description: `Jahresgehalt brutto in netto 2026: In Österreich durch 14 teilen, nicht durch 12. Bei ${DE.eur(J)} bleiben ${DE.eur(x.k.nettoJahr)} netto. Tabelle von ${DE.eur(JAHRE[0])} bis ${DE.eur(JAHRE[9])}.`,
    h1: 'Jahresgehalt in Österreich: von brutto zu netto',
    intro: 'Wie ein Jahresbrutto aus Stelleninserat oder Angebot in Monatsgehalt, Monatsnetto und Jahresnetto übersetzt wird.',
    resume: `Ein Jahresgehalt wird in Österreich fast immer auf vierzehn Bezüge verteilt: zwölf Monatsgehälter plus Urlaubszuschuss und Weihnachtsremuneration. Das Monatsbrutto ist daher das Jahresbrutto geteilt durch 14, nicht durch 12. Aus ${DE.eur(J)} brutto im Jahr werden ${DE.eur(x.m, 2)} im Monat; wer durch zwölf teilt, kommt auf ${DE.eur(falsch, 2)} und überschätzt sein Gehalt. Netto bleiben bei ${DE.eur(J)} insgesamt ${DE.eur(x.k.nettoJahr)} im Jahr, ${DE.pct(x.quote, 1)} des Bruttos: ${DE.eur(x.k.nettoMonat, 2)} in jedem der zwölf Monate und dazu zwei Sonderzahlungen, die netto höher ausfallen. Die Verteilung auf vierzehn Bezüge spart Steuer, weil die beiden Sonderzahlungen nach Abzug eines Freibetrags von ${DE.eur(S.freibetrag)} nur mit ${DE.pct(S.stufen[1][1])} besteuert werden statt nach dem Tarif. Würde dasselbe Jahresbrutto in zwölf gleichen Teilen ohne Sonderzahlungen bezahlt, blieben nur ${DE.eur(x12.nettoJahr)} netto, also ${DE.eur(x.k.nettoJahr - x12.nettoJahr)} weniger. Prüfen Sie bei einem Angebot deshalb immer, ob das genannte Jahresgehalt vierzehn Bezüge meint.`,
    faqs: [
      { q: 'Wie rechne ich ein Jahresgehalt in Österreich in ein Monatsgehalt um?', a: `Teilen Sie das Jahresbrutto durch 14, wenn der Vertrag oder Kollektivvertrag Urlaubszuschuss und Weihnachtsremuneration vorsieht. ${DE.eur(J)} ergeben dann ${DE.eur(x.m, 2)} brutto im Monat. Durch 12 teilen Sie nur, wenn ausdrücklich keine Sonderzahlungen vereinbart sind. Überstunden, Provisionen und Prämien sind im genannten Jahresgehalt meist nicht enthalten; fragen Sie nach, wenn das Angebot einen Gesamtbetrag nennt.` },
      { q: 'Wie viel netto bleibt bei einem Jahresgehalt von 50.000 Euro?', a: `Mit vierzehn Bezügen ${DE.eur(x.k.nettoJahr)} netto im Jahr, ${DE.pct(x.quote, 1)} des Bruttos. Monatlich kommen ${DE.eur(x.k.nettoMonat, 2)} auf das Konto, im Juni und November zusätzlich die Sonderzahlungen. Die Sozialversicherung kostet im Jahr ${DE.eur(x.k.svJahr)}, die Lohnsteuer ${DE.eur(x.k.lstJahr)}. Diese Werte gelten außerhalb Wiens ohne Kinder und Pendlerpauschale; der Familienbonus Plus würde das Netto deutlich erhöhen.` },
      { q: 'Warum ist das Jahresnetto mit 14 Bezügen höher als mit 12?', a: `Weil zwei der vierzehn Bezüge mit festen Sätzen besteuert werden: ${DE.eur(S.freibetrag)} im Jahr frei, danach ${DE.pct(S.stufen[1][1])} (§ 67 EStG). Die zwölf laufenden Gehälter unterliegen dem Tarif mit Grenzsätzen von ${DE.pct(P.tarif.saetze[2])} oder mehr. Bei ${DE.eur(J)} Jahresbrutto macht das ${DE.eur(x.k.nettoJahr - x12.nettoJahr)} netto im Jahr aus. Wer sich ein Jahresgehalt ohne Sonderzahlungen in zwölf Teilen anbieten lässt, verschenkt diesen Vorteil.` },
      { q: 'Was heißt All-in beim Jahresgehalt?', a: `Bei einem All-in-Vertrag sind Überstunden und oft auch Mehrarbeit mit dem vereinbarten Gehalt abgegolten. Das Jahresgehalt wird trotzdem meist auf vierzehn Bezüge aufgeteilt, und die Lohnverrechnung behandelt es wie jedes andere Gehalt. Wie viele Stunden das Paket abdeckt und welcher kollektivvertragliche Grundlohn darin steckt, sollte der Vertrag offenlegen. Für die Brutto-Netto-Rechnung zählt nur der Betrag, der tatsächlich ausbezahlt wird.` },
      { q: 'Wie viel kostet ein Jahresgehalt den Arbeitgeber?', a: `Deutlich mehr als das Jahresbrutto. Zum Dienstgeberanteil der Sozialversicherung von ${DE.pct(P.sv.dg.kv + P.sv.dg.pv + P.sv.dg.av + P.sv.dg.uv + P.sv.dg.ie + P.sv.dg.wf, 2)} kommen ${DE.pct(P.sv.dg.mv, 2)} Abfertigung neu, ${DE.pct(P.dienstgeber.db, 1)} Dienstgeberbeitrag, der Zuschlag je Bundesland und ${DE.pct(P.dienstgeber.kommunalsteuer)} Kommunalsteuer. Für ein Jahresgehalt von ${DE.eur(J)} mit Arbeitsort Wien sind das ${DE.eur(dg.jahr)} im Jahr, ${DE.pct(dg.aufschlag, 1)} mehr. Der Dienstgeberkosten-Rechner zeigt den genauen Betrag je Bundesland.` },
    ],
    body: (h) => `
<h2>Durch 14, nicht durch 12</h2>
<p>Wer aus Deutschland, der Schweiz oder dem englischsprachigen Raum kommt, liest ein österreichisches Jahresgehalt leicht falsch. Hier wird das Jahresbrutto auf vierzehn Bezüge verteilt: zwölf laufende Monatsgehälter, dazu Urlaubszuschuss im Sommer und Weihnachtsremuneration im Spätherbst. Beide stehen im Kollektivvertrag der Branche oder im Dienstvertrag; das Einkommensteuergesetz nennt sie als 13. und 14. Monatsbezug (${h.src('estg67', '§ 67 Abs. 1 EStG')}). Ein Monatsgehalt von ${h.eur(x.m, 2)} ergibt daher ein Jahresbrutto von ${h.eur(J)}.</p>
<p>Umgekehrt heißt das: Ein Stelleninserat mit ${h.eur(J)} im Jahr bedeutet nicht ${h.eur(falsch, 2)} im Monat, sondern ${h.eur(x.m, 2)}. Der Unterschied von ${h.eur(falsch - x.m, 2)} pro Monat ist kein Verlust, er kommt mit den Sonderzahlungen. Für Mietverträge, Kreditanfragen und das Haushaltsbudget zählt aber das laufende Monatsnetto, und das ist niedriger, als eine Division durch zwölf vermuten lässt.</p>
<h2>Tabelle: Jahresbrutto, Monatsbrutto und Netto</h2>
${h.table(['Jahresbrutto', 'Monatsbrutto (÷ 14)', 'Monatsnetto laufend', 'Jahresnetto', 'Netto-Quote', 'Lohnsteuer in % vom Jahresbrutto'], tab.map((z) => [h.eur(z.j), h.eur(z.m, 2), h.eur(z.k.nettoMonat, 2), h.eur(z.k.nettoJahr), h.pct(z.quote, 1), h.pct(z.lstQuote, 1)]), 'Vierzehn gleiche Bezüge 2026, Sonderzahlungen im Juni und November, außerhalb Wiens, ohne Kinder und Pendlerpauschale; Werte aus dem Rechner dieser Seite, geprüft gegen den BMF-Rechner', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Netto-Quote sinkt mit steigendem Gehalt langsamer, als der Tarif mit Stufen bis ${h.pct(h.P.tarif.saetze[5])} vermuten lässt. Ein Grund ist die ${h.a('hoechstbeitragsgrundlage', 'Höchstbeitragsgrundlage')}: Ab ${h.eur(h.P.sv.hbg_monat)} brutto im Monat, also ab etwa ${h.eur(h.P.sv.hbg_monat * 14)} im Jahr, wächst die Sozialversicherung nicht mehr mit. Der andere Grund sind die Sonderzahlungen, deren Steuersatz von ${h.pct(S.stufen[1][1])} gleich bleibt, solange sie zusammen unter ${h.eur(S.stufen[0][0] + S.stufen[1][0])} liegen.</p>
<!--mini:jahresgehalt-->
<h2>Was die vierzehn Bezüge steuerlich wert sind</h2>
<p>Dass das Jahresgehalt in vierzehn Teilen kommt, ist nicht nur Tradition. Zwei der Teile sind steuerlich begünstigt, und das macht bei gleichem Jahresbrutto einen spürbaren Unterschied. Der Vergleich rechnet dasselbe Jahresbrutto einmal mit vierzehn Bezügen und einmal mit zwölf gleichen Gehältern ohne Sonderzahlungen:</p>
${h.table(['Jahresbrutto', 'Jahresnetto mit 14 Bezügen', 'Jahresnetto mit 12 Bezügen', 'Vorteil der 14 Bezüge'], vgl.map((v) => [h.eur(v.j), h.eur(v.v14), h.eur(v.v12), h.eur(v.v14 - v.v12)]), 'Gleiches Jahresbrutto, außerhalb Wiens, ohne Absetzbeträge außer dem Verkehrsabsetzbetrag', ['l', 'r', 'r', 'r'])}
<p>Der Vorteil wächst mit dem Gehalt, weil der Unterschied zwischen Grenzsteuersatz und festem Satz größer wird. Die Lohnsteuer auf das laufende Gehalt berechnet sich nach dem Tarif des ${h.src('estg33', '§ 33 EStG')}, die auf die Sonderzahlungen mit festen Sätzen. Wie die Sonderzahlungen im Detail besteuert werden und was davon netto bleibt, steht unter ${h.a('dreizehntes-gehalt', '13. und 14. Gehalt')}.</p>
<h2>Jobangebote richtig lesen</h2>
<p>Ein Angebot nennt meist ein Bruttojahresgehalt. Ehe Sie es mit Ihrem bisherigen Gehalt vergleichen, klären Sie drei Dinge:</p>
<ul>
<li><strong>Vierzehn oder zwölf Bezüge?</strong> Im Normalfall vierzehn. Steht im Vertrag ausdrücklich, dass keine Sonderzahlungen gebühren, ist das Jahresgehalt durch zwölf zu teilen, und netto bleibt bei gleichem Betrag weniger.</li>
<li><strong>Was ist enthalten?</strong> Überstunden, Zulagen, Provisionen und Bonuszahlungen erhöhen das Jahresbrutto, sind aber oft variabel. Rechnen Sie zuerst mit dem fixen Teil.</li>
<li><strong>All-in oder nicht?</strong> Bei einer All-in-Vereinbarung sind Überstunden mit dem Gehalt abgegolten. Das ist weder gut noch schlecht, sollte aber zum tatsächlichen Arbeitspensum passen. Ohne All-in werden Überstunden zusätzlich bezahlt, mit Zuschlag und zum Teil steuerfrei; mehr dazu unter ${h.a('ueberstunden', 'Überstunden')}.</li>
</ul>
<p>Für einen Vergleich mit Stundenlöhnen, etwa bei Teilzeit oder Angeboten auf Stundenbasis, hilft die Seite ${h.a('stundenlohn', 'Stundenlohn brutto netto')}. Wer sein Wunschnetto kennt und das passende Brutto sucht, nimmt den ${h.a('netto-brutto', 'Netto-Brutto-Rechner')} und multipliziert das Ergebnis mit vierzehn.</p>
<h2>Monatsnetto im Schnitt</h2>
<p>Für die Jahresplanung ist manchmal ein Durchschnittswert hilfreich: das Jahresnetto geteilt durch zwölf. Bei ${h.eur(J)} sind das ${h.eur(x.k.nettoJahr / 12, 2)} im Monat, also ${h.eur(x.k.nettoJahr / 12 - x.k.nettoMonat, 2)} mehr als das laufende Monatsnetto. Diesen Betrag sehen Sie aber nie auf einmal auf dem Konto. Wer mit dem Durchschnitt plant, sollte die beiden Sonderzahlungen gezielt für Urlaub, Versicherungen und Jahresrechnungen beiseitelegen. Den genauen Verlauf jedes Monats zeigt der amtliche ${h.src('bmfRechner', 'Brutto-Netto-Rechner des Finanzministeriums')} ebenso wie der Rechner auf dieser Seite.</p>
<h2>Das erste Jahr im neuen Job</h2>
<p>Beginnt ein Dienstverhältnis erst während des Jahres, erreicht niemand das vereinbarte Jahresgehalt im Eintrittsjahr. Die Sonderzahlungen kommen dann meist anteilig, je nach Kollektivvertrag. Die Lohnsteuer wird trotzdem jeden Monat so berechnet, als ob das Gehalt zwölf Monate lang flösse. Wer etwa im Oktober beginnt und vorher nichts verdient hat, zahlt deshalb im ersten Jahr zu viel Lohnsteuer und bekommt sie über die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} zurück. Für Vergleiche zwischen zwei Angeboten zählt daher immer das volle Jahresgehalt eines ganzen Kalenderjahres.</p>
`,
  },
  en: {
    slug: 'annual-salary-gross-net',
    nav: 'Annual salary gross to net',
    card: 'Divide by 14, not 12: monthly gross, monthly net and annual net for salaries from 30,000 to 100,000 euros.',
    title: 'Annual Salary Austria 2026: Gross to Net with 14 Payments',
    description: `Annual salary in Austria 2026: divide by 14, not 12. On ${EN.eur(J)} gross you keep ${EN.eur(x.k.nettoJahr)} net. Table from ${EN.eur(JAHRE[0])} to ${EN.eur(JAHRE[9])} with your monthly net pay shown.`,
    h1: 'Annual salary in Austria: from gross to net',
    intro: 'How to turn the yearly figure in an Austrian job offer into monthly gross, monthly take-home and annual net pay.',
    resume: `An annual salary in Austria is almost always paid in fourteen instalments: twelve monthly salaries plus holiday pay and Christmas pay, the so-called 13th and 14th salary. Your monthly gross is therefore the annual gross divided by 14, not 12. A ${EN.eur(J)} offer means ${EN.eur(x.m, 2)} a month; dividing by twelve gives ${EN.eur(falsch, 2)} and overstates what lands each month. Net of tax and social insurance, ${EN.eur(J)} leaves ${EN.eur(x.k.nettoJahr)} a year, ${EN.pct(x.quote, 1)} of gross: ${EN.eur(x.k.nettoMonat, 2)} in each of the twelve months plus two special payments that are worth more after tax. The fourteen-payment pattern saves tax because the two extra salaries are taxed at a flat ${EN.pct(S.stufen[1][1])} after a ${EN.eur(S.freibetrag)} allowance, instead of on the normal scale. If the same annual gross were paid in twelve equal parts with no special payments, only ${EN.eur(x12.nettoJahr)} would remain, ${EN.eur(x.k.nettoJahr - x12.nettoJahr)} less. Always check whether an offer’s annual figure assumes fourteen payments.`,
    faqs: [
      { q: 'How do I convert an Austrian annual salary into monthly pay?', a: `Divide the annual gross by 14 if your contract or collective agreement provides holiday pay and Christmas pay, which is the normal case. ${EN.eur(J)} then means ${EN.eur(x.m, 2)} gross a month. Divide by 12 only if the contract expressly excludes special payments. Overtime, commission and bonuses are usually not part of the quoted figure, so ask if an offer gives a single total.` },
      { q: 'How much net do I keep from a 50,000 euro salary in Austria?', a: `With fourteen payments, ${EN.eur(x.k.nettoJahr)} a year, ${EN.pct(x.quote, 1)} of gross. Each month ${EN.eur(x.k.nettoMonat, 2)} reaches your account, with the two special payments on top in June and November. Social insurance takes ${EN.eur(x.k.svJahr)} a year and wage tax ${EN.eur(x.k.lstJahr)}. These figures assume a job outside Vienna, no children and no commuter allowance; the Familienbonus Plus child credit would raise them noticeably.` },
      { q: 'Why does an Austrian annual salary give more net with 14 payments than with 12?', a: `Because two of the fourteen payments are taxed at fixed rates: ${EN.eur(S.freibetrag)} a year tax-free, then ${EN.pct(S.stufen[1][1])} (section 67 of the Income Tax Act). The twelve regular salaries are taxed on the scale, at marginal rates of ${EN.pct(P.tarif.saetze[2])} or more for most full-time employees. On ${EN.eur(J)} of annual gross the difference is ${EN.eur(x.k.nettoJahr - x12.nettoJahr)} net a year.` },
      { q: 'What does an all-in annual salary mean in Austria?', a: `In an all-in contract, overtime and extra hours are covered by the agreed salary instead of being paid separately. The annual figure is still normally split into fourteen payments and payroll treats it like any other salary. The contract should show how many hours the package is meant to cover and which collective-agreement base pay it contains. For gross-to-net purposes only the amount actually paid counts.` },
      { q: 'What does an annual salary in Austria cost the employer?', a: `Considerably more than the gross. On top of the employer’s ${EN.pct(P.sv.dg.kv + P.sv.dg.pv + P.sv.dg.av + P.sv.dg.uv + P.sv.dg.ie + P.sv.dg.wf, 2)} social insurance share come ${EN.pct(P.sv.dg.mv, 2)} for the severance fund, ${EN.pct(P.dienstgeber.db, 1)} family fund contribution, a regional surcharge and ${EN.pct(P.dienstgeber.kommunalsteuer)} municipal tax. For ${EN.eur(J)} of annual gross in Vienna the total is ${EN.eur(dg.jahr)}, ${EN.pct(dg.aufschlag, 1)} more. The employer cost calculator gives the exact figure by federal state.` },
    ],
    body: (h) => `
<h2>Divide by 14, not 12</h2>
<p>Most newcomers misread their first Austrian offer. Here the annual gross is spread over fourteen payments: twelve regular monthly salaries plus holiday pay (Urlaubszuschuss) in summer and Christmas pay (Weihnachtsremuneration) in late autumn. Both are set in the collective agreement for your sector or in your contract, and the Income Tax Act refers to them as the 13th and 14th monthly salary (${h.src('estg67', 'section 67(1)')}). A monthly salary of ${h.eur(x.m, 2)} therefore makes ${h.eur(J)} a year.</p>
<p>The other way round: a job ad stating ${h.eur(J)} a year does not mean ${h.eur(falsch, 2)} a month but ${h.eur(x.m, 2)}. The gap of ${h.eur(falsch - x.m, 2)} a month is not lost, it arrives with the special payments. But landlords, banks and your household budget work with the regular monthly take-home pay, and that is lower than dividing by twelve suggests. When you compare an Austrian offer with a salary in a twelve-payment country, compare annual figures, never monthly ones.</p>
<h2>Table: annual gross, monthly gross and net</h2>
${h.table(['Annual gross', 'Monthly gross (÷ 14)', 'Regular monthly net', 'Annual net', 'Net share', 'Wage tax as % of annual gross'], tab.map((z) => [h.eur(z.j), h.eur(z.m, 2), h.eur(z.k.nettoMonat, 2), h.eur(z.k.nettoJahr), h.pct(z.quote, 1), h.pct(z.lstQuote, 1)]), 'Fourteen equal payments in 2026, special payments in June and November, outside Vienna, no children, no commuter allowance; figures from this site’s engine, tested against the official calculator', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The net share falls more slowly than brackets reaching ${h.pct(h.P.tarif.saetze[5])} might suggest. One reason is the ${h.a('hoechstbeitragsgrundlage', 'contribution ceiling')}: above ${h.eur(h.P.sv.hbg_monat)} gross a month, roughly ${h.eur(h.P.sv.hbg_monat * 14)} a year, social insurance stops growing. The other is the special payments, whose ${h.pct(S.stufen[1][1])} rate stays flat as long as they total less than ${h.eur(S.stufen[0][0] + S.stufen[1][0])}.</p>
<!--mini:jahresgehalt-->
<h2>What the fourteen payments are worth in tax</h2>
<p>Being paid in fourteen parts is more than a tradition. Two parts enjoy a tax advantage, which makes a real difference at the same annual gross. The comparison below takes one annual gross and pays it once in fourteen parts and once in twelve equal salaries with no special payments:</p>
${h.table(['Annual gross', 'Annual net, 14 payments', 'Annual net, 12 payments', 'Advantage of 14 payments'], vgl.map((v) => [h.eur(v.j), h.eur(v.v14), h.eur(v.v12), h.eur(v.v14 - v.v12)]), 'Same annual gross, outside Vienna, transport credit only', ['l', 'r', 'r', 'r'])}
<p>The advantage grows with salary because the gap between your marginal rate and the fixed rate widens. Regular pay is taxed on the scale in ${h.src('estg33', 'section 33 of the Income Tax Act')}, special payments at fixed rates. If an international employer offers to pay your Austrian salary in twelve instalments, it is worth asking for the local fourteen-payment structure instead. How the special payments are taxed in detail is on the ${h.a('dreizehntes-gehalt', '13th and 14th salary')} page.</p>
<h2>Reading a job offer</h2>
<p>Austrian offers and job ads usually quote a gross annual salary. Before comparing it with your current pay, check three things:</p>
<ul>
<li><strong>Fourteen or twelve payments?</strong> Fourteen is the norm. If the contract states that no special payments are due, divide by twelve, and expect less net for the same total.</li>
<li><strong>What is included?</strong> Overtime, allowances, commission and bonuses raise the annual gross but are often variable. Work with the fixed part first.</li>
<li><strong>All-in or not?</strong> Under an all-in arrangement overtime is covered by the salary. That is neither good nor bad, but it should match the hours you will actually work. Without all-in, overtime is paid on top with a premium, part of which is tax-free; see ${h.a('ueberstunden', 'overtime')}.</li>
</ul>
<p>To compare with an hourly rate, for instance for part-time work, use the ${h.a('stundenlohn', 'hourly wage page')}. If you know the net you want and need the matching gross, use the ${h.a('netto-brutto', 'net-to-gross calculator')} and multiply the result by fourteen.</p>
<h2>Average net per month</h2>
<p>For budgeting, an average can help: annual net divided by twelve. At ${h.eur(J)} that is ${h.eur(x.k.nettoJahr / 12, 2)} a month, ${h.eur(x.k.nettoJahr / 12 - x.k.nettoMonat, 2)} more than the regular monthly net. You never see that amount arrive at once, though. If you plan with the average, set the two special payments aside for holidays, insurance and annual bills. The ${h.src('bmfRechner', 'Finance Ministry’s official calculator')} and the calculator on this site both show each month separately.</p>
`,
  },
});
