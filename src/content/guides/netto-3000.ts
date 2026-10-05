import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend, avSatz } from '../../lib/engine/lohn';
import { dienstgeberkosten } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const B = 3000;
const k = kurz(B), w = kurz(B, { wien: true }), k1 = kurz(B, { kinderU18: 1 }), kp = kurz(B, { pendler: 'klein', km: 25 });
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const uz = k.uz.sz - k.uz.svSz - k.uz.lstSzFest, wr = k.wr.sz - k.wr.svSz - k.wr.lstSzFest;
const dg = dienstgeberkosten(B, 'oberoesterreich');
const unter = kurz(P.sv.av_staffel[2][0]), drueber = kurz(P.sv.av_staffel[2][0] + 1);
const svr = sv.satz, grenz = svr + (1 - svr) * lst.grenzsteuersatz;

export default defineGuide({
  id: 'netto-3000',
  group: 'betrag',
  order: 40,
  mini: 'nettoMonat',
  miniDefaults: { b: B },
  related: ['netto-2500', 'netto-3500', 'sozialversicherung', 'lohnsteuer', 'pendlerpauschale'],
  sources: ['estg33', 'oegkAv', 'bmfRechner'],
  de: {
    slug: '3000-euro-brutto-netto',
    nav: '3.000 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: voller Arbeitslosenversicherungsbeitrag und 30 % Grenzsteuersatz.`,
    title: '3000 Euro brutto in netto 2026: Österreich, Monat und Jahr',
    description: `3000 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat, ${DE.eur(k.nettoJahr)} im Jahr mit 13. und 14. Gehalt, dazu Wien, Kind und Pendler im direkten Vergleich.`,
    h1: '3.000 Euro brutto: so viel bleibt 2026 netto',
    intro: 'Das Monatsnetto, beide Sonderzahlungen und was Kinder, Wien oder ein langer Arbeitsweg bei diesem Gehalt ändern.',
    resume: `Bei ${DE.eur(B)} brutto bleiben 2026 außerhalb Wiens ${DE.eur(k.nettoMonat, 2)} netto im Monat. Die Sozialversicherung kostet ${DE.eur(sv.summe, 2)}, die Lohnsteuer ${DE.eur(lst.lst, 2)}. Damit liegt dieses Gehalt knapp über der Grenze von ${DE.eur(P.sv.av_staffel[2][0])}, ab der der volle Arbeitslosenversicherungsbeitrag von ${DE.pct(P.sv.dn.av, 2)} fällig wird; wer etwas weniger verdient, zahlt hier nur ${DE.pct(P.sv.av_staffel[2][1])}. Steuerlich bewegt sich der Teil über ${DE.eur(P.tarif.grenzen[1])} Jahreseinkommen in der 30-Prozent-Stufe, das ist der Grenzsteuersatz für jeden zusätzlichen Euro. Der Urlaubszuschuss bringt ${DE.eur(uz, 2)} netto, die Weihnachtsremuneration ${DE.eur(wr, 2)}, weil der Freibetrag von ${DE.eur(P.sonderzahlungen.freibetrag)} nur beim ersten Mal wirkt. Aufs Jahr gerechnet stehen ${DE.eur(k.nettoJahr)} netto ${DE.eur(k.bruttoJahr)} brutto gegenüber. In Wien sind es wegen des höheren Wohnbauförderungsbeitrags ${DE.eur(k.nettoJahr - w.nettoJahr, 2)} weniger im Jahr, mit einem Kind unter 18 dagegen ${DE.eur(k1.nettoJahr - k.nettoJahr)} mehr.`,
    faqs: [
      { q: 'Wie viel ist 3.000 Euro brutto netto mit einem Kind?', a: `Mit einem Kind unter 18 und vollem Familienbonus Plus sind es ${DE.eur(k1.nettoMonat, 2)} netto im Monat statt ${DE.eur(k.nettoMonat, 2)}. Der Bonus von ${DE.eur(P.absetzbetraege.familienbonus_monat_u18, 2)} im Monat wirkt bei diesem Gehalt vollständig, weil die Lohnsteuer höher ist. Teilen Sie ihn mit dem anderen Elternteil, bekommt jeder die Hälfte; dazu kommt die Familienbeihilfe mit dem Kinderabsetzbetrag, die nicht über den Lohnzettel läuft.` },
      { q: 'Was bringt das Pendlerpauschale bei 3.000 Euro brutto?', a: `Bei 25 Kilometern und zumutbaren Öffis gibt es das kleine Pendlerpauschale von ${DE.eur(P.pendlerpauschale.klein[0][2])} im Jahr und ${DE.eur(25 * P.absetzbetraege.pendlereuro_je_km)} Pendlereuro. Das Monatsnetto steigt dadurch auf ${DE.eur(kp.nettoMonat, 2)}, also um ${DE.eur(kp.nettoMonat - k.nettoMonat, 2)}. Voraussetzung sind mindestens elf Fahrten im Monat und der Antrag mit dem Formular aus dem Pendlerrechner.` },
      { q: 'Lohnt sich bei 3.000 Euro eine kleine Gehaltserhöhung?', a: `Ja, aber jeder zusätzliche Euro kostet rund ${DE.pct(P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av + P.sv.dn.ak + P.sv.dn.wf, 1)} Sozialversicherung und vom Rest 30 Prozent Lohnsteuer, insgesamt also etwa ${DE.num(grenz * 100)} Cent. Von ${DE.eur(100)} brutto mehr bleiben rund ${DE.eur(100 * (1 - grenz))} netto. Unter ${DE.eur(P.sv.av_staffel[2][0])} war der Sprung über die Staffel der Arbeitslosenversicherung spürbar: Bei ${DE.eur(P.sv.av_staffel[2][0])} beträgt das Netto ${DE.eur(unter.nettoMonat, 2)}.` },
    ],
    body: (h) => `
<h2>Der Lohnzettel bei ${h.eur(B)} brutto</h2>
${h.table(['Position', 'Monat', 'Jahr'], [
  ['Bruttobezug', h.eur(B, 2), h.eur(B * 12)],
  [`Krankenversicherung ${h.pct(h.P.sv.dn.kv, 2)}`, h.eur(sv.kv, 2), h.eur(sv.kv * 12, 2)],
  [`Pensionsversicherung ${h.pct(h.P.sv.dn.pv, 2)}`, h.eur(sv.pv, 2), h.eur(sv.pv * 12, 2)],
  [`Arbeitslosenversicherung ${h.pct(avSatz(B), 2)}`, h.eur(sv.av, 2), h.eur(sv.av * 12, 2)],
  ['AK-Umlage und Wohnbauförderung', h.eur(sv.ak + sv.wf, 2), h.eur((sv.ak + sv.wf) * 12, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.eur(lst.lst * 12, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.eur(k.nettoMonat * 12, 2)],
], 'Laufender Bezug, außerhalb Wiens, ohne Kinder und Pendlerpauschale', ['l', 'r', 'r'])}
<h2>Die Grenze bei ${h.eur(h.P.sv.av_staffel[2][0])}: voller Beitrag zur Arbeitslosenversicherung</h2>
<p>Seit Jänner 2026 zahlen Beschäftigte mit kleinem Einkommen weniger Arbeitslosenversicherung: nichts bis ${h.eur(h.P.sv.av_staffel[0][0])}, ${h.pct(h.P.sv.av_staffel[1][1])} bis ${h.eur(h.P.sv.av_staffel[1][0])}, ${h.pct(h.P.sv.av_staffel[2][1])} bis ${h.eur(h.P.sv.av_staffel[2][0])} (${h.src('oegkAv', 'ÖGK')}). ${h.eur(B)} liegen darüber, deshalb gilt hier der volle Satz von ${h.pct(h.P.sv.dn.av, 2)}. Die Staffel ist kein gleitender Übergang: Wer von ${h.eur(h.P.sv.av_staffel[2][0])} auf ${h.eur(h.P.sv.av_staffel[2][0] + 1)} kommt, zahlt plötzlich ${h.pct(h.P.sv.dn.av - h.P.sv.av_staffel[2][1], 2)} mehr auf das ganze Gehalt. Bei ${h.eur(h.P.sv.av_staffel[2][0])} brutto bleiben ${h.eur(unter.nettoMonat, 2)}, bei einem Euro mehr nur ${h.eur(drueber.nettoMonat, 2)}. Bei ${h.eur(B)} ist dieser Sprung längst ausgeglichen.</p>
<h2>Die 30-Prozent-Stufe</h2>
<p>Auf das Jahr gerechnet ergibt ${h.eur(B)} brutto eine Bemessungsgrundlage von ${h.eur(lst.bemessungJahr)}. Der Teil über ${h.eur(h.P.tarif.grenzen[1])} wird mit 30 Prozent besteuert (${h.src('estg33', '§ 33 Abs. 1 EStG')}), der Grenzsteuersatz beträgt also ${h.pct(lst.grenzsteuersatz)}. Bis zur 40-Prozent-Stufe ab ${h.eur(h.P.tarif.grenzen[2])} fehlen noch gut ${h.eur(h.P.tarif.grenzen[2] - lst.bemessungJahr)} im Jahr. Für Absetzbeträge heißt das: Familienbonus, Alleinverdienerabsetzbetrag und Pendlereuro wirken bei diesem Gehalt in voller Höhe, weil genug Lohnsteuer da ist.</p>
<h2>Gleiches Gehalt, andere Lebenslage</h2>
${h.table(['Situation', 'Netto im Monat', 'Netto im Jahr'], [
  ['ohne Kinder, außerhalb Wiens', h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr)],
  ['Arbeitsort Wien', h.eur(w.nettoMonat, 2), h.eur(w.nettoJahr)],
  ['ein Kind unter 18, voller Familienbonus', h.eur(k1.nettoMonat, 2), h.eur(k1.nettoJahr)],
  ['25 km Arbeitsweg, kleines Pendlerpauschale', h.eur(kp.nettoMonat, 2), h.eur(kp.nettoJahr)],
], 'Werte aus dem Rechner dieser Seite, geprüft gegen den BMF-Rechner', ['l', 'r', 'r'])}
<h2>Was dieses Gehalt den Arbeitgeber kostet</h2>
<p>Für ${h.eur(B)} brutto zahlt ein Betrieb in Oberösterreich zusätzlich ${h.eur(dg.monat, 2)} im Monat: den Dienstgeberanteil zur Sozialversicherung, ${h.pct(h.P.sv.dg.mv, 2)} für die Mitarbeitervorsorgekasse, ${h.pct(h.P.dienstgeber.db, 1)} Dienstgeberbeitrag, den Zuschlag dazu und ${h.pct(h.P.dienstgeber.kommunalsteuer, 0)} Kommunalsteuer. Über das Jahr mit beiden Sonderzahlungen sind das ${h.eur(dg.jahr)} Gesamtkosten für ${h.eur(k.bruttoJahr)} brutto. Von jedem Euro, den der Betrieb für diese Stelle ausgibt, kommen also rund ${h.num(k.nettoJahr / dg.jahr * 100)} Cent als Netto auf Ihrem Konto an. Wer verhandelt, sollte beide Zahlen kennen: Eine Erhöhung um ${h.eur(100)} brutto kostet den Betrieb mehr als ${h.eur(100)}, bringt Ihnen aber deutlich weniger. Die Einzelheiten zeigt der ${h.a('dienstgeberkosten', 'Dienstgeberkosten-Rechner')}.</p>
<p>Den eigenen Fall rechnen Sie im ${h.a('home', 'Brutto-Netto-Rechner')} durch. Die Nachbarbeträge: ${h.a('netto-2500', '2.500 Euro brutto')} liegen unter der vollen Arbeitslosenversicherung, ${h.a('netto-3500', '3.500 Euro brutto')} bereits nahe an der 40-Prozent-Stufe.</p>
`,
  },
  en: {
    slug: '3000-euro-gross-to-net',
    nav: '€3,000 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: full unemployment contribution and a 30% marginal rate.`,
    title: '3000 Euro Gross to Net in Austria 2026: Monthly and Yearly',
    description: `3000 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month and ${EN.eur(k.nettoJahr)} a year with the 13th and 14th salary, plus Vienna, child and commuter examples shown.`,
    h1: '3,000 euros gross: your 2026 net pay in Austria',
    intro: 'Monthly take-home, both special payments, and what children, a Vienna workplace or a long commute change at this salary.',
    resume: `On ${EN.eur(B)} gross a month, an employee outside Vienna takes home ${EN.eur(k.nettoMonat, 2)} in 2026. Social insurance costs ${EN.eur(sv.summe, 2)} and wage tax ${EN.eur(lst.lst, 2)}. This salary sits just above the ${EN.eur(P.sv.av_staffel[2][0])} line where the full unemployment insurance contribution of ${EN.pct(P.sv.dn.av, 2)} starts; earn a little less and you pay only ${EN.pct(P.sv.av_staffel[2][1])}. For tax, the part of annual income above ${EN.eur(P.tarif.grenzen[1])} falls in the 30 percent band, which is the rate on every extra euro you earn. Holiday pay leaves ${EN.eur(uz, 2)} net and Christmas pay ${EN.eur(wr, 2)}, because the ${EN.eur(P.sonderzahlungen.freibetrag)} allowance only applies to the first one. Over the year that is ${EN.eur(k.nettoJahr)} net against ${EN.eur(k.bruttoJahr)} gross. Working in Vienna costs ${EN.eur(k.nettoJahr - w.nettoJahr, 2)} a year more because of its higher housing contribution, while one child under 18 adds ${EN.eur(k1.nettoJahr - k.nettoJahr)}.`,
    faqs: [
      { q: 'What is 3,000 euros gross in net pay with one child?', a: `With one child under 18 and the full Familienbonus Plus, take-home pay is ${EN.eur(k1.nettoMonat, 2)} a month instead of ${EN.eur(k.nettoMonat, 2)}. The credit of ${EN.eur(P.absetzbetraege.familienbonus_monat_u18, 2)} a month is fully usable at this salary because the wage tax is higher. If you split it with the other parent, each gets half; family allowance and the child tax credit come on top and are paid outside payroll.` },
      { q: 'What does the commuter allowance add at 3,000 euros gross?', a: `With a 25 km commute and reasonable public transport you get the small commuter allowance of ${EN.eur(P.pendlerpauschale.klein[0][2])} a year plus ${EN.eur(25 * P.absetzbetraege.pendlereuro_je_km)} commuter euro. Monthly take-home rises to ${EN.eur(kp.nettoMonat, 2)}, up ${EN.eur(kp.nettoMonat - k.nettoMonat, 2)}. You need at least eleven trips a month and must hand in the form from the official Pendlerrechner.` },
      { q: 'How much of a small raise do I keep at 3,000 euros?', a: `Each extra euro costs about ${EN.pct(P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av + P.sv.dn.ak + P.sv.dn.wf, 1)} in social insurance and 30 percent tax on the rest, roughly ${EN.num(grenz * 100)} cents in total, so ${EN.eur(100)} more gross leave about ${EN.eur(100 * (1 - grenz))} net. Below ${EN.eur(P.sv.av_staffel[2][0])} the step in the unemployment insurance scale bites harder: at ${EN.eur(P.sv.av_staffel[2][0])} gross the net is ${EN.eur(unter.nettoMonat, 2)}.` },
    ],
    body: (h) => `
<h2>The payslip at ${h.eur(B)} gross</h2>
${h.table(['Item', 'Month', 'Year'], [
  ['Gross pay', h.eur(B, 2), h.eur(B * 12)],
  [`Health insurance ${h.pct(h.P.sv.dn.kv, 2)}`, h.eur(sv.kv, 2), h.eur(sv.kv * 12, 2)],
  [`Pension insurance ${h.pct(h.P.sv.dn.pv, 2)}`, h.eur(sv.pv, 2), h.eur(sv.pv * 12, 2)],
  [`Unemployment insurance ${h.pct(avSatz(B), 2)}`, h.eur(sv.av, 2), h.eur(sv.av * 12, 2)],
  ['Chamber levy and housing subsidy', h.eur(sv.ak + sv.wf, 2), h.eur((sv.ak + sv.wf) * 12, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.eur(lst.lst * 12, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.eur(k.nettoMonat * 12, 2)],
], 'Regular pay, outside Vienna, no children, no commuter allowance', ['l', 'r', 'r'])}
<h2>The ${h.eur(h.P.sv.av_staffel[2][0])} line: full unemployment contribution</h2>
<p>Since January 2026, low earners pay less unemployment insurance: nothing up to ${h.eur(h.P.sv.av_staffel[0][0])}, ${h.pct(h.P.sv.av_staffel[1][1])} up to ${h.eur(h.P.sv.av_staffel[1][0])}, ${h.pct(h.P.sv.av_staffel[2][1])} up to ${h.eur(h.P.sv.av_staffel[2][0])} (${h.src('oegkAv', 'ÖGK')}). ${h.eur(B)} is above that, so the full ${h.pct(h.P.sv.dn.av, 2)} applies. The scale is a step, not a slope: going from ${h.eur(h.P.sv.av_staffel[2][0])} to ${h.eur(h.P.sv.av_staffel[2][0] + 1)} adds ${h.pct(h.P.sv.dn.av - h.P.sv.av_staffel[2][1], 2)} on the whole salary. At ${h.eur(h.P.sv.av_staffel[2][0])} gross you keep ${h.eur(unter.nettoMonat, 2)}, one euro more leaves only ${h.eur(drueber.nettoMonat, 2)}. At ${h.eur(B)} that dip is long made up.</p>
<h2>The 30 percent band</h2>
<p>Scaled to a year, ${h.eur(B)} gross gives a taxable base of ${h.eur(lst.bemessungJahr)}. The part above ${h.eur(h.P.tarif.grenzen[1])} is taxed at 30 percent (${h.src('estg33', 'section 33(1)')}), so your marginal rate is ${h.pct(lst.grenzsteuersatz)}. The 40 percent band starts at ${h.eur(h.P.tarif.grenzen[2])}, still ${h.eur(h.P.tarif.grenzen[2] - lst.bemessungJahr)} a year away. For credits this means Familienbonus Plus, the sole earner credit and the commuter euro all work in full at this salary, because there is enough wage tax to absorb them.</p>
<h2>Same salary, different situations</h2>
${h.table(['Situation', 'Net per month', 'Net per year'], [
  ['no children, outside Vienna', h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr)],
  ['workplace in Vienna', h.eur(w.nettoMonat, 2), h.eur(w.nettoJahr)],
  ['one child under 18, full Familienbonus', h.eur(k1.nettoMonat, 2), h.eur(k1.nettoJahr)],
  ['25 km commute, small allowance', h.eur(kp.nettoMonat, 2), h.eur(kp.nettoJahr)],
], 'Figures from this site’s calculator, tested against the BMF calculator', ['l', 'r', 'r'])}
<h2>What this salary costs the employer</h2>
<p>For ${h.eur(B)} gross, an employer in Upper Austria pays an extra ${h.eur(dg.monat, 2)} a month: its share of social insurance, ${h.pct(h.P.sv.dg.mv, 2)} into the severance fund, the ${h.pct(h.P.dienstgeber.db, 1)} family-fund contribution, the state surcharge on top of it and ${h.pct(h.P.dienstgeber.kommunalsteuer, 0)} municipal tax. Over a year with both special payments, the job costs ${h.eur(dg.jahr)} for ${h.eur(k.bruttoJahr)} gross. Out of every euro the company spends on the position, roughly ${h.num(k.nettoJahr / dg.jahr * 100)} cents reach your account as net pay. Worth knowing in a salary talk: a raise of ${h.eur(100)} gross costs the company more than ${h.eur(100)} and leaves you a good deal less. The ${h.a('dienstgeberkosten', 'employer cost calculator')} has the detail.</p>
<p>Run your own case in the ${h.a('home', 'gross-to-net calculator')}. Neighbouring amounts: ${h.a('netto-2500', '2,500 euros gross')} sits below the full unemployment rate, ${h.a('netto-3500', '3,500 euros gross')} is already close to the 40 percent band.</p>
`,
  },
});
