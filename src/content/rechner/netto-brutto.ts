import { defineGuide } from '../../lib/guide-types';
import { bruttoAusNetto, kurz } from '../../lib/engine/leistungen';
import { avSatz } from '../../lib/engine/lohn';
import { BMF_FAELLE } from '../../lib/pruefung';
import { P, DE, EN } from '../../lib/fmt';

/** Rückrechnung Netto → Brutto, alles aus dem Motor (Arbeitsort außerhalb Wiens, ohne Kinder, ohne Pendler). */
const PLUS = 100;
const STUFEN = [1500, 2000, 2500, 3000, 4000, 5000];
const zeilen = STUFEN.map((n) => { const b = bruttoAusNetto(n); return { n, b, mehr: bruttoAusNetto(n + PLUS) - b }; });
const mehrMin = Math.min(...zeilen.map((z) => z.mehr)), mehrMax = Math.max(...zeilen.map((z) => z.mehr));

/** Wunschnetto 2.500 €: Monatsbrutto, Jahresbrutto mit 14 Bezügen, Jahresnetto, Wien, ein Kind. */
const ZIEL = 2500;
const bZiel = bruttoAusNetto(ZIEL), kZiel = kurz(bZiel);
const bZielWien = bruttoAusNetto(ZIEL, { wien: true });
const bZielKind = bruttoAusNetto(ZIEL, { kinderU18: 1 });

/** Die Stufe der Arbeitslosenversicherung: 100 € netto mehr ab 1.800 € netto. */
const AVN = 1800;
const bAv0 = bruttoAusNetto(AVN), bAv1 = bruttoAusNetto(AVN + PLUS);

/** Jahresangebot: 50.000 € brutto, auf 14 Bezüge verteilt. */
const ANGEBOT = 50000, SZ = 2;
const mAngebot = ANGEBOT / (12 + SZ), kAngebot = kurz(mAngebot);

