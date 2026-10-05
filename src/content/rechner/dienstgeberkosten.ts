import { defineGuide } from '../../lib/guide-types';
import { dienstgeberkosten } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const G = P.sv.dg, D = P.dienstgeber;
/** Sätze aus params, summiert: Dienstgeberanteil SV laufend (Wien mit höherem Wohnbauförderungsbeitrag) und von Sonderzahlungen. */
const svDg = G.kv + G.pv + G.av + G.uv + G.ie + G.wf;
const svDgWien = svDg - G.wf + G.wf_wien;
const svDgSz = svDg - G.wf;
const LAENDER = Object.keys(D.dz) as (keyof typeof D.dz)[];
const NAME_DE: Record<string, string> = { burgenland: 'Burgenland', kaernten: 'Kärnten', niederoesterreich: 'Niederösterreich', oberoesterreich: 'Oberösterreich', salzburg: 'Salzburg', steiermark: 'Steiermark', tirol: 'Tirol', vorarlberg: 'Vorarlberg', wien: 'Wien' };
const NAME_EN: Record<string, string> = { burgenland: 'Burgenland', kaernten: 'Carinthia', niederoesterreich: 'Lower Austria', oberoesterreich: 'Upper Austria', salzburg: 'Salzburg', steiermark: 'Styria', tirol: 'Tyrol', vorarlberg: 'Vorarlberg', wien: 'Vienna' };
/** Beispiele aus dem Motor: 3.000 € in Wien, dasselbe in jedem Land, ein Gehalt über der Höchstbeitragsgrundlage. */
const w3 = dienstgeberkosten(3000, 'wien');
const proLand = LAENDER.map((l) => ({ l, r: dienstgeberkosten(3000, l) }));
const billig = proLand.reduce((a, b) => (b.r.jahr < a.r.jahr ? b : a));
const teuer = proLand.reduce((a, b) => (b.r.jahr > a.r.jahr ? b : a));
const w8 = dienstgeberkosten(8000, 'wien');

