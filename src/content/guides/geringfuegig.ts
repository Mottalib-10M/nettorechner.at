import { defineGuide } from '../../lib/guide-types';
import { kurz, bruttoAusNetto } from '../../lib/engine/leistungen';
import { svLaufend } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const SV = P.sv, GF = SV.geringfuegigkeit, DGA = SV.dg_abgabe_grenze, SVM = SV.selbstversicherung_geringfuegig_monat;
/** Die Kante an der Grenze: Netto genau an der Grenze, zehn Cent darüber, und das Brutto, ab dem das Netto wieder gleich hoch ist. */
const an = kurz(GF).nettoMonat, drueber = kurz(GF + 0.1).nettoMonat;
const svDrueber = svLaufend(GF + 0.1).summe;
const gleich = bruttoAusNetto(GF);
const BRUTTOS = [400, 500, GF, GF + 0.1, 600, 650, 700, 800];
const tab = BRUTTOS.map((b) => ({ b, k: kurz(b) }));
/** Zwei geringfügige Jobs: je 400 €, zusammen über der Grenze. */
const zweiJobs = 400;
const summe2 = 2 * zweiJobs, dn2 = summe2 * SV.dn_mehrfach_geringfuegig;
/** Jahreswert der Selbstversicherung. */
const svmJahr = SVM * 12;

