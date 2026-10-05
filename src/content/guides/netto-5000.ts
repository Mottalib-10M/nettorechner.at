import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend, lohnsteuerLaufend, pendlerpauschale, pendlereuro } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const B = 5000;
const k = kurz(B), k2 = kurz(B, { kinderU18: 2 });
const sv = svLaufend(B), lst = lohnsteuerLaufend(B - sv.summe);
const s40 = P.tarif.saetze[3];
/** Beispiel Pendler: 30 km, Öffis unzumutbar (großes Pendlerpauschale), volle Fahrten. */
const KM = 30;
const pg = { pendler: 'gross' as const, km: KM }, pk = { pendler: 'klein' as const, km: KM };
const ppG = pendlerpauschale('gross', KM), ppK = pendlerpauschale('klein', KM), pe = pendlereuro('gross', KM);
const kg = kurz(B, pg), kk = kurz(B, pk);
/** Der gleiche Arbeitsweg bei niedrigeren Gehältern: der Freibetrag wirkt mit dem jeweiligen Grenzsteuersatz. */
const vergleich = [2000, 3500, B].map((b) => {
  const o = kurz(b), m = kurz(b, pg);
  return { b, g: lohnsteuerLaufend(b - svLaufend(b).summe, pg).grenzsteuersatz, plus: m.nettoJahr - o.nettoJahr };
});
/** Werbungskosten in der Veranlagung: Beispiel 1.000 € (Betrag über dem Pauschale × 40 %). */
const WK = 1000, wkGutschrift = (WK - P.tarif.werbungskostenpauschale) * s40;
const grenz = sv.satz + (1 - sv.satz) * s40;

