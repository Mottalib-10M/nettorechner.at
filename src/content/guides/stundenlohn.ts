import { defineGuide } from '../../lib/guide-types';
import { kurz, ueberstunden } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const W = P.ueberstunden.wochen_je_monat;
/** Vom Stundenlohn zum Monat: Stundenlohn × Wochenstunden × 4,33. */
const rechne = (s: number, w: number) => {
  const b = s * w * W, k = kurz(b), stdMonat = w * W;
  return { s, w, b, k, nettoStd: k.nettoMonat / stdMonat, nettoStdJahr: k.nettoJahr / (stdMonat * 12), quote: k.nettoMonat / b };
};
const LOEHNE = [12, 14, 16, 18, 20, 22, 25, 30, 35, 40];
const tab = LOEHNE.map((s) => ({ a: rechne(s, 38.5), b: rechne(s, 40) }));
const x = rechne(20, 40);
const lo = rechne(12, 40), hi = rechne(40, 40);
/** Höchste Wochenstunden, um bei einem Stundenlohn geringfügig zu bleiben. */
const GF = P.sv.geringfuegigkeit;
const gfStunden = [12, 14, 16, 20].map((s) => ({ s, h: GF / (s * W) }));
/** Überstunden: 10 Stunden im Monat bei 20 € und 40 Wochenstunden. */
const ue = ueberstunden(x.b, 40, 10);
const U = P.ueberstunden;
/** Teilzeit mit Stundenlohn: 16 € bei 20 Wochenstunden. */
const tz = rechne(16, 20);

