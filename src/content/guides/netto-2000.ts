import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend, avSatz } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const B = 2000;
const k = kurz(B), k1 = kurz(B, { kinderU18: 1 }), kg = kurz(B, { kinderU18: 1, fbGeteilt: true });
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const A0 = P.sv.av_staffel[0][0];
/** Erstes volles Monatsbrutto, ab dem der Grenzsteuersatz 30 % beträgt (Motor). */
let ab30 = B;
while (lohnsteuerLaufend(ab30 - svLaufend(ab30).summe).grenzsteuersatz < P.tarif.saetze[2]) ab30++;
const vor30 = kurz(ab30 - 1), mit30 = kurz(ab30);
const avU = kurz(A0), avO = kurz(A0 + 1);
const sprungJahr = avU.nettoJahr - avO.nettoJahr;
/** Wie weit trägt die 20-%-Stufe noch: Bemessungsgrundlage bis zur Grenze. */
const rest20 = P.tarif.grenzen[1] - lst.bemessungJahr;
const fbMonat = P.absetzbetraege.familienbonus_monat_u18;
const gleich = kg.nettoMonat >= k1.nettoMonat;
const uzNetto = k.uz.sz - k.uz.svSz - k.uz.lstSzFest;

export default defineGuide({
  id: 'netto-2000',
  group: 'betrag',
  order: 20,
  mini: 'nettoMonat',
  miniDefaults: { b: B },
  related: ['netto-1500', 'netto-2500', 'familienbonus', 'sozialversicherung', 'lohnsteuer'],
  sources: ['estg33', 'oegkAv', 'bmfFamilienbonus', 'bmfRechner'],
  de: {
    slug: '2000-euro-brutto-netto',
    nav: '2.000 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: keine Arbeitslosenversicherung und 20 % Grenzsteuersatz.`,
    title: '2000 Euro brutto in netto 2026: Österreich, 20-%-Stufe',
    description: `2000 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat, ohne Arbeitslosenversicherung, in der 20-%-Stufe und mit nur teilweise wirksamem Familienbonus.`,
    h1: '2.000 Euro brutto: was netto bleibt und warum',
    intro: 'Ein Gehalt ohne Beitrag zur Arbeitslosenversicherung, mit dem niedrigsten Steuersatz und zwei Grenzen in Sichtweite.',
    resume: `Bei ${DE.eur(B)} brutto bleiben 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat. Die Sozialversicherung kostet ${DE.eur(sv.summe, 2)} oder ${DE.pct(sv.satz, 2)}, weil bis ${DE.eur(A0)} kein Beitrag zur Arbeitslosenversicherung anfällt. Die Lohnsteuer beträgt ${DE.eur(lst.lst, 2)}: Aufs Jahr gerechnet liegt die Bemessungsgrundlage bei ${DE.eur(lst.bemessungJahr)} und damit vollständig in der 20-Prozent-Stufe, die bis ${DE.eur(P.tarif.grenzen[1])} reicht. Jeder zusätzliche Euro kostet also ${DE.pct(sv.satz, 2)} Sozialversicherung und vom Rest 20 Prozent Steuer. Diese günstige Lage endet bald: Ab etwa ${DE.eur(ab30)} brutto beginnt die 30-Prozent-Stufe, ab ${DE.eur(A0 + 1)} wird ein Prozent Arbeitslosenversicherung auf das ganze Gehalt fällig, was netto ${DE.eur(sprungJahr, 2)} im Jahr kostet. Urlaubszuschuss und Weihnachtsremuneration bringen zusammen ${DE.eur(k.uz.sz - k.uz.svSz - k.uz.lstSzFest + k.wr.sz - k.wr.svSz - k.wr.lstSzFest, 2)} netto, das ganze Jahr ${DE.eur(k.nettoJahr)}. Mit einem Kind wirkt der Familienbonus Plus nur zum Teil, weil die Steuer kleiner ist als der Bonus von ${DE.eur(fbMonat, 2)}.`,
    faqs: [
      { q: 'Warum zahle ich bei 2.000 Euro brutto keine Arbeitslosenversicherung?', a: `Seit 1. Jänner 2026 gilt eine Staffel für niedrige Einkommen: Bis ${DE.eur(A0)} brutto im Monat beträgt der Dienstnehmeranteil null, darüber ${DE.pct(P.sv.av_staffel[1][1])}, ${DE.pct(P.sv.av_staffel[2][1])} und ab ${DE.eur(P.sv.av_staffel[2][0])} der volle Satz von ${DE.pct(P.sv.dn.av, 2)} (ÖGK). Bei ${DE.eur(B)} sparen Sie damit ${DE.eur(B * P.sv.dn.av, 2)} im Monat gegenüber dem vollen Beitrag, der Versicherungsschutz bleibt gleich.` },
      { q: 'Wie viel bringt der Familienbonus bei 2.000 Euro brutto wirklich?', a: `Mit einem Kind unter 18 steigt das Netto von ${DE.eur(k.nettoMonat, 2)} auf ${DE.eur(k1.nettoMonat, 2)}, also um ${DE.eur(k1.nettoMonat - k.nettoMonat, 2)} statt der möglichen ${DE.eur(fbMonat, 2)}. Der Bonus kann nicht mehr abziehen, als an Steuer da ist. Teilen die Eltern ihn je zur Hälfte, behalten Sie bei diesem Gehalt mit ${DE.eur(kg.nettoMonat, 2)} ${gleich ? 'genau gleich viel' : 'fast gleich viel'}, und der andere Elternteil nutzt seine Hälfte bei höherem Einkommen voll aus.` },
      { q: 'Ab welchem Gehalt rutscht man von 2.000 Euro aus in die 30-Prozent-Stufe?', a: `Laut Rechner ab etwa ${DE.eur(ab30)} brutto im Monat. Dann übersteigt die Bemessungsgrundlage ${DE.eur(P.tarif.grenzen[1])} im Jahr, und nur der Teil darüber wird mit 30 Prozent besteuert. Der Unterschied ist klein: Bei ${DE.eur(ab30 - 1)} bleiben ${DE.eur(vor30.nettoMonat, 2)}, bei ${DE.eur(ab30)} ${DE.eur(mit30.nettoMonat, 2)}. Ein Netto-Verlust entsteht dort nicht, anders als an der Grenze der Arbeitslosenversicherung kurz danach.` },
    ],
    body: (h) => `
<h2>Abzüge bei ${h.eur(B)} brutto im Monat</h2>
${h.table(['Position', 'Monat', 'Anteil am Brutto'], [
  ['Bruttobezug', h.eur(B, 2), h.pct(1)],
  [`Kranken- und Pensionsversicherung`, h.eur(sv.kv + sv.pv, 2), h.pct((sv.kv + sv.pv) / B, 2)],
  [`Arbeitslosenversicherung ${h.pct(avSatz(B))}`, h.eur(sv.av, 2), h.pct(sv.av / B, 2)],
  ['AK-Umlage und Wohnbauförderung', h.eur(sv.ak + sv.wf, 2), h.pct((sv.ak + sv.wf) / B, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.pct(lst.lst / B, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.pct(k.nettoMonat / B, 2)],
], 'Laufender Bezug, außerhalb Wiens, ohne Kinder', ['l', 'r', 'r'])}
<p>Rund um diesen Betrag liegen viele kollektivvertragliche Einstiegsgehälter. Die genaue Zahl steht im jeweiligen Kollektivvertrag; für das Netto zählen nur Brutto, Wohnort des Betriebs und Ihre Absetzbeträge.</p>
<h2>Die 20-Prozent-Stufe reicht bis etwa ${h.eur(ab30)} brutto</h2>
<p>Der Lohnsteuertarif (${h.src('estg33', '§ 33 Abs. 1 EStG')}) lässt die ersten ${h.eur(h.P.tarif.grenzen[0])} im Jahr frei und belegt den Teil bis ${h.eur(h.P.tarif.grenzen[1])} mit 20 Prozent. Ihre Bemessungsgrundlage von ${h.eur(lst.bemessungJahr)} hat bis zur nächsten Stufe noch ${h.eur(rest20)} Luft. Hochgerechnet ergibt das eine Tarifsteuer von ${h.eur(lst.tarifMonat, 2)} im Monat, davon zieht die Lohnverrechnung ein Zwölftel des Verkehrsabsetzbetrags ab (${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag / 12, 2)}). So entstehen die ${h.eur(lst.lst, 2)} auf dem Lohnzettel. Eine Erhöhung um ${h.eur(100)} bringt in diesem Bereich rund ${h.eur(100 * (1 - sv.satz) * (1 - h.P.tarif.saetze[1]))} netto.</p>
<h2>Die Grenze bei ${h.eur(A0)}: ein Prozent auf das ganze Gehalt</h2>
<p>Die Staffel der Arbeitslosenversicherung (${h.src('oegkAv', 'ÖGK')}) wirkt nicht nur auf den Euro über der Grenze, sondern auf den gesamten Monatsbezug. Wer mit ${h.eur(A0)} genau an der Grenze liegt, verliert beim nächsten Euro netto Geld.</p>
${h.table(['Monatsbrutto', 'AV-Satz', 'Grenzsteuersatz', 'Netto im Monat', 'Netto im Jahr'], [
  [h.eur(B), h.pct(avSatz(B)), h.pct(lst.grenzsteuersatz), h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
  [h.eur(ab30 - 1), h.pct(avSatz(ab30 - 1)), h.pct(h.P.tarif.saetze[1]), h.eur(vor30.nettoMonat, 2), h.eur(vor30.nettoJahr, 2)],
  [h.eur(ab30), h.pct(avSatz(ab30)), h.pct(h.P.tarif.saetze[2]), h.eur(mit30.nettoMonat, 2), h.eur(mit30.nettoJahr, 2)],
  [h.eur(A0), h.pct(avSatz(A0)), h.pct(h.P.tarif.saetze[2]), h.eur(avU.nettoMonat, 2), h.eur(avU.nettoJahr, 2)],
  [h.eur(A0 + 1), h.pct(avSatz(A0 + 1)), h.pct(h.P.tarif.saetze[2]), h.eur(avO.nettoMonat, 2), h.eur(avO.nettoJahr, 2)],
], 'Werte aus dem Motor dieser Seite, 14 Bezüge', ['r', 'r', 'r', 'r', 'r'])}
<p>Wer über eine Gehaltserhöhung verhandelt, sollte die Grenze deshalb deutlich überspringen. Der ${h.a('gehaltserhoehung', 'Gehaltserhöhungsrechner')} zeigt, wie viel davon ankommt; auf der Seite zu ${h.a('netto-2500', '2.500 Euro brutto')} sehen Sie die beiden nächsten Stufen der Staffel.</p>
<h2>Familienbonus: nur ein Teil kommt an</h2>
<p>Der Familienbonus Plus beträgt ${h.eur(fbMonat, 2)} im Monat je Kind unter 18 (${h.src('bmfFamilienbonus', 'BMF')}), wird aber höchstens bis zur Tarifsteuer abgezogen. Bei ${h.eur(B)} sind das ${h.eur(lst.tarifMonat, 2)}. Weil der Verkehrsabsetzbetrag ohnehin einen Teil davon deckt, steigt Ihr Netto nur um ${h.eur(k1.nettoMonat - k.nettoMonat, 2)}. Verdient der andere Elternteil mehr, ist die Aufteilung je zur Hälfte meist die bessere Wahl: Ihr Netto liegt dann bei ${h.eur(kg.nettoMonat, 2)}, ${gleich ? 'ohne jeden Verlust' : 'kaum weniger'}, die zweite Hälfte wirkt beim Partner in voller Höhe. Details im Ratgeber zum ${h.a('familienbonus', 'Familienbonus Plus')}.</p>
<p>Netto bringt Ihnen der Urlaubszuschuss ${h.eur(uzNetto, 2)}. Den eigenen Fall rechnen Sie im ${h.a('home', 'Brutto-Netto-Rechner')}; darunter liegt ${h.a('netto-1500', '1.500 Euro brutto')}, wo laufend gar keine Lohnsteuer anfällt.</p>
`,
  },
  en: {
    slug: '2000-euro-gross-to-net',
    nav: '€2,000 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: no unemployment contribution and a 20% marginal tax rate.`,
    title: '2000 Euro Gross to Net in Austria 2026: The 20% Tax Band',
    description: `2000 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month, no unemployment contribution, the 20% tax band and a child credit you can only partly use here.`,
    h1: '2,000 euros gross: your net pay in Austria explained',
    intro: 'A salary with no unemployment contribution and the lowest tax rate, sitting just below two thresholds that cost money if you cross them carelessly.',
    resume: `A gross salary of ${EN.eur(B)} a month leaves ${EN.eur(k.nettoMonat, 2)} net in Austria in 2026. Social insurance takes ${EN.eur(sv.summe, 2)}, or ${EN.pct(sv.satz, 2)}, since employees earning up to ${EN.eur(A0)} pay no unemployment insurance. Wage tax (Lohnsteuer) is ${EN.eur(lst.lst, 2)} a month. Austria withholds tax as if each month's pay were earned for a full year, and on that basis your taxable income of ${EN.eur(lst.bemessungJahr)} sits entirely in the 20 percent band, which ends at ${EN.eur(P.tarif.grenzen[1])}. Two thresholds lie just ahead. From about ${EN.eur(ab30)} gross the 30 percent band begins, which barely matters. From ${EN.eur(A0 + 1)} a one percent unemployment contribution applies to your whole salary, costing ${EN.eur(sprungJahr, 2)} net a year compared with staying just below. Over a full year with the usual 13th and 14th salary you keep ${EN.eur(k.nettoJahr)}. Parents should know that the Familienbonus Plus child credit of ${EN.eur(fbMonat, 2)} a month is only partly usable at this pay level.`,
    faqs: [
      { q: 'Why is there no unemployment insurance on my 2,000 euro payslip?', a: `Austria introduced a sliding scale for low earners on 1 January 2026. The employee share is zero up to ${EN.eur(A0)} gross a month, then ${EN.pct(P.sv.av_staffel[1][1])}, then ${EN.pct(P.sv.av_staffel[2][1])}, and the full ${EN.pct(P.sv.dn.av, 2)} only above ${EN.eur(P.sv.av_staffel[2][0])}. At ${EN.eur(B)} you save ${EN.eur(B * P.sv.dn.av, 2)} a month compared with the full rate, and you stay fully insured because your employer still pays its share.` },
      { q: 'Should parents earning 2,000 euros gross split the child credit?', a: `Often yes. With one child under 18 your net rises only ${EN.eur(k1.nettoMonat - k.nettoMonat, 2)}, to ${EN.eur(k1.nettoMonat, 2)}, because the Familienbonus Plus cannot exceed your tax. If you split it 50/50 with a higher-earning partner, your net is ${EN.eur(kg.nettoMonat, 2)}, ${gleich ? 'exactly the same' : 'almost the same'}, while your partner can use their half in full. Each parent tells their own employer which share they claim.` },
      { q: 'At what pay does someone on 2,000 euros reach the 30 percent band?', a: `Around ${EN.eur(ab30)} gross a month, according to the calculator. Only the slice of annual taxable income above ${EN.eur(P.tarif.grenzen[1])} is taxed at 30 percent, so crossing the line never lowers your net: ${EN.eur(ab30 - 1)} gives ${EN.eur(vor30.nettoMonat, 2)}, ${EN.eur(ab30)} gives ${EN.eur(mit30.nettoMonat, 2)}. The unemployment insurance step just above ${EN.eur(A0)} is the one that actually costs you.` },
    ],
    body: (h) => `
<h2>Where ${h.eur(B)} gross goes each month</h2>
${h.table(['Item', 'Month', 'Share of gross'], [
  ['Gross pay', h.eur(B, 2), h.pct(1)],
  ['Health and pension insurance', h.eur(sv.kv + sv.pv, 2), h.pct((sv.kv + sv.pv) / B, 2)],
  [`Unemployment insurance ${h.pct(avSatz(B))}`, h.eur(sv.av, 2), h.pct(sv.av / B, 2)],
  ['Chamber levy and housing subsidy', h.eur(sv.ak + sv.wf, 2), h.pct((sv.ak + sv.wf) / B, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.pct(lst.lst / B, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.pct(k.nettoMonat / B, 2)],
], 'Regular pay, outside Vienna, no children', ['l', 'r', 'r'])}
<p>Many entry-level salaries under Austrian collective agreements (Kollektivvertrag, the sector-wide pay scale) fall near this figure. Your exact minimum depends on your sector and grade; the net result depends only on the gross, the employer's location and your personal credits.</p>
<h2>The 20 percent band runs to about ${h.eur(ab30)} gross</h2>
<p>The tax scale (${h.src('estg33', 'section 33(1) Income Tax Act')}) leaves the first ${h.eur(h.P.tarif.grenzen[0])} of annual income untaxed and charges 20 percent up to ${h.eur(h.P.tarif.grenzen[1])}. Your taxable base has ${h.eur(rest20)} of room left in that band. The scale tax works out at ${h.eur(lst.tarifMonat, 2)} a month; payroll then subtracts one twelfth of the traffic credit (${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag / 12, 2)}), leaving the ${h.eur(lst.lst, 2)} you see on the payslip (Lohnzettel). A ${h.eur(100)} rise here adds roughly ${h.eur(100 * (1 - sv.satz) * (1 - h.P.tarif.saetze[1]))} net.</p>
<h2>The ${h.eur(A0)} step: one percent on everything</h2>
<p>The unemployment insurance scale (${h.src('oegkAv', 'ÖGK')}) applies its rate to the whole monthly salary, not just the part above the line. One euro more than ${h.eur(A0)} therefore lowers your take-home pay.</p>
${h.table(['Monthly gross', 'Unemployment rate', 'Marginal tax rate', 'Net per month', 'Net per year'], [
  [h.eur(B), h.pct(avSatz(B)), h.pct(lst.grenzsteuersatz), h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
  [h.eur(ab30 - 1), h.pct(avSatz(ab30 - 1)), h.pct(h.P.tarif.saetze[1]), h.eur(vor30.nettoMonat, 2), h.eur(vor30.nettoJahr, 2)],
  [h.eur(ab30), h.pct(avSatz(ab30)), h.pct(h.P.tarif.saetze[2]), h.eur(mit30.nettoMonat, 2), h.eur(mit30.nettoJahr, 2)],
  [h.eur(A0), h.pct(avSatz(A0)), h.pct(h.P.tarif.saetze[2]), h.eur(avU.nettoMonat, 2), h.eur(avU.nettoJahr, 2)],
  [h.eur(A0 + 1), h.pct(avSatz(A0 + 1)), h.pct(h.P.tarif.saetze[2]), h.eur(avO.nettoMonat, 2), h.eur(avO.nettoJahr, 2)],
], 'Figures from this site’s engine, 14 salaries a year', ['r', 'r', 'r', 'r', 'r'])}
<p>If you are negotiating a raise from here, aim well past the step. The ${h.a('gehaltserhoehung', 'pay rise calculator')} shows what reaches you, and the ${h.a('netto-2500', '2,500 euro page')} covers the next two steps of the scale.</p>
<h2>The child credit only partly works</h2>
<p>Familienbonus Plus is worth ${h.eur(fbMonat, 2)} a month per child under 18 (${h.src('bmfFamilienbonus', 'Finance Ministry')}), but it can never exceed your scale tax, here ${h.eur(lst.tarifMonat, 2)}. Since the traffic credit already absorbs part of that tax, your net pay rises by just ${h.eur(k1.nettoMonat - k.nettoMonat, 2)}. When the other parent earns more, a 50/50 split usually serves the household better: you keep ${h.eur(kg.nettoMonat, 2)}${gleich ? ', no less than with the full credit,' : ''} and they use their half in full. See the ${h.a('familienbonus', 'Familienbonus Plus guide')}.</p>
<p>Holiday pay adds ${h.eur(uzNetto, 2)} net in June. Run your own numbers in the ${h.a('home', 'gross-to-net calculator')}, or look at ${h.a('netto-1500', '1,500 euros gross')}, where no monthly wage tax is due.</p>
`,
  },
});
