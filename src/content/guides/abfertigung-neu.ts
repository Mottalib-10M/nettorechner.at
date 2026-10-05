import { defineGuide } from '../../lib/guide-types';
import { abfertigungNeu } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const AB = P.abfertigung;
const MONATE_MIN = AB.neu_mindest_beitragsjahre * 12;
/** Beispiel: 3.000 € brutto, 14 Bezüge, zehn Jahre, ohne Erträge (Untergrenze) und mit 2 % als reine Annahme. */
const z0 = abfertigungNeu(3000, 10, 0), z2 = abfertigungNeu(3000, 10, 0.02);
const monatsBeitrag = 3000 * AB.mv_satz;
const STUFEN = [1500, 2500, 3000, 4500, 8000];
const tabelle = STUFEN.map((b) => ({ b, r: abfertigungNeu(b, 10, 0) }));
/** Drei Einzahlungsjahre bei 3.000 €: die kleinste Summe, über die nach einer Kündigung durch den Arbeitgeber verfügt werden kann. */
const drei = abfertigungNeu(3000, AB.neu_mindest_beitragsjahre, 0);

export default defineGuide({
  id: 'abfertigung-neu',
  group: 'leistungen',
  order: 60,
  mini: 'abfertigungNeu',
  miniHref: 'abfertigung',
  related: ['abfertigung', 'abfertigung-alt', 'dienstgeberkosten', 'arbeitslosengeld', 'sonderzahlungen'],
  sources: ['bmsvg6', 'bmsvg14', 'bmsvg17', 'estg67'],
  de: {
    slug: 'abfertigung-neu',
    nav: 'Abfertigung neu',
    card: `Vorsorgekasse, ${DE.pct(AB.mv_satz, 2)} Beitrag, Rucksack und die vier Wege, über das Geld zu verfügen.`,
    title: 'Abfertigung neu 2026: Vorsorgekasse, Rucksack, Auszahlung',
    description: `Abfertigung neu 2026: ${DE.pct(AB.mv_satz, 2)} Beitrag ohne Obergrenze, Rucksack beim Jobwechsel, Geld erst nach ${AB.neu_mindest_beitragsjahre} Einzahlungsjahren mit ${DE.pct(AB.steuersatz)} Steuer oder steuerfrei zur Pension.`,
    h1: 'Abfertigung neu: wie die Vorsorgekasse funktioniert',
    intro: 'Was der Arbeitgeber jeden Monat für Sie einzahlt, wann Sie an das Geld dürfen und warum es bei einer Selbstkündigung nicht verloren geht.',
    resume: `Für jedes Dienstverhältnis, das seit dem 1. Jänner 2003 begonnen hat, zahlt der Arbeitgeber ${DE.pct(AB.mv_satz, 2)} des monatlichen Entgelts samt Urlaubs- und Weihnachtsgeld in eine Betriebliche Vorsorgekasse, ohne Geringfügigkeitsgrenze und ohne Höchstbeitragsgrundlage (§ 6 BMSVG). Bei ${DE.eur(3000)} brutto sind das ${DE.eur(monatsBeitrag, 2)} pro Bezug und ${DE.eur(z0.beitraegeJahr, 2)} im Jahr, nach zehn Jahren ${DE.eur(z0.einzahlungen)} ohne Erträge. Der erste Monat ist beitragsfrei, außer Sie kehren binnen zwölf Monaten zum selben Arbeitgeber zurück. Das Guthaben gehört Ihnen und wandert als Rucksack von Job zu Job. Verfügen dürfen Sie darüber erst, wenn ein Dienstverhältnis endet, mindestens ${AB.neu_mindest_beitragsjahre} Einzahlungsjahre (${MONATE_MIN} Beitragsmonate) vorliegen und Sie nicht selbst gekündigt haben, nicht verschuldet entlassen wurden und nicht unberechtigt ausgetreten sind. Dann können Sie sich das Geld mit ${DE.pct(AB.steuersatz)} Lohnsteuer auszahlen lassen, es in der Kasse lassen, in die Kasse des neuen Arbeitgebers mitnehmen oder steuerfrei in eine Pensionskasse oder Pensionszusatzversicherung übertragen. Wer binnen sechs Monaten nichts erklärt, bleibt automatisch veranlagt.`,
    faqs: [
      { q: 'Verliere ich die Abfertigung neu, wenn ich selbst kündige?', a: 'Nein. Bei einer Selbstkündigung, einer verschuldeten Entlassung oder einem unberechtigten Austritt dürfen Sie nur gerade nicht über das Geld verfügen (§ 14 Abs. 2 BMSVG). Es bleibt in der Vorsorgekasse, wird weiter veranlagt und Sie nehmen es beim nächsten Dienstverhältnis mit. Endet ein späteres Arbeitsverhältnis auf eine Art, die zur Verfügung berechtigt, können Sie über das gesamte Guthaben entscheiden, auch über den alten Teil.' },
      { q: 'Was zählt bei der Abfertigung neu als drei Einzahlungsjahre?', a: `${MONATE_MIN} Beitragsmonate seit der ersten Zahlung oder seit Ihrer letzten Verfügung, zusammengezählt über alle Arbeitgeber (§ 14 Abs. 2 Z 4 BMSVG). Monate aus Dienstverhältnissen, die noch laufen, zählen nicht mit. Wer also zwei Jahre bei einer Firma und anschließend ein Jahr bei einer anderen war, erreicht die drei Jahre beim Ende des zweiten Jobs. Eine Weiterveranlagung oder ein Übertrag in eine neue Kasse setzt die Zählung nicht zurück.` },
      { q: 'Wie lange habe ich Zeit, mich bei der Abfertigung neu zu entscheiden?', a: 'Sechs Monate ab dem Ende des Dienstverhältnisses. Die Erklärung geben Sie schriftlich bei der Vorsorgekasse ab, deren Namen Sie auf dem Lohnzettel oder in der jährlichen Kontonachricht finden. Lassen Sie die Frist verstreichen, veranlagt die Kasse das Geld einfach weiter (§ 17 Abs. 2 BMSVG). Läuft ein Arbeitsgerichtsverfahren über die Beendigung, beginnt die Frist erst mit dem rechtskräftigen Urteil.' },
      { q: 'Ist die Abfertigung neu steuerfrei, wenn ich sie für die Pension stehen lasse?', a: `Ja, wenn Sie sie an eine Pensionskasse, an eine Pensionszusatzversicherung oder an ein Versicherungsunternehmen zur Rentenauszahlung übertragen: Dann fällt keine Lohnsteuer an (§ 67 Abs. 3 EStG). Bei der Auszahlung als Kapital werden ${DE.pct(AB.steuersatz)} abgezogen, bei ${DE.eur(z0.einzahlungen)} also ${DE.eur(z0.einzahlungen * AB.steuersatz)}. Ob sich die Übertragung lohnt, hängt davon ab, wann Sie das Geld brauchen.` },
      { q: 'Zahlt der Arbeitgeber die Abfertigung neu schon im ersten Monat?', a: `Nein, der erste Monat eines Dienstverhältnisses ist immer beitragsfrei; wer nur einen Monat bleibt, bekommt gar keinen Beitrag. Ab dem zweiten Monat sind es ${DE.pct(AB.mv_satz, 2)}. Eine Ausnahme gilt, wenn Sie innerhalb von zwölf Monaten nach dem Ende eines Dienstverhältnisses wieder beim selben Arbeitgeber anfangen: Dann beginnt die Beitragspflicht am ersten Tag (§ 6 Abs. 1 BMSVG).` },
      { q: 'Wer bekommt die Abfertigung neu, wenn der Arbeitnehmer stirbt?', a: 'Ehegatte oder eingetragener Partner und die Kinder, für die zum Todeszeitpunkt Familienbeihilfe bezogen wird, zu gleichen Teilen, und zwar unabhängig davon, wie lange eingezahlt wurde (§ 14 Abs. 5 BMSVG). Sie müssen den Anspruch binnen drei Monaten schriftlich bei der Vorsorgekasse anmelden und können nur die Auszahlung verlangen. Meldet sich niemand, fällt das Guthaben in die Verlassenschaft.' },
    ],
    body: (h) => `
<h2>So entsteht Ihr Guthaben</h2>
<p>Der Arbeitgeber überweist den Beitrag gemeinsam mit der Sozialversicherung an Ihre Krankenkasse, die ihn an die Betriebliche Vorsorgekasse (BV-Kasse) weiterleitet. Maßgeblich ist das Entgelt im Sinne des ASVG, und zwar laut ${h.src('bmsvg6', '§ 6 Abs. 5 BMSVG')} ausdrücklich ohne Geringfügigkeitsgrenze und ohne Höchstbeitragsgrundlage. Auch eine geringfügige Beschäftigung baut also eine Abfertigung auf, und wer weit über der Höchstbeitragsgrundlage verdient, bekommt den Beitrag auf das volle Gehalt.</p>
${h.table(['Monatsbrutto', 'Beitrag pro Bezug', 'pro Jahr (14 Bezüge)', 'nach zehn Jahren'], tabelle.map(({ b, r }) => [h.eur(b), h.eur(b * h.P.abfertigung.mv_satz, 2), h.eur(r.beitraegeJahr, 2), h.eur(r.einzahlungen)]), `Beiträge von ${h.pct(h.P.abfertigung.mv_satz, 2)} ohne Erträge der Kasse und ohne den beitragsfreien ersten Monat`, ['r', 'r', 'r', 'r'])}
<p>Bei Altersteilzeit, Teilpension, Wiedereingliederungsteilzeit, Kurzarbeit und einigen weiteren Formen verkürzter Arbeitszeit rechnet der Arbeitgeber den Beitrag vom Entgelt vor der Herabsetzung (${h.src('bmsvg6', '§ 6 Abs. 4 BMSVG')}). Ihr Rucksack wächst in diesen Phasen also so weiter, als würden Sie voll arbeiten.</p>
<h2>Das Rucksackprinzip</h2>
<p>Anders als bei der ${h.a('abfertigung-alt', 'Abfertigung alt')} hängt der Anspruch nicht an einem bestimmten Arbeitgeber. Jeder Arbeitgeber zahlt in seine eigene Vorsorgekasse ein; die Beitragszeiten aus allen Dienstverhältnissen werden für die drei Einzahlungsjahre zusammengezählt. Einmal im Jahr schickt jede Kasse eine Kontonachricht mit Beiträgen, Erträgen und Kosten. Wer mehrere Kassen gesammelt hat, kann bei der Verfügung die eine Kasse beauftragen, auch die Guthaben der anderen mitzubewegen (${h.src('bmsvg14', '§ 14 Abs. 6 BMSVG')}).</p>
<h2>Wann Sie über das Geld verfügen dürfen</h2>
<p>Den Anspruch selbst haben Sie bei jeder Beendigung. Verfügen dürfen Sie nach ${h.src('bmsvg14', '§ 14 Abs. 2 BMSVG')} aber nicht, wenn</p>
<ul>
<li>Sie selbst gekündigt haben, außer während einer Elternteilzeit nach Mutterschutz- oder Väter-Karenzgesetz,</li>
<li>Sie verschuldet entlassen wurden oder ohne wichtigen Grund vorzeitig ausgetreten sind,</li>
<li>noch keine ${h.P.abfertigung.neu_mindest_beitragsjahre} Einzahlungsjahre seit der ersten Zahlung oder der letzten Verfügung vorliegen.</li>
</ul>
<p>Ohne neues Dienstverhältnis können Sie unabhängig davon jedenfalls verfügen, sobald Sie eine Eigenpension beziehen, das Anfallsalter für die vorzeitige Alterspension oder die Korridorpension erreicht haben oder seit mindestens fünf Jahren keine Beiträge mehr für Sie eingezahlt wurden (${h.src('bmsvg14', '§ 14 Abs. 4')}). Bei ${h.eur(3000)} brutto entsprechen drei Einzahlungsjahre rund ${h.eur(drei.einzahlungen)} an Beiträgen.</p>
<h2>Die vier Möglichkeiten nach dem Ende</h2>
<ol>
<li><strong>Auszahlung als Kapital:</strong> die ganze Summe auf Ihr Konto, mit ${h.pct(h.P.abfertigung.steuersatz)} Lohnsteuer, die die Kasse einbehält.</li>
<li><strong>Weiterveranlagung:</strong> Das Geld bleibt in der bisherigen Kasse, bis Sie in Pension gehen oder später anders verfügen.</li>
<li><strong>Übertragung:</strong> in die Vorsorgekasse des neuen Arbeitgebers oder in eine Kasse der Selbständigenvorsorge, damit alles an einem Ort liegt.</li>
<li><strong>Überweisung für die Pension:</strong> an eine Pensionskasse, bei der Sie schon berechtigt sind, an eine betriebliche Kollektivversicherung, eine Pensionszusatzversicherung oder die zusätzliche Pensionsversicherung; steuerfrei.</li>
</ol>
<p>So zählt es ${h.src('bmsvg17', '§ 17 Abs. 1 BMSVG')} auf. Es geht immer um die gesamte Abfertigung, eine Teilauszahlung sieht das Gesetz nicht vor. Wer nicht verfügen darf, kann das Guthaben trotzdem in die aktuelle Kasse holen, wenn es seit dem Ende des Dienstverhältnisses mindestens drei Jahre beitragsfrei gestellt war (§ 17 Abs. 2a).</p>
<!--mini:abfertigungNeu-->
<h2>Steuer: ${h.pct(h.P.abfertigung.steuersatz)} oder gar nichts</h2>
<p>Nach ${h.src('estg67', '§ 67 Abs. 3 EStG')} beträgt die Lohnsteuer auf Kapitalbeträge aus BV-Kassen ${h.pct(h.P.abfertigung.steuersatz)}. Fließt das Geld an ein Versicherungsunternehmen zur Rentenauszahlung, an eine Pensionskasse oder in einen prämienbegünstigten Pensionsinvestmentfonds, fällt keine Lohnsteuer an. Bei zehn Jahren und ${h.eur(3000)} brutto sind das ${h.eur(z0.einzahlungen * h.P.abfertigung.steuersatz)} Unterschied zwischen Auszahlung und Übertragung, gerechnet nur auf die Beiträge.</p>
<h2>Was die Kasse daraus macht</h2>
<p>Die Vorsorgekasse veranlagt das Geld, die Erträge sind von Jahr zu Jahr verschieden und werden hier nicht vorhergesagt. Unser Mini-Rechner zeigt deshalb nur die Beiträge. Im ${h.a('abfertigung', 'Abfertigungsrechner')} tragen Sie selbst einen Satz ein: Mit einer Annahme von zwei Prozent würden aus ${h.eur(z0.einzahlungen)} nach zehn Jahren ${h.eur(z2.kapital)}, mit null Prozent bleibt es bei den Beiträgen. Das ist keine Prognose; Ihren tatsächlichen Stand nennt die Kontonachricht. Wie viel der Beitrag Ihren Arbeitgeber zusätzlich zum Gehalt kostet, zeigt der ${h.a('dienstgeberkosten', 'Dienstgeberkosten-Rechner')}.</p>
`,
  },
  en: {
    slug: 'new-severance-scheme',
    nav: 'New severance scheme',
    card: `Provision fund, ${EN.pct(AB.mv_satz, 2)} contribution, the backpack principle and the four ways to use the money.`,
    title: 'Abfertigung neu 2026: Severance Fund, Backpack and Payout',
    description: `Abfertigung neu 2026 in plain English: ${EN.pct(AB.mv_satz, 2)} employer contribution, money that moves with you, payout after ${AB.neu_mindest_beitragsjahre} years, ${EN.pct(AB.steuersatz)} tax or none if kept for pension.`,
    h1: 'The new severance scheme: how the provision fund works',
    intro: 'What your employer pays in every month, when you can touch the money, and why resigning does not cost you a cent of it.',
    resume: `For every job in Austria that started on or after 1 January 2003, the employer pays ${EN.pct(AB.mv_satz, 2)} of monthly pay, including holiday and Christmas pay, into a company provision fund (Betriebliche Vorsorgekasse, BV-Kasse), with no marginal-earnings floor and no contribution ceiling (section 6 of the Company Employee Provision Act, BMSVG). On ${EN.eur(3000)} gross that is ${EN.eur(monatsBeitrag, 2)} per payment and ${EN.eur(z0.beitraegeJahr, 2)} a year, or ${EN.eur(z0.einzahlungen)} after ten years before any investment returns. The first month is contribution-free unless you return to the same employer within twelve months. The balance is yours and travels with you from job to job, which is why Austrians call it the backpack (Rucksack). You may only decide what to do with it when a job ends, once you have ${AB.neu_mindest_beitragsjahre} contribution years (${MONATE_MIN} months), and only if you did not resign, were not dismissed for misconduct and did not walk out without cause. Then you can cash it in at ${EN.pct(AB.steuersatz)} tax, leave it invested, move it to your new employer's fund or transfer it tax-free into a pension plan. Say nothing for six months and it simply stays invested.`,
    faqs: [
      { q: 'Do I lose my new-scheme severance if I resign?', a: 'No. If you resign, are dismissed for misconduct or leave without good cause, you only lose the right to decide on the money at that moment (section 14(2) BMSVG). It stays in the provision fund, keeps being invested and follows you to your next job. When a later job ends in a way that allows a decision, you can dispose of the whole balance, including the older part.' },
      { q: 'Can I take my Austrian severance fund with me when I leave the country?', a: `Not automatically. If your last job ended on terms that allow a decision and you have ${MONATE_MIN} contribution months, you can request payout before you go, at ${EN.pct(AB.steuersatz)} tax. If not, the money stays in the fund. Once you are not employed and no contributions have been paid for you under the BMSVG for at least five years, you may claim it anyway (section 14(4)). Keep your fund's name and your social insurance number.` },
      { q: 'What counts as three contribution years for the severance fund?', a: `${MONATE_MIN} contribution months since the first payment or your last decision on the money, added up across all employers (section 14(2)(4) BMSVG). Months from jobs that are still running do not count. Two years with one firm followed by one year with another reach the threshold when the second job ends. Leaving the money invested or moving it to a new fund does not reset the count.` },
      { q: 'How long do I have to decide what happens to my severance fund money?', a: 'Six months from the end of the job. You tell the provision fund in writing; its name is on your payslip and on the annual statement (Kontonachricht). If you let the deadline pass, the fund simply keeps the money invested (section 17(2) BMSVG). If you go to the labour court over how the job ended, the six months start when the judgment becomes final.' },
      { q: 'Is new-scheme severance tax-free if I use it for my pension?', a: `Yes, if you transfer it to a pension fund (Pensionskasse), a supplementary pension insurance or an insurer that pays it out as an annuity: no wage tax applies (section 67(3) of the Income Tax Act). Cashing it in costs ${EN.pct(AB.steuersatz)}, so ${EN.eur(z0.einzahlungen * AB.steuersatz)} on ${EN.eur(z0.einzahlungen)}. Whether a transfer pays off depends on when you will need the money.` },
      { q: 'Does the employer pay into the severance fund during my first month?', a: `No. The first month of any job is always contribution-free, so a job lasting one month earns nothing. From the second month the employer pays ${EN.pct(AB.mv_satz, 2)}. The exception: if you start again with the same employer within twelve months of a previous job there ending, contributions run from the first day (section 6(1) BMSVG).` },
    ],
    body: (h) => `
<h2>How the balance builds up</h2>
<p>Your employer sends the contribution together with social insurance to your health insurer, which passes it on to the provision fund. The base is pay as defined in the General Social Insurance Act, and ${h.src('bmsvg6', 'section 6(5) BMSVG')} says expressly that neither the marginal-earnings limit nor the contribution ceiling applies. A marginal job (geringfügige Beschäftigung) therefore builds severance too, and a high earner gets the contribution on the full salary.</p>
${h.table(['Monthly gross', 'Per payment', 'Per year (14 payments)', 'After ten years'], tabelle.map(({ b, r }) => [h.eur(b), h.eur(b * h.P.abfertigung.mv_satz, 2), h.eur(r.beitraegeJahr, 2), h.eur(r.einzahlungen)]), `Contributions of ${h.pct(h.P.abfertigung.mv_satz, 2)}, before fund returns and ignoring the free first month`, ['r', 'r', 'r', 'r'])}
<p>During partial retirement, partial pension, reintegration part-time, short-time work and some other forms of reduced hours, the employer calculates the contribution on pay before the reduction (${h.src('bmsvg6', 'section 6(4)')}). Your backpack keeps filling as if you worked full time.</p>
<h2>The backpack principle</h2>
<p>Unlike the ${h.a('abfertigung-alt', 'old severance scheme')}, the claim is not tied to one employer. Each employer pays into its chosen fund, and contribution months from all jobs are added up for the three-year test. Every fund sends an annual statement showing contributions, returns and costs. If you collect balances in several funds, you can ask one of them to move the others along when you make your decision (${h.src('bmsvg14', 'section 14(6)')}). Many expats discover two or three small balances only when they leave; the statements are worth keeping.</p>
<h2>When you may decide</h2>
<p>You have a claim whenever a job ends. Under ${h.src('bmsvg14', 'section 14(2) BMSVG')} you may not dispose of it if</p>
<ul>
<li>you resigned, except during parental part-time under the maternity or paternity leave acts,</li>
<li>you were dismissed for misconduct or walked out early without good cause,</li>
<li>fewer than ${h.P.abfertigung.neu_mindest_beitragsjahre} contribution years have passed since the first payment or your last decision.</li>
</ul>
<p>Whatever the reason the job ended, if you are not working you can always decide once you draw your own pension, reach the age for early or corridor retirement, or no contributions have been paid for you for at least five years (${h.src('bmsvg14', 'section 14(4)')}). At ${h.eur(3000)} gross, three contribution years amount to about ${h.eur(drei.einzahlungen)} of contributions.</p>
<h2>Four options after the job ends</h2>
<ol>
<li><strong>Cash payout:</strong> the whole amount to your bank account, with ${h.pct(h.P.abfertigung.steuersatz)} wage tax withheld by the fund.</li>
<li><strong>Keep it invested:</strong> the money stays in the same fund until you retire or decide otherwise later.</li>
<li><strong>Transfer:</strong> to your new employer's fund or to a self-employed provision fund, so everything sits in one place.</li>
<li><strong>Pension transfer:</strong> to a pension fund you already belong to, a group pension insurance, a supplementary pension insurance or the voluntary additional pension insurance, tax-free.</li>
</ol>
<p>These are the options in ${h.src('bmsvg17', 'section 17(1) BMSVG')}. They always cover the whole balance; the law has no partial payout. Even if you may not decide, you can pull the balance into your current fund once it has been contribution-free for at least three years since the job ended (section 17(2a)).</p>
<!--mini:abfertigungNeu-->
<h2>Tax: ${h.pct(h.P.abfertigung.steuersatz)} or nothing</h2>
<p>Under ${h.src('estg67', 'section 67(3) of the Income Tax Act')}, lump sums from provision funds are taxed at ${h.pct(h.P.abfertigung.steuersatz)}. If the money goes to an insurer for an annuity, to a pension fund or into a tax-favoured pension investment fund, there is no wage tax. On ten years at ${h.eur(3000)} gross that is ${h.eur(z0.einzahlungen * h.P.abfertigung.steuersatz)} difference between cash and transfer, counting contributions only.</p>
<h2>What the fund earns</h2>
<p>The provision fund invests the money; returns vary from year to year and we do not forecast them. The mini calculator therefore shows contributions only. In the ${h.a('abfertigung', 'severance calculator')} you enter a rate yourself: an assumption of two percent would turn ${h.eur(z0.einzahlungen)} into ${h.eur(z2.kapital)} after ten years, zero percent leaves the contributions. That is not a prediction; your real balance is on the annual statement. What the contribution costs your employer on top of salary is shown by the ${h.a('dienstgeberkosten', 'employer cost calculator')}.</p>
`,
  },
});