export default defineGuide({
  id: 'stundenlohn',
  group: 'lohn',
  order: 45,
  mini: 'stundenlohn',
  related: ['teilzeit', 'ueberstunden', 'jahresgehalt', 'geringfuegig', 'lohnsteuer'],
  sources: ['estg33', 'oegkWerte', 'azg10', 'estg68'],
  de: {
    slug: 'stundenlohn-brutto-netto',
    nav: 'Stundenlohn brutto netto',
    card: 'Vom Stundenlohn zum Monatsnetto mit dem Faktor 4,33, Tabelle für 12 bis 40 Euro und der Nettolohn pro Stunde.',
    title: 'Stundenlohn brutto netto 2026: Monat und Netto pro Stunde',
    description: `Stundenlohn brutto netto 2026: mal Wochenstunden mal ${DE.num(W, 2)} ergibt das Monatsbrutto. Bei ${DE.eur(20)} und 40 Stunden bleiben ${DE.eur(x.k.nettoMonat)} netto. Tabelle bis ${DE.eur(40)} je Stunde.`,
    h1: 'Stundenlohn: vom Brutto pro Stunde zum Monatsnetto',
    intro: 'Wie ein Stundenlohn in ein Monatsgehalt umgerechnet wird, was davon netto bleibt und wie viel eine Arbeitsstunde nach Abzügen tatsächlich bringt.',
    resume: `Ein Stundenlohn wird in Österreich in ein Monatsbrutto umgerechnet, indem man ihn mit den Wochenstunden und dem Faktor ${DE.num(W, 2)} multipliziert, der durchschnittlichen Zahl der Wochen pro Monat. Bei ${DE.eur(20)} brutto und 40 Wochenstunden ergibt das ${DE.eur(x.b, 2)} im Monat und ${DE.eur(x.k.nettoMonat, 2)} netto, also ${DE.eur(x.nettoStd, 2)} pro Stunde. Rechnet man Urlaubszuschuss und Weihnachtsremuneration mit ein, die meist auch Beschäftigten mit Stundenlohn zustehen, steigt der Nettowert einer Stunde auf ${DE.eur(x.nettoStdJahr, 2)}. Von einem niedrigen Stundenlohn bleibt prozentual mehr: Bei ${DE.eur(12)} sind es ${DE.pct(lo.quote)} des Bruttos, bei ${DE.eur(40)} nur ${DE.pct(hi.quote)}, weil Lohnsteuer und Arbeitslosenversicherung mit dem Einkommen steigen. Einen allgemeinen gesetzlichen Mindestlohn kennt Österreich nicht; die Untergrenzen stehen in den Kollektivverträgen der Branchen. Wer höchstens ${DE.eur(GF, 2)} im Monat verdient, ist geringfügig beschäftigt und bekommt den Stundenlohn ohne Abzüge.`,
    faqs: [
      { q: 'Wie rechne ich meinen Stundenlohn in ein Monatsgehalt um?', a: `Stundenlohn mal Wochenstunden mal ${DE.num(W, 2)}. Der Faktor ergibt sich aus 52 Wochen geteilt durch zwölf Monate und ist auch die Grundlage, mit der die Lohnverrechnung umgekehrt den Stundensatz aus dem Monatsgehalt ermittelt. ${DE.eur(16)} bei 38,5 Stunden ergeben so ${DE.eur(16 * 38.5 * W, 2)} brutto im Monat. Viele Kollektivverträge verwenden eigene Teiler; dann weicht das Ergebnis um einige Euro ab.` },
      { q: 'Wie viel netto bleibt bei 20 Euro Stundenlohn?', a: `Bei 40 Wochenstunden sind es ${DE.eur(x.k.nettoMonat, 2)} netto im Monat aus ${DE.eur(x.b, 2)} brutto, bei 38,5 Stunden ${DE.eur(tab[4].a.k.nettoMonat, 2)}. Pro Stunde bleiben damit rund ${DE.eur(x.nettoStd, 2)}. Mit beiden Sonderzahlungen kommen im Jahr ${DE.eur(x.k.nettoJahr)} netto zusammen. Die Werte gelten außerhalb Wiens ohne Kinder und Pendlerpauschale und wurden mit dem Rechner dieser Seite ermittelt.` },
      { q: 'Gibt es in Österreich einen gesetzlichen Mindeststundenlohn?', a: `Nein, einen allgemeinen gesetzlichen Mindestlohn gibt es nicht. Mindestlöhne und Mindestgehälter legen die Kollektivverträge fest, die für die allermeisten Arbeitsverhältnisse gelten, getrennt nach Branche, Tätigkeit und Erfahrung. Der für Sie maßgebliche Stundenlohn steht daher in der Lohntabelle Ihres Kollektivvertrags. Ein Arbeitgeber darf ihn nicht unterschreiten, auch nicht mit Ihrer Zustimmung; mehr zahlen darf er jederzeit.` },
      { q: 'Wie viele Wochenstunden darf ich mit Stundenlohn geringfügig arbeiten?', a: `So viele, dass das Monatsentgelt ${DE.eur(GF, 2)} nicht übersteigt. Bei ${DE.eur(14)} Stundenlohn sind das rund ${DE.num(gfStunden[1].h, 1)} Stunden pro Woche, bei ${DE.eur(20)} rund ${DE.num(gfStunden[3].h, 1)}. Maßgeblich ist der tatsächliche Monatsverdienst, nicht der Durchschnitt; Sonderzahlungen zählen dabei nicht mit. Ein Monat mit mehr Stunden kann die Grenze überschreiten und volle Sozialversicherung auslösen.` },
      { q: 'Mit welchem Stundenlohn werden Überstunden bezahlt?', a: `Mit dem Normallohn je Stunde und einem Zuschlag von ${DE.pct(U.zuschlag_gesetzlich)} (§ 10 AZG), sofern nicht Zeitausgleich vereinbart ist. Bei ${DE.eur(20)} Grundlohn sind das ${DE.eur(20 * (1 + U.zuschlag_gesetzlich))} je Überstunde. 2026 sind die Zuschläge für die ersten ${DE.num(U.frei_stunden_2026)} Überstunden im Monat bis ${DE.eur(U.frei_max_2026)} lohnsteuerfrei. Zehn Überstunden bringen in diesem Beispiel ${DE.eur(ue.bruttoMehr, 2)} brutto und ${DE.eur(ue.nettoMehr, 2)} netto zusätzlich.` },
    ],
    body: (h) => `
<h2>Die Umrechnung: mal Wochenstunden mal ${h.num(W, 2)}</h2>
<p>Ein Jahr hat 52 Wochen, verteilt auf zwölf Monate sind das im Schnitt ${h.num(W, 2)} Wochen pro Monat. Diesen Faktor verwendet die Lohnverrechnung in beide Richtungen: Aus einem Stundenlohn wird das Monatsbrutto, und aus einem Monatsgehalt wird der Stundensatz, etwa für Überstunden. Die Formel lautet:</p>
<p><strong>Monatsbrutto = Stundenlohn × Wochenstunden × ${h.num(W, 2)}</strong></p>
<p>Bei ${h.eur(20)} und 40 Stunden ergibt das ${h.eur(x.b, 2)}. Wer im Stundenlohn bezahlt wird, bekommt in kurzen Monaten etwas weniger und in langen etwas mehr, je nachdem, wie der Kollektivvertrag die Abrechnung regelt. Über das Jahr gleicht sich das aus. Bei Teilzeit gilt dieselbe Formel mit den vereinbarten Wochenstunden: ${h.eur(16)} und 20 Stunden ergeben ${h.eur(tz.b, 2)} brutto und ${h.eur(tz.k.nettoMonat, 2)} netto, weil bei diesem Betrag weder Lohnsteuer noch Arbeitslosenversicherung anfallen. Mehr dazu unter ${h.a('teilzeit', 'Teilzeit brutto netto')}. Für die Lohnsteuer sind kleine Schwankungen ohne Bedeutung; wer stark schwankende Monate hat, holt zu viel bezahlte Steuer über die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} zurück.</p>
<h2>Tabelle: Stundenlohn, Monatsnetto und Netto pro Stunde</h2>
${h.table(['Stundenlohn', 'Brutto 38,5 h', 'Netto 38,5 h', 'Brutto 40 h', 'Netto 40 h', 'Netto je Stunde (40 h)'], tab.map((z) => [h.eur(z.b.s, 2), h.eur(z.a.b, 2), h.eur(z.a.k.nettoMonat, 2), h.eur(z.b.b, 2), h.eur(z.b.k.nettoMonat, 2), h.eur(z.b.nettoStd, 2)]), `Laufender Monat 2026, Monatsbrutto = Stundenlohn × Wochenstunden × ${h.num(W, 2)}; außerhalb Wiens, ohne Kinder und Pendlerpauschale; Werte aus dem Rechner dieser Seite`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Tabelle rechnet mit 38,5 und 40 Wochenstunden, zwei in Kollektivverträgen verbreiteten Normalarbeitszeiten. Der Unterschied zwischen beiden ist bei gleichem Stundenlohn kleiner als die anderthalb Stunden vermuten lassen, weil die zusätzlichen Euro mit dem Grenzsteuersatz belastet werden. Wer nach Kollektivvertrag ein Monatsgehalt bekommt und seinen Stundenlohn wissen will, rechnet umgekehrt: Monatsgehalt geteilt durch Wochenstunden und durch ${h.num(W, 2)}.</p>
<!--mini:stundenlohn-->
<h2>Warum von höheren Stundenlöhnen prozentual weniger bleibt</h2>
<p>Bei ${h.eur(12)} Stundenlohn und 40 Stunden bleiben ${h.pct(lo.quote)} des Bruttos, bei ${h.eur(40)} nur ${h.pct(hi.quote)}. Drei Mechanismen wirken zusammen. Die Lohnsteuer folgt einem Stufentarif (${h.src('estg33', '§ 33 EStG')}): Kleine Monatsgehälter liegen ganz oder großteils in der steuerfreien Stufe, große in den Stufen mit ${h.pct(h.P.tarif.saetze[3])} und mehr. Die Arbeitslosenversicherung ist für kleine Einkommen herabgesetzt und erst über ${h.eur(h.P.sv.av_staffel[2][0])} brutto im Monat voll zu zahlen; bei ${h.eur(14)} und 38,5 Stunden liegt man noch darunter. Ganz oben dreht sich die Wirkung etwas, weil die Sozialversicherung ab ${h.eur(h.P.sv.hbg_monat)} nicht mehr wächst; bei ${h.eur(40)} Stundenlohn ist diese Grenze fast erreicht.</p>
<h3>Netto pro Stunde mit Sonderzahlungen</h3>
<p>Auch Beschäftigte mit Stundenlohn bekommen nach den meisten Kollektivverträgen Urlaubszuschuss und Weihnachtsremuneration. Weil beide mit nur ${h.pct(h.P.sonderzahlungen.stufen[1][1])} besteuert werden, ist eine Arbeitsstunde übers Jahr mehr wert als im einzelnen Monat: Bei ${h.eur(20)} und 40 Stunden sind es ${h.eur(x.nettoStd, 2)} im laufenden Monat, aber ${h.eur(x.nettoStdJahr, 2)}, wenn man das Jahresnetto durch alle bezahlten Stunden teilt. Wer zwei Angebote vergleicht, eines mit Stundenlohn ohne Sonderzahlungen und eines mit vierzehn Bezügen, sollte diesen Unterschied einrechnen; die Seite zum ${h.a('jahresgehalt', 'Jahresgehalt')} zeigt den Effekt in Euro.</p>
<h2>Kein gesetzlicher Mindestlohn, aber Kollektivverträge</h2>
<p>Österreich hat keinen allgemeinen gesetzlichen Mindestlohn. Die Untergrenzen ergeben sich aus den Kollektivverträgen, die für Branchen und Berufsgruppen ausgehandelt werden und fast alle Arbeitsverhältnisse erfassen. Sie unterscheiden nach Tätigkeit, Qualifikation und Berufsjahren und werden meist einmal im Jahr erhöht. Den für Sie gültigen Mindeststundenlohn finden Sie in der Lohntabelle Ihres Kollektivvertrags; dieser Rechner nimmt den Betrag, den Sie tatsächlich bekommen.</p>
<h2>Stundenlohn bei Minijob und Überstunden</h2>
<p>Bleibt das Monatsentgelt bei höchstens ${h.eur(GF, 2)}, ist die Beschäftigung geringfügig: keine Sozialversicherung für Sie, netto gleich brutto (${h.src('oegkWerte', 'ÖGK, veränderliche Werte 2026')}). Wie viele Stunden das zulässt, hängt vom Stundenlohn ab:</p>
${h.table(['Stundenlohn', 'höchstens Stunden pro Woche', 'höchstens Stunden pro Monat'], gfStunden.map((g) => [h.eur(g.s, 2), h.num(g.h, 1), h.num(g.h * W, 1)]), `Geringfügigkeitsgrenze ${h.eur(GF, 2)} im Monat 2026, Sonderzahlungen nicht eingerechnet`, ['l', 'r', 'r'])}
<p>Was bei Überschreiten passiert und was neben einer Hauptbeschäftigung gilt, erklärt die Seite ${h.a('geringfuegig', 'Geringfügige Beschäftigung')}. Für Überstunden ist der Normallohn je Stunde die Grundlage des Zuschlags von ${h.pct(U.zuschlag_gesetzlich)} (${h.src('azg10', '§ 10 Abs. 3 AZG')}). Bei ${h.eur(20)} Stundenlohn bringen zehn Überstunden im Monat ${h.eur(ue.bruttoMehr, 2)} brutto, davon sind ${h.eur(ue.steuerfreierZuschlag, 2)} Zuschlag lohnsteuerfrei (${h.src('estg68', '§ 68 EStG')}); netto kommen ${h.eur(ue.nettoMehr, 2)} dazu. Den eigenen Fall rechnet der ${h.a('ueberstunden', 'Überstundenrechner')} durch.</p>
`,
  },
  en: {
    slug: 'hourly-wage-gross-net',
    nav: 'Hourly wage gross to net',
    card: 'From hourly rate to monthly net with the 4.33 factor, a table for 12 to 40 euros and your net pay per hour.',
    title: 'Hourly Wage Austria 2026: Gross to Net per Month and Hour',
    description: `Hourly wage in Austria 2026: multiply by weekly hours and ${EN.num(W, 2)} for monthly gross. At ${EN.eur(20)} and 40 hours you keep ${EN.eur(x.k.nettoMonat)} net. Table for 38.5 and 40 hours.`,
    h1: 'Hourly wage in Austria: from gross per hour to monthly net',
    intro: 'How an hourly rate becomes a monthly salary on an Austrian payslip, what you keep after deductions, and what one working hour is really worth.',
    resume: `To turn an hourly wage into Austrian monthly gross pay, multiply it by your weekly hours and by ${EN.num(W, 2)}, the average number of weeks in a month. At ${EN.eur(20)} gross and 40 hours a week that makes ${EN.eur(x.b, 2)} a month and ${EN.eur(x.k.nettoMonat, 2)} net, or ${EN.eur(x.nettoStd, 2)} per hour. Most collective agreements also give hourly-paid staff holiday pay and Christmas pay; counting those, each hour is worth ${EN.eur(x.nettoStdJahr, 2)} net over the year. Lower rates keep a larger share: ${EN.pct(lo.quote)} of gross at ${EN.eur(12)}, only ${EN.pct(hi.quote)} at ${EN.eur(40)}, because wage tax and unemployment insurance rise with income. Austria has no general statutory minimum wage; minimum rates are set by sector collective agreements (Kollektivverträge). If you earn no more than ${EN.eur(GF, 2)} a month, you are a marginal employee and keep the full hourly wage without deductions. Overtime is paid at the normal hourly rate plus a ${EN.pct(U.zuschlag_gesetzlich)} premium.`,
    faqs: [
      { q: 'How do I convert an Austrian hourly wage into a monthly salary?', a: `Hourly wage times weekly hours times ${EN.num(W, 2)}. The factor is 52 weeks divided by twelve months, and payroll uses it the other way round to work out an hourly rate from a monthly salary. ${EN.eur(16)} at 38.5 hours gives ${EN.eur(16 * 38.5 * W, 2)} gross a month. Some collective agreements use their own divisor, which can shift the result by a few euros.` },
      { q: 'What is 20 euros an hour in net pay in Austria?', a: `At 40 hours a week, ${EN.eur(x.k.nettoMonat, 2)} net a month from ${EN.eur(x.b, 2)} gross; at 38.5 hours, ${EN.eur(tab[4].a.k.nettoMonat, 2)}. That is about ${EN.eur(x.nettoStd, 2)} per hour. With both special payments the annual net comes to ${EN.eur(x.k.nettoJahr)}. The figures assume a job outside Vienna, no children and no commuter allowance, and come from this site’s calculator.` },
      { q: 'Is there a statutory minimum hourly wage in Austria?', a: `No. Austria has no general statutory minimum wage. Minimum pay is set by collective agreements, which cover the vast majority of jobs and differ by sector, role and experience. The rate that applies to you is in the pay table of your collective agreement. Your employer may not pay less, even with your consent, but may always pay more. Ask your employer or the Chamber of Labour which agreement covers your job.` },
      { q: 'How many hours can I work on an hourly wage and stay a marginal employee?', a: `As many as keep your monthly pay at or below ${EN.eur(GF, 2)}. At ${EN.eur(14)} an hour that is about ${EN.num(gfStunden[1].h, 1)} hours a week, at ${EN.eur(20)} about ${EN.num(gfStunden[3].h, 1)}. What counts is actual pay in each month, not an average, and special payments are left out. One busy month can cross the limit and trigger full social insurance for that month.` },
      { q: 'What hourly rate is overtime paid at in Austria?', a: `The normal hourly wage plus a ${EN.pct(U.zuschlag_gesetzlich)} premium (section 10 of the Working Time Act), unless time off in lieu is agreed. At ${EN.eur(20)} that is ${EN.eur(20 * (1 + U.zuschlag_gesetzlich))} per overtime hour. In 2026 the premiums for the first ${EN.num(U.frei_stunden_2026)} overtime hours a month are free of wage tax up to ${EN.eur(U.frei_max_2026)}. Ten overtime hours here add ${EN.eur(ue.bruttoMehr, 2)} gross and ${EN.eur(ue.nettoMehr, 2)} net.` },
    ],
    body: (h) => `
<h2>The conversion: times weekly hours times ${h.num(W, 2)}</h2>
<p>A year has 52 weeks; spread over twelve months that is ${h.num(W, 2)} weeks a month on average. Austrian payroll uses this factor both ways: it turns an hourly wage into monthly gross, and a monthly salary into an hourly rate, for example to pay overtime. The formula:</p>
<p><strong>Monthly gross = hourly wage × weekly hours × ${h.num(W, 2)}</strong></p>
<p>At ${h.eur(20)} and 40 hours that gives ${h.eur(x.b, 2)}. If you are paid by the hour, short months may pay slightly less and long ones slightly more, depending on how your collective agreement handles it, but it evens out over the year. Wage tax is worked out each month as if that month’s pay continued all year, so strongly fluctuating months can mean overpaid tax, which you recover through the ${h.a('arbeitnehmerveranlagung', 'annual tax assessment')}.</p>
<h2>Table: hourly wage, monthly net and net per hour</h2>
${h.table(['Hourly wage', 'Gross 38.5 h', 'Net 38.5 h', 'Gross 40 h', 'Net 40 h', 'Net per hour (40 h)'], tab.map((z) => [h.eur(z.b.s, 2), h.eur(z.a.b, 2), h.eur(z.a.k.nettoMonat, 2), h.eur(z.b.b, 2), h.eur(z.b.k.nettoMonat, 2), h.eur(z.b.nettoStd, 2)]), `Regular month 2026, monthly gross = hourly wage × weekly hours × ${h.num(W, 2)}; outside Vienna, no children, no commuter allowance; figures from this site’s engine`, ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The table uses 38.5 and 40 hours, two normal working weeks common in Austrian collective agreements. The gap between them is smaller than the extra hour and a half suggests, because each additional euro is taxed at your marginal rate. If you receive a monthly salary and want your hourly equivalent, reverse the formula: monthly salary divided by weekly hours and by ${h.num(W, 2)}. That is useful when comparing an Austrian offer with an hourly rate quoted in the UK or the US, where annual hours and holiday entitlements differ.</p>
<!--mini:stundenlohn-->
<h2>Why higher hourly rates keep a smaller share</h2>
<p>At ${h.eur(12)} an hour and 40 hours you keep ${h.pct(lo.quote)} of gross, at ${h.eur(40)} only ${h.pct(hi.quote)}. Three things drive this. Wage tax follows a stepped scale (${h.src('estg33', 'section 33 of the Income Tax Act')}): small monthly salaries sit mostly in the tax-free band, large ones reach ${h.pct(h.P.tarif.saetze[3])} and more. Unemployment insurance is reduced for low incomes and only charged in full above ${h.eur(h.P.sv.av_staffel[2][0])} gross a month; at ${h.eur(14)} and 38.5 hours you are still below that. At the very top the effect eases slightly, because social insurance stops growing at ${h.eur(h.P.sv.hbg_monat)} a month, a level ${h.eur(40)} an hour almost reaches.</p>
<h3>Net per hour including special payments</h3>
<p>Hourly-paid employees usually receive holiday pay and Christmas pay under their collective agreement too. Since both are taxed at only ${h.pct(h.P.sonderzahlungen.stufen[1][1])}, an hour is worth more over the year than in a single month: at ${h.eur(20)} and 40 hours, ${h.eur(x.nettoStd, 2)} in a regular month but ${h.eur(x.nettoStdJahr, 2)} when annual net is divided by all paid hours. When you compare an hourly offer without special payments with a fourteen-payment salary, factor this in; the ${h.a('jahresgehalt', 'annual salary page')} shows the effect in euros.</p>
<h2>No statutory minimum wage, but collective agreements</h2>
<p>Unlike Germany or the UK, Austria has no general minimum wage set by law. Minimum pay comes from collective agreements negotiated for each sector and occupation, and they cover almost all jobs. They distinguish by activity, qualification and years of experience and are usually raised once a year. Your minimum hourly rate is in the pay table of your agreement; this calculator simply takes what you are actually paid.</p>
<h2>Hourly pay in small jobs and overtime</h2>
<p>If monthly pay stays at or below ${h.eur(GF, 2)}, the job counts as marginal employment (geringfügige Beschäftigung): no social insurance deducted, net equals gross (${h.src('oegkWerte', 'ÖGK variable values 2026')}). How many hours that allows depends on the rate:</p>
${h.table(['Hourly wage', 'max. hours per week', 'max. hours per month'], gfStunden.map((g) => [h.eur(g.s, 2), h.num(g.h, 1), h.num(g.h * W, 1)]), `Marginal-employment limit ${h.eur(GF, 2)} a month in 2026, special payments not counted`, ['l', 'r', 'r'])}
<p>What happens above the limit and alongside a main job is explained under ${h.a('geringfuegig', 'marginal employment')}. For overtime, the normal hourly wage is the base for the ${h.pct(U.zuschlag_gesetzlich)} premium (${h.src('azg10', 'section 10(3) of the Working Time Act')}). At ${h.eur(20)} an hour, ten overtime hours in a month add ${h.eur(ue.bruttoMehr, 2)} gross, of which ${h.eur(ue.steuerfreierZuschlag, 2)} of premium is free of wage tax (${h.src('estg68', 'section 68')}); net you gain ${h.eur(ue.nettoMehr, 2)}. The ${h.a('ueberstunden', 'overtime calculator')} handles your own case.</p>
`,
  },
});
