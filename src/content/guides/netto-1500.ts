import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend, tarif } from '../../lib/engine/lohn';
import { lstFreiBis } from '../../lib/pruefung';
import { P, DE, EN } from '../../lib/fmt';

const B = 1500;
const k = kurz(B), k1 = kurz(B, { kinderU18: 1 });
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const a = P.absetzbetraege, S = P.sonderzahlungen;
/** Höchstes Brutto ohne laufende Lohnsteuer (Motor, 10-€-Schritte) und der erste Betrag darüber. */
const frei = lstFreiBis(), ueberFrei = kurz(frei + 10);
/** Sonderzahlungen netto und ihre feste Lohnsteuer. */
const uzNetto = k.uz.sz - k.uz.svSz - k.uz.lstSzFest, wrNetto = k.wr.sz - k.wr.svSz - k.wr.lstSzFest;
const szSteuer = k.uz.lstSzFest + k.wr.lstSzFest;
/** Bei 14 gleichen Bezügen ist das Sechstel zwei Monatsbezüge: Freigrenze ÷ 2 = höchstes Brutto ohne Steuer auf Sonderzahlungen. */
const fg = S.freigrenze_sechstel / 2;
const fgU = kurz(Math.floor(fg)), fgO = kurz(Math.ceil(fg));
/** Tarifsteuer vor Absetzbeträgen (Grundlage für Kindermehrbetrag und SV-Rückerstattung). */
const est = tarif(lst.bemessungJahr);
const kmb = Math.max(0, a.kindermehrbetrag - est);
/** Veranlagung: Verkehrsabsetzbetrag mit Zuschlag (Einkommen unter der Zuschlagsgrenze), Gutschrift begrenzt auf 55 % der laufenden SV und den Höchstbetrag samt SV-Bonus. */
const vabVoll = a.verkehrsabsetzbetrag + (lst.bemessungJahr <= a.vab_zuschlag_bis ? a.vab_zuschlag : 0);
const rueck = Math.max(0, Math.min(vabVoll - est, a.sv_rueckerstattung_quote * sv.summe * 12, a.sv_rueckerstattung_max + a.vab_zuschlag));