export default defineGuide({
  id: 'netto-5000',
  group: 'betrag',
  order: 70,
  mini: 'nettoMonat',
  miniDefaults: { b: B },
  related: ['netto-4000', 'netto-6000', 'pendlerpauschale', 'pendlereuro', 'familienbonus', 'arbeitnehmerveranlagung'],
  sources: ['estg33', 'estg16', 'bmfPendlerrechner', 'bmfVeranlagung', 'bmfRechner'],
  de: {
    slug: '5000-euro-brutto-netto',
    nav: '5.000 € brutto in netto',
    card: `${DE.eur(k.nettoMonat)} netto: Pendlerpauschale und Werbungskosten sparen 40 Cent je Euro.`,
    title: '5000 Euro brutto in netto 2026: Österreich mit Freibeträgen',
    description: `5000 Euro brutto 2026 in Österreich: ${DE.eur(k.nettoMonat, 2)} netto im Monat, dazu was Pendlerpauschale, Werbungskosten und Familienbonus bei 40 % Grenzsteuersatz bringen.`,
    h1: '5.000 Euro brutto: Netto und der Wert jedes Freibetrags',
    intro: 'Bei diesem Gehalt entscheidet der Grenzsteuersatz von 40 Prozent, wie viel ein Freibetrag wert ist, und warum Absetzbeträge anders wirken.',
    resume: `Bei ${DE.eur(B)} brutto bleiben 2026 ${DE.eur(k.nettoMonat, 2)} netto im Monat, nach ${DE.eur(sv.summe, 2)} Sozialversicherung und ${DE.eur(lst.lst, 2)} Lohnsteuer; das Jahr bringt ${DE.eur(k.nettoJahr)} netto. Die hochgerechnete Bemessungsgrundlage von ${DE.eur(lst.bemessungJahr)} liegt mitten in der 40-Prozent-Stufe, die von ${DE.eur(P.tarif.grenzen[2])} bis ${DE.eur(P.tarif.grenzen[3])} reicht. Daraus folgt eine einfache Regel: Jeder Euro, der die Bemessungsgrundlage senkt, spart 40 Cent Steuer. Das große Pendlerpauschale für ${KM} Kilometer (${DE.eur(ppG)} im Jahr) ist bei diesem Gehalt also ${DE.eur(ppG * s40)} wert, bei ${DE.eur(vergleich[0].b)} brutto nur die Hälfte. Absetzbeträge dagegen kürzen die Steuer direkt und sind bei jedem Gehalt gleich viel wert, solange genug Steuer da ist: der Pendlereuro von ${DE.eur(pe)}, der Familienbonus Plus von ${DE.eur(P.absetzbetraege.familienbonus_monat_u18, 2)} je Kind und Monat. Bei ${DE.eur(B)} wirken beide in voller Höhe. Mit dem Pendler-Beispiel steigt das Netto auf ${DE.eur(kg.nettoMonat, 2)}, mit zwei Kindern unter 18 auf ${DE.eur(k2.nettoMonat, 2)}.`,
    faqs: [
      { q: 'Wie viel bringt das Pendlerpauschale bei 5.000 Euro brutto?', a: `Bei ${KM} Kilometern und unzumutbaren Öffis gibt es das große Pendlerpauschale von ${DE.eur(ppG)} im Jahr. Es senkt die Bemessungsgrundlage und spart bei ${DE.pct(s40)} Grenzsteuersatz ${DE.eur(ppG * s40, 2)}. Dazu kommt der Pendlereuro von ${DE.eur(pe)}, der direkt von der Steuer abgeht. Zusammen ${DE.eur(kg.nettoJahr - k.nettoJahr, 2)} im Jahr, das Monatsnetto steigt auf ${DE.eur(kg.nettoMonat, 2)}. Mit zumutbaren Öffis (kleines Pauschale, ${DE.eur(ppK)}) sind es ${DE.eur(kk.nettoMonat, 2)}.` },
      { q: 'Wirkt der Familienbonus bei 5.000 Euro brutto voll?', a: `Ja, auch für mehrere Kinder. Mit zwei Kindern unter 18 sinkt die Lohnsteuer um ${DE.eur(k2.nettoMonat - k.nettoMonat, 2)} im Monat, das Netto steigt auf ${DE.eur(k2.nettoMonat, 2)}. Weil der Bonus ein Absetzbetrag ist, bringt er bei ${DE.eur(B)} genau so viel wie bei ${DE.eur(3000)}; ein höheres Gehalt erhöht ihn nicht. Eine Aufteilung mit dem anderen Elternteil lohnt sich hier nur, wenn dessen Steuer ebenfalls hoch genug ist.` },
      { q: 'Was bringen bei 5.000 Euro brutto 1.000 Euro Werbungskosten?', a: `Die Lohnverrechnung berücksichtigt pauschal ${DE.eur(P.tarif.werbungskostenpauschale)}. Was darüber liegt, etwa Fortbildung, Fachliteratur oder Arbeitsmittel, machen Sie in der Arbeitnehmerveranlagung geltend. Bei ${DE.eur(WK)} Ausgaben bleiben ${DE.eur(WK - P.tarif.werbungskostenpauschale)} über dem Pauschale, die Gutschrift beträgt bei ${DE.pct(s40)} rund ${DE.eur(wkGutschrift)}. Der Antrag ist bis zum Ende des fünften Folgejahres möglich (BMF).` },
    ],
    body: (h) => `
<h2>Der Lohnzettel bei ${h.eur(B)}</h2>
${h.table(['Position', 'Monat', 'Jahr mit 14 Bezügen'], [
  ['Brutto', h.eur(B, 2), h.eur(k.bruttoJahr)],
  [`Sozialversicherung ${h.pct(sv.satz, 2)}`, h.eur(sv.summe, 2), h.eur(k.svJahr, 2)],
  ['Lohnsteuer', h.eur(lst.lst, 2), h.eur(k.lstJahr, 2)],
  ['Netto', h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
], 'Außerhalb Wiens, ohne Kinder und Pendlerpauschale', ['l', 'r', 'r'])}
<h2>Ein Freibetrag ist hier 40 Cent je Euro wert</h2>
<p>Das Steuerrecht kennt zwei Arten von Entlastung. Freibeträge wie Pendlerpauschale und Werbungskosten senken das Einkommen, auf das der Tarif angewendet wird (${h.src('estg16', '§ 16 EStG')}). Absetzbeträge wie Pendlereuro, Verkehrsabsetzbetrag oder Familienbonus werden von der fertigen Steuer abgezogen (${h.src('estg33', '§ 33 EStG')}). Wie viel ein Freibetrag bringt, hängt also vom Grenzsteuersatz ab. Bei ${h.eur(B)} sind das ${h.pct(s40)}, weil die Bemessungsgrundlage zwischen ${h.eur(h.P.tarif.grenzen[2])} und ${h.eur(h.P.tarif.grenzen[3])} liegt. Noch ${h.eur(h.P.tarif.grenzen[3] - lst.bemessungJahr)} fehlen bis zur 48-Prozent-Stufe.</p>
${h.table(['Monatsbrutto', 'Grenzsteuersatz', `Mehr netto im Jahr mit ${KM} km, großes Pauschale`], vergleich.map((v) => [h.eur(v.b), h.pct(v.g), h.eur(v.plus, 2)]), `Pendlerpauschale ${h.eur(ppG)} plus Pendlereuro ${h.eur(pe)}, Werte aus dem Motor`, ['r', 'r', 'r'])}
<p>Der Unterschied zwischen den Zeilen kommt allein vom Pauschale. Der Pendlereuro bringt in allen drei Fällen dieselben ${h.eur(pe)}.</p>
<h2>Pendlerpauschale und Pendlereuro bei ${h.eur(B)}</h2>
<p>Ob das kleine oder das große Pauschale zusteht, entscheidet der ${h.src('bmfPendlerrechner', 'Pendlerrechner des BMF')}: Er prüft Entfernung und Zumutbarkeit der Öffis und erstellt das Formular für den Arbeitgeber. Bei ${KM} Kilometern ergibt das ${h.eur(ppK)} (klein) oder ${h.eur(ppG)} (groß) im Jahr, Ihr Monatsnetto steigt auf ${h.eur(kk.nettoMonat, 2)} oder ${h.eur(kg.nettoMonat, 2)}. Wer das Formular vergisst, holt den Betrag mit der Veranlagung nach. Alle Stufen im ${h.a('pendlerpauschale', 'Pendlerpauschale-Rechner')}, der Absetzbetrag im Detail beim ${h.a('pendlereuro', 'Pendlereuro')}.</p>
<h2>Familienbonus: voll wirksam, aber nicht mehr wert</h2>
<p>Der Familienbonus Plus beträgt ${h.eur(h.P.absetzbetraege.familienbonus_monat_u18, 2)} je Kind unter 18 und Monat. Er wird bis zur Höhe der Tarifsteuer abgezogen; bei ${h.eur(B)} sind das ${h.eur(lst.tarifMonat, 2)} im Monat, genug für mehrere Kinder. Mit zwei Kindern bleiben ${h.eur(k2.nettoMonat, 2)}. Mehr Gehalt macht den Bonus aber nicht größer. Der ${h.a('familienbonus', 'Familienbonus-Rechner')} zeigt, wann die Aufteilung mit dem anderen Elternteil Geld kostet.</p>
<h2>Werbungskosten über die Veranlagung</h2>
<p>Ausgaben über dem Pauschale von ${h.eur(h.P.tarif.werbungskostenpauschale)} kommen nicht über den Lohnzettel, sondern über die ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} zurück (${h.src('bmfVeranlagung', 'BMF')}). Bei ${h.pct(s40)} bringt jeder Euro 40 Cent, ${h.eur(WK)} Ausgaben also rund ${h.eur(wkGutschrift)}. Ein zusätzlicher Euro Gehalt kostet dagegen ${h.pct(grenz, 1)} an Abgaben.</p>
<p>Ihr eigener Fall im ${h.a('home', 'Brutto-Netto-Rechner')}. Nachbarn: ${h.a('netto-4000', '4.000 Euro brutto')} am Beginn der 40-Prozent-Stufe, ${h.a('netto-6000', '6.000 Euro brutto')} nahe an der Höchstbeitragsgrundlage.</p>
`,
  },
  en: {
    slug: '5000-euro-gross-to-net',
    nav: '€5,000 gross to net',
    card: `${EN.eur(k.nettoMonat)} net: commuter allowance and work expenses save 40 cents per euro.`,
    title: '5000 Euro Gross to Net in Austria 2026: What Allowances Save',
    description: `5000 euros gross in Austria 2026: ${EN.eur(k.nettoMonat, 2)} net a month, and what the commuter allowance, work expenses and the child credit are worth at a 40% marginal rate.`,
    h1: '5,000 euros gross: net pay and what each allowance is worth',
    intro: 'At a 40 percent marginal rate, every allowance that lowers taxable income saves 40 cents per euro, while tax credits keep a fixed value.',
    resume: `On ${EN.eur(B)} gross a month you take home ${EN.eur(k.nettoMonat, 2)} in Austria in 2026, after ${EN.eur(sv.summe, 2)} of social insurance and ${EN.eur(lst.lst, 2)} of wage tax, or ${EN.eur(k.nettoJahr)} over the year with the 13th and 14th salary. Your projected taxable base of ${EN.eur(lst.bemessungJahr)} sits well inside the 40 percent band, which runs from ${EN.eur(P.tarif.grenzen[2])} to ${EN.eur(P.tarif.grenzen[3])}. That gives a simple rule of thumb: every euro that reduces taxable income saves 40 cents of tax. The large commuter allowance (Pendlerpauschale) for a ${KM} km commute, ${EN.eur(ppG)} a year, is therefore worth ${EN.eur(ppG * s40)} to you, twice what it is worth on ${EN.eur(vergleich[0].b)} gross. Tax credits (Absetzbeträge) work differently: they come straight off the tax bill and are worth the same at any salary, provided there is enough tax to absorb them. The commuter euro of ${EN.eur(pe)} and the Familienbonus Plus of ${EN.eur(P.absetzbetraege.familienbonus_monat_u18, 2)} per child a month both apply in full here. With that commute net pay rises to ${EN.eur(kg.nettoMonat, 2)}; with two children under 18, to ${EN.eur(k2.nettoMonat, 2)}.`,
    faqs: [
      { q: 'What is the commuter allowance worth on 5,000 euros gross?', a: `For a ${KM} km commute where public transport is not reasonable, the large allowance is ${EN.eur(ppG)} a year. It lowers taxable income and saves ${EN.eur(ppG * s40, 2)} at your ${EN.pct(s40)} marginal rate. The commuter euro of ${EN.eur(pe)} comes off the tax directly. Together that is ${EN.eur(kg.nettoJahr - k.nettoJahr, 2)} a year and net pay of ${EN.eur(kg.nettoMonat, 2)} a month. If public transport is reasonable you get the small allowance (${EN.eur(ppK)}) and ${EN.eur(kk.nettoMonat, 2)} net.` },
      { q: 'Do parents on 5,000 euros gross get the full child credit?', a: `Yes, even for several children. With two children under 18, wage tax falls by ${EN.eur(k2.nettoMonat - k.nettoMonat, 2)} a month and net pay reaches ${EN.eur(k2.nettoMonat, 2)}. Being a tax credit, the Familienbonus Plus is worth exactly the same at ${EN.eur(B)} as at ${EN.eur(3000)}; a higher salary does not make it bigger. Splitting it with the other parent only makes sense if their tax is also high enough to absorb their half.` },
      { q: 'How much do 1,000 euros of work expenses return on 5,000 euros gross?', a: `Payroll already allows a flat ${EN.eur(P.tarif.werbungskostenpauschale)}. Anything above it, such as training, professional books or equipment, goes into the employee tax return (Arbeitnehmerveranlagung). With ${EN.eur(WK)} of expenses, ${EN.eur(WK - P.tarif.werbungskostenpauschale)} exceed the flat amount and the refund at ${EN.pct(s40)} is about ${EN.eur(wkGutschrift)}. The Finance Ministry accepts the return until the end of the fifth year after the tax year.` },
    ],
    body: (h) => `
<h2>Your payslip at ${h.eur(B)}</h2>
${h.table(['Item', 'Month', 'Year with 14 salaries'], [
  ['Gross', h.eur(B, 2), h.eur(k.bruttoJahr)],
  [`Social insurance ${h.pct(sv.satz, 2)}`, h.eur(sv.summe, 2), h.eur(k.svJahr, 2)],
  ['Wage tax', h.eur(lst.lst, 2), h.eur(k.lstJahr, 2)],
  ['Net', h.eur(k.nettoMonat, 2), h.eur(k.nettoJahr, 2)],
], 'Outside Vienna, no children, no commuter allowance', ['l', 'r', 'r'])}
<h2>An allowance is worth 40 cents per euro here</h2>
<p>Austrian tax relief comes in two forms. Allowances such as the commuter allowance and work expenses (Werbungskosten) reduce the income the scale is applied to (${h.src('estg16', 'section 16 Income Tax Act')}). Credits such as the commuter euro, the traffic credit or the Familienbonus are subtracted from the finished tax (${h.src('estg33', 'section 33')}). The value of an allowance therefore depends on your marginal rate: ${h.pct(s40)} at ${h.eur(B)}, since your taxable base lies between ${h.eur(h.P.tarif.grenzen[2])} and ${h.eur(h.P.tarif.grenzen[3])}. You are still ${h.eur(h.P.tarif.grenzen[3] - lst.bemessungJahr)} below the 48 percent band.</p>
${h.table(['Monthly gross', 'Marginal tax rate', `Extra net per year, ${KM} km, large allowance`], vergleich.map((v) => [h.eur(v.b), h.pct(v.g), h.eur(v.plus, 2)]), `Commuter allowance ${h.eur(ppG)} plus commuter euro ${h.eur(pe)}, engine figures`, ['r', 'r', 'r'])}
<p>The difference between the rows comes entirely from the allowance; the commuter euro adds the same ${h.eur(pe)} in each case.</p>
<h2>Commuter allowance and commuter euro at ${h.eur(B)}</h2>
<p>Whether you get the small or the large allowance is decided by the Finance Ministry's ${h.src('bmfPendlerrechner', 'Pendlerrechner')}, an online tool that checks distance and whether public transport is reasonable, then produces the form for your employer. At ${KM} km that means ${h.eur(ppK)} (small) or ${h.eur(ppG)} (large) a year, raising monthly net pay to ${h.eur(kk.nettoMonat, 2)} or ${h.eur(kg.nettoMonat, 2)}. If you never hand in the form, you can still claim it in your tax return. See the ${h.a('pendlerpauschale', 'commuter allowance calculator')} and the ${h.a('pendlereuro', 'commuter euro')} page.</p>
<h2>Child credit: fully usable, never bigger</h2>
<p>The Familienbonus Plus is ${h.eur(h.P.absetzbetraege.familienbonus_monat_u18, 2)} per child under 18 a month, capped at your scale tax, which is ${h.eur(lst.tarifMonat, 2)} a month at this salary: enough for several children. With two you keep ${h.eur(k2.nettoMonat, 2)}. Earning more does not increase it. The ${h.a('familienbonus', 'Familienbonus calculator')} shows when splitting it with the other parent costs money.</p>
<h2>Work expenses through the tax return</h2>
<p>Costs above the flat ${h.eur(h.P.tarif.werbungskostenpauschale)} never show up on your payslip; they come back through the ${h.a('arbeitnehmerveranlagung', 'employee tax return')} (${h.src('bmfVeranlagung', 'Finance Ministry')}). At ${h.pct(s40)} each euro returns 40 cents, so ${h.eur(WK)} of expenses bring about ${h.eur(wkGutschrift)}. For comparison, one more euro of salary costs ${h.pct(grenz, 1)} in deductions.</p>
<p>Your own figures in the ${h.a('home', 'gross-to-net calculator')}. Neighbours: ${h.a('netto-4000', '4,000 euros gross')} at the start of the 40 percent band, ${h.a('netto-6000', '6,000 euros gross')} close to the contribution ceiling.</p>
`,
  },
});
