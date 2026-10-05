import { defineGuide } from '../../lib/guide-types';
import { svLaufend, svSonderzahlung, lohnsteuerLaufend, avSatz } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const D = P.sv.dn, ST = P.sv.av_staffel;
/** Gesamtsatz Dienstnehmer laufend und auf Sonderzahlungen (ohne AK-Umlage und Wohnbauförderung). */
const satzVoll = D.kv + D.pv + D.av + D.ak + D.wf, satzWien = satzVoll - D.wf + D.wf_wien;
const satzSz = D.kv + D.pv + D.av;
/** Netto laufend aus dem Motor. */
const netto = (b: number) => { const sv = svLaufend(b).summe; return b - sv - lohnsteuerLaufend(b - sv).lst; };
/** Die drei Kanten der AV-Staffel: Netto genau an der Grenze und einen Euro darüber. */
const kanten = ST.map(([g]) => ({ g, an: netto(g), drueber: netto(g + 1) }));
/** Tabelle Sozialversicherung nach Monatsbrutto. */
const BRUTTOS = [1200, 2000, 2300, 2500, 2800, 3500, 5000, P.sv.hbg_monat, 9000];
const tab = BRUTTOS.map((b) => ({ b, s: svLaufend(b), w: svLaufend(b, true) }));
/** Beispiel 3.200 €: Posten für Posten, Sonderzahlung gleich hoch. */
const B = 3200, sB = svLaufend(B), szB = svSonderzahlung(B);
/** ÖGK-Beispiel: 2.500 € laufend, 2.300 € Sonderzahlung. */
const oL = 2500, oS = 2300;
/** Höchstbeitragsgrundlage: Beitrag bei 6.930 € und darüber. */
const hbgSv = svLaufend(P.sv.hbg_monat).summe;
const R = P.absetzbetraege;

