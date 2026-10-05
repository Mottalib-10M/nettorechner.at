import { defineGuide } from '../../lib/guide-types';
import { svLaufend, lohnsteuerLaufend, verkehrsabsetzbetrag, tarif } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

const A = P.absetzbetraege;
/** Zuschlag nach § 33 Abs. 5 Z 3 EStG, gleichmäßig eingeschliffen (nur Veranlagung). */
const zuschlag = (e: number) => e <= A.vab_zuschlag_bis ? A.vab_zuschlag : e >= A.vab_zuschlag_einschleif_bis ? 0 : A.vab_zuschlag * (A.vab_zuschlag_einschleif_bis - e) / (A.vab_zuschlag_einschleif_bis - A.vab_zuschlag_bis);
/** Monatsbrutto (laufend, ohne Pendlerpauschale), bei dem das Jahreseinkommen e erreicht wird. */
function bruttoFuer(e: number): number {
  let lo = 0, hi = 20000;
  for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (lohnsteuerLaufend(m - svLaufend(m).summe).bemessungJahr < e) lo = m; else hi = m; }
  return hi;
}
const mitte = (a: number, b: number) => (a + b) / 2;
const ERH = [A.vab_erhoeht_bis, mitte(A.vab_erhoeht_bis, A.vab_erhoeht_einschleif_bis), A.vab_erhoeht_einschleif_bis].map((e) => ({ e, vab: verkehrsabsetzbetrag(e, true) }));
const ZU = [A.vab_zuschlag_bis, 22000, 25000, 28000, A.vab_zuschlag_einschleif_bis].map((e) => ({ e, z: zuschlag(e), b: bruttoFuer(e) }));
const bZuBis = bruttoFuer(A.vab_zuschlag_bis), bZuEnde = bruttoFuer(A.vab_zuschlag_einschleif_bis);
/** Beispiel: 1.500 € brutto, ganzjährig, ohne Pendlerpauschale. */
const B = 1500;
const svB = svLaufend(B).summe;
const lstB = lohnsteuerLaufend(B - svB);
const eB = lstB.bemessungJahr;
const steuerB = tarif(eB) - A.verkehrsabsetzbetrag - zuschlag(eB);
const svJahrB = svB * 12;
const erstB = steuerB < 0 ? Math.min(-steuerB, A.sv_rueckerstattung_quote * svJahrB, A.sv_rueckerstattung_max + zuschlag(eB)) : 0;
/** Ab diesem Einkommen übersteigt die Tarifsteuer den Grundbetrag: erst dann fällt laufende Lohnsteuer an. */
const eLstStart = P.tarif.grenzen[0] + A.verkehrsabsetzbetrag / P.tarif.saetze[1];
const bLstStart = bruttoFuer(eLstStart);
/** Teiljahr: Eintritt im September mit 3.500 € (vier Monate). */
const eTeil = Math.max(0, 4 * (3500 - svLaufend(3500).summe) - P.tarif.werbungskostenpauschale);
const proKm = (A.vab_erhoeht - A.verkehrsabsetzbetrag) / (A.vab_erhoeht_einschleif_bis - A.vab_erhoeht_bis);
const proTsd = A.vab_zuschlag / (A.vab_zuschlag_einschleif_bis - A.vab_zuschlag_bis) * 1000;