export default defineGuide({
  id: 'geringfuegig',
  group: 'lohn',
  order: 55,
  mini: 'geringfuegig',
  related: ['zuverdienst-arbeitslos', 'sozialversicherung', 'stundenlohn', 'teilzeit', 'dienstgeberkosten'],
  sources: ['oegkWerte', 'ogvGeringfuegig', 'uspGeringfuegig', 'svSelbstversicherung', 'wkoBeitraege', 'akAlv'],
  de: {
    slug: 'geringfuegige-beschaeftigung',
    nav: 'Geringfügige Beschäftigung',
    card: `Bis ${DE.eur(GF, 2)} im Monat brutto gleich netto: Selbstversicherung, mehrere Minijobs und das Verbot neben dem Arbeitslosengeld.`,
    title: `Geringfügige Beschäftigung 2026: Grenze ${DE.num(GF, 2)} Euro`,
    description: `Geringfügige Beschäftigung 2026: bis ${DE.eur(GF, 2)} im Monat brutto gleich netto. Selbstversicherung um ${DE.eur(SVM, 2)} im Monat, mehrere Minijobs und das Arbeitslosengeld.`,
    h1: 'Geringfügige Beschäftigung: was bis zur Grenze gilt',
    intro: 'Wann ein Job geringfügig ist, was Sie davon netto behalten, wie Sie sich kranken- und pensionsversichern und was mit mehreren Minijobs passiert.',
    resume: `Geringfügig beschäftigt ist 2026, wer aus einem Dienstverhältnis nicht mehr als ${DE.eur(GF, 2)} im Monat verdient. Die Grenze wurde für 2026 nicht erhöht und ist seit 2017 nur noch monatlich zu prüfen; Urlaubs- und Weihnachtsgeld zählen dabei nicht mit. Bis zur Grenze zahlen Sie keine Sozialversicherung und keine Lohnsteuer, brutto ist gleich netto. Sie sind unfallversichert, aber weder kranken- noch pensions- noch arbeitslosenversichert. Kranken- und Pensionsversicherung können Sie bei der ÖGK um ${DE.eur(SVM, 2)} im Monat dazukaufen. Arbeitsrechtlich sind Sie anderen Beschäftigten gleichgestellt, mit Urlaub, Abfertigung und Sonderzahlungen nach dem Kollektivvertrag. Ein Cent über der Grenze kostet viel: Bei ${DE.eur(GF + 0.1, 2)} brutto werden ${DE.eur(svDrueber, 2)} Sozialversicherung fällig, netto bleiben ${DE.eur(drueber, 2)}; erst ab ${DE.eur(gleich, 2)} brutto ist das Netto wieder so hoch wie an der Grenze. Wer mehrere geringfügige Jobs hat und zusammen über ${DE.eur(GF, 2)} kommt, wird voll pflichtversichert. Neben dem Arbeitslosengeld ist eine geringfügige Beschäftigung seit Jänner 2026 grundsätzlich nicht mehr erlaubt.`,
    faqs: [
      { q: 'Wie hoch ist die Geringfügigkeitsgrenze 2026?', a: `${DE.eur(GF, 2)} brutto im Monat, gleich wie 2025; die ÖGK hat die Grenze für 2026 ausdrücklich nicht aufgewertet. Maßgeblich ist das Entgelt, das Ihnen im Kalendermonat gebührt, ohne Urlaubszuschuss und Weihnachtsremuneration. Eine tägliche Grenze gibt es seit 2017 nicht mehr. Liegt das Entgelt nur deshalb unter der Grenze, weil eine Beschäftigung mitten im Monat beginnt oder endet, wird sie dadurch nicht geringfügig.` },
      { q: 'Was kostet die Selbstversicherung bei geringfügiger Beschäftigung?', a: `${DE.eur(SVM, 2)} im Monat (2026), das sind ${DE.eur(svmJahr, 2)} im Jahr. Der Betrag ist nicht aliquotierbar und bis zum 15. des Monats bei der ÖGK fällig. Dafür sind Sie kranken- und pensionsversichert, mit ärztlicher Hilfe, Spital, Medikamenten und gegebenenfalls Kranken- und Wochengeld. Stellen Sie den ersten Antrag innerhalb von sechs Wochen nach Beginn, gilt der Schutz rückwirkend ab dem ersten Arbeitstag.` },
      { q: 'Was passiert bei zwei geringfügigen Jobs über der Grenze?', a: `Die Entgelte werden zusammengerechnet. Liegen sie gemeinsam über ${DE.eur(GF, 2)}, sind Sie in der Kranken- und Pensionsversicherung pflichtversichert und zahlen vom gesamten Entgelt Beiträge, laut WKO ${DE.pct(SV.dn_mehrfach_geringfuegig, 2)}. Bei zweimal ${DE.eur(zweiJobs)} sind das ${DE.eur(dn2, 2)} im Monat. Damit sind Sie dann aber auch voll kranken- und pensionsversichert, ohne Selbstversicherung.` },
      { q: 'Darf ich neben dem Arbeitslosengeld geringfügig arbeiten?', a: `Seit 1. Jänner 2026 grundsätzlich nicht mehr: Wer einer Beschäftigung nachgeht, gilt nicht als arbeitslos. Ausnahmen gibt es etwa, wenn Sie den geringfügigen Job schon mindestens 26 Wochen ununterbrochen vor der Arbeitslosigkeit hatten, einmalig für bis zu 26 Wochen nach 365 Tagen Bezug, und unbefristet für über 50-Jährige und begünstigt Behinderte, jeweils nach 365 Tagen Bezug. Klären Sie den Einzelfall vorher mit dem AMS.` },
      { q: 'Muss ich für einen geringfügigen Job neben dem Hauptjob Steuern zahlen?', a: `Im Lohnzettel des Minijobs fällt keine Lohnsteuer an. Haben Sie aber gleichzeitig ein zweites lohnsteuerpflichtiges Dienstverhältnis, müssen Sie eine Arbeitnehmerveranlagung abgeben (§ 41 Abs. 1 Z 2 EStG). Dabei wird der geringfügige Lohn zum übrigen Einkommen gezählt und mit Ihrem Grenzsteuersatz besteuert. Neben einem Vollzeitjob werden außerdem Kranken-, Unfall- und Pensionsversicherungsbeiträge auf den Minijob fällig.` },
      { q: 'Was zahlt der Arbeitgeber für eine geringfügig beschäftigte Person?', a: `Immer die Unfallversicherung von ${DE.pct(SV.dg.uv, 2)}. Übersteigt die Summe aller geringfügigen Entgelte, die ein Arbeitgeber im Monat zahlt, ${DE.eur(DGA, 2)}, kommt die Dienstgeberabgabe dazu; laut WKO-Übersicht trägt er dann insgesamt ${DE.pct(SV.dg_ueber_dg_abgabe_grenze, 2)}. Dazu kommen die üblichen Lohnnebenkosten. An Ihrem Netto ändert das nichts, wohl aber an der Bereitschaft, mehrere Minijobber zu beschäftigen.` },
    ],
    body: (h) => `
<h2>Die Grenze 2026</h2>
<p>Ein Dienstverhältnis ist geringfügig, wenn das monatlich gebührende Entgelt ${h.eur(GF, 2)} nicht übersteigt (${h.src('oegkWerte', 'ÖGK, veränderliche Werte 2026')}). Anders als die meisten Werte der Sozialversicherung wurde diese Grenze für 2026 nicht mit der Aufwertungszahl angehoben, sie liegt seit 2025 unverändert. Eine Tagesgrenze gibt es seit 2017 nicht mehr; geprüft wird nur der Monat. Sonderzahlungen wie Urlaubszuschuss und Weihnachtsremuneration werden für diese Prüfung nicht eingerechnet (${h.src('uspGeringfuegig', 'Unternehmensserviceportal')}).</p>
<p>Ob die Grenze hält, entscheidet jeder Monat für sich. Wer im Dezember wegen des Weihnachtsgeschäfts mehr Stunden arbeitet und über ${h.eur(GF, 2)} kommt, ist in diesem Monat voll versichert. Ein Arbeitsverhältnis, das kürzer als einen Monat dauert, bleibt nur dann bloß unfallversichert, wenn sein Entgelt die Monatsgrenze nicht überschreitet; dagegen macht ein Beginn oder Ende mitten im Monat einen regulären Job nicht geringfügig. Wie viele Stunden je nach Stundenlohn unter die Grenze passen, rechnet die Seite ${h.a('stundenlohn', 'Stundenlohn brutto netto')} vor.</p>
<h2>Brutto gleich netto, aber nur unfallversichert</h2>
<p>Bis zur Grenze zahlen Sie weder Sozialversicherung noch Lohnsteuer; der Betrag auf dem Lohnzettel ist der Betrag auf dem Konto (${h.src('ogvGeringfuegig', 'oesterreich.gv.at')}). Der Preis dafür ist ein schmaler Versicherungsschutz: Sie sind gegen Arbeitsunfälle versichert, aber nicht kranken- und nicht pensionsversichert, und arbeitslosenversichert sind geringfügig Beschäftigte nie. Wer nur geringfügig arbeitet und nicht anderweitig versichert ist, etwa über Eltern, Partner oder eine Hauptbeschäftigung, hat ohne weiteren Schritt keine e-card-Leistungen und sammelt keine Pensionszeiten.</p>
<p>Arbeitsrechtlich sind Sie dagegen ganz normale Arbeitnehmerin oder Arbeitnehmer. Urlaub, Pflegefreistellung und Abfertigung stehen Ihnen unter denselben Voraussetzungen zu wie anderen; Sonderzahlungen bekommen Sie, wenn der Kollektivvertrag sie vorsieht (${h.src('uspGeringfuegig', 'USP')}).</p>
<h2>Die Selbstversicherung um ${h.eur(SVM, 2)}</h2>
<p>Geringfügig Beschäftigte mit Wohnsitz in Österreich, der EU, dem EWR oder der Schweiz können sich in der Kranken- und Pensionsversicherung selbst versichern (${h.src('svSelbstversicherung', 'ÖGK, Selbstversicherung nach § 19a ASVG')}). Die Eckpunkte 2026:</p>
<ul>
<li>Beitrag ${h.eur(SVM, 2)} im Monat, ${h.eur(svmJahr, 2)} im Jahr, nicht aliquotierbar, fällig zu Monatsbeginn und bis zum 15. zu zahlen;</li>
<li>Antrag bei der ÖGK des Bundeslandes, in dem Sie beschäftigt sind; beim ersten Antrag innerhalb von sechs Wochen nach Beginn wirkt der Schutz ab dem ersten Arbeitstag, sonst ab dem Tag nach dem Antrag;</li>
<li>Leistungen: ärztliche Hilfe, Spital, Medikamente, gegebenenfalls Kranken- und Wochengeld; mitversicherte Angehörige bekommen Sachleistungen;</li>
<li>nicht möglich bei Bezug von Arbeitslosengeld, Notstandshilfe, Kinderbetreuungsgeld oder einer Eigenpension und bei Pflichtversicherung bei einem anderen Träger.</li>
</ul>
<p>Wer nicht zahlt, verliert den Schutz nach zwei Monaten Rückstand, und nach Kündigung oder Rückstand gilt eine Sperrfrist von drei Monaten. Rechnerisch kostet die Selbstversicherung ${h.pct(SVM / GF, 1)} eines Einkommens an der Grenze; für Krankenschutz und Pensionszeiten zusammen ist das überschaubar.</p>
<!--mini:geringfuegig-->
<h2>Ein Cent über der Grenze</h2>
<p>Wer die Grenze überschreitet, zahlt sofort auf das ganze Entgelt Kranken-, Pensionsversicherung, Arbeiterkammerumlage und Wohnbauförderung. Die Arbeitslosenversicherung bleibt bei diesen Beträgen dank der Staffel bei null. Trotzdem fällt das Netto deutlich:</p>
${h.table(['Monatsbrutto', 'Sozialversicherung', 'Netto', 'Status'], tab.map((z) => [h.eur(z.b, 2), h.eur(z.k.svMonat, 2), h.eur(z.k.nettoMonat, 2), z.b <= GF ? 'geringfügig' : 'voll versichert']), 'Laufender Monat 2026, außerhalb Wiens; Werte aus dem Rechner dieser Seite', ['l', 'r', 'r', 'l'])}
<p>Erst bei ${h.eur(gleich, 2)} brutto ist das Netto wieder so hoch wie an der Grenze. Dazwischen arbeiten Sie für weniger Geld, sind dafür aber voll kranken- und pensionsversichert, ohne ${h.eur(SVM, 2)} selbst zu zahlen. Wer ohnehin die Selbstversicherung nehmen würde, verliert durch den Sprung über die Grenze also weniger, als die Tabelle zeigt.</p>
<h2>Mehrere Minijobs und Minijob neben dem Hauptjob</h2>
<p>Mehrere geringfügige Beschäftigungen werden zusammengerechnet. Liegt die Summe über ${h.eur(GF, 2)}, besteht Pflichtversicherung in Kranken- und Pensionsversicherung, und Beiträge werden vom gesamten Entgelt fällig (${h.src('uspGeringfuegig', 'USP')}). Der Dienstnehmeranteil beträgt laut ${h.src('wkoBeitraege', 'WKO-Übersicht')} ${h.pct(SV.dn_mehrfach_geringfuegig, 2)}; bei zwei Jobs mit je ${h.eur(zweiJobs)} sind das ${h.eur(dn2, 2)} im Monat.</p>
<p>Neben einer vollversicherten Hauptbeschäftigung ist der Minijob in der Kranken-, Unfall- und Pensionsversicherung beitragspflichtig. Steuerlich führt jeder zweite gleichzeitige Bezug zur Pflichtveranlagung (${h.src('estg41', '§ 41 Abs. 1 Z 2 EStG')}): Das Finanzamt zählt den Minijob zum Gehalt und besteuert ihn mit Ihrem Grenzsteuersatz.</p>
<h2>Arbeitslosengeld und Minijob seit 2026</h2>
<p>Seit 1. Jänner 2026 gilt nicht mehr als arbeitslos, wer einer Beschäftigung nachgeht, auch einer geringfügigen (${h.src('akAlv', 'AK, Arbeitslosenversicherung 2026')}). Erlaubt bleibt ein Minijob nur in Ausnahmen, etwa wenn er schon mindestens 26 Wochen ununterbrochen vor der Arbeitslosigkeit bestand. Die übrigen Ausnahmen und was beim Zuverdienst zur Notstandshilfe gilt, stehen auf der Seite ${h.a('zuverdienst-arbeitslos', 'Zuverdienst beim Arbeitslosengeld')}.</p>
<h2>Die Seite des Arbeitgebers</h2>
<p>Der Arbeitgeber meldet auch geringfügig Beschäftigte bei der ÖGK an und zahlt für sie ${h.pct(SV.dg.uv, 2)} Unfallversicherung. Übersteigen die geringfügigen Entgelte, die er im Monat insgesamt zahlt, ${h.eur(DGA, 2)}, wird zusätzlich die Dienstgeberabgabe fällig; in der Übersicht der WKO steigt seine Belastung dann auf ${h.pct(SV.dg_ueber_dg_abgabe_grenze, 2)}. Diese Grenze ist eineinhalbmal so hoch wie die Geringfügigkeitsgrenze und wurde für 2026 ebenfalls nicht erhöht (${h.src('oegkWerte', 'ÖGK')}). Was eine Anstellung insgesamt kostet, zeigt der ${h.a('dienstgeberkosten', 'Dienstgeberkosten-Rechner')}.</p>
`,
  },
  en: {
    slug: 'marginal-employment',
    nav: 'Marginal employment (Minijob)',
    card: `Up to ${EN.eur(GF, 2)} a month, gross equals net: opt-in insurance, several small jobs and the ban alongside unemployment benefit.`,
    title: `Marginal Employment Austria 2026: The ${EN.num(GF, 2)} Euro Limit`,
    description: `Marginal employment in Austria 2026: up to ${EN.eur(GF, 2)} a month, gross equals net. Opt-in health and pension cover for ${EN.eur(SVM, 2)} a month, and two or more small jobs.`,
    h1: 'Marginal employment in Austria: the rules below the limit',
    intro: 'When a small job counts as geringfügig, what you keep, how to buy health and pension cover, and what happens with several small jobs.',
    resume: `A job in Austria counts as marginal employment (geringfügige Beschäftigung) in 2026 if it pays no more than ${EN.eur(GF, 2)} a month. The limit was not raised for 2026 and has been checked monthly only since 2017; holiday and Christmas pay do not count towards it. Below the limit you pay no social insurance and no wage tax, so gross equals net. You are covered for accidents at work, but not for health, pension or unemployment. Health and pension cover can be bought from the ÖGK, the Austrian health insurance fund, for ${EN.eur(SVM, 2)} a month. Under employment law you have the same rights as other employees, including paid holiday, severance and any special payments in your collective agreement. One cent over the limit is costly: at ${EN.eur(GF + 0.1, 2)} gross, ${EN.eur(svDrueber, 2)} of social insurance is due and ${EN.eur(drueber, 2)} remains; only from ${EN.eur(gleich, 2)} gross is net back to the level at the limit. Several small jobs that together exceed ${EN.eur(GF, 2)} trigger full compulsory insurance. Since January 2026, a small job alongside unemployment benefit is generally no longer allowed.`,
    faqs: [
      { q: 'What is the Austrian marginal employment limit in 2026?', a: `${EN.eur(GF, 2)} gross a month, the same as in 2025; the ÖGK explicitly did not uprate it for 2026. What counts is the pay due for the calendar month, excluding holiday and Christmas pay. There has been no daily limit since 2017. If pay falls below the limit only because a job starts or ends mid-month, that does not make the job marginal.` },
      { q: 'How much does opt-in insurance cost for a marginal job in Austria?', a: `${EN.eur(SVM, 2)} a month in 2026, or ${EN.eur(svmJahr, 2)} a year. It cannot be split for part-months and must reach the ÖGK by the 15th. In return you get health and pension cover: doctors, hospital, medicines and, where applicable, sick pay and maternity pay. If you apply for the first time within six weeks of starting, cover begins on your first working day.` },
      { q: 'What happens if two marginal jobs in Austria together exceed the limit?', a: `The pay from both is added up. If the total exceeds ${EN.eur(GF, 2)}, you become compulsorily insured for health and pension and owe contributions on the whole amount, ${EN.pct(SV.dn_mehrfach_geringfuegig, 2)} according to the Chamber of Commerce. For two jobs of ${EN.eur(zweiJobs)} each that is ${EN.eur(dn2, 2)} a month. In return you are fully covered for health and pension without buying opt-in insurance.` },
      { q: 'Can I keep a marginal job while claiming Austrian unemployment benefit?', a: `Since 1 January 2026, generally not: anyone in work no longer counts as unemployed. Exceptions include a small job you already held for at least 26 uninterrupted weeks before becoming unemployed, a one-off period of up to 26 weeks after 365 days on benefit, and unlimited small earnings for people over 50 or with a recognised disability, in both cases after 365 days on benefit. Check your case with the AMS first.` },
      { q: 'Do I pay tax on a marginal job alongside my main job in Austria?', a: `The small job’s own payslip shows no wage tax. But if you have a second taxable job at the same time, you must file an annual tax return (section 41(1)(2) of the Income Tax Act). The tax office then adds the marginal pay to your other income and taxes it at your marginal rate. Alongside a fully insured main job, health, accident and pension contributions are also due on the small job.` },
      { q: 'What does an Austrian employer pay for a marginal employee?', a: `Always accident insurance of ${EN.pct(SV.dg.uv, 2)}. If the total marginal pay an employer hands out in a month exceeds ${EN.eur(DGA, 2)}, the employer levy (Dienstgeberabgabe) is added; the Chamber of Commerce overview then shows a total of ${EN.pct(SV.dg_ueber_dg_abgabe_grenze, 2)}. The usual payroll taxes come on top. None of this reduces your net pay.` },
    ],
    body: (h) => `
<h2>The 2026 limit</h2>
<p>A job is marginal if the pay due for the month does not exceed ${h.eur(GF, 2)} (${h.src('oegkWerte', 'ÖGK variable values 2026')}). Unlike most social insurance figures, the limit was not uprated for 2026 and has stayed the same since 2025. There has been no daily limit since 2017; only the month counts. Special payments such as holiday and Christmas pay are left out of the test (${h.src('uspGeringfuegig', 'Business Service Portal')}). The German word you will see on contracts and payslips is geringfügig, literally “minor”; in everyday speech people say Minijob.</p>
<p>Each month is judged on its own. If you work extra hours in December for the Christmas rush and go above ${h.eur(GF, 2)}, you are fully insured for that month. A job lasting less than a month stays accident-only if its pay does not exceed the monthly limit; a regular job that merely starts or ends mid-month does not become marginal because of the short month. The ${h.a('stundenlohn', 'hourly wage page')} shows how many hours fit under the limit at a given rate.</p>
<h2>Gross equals net, but accident cover only</h2>
<p>Below the limit you pay neither social insurance nor wage tax; what is on the payslip is what reaches your account (${h.src('ogvGeringfuegig', 'oesterreich.gv.at')}). The trade-off is thin protection: you are insured against accidents at work, but you have no health or pension insurance through the job, and marginal employees are never covered for unemployment. If nothing else covers you, for example as a dependant of a parent or partner or through a main job, you have no e-card benefits and build up no pension months. This matters for students from abroad and for partners of expats who take a small job while settling in.</p>
<p>Under employment law you are an ordinary employee. Paid holiday, care leave and severance apply on the same terms as for everyone else, and you receive special payments if your collective agreement provides them (${h.src('uspGeringfuegig', 'USP')}).</p>
<h2>Opt-in insurance for ${h.eur(SVM, 2)}</h2>
<p>Marginal employees living in Austria, the EU, the EEA or Switzerland can insure themselves for health and pension (${h.src('svSelbstversicherung', 'ÖGK, self-insurance under section 19a of the General Social Insurance Act')}). The key points for 2026:</p>
<ul>
<li>contribution ${h.eur(SVM, 2)} a month, ${h.eur(svmJahr, 2)} a year, not split for part-months, due at the start of the month and payable by the 15th;</li>
<li>apply to the ÖGK in the federal state where you work; a first application within six weeks of starting gives cover from day one, otherwise from the day after you apply;</li>
<li>benefits: doctors, hospital, medicines and, where applicable, sick pay and maternity pay; co-insured relatives get benefits in kind;</li>
<li>not available while you receive unemployment benefit, emergency assistance, childcare allowance or your own pension, or if another insurer covers you compulsorily.</li>
</ul>
<p>Cover ends if you fall two months behind with payments, and after cancelling or arrears a three-month waiting period applies. The contribution equals ${h.pct(SVM / GF, 1)} of pay at the limit, which is modest for health cover plus pension months.</p>
<!--mini:geringfuegig-->
<h2>One cent over the limit</h2>
<p>Once you cross the limit, health and pension insurance, the Chamber levy and the housing contribution are charged on your entire pay at once. Unemployment insurance stays at zero at these amounts thanks to the reduced scale, but net pay still drops sharply:</p>
${h.table(['Monthly gross', 'Social insurance', 'Net', 'Status'], tab.map((z) => [h.eur(z.b, 2), h.eur(z.k.svMonat, 2), h.eur(z.k.nettoMonat, 2), z.b <= GF ? 'marginal' : 'fully insured']), 'Regular month 2026, outside Vienna; figures from this site’s engine', ['l', 'r', 'r', 'l'])}
<p>Only at ${h.eur(gleich, 2)} gross is net back to the level at the limit. In between you work for less money, but you are fully insured without paying ${h.eur(SVM, 2)} yourself. If you would buy the opt-in cover anyway, crossing the limit costs you less than the table suggests.</p>
<h2>Several small jobs, or a small job next to a main job</h2>
<p>Marginal jobs are added together. If the total exceeds ${h.eur(GF, 2)}, health and pension insurance become compulsory on all of the pay (${h.src('uspGeringfuegig', 'USP')}). The employee share is ${h.pct(SV.dn_mehrfach_geringfuegig, 2)} according to the ${h.src('wkoBeitraege', 'Chamber of Commerce overview')}; with two jobs of ${h.eur(zweiJobs)} each, ${h.eur(dn2, 2)} a month.</p>
<p>Next to a fully insured main job, the small job carries health, accident and pension contributions. For tax, holding two jobs at the same time makes an annual assessment mandatory (${h.src('estg41', 'section 41(1)(2) of the Income Tax Act')}): the tax office adds the small job to your salary and taxes it at your marginal rate.</p>
<h2>Unemployment benefit and small jobs since 2026</h2>
<p>Since 1 January 2026, anyone in work, even a marginal job, no longer counts as unemployed (${h.src('akAlv', 'Chamber of Labour, unemployment insurance 2026')}). A small job is only allowed in exceptional cases, such as one you already held for at least 26 uninterrupted weeks before losing your main job. The other exceptions, and the rules for emergency assistance, are on the ${h.a('zuverdienst-arbeitslos', 'earning alongside unemployment benefit')} page.</p>
<h2>The employer side</h2>
<p>Employers must register marginal employees with the ÖGK and pay ${h.pct(SV.dg.uv, 2)} accident insurance for them. If an employer’s total marginal pay in a month exceeds ${h.eur(DGA, 2)}, the employer levy is added; the Chamber of Commerce overview then shows ${h.pct(SV.dg_ueber_dg_abgabe_grenze, 2)} in total. That threshold is one and a half times the marginal limit and was not raised for 2026 either (${h.src('oegkWerte', 'ÖGK')}). The full cost of a hire is in the ${h.a('dienstgeberkosten', 'employer cost calculator')}.</p>
`,
  },
});