export default defineGuide({
  id: 'netto-brutto',
  group: 'rechner',
  order: 10,
  tool: 'netto',
  related: ['jahresgehalt', 'gehaltserhoehung', 'dreizehntes-gehalt', 'lohnsteuer', 'netto-2500', 'wien'],
  sources: ['estg33', 'oegkWerte', 'bmfRechner', 'estg67'],
  de: {
    slug: 'netto-brutto-rechner',
    nav: 'Netto-Brutto-Rechner',
    card: 'Welches Bruttogehalt Sie verlangen müssen, damit ein bestimmtes Netto am Konto landet.',
    title: 'Netto-Brutto-Rechner 2026: Brutto für Ihr Wunschnetto',
    description: `Netto-Brutto-Rechner 2026: ${DE.eur(ZIEL)} netto brauchen ${DE.eur(bZiel, 2)} brutto im Monat. Rückrechnung für Gehaltsverhandlung und Jobangebot, mit 14 Bezügen im Jahr.`,
    h1: 'Vom Wunschnetto zum Bruttogehalt',
    intro: 'Sie wissen, was am Monatsende am Konto stehen soll; der Rechner sagt Ihnen, welches Brutto Sie dafür im Vertrag brauchen.',
    resume: `Wer ${DE.eur(ZIEL)} netto im Monat bekommen möchte, braucht 2026 in Österreich ein Bruttogehalt von ${DE.eur(bZiel, 2)} im Monat, bei vierzehn Bezügen also ${DE.eur(kZiel.bruttoJahr)} im Jahr (Arbeitsort außerhalb Wiens, ohne Kinder und Pendlerpauschale). Die Rückrechnung ist keine einfache Division: Lohnsteuer und Sozialversicherung wachsen mit dem Gehalt stufenweise, deshalb kostet jeder zusätzliche Hunderter netto je nach Einkommen zwischen ${DE.eur(mehrMin)} und ${DE.eur(mehrMax)} brutto. Der Rechner sucht das Brutto, bei dem der laufende Monatsnetto genau Ihrem Wunsch entspricht, auf einen Cent genau, mit denselben Abzügen wie der Brutto-Netto-Rechner. Urlaubszuschuss und Weihnachtsremuneration kommen dazu und sind netto höher als ein Monatsgehalt, weil sie mit ${DE.pct(P.sonderzahlungen.stufen[1][1])} statt mit dem Tarif besteuert werden: Das Jahresnetto erreicht so ${DE.eur(kZiel.nettoJahr)} und nicht nur vierzehnmal ${DE.eur(ZIEL)}. In Wien braucht dasselbe Netto ${DE.eur(bZielWien, 2)} brutto, weil dort der Wohnbauförderungsbeitrag höher ist.`,
    faqs: [
      { q: 'Wie genau trifft der Netto-Brutto-Rechner mein Wunschnetto?', a: `Auf einen Cent. Der Rechner probiert Bruttobeträge in immer kleineren Schritten, bis der laufende Monatsnetto Ihrem Wunsch entspricht. Jeder Versuch durchläuft dieselbe Lohnverrechnung wie unser Brutto-Netto-Rechner, die wir mit ${DE.num(BMF_FAELLE)} Fällen des amtlichen BMF-Rechners abgeglichen haben. Abweichungen entstehen nur durch Dinge, die der Rechner nicht kennt, etwa Sachbezüge, Betriebsratsumlage oder Gewerkschaftsbeitrag.` },
      { q: `Welches Jahresbrutto verlange ich bei einem Jobangebot für ${DE.eur(ZIEL)} netto im Monat?`, a: `Rund ${DE.eur(kZiel.bruttoJahr)}. Das ist das nötige Monatsbrutto von ${DE.eur(bZiel, 2)} mal vierzehn, weil Angestellte in Österreich fast immer Urlaubszuschuss und Weihnachtsremuneration bekommen. Steht im Angebot nur ein Jahresbetrag, teilen Sie durch vierzehn, nicht durch zwölf. Wer durch zwölf teilt, überschätzt das Monatsgehalt und damit das Netto deutlich.` },
      { q: 'Warum kosten beim Rückrechnen von Netto auf Brutto 100 Euro netto nicht überall gleich viel?', a: `Weil auf jeden zusätzlichen Euro Sozialversicherung und Lohnsteuer mit dem Grenzsteuersatz fallen. Bei ${DE.eur(STUFEN[0])} netto kosten ${DE.eur(PLUS)} mehr ${DE.eur(zeilen[0].mehr, 2)} brutto, bei ${DE.eur(STUFEN[3])} netto schon ${DE.eur(zeilen[3].mehr, 2)}. Über der Höchstbeitragsgrundlage von ${DE.eur(P.sv.hbg_monat)} brutto fällt keine weitere Sozialversicherung an, dafür steigt der Steuersatz.` },
      { q: 'Senken Kinder das nötige Brutto für mein Wunschnetto?', a: `Ja, wenn Sie den Familienbonus Plus über den Arbeitgeber beantragen. Für ${DE.eur(ZIEL)} netto genügen mit einem Kind unter 18 Jahren ${DE.eur(bZielKind, 2)} brutto statt ${DE.eur(bZiel, 2)}, weil der Bonus bis zu ${DE.eur(P.absetzbetraege.familienbonus_monat_u18, 2)} im Monat von der Lohnsteuer abgezogen wird. Im Rechner tragen Sie Kinder, Teilung des Bonus, Alleinverdiener und Pendlerpauschale unter „Kinder, Alleinverdiener, Arbeitsweg“ ein.` },
    ],
    body: (h) => `
<h2>Wofür die Rückrechnung gebraucht wird</h2>
<p>In Österreich wird über Brutto verhandelt, gelebt wird vom Netto. Die Frage kommt deshalb meist in drei Situationen: vor einem Gehaltsgespräch („Was muss ich verlangen, damit ${h.eur(2 * PLUS)} mehr ankommen?“), bei einem Jobangebot mit Jahresbetrag und beim Wechsel aus dem Ausland, wenn man nur weiß, was man zum Leben braucht. Der Rechner oben dreht dafür den normalen Lohnzettel um. Sie geben das gewünschte Monatsnetto ein, wählen das Bundesland des Arbeitsorts und bei Bedarf Kinder oder Pendlerpauschale, und lesen das nötige Bruttogehalt pro Monat ab, samt Sozialversicherung, Lohnsteuer und Jahresnetto inklusive 13. und 14. Bezug.</p>
<h2>Was 100 Euro netto mehr brutto kosten</h2>
${h.table(['Monatsnetto', 'nötiges Brutto', `Brutto für ${h.eur(PLUS)} netto mehr`], zeilen.map((z) => [h.eur(z.n), h.eur(z.b, 2), h.eur(z.mehr, 2)]), 'Arbeitsort außerhalb Wiens, ohne Kinder und Pendlerpauschale, Werte 2026 aus unserem Rechenmotor', ['r', 'r', 'r'])}
<p>Die rechte Spalte ist die eigentliche Verhandlungszahl. Sie folgt dem ${h.src('estg33', 'Steuertarif nach § 33 EStG')}: Wer mit dem Grenzsteuersatz von ${h.pct(h.P.tarif.saetze[2])} rechnet, muss für jeden Netto-Euro weniger zusätzlich verlangen als jemand in der Stufe mit ${h.pct(h.P.tarif.saetze[3])}. Über der Höchstbeitragsgrundlage von ${h.eur(h.P.sv.hbg_monat)} entfällt die Sozialversicherung auf den Mehrbetrag (${h.src('oegkWerte', 'ÖGK, Werte 2026')}), deshalb sinkt die Zahl in der letzten Zeile trotz höherem Steuersatz wieder.</p>
<h3>Die Stufe der Arbeitslosenversicherung</h3>
<p>Ein Sonderfall liegt bei kleinen Gehältern. Der Beitrag zur Arbeitslosenversicherung steigt nicht gleitend, sondern in Stufen, und der jeweils gültige Satz gilt für das ganze Gehalt. Von ${h.eur(AVN)} auf ${h.eur(AVN + PLUS)} netto springt das nötige Brutto von ${h.eur(bAv0, 2)} auf ${h.eur(bAv1, 2)}, also um ${h.eur(bAv1 - bAv0, 2)}, weil der Satz dabei von ${h.pct(avSatz(bAv0))} auf ${h.pct(avSatz(bAv1))} steigt. Wer knapp an einer Stufe verhandelt, sollte das im Rechner gegenprüfen.</p>
<h2>Jahresangebote richtig umrechnen</h2>
<p>Stellenanzeigen nennen oft ein Jahresbrutto. Bei einem Angebot über ${h.eur(ANGEBOT)} sind das bei vierzehn Bezügen ${h.eur(mAngebot, 2)} im Monat und ${h.eur(kAngebot.nettoMonat, 2)} netto; im Jahr bleiben ${h.eur(kAngebot.nettoJahr)}. Steht im Vertrag ein Monatsbetrag, prüfen Sie, ob Ihr Kollektivvertrag Urlaubszuschuss und Weihnachtsremuneration vorsieht; die Abrechnung beider Zahlungen zeigt der ${h.a('sonderzahlungen', 'Urlaubsgeld- und Weihnachtsgeld-Rechner')}. Den umgekehrten Blick vom Jahresbetrag aus bietet die Seite zum ${h.a('jahresgehalt', 'Jahresgehalt')}.</p>
<h2>Warum das Jahresnetto mehr ist als vierzehnmal das Monatsnetto</h2>
<p>Der Rechner zielt auf den laufenden Monatsnetto, also das, was in den zwölf normalen Monaten überwiesen wird. Die beiden Sonderzahlungen werden innerhalb des Jahressechstels mit festen Sätzen versteuert (${h.src('estg67', '§ 67 EStG')}) und tragen weder AK-Umlage noch Wohnbauförderungsbeitrag. Im Beispiel mit ${h.eur(ZIEL)} netto landen im Juni deshalb ${h.eur(kZiel.uz.netto - kZiel.nettoMonat, 2)} mehr am Konto als in einem normalen Monat. Wer in der Verhandlung mit dem Jahresnetto argumentiert, rechnet also mit ${h.eur(kZiel.nettoJahr)} statt ${h.eur(ZIEL * (12 + SZ))}.</p>
<h2>Grenzen der Rückrechnung</h2>
<p>Der Rechner kennt Familienbonus Plus, Alleinverdiener- und Alleinerzieherabsetzbetrag, Pendlerpauschale und Pendlereuro. Er kennt nicht: Sachbezüge wie ein privat nutzbares Firmenauto, Betriebsratsumlage, Gewerkschaftsbeitrag, steuerfreie Zulagen und Überstunden. Was ein bestehendes Gehalt nach einer Erhöhung bringt, zeigt die Seite zur ${h.a('gehaltserhoehung', 'Gehaltserhöhung')}; die vollständige Abrechnung eines bekannten Bruttos liefert der ${h.a('home', 'Brutto-Netto-Rechner')}, abgeglichen mit dem ${h.src('bmfRechner', 'amtlichen Rechner des Finanzministeriums')}.</p>
`,
  },
  en: {
    slug: 'net-to-gross-calculator',
    nav: 'Net-to-gross calculator',
    card: 'The gross salary to ask for so that a given take-home amount reaches your account.',
    title: 'Net to Gross Calculator Austria 2026: Salary to Ask For',
    description: `Net to gross calculator for Austria 2026: a take-home of ${EN.eur(ZIEL)} a month needs ${EN.eur(bZiel, 2)} gross. For salary talks and job offers quoted over 14 payments.`,
    h1: 'From the take-home pay you want to the gross salary you need',
    intro: 'You know what should land in your account each month; the calculator tells you which gross figure to put in the contract.',
    resume: `To take home ${EN.eur(ZIEL)} a month in Austria in 2026 you need a gross salary of ${EN.eur(bZiel, 2)} a month, which over the usual fourteen payments comes to ${EN.eur(kZiel.bruttoJahr)} a year (workplace outside Vienna, no children, no commuter allowance). Working backwards is not a simple division, because wage tax (Lohnsteuer) and social insurance rise in steps with your pay: each extra hundred euros of take-home pay costs between ${EN.eur(mehrMin)} and ${EN.eur(mehrMax)} of gross salary, depending on where you are on the scale. The calculator searches for the gross amount that produces exactly your target net for a regular month, to the cent, using the same deductions as our gross-to-net calculator. On top come the 13th and 14th salary (holiday pay in June, Christmas pay in November), which are taxed at a flat ${EN.pct(P.sonderzahlungen.stufen[1][1])} and therefore pay out more net than a normal month: the annual net reaches ${EN.eur(kZiel.nettoJahr)}, not just fourteen times ${EN.eur(ZIEL)}. In Vienna the same take-home needs ${EN.eur(bZielWien, 2)} gross because of a higher housing levy.`,
    faqs: [
      { q: 'How precise is the net-to-gross calculator for a target take-home?', a: `To the cent. It tries gross amounts in ever smaller steps until the regular monthly net matches your target. Each attempt runs through the same payroll logic as our gross-to-net calculator, which we checked against ${EN.num(BMF_FAELLE)} cases from the Finance Ministry's official calculator. Differences only come from items it does not know, such as benefits in kind, a works council levy or trade union dues.` },
      { q: `What annual gross should I ask for in Austria to net ${EN.eur(ZIEL)} a month?`, a: `About ${EN.eur(kZiel.bruttoJahr)}. That is the required monthly gross of ${EN.eur(bZiel, 2)} times fourteen, because employees in Austria almost always receive holiday pay and Christmas pay as two extra salaries. When an offer quotes a yearly figure, divide by fourteen, not twelve. Dividing by twelve, as you would in many other countries, overstates the monthly salary and the take-home pay.` },
      { q: 'Why does each extra €100 of take-home pay cost a different gross amount when converting net to gross?', a: `Every additional euro attracts social insurance and wage tax at your marginal rate. At ${EN.eur(STUFEN[0])} net, ${EN.eur(PLUS)} more costs ${EN.eur(zeilen[0].mehr, 2)} gross; at ${EN.eur(STUFEN[3])} net it already costs ${EN.eur(zeilen[3].mehr, 2)}. Above the contribution ceiling of ${EN.eur(P.sv.hbg_monat)} gross a month no further social insurance is due, but the tax rate keeps rising.` },
      { q: 'Do children lower the gross I need for my target net pay?', a: `Yes, if you claim the Familienbonus Plus, Austria's child tax credit, through your employer. For ${EN.eur(ZIEL)} net, one child under 18 brings the required gross down to ${EN.eur(bZielKind, 2)} from ${EN.eur(bZiel, 2)}, because up to ${EN.eur(P.absetzbetraege.familienbonus_monat_u18, 2)} a month comes off your wage tax. Enter children, a shared bonus or the commuter allowance under the family and commute options.` },
    ],
    body: (h) => `
<h2>When you need to work backwards</h2>
<p>Austrian salaries are negotiated gross, but rent is paid from net. People moving to Austria usually know their budget and not the gross figure that funds it; others want to know what to ask for so that a raise actually shows on the payslip (Lohnzettel), or how to read an offer quoted as an annual sum. The calculator above reverses the payslip. Enter the monthly take-home you want, the federal state where you work and, if relevant, children or the commuter allowance, and read off the gross monthly salary, with social insurance, wage tax and the annual net including the two extra salaries.</p>
<h2>The gross cost of €100 more net</h2>
${h.table(['Monthly net', 'Gross needed', `Gross for ${h.eur(PLUS)} more net`], zeilen.map((z) => [h.eur(z.n), h.eur(z.b, 2), h.eur(z.mehr, 2)]), 'Workplace outside Vienna, no children, no commuter allowance; 2026 values from our calculation engine', ['r', 'r', 'r'])}
<p>The right-hand column is the number that matters in a negotiation. It tracks the ${h.src('estg33', 'tax scale in section 33 of the Income Tax Act')}: at a marginal rate of ${h.pct(h.P.tarif.saetze[2])} you need less extra gross per net euro than in the ${h.pct(h.P.tarif.saetze[3])} band. Above the monthly contribution ceiling of ${h.eur(h.P.sv.hbg_monat)}, no social insurance is charged on the extra (${h.src('oegkWerte', 'ÖGK figures for 2026')}), which is why the last row drops again despite a higher tax rate.</p>
<h3>The unemployment insurance steps</h3>
<p>Lower salaries have a quirk. The employee's unemployment insurance rate rises in steps, and each step applies to the whole salary. Going from ${h.eur(AVN)} to ${h.eur(AVN + PLUS)} net moves the required gross from ${h.eur(bAv0, 2)} to ${h.eur(bAv1, 2)}, a jump of ${h.eur(bAv1 - bAv0, 2)}, because the rate rises from ${h.pct(avSatz(bAv0))} to ${h.pct(avSatz(bAv1))}. If you are negotiating close to one of these steps, check both figures in the calculator.</p>
<h2>Reading an annual offer</h2>
<p>An offer of ${h.eur(ANGEBOT)} a year means ${h.eur(mAngebot, 2)} a month over fourteen payments and ${h.eur(kAngebot.nettoMonat, 2)} net in a regular month, ${h.eur(kAngebot.nettoJahr)} net over the year. Your collective agreement (Kollektivvertrag) normally sets the two extra salaries; the ${h.a('sonderzahlungen', 'holiday and Christmas pay calculator')} shows how each is taxed. If you want to start from the yearly figure instead, use the ${h.a('jahresgehalt', 'annual salary page')}.</p>
<h2>Why the annual net is more than fourteen regular months</h2>
<p>The calculator targets the regular monthly net. Holiday and Christmas pay fall under ${h.src('estg67', 'section 67 of the Income Tax Act')}: within the annual sixth they are taxed at fixed low rates and carry neither the chamber levy nor the housing levy. With a target of ${h.eur(ZIEL)} net, June therefore pays ${h.eur(kZiel.uz.netto - kZiel.nettoMonat, 2)} more than a normal month, and the year adds up to ${h.eur(kZiel.nettoJahr)} rather than ${h.eur(ZIEL * (12 + SZ))}.</p>
<h2>What the calculation leaves out</h2>
<p>It handles the Familienbonus Plus, the sole earner and single parent credits, the commuter allowance and commuter euro. It does not know about a company car for private use, works council levies, union dues, tax-free allowances or overtime. To see what a raise on an existing salary brings, use the ${h.a('gehaltserhoehung', 'pay rise page')}; for the full breakdown of a known gross, the ${h.a('home', 'gross-to-net calculator')}, cross-checked with the ${h.src('bmfRechner', 'Finance Ministry calculator')}.</p>
`,
  },
});
