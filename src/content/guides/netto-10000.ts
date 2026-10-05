import { defineGuide } from '../../lib/guide-types';
import { kurz, dienstgeberkosten } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const B = 10000;
const k = kurz(B);
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const S = P.sonderzahlungen, s48 = P.tarif.saetze[4], s50 = P.tarif.saetze[5], sSz = S.stufen[1][1];
const G50 = P.tarif.grenzen[4];
/** Erstes volles Monatsbrutto mit 50 % Grenzsteuersatz (Motor). */
let ab50 = B - 1000;
while (lohnsteuerLaufend(ab50 - svLaufend(ab50).summe).grenzsteuersatz < s50) ab50++;
const k50 = kurz(ab50), luft50 = G50 - lst.bemessungJahr;
/** Sonderzahlungen: Bemessungsgrundlage nach SV, Platz bis zur 27-%-Stufe (Freibetrag + 6-%-Band). */
const uzNetto = k.uz.sz - k.uz.svSz - k.uz.lstSzFest, wrNetto = k.wr.sz - k.wr.svSz - k.wr.lstSzFest;
const szBasis = k.uz.sz + k.wr.sz - k.uz.svSz - k.wr.svSz;
const band6 = S.stufen[0][0] + S.stufen[1][0], luft27 = band6 - szBasis;
const szSteuer = k.uz.lstSzFest + k.wr.lstSzFest;
const szQuote = szSteuer / (k.uz.sz + k.wr.sz), lfdQuote = lst.lst / B;
/** Dienstgeberkosten, Beispiel Wien. */
const dg = dienstgeberkosten(B, 'wien');

