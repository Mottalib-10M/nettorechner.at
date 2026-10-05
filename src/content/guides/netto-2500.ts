import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend, avSatz } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const B = 2500;
const k = kurz(B), w = kurz(B, { wien: true }), k1 = kurz(B, { kinderU18: 1 }), k2 = kurz(B, { kinderU18: 2 });
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const [, s1, s2] = P.sv.av_staffel;
/** Band mit 2 % Arbeitslosenversicherung: von s1[0] + 1 Cent bis s2[0]. */
const vorBand = kurz(s1[0]), imBand = kurz(s1[0] + 1);
const top = kurz(s2[0]), danach = kurz(s2[0] + 1);
const delleMonat = top.nettoMonat - danach.nettoMonat, delleJahr = top.nettoJahr - danach.nettoJahr;
/** Erstes volles Brutto über der Grenze, bei dem das Monatsnetto wieder so hoch ist wie an der Grenze (Motor). */
let aufgeholt = s2[0] + 1;
while (kurz(aufgeholt).nettoMonat < top.nettoMonat) aufgeholt++;
const auf = kurz(aufgeholt);
/** Grenzbelastung im Band: SV-Satz plus 30 % vom Rest. */
const grenz = sv.satz + (1 - sv.satz) * lst.grenzsteuersatz;
/** Beispiel aus der FAQ: Erhöhung auf 2.650 € (liegt in der Delle). */
const Z = 2650, zk = kurz(Z);
const uzNetto = k.uz.sz - k.uz.svSz - k.uz.lstSzFest, wrNetto = k.wr.sz - k.wr.svSz - k.wr.lstSzFest;

