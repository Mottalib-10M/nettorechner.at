import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { rechneJahr } from '../../lib/engine/jahr';
import { avSatz } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

/** Teilzeit als Anteil eines Vollzeitgehalts, aus dem Motor. */
const ANTEILE = [0.5, 0.6, 0.75, 0.8, 1];
const reihe = (v: number) => { const voll = kurz(v); return ANTEILE.map((a) => { const k = kurz(v * a); return { a, b: v * a, k, rel: k.nettoMonat / voll.nettoMonat }; }); };
const V1 = 3200, V2 = 4500;
const r1 = reihe(V1), r2 = reihe(V2);
const halb = r1[0], voll1 = r1[4];
/** Monatsgehalt, bis zu dem Sonderzahlungen lohnsteuerfrei bleiben (Freigrenze des Sechstels ÷ 2). */
const S = P.sonderzahlungen;
const freiBis = S.freigrenze_sechstel / 2;
/** Pendlerpauschale bei Teilzeit: 75 % von 3.200 €, 30 km, kleines Pauschale, je nach Fahrten im Monat. */
const PB = V1 * 0.75, km = 30;
const pOhne = kurz(PB);
const pend = (['voll', 'zweiDrittel', 'einDrittel'] as const).map((f) => ({ f, k: kurz(PB, { pendler: 'klein', km, fahrten: f }) }));
const PP = P.pendlerpauschale;
/** Wechsel in Teilzeit ab September (3.200 → 1.600 €): Weihnachtsremuneration nach neuem bzw. altem Gehalt. */
const wechsel = (wr: number) => rechneJahr(Array.from({ length: 12 }, (_, i) => ({ laufend: i < 8 ? V1 : V1 / 2, sz: i === 5 ? V1 : i === 10 ? wr : 0 })));
const wNeu = wechsel(V1 / 2), wAlt = wechsel(V1);
const R = P.absetzbetraege;