export default defineGuide({
  id: 'netto-1500',
  group: 'betrag',
  order: 10,
  mini: 'nettoMonat',
  miniDefaults: { b: B },
  related: ['netto-2000', 'kindermehrbetrag', 'arbeitnehmerveranlagung', 'verkehrsabsetzbetrag', 'jahressechstel'],
  sources: ['estg33', 'estg67', 'oegkAv', 'ogvKindermehrbetrag', 'bmfRechner'],
  de: {
    slug: '1500-euro-brutto-netto',
    nav: '1.500 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: laufend keine Lohnsteuer, aber Steuer auf Urlaubs- und Weihnachtsgeld.`,
    title: '1500 Euro brutto in netto 2026: ohne Lohnsteuer im Monat',
    description: `1500 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat ohne Lohnsteuer, Steuer nur auf das 13. und 14. Gehalt und Geld zurück mit der Veranlagung.`,
    h1: '1.500 Euro brutto: netto ohne laufende Lohnsteuer',
    intro: 'Warum bei diesem Gehalt im Monat keine Lohnsteuer anfällt, das Urlaubs- und Weihnachtsgeld aber trotzdem besteuert wird, und was die Arbeitnehmerveranlagung zurückholt.',
    resume: `Von ${DE.eur(B)} brutto bleiben 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat, und zwar ohne einen Cent Lohnsteuer: Abgezogen wird nur die Sozialversicherung von ${DE.eur(sv.summe, 2)}, also ${DE.pct(sv.satz, 2)}, weil die Arbeitslosenversicherung unter ${DE.eur(P.sv.av_staffel[0][0])} entfällt. Aufs Jahr gerechnet ergibt dieses Gehalt eine Steuer nach Tarif von ${DE.eur(est)}, die der Verkehrsabsetzbetrag von ${DE.eur(a.verkehrsabsetzbetrag)} vollständig aufzehrt. Laufend steuerfrei bleibt man laut Rechner bis etwa ${DE.eur(frei)} brutto. Anders beim Urlaubszuschuss und bei der Weihnachtsremuneration: Das Jahressechstel beträgt hier ${DE.eur(k.uz.sechstel)} und liegt damit über der Freigrenze von ${DE.eur(S.freigrenze_sechstel)}, deshalb fallen auf beide Sonderzahlungen zusammen ${DE.eur(szSteuer, 2)} Lohnsteuer zum Satz von ${DE.pct(S.stufen[1][1])} an. Netto bringt das Jahr ${DE.eur(k.nettoJahr)} bei ${DE.eur(k.bruttoJahr)} brutto. Einen Teil der Sozialversicherung bekommen Sie mit der Arbeitnehmerveranlagung als SV-Rückerstattung zurück, ohne Kinder nach unserer Rechnung rund ${DE.eur(rueck)}. Auf dem Lohnzettel bringt ein Familienbonus Plus bei diesem Einkommen nichts, für Alleinverdiener und Alleinerzieher gibt es aber den Kindermehrbetrag.`,
    faqs: [
      { q: 'Warum zahle ich bei 1.500 Euro brutto Steuer auf das Weihnachtsgeld, aber nicht auf das Gehalt?', a: `Weil für Sonderzahlungen eine eigene Regel gilt. Die festen Sätze entfallen nur, wenn das Jahressechstel höchstens ${DE.eur(S.freigrenze_sechstel)} beträgt (§ 67 Abs. 1 EStG). Bei ${DE.eur(B)} im Monat sind es ${DE.eur(k.uz.sechstel)}, also wird der Teil über dem Freibetrag von ${DE.eur(S.freibetrag)} mit ${DE.pct(S.stufen[1][1])} besteuert: ${DE.eur(k.uz.lstSzFest, 2)} beim Urlaubszuschuss, ${DE.eur(k.wr.lstSzFest, 2)} bei der Weihnachtsremuneration. Die laufende Steuer deckt dagegen der Verkehrsabsetzbetrag.` },
      { q: 'Wie viel bekomme ich bei 1.500 Euro brutto mit der Arbeitnehmerveranlagung zurück?', a: `Bei einem ganzen Jahr mit ${DE.eur(B)} und ohne Kinder ergibt die Tarifsteuer ${DE.eur(est)}. Der Verkehrsabsetzbetrag samt Zuschlag (${DE.eur(vabVoll)}) übersteigt sie, die Steuer wird negativ. Erstattet werden ${DE.pct(a.sv_rueckerstattung_quote)} der Sozialversicherungsbeiträge, höchstens ${DE.eur(a.sv_rueckerstattung_max)} plus ${DE.eur(a.vab_zuschlag)} SV-Bonus, und nie mehr als die negative Steuer. Nach unserer Rechnung sind das rund ${DE.eur(rueck)} im Jahr. Die Steuer auf die Sonderzahlungen bleibt dabei unberührt, sie wird nicht neu berechnet.` },
      { q: 'Lohnt sich der Familienbonus Plus bei 1.500 Euro brutto?', a: `Auf dem Lohnzettel nicht: Mit einem Kind unter 18 bleibt das Netto bei ${DE.eur(k1.nettoMonat, 2)}, weil keine Lohnsteuer da ist, von der der Bonus abgezogen werden könnte. Für Alleinverdiener und Alleinerzieher gibt es stattdessen den Kindermehrbetrag: ${DE.eur(a.kindermehrbetrag)} minus Tarifsteuer, hier rund ${DE.eur(kmb)} pro Kind und Jahr, ausbezahlt über die Veranlagung. Voraussetzung sind mindestens 30 Tage steuerpflichtige Einkünfte im Jahr.` },
    ],
    body: (h) => `
<h2>Der Lohnzettel bei ${h.eur(B)}: nur Sozialversicherung</h2>
${h.table(['Position', 'Monat', 'Jahr (12 Bezüge)'], [
  ['Bruttobezug', h.eur(B, 2), h.eur(B * 12)],
  [`Krankenversicherung ${h.pct(h.P.sv.dn.kv, 2)}`, h.eur(sv.kv, 2), h.eur(sv.kv * 12, 2)],
  [`Pensionsversicherung ${h.pct(h.P.sv.dn.pv, 2)}`, h.eur(sv.pv, 2), h.eur(sv.pv * 12, 2)],
  [`Arbeitslosenversicherung ${h.pct(0)}`, h.eur(sv.av, 2), h.eur(sv.av * 12, 2)],
  ['AK-Umlage und Wohnbauförderung', h.eur(sv.ak + sv.wf, 2), h.eur((sv.ak + sv.wf) * 12, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.eur(lst.lst * 12, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.eur(k.nettoMonat * 12, 2)],
], 'Laufender Bezug, außerhalb Wiens, ohne Kinder', ['l', 'r', 'r'])}
<p>Seit Jänner 2026 zahlen Beschäftigte bis ${h.eur(h.P.sv.av_staffel[0][0])} brutto keinen Beitrag zur Arbeitslosenversicherung (${h.src('oegkAv', 'ÖGK')}). Versichert bleiben sie trotzdem: Den Dienstgeberanteil von ${h.pct(h.P.sv.dg.av, 2)} zahlt der Betrieb weiter, und der Anspruch auf Arbeitslosengeld entsteht genauso wie bei einem höheren Gehalt.</p>
<h2>Wo die laufende Lohnsteuer anfängt</h2>
<p>Hochgerechnet auf zwölf Monate ergibt ${h.eur(B)} brutto eine Bemessungsgrundlage von ${h.eur(lst.bemessungJahr)}. Davon liegen ${h.eur(lst.bemessungJahr - h.P.tarif.grenzen[0])} über der steuerfreien Zone von ${h.eur(h.P.tarif.grenzen[0])} und werden mit 20 Prozent belegt (${h.src('estg33', '§ 33 Abs. 1 EStG')}): ${h.eur(est, 2)} im Jahr. Der Verkehrsabsetzbetrag von ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)} steht jedem Arbeitnehmer zu und ist größer, deshalb bleibt die Lohnsteuer bei null. Erst ab etwa ${h.eur(frei)} brutto reicht er nicht mehr; ${h.eur(10)} darüber werden ${h.eur(ueberFrei.lstMonat, 2)} im Monat einbehalten. Eine Gehaltserhöhung bis in diese Gegend kommt also nur um die Sozialversicherung gekürzt an.</p>
<h2>Warum Urlaubszuschuss und Weihnachtsgeld trotzdem besteuert werden</h2>
<p>Für den 13. und 14. Bezug zählt nicht der Tarif, sondern das Jahressechstel nach ${h.src('estg67', '§ 67 EStG')}. Ist es nicht höher als ${h.eur(h.P.sonderzahlungen.freigrenze_sechstel)}, bleiben die Sonderzahlungen ganz steuerfrei. Bei vierzehn gleichen Bezügen entspricht das Sechstel zwei Monatsgehältern, die Grenze liegt also bei ${h.eur(fg, 2)} brutto im Monat. Mit ${h.eur(B)} sind Sie darüber, und weil es eine Freigrenze ist und kein Freibetrag, wird dann alles über ${h.eur(h.P.sonderzahlungen.freibetrag)} besteuert.</p>
${h.table(['Monatsbrutto', 'Jahressechstel', 'Steuer auf beide Sonderzahlungen', 'Netto im Jahr'], [
  [h.eur(Math.floor(fg)), h.eur(fgU.uz.sechstel), h.eur(fgU.uz.lstSzFest + fgU.wr.lstSzFest, 2), h.eur(fgU.nettoJahr, 2)],
  [h.eur(Math.ceil(fg)), h.eur(fgO.uz.sechstel), h.eur(fgO.uz.lstSzFest + fgO.wr.lstSzFest, 2), h.eur(fgO.nettoJahr, 2)],
  [h.eur(B), h.eur(k.uz.sechstel), h.eur(szSteuer, 2), h.eur(k.nettoJahr, 2)],
], 'Ein Euro mehr Monatsgehalt über der Freigrenze kostet netto im Jahr mehr, als er bringt', ['r', 'r', 'r', 'r'])}
<p>Netto bringt der Urlaubszuschuss ${h.eur(uzNetto, 2)}, die Weihnachtsremuneration ${h.eur(wrNetto, 2)}. Der Unterschied kommt vom Freibetrag, den die Lohnverrechnung beim ersten Mal verbraucht. Mehr dazu im Ratgeber zum ${h.a('jahressechstel', 'Jahressechstel')}.</p>
<h2>Kindermehrbetrag statt Familienbonus</h2>
<p>Der Familienbonus Plus kann nur Steuer senken, die tatsächlich anfällt. Bei ${h.eur(B)} brutto ist das nicht der Fall, auf dem Lohnzettel ändert ein Kind nichts. Wer Alleinverdiener oder Alleinerzieher ist, bekommt aber den ${h.a('kindermehrbetrag', 'Kindermehrbetrag')}: die Differenz zwischen ${h.eur(h.P.absetzbetraege.kindermehrbetrag)} und der Tarifsteuer, hier rund ${h.eur(kmb)} je Kind (${h.src('ogvKindermehrbetrag', 'oesterreich.gv.at')}). Er kommt nicht monatlich, sondern mit der ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')}, ebenso die SV-Rückerstattung von rund ${h.eur(rueck)}. Bei Teilzeit oder einem Jahr mit Unterbrechung fallen beide anders aus; der ${h.a('verkehrsabsetzbetrag', 'Verkehrsabsetzbetrag')} mit Zuschlag ist der Schlüssel dazu.</p>
<p>Ihren eigenen Fall rechnen Sie im ${h.a('home', 'Brutto-Netto-Rechner')}. Eine Stufe höher: ${h.a('netto-2000', '2.000 Euro brutto')}, wo die Lohnsteuer bereits jeden Monat abgezogen wird.</p>
`,
  },
  en: {
    slug: '1500-euro-gross-to-net',
    nav: '€1,500 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: no monthly wage tax, but tax on holiday and Christmas pay.`,
    title: '1500 Euro Gross to Net in Austria 2026: No Monthly Tax',
    description: `1500 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month with zero wage tax, a small tax on the 13th and 14th salary, and a refund through the tax return.`,
    h1: '1,500 euros gross: net pay with no monthly wage tax',
    intro: 'Why nothing is withheld for tax at this salary, why the two extra salaries are taxed anyway, and what you can claim back after the year ends.',
    resume: `On ${EN.eur(B)} gross a month you take home ${EN.eur(k.nettoMonat, 2)} in 2026 and pay no wage tax (Lohnsteuer) at all on your regular salary. The only deduction is social insurance of ${EN.eur(sv.summe, 2)}, a rate of ${EN.pct(sv.satz, 2)}, because employees below ${EN.eur(P.sv.av_staffel[0][0])} no longer pay into unemployment insurance. Scaled to a year, the tax scale would charge ${EN.eur(est)}, but every employee gets a traffic credit (Verkehrsabsetzbetrag) of ${EN.eur(a.verkehrsabsetzbetrag)} that wipes it out. Monthly tax only starts around ${EN.eur(frei)} gross. Holiday pay and Christmas pay, Austria's 13th and 14th salary, follow different rules: your annual sixth (Jahressechstel) is ${EN.eur(k.uz.sechstel)}, above the ${EN.eur(S.freigrenze_sechstel)} exemption limit, so ${EN.eur(szSteuer, 2)} of tax is withheld on the two payments at ${EN.pct(S.stufen[1][1])}. The year comes to ${EN.eur(k.nettoJahr)} net from ${EN.eur(k.bruttoJahr)} gross. Filing the employee tax return (Arbeitnehmerveranlagung) refunds part of your social insurance, about ${EN.eur(rueck)} by our calculation for someone without children.`,
    faqs: [
      { q: 'Why is my Christmas pay taxed when my 1,500 euro salary is not?', a: `Special payments have their own rule. They are tax-free only if your annual sixth is ${EN.eur(S.freigrenze_sechstel)} or less (section 67 Income Tax Act). At ${EN.eur(B)} a month it is ${EN.eur(k.uz.sechstel)}, so everything above the ${EN.eur(S.freibetrag)} allowance is taxed at ${EN.pct(S.stufen[1][1])}: ${EN.eur(k.uz.lstSzFest, 2)} on holiday pay and ${EN.eur(k.wr.lstSzFest, 2)} on Christmas pay. Regular salary escapes tax only because the traffic credit is larger than the tax.` },
      { q: 'How big is the tax refund on a 1,500 euro gross salary?', a: `For a full year at ${EN.eur(B)} with no children, the scale tax is ${EN.eur(est)} while the traffic credit plus its low-income top-up comes to ${EN.eur(vabVoll)}. The result is negative tax, and Austria refunds ${EN.pct(a.sv_rueckerstattung_quote)} of your social insurance, capped at ${EN.eur(a.sv_rueckerstattung_max)} plus a ${EN.eur(a.vab_zuschlag)} bonus and never more than the negative amount. That gives roughly ${EN.eur(rueck)} back. Tax already withheld on the 13th and 14th salary stays as it is.` },
      { q: 'Does a child change anything at 1,500 euros gross?', a: `Not on your payslip (Lohnzettel). The Familienbonus Plus child credit can only cut tax that exists, and here there is none, so net stays ${EN.eur(k1.nettoMonat, 2)}. If you are the sole earner or a single parent, you instead receive the Kindermehrbetrag: ${EN.eur(a.kindermehrbetrag)} minus your scale tax, about ${EN.eur(kmb)} per child, paid through the tax return. You need at least 30 days of taxable income in the year.` },
    ],
    body: (h) => `
<h2>Your payslip at ${h.eur(B)}: social insurance only</h2>
${h.table(['Item', 'Month', 'Year (12 salaries)'], [
  ['Gross pay', h.eur(B, 2), h.eur(B * 12)],
  [`Health insurance ${h.pct(h.P.sv.dn.kv, 2)}`, h.eur(sv.kv, 2), h.eur(sv.kv * 12, 2)],
  [`Pension insurance ${h.pct(h.P.sv.dn.pv, 2)}`, h.eur(sv.pv, 2), h.eur(sv.pv * 12, 2)],
  [`Unemployment insurance ${h.pct(0)}`, h.eur(sv.av, 2), h.eur(sv.av * 12, 2)],
  ['Chamber levy and housing subsidy', h.eur(sv.ak + sv.wf, 2), h.eur((sv.ak + sv.wf) * 12, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.eur(lst.lst * 12, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.eur(k.nettoMonat * 12, 2)],
], 'Regular pay, outside Vienna, no children', ['l', 'r', 'r'])}
<p>Since January 2026 nobody earning up to ${h.eur(h.P.sv.av_staffel[0][0])} gross pays the employee share of unemployment insurance (${h.src('oegkAv', 'ÖGK health insurer')}). You are still covered: your employer keeps paying its ${h.pct(h.P.sv.dg.av, 2)}, and you build up the same right to unemployment benefit as a higher earner.</p>
<h2>The point where monthly tax kicks in</h2>
<p>Austria taxes salary on an annual basis even though it is withheld monthly. Twelve months of ${h.eur(B)} after social insurance and the flat ${h.eur(h.P.tarif.werbungskostenpauschale)} work-expense allowance give a taxable base of ${h.eur(lst.bemessungJahr)}. The first ${h.eur(h.P.tarif.grenzen[0])} are tax-free and the rest is taxed at 20 percent (${h.src('estg33', 'section 33(1)')}), which makes ${h.eur(est, 2)}. The traffic credit of ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)} is deducted from that tax, not from income, so nothing is left to withhold. The calculator puts the break-even near ${h.eur(frei)} gross; ${h.eur(10)} above it, your employer starts deducting ${h.eur(ueberFrei.lstMonat, 2)} a month.</p>
<h2>The exemption limit on the 13th and 14th salary</h2>
<p>Most Austrian employees get fourteen salaries, the extra two being special payments (Sonderzahlungen). They are taxed at fixed rates up to one sixth of your regular annual pay (${h.src('estg67', 'section 67')}), and fully exempt if that sixth stays at or below ${h.eur(h.P.sonderzahlungen.freigrenze_sechstel)}. With fourteen equal payments the sixth equals two monthly salaries, so the cut-off is ${h.eur(fg, 2)} gross. It works as a cliff, not a slope: cross it and everything above ${h.eur(h.P.sonderzahlungen.freibetrag)} is taxed.</p>
${h.table(['Monthly gross', 'Annual sixth', 'Tax on both special payments', 'Net per year'], [
  [h.eur(Math.floor(fg)), h.eur(fgU.uz.sechstel), h.eur(fgU.uz.lstSzFest + fgU.wr.lstSzFest, 2), h.eur(fgU.nettoJahr, 2)],
  [h.eur(Math.ceil(fg)), h.eur(fgO.uz.sechstel), h.eur(fgO.uz.lstSzFest + fgO.wr.lstSzFest, 2), h.eur(fgO.nettoJahr, 2)],
  [h.eur(B), h.eur(k.uz.sechstel), h.eur(szSteuer, 2), h.eur(k.nettoJahr, 2)],
], 'One euro of extra monthly salary across the limit costs more net than it adds', ['r', 'r', 'r', 'r'])}
<p>At ${h.eur(B)}, holiday pay leaves ${h.eur(uzNetto, 2)} net and Christmas pay ${h.eur(wrNetto, 2)}; the ${h.eur(h.P.sonderzahlungen.freibetrag)} allowance is used up on the first one. Our page on the ${h.a('jahressechstel', 'annual sixth')} explains the mechanism in detail.</p>
<h2>Children and refunds: what to file for</h2>
<p>Because no wage tax is withheld, the Familienbonus Plus does nothing for you during the year. Sole earners and single parents get the ${h.a('kindermehrbetrag', 'Kindermehrbetrag')} instead, about ${h.eur(kmb)} per child (${h.src('ogvKindermehrbetrag', 'oesterreich.gv.at')}), and everyone at this salary can get social insurance back. Both only arrive through the ${h.a('arbeitnehmerveranlagung', 'employee tax return')} after the year ends. The ${h.a('verkehrsabsetzbetrag', 'traffic credit')} page shows how the top-up shrinks as income rises.</p>
<p>Try other figures in the ${h.a('home', 'gross-to-net calculator')}, or compare with ${h.a('netto-2000', '2,000 euros gross')}, where wage tax is deducted every month.</p>
`,
  },
});