export default defineGuide({
  id: 'netto-2500',
  group: 'betrag',
  order: 30,
  mini: 'nettoMonat',
  miniDefaults: { b: B },
  related: ['netto-2000', 'netto-3000', 'gehaltserhoehung', 'sozialversicherung', 'sonderzahlungen'],
  sources: ['oegkAv', 'estg33', 'wkoBeitraege', 'bmfRechner'],
  de: {
    slug: '2500-euro-brutto-netto',
    nav: '2.500 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: halbe Arbeitslosenversicherung, aber eine Netto-Delle knapp darüber.`,
    title: '2500 Euro brutto in netto 2026: Österreich mit AV-Staffel',
    description: `2500 Euro brutto 2026: ${DE.eur(k.nettoMonat, 2)} netto im Monat in Österreich, mit nur ${DE.pct(s2[1])} Arbeitslosenversicherung und warum das Netto knapp über ${DE.eur(s2[0])} brutto sinkt.`,
    h1: '2.500 Euro brutto: Netto im Band der 2-Prozent-Staffel',
    intro: 'Was bei diesem Gehalt netto ankommt, warum die Arbeitslosenversicherung noch ermäßigt ist und wo eine kleine Erhöhung weniger Netto bringt.',
    resume: `Wer ${DE.eur(B)} brutto verdient, bekommt 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat ausbezahlt. Abgezogen werden ${DE.eur(sv.summe, 2)} Sozialversicherung und ${DE.eur(lst.lst, 2)} Lohnsteuer. Das Gehalt liegt im dritten Band der neuen Staffel zur Arbeitslosenversicherung: Zwischen ${DE.eur(s1[0])} und ${DE.eur(s2[0])} zahlen Beschäftigte ${DE.pct(s2[1])} statt ${DE.pct(P.sv.dn.av, 2)}, der Sozialversicherungssatz beträgt damit ${DE.pct(sv.satz, 2)}. Steuerlich ist der Betrag bereits in der 30-Prozent-Stufe, von einem zusätzlichen Euro bleiben rund ${DE.num((1 - grenz) * 100)} Cent. Heikel ist der Bereich knapp über ${DE.eur(s2[0])}: Dort springt der Beitrag auf den vollen Satz, und zwar für das ganze Gehalt. Bei ${DE.eur(s2[0] + 1)} brutto bleiben ${DE.eur(delleMonat, 2)} weniger im Monat als bei ${DE.eur(s2[0])}, erst ab etwa ${DE.eur(aufgeholt)} ist dieser Verlust aufgeholt. Urlaubszuschuss und Weihnachtsremuneration bringen ${DE.eur(uzNetto, 2)} und ${DE.eur(wrNetto, 2)} netto, das Jahr ${DE.eur(k.nettoJahr)}.`,
    faqs: [
      { q: 'Lohnt sich eine Gehaltserhöhung von 2.500 auf 2.650 Euro brutto?', a: `Gegenüber heute schon: ${DE.eur(zk.nettoMonat, 2)} statt ${DE.eur(k.nettoMonat, 2)} netto. Aber ${DE.eur(Z)} bringen weniger als ${DE.eur(s2[0])}, wo ${DE.eur(top.nettoMonat, 2)} bleiben. Ab ${DE.eur(s2[0] + 1)} gilt der volle Beitrag zur Arbeitslosenversicherung auf das gesamte Gehalt, das Netto fällt zunächst um ${DE.eur(delleMonat, 2)}. Erst ab ${DE.eur(aufgeholt)} brutto (${DE.eur(auf.nettoMonat, 2)} netto) ist der Stand der Grenze wieder erreicht. Verhandeln Sie also entweder ${DE.eur(s2[0])} oder deutlich mehr als ${DE.eur(Z)}.` },
      { q: 'Gilt der ermäßigte Beitrag bei 2.500 Euro auch für Urlaubs- und Weihnachtsgeld?', a: `Ja. Bei Sonderzahlungen richtet sich der Satz der Arbeitslosenversicherung nach der Höhe der einzelnen Sonderzahlung (WKO, Beitragswesen 2026). Ein Urlaubszuschuss von ${DE.eur(B)} fällt ebenfalls in das ${DE.pct(s2[1])}-Band; abgezogen werden ${DE.eur(k.uz.svSz, 2)}, ohne AK-Umlage und Wohnbauförderung. Ein Weihnachtsgeld, das mit einer Prämie über ${DE.eur(s2[0])} steigt, zahlt den vollen Satz auf den ganzen Betrag.` },
      { q: 'Was kostet bei 2.500 Euro brutto ein Arbeitsplatz in Wien?', a: `In Wien beträgt der Wohnbauförderungsbeitrag seit Jänner 2026 ${DE.pct(P.sv.dn.wf_wien, 2)} statt ${DE.pct(P.sv.dn.wf, 1)}. Bei ${DE.eur(B)} sind das ${DE.eur(k.nettoMonat - w.nettoMonat, 2)} weniger im Monat (${DE.eur(w.nettoMonat, 2)} netto) und ${DE.eur(k.nettoJahr - w.nettoJahr, 2)} im Jahr. Weil der Beitrag die Lohnsteuer etwas senkt, ist der Unterschied kleiner als der reine Aufschlag. Sonderzahlungen sind davon nicht betroffen.` },
    ],
    body: (h) => `
<h2>Lohnzettel bei ${h.eur(B)} mit ermäßigter Arbeitslosenversicherung</h2>
${h.table(['Position', 'Satz', 'Monat'], [
  ['Bruttobezug', '', h.eur(B, 2)],
  ['Krankenversicherung', h.pct(h.P.sv.dn.kv, 2), h.eur(sv.kv, 2)],
  ['Pensionsversicherung', h.pct(h.P.sv.dn.pv, 2), h.eur(sv.pv, 2)],
  ['Arbeitslosenversicherung', h.pct(avSatz(B), 2), h.eur(sv.av, 2)],
  ['AK-Umlage', h.pct(h.P.sv.dn.ak, 2), h.eur(sv.ak, 2)],
  ['Wohnbauförderung', h.pct(h.P.sv.dn.wf, 2), h.eur(sv.wf, 2)],
  ['Lohnsteuer', h.pct(lst.lst / B, 2), h.eur(lst.lst, 2)],
  ['Netto', '', h.eur(k.nettoMonat, 2)],
], 'Laufender Bezug außerhalb Wiens, ohne Kinder und Pendlerpauschale', ['l', 'r', 'r'])}
<h2>Das Band von ${h.eur(s1[0])} bis ${h.eur(s2[0])}</h2>
<p>Seit 2026 hat die Arbeitslosenversicherung für Dienstnehmer vier Stufen (${h.src('oegkAv', 'ÖGK')}). ${h.eur(B)} liegt in der dritten: ${h.pct(s2[1])} statt ${h.pct(h.P.sv.dn.av, 2)}, das spart ${h.eur(B * (h.P.sv.dn.av - s2[1]), 2)} im Monat. Der Dienstgeber zahlt seinen Anteil von ${h.pct(h.P.sv.dg.av, 2)} unverändert. Auch der Eintritt in dieses Band war eine Stufe: Bei ${h.eur(s1[0])} galt noch ${h.pct(s1[1])}, mit einem Euro mehr ${h.pct(s2[1])} auf alles; das Netto fiel von ${h.eur(vorBand.nettoMonat, 2)} auf ${h.eur(imBand.nettoMonat, 2)}.</p>
<h2>Die Netto-Delle knapp über ${h.eur(s2[0])}</h2>
<p>Die größere Stufe liegt oberhalb. Mit ${h.eur(s2[0] + 1)} brutto steigt der Beitrag von ${h.pct(s2[1])} auf ${h.pct(h.P.sv.dn.av, 2)}, auf das gesamte Gehalt. Für einen Euro mehr brutto verlieren Sie ${h.eur(delleMonat, 2)} netto im Monat, ${h.eur(delleJahr, 2)} im Jahr, weil auch die Sonderzahlungen in den vollen Satz rutschen.</p>
${h.table(['Monatsbrutto', 'AV-Satz', 'Netto im Monat', 'Netto im Jahr'], [
  [h.eur(B), h.pct(avSatz(B)), h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
  [h.eur(s2[0]), h.pct(avSatz(s2[0])), h.eur(top.nettoMonat, 2), h.eur(top.nettoJahr, 2)],
  [h.eur(s2[0] + 1), h.pct(avSatz(s2[0] + 1), 2), h.eur(danach.nettoMonat, 2), h.eur(danach.nettoJahr, 2)],
  [h.eur(aufgeholt), h.pct(avSatz(aufgeholt), 2), h.eur(auf.nettoMonat, 2), h.eur(auf.nettoJahr, 2)],
], 'Werte aus dem Motor dieser Seite, 14 Bezüge, außerhalb Wiens', ['r', 'r', 'r', 'r'])}
<p>Die Lohnsteuer dämpft den Sprung etwas, weil der höhere Beitrag die Bemessungsgrundlage senkt. Für Verhandlungen heißt das: Eine Erhöhung von ${h.eur(B)} aus sollte entweder unter ${h.eur(s2[0])} bleiben oder über ${h.eur(aufgeholt)} hinausgehen. Der ${h.a('gehaltserhoehung', 'Gehaltserhöhungsrechner')} rechnet jede Variante durch.</p>
<h2>Schon in der 30-Prozent-Stufe</h2>
<p>Aufs Jahr gerechnet ergibt ${h.eur(B)} eine Bemessungsgrundlage von ${h.eur(lst.bemessungJahr)}, davon liegen ${h.eur(lst.bemessungJahr - h.P.tarif.grenzen[1])} über ${h.eur(h.P.tarif.grenzen[1])} und werden mit 30 Prozent besteuert (${h.src('estg33', '§ 33 Abs. 1 EStG')}). Zusammen mit ${h.pct(sv.satz, 2)} Sozialversicherung kostet ein zusätzlicher Euro brutto also rund ${h.pct(grenz)}. Auf dem Weg zu ${h.a('netto-3000', '3.000 Euro brutto')} bleibt es bei diesem Steuersatz, nur der Beitrag zur Arbeitslosenversicherung steigt einmal.</p>
<p>Für den Familienbonus Plus ist dieses Gehalt eine Grenzlage. Ein Kind unter 18 bringt den vollen Bonus von ${h.eur(h.P.absetzbetraege.familienbonus_monat_u18, 2)}, das Netto steigt auf ${h.eur(k1.nettoMonat, 2)}. Bei zwei Kindern reicht die Tarifsteuer von ${h.eur(lst.tarifMonat, 2)} im Monat nicht mehr: Das Netto erreicht nur ${h.eur(k2.nettoMonat, 2)}, der Rest des zweiten Bonus verfällt, sofern ihn nicht der andere Elternteil zur Hälfte nutzt.</p>
<p>Der ${h.a('home', 'Brutto-Netto-Rechner')} zeigt Ihr eigenes Ergebnis mit Kindern oder Pendlerpauschale. Eine Stufe tiefer: ${h.a('netto-2000', '2.000 Euro brutto')}, ganz ohne Arbeitslosenversicherung.</p>
`,
  },
  en: {
    slug: '2500-euro-gross-to-net',
    nav: '€2,500 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: reduced unemployment contribution, with a net-pay dip just above it.`,
    title: '2500 Euro Gross to Net in Austria 2026: The 2% AV Band',
    description: `2500 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month, only ${EN.pct(s2[1])} unemployment insurance, and why a small raise to just above ${EN.eur(s2[0])} lowers your net pay.`,
    h1: '2,500 euros gross: take-home pay in the 2% band',
    intro: 'Your net pay at this salary, why your unemployment contribution is still reduced, and the narrow range where earning more leaves you with less.',
    resume: `On ${EN.eur(B)} gross a month, your 2026 take-home pay in Austria is ${EN.eur(k.nettoMonat, 2)}. Social insurance takes ${EN.eur(sv.summe, 2)} and wage tax ${EN.eur(lst.lst, 2)}. You sit in the third step of the unemployment insurance scale introduced this year: between ${EN.eur(s1[0])} and ${EN.eur(s2[0])} employees pay ${EN.pct(s2[1])} instead of ${EN.pct(P.sv.dn.av, 2)}, so your total social insurance rate is ${EN.pct(sv.satz, 2)}. For income tax you are already in the 30 percent band, which means you keep about ${EN.num((1 - grenz) * 100)} cents of each extra euro. Watch the line at ${EN.eur(s2[0])}. One euro above it, the full unemployment rate applies to your whole salary and your net drops by ${EN.eur(delleMonat, 2)} a month; only from about ${EN.eur(aufgeholt)} gross are you back where you were. Holiday pay and Christmas pay, the 13th and 14th salary, bring ${EN.eur(uzNetto, 2)} and ${EN.eur(wrNetto, 2)} net, for ${EN.eur(k.nettoJahr)} over the year.`,
    faqs: [
      { q: 'Is a raise from 2,500 to 2,650 euros gross worth it?', a: `Compared with today, yes: ${EN.eur(zk.nettoMonat, 2)} instead of ${EN.eur(k.nettoMonat, 2)} net. But ${EN.eur(Z)} leaves you with less than ${EN.eur(s2[0])}, which nets ${EN.eur(top.nettoMonat, 2)}. Above that line the full unemployment contribution applies to the whole salary and net pay first drops by ${EN.eur(delleMonat, 2)}. Only from ${EN.eur(aufgeholt)} gross (${EN.eur(auf.nettoMonat, 2)} net) are you level again. So ask for ${EN.eur(s2[0])}, or clearly more than ${EN.eur(Z)}.` },
      { q: 'Does the reduced rate at 2,500 euros also cover holiday and Christmas pay?', a: `Yes. For special payments (Sonderzahlungen) the unemployment rate depends on the size of each payment on its own, according to the Chamber of Commerce's 2026 contribution guide. A holiday payment of ${EN.eur(B)} also falls in the ${EN.pct(s2[1])} band, and ${EN.eur(k.uz.svSz, 2)} is deducted, without the chamber levy or housing subsidy. If a bonus pushes a single payment above ${EN.eur(s2[0])}, the full rate applies to all of it.` },
      { q: 'How much does working in Vienna cost on 2,500 euros gross?', a: `Vienna's housing subsidy contribution (Wohnbauförderungsbeitrag) rose to ${EN.pct(P.sv.dn.wf_wien, 2)} in January 2026, against ${EN.pct(P.sv.dn.wf, 1)} elsewhere. At ${EN.eur(B)} that means ${EN.eur(k.nettoMonat - w.nettoMonat, 2)} less a month (${EN.eur(w.nettoMonat, 2)} net) and ${EN.eur(k.nettoJahr - w.nettoJahr, 2)} a year. The gap is smaller than the extra contribution because it slightly lowers your wage tax. Special payments are not affected.` },
    ],
    body: (h) => `
<h2>Payslip at ${h.eur(B)} with the reduced unemployment rate</h2>
${h.table(['Item', 'Rate', 'Month'], [
  ['Gross pay', '', h.eur(B, 2)],
  ['Health insurance', h.pct(h.P.sv.dn.kv, 2), h.eur(sv.kv, 2)],
  ['Pension insurance', h.pct(h.P.sv.dn.pv, 2), h.eur(sv.pv, 2)],
  ['Unemployment insurance', h.pct(avSatz(B), 2), h.eur(sv.av, 2)],
  ['Chamber of Labour levy', h.pct(h.P.sv.dn.ak, 2), h.eur(sv.ak, 2)],
  ['Housing subsidy', h.pct(h.P.sv.dn.wf, 2), h.eur(sv.wf, 2)],
  ['Wage tax', h.pct(lst.lst / B, 2), h.eur(lst.lst, 2)],
  ['Net', '', h.eur(k.nettoMonat, 2)],
], 'Regular pay outside Vienna, no children, no commuter allowance', ['l', 'r', 'r'])}
<h2>The band from ${h.eur(s1[0])} to ${h.eur(s2[0])}</h2>
<p>Since 2026 the employee's unemployment contribution comes in four steps (${h.src('oegkAv', 'ÖGK health insurer')}). At ${h.eur(B)} you are in the third, paying ${h.pct(s2[1])} rather than ${h.pct(h.P.sv.dn.av, 2)}, which saves ${h.eur(B * (h.P.sv.dn.av - s2[1]), 2)} a month. Your employer still pays its full ${h.pct(h.P.sv.dg.av, 2)}. Entering this band was itself a step: at ${h.eur(s1[0])} the rate was ${h.pct(s1[1])}, one euro more and ${h.pct(s2[1])} applied to everything, so net fell from ${h.eur(vorBand.nettoMonat, 2)} to ${h.eur(imBand.nettoMonat, 2)}.</p>
<h2>The net-pay dip just above ${h.eur(s2[0])}</h2>
<p>The bigger step is ahead. At ${h.eur(s2[0] + 1)} gross the rate jumps from ${h.pct(s2[1])} to ${h.pct(h.P.sv.dn.av, 2)} on your entire salary. One extra euro of gross costs ${h.eur(delleMonat, 2)} of net a month, and ${h.eur(delleJahr, 2)} a year once the two special payments move to the full rate too.</p>
${h.table(['Monthly gross', 'Unemployment rate', 'Net per month', 'Net per year'], [
  [h.eur(B), h.pct(avSatz(B)), h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
  [h.eur(s2[0]), h.pct(avSatz(s2[0])), h.eur(top.nettoMonat, 2), h.eur(top.nettoJahr, 2)],
  [h.eur(s2[0] + 1), h.pct(avSatz(s2[0] + 1), 2), h.eur(danach.nettoMonat, 2), h.eur(danach.nettoJahr, 2)],
  [h.eur(aufgeholt), h.pct(avSatz(aufgeholt), 2), h.eur(auf.nettoMonat, 2), h.eur(auf.nettoJahr, 2)],
], 'Figures from this site’s engine, 14 salaries, outside Vienna', ['r', 'r', 'r', 'r'])}
<p>Wage tax softens the dip a little, since higher contributions reduce taxable income. In a pay talk starting from ${h.eur(B)}, either stay at or below ${h.eur(s2[0])} or go beyond ${h.eur(aufgeholt)}. The ${h.a('gehaltserhoehung', 'pay rise calculator')} checks any figure you are offered.</p>
<h2>Already in the 30 percent band</h2>
<p>Scaled to a year, ${h.eur(B)} gives a taxable base of ${h.eur(lst.bemessungJahr)}; the ${h.eur(lst.bemessungJahr - h.P.tarif.grenzen[1])} above ${h.eur(h.P.tarif.grenzen[1])} are taxed at 30 percent (${h.src('estg33', 'section 33(1) Income Tax Act')}). Add ${h.pct(sv.satz, 2)} social insurance and each extra gross euro costs about ${h.pct(grenz)}. That rate stays the same all the way to ${h.a('netto-3000', '3,000 euros gross')}; only the unemployment step changes on the way.</p>
<p>For parents, this salary is a borderline case for the Familienbonus Plus child credit. One child under 18 gets the full ${h.eur(h.P.absetzbetraege.familienbonus_monat_u18, 2)} a month and lifts net pay to ${h.eur(k1.nettoMonat, 2)}. A second child adds almost nothing, because your scale tax of ${h.eur(lst.tarifMonat, 2)} a month is the ceiling: net reaches only ${h.eur(k2.nettoMonat, 2)}. Splitting the credit with a higher-earning partner recovers what you cannot use.</p>
<p>The ${h.a('home', 'gross-to-net calculator')} adds children or a commuter allowance to your own case. One step down: ${h.a('netto-2000', '2,000 euros gross')}, with no unemployment contribution at all.</p>
`,
  },
});