export default defineGuide({
  id: 'verkehrsabsetzbetrag',
  group: 'absetz',
  order: 50,
  mini: 'vab',
  related: ['pendlerpauschale', 'pendlereuro', 'arbeitnehmerveranlagung', 'teilzeit', 'geringfuegig'],
  sources: ['estg33', 'bmfAbsetzbetraege'],
  de: {
    slug: 'verkehrsabsetzbetrag',
    nav: 'Verkehrsabsetzbetrag',
    card: `${DE.eur(A.verkehrsabsetzbetrag)} für alle, ${DE.eur(A.vab_erhoeht)} für Pendler mit kleinem Einkommen, dazu ${DE.eur(A.vab_zuschlag)} Zuschlag: die Einschleifung Schritt für Schritt.`,
    title: `Verkehrsabsetzbetrag 2026: ${DE.eur(A.verkehrsabsetzbetrag)}, ${DE.eur(A.vab_erhoeht)} und der Zuschlag`,
    description: `Verkehrsabsetzbetrag 2026: ${DE.eur(A.verkehrsabsetzbetrag)} für jeden Arbeitnehmer, ${DE.eur(A.vab_erhoeht)} für Pendler, Zuschlag ${DE.eur(A.vab_zuschlag)} bis ${DE.eur(A.vab_zuschlag_bis)} Einkommen. Einschleifung, SV-Bonus, Beispiele.`,
    h1: 'Der Verkehrsabsetzbetrag und seine Zuschläge',
    intro: 'Der Absetzbetrag, den jeder Arbeitnehmer automatisch bekommt, und die beiden Erhöhungen für kleine Einkommen und Pendler.',
    resume: `Der Verkehrsabsetzbetrag beträgt 2026 ${DE.eur(A.verkehrsabsetzbetrag)} im Jahr und steht jedem Arbeitnehmer zu; der Arbeitgeber zieht ihn automatisch von der Lohnsteuer ab, ein Zwölftel pro Monat. Er gilt die Kosten des Arbeitswegs pauschal ab. Wer Anspruch auf ein Pendlerpauschale hat und höchstens ${DE.eur(A.vab_erhoeht_bis)} Einkommen im Jahr, bekommt den erhöhten Verkehrsabsetzbetrag von ${DE.eur(A.vab_erhoeht)}; bis ${DE.eur(A.vab_erhoeht_einschleif_bis)} sinkt er gleichmäßig auf ${DE.eur(A.verkehrsabsetzbetrag)}. Unabhängig davon erhöht sich der Verkehrsabsetzbetrag um einen Zuschlag von ${DE.eur(A.vab_zuschlag)}, wenn das Einkommen ${DE.eur(A.vab_zuschlag_bis)} nicht übersteigt; zwischen ${DE.eur(A.vab_zuschlag_bis)} und ${DE.eur(A.vab_zuschlag_einschleif_bis)} schleift er sich auf null ein. Den Zuschlag gibt es nur in der Arbeitnehmerveranlagung. Weil Absetzbeträge die Steuer unter null drücken können, wird bei kleinen Einkommen ein Teil der Sozialversicherung zurückgezahlt, und der Zuschlag erhöht diese SV-Rückerstattung als SV-Bonus um bis zu ${DE.eur(A.vab_zuschlag)}. Bei ${DE.eur(B)} brutto im Monat zahlen Sie so keine laufende Lohnsteuer und bekommen nach Jahresende ${DE.eur(erstB, 2)} zurück.`,
    faqs: [
      { q: 'Muss ich den Verkehrsabsetzbetrag beantragen?', a: `Nein. Den Grundbetrag von ${DE.eur(A.verkehrsabsetzbetrag)} berücksichtigt jeder Arbeitgeber automatisch in der Lohnverrechnung, ein Zwölftel pro Monat. Nur Grenzgänger bekommen ihn laut BMF erst in der Veranlagung. Der erhöhte Verkehrsabsetzbetrag hängt am Pendlerpauschale: Melden Sie dieses dem Arbeitgeber, rechnet er die Erhöhung mit; sonst holen Sie beides in der Arbeitnehmerveranlagung nach. Der Zuschlag kommt immer nur über die Veranlagung.` },
      { q: 'Wie wird der Zuschlag zum Verkehrsabsetzbetrag eingeschliffen?', a: `Linear. Bis ${DE.eur(A.vab_zuschlag_bis)} Einkommen gibt es die vollen ${DE.eur(A.vab_zuschlag)}, bei ${DE.eur(A.vab_zuschlag_einschleif_bis)} nichts mehr. Dazwischen verliert jeder Tausender Einkommen rund ${DE.eur(proTsd, 2)} Zuschlag. Bei ${DE.eur(25000)} Einkommen bleiben ${DE.eur(zuschlag(25000), 2)}. Einkommen heißt hier das Jahreseinkommen nach Sozialversicherung und Werbungskosten, ohne Urlaubs- und Weihnachtsgeld, soweit es mit festen Sätzen versteuert wurde.` },
      { q: 'Bis zu welchem Bruttogehalt bekomme ich den Zuschlag zum Verkehrsabsetzbetrag?', a: `Bei einem ganzjährigen Gehalt ohne Pendlerpauschale und ohne weitere Werbungskosten gibt es den vollen Zuschlag bis rund ${DE.eur(bZuBis)} brutto im Monat, einen Teil davon bis rund ${DE.eur(bZuEnde)}. Maßgeblich ist aber das Jahreseinkommen: Wer nur einen Teil des Jahres arbeitet oder in Teilzeit wechselt, kann trotz höherem Monatslohn unter ${DE.eur(A.vab_zuschlag_bis)} bleiben und den Zuschlag in der Veranlagung bekommen.` },
      { q: 'Was hat der Verkehrsabsetzbetrag mit der SV-Rückerstattung zu tun?', a: `Er ist die Voraussetzung. Nur wer Anspruch auf den Verkehrsabsetzbetrag hat und bei dem die Steuer unter null fällt, bekommt ${DE.pct(A.sv_rueckerstattung_quote)} der Sozialversicherung zurück, höchstens ${DE.eur(A.sv_rueckerstattung_max)} oder mit Pendlerpauschale ${DE.eur(A.sv_rueckerstattung_pendler_max)}. Mit Anspruch auf den Zuschlag erhöht sich der Höchstbetrag um den SV-Bonus von bis zu ${DE.eur(A.vab_zuschlag)} (§ 33 Abs. 8 EStG).` },
      { q: 'Bekommen Pensionisten auch den Verkehrsabsetzbetrag?', a: `Nein, nicht gleichzeitig mit dem Pensionistenabsetzbetrag. Laut BMF können die beiden Absetzbeträge nicht zusammen berücksichtigt werden. Gibt es in einem Jahr sowohl Erwerbseinkommen als auch eine Pension, etwa beim Pensionsantritt im Herbst, steht in der Veranlagung der Verkehrsabsetzbetrag von ${DE.eur(A.verkehrsabsetzbetrag)} zu, gegebenenfalls mit Zuschlag bei kleinem Einkommen.` },
    ],
    body: (h) => `
<h2>Drei Stufen eines Absetzbetrags</h2>
${h.table(['Teil', 'Betrag 2026', 'Voraussetzung', 'Wo er wirkt'], [
  ['Verkehrsabsetzbetrag', h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag), 'Einkünfte aus einem Dienstverhältnis', 'Lohnverrechnung, monatlich'],
  ['erhöhter Verkehrsabsetzbetrag', h.eur(h.P.absetzbetraege.vab_erhoeht), `Pendlerpauschale, Einkommen bis ${h.eur(h.P.absetzbetraege.vab_erhoeht_bis)} (eingeschliffen bis ${h.eur(h.P.absetzbetraege.vab_erhoeht_einschleif_bis)})`, 'Lohnverrechnung oder Veranlagung'],
  ['Zuschlag', `+ ${h.eur(h.P.absetzbetraege.vab_zuschlag)}`, `Einkommen bis ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)} (eingeschliffen bis ${h.eur(h.P.absetzbetraege.vab_zuschlag_einschleif_bis)})`, 'nur Veranlagung'],
], `Quelle: ${h.src('estg33', '§ 33 Abs. 5 EStG')} und ${h.src('bmfAbsetzbetraege', 'BMF, Steuerabsetzbeträge')}`, ['l', 'r', 'l', 'l'])}
<p>Absetzbeträge werden von der Steuer abgezogen, nicht vom Einkommen. Die ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)} sind deshalb für jeden gleich viel wert, ob er 20 oder 48 Prozent Grenzsteuersatz hat. Bei kleinen Einkommen ist der Absetzbetrag oft größer als die Tarifsteuer; dann zahlt man keine Lohnsteuer, und der Überschuss kann über die SV-Rückerstattung ausbezahlt werden.</p>

<h2>Was er im Monat bewirkt</h2>
<p>Auf dem Lohnzettel steht der Verkehrsabsetzbetrag selten als eigene Zeile. Die Lohnverrechnung zieht jeden Monat ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag / 12, 2)} von der hochgerechneten Tarifsteuer ab. Daraus folgt eine zweite Grenze, die viele nicht kennen: Die erste Tarifstufe beginnt bei ${h.eur(h.P.tarif.grenzen[0])} Einkommen, laufende Lohnsteuer fällt aber erst ab ${h.eur(eLstStart)} an, weil bis dorthin der Verkehrsabsetzbetrag die Steuer aufzehrt. Ganzjährig ohne Pendlerpauschale entspricht das rund ${h.eur(bLstStart)} brutto im Monat. Wer darunter liegt, sieht auf dem Lohnzettel null Lohnsteuer, auch wenn sein Einkommen schon im 20-Prozent-Bereich liegt.</p>

<h2>Der erhöhte Verkehrsabsetzbetrag für Pendler</h2>
<p>Wer Anspruch auf ein ${h.a('pendlerpauschale', 'Pendlerpauschale')} hat, bekommt bei kleinem Einkommen ${h.eur(h.P.absetzbetraege.vab_erhoeht)} statt ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)}. Die Erhöhung von ${h.eur(h.P.absetzbetraege.vab_erhoeht - h.P.absetzbetraege.verkehrsabsetzbetrag)} schleift sich auf einer Strecke von nur ${h.eur(h.P.absetzbetraege.vab_erhoeht_einschleif_bis - h.P.absetzbetraege.vab_erhoeht_bis)} Einkommen ab, das sind rund ${h.eur(proKm * 100, 2)} weniger Absetzbetrag je ${h.eur(100)} mehr Einkommen.</p>
${h.table(['Jahreseinkommen', 'Verkehrsabsetzbetrag mit Pendlerpauschale'], ERH.map((r) => [h.eur(r.e), h.eur(r.vab, 2)]), 'Einschleifung nach § 33 Abs. 5 Z 2 EStG, 2026', ['r', 'r'])}
<p>Weil das Pendlerpauschale selbst das Einkommen senkt, rutschen viele Pendler mit mittleren Teilzeitgehältern unter die Grenze. Den ${h.a('pendlereuro', 'Pendlereuro')} gibt es zusätzlich, er ist ein eigener Absetzbetrag. Wurde der erhöhte Verkehrsabsetzbetrag in der Lohnverrechnung berücksichtigt, obwohl die Voraussetzungen fehlten, ist das ein Grund für eine Pflichtveranlagung.</p>

<h2>Der Zuschlag für kleine Einkommen</h2>
<p>Unabhängig vom Arbeitsweg erhöht sich der Verkehrsabsetzbetrag um ${h.eur(h.P.absetzbetraege.vab_zuschlag)}, wenn das Einkommen ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)} im Kalenderjahr nicht übersteigt. Zwischen ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)} und ${h.eur(h.P.absetzbetraege.vab_zuschlag_einschleif_bis)} sinkt er gleichmäßig auf null, rund ${h.eur(proTsd, 2)} je ${h.eur(1000)} Einkommen. Laut ${h.src('bmfAbsetzbetraege', 'BMF')} wird er nur im Rahmen der Veranlagung berücksichtigt, nie auf dem Monatslohnzettel.</p>
${h.table(['Jahreseinkommen', 'Zuschlag', 'entspricht etwa Monatsbrutto'], ZU.map((r) => [h.eur(r.e), h.eur(r.z, 2), h.eur(r.b)]), 'Monatsbrutto: ganzjährig, 14 Bezüge, ohne Pendlerpauschale und weitere Werbungskosten, außerhalb Wiens', ['r', 'r', 'r'])}
<p>Das Monatsbrutto ist nur ein Anhaltspunkt. Urlaubs- und Weihnachtsgeld zählen nicht zum Einkommen, soweit sie mit festen Sätzen versteuert werden; Werbungskosten, Pendlerpauschale oder ein Teiljahr senken es.</p>
<!--mini:pendlereuro-->

<h2>Verkehrsabsetzbetrag, Negativsteuer und SV-Bonus</h2>
<p>Ergibt sich nach allen Absetzbeträgen eine Steuer unter null, erstattet das Finanzamt nach ${h.src('estg33', '§ 33 Abs. 8 EStG')} ${h.pct(h.P.absetzbetraege.sv_rueckerstattung_quote, 0)} der Sozialversicherungsbeiträge, höchstens ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)}, mit Pendlerpauschale ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_pendler_max)}. Voraussetzung ist der Anspruch auf den Verkehrsabsetzbetrag. Wer auch den Zuschlag bekommt, hat einen um bis zu ${h.eur(h.P.absetzbetraege.vab_zuschlag)} höheren Höchstbetrag: das ist der SV-Bonus.</p>
${h.table(['Schritt', 'Betrag'], [
  ['Monatsbrutto', h.eur(B, 2)],
  ['Jahreseinkommen (laufend, nach SV und Pauschale)', h.eur(eB, 2)],
  ['Tarifsteuer', h.eur(tarif(eB), 2)],
  ['− Verkehrsabsetzbetrag', `− ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag, 2)}`],
  ['− Zuschlag', `− ${h.eur(zuschlag(eB), 2)}`],
  ['= Steuer', h.eur(steuerB, 2)],
  ['SV-Beiträge laufend im Jahr', h.eur(svJahrB, 2)],
  [`Rückerstattung (Grenze: Steuer unter null, ${h.pct(h.P.absetzbetraege.sv_rueckerstattung_quote, 0)} der SV, ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)} + Zuschlag)`, `<strong>${h.eur(erstB, 2)}</strong>`],
], `Beispiel ${h.eur(B)} brutto, ganzjährig, ohne Pendlerpauschale, 2026`, ['l', 'r'])}
<p>In der Lohnverrechnung zahlt diese Person keine laufende Lohnsteuer: Die Tarifsteuer ist kleiner als der Verkehrsabsetzbetrag. Das Geld aus Zuschlag und Rückerstattung kommt erst mit der ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')}, oft automatisch, wenn keine Erklärung abgegeben wird. Wer ${h.a('teilzeit', 'Teilzeit')} arbeitet oder nur einen Teil des Jahres beschäftigt ist, sollte diese Gutschrift kennen, denn sie kann ein Monatsnetto übersteigen.</p>

<h2>Teiljahr: der Zuschlag für Gutverdiener</h2>
<p>Der Zuschlag ist nicht nur etwas für kleine Gehälter. Er hängt am Jahreseinkommen, und das ist bei einem Eintritt im Herbst niedrig. Wer im September nach Österreich kommt und vier Monate ${h.eur(3500)} brutto verdient, hat ohne weitere Einkünfte ein Einkommen von rund ${h.eur(eTeil)} im Jahr. Das liegt unter ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)}, also steht der volle Zuschlag von ${h.eur(h.P.absetzbetraege.vab_zuschlag)} zu; die laufende Lohnsteuer der vier Monate kommt in der Veranlagung zurück, dazu eine SV-Rückerstattung. Dasselbe gilt im Jahr des Studienabschlusses oder nach einer längeren Karenz.</p>

<h2>Wer ihn nicht bekommt</h2>
<ul>
<li><strong>Pensionisten</strong> erhalten stattdessen den Pensionistenabsetzbetrag; beide zusammen sind nicht möglich. Im Jahr des Pensionsantritts mit Erwerbseinkommen steht laut BMF der Verkehrsabsetzbetrag zu.</li>
<li><strong>Grenzgänger</strong> bekommen ihn nicht über den Arbeitgeber, sondern erst in der Veranlagung.</li>
<li><strong>Selbständige</strong> haben keinen Anspruch, denn er ist an Einkünfte aus einem Dienstverhältnis gebunden.</li>
</ul>
<p>Alle Beträge, auch die Einschleifgrenzen, werden seit 2023 jährlich an die Inflation angepasst; für 2026 um zwei Drittel der Inflationsrate.</p>
`,
  },
  en: {
    slug: 'transport-tax-credit',
    nav: 'Transport tax credit',
    card: `${EN.eur(A.verkehrsabsetzbetrag)} for every employee, ${EN.eur(A.vab_erhoeht)} for low-earning commuters, plus an ${EN.eur(A.vab_zuschlag)} supplement: how the phase-outs work.`,
    title: `Verkehrsabsetzbetrag 2026: Austria’s ${EN.eur(A.verkehrsabsetzbetrag)} Transport Credit`,
    description: `Austria's transport tax credit 2026: ${EN.eur(A.verkehrsabsetzbetrag)} for all employees, ${EN.eur(A.vab_erhoeht)} for commuters, ${EN.eur(A.vab_zuschlag)} supplement up to ${EN.eur(A.vab_zuschlag_bis)} income. Phase-outs and the refund explained.`,
    h1: 'The transport tax credit and its supplements',
    intro: 'For employees in Austria: the credit you get automatically on every payslip, and the two top-ups for low incomes and commuters.',
    resume: `The transport tax credit (Verkehrsabsetzbetrag) is ${EN.eur(A.verkehrsabsetzbetrag)} a year in 2026 and every employee in Austria gets it: your employer deducts one twelfth from your wage tax each month without any application. It is meant as a flat compensation for the cost of getting to work. If you qualify for the commuter allowance (Pendlerpauschale) and your income is no more than ${EN.eur(A.vab_erhoeht_bis)} a year, the credit rises to ${EN.eur(A.vab_erhoeht)}, tapering evenly back to ${EN.eur(A.verkehrsabsetzbetrag)} at ${EN.eur(A.vab_erhoeht_einschleif_bis)}. Separately, a supplement (Zuschlag) of ${EN.eur(A.vab_zuschlag)} applies if your income does not exceed ${EN.eur(A.vab_zuschlag_bis)}, phasing out to nothing at ${EN.eur(A.vab_zuschlag_einschleif_bis)}. The supplement is only granted in the annual tax assessment. Because credits can push your tax below zero, low earners get part of their social insurance back, and the supplement raises that refund by up to ${EN.eur(A.vab_zuschlag)}, the so-called SV-Bonus. On ${EN.eur(B)} gross a month you pay no regular wage tax and receive ${EN.eur(erstB, 2)} after the year ends.`,
    faqs: [
      { q: 'Do I need to apply for the Austrian transport tax credit?', a: `No. Every employer applies the basic ${EN.eur(A.verkehrsabsetzbetrag)} automatically, one twelfth per month. Only cross-border commuters (Grenzgänger) receive it later in their assessment, according to the Finance Ministry. The higher credit depends on the commuter allowance: report that to your employer and payroll includes the increase, otherwise claim both in your annual assessment. The supplement always comes through the assessment.` },
      { q: 'How is the transport credit supplement phased out?', a: `In a straight line. Up to ${EN.eur(A.vab_zuschlag_bis)} of income you get the full ${EN.eur(A.vab_zuschlag)}; at ${EN.eur(A.vab_zuschlag_einschleif_bis)} nothing is left. In between, each extra thousand euros of income costs about ${EN.eur(proTsd, 2)} of supplement, so ${EN.eur(25000)} of income leaves ${EN.eur(zuschlag(25000), 2)}. Income here means annual income after social insurance and work expenses, excluding holiday and Christmas pay taxed at fixed rates.` },
      { q: 'Up to what gross salary do I get the transport credit supplement?', a: `With a full-year salary, no commuter allowance and no other work expenses, the full supplement applies up to about ${EN.eur(bZuBis)} gross a month and part of it up to about ${EN.eur(bZuEnde)}. What counts, though, is annual income: if you work only part of the year, for instance after moving to Austria in autumn, you may stay below ${EN.eur(A.vab_zuschlag_bis)} despite a higher monthly salary.` },
      { q: 'How does the transport credit connect to the social insurance refund?', a: `It is the gateway. Only people entitled to the transport credit whose tax falls below zero get ${EN.pct(A.sv_rueckerstattung_quote)} of their social insurance back, up to ${EN.eur(A.sv_rueckerstattung_max)}, or ${EN.eur(A.sv_rueckerstattung_pendler_max)} with the commuter allowance. If you also qualify for the supplement, the cap rises by the SV-Bonus of up to ${EN.eur(A.vab_zuschlag)}, under section 33(8) of the Income Tax Act.` },
    ],
    body: (h) => `
<h2>One credit, three layers</h2>
${h.table(['Part', 'Amount 2026', 'Condition', 'Where it applies'], [
  ['Transport credit', h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag), 'income from employment', 'payroll, monthly'],
  ['Higher transport credit', h.eur(h.P.absetzbetraege.vab_erhoeht), `commuter allowance, income up to ${h.eur(h.P.absetzbetraege.vab_erhoeht_bis)} (tapering to ${h.eur(h.P.absetzbetraege.vab_erhoeht_einschleif_bis)})`, 'payroll or assessment'],
  ['Supplement', `+ ${h.eur(h.P.absetzbetraege.vab_zuschlag)}`, `income up to ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)} (tapering to ${h.eur(h.P.absetzbetraege.vab_zuschlag_einschleif_bis)})`, 'assessment only'],
], `Source: ${h.src('estg33', 'section 33(5) of the Income Tax Act')} and ${h.src('bmfAbsetzbetraege', 'Finance Ministry')}`, ['l', 'r', 'l', 'l'])}
<p>A tax credit (Absetzbetrag) comes off the tax, not off your income, so the ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)} are worth the same to everyone, whatever their marginal rate. On small incomes the credit is often larger than the tax on the scale; then no wage tax is withheld at all, and the surplus can be paid out as a social insurance refund.</p>

<h2>What it does each month</h2>
<p>Payslips rarely show the transport credit as a line of its own. Payroll simply deducts ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag / 12, 2)} a month from the annualised tax. That creates a second threshold few people know: the first tax band starts at ${h.eur(h.P.tarif.grenzen[0])} of income, but regular wage tax only appears from ${h.eur(eLstStart)}, because up to that point the credit absorbs the tax. For a full year without commuter allowance that is about ${h.eur(bLstStart)} gross a month. Below it your payslip shows zero wage tax, even though part of your income is already in the 20 percent band.</p>

<h2>The higher credit for commuters</h2>
<p>If you qualify for the ${h.a('pendlerpauschale', 'commuter allowance')}, a low income brings ${h.eur(h.P.absetzbetraege.vab_erhoeht)} instead of ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag)}. The extra ${h.eur(h.P.absetzbetraege.vab_erhoeht - h.P.absetzbetraege.verkehrsabsetzbetrag)} tapers over an income band of only ${h.eur(h.P.absetzbetraege.vab_erhoeht_einschleif_bis - h.P.absetzbetraege.vab_erhoeht_bis)}, about ${h.eur(proKm * 100, 2)} less credit for each extra ${h.eur(100)} of income.</p>
${h.table(['Annual income', 'Transport credit with commuter allowance'], ERH.map((r) => [h.eur(r.e), h.eur(r.vab, 2)]), 'Taper under section 33(5)(2), 2026', ['r', 'r'])}
<p>Since the commuter allowance itself lowers your income, many commuters on part-time salaries fall below the limit. The ${h.a('pendlereuro', 'commuter euro')} is a separate credit on top. If payroll applied the higher credit when you were not entitled to it, you must file an assessment.</p>

<h2>The supplement for low incomes</h2>
<p>Regardless of your commute, the credit rises by ${h.eur(h.P.absetzbetraege.vab_zuschlag)} if your income in the calendar year does not exceed ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)}. Between ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)} and ${h.eur(h.P.absetzbetraege.vab_zuschlag_einschleif_bis)} it falls evenly to zero, about ${h.eur(proTsd, 2)} per ${h.eur(1000)} of income. The ${h.src('bmfAbsetzbetraege', 'Finance Ministry')} states that it is only granted in the assessment, never on the monthly payslip.</p>
${h.table(['Annual income', 'Supplement', 'roughly equals monthly gross'], ZU.map((r) => [h.eur(r.e), h.eur(r.z, 2), h.eur(r.b)]), 'Monthly gross: full year, 14 payments, no commuter allowance or other work expenses, outside Vienna', ['r', 'r', 'r'])}
<p>The monthly gross is only a guide. Holiday and Christmas pay do not count as income where they are taxed at fixed rates, while work expenses, the commuter allowance or a part year reduce it.</p>
<!--mini:pendlereuro-->

<h2>Negative tax and the SV-Bonus</h2>
<p>If your tax after all credits is below zero, the tax office refunds ${h.pct(h.P.absetzbetraege.sv_rueckerstattung_quote, 0)} of your social insurance contributions under ${h.src('estg33', 'section 33(8)')}, up to ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)}, or ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_pendler_max)} with the commuter allowance. Entitlement to the transport credit is the condition. If you also get the supplement, the cap rises by up to ${h.eur(h.P.absetzbetraege.vab_zuschlag)}: that is the SV-Bonus.</p>
${h.table(['Step', 'Amount'], [
  ['Monthly gross', h.eur(B, 2)],
  ['Annual income (regular pay, after SI and flat allowance)', h.eur(eB, 2)],
  ['Tax on the scale', h.eur(tarif(eB), 2)],
  ['− transport credit', `− ${h.eur(h.P.absetzbetraege.verkehrsabsetzbetrag, 2)}`],
  ['− supplement', `− ${h.eur(zuschlag(eB), 2)}`],
  ['= tax', h.eur(steuerB, 2)],
  ['Regular SI contributions per year', h.eur(svJahrB, 2)],
  [`Refund (capped at negative tax, ${h.pct(h.P.absetzbetraege.sv_rueckerstattung_quote, 0)} of SI, ${h.eur(h.P.absetzbetraege.sv_rueckerstattung_max)} + supplement)`, `<strong>${h.eur(erstB, 2)}</strong>`],
], `Example: ${h.eur(B)} gross, full year, no commuter allowance, 2026`, ['l', 'r'])}
<p>On the payslip this person pays no regular wage tax, as the tax on the scale is smaller than the transport credit. The supplement and refund only arrive with the ${h.a('arbeitnehmerveranlagung', 'annual tax assessment')}, often automatically if you file nothing. If you work ${h.a('teilzeit', 'part-time')} or only part of the year, this refund is worth knowing: it can exceed a month's net pay.</p>

<h2>Part year: the supplement for good earners</h2>
<p>The supplement is not only for low salaries. It depends on annual income, which is low if you start in autumn. Someone who moves to Austria in September and earns ${h.eur(3500)} gross for four months has an income of about ${h.eur(eTeil)} for the year, with no other income. That is below ${h.eur(h.P.absetzbetraege.vab_zuschlag_bis)}, so the full ${h.eur(h.P.absetzbetraege.vab_zuschlag)} supplement applies; the regular wage tax from those four months comes back in the assessment, plus a social insurance refund. The same goes for the year you finish your studies or return from long parental leave.</p>

<h2>Who does not get it</h2>
<ul>
<li><strong>Pensioners</strong> receive the pensioner credit instead; the two cannot be combined. In a year with both work income and a pension, the transport credit applies, according to the ministry.</li>
<li><strong>Cross-border commuters</strong> do not get it through payroll, only in the assessment.</li>
<li><strong>The self-employed</strong> are not entitled, since it is tied to income from employment.</li>
</ul>
<p>All amounts, including the taper limits, have been indexed to inflation every year since 2023; for 2026 by two thirds of the inflation rate.</p>
`,
  },
});
