import { defineGuide } from '../../lib/guide-types';
import { kurz, arbeitslosengeld } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const B = 6000;
const k = kurz(B);
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const HBG = P.sv.hbg_monat, HBG_SZ = P.sv.hbg_sz_jahr;
const abstand = HBG - B, szSumme = 2 * B, szLuft = HBG_SZ - szSumme;
const svSzSatz = P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av;
const kH = kurz(HBG);
/** Grenzbelastung unter und über der Höchstbeitragsgrundlage (40-%-Stufe in beiden Fällen). */
const s40 = P.tarif.saetze[3];
const grenzUnter = sv.satz + (1 - sv.satz) * s40;
/** Effektiver SV-Anteil am laufenden Bezug rund um die Grenze. */
const reihe = [B, B + 500, HBG, HBG + 570, 8000].map((b) => ({ b, s: svLaufend(b).summe, n: kurz(b).nettoMonat }));
/** Arbeitslosengeld: Höchstbemessungsgrundlage inkl. Sonderzahlungen → laufendes Brutto, ab dem nichts mehr steigt. */
const alg = arbeitslosengeld(B), algAb = P.alg.hoechstbemessung_monat * 6 / 7, alg5 = arbeitslosengeld(5000);

export default defineGuide({
  id: 'netto-6000',
  group: 'betrag',
  order: 80,
  mini: 'nettoMonat',
  miniDefaults: { b: B },
  related: ['netto-5000', 'netto-7000', 'hoechstbeitragsgrundlage', 'arbeitslosengeld', 'sozialversicherung'],
  sources: ['oegkWerte', 'estg33', 'amsWerte', 'alvg21', 'bmfRechner'],
  de: {
    slug: '6000-euro-brutto-netto',
    nav: '6.000 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: noch volle Sozialversicherung, ${DE.eur(abstand)} unter der Höchstbeitragsgrundlage.`,
    title: '6000 Euro brutto in netto 2026: kurz vor der Beitragsgrenze',
    description: `6000 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat, ${DE.eur(abstand)} unter der Höchstbeitragsgrundlage, mit vollen Beiträgen auf beide Sonderzahlungen.`,
    h1: '6.000 Euro brutto: Netto knapp unter der Beitragsgrenze',
    intro: 'Das letzte Gehalt dieser Reihe, auf das jeder Euro Sozialversicherung zahlt, und eines, bei dem das Arbeitslosengeld schon nicht mehr mitwächst.',
    resume: `Bei ${DE.eur(B)} brutto bleiben 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat. Abgezogen werden ${DE.eur(sv.summe, 2)} Sozialversicherung, das volle Paket von ${DE.pct(sv.satz, 2)}, und ${DE.eur(lst.lst, 2)} Lohnsteuer in der 40-Prozent-Stufe. Das Gehalt liegt ${DE.eur(abstand)} unter der Höchstbeitragsgrundlage von ${DE.eur(HBG)} im Monat; bis dorthin zahlt jeder zusätzliche Euro noch Beiträge, insgesamt gehen rund ${DE.pct(grenzUnter, 1)} davon ab. Auch die beiden Sonderzahlungen sind voll beitragspflichtig: Zusammen ergeben sie ${DE.eur(szSumme)}, die eigene Jahresgrenze für Sonderzahlungen liegt bei ${DE.eur(HBG_SZ)}. Erst ab ${DE.eur(HBG)} Monatsgehalt sind beide Grenzen gleichzeitig erreicht, das Netto beträgt dann ${DE.eur(kH.nettoMonat, 2)}. Eine andere Obergrenze ist schon überschritten: Das Arbeitslosengeld wird höchstens aus ${DE.eur(P.alg.hoechstbemessung_monat)} im Monat einschließlich Sonderzahlungen berechnet, das entspricht etwa ${DE.eur(algAb)} laufendem Brutto. Bei ${DE.eur(B)} beträgt es laut Rechner ${DE.eur(alg.tagsatz, 2)} pro Tag, genauso viel wie bei jedem höheren Gehalt. Das Jahresnetto liegt bei ${DE.eur(k.nettoJahr)}.`,
    faqs: [
      { q: 'Wann hört bei 6.000 Euro brutto die Sozialversicherung auf zu steigen?', a: `Ab einem Monatsgehalt von ${DE.eur(HBG)}, der Höchstbeitragsgrundlage 2026 (ÖGK). Bei ${DE.eur(B)} fehlen noch ${DE.eur(abstand)}. Bis dahin zahlen Sie ${DE.pct(sv.satz, 2)} auf jeden Euro, an der Grenze ${DE.eur(svLaufend(HBG).summe, 2)} im Monat. Was darüber liegt, ist beitragsfrei, unterliegt aber weiter der Lohnsteuer. Für Urlaubs- und Weihnachtsgeld gilt eine eigene Jahresgrenze von ${DE.eur(HBG_SZ)}.` },
      { q: 'Bekomme ich bei 6.000 Euro brutto mehr Arbeitslosengeld als bei 5.000 Euro?', a: `Ja, aber nicht mehr als bei jedem höheren Gehalt. Das AMS rechnet höchstens mit ${DE.eur(P.alg.hoechstbemessung_monat)} Bemessungsgrundlage im Monat, Sonderzahlungen eingerechnet. Das entspricht rund ${DE.eur(algAb)} laufendem Brutto. Laut Rechner sind es bei ${DE.eur(5000)} ${DE.eur(alg5.tagsatz, 2)} pro Tag, bei ${DE.eur(B)} bereits der Höchstwert von ${DE.eur(alg.tagsatz, 2)}, also rund ${DE.eur(alg.monat30)} in 30 Tagen. Maßgeblich sind die Beitragsgrundlagen vor der Arbeitslosigkeit.` },
      { q: 'Zahle ich bei 6.000 Euro brutto auf Urlaubs- und Weihnachtsgeld volle Beiträge?', a: `Ja. Für Sonderzahlungen gilt eine eigene Höchstbeitragsgrundlage von ${DE.eur(HBG_SZ)} im Jahr. Bei ${DE.eur(B)} Monatsgehalt summieren sich beide auf ${DE.eur(szSumme)}, es bleiben ${DE.eur(szLuft)} Abstand. Abgezogen werden je Sonderzahlung ${DE.eur(k.uz.svSz, 2)}, das sind ${DE.pct(svSzSatz, 2)} ohne AK-Umlage und Wohnbauförderung. Erst über ${DE.eur(HBG_SZ / 2)} Monatsgehalt wird ein Teil der Weihnachtsremuneration beitragsfrei.` },
    ],
    body: (h) => `
<h2>Lohnzettel bei ${h.eur(B)} brutto</h2>
${h.table(['Position', 'Monat', 'Jahr mit 14 Bezügen'], [
  ['Brutto', h.eur(B, 2), h.eur(k.bruttoJahr)],
  ['Sozialversicherung laufend', h.eur(sv.summe, 2), h.eur(sv.summe * 12, 2)],
  ['Sozialversicherung Sonderzahlungen', '', h.eur(k.uz.svSz + k.wr.svSz, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.eur(k.lstJahr, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
], 'Außerhalb Wiens, ohne Kinder und Pendlerpauschale', ['l', 'r', 'r'])}
<h2>Noch ${h.eur(abstand)} bis zur Höchstbeitragsgrundlage</h2>
<p>Die Sozialversicherung wird nur bis zu einem Monatsbezug von ${h.eur(HBG)} berechnet (${h.src('oegkWerte', 'ÖGK, Werte 2026')}). Darüber zahlt man keinen Beitrag mehr, der Anteil der Sozialversicherung am Gehalt sinkt. Bei ${h.eur(B)} ist davon noch nichts zu spüren: Kranken-, Pensions- und Arbeitslosenversicherung, AK-Umlage und Wohnbauförderung fallen auf den vollen Betrag an. Die Tabelle zeigt, wie sich der Anteil ab der Grenze verändert.</p>
${h.table(['Monatsbrutto', 'SV im Monat', 'SV-Anteil', 'Netto im Monat'], reihe.map((r) => [h.eur(r.b), h.eur(r.s, 2), h.pct(r.s / r.b, 1), h.eur(r.n, 2)]), 'Laufender Bezug, außerhalb Wiens, Werte aus dem Motor', ['r', 'r', 'r', 'r'])}
<h2>Sonderzahlungen: ${h.eur(szSumme)} von ${h.eur(HBG_SZ)}</h2>
<p>Für Urlaubszuschuss und Weihnachtsremuneration gibt es eine eigene Grenze von ${h.eur(HBG_SZ)} im Kalenderjahr, also zwei Monatsgrenzen. Bei ${h.eur(B)} sind beide Zahlungen voll beitragspflichtig, mit ${h.pct(svSzSatz, 2)} je Zahlung. Die Lohnsteuer darauf bleibt bei ${h.pct(h.P.sonderzahlungen.stufen[1][1])} nach dem Freibetrag: Netto bringt der Urlaubszuschuss ${h.eur(k.uz.sz - k.uz.svSz - k.uz.lstSzFest, 2)}. Wer mehr als ${h.eur(HBG_SZ / 2)} im Monat verdient, sieht bei der Weihnachtsremuneration einen niedrigeren Abzug als beim Urlaubszuschuss, weil die Jahresgrenze dann schon teilweise verbraucht ist. Mehr dazu im Ratgeber zur ${h.a('hoechstbeitragsgrundlage', 'Höchstbeitragsgrundlage')}.</p>
<h2>Arbeitslosengeld: schon am Höchstbetrag</h2>
<p>Für das Arbeitslosengeld gilt eine eigene, niedrigere Grenze. Das AMS bemisst es nach ${h.src('alvg21', '§ 21 AlVG')} aus den Beitragsgrundlagen einschließlich Sonderzahlungen, höchstens aus ${h.eur(h.P.alg.hoechstbemessung_monat)} im Monat (${h.src('amsWerte', 'AMS')}). Bei vierzehn Bezügen ist diese Grenze ab etwa ${h.eur(algAb)} laufendem Brutto erreicht. Ein Gehalt von ${h.eur(B)} liegt darüber: Laut Rechner gäbe es ${h.eur(alg.tagsatz, 2)} pro Tag, rund ${h.eur(alg.monat30)} in 30 Tagen, so viel wie bei ${h.eur(10000)}. Das sind rund ${h.pct(alg.monat30 / k.nettoMonat)} des laufenden Monatsnettos, und der Abstand wächst mit jedem Euro Gehalt über der Grenze. Die Details erklärt der ${h.a('arbeitslosengeld', 'Arbeitslosengeld-Rechner')}.</p>
<h2>Was ein Euro mehr bei ${h.eur(B)} kostet</h2>
<p>Bis ${h.eur(HBG)} gehen von jedem zusätzlichen Euro ${h.pct(sv.satz, 2)} Sozialversicherung und vom Rest ${h.pct(s40)} Lohnsteuer ab (${h.src('estg33', '§ 33 EStG')}), zusammen ${h.pct(grenzUnter, 1)}. Eine Erhöhung auf ${h.eur(HBG)} bringt ${h.eur(kH.nettoMonat - k.nettoMonat, 2)} netto im Monat. Erst darüber bleibt mehr hängen, wie die Seite zu ${h.a('netto-7000', '7.000 Euro brutto')} zeigt.</p>
<p>Ihr eigener Fall im ${h.a('home', 'Brutto-Netto-Rechner')}; eine Stufe darunter liegt ${h.a('netto-5000', '5.000 Euro brutto')}.</p>
`,
  },
  en: {
    slug: '6000-euro-gross-to-net',
    nav: '€6,000 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: full social insurance, ${EN.eur(abstand)} below the contribution ceiling.`,
    title: '6000 Euro Gross to Net in Austria 2026: Below the Ceiling',
    description: `6000 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month, ${EN.eur(abstand)} below the social insurance ceiling, with full contributions on both of the extra salaries.`,
    h1: '6,000 euros gross: net pay just under the ceiling',
    intro: 'Every euro of this salary still pays social insurance, while unemployment benefit has already stopped growing with it.',
    resume: `On ${EN.eur(B)} gross a month, your 2026 take-home pay in Austria is ${EN.eur(k.nettoMonat, 2)}. Social insurance takes the full ${EN.pct(sv.satz, 2)}, or ${EN.eur(sv.summe, 2)}, and wage tax ${EN.eur(lst.lst, 2)} in the 40 percent band. You are ${EN.eur(abstand)} below the monthly contribution ceiling (Höchstbeitragsgrundlage) of ${EN.eur(HBG)}, the salary above which no further social insurance is charged. Until you reach it, each extra euro loses about ${EN.pct(grenzUnter, 1)} to contributions and tax. Your holiday and Christmas pay are fully insured too: together they make ${EN.eur(szSumme)}, against a separate annual ceiling of ${EN.eur(HBG_SZ)} for special payments. Only at ${EN.eur(HBG)} a month do both ceilings bite, with net pay of ${EN.eur(kH.nettoMonat, 2)}. One cap is already behind you. Unemployment benefit is calculated from at most ${EN.eur(P.alg.hoechstbemessung_monat)} a month including special payments, which corresponds to about ${EN.eur(algAb)} of regular gross. At ${EN.eur(B)} the calculator gives ${EN.eur(alg.tagsatz, 2)} a day, the same as on any higher salary. Annual net pay is ${EN.eur(k.nettoJahr)}.`,
    faqs: [
      { q: 'When does social insurance stop rising for someone on 6,000 euros gross?', a: `At ${EN.eur(HBG)} a month, the 2026 contribution ceiling published by the ÖGK health insurer. At ${EN.eur(B)} you are ${EN.eur(abstand)} short. Until then you pay ${EN.pct(sv.satz, 2)} on every euro; at the ceiling that is ${EN.eur(svLaufend(HBG).summe, 2)} a month. Pay above it is free of contributions but still taxed. Holiday and Christmas pay have their own annual ceiling of ${EN.eur(HBG_SZ)}.` },
      { q: 'Is unemployment benefit higher on 6,000 than on 5,000 euros gross?', a: `Yes, but no higher than on any bigger salary. The AMS employment service uses at most ${EN.eur(P.alg.hoechstbemessung_monat)} a month as the basis, special payments included, which matches roughly ${EN.eur(algAb)} of regular gross. By our calculator, ${EN.eur(5000)} gives ${EN.eur(alg5.tagsatz, 2)} a day and ${EN.eur(B)} already the maximum of ${EN.eur(alg.tagsatz, 2)}, about ${EN.eur(alg.monat30)} for 30 days. What counts are the contribution bases before you became unemployed.` },
      { q: 'Are holiday and Christmas pay fully insured on 6,000 euros gross?', a: `Yes. Special payments have their own ceiling of ${EN.eur(HBG_SZ)} a year. On a ${EN.eur(B)} monthly salary the two add up to ${EN.eur(szSumme)}, leaving ${EN.eur(szLuft)} of room. Each payment loses ${EN.eur(k.uz.svSz, 2)}, which is ${EN.pct(svSzSatz, 2)} with no chamber levy or housing subsidy. Only above ${EN.eur(HBG_SZ / 2)} a month does part of the Christmas payment become contribution-free.` },
    ],
    body: (h) => `
<h2>Payslip at ${h.eur(B)} gross</h2>
${h.table(['Item', 'Month', 'Year with 14 salaries'], [
  ['Gross', h.eur(B, 2), h.eur(k.bruttoJahr)],
  ['Social insurance, regular pay', h.eur(sv.summe, 2), h.eur(sv.summe * 12, 2)],
  ['Social insurance, special payments', '', h.eur(k.uz.svSz + k.wr.svSz, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.eur(k.lstJahr, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
], 'Outside Vienna, no children, no commuter allowance', ['l', 'r', 'r'])}
<h2>${h.eur(abstand)} below the contribution ceiling</h2>
<p>Austrian social insurance is charged only up to ${h.eur(HBG)} of monthly pay (${h.src('oegkWerte', 'ÖGK, 2026 values')}). Above that there are no further contributions, so their share of your salary starts to fall. At ${h.eur(B)} nothing is capped yet: health, pension and unemployment insurance, the Chamber of Labour levy and the housing subsidy all apply to the full amount. The table shows how the share changes past the ceiling.</p>
${h.table(['Monthly gross', 'Social insurance', 'Share of gross', 'Net per month'], reihe.map((r) => [h.eur(r.b), h.eur(r.s, 2), h.pct(r.s / r.b, 1), h.eur(r.n, 2)]), 'Regular pay, outside Vienna, engine figures', ['r', 'r', 'r', 'r'])}
<h2>Special payments: ${h.eur(szSumme)} of ${h.eur(HBG_SZ)}</h2>
<p>Holiday pay and Christmas pay have their own ceiling of ${h.eur(HBG_SZ)} per calendar year, twice the monthly one. At ${h.eur(B)} both are fully insured at ${h.pct(svSzSatz, 2)}. Tax on them stays at ${h.pct(h.P.sonderzahlungen.stufen[1][1])} after the allowance, and holiday pay nets ${h.eur(k.uz.sz - k.uz.svSz - k.uz.lstSzFest, 2)}. Earn more than ${h.eur(HBG_SZ / 2)} a month and the Christmas payment carries a smaller deduction than holiday pay, because the annual ceiling is already partly used. The ${h.a('hoechstbeitragsgrundlage', 'contribution ceiling guide')} explains the details.</p>
<h2>Unemployment benefit has already peaked</h2>
<p>Unemployment benefit (Arbeitslosengeld) has its own, lower cap. The AMS calculates it under ${h.src('alvg21', 'section 21 Unemployment Insurance Act')} from your contribution bases including special payments, up to ${h.eur(h.P.alg.hoechstbemessung_monat)} a month (${h.src('amsWerte', 'AMS')}). With fourteen salaries that limit is reached at about ${h.eur(algAb)} of regular gross. At ${h.eur(B)} the calculator gives ${h.eur(alg.tagsatz, 2)} a day, about ${h.eur(alg.monat30)} for 30 days, exactly what someone on ${h.eur(10000)} would get. That is about ${h.pct(alg.monat30 / k.nettoMonat)} of your regular monthly net pay, and the gap widens with every euro of salary above the cap. See the ${h.a('arbeitslosengeld', 'unemployment benefit calculator')}.</p>
<h2>What one more euro costs at ${h.eur(B)}</h2>
<p>Up to ${h.eur(HBG)}, each extra euro loses ${h.pct(sv.satz, 2)} to social insurance and ${h.pct(s40)} of the rest to wage tax (${h.src('estg33', 'section 33 Income Tax Act')}), ${h.pct(grenzUnter, 1)} in total. A raise to ${h.eur(HBG)} adds ${h.eur(kH.nettoMonat - k.nettoMonat, 2)} net a month. Beyond the ceiling you keep more of each euro, as the ${h.a('netto-7000', '7,000 euro page')} shows.</p>
<p>Your own case in the ${h.a('home', 'gross-to-net calculator')}; one step down is ${h.a('netto-5000', '5,000 euros gross')}.</p>
`,
  },
});
