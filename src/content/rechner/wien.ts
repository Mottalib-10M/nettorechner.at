import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const dn = P.sv.dn, dg = P.sv.dg, dz = P.dienstgeber.dz;

/** Wien gegen die übrigen Bundesländer, aus dem Motor: kurz(b, { wien: true }) gegen kurz(b). */
const STUFEN = [2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000];
const tab = STUFEN.map((b) => { const w = kurz(b, { wien: true }), a = kurz(b); return { b, w: w.nettoMonat, a: a.nettoMonat, m: a.nettoMonat - w.nettoMonat, j: a.nettoJahr - w.nettoJahr }; });
const B = 3000;
const bsp = tab.find((z) => z.b === B)!;
const top = tab[tab.length - 1];
/** Mehrbeitrag brutto vor Steuerwirkung (Dienstnehmer) und Mehrkosten des Dienstgebers, je Monat. */
const wfMehrDn = B * (dn.wf_wien - dn.wf);
const wfMehrDg = B * (dg.wf_wien - dg.wf);
/** DZ-Spanne der Bundesländer. */
const dzWerte = Object.values(dz);
const dzMin = Math.min(...dzWerte), dzMax = Math.max(...dzWerte);

export default defineGuide({
  id: 'wien',
  group: 'rechner',
  order: 100,
  tool: 'brutto',
  toolPreset: { land: 'wien' },
  related: ['sozialversicherung', 'dienstgeberkosten', 'netto-3000', 'pendlerpauschale', 'lohnzettel'],
  sources: ['wienWbf', 'oegkWfWien', 'wkoDz', 'oegkWerte'],
  de: {
    slug: 'brutto-netto-rechner-wien',
    nav: 'Brutto-Netto-Rechner Wien',
    card: 'Netto in Wien 2026 mit dem höheren Wohnbauförderungsbeitrag, Gehaltsstufe für Gehaltsstufe.',
    title: `Brutto-Netto Wien 2026: Rechner mit Wohnbauförderung ${DE.pct(dn.wf_wien, 2)}`,
    description: `Brutto-Netto Wien 2026: seit Jänner ${DE.pct(dn.wf_wien, 2)} Wohnbauförderungsbeitrag statt ${DE.pct(dn.wf, 1)}. Bei ${DE.eur(B)} Monatsbrutto sind das ${DE.eur(bsp.j)} weniger netto im Jahr als anderswo.`,
    h1: 'Brutto-Netto-Rechner für Wien',
    intro: 'Seit 2026 zieht Wien bei jedem Gehalt etwas mehr ab als die anderen Bundesländer. Der Rechner ist auf Wien eingestellt und zeigt den Unterschied in Euro.',
    resume: `Wer in Wien arbeitet, bekommt 2026 bei gleichem Brutto etwas weniger Netto als in den anderen acht Bundesländern: Bei ${DE.eur(B)} brutto sind es ${DE.eur(bsp.w, 2)} statt ${DE.eur(bsp.a, 2)} im Monat, ${DE.eur(bsp.m, 2)} weniger, ${DE.eur(bsp.j)} im Jahr. Der Grund ist der Wohnbauförderungsbeitrag. Er wurde in Wien mit 1. Jänner 2026 von ${DE.pct(dn.wf, 1)} auf ${DE.pct(dn.wf_wien, 2)} angehoben, für Dienstnehmer und Dienstgeber gleichermaßen; überall sonst bleibt er bei ${DE.pct(dn.wf, 1)}. Bei vollem Arbeitslosenversicherungsbeitrag steigt der Abzug der Sozialversicherung damit in Wien von ${DE.pct(dn.kv + dn.pv + dn.av + dn.ak + dn.wf, 2)} auf ${DE.pct(dn.kv + dn.pv + dn.av + dn.ak + dn.wf_wien, 2)} des Bruttos. Netto wirkt nicht der volle Mehrbeitrag, weil er die Lohnsteuer-Bemessungsgrundlage senkt. Maßgeblich ist der Ort der Beschäftigung, nicht der Wohnsitz: Wer in Niederösterreich wohnt und in Wien arbeitet, zahlt den Wiener Satz. Auf Urlaubszuschuss und Weihnachtsremuneration fällt kein Wohnbauförderungsbeitrag an, der Unterschied betrifft also nur die zwölf laufenden Gehälter.`,
    faqs: [
      { q: 'Warum ist das Netto in Wien 2026 niedriger als in den anderen Bundesländern?', a: `Weil Wien den Wohnbauförderungsbeitrag mit 1. Jänner 2026 auf ${DE.pct(dn.wf_wien, 2)} für Dienstnehmer erhöht hat, statt ${DE.pct(dn.wf, 1)} wie im übrigen Österreich. Bei ${DE.eur(B)} brutto sind das ${DE.eur(wfMehrDn, 2)} mehr Abzug; weil der Beitrag die Lohnsteuer senkt, fehlen netto ${DE.eur(bsp.m, 2)} im Monat. Lohnsteuer und Absetzbeträge sind bundesweit gleich; unser Rechner unterscheidet die Bundesländer beim Arbeitnehmer nur an dieser Stelle.` },
      { q: 'Zählt für den Wiener Wohnbauförderungsbeitrag der Wohnort oder der Arbeitsort?', a: `Der Arbeitsort. Die ÖGK verrechnet den erhöhten Beitrag für Beschäftigungen im Bundesland Wien, und die Stadt Wien knüpft an den Ort der Beschäftigung an. Pendler aus Niederösterreich oder dem Burgenland zahlen also ${DE.pct(dn.wf_wien, 2)}, Wiener mit Arbeitsplatz in Niederösterreich ${DE.pct(dn.wf, 1)}. Im Rechner wählen Sie deshalb das Bundesland des Arbeitsorts.` },
      { q: 'Zahlen Lehrlinge in Wien den höheren Wohnbauförderungsbeitrag?', a: `Nein. Lehrlinge, geringfügig Beschäftigte, freie Dienstnehmer, Hausbesorger und einige Beschäftigte in Land- und Forstwirtschaft sowie bei ausländischen Vertretungsbehörden zahlen laut Stadt Wien überhaupt keinen Wohnbauförderungsbeitrag, weder ${DE.pct(dn.wf, 1)} noch ${DE.pct(dn.wf_wien, 2)}. Für sie ändert die Wiener Erhöhung 2026 am Netto nichts. Wer nur bis zur Geringfügigkeitsgrenze von ${DE.eur(P.sv.geringfuegigkeit, 2)} verdient, zahlt als Dienstnehmer ohnehin keine Sozialversicherung.` },
      { q: 'Was kostet ein Arbeitsplatz in Wien den Arbeitgeber 2026 mehr?', a: `Der Dienstgeber zahlt ebenfalls ${DE.pct(dg.wf_wien, 2)} statt ${DE.pct(dg.wf, 1)} Wohnbauförderungsbeitrag, bei ${DE.eur(B)} brutto ${DE.eur(wfMehrDg, 2)} mehr im Monat. Dazu kommt der Zuschlag zum Dienstgeberbeitrag, der in Wien ${DE.pct(dz.wien, 2)} beträgt; je nach Bundesland liegt er zwischen ${DE.pct(dzMin, 2)} und ${DE.pct(dzMax, 2)}. Die vollständige Rechnung zeigt der Dienstgeberkosten-Rechner.` },
    ],
    body: (h) => `
<h2>Der Rechner für Wien</h2>
<p>Oben ist das Bundesland bereits auf Wien gesetzt. Sie geben Ihr Monatsbrutto ein, wählen bei Bedarf Kinder, Familienbonus, Alleinverdiener und Pendlerpauschale und lesen das Netto ab, mit Urlaubszuschuss und Weihnachtsremuneration. Arbeiten Sie nicht in Wien, stellen Sie das Bundesland um: Der Unterschied ist der Wohnbauförderungsbeitrag, sonst nichts.</p>
<h2>Was der höhere Beitrag in Euro ausmacht</h2>
${h.table(['Brutto pro Monat', 'Netto Wien', 'Netto übrige Länder', 'Unterschied pro Monat', 'Unterschied pro Jahr'], tab.map((z) => [h.eur(z.b), h.eur(z.w, 2), h.eur(z.a, 2), h.eur(z.m, 2), h.eur(z.j, 2)]), 'Ohne Kinder und Pendlerpauschale, 14 Bezüge, Werte 2026 aus unserem Rechenmotor', ['r', 'r', 'r', 'r', 'r'])}
<p>Der Mehrbeitrag beträgt ${h.pct(dn.wf_wien - dn.wf, 2)} des Bruttos, bei ${h.eur(B)} also ${h.eur(wfMehrDn, 2)}. Netto fehlen davon nur ${h.eur(bsp.m, 2)}, weil Sozialversicherungsbeiträge die Lohnsteuer-Bemessungsgrundlage senken: Ein Teil des Mehrbeitrags kommt über weniger Lohnsteuer zurück, umso mehr, je höher der Grenzsteuersatz. Über der Höchstbeitragsgrundlage von ${h.eur(h.P.sv.hbg_monat)} wächst der Unterschied nicht mehr, weil der Beitrag dort gedeckelt ist; bei ${h.eur(top.b)} sind es ${h.eur(top.m, 2)} im Monat. Die Jahresspalte ist genau das Zwölffache der Monatsspalte, weil Sonderzahlungen keinen Wohnbauförderungsbeitrag tragen.</p>
<!--mini:wienVergleich-->
<h2>Rechtsgrundlage und Ort der Beschäftigung</h2>
<p>Der Wohnbauförderungsbeitrag ist eine lohnabhängige Abgabe, die gemeinsam mit der Sozialversicherung eingehoben und an das Bundesland überwiesen wird. Für Wien legt der Wiener Wohnbauförderungsbeitragstarif 2018 die Höhe fest. Laut ${h.src('wienWbf', 'Stadt Wien')} betrug er von 2018 bis 2025 je ${h.pct(dn.wf, 1)} für Dienstgeber und Beschäftigte, seit 1. Jänner 2026 je ${h.pct(dn.wf_wien, 2)}. Die ${h.src('oegkWfWien', 'ÖGK')} rechnet den Unterschied als eigenen Zuschlag ab, der nur für Beschäftigungen in Wien gilt. Maßgeblich ist damit der Ort der Beschäftigung. Wer zwischen Wien und einem anderen Bundesland pendelt, sollte im Rechner das Bundesland des Arbeitsorts wählen; für den Weg selbst gibt es die ${h.a('pendlerpauschale', 'Pendlerpauschale')}.</p>
<h2>Wer in Wien keinen Wohnbauförderungsbeitrag zahlt</h2>
<ul>
<li>Lehrlinge</li>
<li>geringfügig Beschäftigte (bis ${h.eur(h.P.sv.geringfuegigkeit, 2)} im Monat)</li>
<li>freie Dienstnehmerinnen und Dienstnehmer</li>
<li>Hausbesorgerinnen und Hausbesorger</li>
<li>bestimmte Beschäftigte in Land- und Forstwirtschaft und bei ausländischen Vertretungsbehörden</li>
</ul>
<h2>Die Seite des Arbeitgebers</h2>
<p>Für den Dienstgeber steigt der Beitrag ebenso auf ${h.pct(dg.wf_wien, 2)}, bei ${h.eur(B)} brutto ${h.eur(wfMehrDg, 2)} mehr im Monat. Der ${h.src('wkoDz', 'Zuschlag zum Dienstgeberbeitrag')} beträgt in Wien ${h.pct(dz.wien, 2)} der Lohnsumme, in den anderen Ländern zwischen ${h.pct(dzMin, 2)} und ${h.pct(dzMax, 2)}. Was ein Gehalt den Arbeitgeber insgesamt kostet, rechnet der ${h.a('dienstgeberkosten', 'Dienstgeberkosten-Rechner')}; die einzelnen Beiträge auf Ihrem ${h.a('lohnzettel', 'Lohnzettel')} erklärt die Seite zur ${h.a('sozialversicherung', 'Sozialversicherung')}.</p>
`,
  },
  en: {
    slug: 'gross-net-calculator-vienna',
    nav: 'Gross-to-net calculator Vienna',
    card: 'Net pay in Vienna 2026 with the higher housing levy, salary band by salary band.',
    title: 'Gross to Net Vienna 2026: Calculator With Housing Levy',
    description: `Gross to net in Vienna 2026: the housing levy rose to ${EN.pct(dn.wf_wien, 2)} from ${EN.pct(dn.wf, 1)} in January. On ${EN.eur(B)} gross that costs ${EN.eur(bsp.j)} net a year compared with other states.`,
    h1: 'Gross-to-net calculator for Vienna',
    intro: 'Since 2026 Vienna deducts slightly more from every salary than the other federal states. The calculator is set to Vienna and shows the gap in euros.',
    resume: `If you work in Vienna, the same gross salary leaves you slightly less net pay in 2026 than in Austria's eight other federal states: on ${EN.eur(B)} gross you take home ${EN.eur(bsp.w, 2)} a month instead of ${EN.eur(bsp.a, 2)}, ${EN.eur(bsp.m, 2)} less, or ${EN.eur(bsp.j)} a year. The reason is the housing subsidy contribution (Wohnbauförderungsbeitrag), a small state levy collected with social insurance. Vienna raised it on 1 January 2026 from ${EN.pct(dn.wf, 1)} to ${EN.pct(dn.wf_wien, 2)} for both employees and employers; everywhere else it stays at ${EN.pct(dn.wf, 1)}. With the full unemployment insurance rate, total employee social insurance deductions therefore rise in Vienna from ${EN.pct(dn.kv + dn.pv + dn.av + dn.ak + dn.wf, 2)} to ${EN.pct(dn.kv + dn.pv + dn.av + dn.ak + dn.wf_wien, 2)} of gross pay. You do not lose the full extra contribution, because it also lowers the base for wage tax. What counts is where you work, not where you live: commuting into Vienna from Lower Austria means paying the Vienna rate. Holiday and Christmas pay carry no housing levy, so only the twelve regular salaries are affected.`,
    faqs: [
      { q: 'Why is net pay lower in Vienna than in the rest of Austria in 2026?', a: `Vienna raised the employee housing levy to ${EN.pct(dn.wf_wien, 2)} on 1 January 2026, against ${EN.pct(dn.wf, 1)} elsewhere. On ${EN.eur(B)} gross that is ${EN.eur(wfMehrDn, 2)} more deducted; since the levy reduces wage tax, you lose ${EN.eur(bsp.m, 2)} net a month. Wage tax and tax credits are federal and identical everywhere, so this is the only regional difference our calculator applies to employees.` },
      { q: 'Does the Vienna housing levy depend on where I live or where I work?', a: `Where you work. The ÖGK, Austria's health insurer, charges the higher rate for employment in the state of Vienna, and the City of Vienna ties the levy to the place of employment. Commuters from Lower Austria or Burgenland therefore pay ${EN.pct(dn.wf_wien, 2)}, while Vienna residents working in Lower Austria pay ${EN.pct(dn.wf, 1)}. Choose the state of your workplace in the calculator.` },
      { q: 'Do apprentices in Vienna pay the higher housing levy?', a: `No. According to the City of Vienna, apprentices, marginal employees, freelance employees (freie Dienstnehmer), caretakers and some workers in agriculture, forestry and foreign diplomatic missions pay no housing levy at all, neither ${EN.pct(dn.wf, 1)} nor ${EN.pct(dn.wf_wien, 2)}. The 2026 increase does not change their net pay. Anyone earning no more than ${EN.eur(P.sv.geringfuegigkeit, 2)} a month pays no employee social insurance anyway.` },
      { q: 'How much more does a job in Vienna cost the employer in 2026?', a: `The employer's housing levy also rises to ${EN.pct(dg.wf_wien, 2)} from ${EN.pct(dg.wf, 1)}, which is ${EN.eur(wfMehrDg, 2)} more a month on ${EN.eur(B)} gross. On top comes the surcharge on the employer contribution (Zuschlag zum Dienstgeberbeitrag), ${EN.pct(dz.wien, 2)} in Vienna and between ${EN.pct(dzMin, 2)} and ${EN.pct(dzMax, 2)} across the states. The employer cost calculator shows the full picture.` },
    ],
    body: (h) => `
<h2>The calculator, set to Vienna</h2>
<p>The federal state above is already set to Vienna. Enter your monthly gross, add children, the Familienbonus Plus child tax credit, the sole earner credit or the commuter allowance if relevant, and read off your net pay including holiday and Christmas pay. If you do not work in Vienna, switch the state: the only difference is the housing levy.</p>
<h2>What the higher levy costs in euros</h2>
${h.table(['Gross per month', 'Net Vienna', 'Net other states', 'Gap per month', 'Gap per year'], tab.map((z) => [h.eur(z.b), h.eur(z.w, 2), h.eur(z.a, 2), h.eur(z.m, 2), h.eur(z.j, 2)]), 'No children or commuter allowance, 14 payments, 2026 values from our calculation engine', ['r', 'r', 'r', 'r', 'r'])}
<p>The extra contribution is ${h.pct(dn.wf_wien - dn.wf, 2)} of gross pay, ${h.eur(wfMehrDn, 2)} on ${h.eur(B)}. Only ${h.eur(bsp.m, 2)} of it disappears from your net pay, because social insurance contributions reduce the base for wage tax: part of the levy comes back as lower tax, more so at higher marginal rates. Above the contribution ceiling of ${h.eur(h.P.sv.hbg_monat)} the gap stops growing; at ${h.eur(top.b)} it is ${h.eur(top.m, 2)} a month. The yearly column is exactly twelve times the monthly one, because special payments carry no housing levy.</p>
<!--mini:wienVergleich-->
<h2>Legal basis and place of employment</h2>
<p>The housing levy is a payroll charge collected together with social insurance and passed on to the federal state; for Vienna the rate is set by the Vienna housing levy tariff of 2018. According to the ${h.src('wienWbf', 'City of Vienna')}, it was ${h.pct(dn.wf, 1)} each for employers and employees from 2018 to 2025 and has been ${h.pct(dn.wf_wien, 2)} each since 1 January 2026. The ${h.src('oegkWfWien', 'ÖGK')} bills the difference as a separate surcharge that applies only to employment in Vienna, so the place of employment decides. If you commute between Vienna and another state, pick the state of your workplace in the calculator; the trip itself may qualify for the ${h.a('pendlerpauschale', 'commuter allowance')}.</p>
<h2>Who pays no housing levy in Vienna</h2>
<ul>
<li>apprentices (Lehrlinge)</li>
<li>marginal employees earning up to ${h.eur(h.P.sv.geringfuegigkeit, 2)} a month</li>
<li>freelance employees (freie Dienstnehmer)</li>
<li>building caretakers (Hausbesorger)</li>
<li>certain workers in agriculture and forestry and at foreign diplomatic missions</li>
</ul>
<h2>The employer's side</h2>
<p>Employers also pay ${h.pct(dg.wf_wien, 2)}, ${h.eur(wfMehrDg, 2)} more a month on ${h.eur(B)} gross. The ${h.src('wkoDz', 'surcharge on the employer contribution')} is ${h.pct(dz.wien, 2)} of payroll in Vienna and between ${h.pct(dzMin, 2)} and ${h.pct(dzMax, 2)} in the other states. The ${h.a('dienstgeberkosten', 'employer cost calculator')} adds everything up, and the ${h.a('sozialversicherung', 'social insurance page')} explains each line on your ${h.a('lohnzettel', 'payslip')}.</p>
`,
  },
});