export default defineGuide({
  id: 'teilzeit',
  group: 'lohn',
  order: 50,
  mini: 'teilzeit',
  related: ['stundenlohn', 'jahressechstel', 'pendlerpauschale', 'sozialversicherung', 'geringfuegig', 'arbeitnehmerveranlagung'],
  sources: ['estg33', 'oegkAv', 'estg77', 'estg16', 'estg41'],
  de: {
    slug: 'teilzeit-brutto-netto',
    nav: 'Teilzeit brutto netto',
    card: 'Was bei 50, 60, 75 oder 80 Prozent netto bleibt und warum das Netto langsamer sinkt als das Brutto.',
    title: 'Teilzeit brutto netto 2026: was bei 50 bis 80 Prozent bleibt',
    description: `Teilzeit brutto netto 2026: Bei ${DE.pct(0.5)} von ${DE.eur(V1)} bleiben ${DE.pct(halb.rel)} des Vollzeit-Nettos. Tabelle für 50 bis 80 %, Pendlerpauschale und Wechsel im Lauf des Jahres.`,
    h1: 'Teilzeit: wie viel netto bei weniger Stunden bleibt',
    intro: 'Warum eine Halbierung der Stunden das Netto nicht halbiert, was mit Pendlerpauschale und Sonderzahlungen passiert und worauf beim Wechsel während des Jahres zu achten ist.',
    resume: `Wer in Teilzeit wechselt, verliert netto prozentual weniger als brutto. Bei einem Vollzeitgehalt von ${DE.eur(V1)} brutto bleiben ${DE.eur(voll1.k.nettoMonat, 2)} netto; mit ${DE.pct(0.5)} der Stunden sind es ${DE.eur(halb.k.nettoMonat, 2)}, also ${DE.pct(halb.rel)} des bisherigen Nettos. Drei Gründe wirken zusammen. Die Lohnsteuer fällt im Stufentarif überproportional, bei ${DE.eur(halb.b)} brutto fast auf null. Die Arbeitslosenversicherung entfällt bis ${DE.eur(P.sv.av_staffel[0][0])} brutto ganz und ist bis ${DE.eur(P.sv.av_staffel[2][0])} herabgesetzt. Bis zu einem Monatsgehalt von ${DE.eur(freiBis, 2)} sind Urlaubs- und Weihnachtsgeld zudem lohnsteuerfrei, weil das Jahressechstel unter der Freigrenze von ${DE.eur(S.freigrenze_sechstel)} bleibt. Das Pendlerpauschale steht in Teilzeit weiter zu, gekürzt nur nach der Zahl der Fahrten: ab ${PP.fahrten_voll} Fahrten im Monat voll, ab ${PP.fahrten_zwei_drittel} zu zwei Dritteln, ab ${PP.fahrten_ein_drittel} zu einem Drittel. Wer während des Jahres reduziert, sollte die Weihnachtsremuneration im Blick behalten: Ist sie noch nach dem Vollzeitgehalt bemessen, kann die Kontrollrechnung im Dezember Lohnsteuer nachfordern.`,
    faqs: [
      { q: 'Wie viel netto bleibt bei 50 Prozent Teilzeit?', a: `Bei einem Vollzeitgehalt von ${DE.eur(V1)} brutto ergibt die halbe Stundenzahl ${DE.eur(halb.b)} brutto und ${DE.eur(halb.k.nettoMonat, 2)} netto im Monat, ${DE.pct(halb.rel)} des Vollzeit-Nettos von ${DE.eur(voll1.k.nettoMonat, 2)}. Bei ${DE.eur(V2)} Vollzeit sind es ${DE.eur(r2[0].k.nettoMonat, 2)}, ${DE.pct(r2[0].rel)} des Vollzeit-Nettos. Der Unterschied kommt vom Stufentarif der Lohnsteuer und der herabgesetzten Arbeitslosenversicherung für kleine Einkommen.` },
      { q: 'Warum sinkt das Netto bei Teilzeit weniger als das Brutto?', a: `Weil die Abzüge mit dem Einkommen nicht gleichmäßig, sondern stärker als proportional steigen. Fällt das Gehalt, verliert man zuerst Euro, die mit ${DE.pct(P.tarif.saetze[2])} oder ${DE.pct(P.tarif.saetze[3])} besteuert waren. Die Absetzbeträge bleiben gleich hoch, und unter ${DE.eur(P.sv.av_staffel[2][0])} sinkt die Arbeitslosenversicherung von ${DE.pct(P.sv.dn.av, 2)} schrittweise bis auf null. Beides zusammen bremst den Rückgang des Nettos.` },
      { q: 'Steht mir in Teilzeit das volle Pendlerpauschale zu?', a: `Ja, wenn Sie an mindestens ${PP.fahrten_voll} Tagen im Monat zur Arbeit fahren. Die Teilzeit selbst kürzt das Pauschale nicht, nur die Zahl der Fahrten: ${PP.fahrten_zwei_drittel} bis ${PP.fahrten_voll - 1} Fahrten ergeben zwei Drittel, ${PP.fahrten_ein_drittel} bis ${PP.fahrten_zwei_drittel - 1} ein Drittel (§ 16 EStG). Eine Viertagewoche bringt also das volle Pauschale, zwei Bürotage pro Woche meist zwei Drittel. Der Pendlereuro wird im selben Verhältnis gekürzt.` },
      { q: 'Was passiert mit dem Weihnachtsgeld, wenn ich im Herbst in Teilzeit wechsle?', a: `Wird die Weihnachtsremuneration noch nach dem Vollzeitgehalt bezahlt, kann sie über ein Sechstel der tatsächlich bezahlten Monatsgehälter hinausgehen. Dann versteuert der Arbeitgeber im Dezember den Überhang nach dem Tarif nach (§ 77 Abs. 4a EStG). Bei einem Wechsel von ${DE.eur(V1)} auf ${DE.eur(V1 / 2)} ab September sind das ${DE.eur(wAlt.kontrolle.mehrsteuer, 2)}. Wird die Weihnachtsremuneration nach dem neuen Gehalt bemessen, fällt nichts an.` },
      { q: 'Zahle ich in Teilzeit Arbeitslosenversicherung?', a: `Bis ${DE.eur(P.sv.av_staffel[0][0])} brutto im Monat nicht, darüber ${DE.pct(P.sv.av_staffel[1][1])} bis ${DE.eur(P.sv.av_staffel[1][0])}, ${DE.pct(P.sv.av_staffel[2][1])} bis ${DE.eur(P.sv.av_staffel[2][0])} und danach den vollen Satz von ${DE.pct(P.sv.dn.av, 2)}. Versichert sind Sie trotzdem voll, weil der Arbeitgeber seinen Anteil weiter zahlt. Haben Sie zwei Teilzeitjobs, wird jeder für sich beurteilt; die Einkommen werden nicht zusammengerechnet.` },
    ],
    body: (h) => `
<h2>Teilzeit-Netto in Prozent des Vollzeit-Nettos</h2>
<p>Die Tabelle rechnet zwei Vollzeitgehälter auf Teilzeit herunter. Das Brutto sinkt genau im Verhältnis der Stunden, das Netto nicht.</p>
${h.table(['Stunden', `Brutto (Vollzeit ${h.eur(V1)})`, 'Netto', 'Netto in % der Vollzeit', `Brutto (Vollzeit ${h.eur(V2)})`, 'Netto', 'Netto in % der Vollzeit'], r1.map((z, i) => [h.pct(z.a), h.eur(z.b), h.eur(z.k.nettoMonat, 2), h.pct(z.rel, 1), h.eur(r2[i].b), h.eur(r2[i].k.nettoMonat, 2), h.pct(r2[i].rel, 1)]), 'Laufender Monat 2026, außerhalb Wiens, ohne Kinder und Pendlerpauschale; Werte aus dem Rechner dieser Seite', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>Bei ${h.pct(0.8)} der Stunden bleiben je nach Ausgangsgehalt rund ${h.pct(r1[3].rel)} bis ${h.pct(r2[3].rel)} des Nettos, bei der Hälfte ${h.pct(r2[0].rel)} bis ${h.pct(halb.rel)}. Je niedriger das Vollzeitgehalt, desto stärker federt das System die Reduktion ab, weil ein größerer Teil des Gehalts in die steuerfreie Stufe und unter die Grenzen der Arbeitslosenversicherung rutscht.</p>
<!--mini:teilzeit-->
<h2>Drei Gründe, warum Teilzeit netto weniger kostet</h2>
<h3>Der Stufentarif</h3>
<p>Die Lohnsteuer berechnet sich nach dem Tarif des ${h.src('estg33', '§ 33 EStG')}. Wer reduziert, verliert die obersten Euro seines Gehalts zuerst, und genau die waren am höchsten besteuert. Der Verkehrsabsetzbetrag von ${h.eur(R.verkehrsabsetzbetrag)} im Jahr bleibt gleich. Bei ${h.eur(halb.b)} brutto bleiben so nur ${h.eur(halb.k.lstMonat, 2)} Lohnsteuer im Monat, bei Vollzeit waren es ${h.eur(voll1.k.lstMonat, 2)}.</p>
<h3>Die Staffel der Arbeitslosenversicherung</h3>
<p>Seit 2026 zahlen Dienstnehmer bis ${h.eur(h.P.sv.av_staffel[0][0])} brutto keine Arbeitslosenversicherung, darüber gestaffelt ${h.pct(h.P.sv.av_staffel[1][1])} und ${h.pct(h.P.sv.av_staffel[2][1])}, erst ab ${h.eur(h.P.sv.av_staffel[2][0])} den vollen Satz (${h.src('oegkAv', 'ÖGK')}). Teilzeitgehälter liegen oft in diesem Bereich: ${h.eur(r1[2].b)} brutto zahlen ${h.pct(avSatz(r1[2].b))}, ${h.eur(r2[1].b)} schon ${h.pct(avSatz(r2[1].b), 2)}. Wer die Stunden plant, kann auf diese Grenzen schauen; ein paar Euro unter einer Stufe können netto mehr bringen als ein paar Euro darüber.</p>
<h3>Die Freigrenze bei den Sonderzahlungen</h3>
<p>Ist das Jahressechstel nicht höher als ${h.eur(S.freigrenze_sechstel)}, sind Urlaubszuschuss und Weihnachtsremuneration lohnsteuerfrei. Das gilt bei gleichbleibendem Gehalt bis ${h.eur(freiBis, 2)} brutto im Monat, also für viele Halbtagsstellen. Darüber werden die Sonderzahlungen mit den festen Sätzen besteuert; bei ${h.eur(halb.b)} kostet der Urlaubszuschuss ${h.eur(halb.k.uz.lstSzFest, 2)} Lohnsteuer. Mehr zu beiden Zahlungen unter ${h.a('dreizehntes-gehalt', '13. und 14. Gehalt')}.</p>
<h2>Pendlerpauschale in Teilzeit: die Fahrten zählen</h2>
<p>Ob Sie Teilzeit oder Vollzeit arbeiten, ist für das Pendlerpauschale gleichgültig. Entscheidend ist, an wie vielen Tagen im Monat Sie die Strecke zur Arbeit fahren (${h.src('estg16', '§ 16 Abs. 1 Z 6 EStG')}):</p>
<ul>
<li>mindestens ${PP.fahrten_voll} Fahrten: volles Pauschale,</li>
<li>${PP.fahrten_zwei_drittel} bis ${PP.fahrten_voll - 1} Fahrten: zwei Drittel,</li>
<li>${PP.fahrten_ein_drittel} bis ${PP.fahrten_zwei_drittel - 1} Fahrten: ein Drittel.</li>
</ul>
${h.table(['Fahrten im Monat', 'Netto im Monat', 'Plus gegenüber ohne Pauschale'], [['kein Pendlerpauschale', h.eur(pOhne.nettoMonat, 2), h.eur(0, 2)], ...pend.map((p) => [p.f === 'voll' ? `ab ${PP.fahrten_voll}` : p.f === 'zweiDrittel' ? `${PP.fahrten_zwei_drittel} bis ${PP.fahrten_voll - 1}` : `${PP.fahrten_ein_drittel} bis ${PP.fahrten_zwei_drittel - 1}`, h.eur(p.k.nettoMonat, 2), h.eur(p.k.nettoMonat - pOhne.nettoMonat, 2)])], `${h.eur(PB)} brutto (${h.pct(0.75)} von ${h.eur(V1)}), ${km} km einfache Strecke, kleines Pendlerpauschale mit Pendlereuro`, ['l', 'r', 'r'])}
<p>Eine Viertagewoche reicht fast immer für das volle Pauschale, eine Woche mit zwei Bürotagen und Homeoffice an den übrigen meist für zwei Drittel. Bei sehr kleinen Gehältern ohne Lohnsteuer wirkt das Pauschale im Lohnzettel kaum; dann hilft es über die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')}, in der die Rückerstattung von Sozialversicherungsbeiträgen mit Pendlerpauschale bis ${h.eur(R.sv_rueckerstattung_pendler_max)} statt ${h.eur(R.sv_rueckerstattung_max)} reicht. Details zu Strecken und Beträgen auf der Seite ${h.a('pendlerpauschale', 'Pendlerpauschale')}.</p>
<h2>Zwei Teilzeitjobs statt einer Vollzeitstelle</h2>
<p>Manche kombinieren zwei Teilzeitstellen bei verschiedenen Arbeitgebern. In der Sozialversicherung wird jede für sich abgerechnet, die Staffel der Arbeitslosenversicherung gilt je Dienstverhältnis. Bei der Lohnsteuer rechnet aber jeder Arbeitgeber so, als ob sein Gehalt Ihr einziges wäre, und gewährt die steuerfreie Stufe und den Verkehrsabsetzbetrag ein zweites Mal. Wer gleichzeitig zwei lohnsteuerpflichtige Bezüge hat, muss deshalb eine Veranlagung abgeben (${h.src('estg41', '§ 41 Abs. 1 Z 2 EStG')}), und dabei kommt es meist zu einer Nachzahlung. Legen Sie dafür einen Teil des Nettos beiseite.</p>
<h2>Wechsel in Teilzeit während des Jahres</h2>
<p>Wer im Herbst reduziert, etwa für eine Ausbildung neben dem Beruf, sollte auf die Weihnachtsremuneration achten. Am Jahresende prüft der Arbeitgeber, ob die mit festen Sätzen versteuerten Sonderzahlungen ein Sechstel der tatsächlich bezahlten laufenden Bezüge übersteigen (${h.src('estg77', '§ 77 Abs. 4a EStG')}). Ein Beispiel mit ${h.eur(V1)} bis August und ${h.eur(V1 / 2)} ab September:</p>
${h.table(['Weihnachtsremuneration im November', 'Nachversteuerung im Dezember', 'Jahresnetto'], [[`nach neuem Gehalt (${h.eur(V1 / 2)})`, h.eur(wNeu.kontrolle.mehrsteuer, 2), h.eur(wNeu.netto, 2)], [`nach altem Gehalt (${h.eur(V1)})`, h.eur(wAlt.kontrolle.mehrsteuer, 2), h.eur(wAlt.netto, 2)]], 'Urlaubszuschuss im Juni nach dem Vollzeitgehalt; Werte aus dem Jahresrechner dieser Seite', ['l', 'r', 'r'])}
<p>Wie hoch die Weihnachtsremuneration nach einem Wechsel des Stundenausmaßes ist, regelt der Kollektivvertrag. Die Nachversteuerung ist meist klein gegenüber dem höheren Bruttobetrag, kommt aber überraschend im Dezember. Sie entfällt in bestimmten Fällen, etwa bei Elternkarenz oder Krankengeld im selben Jahr; die vollständige Liste und die Rechnung Schritt für Schritt stehen im Ratgeber zum ${h.a('jahressechstel', 'Jahressechstel')}.</p>
`,
  },
  en: {
    slug: 'part-time-gross-net',
    nav: 'Part-time gross to net',
    card: 'What you keep at 50, 60, 75 or 80 percent hours, and why net pay falls more slowly than gross.',
    title: 'Part-Time Pay Austria 2026: Net at 50 to 80 Percent Hours',
    description: `Part-time pay in Austria 2026: at ${EN.pct(0.5)} of a ${EN.eur(V1)} salary you keep ${EN.pct(halb.rel)} of full-time net. Table from 50 to 80 %, commuter allowance and mid-year changes.`,
    h1: 'Part-time work in Austria: how much net pay remains',
    intro: 'Why halving your hours does not halve your take-home pay, what happens to the commuter allowance and special payments, and the catch when you switch mid-year.',
    resume: `Moving to part-time (Teilzeit) in Austria cuts your net pay by a smaller percentage than your gross. On a full-time salary of ${EN.eur(V1)} gross you take home ${EN.eur(voll1.k.nettoMonat, 2)}; at ${EN.pct(0.5)} hours you keep ${EN.eur(halb.k.nettoMonat, 2)}, which is ${EN.pct(halb.rel)} of your former net. Three mechanisms cushion the drop. Wage tax falls faster than income under the stepped scale and is almost zero at ${EN.eur(halb.b)} gross. The employee unemployment contribution disappears up to ${EN.eur(P.sv.av_staffel[0][0])} a month and is reduced up to ${EN.eur(P.sv.av_staffel[2][0])}. And up to a monthly salary of ${EN.eur(freiBis, 2)}, holiday and Christmas pay are free of wage tax because the annual sixth stays under the ${EN.eur(S.freigrenze_sechstel)} limit. You keep the commuter allowance (Pendlerpauschale) in part-time, reduced only by the number of trips: full from ${PP.fahrten_voll} trips a month, two thirds from ${PP.fahrten_zwei_drittel}, one third from ${PP.fahrten_ein_drittel}. If you reduce hours during the year, watch your Christmas pay: if it is still based on your full-time salary, the December control calculation can claw back some tax.`,
    faqs: [
      { q: 'How much net pay do I keep working 50 percent part-time in Austria?', a: `On a full-time salary of ${EN.eur(V1)} gross, half the hours means ${EN.eur(halb.b)} gross and ${EN.eur(halb.k.nettoMonat, 2)} net a month, ${EN.pct(halb.rel)} of the full-time net of ${EN.eur(voll1.k.nettoMonat, 2)}. From ${EN.eur(V2)} full-time you would keep ${EN.eur(r2[0].k.nettoMonat, 2)}, or ${EN.pct(r2[0].rel)}. The gap comes from the stepped wage tax scale and the reduced unemployment contribution for small incomes.` },
      { q: 'Why does part-time net pay fall less than gross pay?', a: `Because deductions rise faster than income. When your salary drops, the euros you lose first are the ones taxed at ${EN.pct(P.tarif.saetze[2])} or ${EN.pct(P.tarif.saetze[3])}. Tax credits stay the same size, and below ${EN.eur(P.sv.av_staffel[2][0])} the unemployment contribution steps down from ${EN.pct(P.sv.dn.av, 2)} to zero. Both effects together slow the decline in take-home pay.` },
      { q: 'Do part-time workers get the full Austrian commuter allowance?', a: `Yes, if you travel to work on at least ${PP.fahrten_voll} days a month. Part-time as such does not reduce it; only the number of trips does: ${PP.fahrten_zwei_drittel} to ${PP.fahrten_voll - 1} trips give two thirds, ${PP.fahrten_ein_drittel} to ${PP.fahrten_zwei_drittel - 1} one third (section 16 of the Income Tax Act). A four-day week normally keeps the full amount, two office days a week usually two thirds. The commuter euro is cut in the same proportion.` },
      { q: 'What happens to Christmas pay if I switch to part-time in autumn?', a: `If Christmas pay is still based on your full-time salary, it may exceed one sixth of the regular pay actually received in the year. Your employer then re-taxes the excess on the normal scale in December (section 77(4a)). Going from ${EN.eur(V1)} to ${EN.eur(V1 / 2)} in September, that costs ${EN.eur(wAlt.kontrolle.mehrsteuer, 2)}. If Christmas pay follows the new salary, nothing is clawed back.` },
      { q: 'Do part-time employees in Austria pay unemployment insurance?', a: `Not up to ${EN.eur(P.sv.av_staffel[0][0])} gross a month; above that ${EN.pct(P.sv.av_staffel[1][1])} up to ${EN.eur(P.sv.av_staffel[1][0])}, ${EN.pct(P.sv.av_staffel[2][1])} up to ${EN.eur(P.sv.av_staffel[2][0])}, then the full ${EN.pct(P.sv.dn.av, 2)}. You remain fully insured because the employer keeps paying its share. With two part-time jobs, each is assessed separately and the incomes are not added together.` },
    ],
    body: (h) => `
<h2>Part-time net as a share of full-time net</h2>
<p>The table scales two full-time salaries down to part-time. Gross falls exactly in line with hours; net does not.</p>
${h.table(['Hours', `Gross (full-time ${h.eur(V1)})`, 'Net', 'Net as % of full-time', `Gross (full-time ${h.eur(V2)})`, 'Net', 'Net as % of full-time'], r1.map((z, i) => [h.pct(z.a), h.eur(z.b), h.eur(z.k.nettoMonat, 2), h.pct(z.rel, 1), h.eur(r2[i].b), h.eur(r2[i].k.nettoMonat, 2), h.pct(r2[i].rel, 1)]), 'Regular month 2026, outside Vienna, no children, no commuter allowance; figures from this site’s engine', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>At ${h.pct(0.8)} hours you keep roughly ${h.pct(r1[3].rel)} to ${h.pct(r2[3].rel)} of your net, depending on the starting salary; at half time ${h.pct(r2[0].rel)} to ${h.pct(halb.rel)}. The lower the full-time salary, the more the system cushions the cut, because a bigger share of pay drops into the tax-free band and below the unemployment insurance limits. Payroll treats part-time staff exactly like full-time staff: same rates, same credits, same fourteen payments.</p>
<!--mini:teilzeit-->
<h2>Three reasons part-time costs less net than you expect</h2>
<h3>The stepped tax scale</h3>
<p>Wage tax follows the scale in ${h.src('estg33', 'section 33 of the Income Tax Act')}. When you cut hours, you lose the top euros of your salary first, and those were taxed most heavily. The transport credit of ${h.eur(R.verkehrsabsetzbetrag)} a year stays the same. At ${h.eur(halb.b)} gross only ${h.eur(halb.k.lstMonat, 2)} of wage tax remains each month, against ${h.eur(voll1.k.lstMonat, 2)} full-time.</p>
<h3>The reduced unemployment contribution</h3>
<p>Since 2026 employees pay no unemployment insurance up to ${h.eur(h.P.sv.av_staffel[0][0])} gross, then ${h.pct(h.P.sv.av_staffel[1][1])} and ${h.pct(h.P.sv.av_staffel[2][1])}, and the full rate only above ${h.eur(h.P.sv.av_staffel[2][0])} (${h.src('oegkAv', 'ÖGK')}). Part-time salaries often fall in this range: ${h.eur(r1[2].b)} gross pays ${h.pct(avSatz(r1[2].b))}, ${h.eur(r2[1].b)} already ${h.pct(avSatz(r2[1].b), 2)}. When you agree your hours, it can pay to look at these steps; a few euros below one can leave you more net than a few euros above it.</p>
<h3>The exemption limit for special payments</h3>
<p>If the annual sixth is no more than ${h.eur(S.freigrenze_sechstel)}, holiday and Christmas pay are free of wage tax. With a steady salary that covers monthly pay up to ${h.eur(freiBis, 2)}, which includes many half-time jobs. Above it the fixed rates apply; at ${h.eur(halb.b)}, holiday pay costs ${h.eur(halb.k.uz.lstSzFest, 2)} in wage tax. More on both payments under ${h.a('dreizehntes-gehalt', '13th and 14th salary')}.</p>
<h2>Commuter allowance in part-time: trips are what count</h2>
<p>Whether you work part-time or full-time makes no difference to the commuter allowance. What matters is on how many days a month you actually make the journey (${h.src('estg16', 'section 16(1)(6) of the Income Tax Act')}):</p>
<ul>
<li>at least ${PP.fahrten_voll} trips: full allowance,</li>
<li>${PP.fahrten_zwei_drittel} to ${PP.fahrten_voll - 1} trips: two thirds,</li>
<li>${PP.fahrten_ein_drittel} to ${PP.fahrten_zwei_drittel - 1} trips: one third.</li>
</ul>
${h.table(['Trips per month', 'Net per month', 'Gain over no allowance'], [['no commuter allowance', h.eur(pOhne.nettoMonat, 2), h.eur(0, 2)], ...pend.map((p) => [p.f === 'voll' ? `${PP.fahrten_voll} or more` : p.f === 'zweiDrittel' ? `${PP.fahrten_zwei_drittel} to ${PP.fahrten_voll - 1}` : `${PP.fahrten_ein_drittel} to ${PP.fahrten_zwei_drittel - 1}`, h.eur(p.k.nettoMonat, 2), h.eur(p.k.nettoMonat - pOhne.nettoMonat, 2)])], `${h.eur(PB)} gross (${h.pct(0.75)} of ${h.eur(V1)}), ${km} km one way, small commuter allowance with commuter euro`, ['l', 'r', 'r'])}
<p>A four-day week nearly always qualifies for the full amount; two office days a week plus home office usually for two thirds. On very small salaries with no wage tax, the allowance barely shows on the payslip. It then works through the ${h.a('arbeitnehmerveranlagung', 'annual tax assessment')}, where the refund of social insurance contributions rises to ${h.eur(R.sv_rueckerstattung_pendler_max)} instead of ${h.eur(R.sv_rueckerstattung_max)} with the commuter allowance. Distances and amounts are on the ${h.a('pendlerpauschale', 'commuter allowance')} page.</p>
<h2>Switching to part-time during the year</h2>
<p>If you reduce hours in autumn, for example to study alongside your job, keep an eye on your Christmas pay. At year end your employer checks whether the special payments taxed at fixed rates exceed one sixth of the regular pay actually received (${h.src('estg77', 'section 77(4a) of the Income Tax Act')}). An example with ${h.eur(V1)} until August and ${h.eur(V1 / 2)} from September:</p>
${h.table(['Christmas pay in November', 'Extra tax in December', 'Annual net'], [[`based on new salary (${h.eur(V1 / 2)})`, h.eur(wNeu.kontrolle.mehrsteuer, 2), h.eur(wNeu.netto, 2)], [`based on old salary (${h.eur(V1)})`, h.eur(wAlt.kontrolle.mehrsteuer, 2), h.eur(wAlt.netto, 2)]], 'Holiday pay in June based on the full-time salary; figures from this site’s annual engine', ['l', 'r', 'r'])}
<p>How Christmas pay is calculated after a change of hours is set by your collective agreement. The extra tax is usually small compared with the higher gross amount, but it arrives unannounced in December. It does not apply in certain cases, such as parental leave or sick pay in the same year; the full list and the calculation step by step are on the ${h.a('jahressechstel', 'annual sixth')} page.</p>
`,
  },
});
