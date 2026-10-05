import { defineGuide } from '../../lib/guide-types';
import { ueberstunden } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const U = P.ueberstunden;

/** Beispiel: 3.000 € brutto, 40 Wochenstunden, 10 Überstunden mit 50 % Zuschlag, Arbeitsort außerhalb Wiens. */
const B = 3000, W = 40, H = 10;
const r = ueberstunden(B, W, H);
const quote = r.nettoMehr / r.bruttoMehr;

/** Tabelle: 5 bis 20 Überstunden im selben Monat. */
const STD = [5, 10, 15, 20];
const tab = STD.map((s) => ({ s, x: ueberstunden(B, W, s) }));
const r20 = tab[3].x;

/** Steuerfreier Zuschlag für 20 Überstunden nach Jahr: 2024/25, 2026, ab 2027 (je höchstens 50 % des Grundlohns). */
const frei = (stunden: number, maxStd: number, maxEur: number) => Math.min(Math.min(stunden, maxStd) * r.stundenlohn * U.zuschlag_gesetzlich, maxEur);
const frei2025 = frei(STD[3], U.frei_stunden_2024_2025, U.frei_max_2024_2025);
const frei2026 = frei(STD[3], U.frei_stunden_2026, U.frei_max_2026);
const frei2027 = frei(STD[3], U.frei_stunden_ab_2027, U.frei_max_ab_2027);

/** Ab welchem Monatsbrutto (40 Stunden) der Deckel von 170 € vor der 15-Stunden-Grenze greift. */
const deckelAb = U.frei_max_2026 / (U.frei_stunden_2026 * U.zuschlag_gesetzlich) * W * U.wochen_je_monat;