export default defineGuide({
  id: 'sozialversicherung',
  group: 'lohn',
  order: 20,
  mini: 'svBeitrag',
  related: ['lohnsteuer', 'hoechstbeitragsgrundlage', 'geringfuegig', 'wien', 'dienstgeberkosten', 'sonderzahlungen'],
  sources: ['oegkWerte', 'oegkAv', 'wkoBeitraege', 'oegkWfWien'],
  de: {
    slug: 'sozialversicherung-beitraege',
    nav: 'Sozialversicherung 2026',
    card: 'Kranken-, Pensions- und Arbeitslosenversicherung Posten für Posten, mit der neuen Staffel für kleine Einkommen.',
    title: 'Sozialversicherung 2026: Beiträge der Dienstnehmer im Detail',
    description: `Sozialversicherung 2026: ${DE.pct(satzVoll, 2)} vom Bruttolohn, in Wien ${DE.pct(satzWien, 2)}, Staffel der Arbeitslosenversicherung bis ${DE.eur(ST[2][0])} und weniger Abzug auf Sonderzahlungen.`,
    h1: 'Sozialversicherungsbeiträge der Dienstnehmer 2026',
    intro: 'Was von Ihrem Bruttolohn an Kranken-, Pensions- und Arbeitslosenversicherung abgeht, wo die Staffel für kleine Einkommen Sprünge macht und was bei Sonderzahlungen anders ist.',
    resume: `Angestellte und Arbeiter zahlen 2026 in Österreich ${DE.pct(satzVoll, 2)} ihres Bruttolohns an Sozialversicherung, wenn sie mehr als ${DE.eur(ST[2][0])} im Monat verdienen: ${DE.pct(D.kv, 2)} Krankenversicherung, ${DE.pct(D.pv, 2)} Pensionsversicherung, ${DE.pct(D.av, 2)} Arbeitslosenversicherung, je ${DE.pct(D.ak, 1)} Arbeiterkammerumlage und Wohnbauförderungsbeitrag. In Wien ist der Wohnbauförderungsbeitrag seit Jänner 2026 auf ${DE.pct(D.wf_wien, 2)} gestiegen, der Gesamtsatz liegt dort bei ${DE.pct(satzWien, 2)}. Bei kleinen Einkommen sinkt der Anteil zur Arbeitslosenversicherung: bis ${DE.eur(ST[0][0])} null, bis ${DE.eur(ST[1][0])} ${DE.pct(ST[1][1])}, bis ${DE.eur(ST[2][0])} ${DE.pct(ST[2][1])}. Urlaubs- und Weihnachtsgeld tragen keine Arbeiterkammerumlage und keinen Wohnbauförderungsbeitrag, dort sind es höchstens ${DE.pct(satzSz, 2)}. Beiträge werden nur bis zur Höchstbeitragsgrundlage von ${DE.eur(P.sv.hbg_monat)} im Monat berechnet; der Beitrag erreicht dort ${DE.eur(hbgSv, 2)} und steigt nicht weiter. Wer nicht mehr als ${DE.eur(P.sv.geringfuegigkeit, 2)} verdient, ist geringfügig beschäftigt und zahlt gar nichts.`,
    faqs: [
      { q: 'Wie viel Sozialversicherung wird 2026 vom Bruttolohn abgezogen?', a: `Über ${DE.eur(ST[2][0])} brutto im Monat sind es ${DE.pct(satzVoll, 2)}, in Wien ${DE.pct(satzWien, 2)}. Bei ${DE.eur(B)} brutto außerhalb Wiens ergibt das ${DE.eur(sB.summe, 2)}, davon ${DE.eur(sB.pv, 2)} für die Pension. Der Arbeitgeber zieht den Betrag vom Lohn ab und überweist ihn an die ÖGK, die Lohnsteuer dagegen ans Finanzamt. Unter ${DE.eur(ST[2][0])} wird der Satz durch die Staffel der Arbeitslosenversicherung kleiner.` },
      { q: 'Warum zahlt man bei kleinem Gehalt weniger Arbeitslosenversicherung?', a: `Seit 2026 gilt für den Dienstnehmeranteil eine Staffel: bis ${DE.eur(ST[0][0])} brutto im Monat ${DE.pct(ST[0][1])}, bis ${DE.eur(ST[1][0])} ${DE.pct(ST[1][1])}, bis ${DE.eur(ST[2][0])} ${DE.pct(ST[2][1])}, darüber ${DE.pct(D.av, 2)}. Der Arbeitgeber zahlt seinen Anteil von ${DE.pct(P.sv.dg.av, 2)} trotzdem voll. Jeder Monat wird für sich betrachtet, ohne Durchschnitt; ein Monat mit Überstunden kann also einen höheren Satz auslösen als die übrigen.` },
      { q: 'Wie viel Sozialversicherung kostet das Urlaubs- und Weihnachtsgeld?', a: `Auf Sonderzahlungen fallen Kranken-, Pensions- und Arbeitslosenversicherung an, aber weder Arbeiterkammerumlage noch Wohnbauförderung. Bei ${DE.eur(B)} Urlaubszuschuss sind das ${DE.eur(szB.summe, 2)}, also ${DE.pct(szB.satz, 2)}. Die Staffel der Arbeitslosenversicherung richtet sich nach der Höhe der Sonderzahlung selbst, nicht nach dem Monatsgehalt. Für beide Sonderzahlungen zusammen gilt eine Höchstbeitragsgrundlage von ${DE.eur(P.sv.hbg_sz_jahr)} im Jahr.` },
      { q: 'Ab welchem Gehalt steigt die Sozialversicherung nicht mehr?', a: `Ab der Höchstbeitragsgrundlage von ${DE.eur(P.sv.hbg_monat)} brutto im Monat, das sind ${DE.eur(P.sv.hbg_monat / 30)} je Kalendertag. Der Dienstnehmeranteil bleibt dort bei ${DE.eur(hbgSv, 2)}, auch wenn das Gehalt höher ist. Jeder Euro darüber wird nur noch mit Lohnsteuer belastet, die Sozialversicherung ist ausgeschöpft. Die Grenze wird jedes Jahr mit der Aufwertungszahl angepasst; für 2026 stammt sie aus den veränderlichen Werten der ÖGK.` },
      { q: 'Bekommt man Sozialversicherungsbeiträge vom Finanzamt zurück?', a: `Ja, bei kleinem Einkommen. Wer so wenig verdient, dass keine Einkommensteuer anfällt, bekommt in der Arbeitnehmerveranlagung ${DE.pct(R.sv_rueckerstattung_quote)} der Sozialversicherungsbeiträge erstattet, höchstens ${DE.eur(R.sv_rueckerstattung_max)} im Jahr, mit Pendlerpauschale bis ${DE.eur(R.sv_rueckerstattung_pendler_max)}. Das betrifft vor allem Teilzeit und Ferialjobs. Die Erstattung kommt automatisch, wenn das Finanzamt antragslos veranlagt, sonst mit der eigenen Erklärung.` },
      { q: 'Wie viel Sozialversicherung zahlt der Arbeitgeber zusätzlich?', a: `Der Dienstgeberanteil beträgt ${DE.pct(P.sv.dg.kv + P.sv.dg.pv + P.sv.dg.av + P.sv.dg.uv + P.sv.dg.ie + P.sv.dg.wf, 2)} des Bruttolohns, mehr als der Dienstnehmeranteil, weil der Arbeitgeber auch die Unfallversicherung allein trägt. Dazu kommen ${DE.pct(P.sv.dg.mv, 2)} für die Abfertigung neu sowie Dienstgeberbeitrag, Zuschlag und Kommunalsteuer. Diese Kosten sehen Sie nicht auf Ihrem Lohnzettel; was ein Gehalt den Betrieb insgesamt kostet, zeigt der Dienstgeberkosten-Rechner.` },
    ],
    body: (h) => `
<h2>Die Beitragssätze 2026 Posten für Posten</h2>
<p>Die Sozialversicherung in Österreich ist eine Pflichtversicherung: Wer mehr als geringfügig verdient, ist automatisch kranken-, pensions-, unfall- und arbeitslosenversichert. Der Arbeitgeber zieht Ihren Anteil vom Bruttolohn ab und meldet ihn monatlich an die Österreichische Gesundheitskasse. Die Sätze stehen in der Übersicht der ${h.src('wkoBeitraege', 'Wirtschaftskammer zum Beitragswesen 2026')}.</p>
${h.table(['Beitrag', 'Dienstnehmer', 'Dienstgeber', `Ihr Anteil bei ${h.eur(B)}`], [
  ['Krankenversicherung', h.pct(D.kv, 2), h.pct(h.P.sv.dg.kv, 2), h.eur(sB.kv, 2)],
  ['Pensionsversicherung', h.pct(D.pv, 2), h.pct(h.P.sv.dg.pv, 2), h.eur(sB.pv, 2)],
  ['Arbeitslosenversicherung', h.pct(D.av, 2), h.pct(h.P.sv.dg.av, 2), h.eur(sB.av, 2)],
  ['Unfallversicherung', h.pct(0), h.pct(h.P.sv.dg.uv, 2), h.eur(0, 2)],
  ['Arbeiterkammerumlage', h.pct(D.ak, 2), h.pct(0), h.eur(sB.ak, 2)],
  ['Wohnbauförderung (Wien)', `${h.pct(D.wf, 2)} (${h.pct(D.wf_wien, 2)})`, `${h.pct(h.P.sv.dg.wf, 2)} (${h.pct(h.P.sv.dg.wf_wien, 2)})`, h.eur(sB.wf, 2)],
  ['Summe außerhalb Wiens', h.pct(satzVoll, 2), '', h.eur(sB.summe, 2)],
], 'Laufender Bezug 2026; Dienstgeber zusätzlich Insolvenzentgeltsicherung, Abfertigung neu und Lohnnebenkosten', ['l', 'r', 'r', 'r'])}
<p>Der größte Posten ist die Pensionsversicherung mit mehr als der Hälfte Ihres Beitrags. Sie begründet Ihr Pensionskonto: Jeder Monat mit Beiträgen erhöht die spätere Pension. Die Krankenversicherung deckt Arztbesuche und Spital und zahlt bei längerer Krankheit Krankengeld. Die Arbeitslosenversicherung finanziert das Arbeitslosengeld des AMS. Arbeiterkammerumlage und Wohnbauförderungsbeitrag sind streng genommen keine Versicherung, werden aber mit ihr eingehoben.</p>
<h3>Wien: höherer Wohnbauförderungsbeitrag</h3>
<p>Seit 1. Jänner 2026 beträgt der Wohnbauförderungsbeitrag für Beschäftigte in Wien ${h.pct(D.wf_wien, 2)} statt ${h.pct(D.wf, 2)}, für Dienstnehmer und Dienstgeber jeweils (${h.src('oegkWfWien', 'ÖGK')}). Entscheidend ist der Beschäftigungsort, nicht der Wohnort. Bei ${h.eur(B)} brutto macht das ${h.eur(B * (D.wf_wien - D.wf), 2)} im Monat aus. Wie sich das übers Jahr auswirkt, rechnet die Seite ${h.a('wien', 'Brutto-Netto Wien')} vor.</p>
<h2>Die Staffel der Arbeitslosenversicherung</h2>
<p>Für kleine Einkommen ist der Dienstnehmeranteil zur Arbeitslosenversicherung herabgesetzt (${h.src('oegkAv', 'ÖGK, Stand 1. 1. 2026')}). Die Grenzen werden jedes Jahr mit der Aufwertungszahl angepasst:</p>
<ul>
<li>bis ${h.eur(ST[0][0], 2)} brutto: ${h.pct(ST[0][1])}</li>
<li>über ${h.eur(ST[0][0], 2)} bis ${h.eur(ST[1][0], 2)}: ${h.pct(ST[1][1])}</li>
<li>über ${h.eur(ST[1][0], 2)} bis ${h.eur(ST[2][0], 2)}: ${h.pct(ST[2][1])}</li>
<li>über ${h.eur(ST[2][0], 2)}: ${h.pct(D.av, 2)}</li>
</ul>
<p>Die Staffel ist eine Treppe. Der höhere Satz gilt ab dem ersten Cent über der Grenze für das ganze Gehalt, nicht nur für den Teil darüber. Deshalb gibt es drei Stellen, an denen ein Euro mehr brutto weniger netto bedeutet:</p>
${h.table(['Grenze', 'Netto genau an der Grenze', 'Netto einen Euro darüber', 'Unterschied'], kanten.map((k) => [h.eur(k.g), h.eur(k.an, 2), h.eur(k.drueber, 2), h.eur(k.drueber - k.an, 2)]), 'Laufender Monatsbezug 2026, außerhalb Wiens, ohne Absetzbeträge außer dem Verkehrsabsetzbetrag', ['l', 'r', 'r', 'r'])}
<p>Die ÖGK betont zwei Regeln. Jeder Beitragszeitraum wird einzeln beurteilt, es gibt keinen Durchschnitt über das Jahr; ein Monat mit Überstunden oder Zulagen kann daher in die nächste Stufe fallen. Und mehrere Dienstverhältnisse werden nicht zusammengerechnet: Wer zwei Teilzeitjobs mit je ${h.eur(1500)} hat, zahlt bei beiden keine Arbeitslosenversicherung. Wer eine Erhöhung knapp über eine Grenze verhandelt, sollte nachrechnen, wo das Netto landet; die Seite zur ${h.a('gehaltserhoehung', 'Gehaltserhöhung')} zeigt solche Fälle.</p>
<!--mini:svBeitrag-->
<h2>Sozialversicherung nach Monatsbrutto</h2>
${h.table(['Monatsbrutto', 'Arbeitslosenversicherung', 'Satz gesamt', 'Beitrag', 'Beitrag in Wien'], tab.map((z) => [h.eur(z.b), h.pct(avSatz(z.b), 2), h.pct(z.s.satz * Math.min(z.b, h.P.sv.hbg_monat) / z.b, 2), h.eur(z.s.summe, 2), h.eur(z.w.summe, 2)]), 'Dienstnehmeranteil 2026 vom laufenden Bezug; ab der Höchstbeitragsgrundlage sinkt der Satz bezogen auf das ganze Gehalt', ['l', 'r', 'r', 'r', 'r'])}
<h2>Sonderzahlungen: weniger Posten, eigene Grenze</h2>
<p>Auf den 13. und 14. Bezug fallen Kranken-, Pensions- und Arbeitslosenversicherung an, aber keine Arbeiterkammerumlage und kein Wohnbauförderungsbeitrag, auch nicht in Wien. Der Satz liegt also höchstens bei ${h.pct(satzSz, 2)}. Die Staffel der Arbeitslosenversicherung wird auf die Sonderzahlung für sich angewendet. Das Beispiel der ÖGK: ${h.eur(oL)} laufend und ${h.eur(oS)} Sonderzahlung im selben Monat ergeben ${h.pct(avSatz(oL))} vom Gehalt, aber nur ${h.pct(avSatz(oS))} von der Sonderzahlung, weil beide Beträge getrennt betrachtet werden.</p>
<p>Für Sonderzahlungen gibt es eine eigene Höchstbeitragsgrundlage von ${h.eur(h.P.sv.hbg_sz_jahr)} im Kalenderjahr (${h.src('oegkWerte', 'ÖGK, veränderliche Werte 2026')}). Wer zwei volle Monatsgehälter über ${h.eur(h.P.sv.hbg_sz_jahr / 2)} bekommt, zahlt auf die zweite Sonderzahlung daher nur noch teilweise Beiträge. Was nach Steuer vom Urlaubs- und Weihnachtsgeld bleibt, zeigt die Seite zum ${h.a('dreizehntes-gehalt', '13. und 14. Gehalt')}.</p>
<h2>Obergrenze, Untergrenze und was dazwischen gilt</h2>
<p>Nach oben begrenzt die ${h.a('hoechstbeitragsgrundlage', 'Höchstbeitragsgrundlage')} von ${h.eur(h.P.sv.hbg_monat)} im Monat die Beiträge. Nach unten liegt die Geringfügigkeitsgrenze von ${h.eur(h.P.sv.geringfuegigkeit, 2)}: Bis dahin zahlen Sie keine Sozialversicherung und sind nur unfallversichert; die Seite ${h.a('geringfuegig', 'Geringfügige Beschäftigung')} erklärt, was das für Pension und Krankenversicherung bedeutet. Die Beiträge mindern übrigens die Lohnsteuer: Sie werden vom Bruttolohn abgezogen, bevor der Tarif angewendet wird. Bei kleinem Einkommen holt die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} sogar einen Teil zurück, bis zu ${h.eur(R.sv_rueckerstattung_max)} im Jahr.</p>
`,
  },
  en: {
    slug: 'social-insurance-contributions',
    nav: 'Social insurance 2026',
    card: 'Health, pension and unemployment insurance item by item, with the new reduced rates for low earners.',
    title: 'Social Insurance Austria 2026: Employee Contribution Rates',
    description: `Social insurance Austria 2026: ${EN.pct(satzVoll, 2)} of gross pay, ${EN.pct(satzWien, 2)} in Vienna, reduced unemployment rates up to ${EN.eur(ST[2][0])} and lower rates on the 13th and 14th salary.`,
    h1: 'Employee social insurance contributions in Austria',
    intro: 'What comes off your gross pay for health, pension and unemployment insurance, where the low-income scale jumps, and how holiday and Christmas pay differ.',
    resume: `Employees in Austria pay ${EN.pct(satzVoll, 2)} of their gross salary in social insurance in 2026 once they earn more than ${EN.eur(ST[2][0])} a month: ${EN.pct(D.kv, 2)} health insurance, ${EN.pct(D.pv, 2)} pension insurance, ${EN.pct(D.av, 2)} unemployment insurance, plus ${EN.pct(D.ak, 1)} each for the Chamber of Labour levy and the housing subsidy contribution. In Vienna the housing contribution rose to ${EN.pct(D.wf_wien, 2)} in January 2026, so the total there is ${EN.pct(satzWien, 2)}. Low earners pay less unemployment insurance: nothing up to ${EN.eur(ST[0][0])}, ${EN.pct(ST[1][1])} up to ${EN.eur(ST[1][0])}, ${EN.pct(ST[2][1])} up to ${EN.eur(ST[2][0])}. Holiday pay and Christmas pay carry no Chamber levy and no housing contribution, so at most ${EN.pct(satzSz, 2)} applies. Contributions stop growing at the ceiling of ${EN.eur(P.sv.hbg_monat)} a month, where they reach ${EN.eur(hbgSv, 2)}. If you earn no more than ${EN.eur(P.sv.geringfuegigkeit, 2)}, you are a marginal employee and pay nothing at all. All of it is collected by the ÖGK, the Austrian health insurance fund, through your employer.`,
    faqs: [
      { q: 'How much social insurance comes off an Austrian salary in 2026?', a: `Above ${EN.eur(ST[2][0])} gross a month it is ${EN.pct(satzVoll, 2)}, or ${EN.pct(satzWien, 2)} if you work in Vienna. On ${EN.eur(B)} gross outside Vienna that is ${EN.eur(sB.summe, 2)} a month, of which ${EN.eur(sB.pv, 2)} goes to your pension account. Your employer deducts it together with wage tax and pays it to the ÖGK. Below ${EN.eur(ST[2][0])} the rate drops because of the reduced unemployment scale.` },
      { q: 'Why is the unemployment insurance rate lower on small Austrian salaries?', a: `Since 2026 the employee share follows a scale: ${EN.pct(ST[0][1])} up to ${EN.eur(ST[0][0])} gross a month, ${EN.pct(ST[1][1])} up to ${EN.eur(ST[1][0])}, ${EN.pct(ST[2][1])} up to ${EN.eur(ST[2][0])}, then ${EN.pct(D.av, 2)}. Your employer still pays its full ${EN.pct(P.sv.dg.av, 2)}, and you stay fully insured. Every month is judged on its own, so a month with overtime can push you into a higher step.` },
      { q: 'What social insurance is charged on Austrian holiday and Christmas pay?', a: `Special payments carry health, pension and unemployment insurance but no Chamber of Labour levy and no housing contribution. On ${EN.eur(B)} of holiday pay that comes to ${EN.eur(szB.summe, 2)}, a rate of ${EN.pct(szB.satz, 2)}. The unemployment scale is applied to the size of the special payment itself, not to your salary. Both special payments together have their own annual ceiling of ${EN.eur(P.sv.hbg_sz_jahr)}.` },
      { q: 'Is there a cap on Austrian social insurance contributions?', a: `Yes. Contributions are charged only up to the maximum contribution base of ${EN.eur(P.sv.hbg_monat)} gross a month (${EN.eur(P.sv.hbg_monat / 30)} per calendar day). At that point the employee share is ${EN.eur(hbgSv, 2)} and stays there however much more you earn; every extra euro above it bears only wage tax. The ceiling is adjusted every January; the 2026 value comes from the ÖGK list of variable values.` },
      { q: 'Can low earners in Austria get social insurance contributions refunded?', a: `Yes. If your income is so low that no income tax is due, the annual tax assessment refunds ${EN.pct(R.sv_rueckerstattung_quote)} of your social insurance contributions, up to ${EN.eur(R.sv_rueckerstattung_max)} a year, or ${EN.eur(R.sv_rueckerstattung_pendler_max)} if you have the commuter allowance. Part-timers, students with summer jobs and people who arrived late in the year benefit most. It is paid automatically when the tax office assesses you without a claim.` },
      { q: 'How much social insurance does my Austrian employer pay on top?', a: `The employer share is ${EN.pct(P.sv.dg.kv + P.sv.dg.pv + P.sv.dg.av + P.sv.dg.uv + P.sv.dg.ie + P.sv.dg.wf, 2)} of gross pay, more than yours because the employer alone funds accident insurance. On top come ${EN.pct(P.sv.dg.mv, 2)} into your severance fund and payroll taxes such as the family fund contribution and municipal tax. None of this appears as a deduction on your payslip; the employer cost calculator adds it all up.` },
    ],
    body: (h) => `
<h2>The 2026 rates item by item</h2>
<p>Social insurance in Austria is compulsory. Anyone earning more than the marginal-employment limit is automatically covered for health, pension, accident and unemployment. You cannot opt out, choose a private insurer instead or pick a different fund: your employer registers you with the ÖGK, deducts your share each month and pays it over together with its own. The rates below come from the ${h.src('wkoBeitraege', 'Chamber of Commerce overview of 2026 contributions')}.</p>
${h.table(['Contribution', 'Employee', 'Employer', `Your share on ${h.eur(B)}`], [
  ['Health insurance (KV)', h.pct(D.kv, 2), h.pct(h.P.sv.dg.kv, 2), h.eur(sB.kv, 2)],
  ['Pension insurance (PV)', h.pct(D.pv, 2), h.pct(h.P.sv.dg.pv, 2), h.eur(sB.pv, 2)],
  ['Unemployment insurance (AV)', h.pct(D.av, 2), h.pct(h.P.sv.dg.av, 2), h.eur(sB.av, 2)],
  ['Accident insurance (UV)', h.pct(0), h.pct(h.P.sv.dg.uv, 2), h.eur(0, 2)],
  ['Chamber of Labour levy (AK)', h.pct(D.ak, 2), h.pct(0), h.eur(sB.ak, 2)],
  ['Housing subsidy (Vienna)', `${h.pct(D.wf, 2)} (${h.pct(D.wf_wien, 2)})`, `${h.pct(h.P.sv.dg.wf, 2)} (${h.pct(h.P.sv.dg.wf_wien, 2)})`, h.eur(sB.wf, 2)],
  ['Total outside Vienna', h.pct(satzVoll, 2), '', h.eur(sB.summe, 2)],
], 'Regular monthly pay 2026; the employer also pays insolvency insurance, the severance fund and payroll taxes', ['l', 'r', 'r', 'r'])}
<p>Pension insurance is by far the largest item. It feeds your personal pension account (Pensionskonto), where every month of contributions raises your future Austrian pension. Health insurance gives you access to doctors and hospitals with your e-card and pays sick pay during longer illness. Unemployment insurance funds benefits from the AMS, the public employment service. The Chamber of Labour levy funds the AK (Arbeiterkammer), the statutory body representing employees, which you automatically belong to as an employee.</p>
<h3>Vienna: higher housing contribution</h3>
<p>Since 1 January 2026 the housing subsidy contribution (Wohnbauförderungsbeitrag) for jobs in Vienna is ${h.pct(D.wf_wien, 2)} instead of ${h.pct(D.wf, 2)}, for both employee and employer (${h.src('oegkWfWien', 'ÖGK')}). What matters is where you work, not where you live. On ${h.eur(B)} gross the difference is ${h.eur(B * (D.wf_wien - D.wf), 2)} a month; the ${h.a('wien', 'Vienna gross-to-net page')} shows the full year.</p>
<h2>The reduced unemployment contribution</h2>
<p>For low incomes the employee share of unemployment insurance is cut (${h.src('oegkAv', 'ÖGK, as of 1 January 2026')}). The limits are uprated every year:</p>
<ul>
<li>up to ${h.eur(ST[0][0], 2)} gross: ${h.pct(ST[0][1])}</li>
<li>${h.eur(ST[0][0], 2)} to ${h.eur(ST[1][0], 2)}: ${h.pct(ST[1][1])}</li>
<li>${h.eur(ST[1][0], 2)} to ${h.eur(ST[2][0], 2)}: ${h.pct(ST[2][1])}</li>
<li>above ${h.eur(ST[2][0], 2)}: ${h.pct(D.av, 2)}</li>
</ul>
<p>The scale is a staircase, not a ramp. Once you pass a limit by a cent, the higher rate applies to your entire salary. That creates three points where one more euro of gross means less take-home pay:</p>
${h.table(['Limit', 'Net exactly at the limit', 'Net one euro above', 'Difference'], kanten.map((k) => [h.eur(k.g), h.eur(k.an, 2), h.eur(k.drueber, 2), h.eur(k.drueber - k.an, 2)]), 'Regular monthly pay 2026, outside Vienna, transport credit only', ['l', 'r', 'r', 'r'])}
<p>Two rules from the ÖGK matter in practice. Each month stands alone, with no averaging over the year, so overtime can lift a single month into a higher step. And separate jobs are never added together: with two part-time jobs paying ${h.eur(1500)} each, neither deducts unemployment insurance. If a pay offer lands just above a limit, check the net figure; the ${h.a('gehaltserhoehung', 'pay rise page')} works through such cases.</p>
<!--mini:svBeitrag-->
<h2>Contributions by monthly gross</h2>
${h.table(['Monthly gross', 'Unemployment rate', 'Overall rate', 'Contribution', 'In Vienna'], tab.map((z) => [h.eur(z.b), h.pct(avSatz(z.b), 2), h.pct(z.s.satz * Math.min(z.b, h.P.sv.hbg_monat) / z.b, 2), h.eur(z.s.summe, 2), h.eur(z.w.summe, 2)]), 'Employee share 2026 on regular pay; above the ceiling the rate measured on the whole salary falls', ['l', 'r', 'r', 'r', 'r'])}
<h2>Special payments: fewer items, their own ceiling</h2>
<p>Most Austrian employees receive a 13th and 14th salary (Sonderzahlungen, special payments), usually as holiday pay in summer and Christmas pay in late autumn. They carry health, pension and unemployment insurance, but no Chamber levy and no housing contribution, even in Vienna, so the rate is at most ${h.pct(satzSz, 2)}. The unemployment scale looks at the special payment on its own. The ÖGK example: ${h.eur(oL)} of salary and a ${h.eur(oS)} special payment in the same month mean ${h.pct(avSatz(oL))} on the salary but only ${h.pct(avSatz(oS))} on the special payment.</p>
<p>Special payments have their own ceiling of ${h.eur(h.P.sv.hbg_sz_jahr)} per calendar year (${h.src('oegkWerte', 'ÖGK variable values 2026')}). If each of your two extra salaries is above ${h.eur(h.P.sv.hbg_sz_jahr / 2)}, the second one is only partly charged. The net value of both is worked out on the ${h.a('dreizehntes-gehalt', '13th and 14th salary page')}.</p>
<h2>The floor, the ceiling and the effect on tax</h2>
<p>At the top, the ${h.a('hoechstbeitragsgrundlage', 'maximum contribution base')} of ${h.eur(h.P.sv.hbg_monat)} a month caps contributions. At the bottom sits the marginal-employment limit of ${h.eur(h.P.sv.geringfuegigkeit, 2)}: below it you pay nothing and are covered for accidents only, as explained under ${h.a('geringfuegig', 'marginal employment')}. Contributions also lower your wage tax, because they are deducted from gross pay before the tax scale applies. For low earners, the ${h.a('arbeitnehmerveranlagung', 'annual tax assessment')} even returns part of them, up to ${h.eur(R.sv_rueckerstattung_max)} a year.</p>
`,
  },
});
