import { defineGuide } from '../../lib/guide-types';
import { abfertigungNeu, abfertigungAlt } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const AB = P.abfertigung;
/** Startwerte des Rechners: 3.200 € brutto, 8 Jahre, 2 % angenommene Verzinsung (Annahme, keine Rendite). */
const neu8 = abfertigungNeu(3200, 8, 0.02), neu8ohne = abfertigungNeu(3200, 8, 0);
const alt8 = abfertigungAlt(3200, 8);
/** Gleiches Gehalt, gleiche Jahre: Abfertigung alt gegen eingezahlte Beiträge neu (ohne Erträge). */
const JAHRE = AB.alt_staffel.map(([j]) => j);
const vergleich = JAHRE.map((j) => ({ j, alt: abfertigungAlt(3200, j), neu: abfertigungNeu(3200, j, 0) }));
const v25 = vergleich[vergleich.length - 1];
const MIN = AB.alt_staffel[0][1], MAX = AB.alt_staffel[AB.alt_staffel.length - 1][1];

export default defineGuide({
  id: 'abfertigung',
  group: 'rechner',
  order: 80,
  tool: 'abfertigung',
  related: ['abfertigung-neu', 'abfertigung-alt', 'arbeitslosengeld', 'sonderzahlungen', 'dienstgeberkosten'],
  sources: ['bmsvg6', 'angg23', 'uspAbfertigung', 'estg67'],
  de: {
    slug: 'abfertigung-rechner',
    nav: 'Abfertigungsrechner',
    card: `Abfertigung neu aus der Vorsorgekasse oder alt nach Dienstjahren, brutto und nach ${DE.pct(AB.steuersatz)} Lohnsteuer.`,
    title: 'Abfertigung 2026: Rechner für Vorsorgekasse und altes Recht',
    description: `Abfertigung-Rechner 2026: Guthaben der Vorsorgekasse aus ${DE.pct(AB.mv_satz, 2)} Beitrag oder Abfertigung alt mit ${MIN} bis ${MAX} Monatsentgelten, jeweils nach ${DE.pct(AB.steuersatz)} Lohnsteuer.`,
    h1: 'Abfertigung berechnen: neu oder alt',
    intro: 'Welches der beiden Systeme für Ihr Dienstverhältnis gilt und was der Rechner dafür jeweils ausweist.',
    resume: `Welche Abfertigung Ihnen zusteht, hängt am Beginn des Dienstverhältnisses: Hat es am 1. Jänner 2003 oder später begonnen, gilt die Abfertigung neu nach dem BMSVG, sonst die Abfertigung alt nach § 23 Angestelltengesetz, außer Sie haben schriftlich einen Übertritt vereinbart. Bei der neuen zahlt der Arbeitgeber laufend ${DE.pct(AB.mv_satz, 2)} des Bruttos samt Sonderzahlungen in eine Betriebliche Vorsorgekasse; bei ${DE.eur(3200)} brutto und 14 Bezügen sind das ${DE.eur(neu8.beitraegeJahr, 2)} im Jahr, nach acht Jahren ${DE.eur(neu8ohne.einzahlungen)} ohne Erträge. Bei der alten zahlt der Arbeitgeber selbst ein Vielfaches des letzten Monatsentgelts: ${MIN} Monatsentgelte ab ${AB.alt_staffel[0][0]} Dienstjahren bis ${MAX} ab ${AB.alt_staffel[AB.alt_staffel.length - 1][0]} Jahren. Bei gleichem Gehalt wären das nach acht Jahren ${DE.eur(alt8.brutto)} brutto. Beide werden mit ${DE.pct(AB.steuersatz)} Lohnsteuer belastet. Der Rechner zeigt für das neue System das Guthaben mit einer Verzinsung, die Sie selbst annehmen, und für das alte die Zahl der Monatsentgelte samt Betrag.`,
    faqs: [
      { q: 'Woran erkenne ich, ob für mich Abfertigung neu oder alt gilt?', a: 'Am Eintrittsdatum. Begann das Dienstverhältnis vor dem 1. Jänner 2003 und läuft es seither ohne Unterbrechung, gilt das alte Recht; dann steht auf dem Lohnzettel auch kein Beitrag zur Mitarbeitervorsorge. Haben Sie und Ihr Arbeitgeber einen Übertritt vereinbart, gilt ab dem Stichtag das neue System, die bis dahin erworbenen Ansprüche wurden eingefroren oder in die Vorsorgekasse übertragen.' },
      { q: 'Warum fragt der Abfertigungsrechner nach einer Verzinsung?', a: 'Weil die Vorsorgekasse das Geld veranlagt und niemand den Ertrag im Voraus kennt. Wir rechnen deshalb mit dem Satz, den Sie eintragen, und zeigen daneben die reinen Einzahlungen. Ihren tatsächlichen Stand nennt die jährliche Kontonachricht Ihrer BV-Kasse. Mit null Prozent erhalten Sie eine Untergrenze, die nur die Beiträge des Arbeitgebers enthält.' },
      { q: 'Ist die Abfertigung alt nach 25 Jahren mehr wert als die neue?', a: `Bei gleichem Gehalt meist deutlich. Nach 25 Dienstjahren bringt das alte Recht ${MAX} Monatsentgelte, bei ${DE.eur(3200)} brutto also ${DE.eur(v25.alt.brutto)}. Im neuen System kommen in derselben Zeit ${DE.eur(v25.neu.einzahlungen)} an Beiträgen zusammen, plus die Erträge der Kasse. Dafür geht die neue Abfertigung bei einer Selbstkündigung nicht verloren.` },
    ],
    body: (h) => `
<h2>Was der Rechner für jedes System zeigt</h2>
<p>Oben wählen Sie das System und tragen Ihr durchschnittliches Monatsbrutto ein. Für die <strong>Abfertigung neu</strong> fragt der Rechner nach den Beitragsjahren in der Vorsorgekasse und nach einer angenommenen Verzinsung. Er rechnet ${h.pct(h.P.abfertigung.mv_satz, 2)} von 14 Bezügen pro Jahr, wie es ${h.src('bmsvg6', '§ 6 BMSVG')} vorschreibt, und zieht bei Auszahlung ${h.pct(h.P.abfertigung.steuersatz)} Lohnsteuer ab. Mit den Startwerten (${h.eur(3200)}, acht Jahre, zwei Prozent Annahme) ergibt das ${h.eur(neu8.kapital)} Guthaben und ${h.eur(neu8.netto6)} netto. Den beitragsfreien ersten Monat berücksichtigt er nicht, das Ergebnis liegt also leicht zu hoch.</p>
<p>Für die <strong>Abfertigung alt</strong> zählen die Dienstjahre beim selben Arbeitgeber. Der Rechner wählt die Stufe nach ${h.src('angg23', '§ 23 Abs. 1 Angestelltengesetz')}, rechnet das Monatsentgelt inklusive eines Sechstels für Sonderzahlungen und zieht ${h.pct(h.P.abfertigung.steuersatz)} ab. Bei ${h.eur(3200)} und acht Jahren sind das ${alt8.monate} Monatsentgelte zu ${h.eur(alt8.monatsentgelt, 2)}, zusammen ${h.eur(alt8.brutto)} brutto und ${h.eur(alt8.netto)} netto.</p>
<h2>Neu und alt bei gleichem Gehalt</h2>
${h.table(['Dienstjahre', 'alt: Monatsentgelte', 'alt: brutto', 'neu: Beiträge ohne Erträge'], vergleich.map(({ j, alt, neu }) => [String(j), String(alt.monate), h.eur(alt.brutto), h.eur(neu.einzahlungen)]), `Beispiel ${h.eur(3200)} brutto, 14 Bezüge, aus unserem Motor`, ['r', 'r', 'r', 'r'])}
<p>Das alte System springt in Stufen und belohnt lange Betriebstreue, das neue wächst gleichmäßig und wandert mit Ihnen von Job zu Job. Wie die Vorsorgekasse funktioniert, wann Sie über das Geld verfügen dürfen und was die drei Einzahlungsjahre bedeuten, steht im Ratgeber ${h.a('abfertigung-neu', 'Abfertigung neu')}. Wann der Anspruch nach altem Recht verloren geht, wann er fällig wird und was im Todesfall gilt, erklärt der Ratgeber ${h.a('abfertigung-alt', 'Abfertigung alt')}.</p>
<h2>Übertritt vom alten ins neue System</h2>
<p>Laut ${h.src('uspAbfertigung', 'Unternehmensserviceportal')} können Arbeitgeber und Arbeitnehmer mit einem Vertrag aus der Zeit vor 2003 schriftlich vereinbaren, ab einem Stichtag ins neue System zu wechseln. Entweder wird der bis dahin erworbene Anspruch eingefroren, dann gilt für diesen Teil weiter das alte Recht samt Verlust bei Selbstkündigung; oder er wird als Kapitalbetrag in die Vorsorgekasse übertragen. Ab dem Stichtag zahlt der Arbeitgeber in beiden Fällen ${h.pct(h.P.abfertigung.mv_satz, 2)}. Im Rechner geben Sie dann für den alten Teil die Jahre bis zum Stichtag ein und für den neuen die Jahre danach.</p>
<p>Die ${h.pct(h.P.abfertigung.steuersatz)} Lohnsteuer stehen in ${h.src('estg67', '§ 67 Abs. 3 EStG')}. Wer nach der Kündigung Arbeitslosengeld beantragt, rechnet es mit dem ${h.a('arbeitslosengeld', 'Arbeitslosengeld-Rechner')} nach.</p>
`,
  },
  en: {
    slug: 'severance-pay-calculator',
    nav: 'Severance pay calculator',
    card: `New-scheme severance from the provision fund or old-scheme months of pay, gross and after ${EN.pct(AB.steuersatz)} tax.`,
    title: 'Abfertigung 2026: Severance Pay Calculator for Austria',
    description: `Abfertigung calculator 2026: your provision fund balance from the ${EN.pct(AB.mv_satz, 2)} contribution or old-scheme severance of ${MIN} to ${MAX} months' pay, after ${EN.pct(AB.steuersatz)} wage tax.`,
    h1: 'Austrian severance pay: new scheme or old',
    intro: 'Which of the two systems applies to your job, and what the calculator shows for each.',
    resume: `Which severance pay (Abfertigung) you are owed in Austria depends on when your job started. If it began on 1 January 2003 or later, the new scheme (Abfertigung neu) under the Company Employee Provision Act (BMSVG) applies; otherwise the old scheme (Abfertigung alt) under section 23 of the Salaried Employees Act, unless you signed a transfer agreement. Under the new scheme your employer pays ${EN.pct(AB.mv_satz, 2)} of gross pay including the 13th and 14th salary into a provision fund (Betriebliche Vorsorgekasse, BV-Kasse); on ${EN.eur(3200)} a month with 14 payments that is ${EN.eur(neu8.beitraegeJahr, 2)} a year, or ${EN.eur(neu8ohne.einzahlungen)} after eight years before any returns. Under the old scheme the employer pays a multiple of your last monthly pay: ${MIN} months after ${AB.alt_staffel[0][0]} years of service, rising to ${MAX} after ${AB.alt_staffel[AB.alt_staffel.length - 1][0]}. On the same salary, eight years would give ${EN.eur(alt8.brutto)} gross. Both are taxed at a flat ${EN.pct(AB.steuersatz)}. The calculator shows the fund balance with a return you assume yourself, and the number of months and amount for the old scheme.`,
    faqs: [
      { q: 'How do I know whether the old or new severance scheme covers me?', a: 'Check your start date. If your employment began before 1 January 2003 and has run without a break since, the old scheme applies, and your payslip shows no provision fund contribution (Mitarbeitervorsorge). If you and your employer agreed a transfer, the new scheme applies from the agreed date, with old entitlements either frozen or moved into the provision fund as a lump sum.' },
      { q: 'Why does the severance calculator ask me for a rate of return?', a: 'Because the provision fund invests the money and nobody knows the return in advance. We use the rate you enter and also show the bare contributions. Your actual balance is in the annual account statement (Kontonachricht) your BV-Kasse sends you. Enter zero percent to see a floor made up only of your employer’s contributions.' },
      { q: 'After 25 years, is old-scheme severance worth more than the new one?', a: `On the same salary, usually by a wide margin. After 25 years of service the old scheme pays ${MAX} months' pay, which is ${EN.eur(v25.alt.brutto)} on ${EN.eur(3200)} gross. The new scheme collects ${EN.eur(v25.neu.einzahlungen)} of contributions over the same period, plus whatever the fund earns. In exchange, new-scheme money is never lost when you resign.` },
    ],
    body: (h) => `
<h2>What the calculator shows for each scheme</h2>
<p>Pick the scheme and enter your average monthly gross. For the <strong>new scheme</strong> it asks for the years paid into the provision fund and an assumed rate of return. It takes ${h.pct(h.P.abfertigung.mv_satz, 2)} of 14 payments a year, as ${h.src('bmsvg6', 'section 6 BMSVG')} requires, and deducts ${h.pct(h.P.abfertigung.steuersatz)} wage tax on payout. With the default values (${h.eur(3200)}, eight years, a two percent assumption) that is ${h.eur(neu8.kapital)} in the fund and ${h.eur(neu8.netto6)} net. It ignores the contribution-free first month, so the result is slightly high.</p>
<p>For the <strong>old scheme</strong>, years with the same employer count. The calculator picks the step under ${h.src('angg23', 'section 23(1) of the Salaried Employees Act')}, adds one sixth for special payments to the monthly pay and deducts ${h.pct(h.P.abfertigung.steuersatz)}. At ${h.eur(3200)} and eight years that is ${alt8.monate} months at ${h.eur(alt8.monatsentgelt, 2)}, ${h.eur(alt8.brutto)} gross and ${h.eur(alt8.netto)} net.</p>
<h2>Old and new on the same salary</h2>
${h.table(['Years of service', 'Old: months', 'Old: gross', 'New: contributions, no returns'], vergleich.map(({ j, alt, neu }) => [String(j), String(alt.monate), h.eur(alt.brutto), h.eur(neu.einzahlungen)]), `Example ${h.eur(3200)} gross, 14 payments, from our engine`, ['r', 'r', 'r', 'r'])}
<p>The old scheme rises in steps and rewards long loyalty to one employer; the new one grows evenly and follows you from job to job, which suits people who move around, including expats. How the provision fund works, when you can take the money and what the three contribution years mean is covered in the guide to the ${h.a('abfertigung-neu', 'new severance scheme')}. When the old-scheme claim is lost, when it falls due and what happens on death is in the guide to the ${h.a('abfertigung-alt', 'old severance scheme')}.</p>
<h2>Moving from the old to the new scheme</h2>
<p>According to the ${h.src('uspAbfertigung', 'Business Service Portal')}, an employer and an employee hired before 2003 can agree in writing to switch to the new scheme from a set date. Either the entitlement earned so far is frozen, and that part stays under the old rules, including loss on resignation; or it is converted into a lump sum and transferred to the provision fund. From the switch date the employer pays ${h.pct(h.P.abfertigung.mv_satz, 2)} either way. In the calculator, enter the years up to the switch for the old part and the years after it for the new part.</p>
<p>The flat ${h.pct(h.P.abfertigung.steuersatz)} tax is set out in ${h.src('estg67', 'section 67(3) of the Income Tax Act')}. If you claim unemployment benefit after losing your job, the ${h.a('arbeitslosengeld', 'unemployment benefit calculator')} works out the daily rate.</p>
`,
  },
});