export default defineGuide({
  id: 'ueberstunden',
  group: 'rechner',
  order: 50,
  tool: 'ueberstunden',
  related: ['stundenlohn', 'teilzeit', 'jahressechstel', 'lohnsteuer', 'sonderzahlungen'],
  sources: ['estg68', 'estg124b', 'azg10'],
  de: {
    slug: 'ueberstunden-rechner',
    nav: 'Überstunden-Rechner',
    card: 'Was von Überstunden netto bleibt, mit dem steuerfreien Zuschlag 2026 für 15 Stunden und höchstens 170 €.',
    title: 'Überstunden netto 2026: Rechner mit steuerfreiem Zuschlag',
    description: `Überstunden 2026 netto berechnen: Zuschläge für die ersten ${U.frei_stunden_2026} Stunden bis ${DE.eur(U.frei_max_2026)} im Monat steuerfrei. ${H} Überstunden bei ${DE.eur(B)} brutto bringen ${DE.eur(r.nettoMehr, 2)}.`,
    h1: 'Was von Ihren Überstunden netto bleibt',
    intro: 'Stundenlohn, Zuschlag, steuerfreier Teil und Abzüge für genau Ihren Monat, nach den Regeln von 2026.',
    resume: `Zehn Überstunden mit dem gesetzlichen Zuschlag von ${DE.pct(U.zuschlag_gesetzlich)} bringen bei ${DE.eur(B)} brutto und ${W} Wochenstunden 2026 ${DE.eur(r.bruttoMehr, 2)} brutto und ${DE.eur(r.nettoMehr, 2)} netto, also ${DE.pct(quote)} des Bruttobetrags. Der Grundlohn je Stunde beträgt ${DE.eur(r.stundenlohn, 2)} (Monatsgehalt geteilt durch Wochenstunden mal ${DE.num(U.wochen_je_monat, 2)}). Steuerfrei sind 2026 die Zuschläge für die ersten ${U.frei_stunden_2026} Überstunden im Monat, höchstens ${DE.pct(U.zuschlag_gesetzlich)} des Grundlohns und insgesamt ${DE.eur(U.frei_max_2026)}. Das ist eine Übergangsregel für ein Jahr: 2024 und 2025 galten ${U.frei_stunden_2024_2025} Stunden und ${DE.eur(U.frei_max_2024_2025)}, ab Jänner 2027 gilt wieder das Dauerrecht mit ${U.frei_stunden_ab_2027} Stunden und ${DE.eur(U.frei_max_ab_2027)}. Die Grundvergütung der Überstunden ist immer voll steuerpflichtig, und Sozialversicherung fällt auf den ganzen Betrag an. Zuschläge für Sonntags-, Feiertags- und Nachtarbeit sowie Schmutz-, Erschwernis- und Gefahrenzulagen sind zusätzlich bis ${DE.eur(U.sfn_frei_max)} im Monat steuerfrei.`,
    faqs: [
      { q: 'Wie viele Überstunden sind 2026 steuerfrei?', a: `Steuerfrei sind nicht die Überstunden selbst, sondern ihre Zuschläge: 2026 für die ersten ${U.frei_stunden_2026} Überstunden im Monat, bis ${DE.pct(U.zuschlag_gesetzlich)} des Grundlohns und höchstens ${DE.eur(U.frei_max_2026)} (§ 124b EStG). Bei ${DE.eur(B)} brutto reicht das für ${DE.eur(r.stundenlohn * U.zuschlag_gesetzlich, 2)} je Stunde; der Deckel von ${DE.eur(U.frei_max_2026)} greift erst ab rund ${DE.eur(deckelAb)} Monatsbrutto bei ${W} Wochenstunden.` },
      { q: 'Warum bleibt von Überstunden netto so wenig übrig?', a: `Weil die Überstunden oben auf Ihr Gehalt kommen und dort mit dem Grenzsteuersatz besteuert werden, dazu volle Sozialversicherung. Bei ${DE.eur(B)} brutto und ${H} Stunden gehen ${DE.eur(r.svMehr, 2)} an die Sozialversicherung und ${DE.eur(r.lstMehr, 2)} an Lohnsteuer. Ohne den steuerfreien Zuschlag wäre die Lohnsteuer höher. Regelmäßige Überstunden erhöhen außerdem das Jahressechstel für Urlaubs- und Weihnachtsgeld.` },
      { q: 'Kann ich statt Geld Zeitausgleich für Überstunden verlangen?', a: `Grundsätzlich regelt das der Kollektivvertrag, sonst die Betriebsvereinbarung, sonst gebührt Geld. Für Überstunden, mit denen Sie ${U.azg_wahlrecht_ab_tagesstunden} Stunden am Tag oder ${U.azg_wahlrecht_ab_wochenstunden} Stunden in der Woche überschreiten, dürfen Sie selbst wählen, ob Sie Geld oder Zeitausgleich wollen, spätestens am Ende des Abrechnungszeitraums (§ 10 Abs. 4 AZG). Beim Zeitausgleich ist der Zuschlag mitzurechnen, also anderthalb Stunden frei je Überstunde mit ${DE.pct(U.zuschlag_gesetzlich)}.` },
      { q: 'Gelten Mehrstunden in Teilzeit steuerlich als Überstunden?', a: `Für die Steuerbefreiung nach § 68 Abs. 2 EStG nicht. Als Überstunde gilt dort nur Arbeitszeit über ${U.ueberstunde_steuerlich_ab_wochenstunden} Stunden in der Woche oder über die Tagesarbeitszeit, die sich aus einer Normalarbeitszeit von mindestens ${U.ueberstunde_steuerlich_ab_wochenstunden} Wochenstunden ergibt. Wer 25 Stunden vereinbart hat und 30 arbeitet, versteuert einen allfälligen Zuschlag voll. Tragen Sie Teilzeit-Mehrstunden deshalb nicht als Überstunden in den Rechner ein.` },
    ],
    body: (h) => `
<h2>So rechnet der Überstunden-Rechner</h2>
<p>Sie geben Monatsgehalt brutto, Normalarbeitszeit pro Woche, die Überstunden des Monats, den Zuschlag und das Bundesland des Arbeitsorts ein. Der Rechner ermittelt den Grundlohn je Stunde, indem er das Gehalt durch die Wochenstunden mal ${h.num(h.P.ueberstunden.wochen_je_monat, 2)} teilt, multipliziert mit den Stunden, legt den Zuschlag darauf und trennt den steuerfreien Teil ab. Dann rechnet er Ihren Lohnzettel zweimal, mit und ohne Überstunden. Die große Zahl ist, was davon netto bleibt. Ihr Kollektivvertrag darf eine andere Berechnungsart vorsehen (${h.src('azg10', '§ 10 Abs. 3 AZG')}); dann weicht der Stundenlohn leicht ab.</p>
<h2>Was ${h.num(H)} Überstunden bei ${h.eur(B)} bringen</h2>
${h.table(['Posten', 'Betrag'], [
  ['Grundlohn je Stunde', h.eur(r.stundenlohn, 2)],
  ['Grundvergütung', h.eur(r.grundvergutung, 2)],
  [`Zuschlag ${h.pct(h.P.ueberstunden.zuschlag_gesetzlich)}`, h.eur(r.zuschlag, 2)],
  ['davon steuerfrei', h.eur(r.steuerfreierZuschlag, 2)],
  ['mehr Sozialversicherung', h.eur(r.svMehr, 2)],
  ['mehr Lohnsteuer', h.eur(r.lstMehr, 2)],
  ['mehr netto', h.eur(r.nettoMehr, 2)],
], `${h.eur(B)} brutto, ${h.num(W)} Wochenstunden, Arbeitsort außerhalb Wiens, Werte 2026`, ['l', 'r'])}
<h2>Mehr Stunden, kleinerer Netto-Anteil</h2>
${h.table(['Überstunden', 'brutto mehr', 'davon steuerfrei', 'netto mehr'], tab.map(({ s, x }) => [h.num(s), h.eur(x.bruttoMehr, 2), h.eur(x.steuerfreierZuschlag, 2), h.eur(x.nettoMehr, 2)]), `${h.eur(B)} brutto, ${h.num(W)} Wochenstunden, Zuschlag ${h.pct(h.P.ueberstunden.zuschlag_gesetzlich)}`, ['r', 'r', 'r', 'r'])}
<p>Bis zur ${h.num(h.P.ueberstunden.frei_stunden_2026)}. Stunde wächst der steuerfreie Teil mit, danach bleibt er stehen; jede weitere Stunde wird samt Zuschlag voll versteuert. Bei ${h.num(STD[3])} Stunden bleiben deshalb ${h.pct(r20.nettoMehr / r20.bruttoMehr)} netto statt ${h.pct(quote)} bei ${h.num(H)} Stunden.</p>
<h2>Die Regeln 2024 bis 2027 im Vergleich</h2>
<p>Die Grenze in ${h.src('estg68', '§ 68 Abs. 2 EStG')} liegt im Dauerrecht bei ${h.num(h.P.ueberstunden.frei_stunden_ab_2027)} Stunden und ${h.eur(h.P.ueberstunden.frei_max_ab_2027)}. Für 2024 und 2025 hob ${h.src('estg124b', '§ 124b EStG')} sie befristet an, für 2026 gilt eine eigene, etwas niedrigere Stufe. Für ${h.num(STD[3])} Überstunden bei ${h.eur(B)} brutto heißt das:</p>
${h.table(['Jahr', 'Grenze', 'steuerfreier Zuschlag'], [
  ['2024 und 2025', `${h.num(h.P.ueberstunden.frei_stunden_2024_2025)} Std., ${h.eur(h.P.ueberstunden.frei_max_2024_2025)}`, h.eur(frei2025, 2)],
  ['2026', `${h.num(h.P.ueberstunden.frei_stunden_2026)} Std., ${h.eur(h.P.ueberstunden.frei_max_2026)}`, h.eur(frei2026, 2)],
  ['ab 2027', `${h.num(h.P.ueberstunden.frei_stunden_ab_2027)} Std., ${h.eur(h.P.ueberstunden.frei_max_ab_2027)}`, h.eur(frei2027, 2)],
], `Steuerfreier Überstundenzuschlag pro Monat, je höchstens ${h.pct(h.P.ueberstunden.zuschlag_gesetzlich)} des Grundlohns`, ['l', 'l', 'r'])}
<p>Hat Ihr Arbeitgeber Anfang 2026 noch mit den alten Werten abgerechnet, musste er bis spätestens 31. Mai 2026 aufrollen, sofern das technisch möglich war; prüfen Sie im Zweifel Ihre Lohnzettel der ersten Monate.</p>
<h2>Sonntag, Feiertag, Nacht und Zulagen</h2>
<p>Unabhängig davon sind Schmutz-, Erschwernis- und Gefahrenzulagen, Zuschläge für Sonntags-, Feiertags- und Nachtarbeit und die damit zusammenhängenden Überstundenzuschläge bis ${h.eur(h.P.ueberstunden.sfn_frei_max)} im Monat steuerfrei (§ 68 Abs. 1). Der Rechner bildet nur die Befreiung für normale Überstunden ab; wählen Sie ${h.pct(1)} Zuschlag, rechnet er davon höchstens die Hälfte des Grundlohns steuerfrei. Was das Sechstel durch regelmäßige Überstunden gewinnt, zeigt der ${h.a('sonderzahlungen', 'Urlaubsgeld- und Weihnachtsgeld-Rechner')}; Ihren Stundenlohn ohne Überstunden finden Sie auf der Seite ${h.a('stundenlohn', 'Stundenlohn')}.</p>
`,
  },
  en: {
    slug: 'overtime-calculator',
    nav: 'Overtime calculator',
    card: 'What overtime leaves you net, with the 2026 tax-free premium for 15 hours and up to €170.',
    title: 'Overtime Pay Austria 2026: Net Calculator and Tax-Free Cap',
    description: `Overtime in Austria 2026: premiums for the first ${U.frei_stunden_2026} hours a month are tax-free up to ${EN.eur(U.frei_max_2026)}. ${H} hours on ${EN.eur(B)} gross add ${EN.eur(r.nettoMehr, 2)} net to your monthly pay.`,
    h1: 'What your overtime leaves you after tax',
    intro: 'Hourly rate, premium, tax-free part and deductions for your own month, under the 2026 rules.',
    resume: `Ten overtime hours (Überstunden) with the statutory ${EN.pct(U.zuschlag_gesetzlich)} premium add ${EN.eur(r.bruttoMehr, 2)} gross and ${EN.eur(r.nettoMehr, 2)} net to a ${EN.eur(B)} monthly salary on a ${W}-hour week in 2026, so you keep ${EN.pct(quote)} of the gross amount. The base hourly rate is ${EN.eur(r.stundenlohn, 2)}: monthly salary divided by weekly hours times ${EN.num(U.wochen_je_monat, 2)}, the average number of weeks in a month. In 2026 the premiums for the first ${U.frei_stunden_2026} overtime hours a month are tax-free, up to ${EN.pct(U.zuschlag_gesetzlich)} of the base rate and ${EN.eur(U.frei_max_2026)} in total. This is a one-year transitional rule: 2024 and 2025 allowed ${U.frei_stunden_2024_2025} hours and ${EN.eur(U.frei_max_2024_2025)}, and from January 2027 the permanent rule of ${U.frei_stunden_ab_2027} hours and ${EN.eur(U.frei_max_ab_2027)} returns. The base pay for the extra hours is always fully taxable, and social insurance is charged on all of it. Separately, premiums for Sunday, public holiday and night work plus dirt, hardship and danger allowances are tax-free up to ${EN.eur(U.sfn_frei_max)} a month.`,
    faqs: [
      { q: 'How much overtime pay is tax-free in Austria in 2026?', a: `Not the overtime itself, only the premium: in 2026 for the first ${U.frei_stunden_2026} overtime hours a month, up to ${EN.pct(U.zuschlag_gesetzlich)} of the base rate and at most ${EN.eur(U.frei_max_2026)} (section 124b of the Income Tax Act). On ${EN.eur(B)} gross that is ${EN.eur(r.stundenlohn * U.zuschlag_gesetzlich, 2)} per hour; the ${EN.eur(U.frei_max_2026)} cap only bites from about ${EN.eur(deckelAb)} gross a month on a ${W}-hour week.` },
      { q: 'Why does so little of my overtime pay reach my account?', a: `Overtime sits on top of your salary, where it is taxed at your marginal rate and carries full social insurance. On ${EN.eur(B)} gross, ${H} hours cost ${EN.eur(r.svMehr, 2)} in social insurance and ${EN.eur(r.lstMehr, 2)} in wage tax. Without the tax-free premium the tax would be higher. Regular overtime also raises the annual sixth that limits low-taxed holiday and Christmas pay.` },
      { q: 'Can I take time off instead of being paid for overtime in Austria?', a: `Usually your collective agreement decides, failing that a works agreement, and otherwise you are paid. For hours that take you past ${U.azg_wahlrecht_ab_tagesstunden} a day or ${U.azg_wahlrecht_ab_wochenstunden} a week, you may choose money or time off yourself, at the latest by the end of the pay period (section 10(4) of the Working Time Act). Time off must include the premium: one and a half hours off per overtime hour at ${EN.pct(U.zuschlag_gesetzlich)}.` },
      { q: 'Do extra hours in a part-time job count as overtime for the tax break?', a: `No. Under section 68(2) only time beyond ${U.ueberstunde_steuerlich_ab_wochenstunden} hours a week, or beyond the daily hours that result from spreading a normal week of at least ${U.ueberstunde_steuerlich_ab_wochenstunden} hours, counts as overtime for the exemption. If your contract says 25 hours and you work 30, any premium on those hours is fully taxed. Do not enter part-time extra hours as overtime in the calculator.` },
    ],
    body: (h) => `
<h2>How the overtime calculator works</h2>
<p>Enter your monthly gross salary, your normal weekly hours, the overtime hours of the month, the premium and the federal state of your workplace. The calculator derives the base hourly rate by dividing your salary by weekly hours times ${h.num(h.P.ueberstunden.wochen_je_monat, 2)}, multiplies it by the hours, adds the premium and separates the tax-free part. It then runs your payslip twice, with and without overtime; the headline is what you keep. Your collective agreement (Kollektivvertrag) may set a different method (${h.src('azg10', 'section 10(3) of the Working Time Act')}), in which case the hourly rate differs slightly.</p>
<h2>What ${h.num(H)} hours bring on ${h.eur(B)}</h2>
${h.table(['Item', 'Amount'], [
  ['Base rate per hour', h.eur(r.stundenlohn, 2)],
  ['Base pay for the hours', h.eur(r.grundvergutung, 2)],
  [`Premium ${h.pct(h.P.ueberstunden.zuschlag_gesetzlich)}`, h.eur(r.zuschlag, 2)],
  ['of which tax-free', h.eur(r.steuerfreierZuschlag, 2)],
  ['extra social insurance', h.eur(r.svMehr, 2)],
  ['extra wage tax', h.eur(r.lstMehr, 2)],
  ['extra net pay', h.eur(r.nettoMehr, 2)],
], `${h.eur(B)} gross, ${h.num(W)}-hour week, workplace outside Vienna, 2026`, ['l', 'r'])}
<h2>More hours, a smaller net share</h2>
${h.table(['Overtime hours', 'Extra gross', 'Tax-free part', 'Extra net'], tab.map(({ s, x }) => [h.num(s), h.eur(x.bruttoMehr, 2), h.eur(x.steuerfreierZuschlag, 2), h.eur(x.nettoMehr, 2)]), `${h.eur(B)} gross, ${h.num(W)}-hour week, ${h.pct(h.P.ueberstunden.zuschlag_gesetzlich)} premium`, ['r', 'r', 'r', 'r'])}
<p>The tax-free part grows up to hour ${h.num(h.P.ueberstunden.frei_stunden_2026)} and then stops; every further hour is taxed in full, premium included. At ${h.num(STD[3])} hours you therefore keep ${h.pct(r20.nettoMehr / r20.bruttoMehr)} rather than ${h.pct(quote)} at ${h.num(H)} hours.</p>
<h2>The rules from 2024 to 2027</h2>
<p>The permanent limit in ${h.src('estg68', 'section 68(2) of the Income Tax Act')} is ${h.num(h.P.ueberstunden.frei_stunden_ab_2027)} hours and ${h.eur(h.P.ueberstunden.frei_max_ab_2027)}. ${h.src('estg124b', 'Section 124b')} raised it temporarily for 2024 and 2025 and sets a separate, slightly lower step for 2026. For ${h.num(STD[3])} hours on ${h.eur(B)} gross:</p>
${h.table(['Year', 'Limit', 'Tax-free premium'], [
  ['2024 and 2025', `${h.num(h.P.ueberstunden.frei_stunden_2024_2025)} h, ${h.eur(h.P.ueberstunden.frei_max_2024_2025)}`, h.eur(frei2025, 2)],
  ['2026', `${h.num(h.P.ueberstunden.frei_stunden_2026)} h, ${h.eur(h.P.ueberstunden.frei_max_2026)}`, h.eur(frei2026, 2)],
  ['from 2027', `${h.num(h.P.ueberstunden.frei_stunden_ab_2027)} h, ${h.eur(h.P.ueberstunden.frei_max_ab_2027)}`, h.eur(frei2027, 2)],
], `Tax-free overtime premium per month, each capped at ${h.pct(h.P.ueberstunden.zuschlag_gesetzlich)} of the base rate`, ['l', 'l', 'r'])}
<p>Employers who still applied the old values in early 2026 had to recalculate those months by 31 May 2026 where technically possible, so check your first payslips of the year if in doubt.</p>
<h2>Sundays, holidays, nights and allowances</h2>
<p>Separately, dirt, hardship and danger allowances, premiums for Sunday, holiday and night work and the overtime premiums linked to such work are tax-free up to ${h.eur(h.P.ueberstunden.sfn_frei_max)} a month (section 68(1)). The calculator only models the exemption for ordinary overtime; if you choose a ${h.pct(1)} premium, it treats at most half the base rate as tax-free. The ${h.a('sonderzahlungen', 'holiday and Christmas pay calculator')} shows how regular overtime enlarges the annual sixth, and the ${h.a('stundenlohn', 'hourly wage page')} gives your rate without overtime.</p>
`,
  },
});