export default defineGuide({
  id: 'dienstgeberkosten',
  group: 'rechner',
  order: 90,
  tool: 'dienstgeber',
  related: ['abfertigung-neu', 'hoechstbeitragsgrundlage', 'sozialversicherung', 'wien', 'geringfuegig', 'netto-3000'],
  sources: ['wkoBeitraege', 'wkoDb', 'wkoDz'],
  de: {
    slug: 'dienstgeberkosten-rechner',
    nav: 'Dienstgeberkosten-Rechner',
    card: 'Was ein Gehalt den Arbeitgeber 2026 kostet: SV-Anteil, Vorsorgekasse, DB, DZ und Kommunalsteuer.',
    title: 'Dienstgeberkosten 2026: Lohnnebenkosten je Bundesland',
    description: `Dienstgeberkosten-Rechner 2026: SV-Dienstgeberanteil ${DE.pct(svDg, 2)}, Vorsorgekasse ${DE.pct(G.mv, 2)}, DB ${DE.pct(D.db, 1)}, Zuschlag je Bundesland und Kommunalsteuer auf jedes Bruttogehalt.`,
    h1: 'Dienstgeberkosten 2026: was ein Gehalt wirklich kostet',
    intro: 'Alle Lohnnebenkosten, die ein Arbeitgeber in Österreich auf ein Bruttogehalt zahlt, mit den Sätzen 2026 und dem Unterschied zwischen den Bundesländern.',
    resume: `Ein Bruttogehalt von ${DE.eur(3000)} kostet einen Arbeitgeber in Wien 2026 rund ${DE.eur(3000 + w3.monat, 2)} im Monat und ${DE.eur(w3.jahr)} im Jahr mit 14 Bezügen, also ${DE.pct(w3.aufschlag, 1)} mehr als die ${DE.eur(w3.jahrBrutto)} brutto. Der größte Posten ist der Dienstgeberanteil zur Sozialversicherung von ${DE.pct(svDg, 2)}, in Wien wegen des höheren Wohnbauförderungsbeitrags ${DE.pct(svDgWien, 2)}; er endet bei der Höchstbeitragsgrundlage. Dazu kommen ohne Obergrenze ${DE.pct(G.mv, 2)} für die Betriebliche Vorsorgekasse, also die Abfertigung neu, ${DE.pct(D.db, 1)} Dienstgeberbeitrag zum Familienlastenausgleichsfonds, ein Zuschlag zum Dienstgeberbeitrag zwischen ${DE.pct(Math.min(...Object.values(D.dz)), 2)} und ${DE.pct(Math.max(...Object.values(D.dz)), 2)} je nach Bundesland und ${DE.pct(D.kommunalsteuer)} Kommunalsteuer an die Gemeinde. Auf Urlaubs- und Weihnachtsgeld fällt die Sozialversicherung um den Wohnbauförderungsbeitrag niedriger aus. Zwischen dem günstigsten und dem teuersten Bundesland liegen bei diesem Gehalt ${DE.eur(teuer.r.jahr - billig.r.jahr, 2)} im Jahr.`,
    faqs: [
      { q: 'Wie viel Prozent Lohnnebenkosten zahlt der Dienstgeber 2026 auf ein Gehalt?', a: `Bei einem mittleren Gehalt rund ${DE.pct(w3.aufschlag, 0)} des Bruttos, bei ${DE.eur(3000)} in Wien genau ${DE.pct(w3.aufschlag, 1)}. Darin stecken ${DE.pct(svDgWien, 2)} Sozialversicherung, ${DE.pct(G.mv, 2)} Vorsorgekasse, ${DE.pct(D.db, 1)} DB, ${DE.pct(D.dz.wien, 2)} DZ und ${DE.pct(D.kommunalsteuer)} Kommunalsteuer. Über der Höchstbeitragsgrundlage sinkt der Anteil, bei ${DE.eur(8000)} brutto auf ${DE.pct(w8.aufschlag, 1)}.` },
      { q: 'Was zählt zu den Dienstgeberkosten, aber nicht zum Rechner?', a: 'Die Wiener Dienstgeberabgabe, im Volksmund U-Bahn-Steuer, Betriebsratsumlagen, Zuschläge für Nachtschwerarbeit und Schlechtwetter bei Arbeitern, freiwillige Sozialleistungen und Sachbezüge. Auch Befreiungen bildet der Rechner nicht ab, etwa den Wegfall von Dienstgeberbeitrag und Unfallversicherung für Beschäftigte ab 60 Jahren. Das Ergebnis ist daher der Regelfall eines Angestellten.' },
      { q: 'Gibt es beim Dienstgeberbeitrag einen Freibetrag für kleine Arbeitgeber?', a: `Ja. Übersteigt die Summe aller Arbeitslöhne eines Monats ${DE.eur(D.db_freibetrag_grenze_monat)} nicht, verringert sich die Beitragsgrundlage für den Dienstgeberbeitrag um ${DE.eur(D.db_freibetrag_monat)}, so die WKO in ihrer Übersicht zum Beitragswesen 2026. Das betrifft praktisch nur Betriebe mit einer Teilzeitkraft oder einem geringfügig Beschäftigten. Unser Rechner wendet den Freibetrag nicht an, weil er die Lohnsumme des ganzen Betriebs voraussetzt.` },
    ],
    body: (h) => `
<h2>Was der Rechner ausgibt</h2>
<p>Sie geben das Bruttogehalt pro Monat und das Bundesland der Betriebsstätte ein. Der Rechner zeigt jeden Posten des Arbeitgebers für ein laufendes Monatsgehalt, die Kosten pro Monat und die Jahreskosten mit zwei Sonderzahlungen. Für Arbeitnehmerinnen und Arbeitnehmer ist das die Antwort auf die Frage, was die eigene Stelle das Unternehmen kostet; für Gründer die Grundlage jeder Personalplanung.</p>
<h2>Die Sätze 2026</h2>
${h.table(['Posten', 'laufend', 'Sonderzahlung', 'Obergrenze'], [
  ['Krankenversicherung', h.pct(h.P.sv.dg.kv, 2), h.pct(h.P.sv.dg.kv, 2), 'ja'],
  ['Pensionsversicherung', h.pct(h.P.sv.dg.pv, 2), h.pct(h.P.sv.dg.pv, 2), 'ja'],
  ['Arbeitslosenversicherung', h.pct(h.P.sv.dg.av, 2), h.pct(h.P.sv.dg.av, 2), 'ja'],
  ['Unfallversicherung', h.pct(h.P.sv.dg.uv, 2), h.pct(h.P.sv.dg.uv, 2), 'ja'],
  ['Insolvenz-Entgeltsicherung', h.pct(h.P.sv.dg.ie, 2), h.pct(h.P.sv.dg.ie, 2), 'ja'],
  ['Wohnbauförderung (Wien)', `${h.pct(h.P.sv.dg.wf, 2)} (${h.pct(h.P.sv.dg.wf_wien, 2)})`, h.pct(0, 2), 'ja'],
  ['Mitarbeitervorsorge (BV-Kasse)', h.pct(h.P.sv.dg.mv, 2), h.pct(h.P.sv.dg.mv, 2), 'nein'],
  ['Dienstgeberbeitrag (DB)', h.pct(h.P.dienstgeber.db, 2), h.pct(h.P.dienstgeber.db, 2), 'nein'],
  ['Kommunalsteuer', h.pct(h.P.dienstgeber.kommunalsteuer, 2), h.pct(h.P.dienstgeber.kommunalsteuer, 2), 'nein'],
], `Dienstgeberanteile 2026 für Angestellte; Sozialversicherung zusammen ${h.pct(svDg, 2)}, in Wien ${h.pct(svDgWien, 2)}, auf Sonderzahlungen ${h.pct(svDgSz, 2)}`, ['l', 'r', 'r', 'l'])}
<p>Die Sozialversicherungssätze stammen aus der ${h.src('wkoBeitraege', 'WKO-Übersicht Beitragswesen 2026')}. Sie gelten bis zur Höchstbeitragsgrundlage von ${h.eur(h.P.sv.hbg_monat)} im Monat und ${h.eur(h.P.sv.hbg_sz_jahr)} für die Sonderzahlungen im Jahr; mehr dazu auf der Seite zur ${h.a('hoechstbeitragsgrundlage', 'Höchstbeitragsgrundlage')}. Der ${h.src('wkoDb', 'Dienstgeberbeitrag')} beträgt seit 2025 ${h.pct(h.P.dienstgeber.db, 1)}. Die Mitarbeitervorsorge fließt in die Vorsorgekasse und wird später Ihre ${h.a('abfertigung-neu', 'Abfertigung neu')}.</p>
<h2>Zuschlag zum Dienstgeberbeitrag nach Bundesland</h2>
${h.table(['Bundesland', 'DZ', `Jahreskosten bei ${h.eur(3000)} brutto`], proLand.map(({ l, r }) => [NAME_DE[l], h.pct(h.P.dienstgeber.dz[l], 2), h.eur(r.jahr, 2)]), 'Zuschlag zum DB 2026 nach WKO, Jahreskosten mit 14 Bezügen aus unserem Motor', ['l', 'r', 'r'])}
<p>Der Zuschlag wird von denselben Löhnen berechnet wie der DB und fließt an die Wirtschaftskammer des Landes (${h.src('wkoDz', 'WKO, Zuschlag zum DB')}). In Wien kommt der höhere Wohnbauförderungsbeitrag dazu, deshalb ist ${NAME_DE[teuer.l]} bei ${h.eur(3000)} das teuerste Land und ${NAME_DE[billig.l]} das günstigste.</p>
<h2>Ein Beispiel Posten für Posten</h2>
<p>Bei ${h.eur(3000)} brutto in Wien zahlt der Arbeitgeber jeden Monat ${h.eur(w3.sv, 2)} Sozialversicherung, ${h.eur(w3.mv, 2)} Vorsorgekasse, ${h.eur(w3.db, 2)} DB, ${h.eur(w3.dz, 2)} DZ und ${h.eur(w3.kommst, 2)} Kommunalsteuer, zusammen ${h.eur(w3.monat, 2)}. Auf jede der beiden Sonderzahlungen fällt eine etwas niedrigere Sozialversicherung von ${h.eur(w3.svSz, 2)} an. Übers Jahr sind das ${h.eur(w3.jahr, 2)} für ${h.eur(w3.jahrBrutto)} brutto.</p>
<h2>Geringfügig Beschäftigte und hohe Gehälter</h2>
<p>Bis zur Geringfügigkeitsgrenze von ${h.eur(h.P.sv.geringfuegigkeit, 2)} zahlt der Arbeitgeber für die einzelne Person nur die Unfallversicherung, dazu Vorsorgekasse, DB, DZ und Kommunalsteuer. Übersteigen die geringfügigen Entgelte im Betrieb zusammen das Eineinhalbfache der Grenze, wird zusätzlich eine pauschale Dienstgeberabgabe fällig, die der Rechner nicht enthält; die Seite zur ${h.a('geringfuegig', 'geringfügigen Beschäftigung')} erklärt sie aus Sicht der Beschäftigten. Bei hohen Gehältern sinkt der prozentuale Aufschlag, weil die Sozialversicherung bei der Höchstbeitragsgrundlage endet: Bei ${h.eur(8000)} brutto beträgt er ${h.pct(w8.aufschlag, 1)}.</p>
<h2>Was nicht enthalten ist</h2>
<p>Nicht modelliert sind die Wiener Dienstgeberabgabe, Betriebsratsumlagen, Nachtschwerarbeits- und Schlechtwetterbeiträge bei Arbeitern, freiwillige Leistungen sowie die Befreiungen für Beschäftigte ab 60. Den Freibetrag beim DB für sehr kleine Lohnsummen (bis ${h.eur(h.P.dienstgeber.db_freibetrag_grenze_monat)} im Monat) wenden wir ebenfalls nicht an. Was vom Gehalt bei Ihnen ankommt, zeigt die Seite zur ${h.a('sozialversicherung', 'Sozialversicherung der Dienstnehmer')}.</p>
`,
  },
  en: {
    slug: 'employer-cost-calculator',
    nav: 'Employer cost calculator',
    card: 'What a salary costs an Austrian employer in 2026: social insurance, severance fund, DB, DZ and local tax.',
    title: 'Dienstgeberkosten 2026: Employer Payroll Costs by State',
    description: `Dienstgeberkosten calculator 2026: employer social insurance ${EN.pct(svDg, 2)}, severance fund ${EN.pct(G.mv, 2)}, DB ${EN.pct(D.db, 1)}, state surcharge and municipal tax on any salary.`,
    h1: 'Employer costs in Austria 2026: what a salary really costs',
    intro: 'Every payroll cost an Austrian employer pays on top of gross salary, with the 2026 rates and the differences between federal states.',
    resume: `A gross salary of ${EN.eur(3000)} costs an employer in Vienna about ${EN.eur(3000 + w3.monat, 2)} a month in 2026 and ${EN.eur(w3.jahr)} a year with the usual 14 payments, ${EN.pct(w3.aufschlag, 1)} on top of the ${EN.eur(w3.jahrBrutto)} gross. These employer costs (Dienstgeberkosten or Lohnnebenkosten) start with the employer share of social insurance, ${EN.pct(svDg, 2)}, or ${EN.pct(svDgWien, 2)} in Vienna because of its higher housing-subsidy contribution, charged up to the contribution ceiling. On top, with no ceiling, come ${EN.pct(G.mv, 2)} for the company severance fund (the new Abfertigung), ${EN.pct(D.db, 1)} employer contribution to the family burden equalisation fund (Dienstgeberbeitrag, DB), a surcharge on it (DZ) between ${EN.pct(Math.min(...Object.values(D.dz)), 2)} and ${EN.pct(Math.max(...Object.values(D.dz)), 2)} depending on the federal state, and ${EN.pct(D.kommunalsteuer)} municipal tax (Kommunalsteuer). Holiday and Christmas pay carry slightly lower social insurance. On this salary the gap between the cheapest and the dearest state is ${EN.eur(teuer.r.jahr - billig.r.jahr, 2)} a year.`,
    faqs: [
      { q: 'What percentage do Austrian employers pay on top of gross salary in 2026?', a: `About ${EN.pct(w3.aufschlag, 0)} on a mid-range salary; exactly ${EN.pct(w3.aufschlag, 1)} at ${EN.eur(3000)} in Vienna. That is ${EN.pct(svDgWien, 2)} social insurance, ${EN.pct(G.mv, 2)} severance fund, ${EN.pct(D.db, 1)} DB, ${EN.pct(D.dz.wien, 2)} DZ and ${EN.pct(D.kommunalsteuer)} municipal tax. Above the contribution ceiling the share falls: at ${EN.eur(8000)} gross it is ${EN.pct(w8.aufschlag, 1)}.` },
      { q: 'Which employer costs does this calculator leave out?', a: 'The Vienna employer levy (Dienstgeberabgabe, known locally as the underground tax), works council levies, night-shift and bad-weather contributions for blue-collar workers, voluntary benefits and benefits in kind. Exemptions are not modelled either, such as the employer family-fund contribution and accident insurance falling away for staff aged 60 and over. The result is the standard case of a salaried employee.' },
      { q: 'Is there an allowance on the employer family-fund contribution for very small payrolls?', a: `Yes. If an employer's total wages in a month do not exceed ${EN.eur(D.db_freibetrag_grenze_monat)}, the base for the Dienstgeberbeitrag is reduced by ${EN.eur(D.db_freibetrag_monat)}, according to the Chamber of Commerce (WKO) overview for 2026. In practice that only helps a business with one part-timer or one marginal employee. The calculator does not apply it because it depends on the whole firm's payroll.` },
    ],
    body: (h) => `
<h2>What the calculator gives you</h2>
<p>Enter the monthly gross salary and the federal state where the workplace is. The calculator lists each employer charge on one regular month, the cost per month and the annual cost with two special payments (the 13th and 14th salary that are standard in Austria). For employees it answers what their job costs the company; for founders hiring their first staff it is the basis of any budget.</p>
<h2>The 2026 rates</h2>
${h.table(['Charge', 'Regular pay', 'Special payment', 'Capped'], [
  ['Health insurance', h.pct(h.P.sv.dg.kv, 2), h.pct(h.P.sv.dg.kv, 2), 'yes'],
  ['Pension insurance', h.pct(h.P.sv.dg.pv, 2), h.pct(h.P.sv.dg.pv, 2), 'yes'],
  ['Unemployment insurance', h.pct(h.P.sv.dg.av, 2), h.pct(h.P.sv.dg.av, 2), 'yes'],
  ['Accident insurance', h.pct(h.P.sv.dg.uv, 2), h.pct(h.P.sv.dg.uv, 2), 'yes'],
  ['Insolvency pay fund', h.pct(h.P.sv.dg.ie, 2), h.pct(h.P.sv.dg.ie, 2), 'yes'],
  ['Housing subsidy (Vienna)', `${h.pct(h.P.sv.dg.wf, 2)} (${h.pct(h.P.sv.dg.wf_wien, 2)})`, h.pct(0, 2), 'yes'],
  ['Severance fund (BV-Kasse)', h.pct(h.P.sv.dg.mv, 2), h.pct(h.P.sv.dg.mv, 2), 'no'],
  ['Family fund contribution (DB)', h.pct(h.P.dienstgeber.db, 2), h.pct(h.P.dienstgeber.db, 2), 'no'],
  ['Municipal tax', h.pct(h.P.dienstgeber.kommunalsteuer, 2), h.pct(h.P.dienstgeber.kommunalsteuer, 2), 'no'],
], `Employer shares 2026 for salaried staff; social insurance ${h.pct(svDg, 2)} in total, ${h.pct(svDgWien, 2)} in Vienna, ${h.pct(svDgSz, 2)} on special payments`, ['l', 'r', 'r', 'l'])}
<p>The social insurance rates come from the ${h.src('wkoBeitraege', 'Chamber of Commerce overview of 2026 contributions')}. They apply up to the contribution ceiling of ${h.eur(h.P.sv.hbg_monat)} a month and ${h.eur(h.P.sv.hbg_sz_jahr)} a year on special payments; see the page on the ${h.a('hoechstbeitragsgrundlage', 'contribution ceiling')}. The ${h.src('wkoDb', 'employer family-fund contribution')} has been ${h.pct(h.P.dienstgeber.db, 1)} since 2025. The severance fund contribution builds up your ${h.a('abfertigung-neu', 'new-scheme severance')}.</p>
<h2>The DB surcharge by federal state</h2>
${h.table(['Federal state', 'DZ', `Annual cost on ${h.eur(3000)} gross`], proLand.map(({ l, r }) => [NAME_EN[l], h.pct(h.P.dienstgeber.dz[l], 2), h.eur(r.jahr, 2)]), 'DB surcharge 2026 per WKO, annual cost with 14 payments from our engine', ['l', 'r', 'r'])}
<p>The surcharge uses the same wage base as the DB and goes to the regional Chamber of Commerce (${h.src('wkoDz', 'WKO, DB surcharge')}). Vienna adds its higher housing-subsidy rate, which is why ${NAME_EN[teuer.l]} is the most expensive state at ${h.eur(3000)} and ${NAME_EN[billig.l]} the cheapest.</p>
<h2>One salary, charge by charge</h2>
<p>On ${h.eur(3000)} gross in Vienna the employer pays every month ${h.eur(w3.sv, 2)} social insurance, ${h.eur(w3.mv, 2)} severance fund, ${h.eur(w3.db, 2)} DB, ${h.eur(w3.dz, 2)} DZ and ${h.eur(w3.kommst, 2)} municipal tax, ${h.eur(w3.monat, 2)} in all. Each of the two special payments carries slightly lower social insurance of ${h.eur(w3.svSz, 2)}. Over the year that makes ${h.eur(w3.jahr, 2)} for ${h.eur(w3.jahrBrutto)} gross.</p>
<h2>Marginal jobs and high salaries</h2>
<p>Up to the marginal earnings limit of ${h.eur(h.P.sv.geringfuegigkeit, 2)} a month the employer pays only accident insurance for that person, plus severance fund, DB, DZ and municipal tax. If a firm's marginal wages together exceed one and a half times that limit, a flat employer levy becomes due, which the calculator does not include; the page on ${h.a('geringfuegig', 'marginal employment')} explains it from the worker's side. On high salaries the percentage falls because social insurance stops at the ceiling: at ${h.eur(8000)} gross the mark-up is ${h.pct(w8.aufschlag, 1)}.</p>
<h2>What is not included</h2>
<p>Not modelled: the Vienna employer levy, works council levies, night-shift and bad-weather contributions for blue-collar workers, voluntary benefits and the exemptions for staff aged 60 and over. Nor do we apply the DB allowance for very small payrolls (up to ${h.eur(h.P.dienstgeber.db_freibetrag_grenze_monat)} a month). For what reaches the employee, see the page on ${h.a('sozialversicherung', 'employee social insurance')}.</p>
`,
  },
});