export default defineGuide({
  id: 'netto-10000',
  group: 'betrag',
  order: 100,
  mini: 'nettoMonat',
  miniDefaults: { b: B },
  related: ['netto-7000', 'dienstgeberkosten', 'sonderzahlungen', 'hoechstbeitragsgrundlage', 'lohnsteuer'],
  sources: ['estg33', 'estg67', 'oegkWerte', 'wkoDb', 'bmfRechner'],
  de: {
    slug: '10000-euro-brutto-netto',
    nav: '10.000 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: 48 % Grenzsteuersatz, knapp unter der 50-%-Stufe, Sonderzahlungen mit ${DE.pct(sSz)}.`,
    title: '10000 Euro brutto in netto 2026: an der Grenze zu 50 %',
    description: `10000 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat, 48 % Grenzsteuersatz knapp vor der 50-%-Stufe und ${DE.eur(dg.jahr)} Kosten für den Dienstgeber.`,
    h1: '10.000 Euro brutto: Netto am oberen Ende der Skala',
    intro: 'Bei diesem Gehalt liegen der höchste übliche Lohnsteuersatz und der niedrige Satz der Sonderzahlungen so weit auseinander wie sonst nirgends.',
    resume: `Von ${DE.eur(B)} brutto bleiben 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat. Die Sozialversicherung ist bei ${DE.eur(sv.summe, 2)} gedeckelt, weil nur ${DE.eur(P.sv.hbg_monat)} beitragspflichtig sind, die Lohnsteuer beträgt ${DE.eur(lst.lst, 2)}. Die hochgerechnete Bemessungsgrundlage von ${DE.eur(lst.bemessungJahr)} liegt in der 48-Prozent-Stufe und nur ${DE.eur(luft50, 2)} unter der Grenze von ${DE.eur(G50)}, ab der 50 Prozent gelten. Laut Rechner beginnt die 50-Prozent-Stufe ab etwa ${DE.eur(ab50)} brutto im Monat; ${DE.eur(B)} sind also gerade noch darunter, der Unterschied macht aber nur Cent aus. Ganz anders die Sonderzahlungen: Urlaubszuschuss und Weihnachtsremuneration werden innerhalb des Jahressechstels mit ${DE.pct(sSz)} besteuert, zusammen ${DE.eur(szSteuer, 2)} Lohnsteuer auf ${DE.eur(2 * B)}. Netto bringen sie ${DE.eur(uzNetto, 2)} und ${DE.eur(wrNetto, 2)}. Im Jahr bleiben ${DE.eur(k.nettoJahr)} von ${DE.eur(k.bruttoJahr)} brutto. Den Dienstgeber kostet das Gehalt mit Beiträgen und Lohnnebenkosten rund ${DE.eur(dg.jahr)} im Jahr, ein Aufschlag von ${DE.pct(dg.aufschlag, 1)}.`,
    faqs: [
      { q: 'Zahlt man bei 10.000 Euro brutto schon 50 Prozent Lohnsteuer?', a: `Nein, knapp nicht. Die 50-Prozent-Stufe beginnt bei einem Jahreseinkommen über ${DE.eur(G50)} (§ 33 Abs. 1 EStG). Bei ${DE.eur(B)} brutto liegt die Bemessungsgrundlage ${DE.eur(luft50, 2)} darunter, laut Rechner beginnt die Stufe ab ${DE.eur(ab50)} brutto. Auch dann gilt der höhere Satz nur für den Teil darüber: Bei ${DE.eur(ab50)} bleiben ${DE.eur(k50.nettoMonat, 2)} netto. Die durchschnittliche Lohnsteuer beträgt bei ${DE.eur(B)} nur ${DE.pct(lfdQuote, 1)} des Bruttos.` },
      { q: 'Wie hoch ist bei 10.000 Euro brutto die Steuer auf das 13. und 14. Gehalt?', a: `Zusammen ${DE.eur(szSteuer, 2)}, das sind ${DE.pct(szQuote, 1)} der beiden Sonderzahlungen. Nach Abzug der Sozialversicherung bleiben ${DE.eur(szBasis)} Bemessungsgrundlage; davon sind ${DE.eur(S.freibetrag)} frei, der Rest wird mit ${DE.pct(sSz)} besteuert. Bis zur Stufe mit ${DE.pct(S.stufen[2][1])} wäre noch Platz für rund ${DE.eur(luft27)}. Das laufende Gehalt trägt im Vergleich ${DE.pct(lfdQuote, 1)} Lohnsteuer, am nächsten Euro ${DE.pct(s48)}.` },
      { q: 'Was kostet ein Gehalt von 10.000 Euro brutto den Dienstgeber?', a: `Am Beispiel Wien rund ${DE.eur(dg.jahr)} im Jahr bei vierzehn Bezügen, also ${DE.pct(dg.aufschlag, 1)} mehr als die ${DE.eur(dg.jahrBrutto)} brutto. Im Monat kommen ${DE.eur(dg.monat, 2)} dazu: ${DE.eur(dg.sv, 2)} Sozialversicherung, gedeckelt bei der Höchstbeitragsgrundlage, und ungedeckelt ${DE.eur(dg.db)} Dienstgeberbeitrag, ${DE.eur(dg.kommst)} Kommunalsteuer, ${DE.eur(dg.mv)} Mitarbeitervorsorge und ${DE.eur(dg.dz)} Zuschlag zum DB.` },
    ],
    body: (h) => `
<h2>Lohnzettel bei ${h.eur(B)} brutto</h2>
${h.table(['Position', 'Monatsgehalt', 'Urlaubszuschuss', 'Weihnachtsremuneration'], [
  ['Brutto', h.eur(B, 2), h.eur(k.uz.sz, 2), h.eur(k.wr.sz, 2)],
  ['Sozialversicherung', h.eur(sv.summe, 2), h.eur(k.uz.svSz, 2), h.eur(k.wr.svSz, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.eur(k.uz.lstSzFest, 2), h.eur(k.wr.lstSzFest, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.eur(uzNetto, 2), h.eur(wrNetto, 2)],
], 'Außerhalb Wiens, ohne Kinder; Sozialversicherung bei den Sonderzahlungen bis zur Jahresgrenze', ['l', 'r', 'r', 'r'])}
<h2>48 Prozent, die 50-Prozent-Stufe ab etwa ${h.eur(ab50)}</h2>
<p>Der Tarif (${h.src('estg33', '§ 33 Abs. 1 EStG')}) besteuert Einkommen zwischen ${h.eur(h.P.tarif.grenzen[3])} und ${h.eur(G50)} mit 48 Prozent, darüber bis zu einer Million mit 50 Prozent. Bei ${h.eur(B)} ergibt die Hochrechnung ${h.eur(lst.bemessungJahr)}: der Teil über ${h.eur(h.P.tarif.grenzen[3])} kostet 48 Prozent, zur nächsten Stufe fehlen ${h.eur(luft50, 2)}. Weil die Sozialversicherung gedeckelt ist, wächst die Bemessungsgrundlage ab hier mit jedem Euro brutto voll mit; daher liegt die Schwelle bei ziemlich genau ${h.eur(ab50)} brutto. Wer darüber verdient, behält von jedem weiteren Euro ${h.num((1 - s50) * 100)} Cent.</p>
<h2>Sonderzahlungen: ${h.pct(sSz)} statt ${h.pct(s48)}</h2>
<p>Urlaubszuschuss und Weihnachtsremuneration werden innerhalb des Jahressechstels nach ${h.src('estg67', '§ 67 Abs. 1 EStG')} besteuert: ${h.eur(S.freibetrag)} frei, dann ${h.pct(sSz)} bis zu einer Summe von ${h.eur(band6)}, darüber ${h.pct(S.stufen[2][1])}. Bei ${h.eur(B)} beträgt die Bemessungsgrundlage beider Zahlungen nach Sozialversicherung ${h.eur(szBasis)}, es bleibt also alles im ${h.pct(sSz)}-Band. Die Weihnachtsremuneration bringt sogar mehr als der Urlaubszuschuss, weil die Jahresgrenze der Sozialversicherung für Sonderzahlungen (${h.eur(h.P.sv.hbg_sz_jahr)}, ${h.src('oegkWerte', 'ÖGK')}) im November großteils verbraucht ist.</p>
${h.table(['', 'Laufendes Gehalt', 'Sonderzahlungen'], [
  ['Brutto im Jahr', h.eur(B * 12), h.eur(2 * B)],
  ['Lohnsteuer im Jahr', h.eur(lst.lst * 12, 2), h.eur(szSteuer, 2)],
  ['Durchschnittlicher Steuersatz', h.pct(lfdQuote, 1), h.pct(szQuote, 1)],
  ['Steuer auf den nächsten Euro', h.pct(s48), h.pct(sSz)],
], 'Werte aus dem Motor, Sonderzahlungen innerhalb des Jahressechstels', ['l', 'r', 'r'])}
<p>Daraus folgt, warum Prämien bei diesem Gehalt so viel kosten: Das Sechstel ist mit den beiden Sonderzahlungen ausgeschöpft, eine zusätzliche Prämie wird nach Tarif mit ${h.pct(s48)} oder ${h.pct(s50)} versteuert. Ausführlich im Ratgeber zu den ${h.a('sonderzahlungen', 'Sonderzahlungen')}.</p>
<h2>Was ${h.eur(B)} brutto den Dienstgeber kosten</h2>
<p>Zum Bruttogehalt zahlt der Betrieb Sozialversicherung bis zur ${h.a('hoechstbeitragsgrundlage', 'Höchstbeitragsgrundlage')} und mehrere Abgaben ohne Obergrenze: Dienstgeberbeitrag von ${h.pct(h.P.dienstgeber.db, 1)} (${h.src('wkoDb', 'WKO')}), Zuschlag je nach Bundesland, Kommunalsteuer von ${h.pct(h.P.dienstgeber.kommunalsteuer)} und ${h.pct(h.P.sv.dg.mv, 2)} für die Mitarbeitervorsorgekasse. Am Beispiel Wien:</p>
${h.table(['Position', 'Monat'], [
  ['Bruttogehalt', h.eur(B, 2)],
  ['Sozialversicherung Dienstgeber', h.eur(dg.sv, 2)],
  ['Dienstgeberbeitrag und Zuschlag', h.eur(dg.db + dg.dz, 2)],
  ['Kommunalsteuer', h.eur(dg.kommst, 2)],
  ['Mitarbeitervorsorge', h.eur(dg.mv, 2)],
  ['Kosten im Jahr (14 Bezüge)', h.eur(dg.jahr)],
], 'Dienstgeberkosten aus dem Motor, Arbeitsort Wien', ['l', 'r'])}
<p>Andere Bundesländer rechnet der ${h.a('dienstgeberkosten', 'Dienstgeberkosten-Rechner')}. Den eigenen Fall im ${h.a('home', 'Brutto-Netto-Rechner')}; eine Stufe tiefer: ${h.a('netto-7000', '7.000 Euro brutto')}, knapp über der Höchstbeitragsgrundlage.</p>
`,
  },
  en: {
    slug: '10000-euro-gross-to-net',
    nav: '€10,000 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: a 48% marginal rate just below the 50% band, special payments at ${EN.pct(sSz)}.`,
    title: '10000 Euro Gross to Net in Austria 2026: Close to 50% Tax',
    description: `10000 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month, a 48% marginal rate just short of the 50% tax band, and ${EN.eur(dg.jahr)} a year in total employer cost.`,
    h1: '10,000 euros gross: net pay at the top of the scale',
    intro: 'At this salary the top regular tax rate and the low rate on the 13th and 14th salary are further apart than anywhere else.',
    resume: `On ${EN.eur(B)} gross a month you take home ${EN.eur(k.nettoMonat, 2)} in Austria in 2026. Social insurance is capped at ${EN.eur(sv.summe, 2)}, since only ${EN.eur(P.sv.hbg_monat)} of pay is insured, and wage tax is ${EN.eur(lst.lst, 2)}. Your projected taxable base of ${EN.eur(lst.bemessungJahr)} sits in the 48 percent band, just ${EN.eur(luft50, 2)} short of the ${EN.eur(G50)} threshold where 50 percent begins. The calculator places that threshold at about ${EN.eur(ab50)} gross a month, so ${EN.eur(B)} stays just below it, although the difference is a matter of cents. Special payments tell a different story. Holiday pay and Christmas pay, the 13th and 14th salary, are taxed at ${EN.pct(sSz)} within the annual sixth: ${EN.eur(szSteuer, 2)} of wage tax on ${EN.eur(2 * B)}. They net ${EN.eur(uzNetto, 2)} and ${EN.eur(wrNetto, 2)}. Over the year you keep ${EN.eur(k.nettoJahr)} out of ${EN.eur(k.bruttoJahr)} gross. For your employer, contributions and payroll taxes bring the cost to roughly ${EN.eur(dg.jahr)} a year, ${EN.pct(dg.aufschlag, 1)} on top of gross pay.`,
    faqs: [
      { q: 'Is 10,000 euros gross already taxed at 50 percent?', a: `Not quite. The 50 percent band starts above ${EN.eur(G50)} of annual income (section 33(1) Income Tax Act). At ${EN.eur(B)} gross your taxable base is ${EN.eur(luft50, 2)} below that; the calculator puts the start at ${EN.eur(ab50)} gross. Even then only the slice above the line is taxed at the higher rate, and ${EN.eur(ab50)} nets ${EN.eur(k50.nettoMonat, 2)}. Your average wage tax at ${EN.eur(B)} is ${EN.pct(lfdQuote, 1)} of gross.` },
      { q: 'How much tax is due on the 13th and 14th salary at 10,000 euros gross?', a: `${EN.eur(szSteuer, 2)} in total, or ${EN.pct(szQuote, 1)} of the two payments. After social insurance the taxable amount is ${EN.eur(szBasis)}; the first ${EN.eur(S.freibetrag)} is free and the rest is taxed at ${EN.pct(sSz)}. There is still about ${EN.eur(luft27)} of room before the ${EN.pct(S.stufen[2][1])} band. Regular salary, by comparison, carries ${EN.pct(lfdQuote, 1)} on average and ${EN.pct(s48)} on the next euro.` },
      { q: 'What does a 10,000 euro gross salary cost the employer?', a: `For a Vienna workplace, about ${EN.eur(dg.jahr)} a year with fourteen salaries, ${EN.pct(dg.aufschlag, 1)} above the ${EN.eur(dg.jahrBrutto)} gross. Each month adds ${EN.eur(dg.monat, 2)}: ${EN.eur(dg.sv, 2)} employer social insurance, capped at the ceiling, plus uncapped levies of ${EN.eur(dg.db)} family fund contribution, ${EN.eur(dg.kommst)} municipal tax, ${EN.eur(dg.mv)} severance fund and ${EN.eur(dg.dz)} chamber surcharge.` },
    ],
    body: (h) => `
<h2>Payslip at ${h.eur(B)} gross</h2>
${h.table(['Item', 'Monthly salary', 'Holiday pay', 'Christmas pay'], [
  ['Gross', h.eur(B, 2), h.eur(k.uz.sz, 2), h.eur(k.wr.sz, 2)],
  ['Social insurance', h.eur(sv.summe, 2), h.eur(k.uz.svSz, 2), h.eur(k.wr.svSz, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.eur(k.uz.lstSzFest, 2), h.eur(k.wr.lstSzFest, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.eur(uzNetto, 2), h.eur(wrNetto, 2)],
], 'Outside Vienna, no children; social insurance on special payments up to the annual ceiling', ['l', 'r', 'r', 'r'])}
<h2>48 percent now, 50 percent from about ${h.eur(ab50)}</h2>
<p>The scale (${h.src('estg33', 'section 33(1) Income Tax Act')}) taxes income between ${h.eur(h.P.tarif.grenzen[3])} and ${h.eur(G50)} at 48 percent and above that, up to one million, at 50 percent. At ${h.eur(B)} the projection gives ${h.eur(lst.bemessungJahr)}, so the slice above ${h.eur(h.P.tarif.grenzen[3])} costs 48 percent and the next band is ${h.eur(luft50, 2)} away. With social insurance capped, every extra gross euro now raises taxable income one for one, which pins the threshold at almost exactly ${h.eur(ab50)}. Beyond it you keep ${h.num((1 - s50) * 100)} cents of each additional euro.</p>
<h2>Special payments: ${h.pct(sSz)} instead of ${h.pct(s48)}</h2>
<p>Within the annual sixth, holiday and Christmas pay are taxed under ${h.src('estg67', 'section 67(1)')}: ${h.eur(S.freibetrag)} free, then ${h.pct(sSz)} up to a total of ${h.eur(band6)}, then ${h.pct(S.stufen[2][1])}. At ${h.eur(B)} the taxable amount of both payments after social insurance is ${h.eur(szBasis)}, all of it in the ${h.pct(sSz)} band. Christmas pay even nets more than holiday pay, because the annual social insurance ceiling for special payments (${h.eur(h.P.sv.hbg_sz_jahr)}, ${h.src('oegkWerte', 'ÖGK')}) is largely used up by November.</p>
${h.table(['', 'Regular salary', 'Special payments'], [
  ['Gross per year', h.eur(B * 12), h.eur(2 * B)],
  ['Wage tax per year', h.eur(lst.lst * 12, 2), h.eur(szSteuer, 2)],
  ['Average tax rate', h.pct(lfdQuote, 1), h.pct(szQuote, 1)],
  ['Tax on the next euro', h.pct(s48), h.pct(sSz)],
], 'Engine figures, special payments within the annual sixth', ['l', 'r', 'r'])}
<p>This is also why bonuses are expensive here: the sixth is already filled by the two regular special payments, so any extra bonus is taxed on the scale at ${h.pct(s48)} or ${h.pct(s50)}. The ${h.a('sonderzahlungen', 'special payments guide')} has the details.</p>
<h2>What ${h.eur(B)} gross costs your employer</h2>
<p>On top of gross pay, the employer pays social insurance up to the ${h.a('hoechstbeitragsgrundlage', 'contribution ceiling')} and several uncapped levies: the family fund contribution (Dienstgeberbeitrag) of ${h.pct(h.P.dienstgeber.db, 1)} (${h.src('wkoDb', 'Chamber of Commerce')}), a regional surcharge, municipal tax of ${h.pct(h.P.dienstgeber.kommunalsteuer)} and ${h.pct(h.P.sv.dg.mv, 2)} for the severance fund (Mitarbeitervorsorgekasse). For a Vienna workplace:</p>
${h.table(['Item', 'Month'], [
  ['Gross salary', h.eur(B, 2)],
  ['Employer social insurance', h.eur(dg.sv, 2)],
  ['Family fund contribution and surcharge', h.eur(dg.db + dg.dz, 2)],
  ['Municipal tax', h.eur(dg.kommst, 2)],
  ['Severance fund', h.eur(dg.mv, 2)],
  ['Cost per year (14 salaries)', h.eur(dg.jahr)],
], 'Employer cost from the engine, workplace in Vienna', ['l', 'r'])}
<p>Other provinces are in the ${h.a('dienstgeberkosten', 'employer cost calculator')}. Your own case in the ${h.a('home', 'gross-to-net calculator')}; one step down is ${h.a('netto-7000', '7,000 euros gross')}, just above the contribution ceiling.</p>
`,
  },
});
