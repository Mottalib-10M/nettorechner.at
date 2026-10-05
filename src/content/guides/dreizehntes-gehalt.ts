import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { rechneJahr } from '../../lib/engine/jahr';
import { P, DE, EN } from '../../lib/fmt';

const S = P.sonderzahlungen, D = P.sv.dn;
/** Netto einer Sonderzahlung aus dem Motor (Juni = Urlaubszuschuss, November = Weihnachtsremuneration). */
const sz = (b: number) => {
  const k = kurz(b);
  const uz = k.uz.sz - k.uz.svSz - k.uz.lstSzFest, wr = k.wr.sz - k.wr.svSz - k.wr.lstSzFest;
  return { b, k, uz, wr, lstUz: k.uz.lstSzFest, lstWr: k.wr.lstSzFest, quote: (uz + wr) / (2 * b) };
};
const BRUTTOS = [1300, 1800, 2200, 2600, 3000, 3500, 4000, 5000, 6000, 8000];
const tab = BRUTTOS.map(sz);
const B = 3000, x = sz(B);
/** Monatsgehalt, bis zu dem beide Sonderzahlungen lohnsteuerfrei bleiben (Sechstel = zwei Monatsgehälter). */
const freiBis = S.freigrenze_sechstel / 2;
const unter = sz(1300), ueber = sz(1400);
/** Austritt Ende September: Urlaubszuschuss im Juni, anteilige Weihnachtsremuneration (9/12) mit dem letzten Gehalt. */
const aus = rechneJahr(Array.from({ length: 12 }, (_, i) => ({ laufend: i < 9 ? B : 0, sz: i === 5 ? B : i === 8 ? B * 9 / 12 : 0 })), {}, true, true);
const sep = aus.monate[8];
const ausWrNetto = sep.sz - sep.svSz - sep.lstSzFest;
/** Satz der Sozialversicherung auf Sonderzahlungen bei voller Arbeitslosenversicherung. */
const svSzSatz = D.kv + D.pv + D.av;
const MP = P.mitarbeiterpraemie_2026_max;

export default defineGuide({
  id: 'dreizehntes-gehalt',
  group: 'lohn',
  order: 35,
  mini: 'urlaubsgeld',
  miniHref: 'sonderzahlungen',
  related: ['sonderzahlungen', 'jahressechstel', 'jahresgehalt', 'sozialversicherung', 'lohnsteuer'],
  sources: ['estg67', 'estg124b', 'oegkWerte'],
  de: {
    slug: '13-und-14-gehalt',
    nav: '13. und 14. Gehalt',
    card: 'Urlaubszuschuss und Weihnachtsremuneration netto: Freibetrag, 6 % Steuer und was beim Ein- oder Austritt anteilig bleibt.',
    title: '13. und 14. Gehalt 2026: Urlaubs- und Weihnachtsgeld netto',
    description: `13. und 14. Gehalt 2026: ${DE.eur(S.freibetrag)} steuerfrei, dann ${DE.pct(S.stufen[1][1])} Lohnsteuer. Netto-Tabelle für Urlaubszuschuss und Weihnachtsremuneration, anteilig bei einem Austritt.`,
    h1: 'Das 13. und 14. Gehalt: Urlaubszuschuss und Weihnachtsremuneration',
    intro: 'Woher der Anspruch auf die beiden Sonderzahlungen kommt, wie sie besteuert werden und wie viel davon bei Ihrem Gehalt netto ankommt.',
    resume: `Das 13. und 14. Gehalt, also Urlaubszuschuss und Weihnachtsremuneration, steht in Österreich nicht im Gesetz, sondern im Kollektivvertrag oder im Dienstvertrag; die allermeisten Kollektivverträge sehen beide vor. Steuerlich sind sie begünstigt: Die ersten ${DE.eur(S.freibetrag)} im Jahr bleiben steuerfrei, danach gilt ein fester Satz von ${DE.pct(S.stufen[1][1])} statt des Tarifs (§ 67 EStG), solange beide zusammen das Jahressechstel nicht überschreiten. Sozialversicherung fällt an, aber ohne Arbeiterkammerumlage und Wohnbauförderung, höchstens ${DE.pct(svSzSatz, 2)}. Bei ${DE.eur(B)} brutto bleiben vom Urlaubszuschuss ${DE.eur(x.uz, 2)} und von der Weihnachtsremuneration ${DE.eur(x.wr, 2)} netto, mehr als vom laufenden Monatsgehalt mit ${DE.eur(x.k.nettoMonat, 2)}. Der Urlaubszuschuss ist höher, weil er den Freibetrag verbraucht. Bis zu einem Monatsgehalt von ${DE.eur(freiBis, 2)} sind beide Sonderzahlungen ganz lohnsteuerfrei, weil das Sechstel dann die Freigrenze von ${DE.eur(S.freigrenze_sechstel)} nicht übersteigt. Zusätzlich kann der Arbeitgeber von Juli bis Dezember 2026 eine Mitarbeiterprämie bis ${DE.eur(MP)} steuerfrei zahlen.`,
    faqs: [
      { q: 'Habe ich einen gesetzlichen Anspruch auf das 13. und 14. Gehalt?', a: `Nein, ein Gesetz schreibt Urlaubszuschuss und Weihnachtsremuneration nicht vor. Der Anspruch ergibt sich aus dem Kollektivvertrag Ihrer Branche, aus einer Betriebsvereinbarung oder aus Ihrem Dienstvertrag. Weil nahezu jede Branche einen Kollektivvertrag mit Sonderzahlungen hat, bekommen die meisten Beschäftigten beide. Höhe, Fälligkeit und anteilige Ansprüche stehen im jeweiligen Vertrag; das Einkommensteuergesetz regelt nur, wie sie besteuert werden (§ 67 EStG).` },
      { q: 'Warum ist mein Urlaubszuschuss netto höher als die Weihnachtsremuneration?', a: `Weil der Freibetrag von ${DE.eur(S.freibetrag)} nur einmal im Jahr wirkt und von der ersten Sonderzahlung verbraucht wird. Bei ${DE.eur(B)} brutto kostet der Urlaubszuschuss ${DE.eur(x.lstUz, 2)} Lohnsteuer, die Weihnachtsremuneration ${DE.eur(x.lstWr, 2)}. Netto liegen die beiden ${DE.eur(x.uz - x.wr, 2)} auseinander. Kommt die Weihnachtsremuneration zuerst, etwa bei einem Eintritt im Herbst, ist es umgekehrt.` },
      { q: 'Ab welchem Gehalt zahlt man Lohnsteuer auf das 13. und 14. Gehalt?', a: `Ab einem Monatsgehalt über ${DE.eur(freiBis, 2)} bei zwölf gleichen Gehältern. Darunter beträgt das Jahressechstel höchstens ${DE.eur(S.freigrenze_sechstel)}, und für diese Freigrenze sieht § 67 Abs. 1 EStG keine Lohnsteuer auf Sonderzahlungen vor. Es ist eine Grenze, kein Freibetrag: Bei ${DE.eur(1400)} brutto werden auf beide Zahlungen zusammen ${DE.eur(ueber.lstUz + ueber.lstWr, 2)} Lohnsteuer fällig, bei ${DE.eur(1300)} nichts. Sozialversicherung fällt in beiden Fällen an.` },
      { q: 'Bekomme ich beim Austritt ein anteiliges 13. und 14. Gehalt?', a: `Das regelt Ihr Kollektivvertrag, auch für die Frage, ob eine Selbstkündigung etwas ändert. Steuerlich werden anteilige Sonderzahlungen in der Endabrechnung wie die regulären behandelt: fester Satz innerhalb des Sechstels. Im Beispiel mit Austritt Ende September bei ${DE.eur(B)} bringt eine Weihnachtsremuneration von neun Zwölfteln ${DE.eur(sep.sz, 2)} brutto und ${DE.eur(ausWrNetto, 2)} netto. Eine Nachversteuerung am Jahresende entfällt bei Beendigung des Dienstverhältnisses.` },
      { q: 'Ist die Mitarbeiterprämie 2026 zusätzlich zum 13. und 14. Gehalt steuerfrei?', a: `Ja, wenn der Arbeitgeber sie zwischen Juli und Dezember 2026 zahlt, bis ${DE.eur(MP)} je Person. Grundlage muss ein Kollektivvertrag oder eine Betriebsvereinbarung sein; ohne Betriebsrat genügt eine Vereinbarung für alle Beschäftigten. Es muss eine zusätzliche Zahlung sein, die bisher nicht üblich war. Sie erhöht das Jahressechstel nicht und verbraucht es nicht (§ 124b EStG), Urlaubs- und Weihnachtsgeld bleiben also unverändert begünstigt.` },
    ],
    body: (h) => `
<h2>Woher der Anspruch kommt</h2>
<p>In Österreich bekommen die meisten Angestellten und Arbeiter vierzehn Gehälter im Jahr. Die beiden zusätzlichen heißen Urlaubszuschuss (oft Urlaubsgeld, meist mit dem Junigehalt) und Weihnachtsremuneration (Weihnachtsgeld, meist im November). Sie sind keine freiwillige Geste und auch kein gesetzlicher Anspruch: Sie stehen im Kollektivvertrag der Branche, in einer Betriebsvereinbarung oder im Dienstvertrag. Daraus ergeben sich Höhe, Auszahlungsmonat und was bei Ein- und Austritt gilt. Häufig entspricht jede Sonderzahlung einem Monatsgehalt; maßgeblich ist, was im Vertrag steht.</p>
<p>Das Steuerrecht nennt die beiden als Beispiel für sonstige Bezüge, die ein Arbeitnehmer neben dem laufenden Lohn von demselben Arbeitgeber bekommt (${h.src('estg67', '§ 67 Abs. 1 EStG')}). An dieser Formulierung hängt die Begünstigung: Sie gilt je Arbeitgeber, und sie gilt auch für Belohnungen und Prämien, die nicht vierzehnmal, sondern einmalig gezahlt werden.</p>
<h2>Wie die Sonderzahlungen besteuert werden</h2>
<p>Statt des Tarifs, der bei mittleren Gehältern ${h.pct(h.P.tarif.saetze[2])} oder ${h.pct(h.P.tarif.saetze[3])} von jedem weiteren Euro nimmt, gelten feste Sätze. Zuerst wird die Sozialversicherung abgezogen, dann gilt:</p>
<ul>
<li>die ersten ${h.eur(S.freibetrag)} im Kalenderjahr: steuerfrei,</li>
<li>die nächsten ${h.eur(S.stufen[1][0])}: ${h.pct(S.stufen[1][1])},</li>
<li>darüber steigen die Sätze auf ${h.pct(S.stufen[2][1])} und ${h.pct(S.stufen[3][1], 2)}, was erst bei sehr hohen Sonderzahlungen eine Rolle spielt.</li>
</ul>
<p>Das gilt nur, soweit die Sonderzahlungen innerhalb des Jahressechstels liegen, bei gleichbleibendem Gehalt also bis zu zwei Monatsgehältern. Was das Sechstel überschreitet und wie die Lohnverrechnung es am Jahresende nachrechnet, erklärt der Ratgeber zum ${h.a('jahressechstel', 'Jahressechstel')} im Detail.</p>
<h3>Die Freigrenze für kleine Gehälter</h3>
<p>Beträgt das Jahressechstel höchstens ${h.eur(S.freigrenze_sechstel)}, fällt auf Sonderzahlungen gar keine Lohnsteuer an. Bei zwölf gleichen Gehältern ist das bis ${h.eur(freiBis, 2)} brutto im Monat der Fall. Es ist eine Freigrenze, kein Freibetrag: Wird sie überschritten, wird der ganze Betrag nach den festen Sätzen besteuert. Bei ${h.eur(1300)} brutto bleiben beide Sonderzahlungen lohnsteuerfrei, bei ${h.eur(1400)} kosten sie zusammen ${h.eur(ueber.lstUz + ueber.lstWr, 2)}. Für 2027 ist die Freigrenze bereits auf ${h.eur(S.freigrenze_sechstel_2027)} angehoben.</p>
<h3>Sozialversicherung ohne Arbeiterkammer und Wohnbauförderung</h3>
<p>Auf Sonderzahlungen fallen Kranken-, Pensions- und Arbeitslosenversicherung an, insgesamt höchstens ${h.pct(svSzSatz, 2)}. Die reduzierte Arbeitslosenversicherung für kleine Einkommen richtet sich nach der Höhe der Sonderzahlung selbst. Für beide zusammen gilt die Höchstbeitragsgrundlage von ${h.eur(h.P.sv.hbg_sz_jahr)} im Jahr (${h.src('oegkWerte', 'ÖGK')}); wer mehr verdient, zahlt auf die Weihnachtsremuneration weniger Beiträge als auf den Urlaubszuschuss. Mehr zu den einzelnen Beiträgen unter ${h.a('sozialversicherung', 'Sozialversicherung')}.</p>
<h2>Netto-Tabelle: Urlaubszuschuss und Weihnachtsremuneration</h2>
${h.table(['Monatsbrutto', 'Urlaubszuschuss netto', 'Weihnachtsremuneration netto', 'Lohnsteuer auf beide', 'Laufendes Monatsnetto', 'Netto-Quote der Sonderzahlungen'], tab.map((z) => [h.eur(z.b), h.eur(z.uz, 2), h.eur(z.wr, 2), h.eur(z.lstUz + z.lstWr, 2), h.eur(z.k.nettoMonat, 2), h.pct(z.quote, 1)]), 'Sonderzahlungen je ein Monatsgehalt, Juni und November, außerhalb Wiens; Werte aus dem Rechner dieser Seite', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Tabelle zeigt, warum die Sonderzahlungen so beliebt sind: Ab mittleren Gehältern bleibt von ihnen deutlich mehr übrig als von einem gewöhnlichen Monatsgehalt. Bei ${h.eur(B)} beträgt die Netto-Quote der beiden Zahlungen ${h.pct(x.quote, 1)}, beim laufenden Gehalt ${h.pct(x.k.nettoMonat / B, 1)}. Ganz oben in der Tabelle kippt das Verhältnis zwischen Urlaubszuschuss und Weihnachtsremuneration, weil die Höchstbeitragsgrundlage für Sonderzahlungen schon im Juni weitgehend ausgeschöpft ist.</p>
<!--mini:urlaubsgeld-->
<h2>Eintritt und Austritt während des Jahres</h2>
<p>Wer nicht das ganze Jahr bei einem Arbeitgeber ist, bekommt die Sonderzahlungen meist anteilig. Wie genau, und ob das auch bei Selbstkündigung oder Entlassung gilt, steht im Kollektivvertrag; diese Seite kann die Regeln der vielen Branchen nicht ersetzen. Steuerlich ändert sich wenig: Auch die anteilige Weihnachtsremuneration in der Endabrechnung ist ein sonstiger Bezug mit festem Satz, und das Sechstel wird aus den bis dahin bezahlten Monaten gebildet.</p>
<p>Ein Beispiel mit ${h.eur(B)} brutto, Urlaubszuschuss im Juni und Austritt Ende September: Mit dem letzten Gehalt kommen neun Zwölftel der Weihnachtsremuneration, das sind ${h.eur(sep.sz, 2)} brutto. Nach ${h.eur(sep.svSz, 2)} Sozialversicherung und ${h.eur(sep.lstSzFest, 2)} Lohnsteuer bleiben ${h.eur(ausWrNetto, 2)}. Weil das Dienstverhältnis endet, entfällt die Kontrollrechnung, die sonst zu viel begünstigte Beträge nachversteuern würde. Beim neuen Arbeitgeber beginnen Freibetrag und Sechstel von vorn; in der Arbeitnehmerveranlagung werden die Sonderzahlungen beider zusammengeführt.</p>
<h2>Die Mitarbeiterprämie 2026</h2>
<p>Neben Urlaubs- und Weihnachtsgeld erlaubt das Gesetz für 2026 eine weitere steuerfreie Zahlung (${h.src('estg124b', '§ 124b EStG')}). Die Bedingungen:</p>
<ul>
<li>ausbezahlt in den Monaten Juli bis Dezember 2026, bis ${h.eur(MP)} je Person steuerfrei;</li>
<li>auf Grundlage eines Kollektivvertrags oder einer Betriebsvereinbarung; gibt es keinen Betriebsrat, reicht eine vertragliche Vereinbarung für alle Arbeitnehmer;</li>
<li>eine zusätzliche Zahlung, die bisher nicht üblich war, oder eine befristete Prämie anstelle einer Lohnerhöhung;</li>
<li>zusammen mit einer steuerfreien Gewinnbeteiligung höchstens ${h.eur(h.P.mitarbeiterpraemie_2026_mit_gewinnbeteiligung_max)}; wird mehr steuerfrei behandelt, folgt eine Pflichtveranlagung.</li>
</ul>
<p>Für Ihre Sonderzahlungen ist wichtig: Die Prämie erhöht das Jahressechstel nicht und wird auch nicht darauf angerechnet. Urlaubszuschuss und Weihnachtsremuneration bleiben also im selben Umfang begünstigt, wie wenn es die Prämie nicht gäbe. Den eigenen Jahresverlauf mit Prämie, Erhöhung oder Austritt rechnen Sie im ${h.a('sonderzahlungen', 'Urlaubsgeld- und Weihnachtsgeld-Rechner')} durch.</p>
`,
  },
  en: {
    slug: '13th-and-14th-salary',
    nav: '13th and 14th salary',
    card: 'Holiday pay and Christmas pay after tax: the allowance, the 6% rate and what you get when you join or leave mid-year.',
    title: '13th and 14th Salary Austria 2026: Holiday and Christmas Pay',
    description: `13th and 14th salary in Austria 2026: first ${EN.eur(S.freibetrag)} tax-free, then ${EN.pct(S.stufen[1][1])}. Net table for holiday and Christmas pay, pro-rata rules on leaving and the 2026 bonus.`,
    h1: 'The 13th and 14th salary: holiday pay and Christmas pay',
    intro: 'Where the right to Austria’s two extra salaries comes from, how they are taxed and what actually reaches your account.',
    resume: `Most employees in Austria are paid fourteen times a year. The 13th and 14th salary, called Urlaubszuschuss (holiday pay) and Weihnachtsremuneration (Christmas pay), come from the collective agreement (Kollektivvertrag) of your industry or your contract, not from statute. They are taxed far more lightly than regular pay: the first ${EN.eur(S.freibetrag)} a year are tax-free and the rest is taxed at a flat ${EN.pct(S.stufen[1][1])} instead of the normal scale (section 67 of the Income Tax Act), as long as both together stay within the annual sixth. Social insurance applies, but without the Chamber levy and housing contribution, at most ${EN.pct(svSzSatz, 2)}. On a ${EN.eur(B)} salary, holiday pay leaves ${EN.eur(x.uz, 2)} net and Christmas pay ${EN.eur(x.wr, 2)}, both more than the regular monthly net of ${EN.eur(x.k.nettoMonat, 2)}. Holiday pay comes out higher because it uses up the allowance. Up to a monthly salary of ${EN.eur(freiBis, 2)} both are entirely free of wage tax. Between July and December 2026 employers may also pay a tax-free bonus of up to ${EN.eur(MP)}.`,
    faqs: [
      { q: 'Is the 13th and 14th salary a legal right in Austria?', a: `Not by statute. No law obliges employers to pay holiday pay and Christmas pay. The right comes from the collective agreement covering your industry, a works agreement or your employment contract. Because almost every sector has a collective agreement that includes both, nearly all employees receive them. The amount, payment month and pro-rata rules are in that agreement; the Income Tax Act only governs how they are taxed.` },
      { q: 'Why is Austrian holiday pay higher after tax than Christmas pay?', a: `Because the ${EN.eur(S.freibetrag)} allowance applies once per year and is used by the first special payment, normally holiday pay in June. At ${EN.eur(B)} gross, holiday pay costs ${EN.eur(x.lstUz, 2)} in wage tax and Christmas pay ${EN.eur(x.lstWr, 2)}, a net difference of ${EN.eur(x.uz - x.wr, 2)}. If you start a job in autumn and Christmas pay comes first, the order is reversed.` },
      { q: 'Below what salary is the 13th and 14th salary free of Austrian wage tax?', a: `With twelve equal monthly salaries, up to ${EN.eur(freiBis, 2)} gross a month. At that level the annual sixth is at most ${EN.eur(S.freigrenze_sechstel)}, and section 67(1) then charges no tax on special payments. It is a cliff, not an allowance: at ${EN.eur(1400)} both payments together cost ${EN.eur(ueber.lstUz + ueber.lstWr, 2)} in wage tax, at ${EN.eur(1300)} nothing. Social insurance is due either way.` },
      { q: 'Do I get a pro-rata 13th and 14th salary when I leave an Austrian job?', a: `Your collective agreement decides, including whether resigning changes anything. For tax, pro-rata special payments in the final settlement are treated like regular ones, at the flat rate within the sixth. Leaving at the end of September on ${EN.eur(B)}, nine twelfths of Christmas pay come to ${EN.eur(sep.sz, 2)} gross and ${EN.eur(ausWrNetto, 2)} net. No year-end clawback applies when the employment ends.` },
      { q: 'Is the 2026 employee bonus tax-free on top of the 13th and 14th salary?', a: `Yes, if your employer pays it between July and December 2026, up to ${EN.eur(MP)} per person. It must rest on a collective or works agreement, or, where there is no works council, an arrangement covering all staff, and it must be an extra payment not usually made before. It neither raises nor uses up the annual sixth (section 124b), so your holiday and Christmas pay keep their full tax advantage.` },
    ],
    body: (h) => `
<h2>Where the right comes from</h2>
<p>If you come from a country with twelve salaries a year, Austrian pay offers can be confusing: the monthly figure is paid fourteen times. The two extra payments are Urlaubszuschuss (holiday pay, usually with the June salary) and Weihnachtsremuneration (Christmas pay, usually in November). They are not a goodwill gesture, nor a statutory right. They are set in the collective agreement (Kollektivvertrag) for your sector, in a works agreement or in your contract, which also fix the amount, the payment month and what happens when you join or leave. One monthly salary each is the common pattern, but some agreements differ.</p>
<p>Tax law mentions them as the typical example of “other payments” an employee receives from the same employer alongside regular pay (${h.src('estg67', 'section 67(1) of the Income Tax Act')}). That wording matters: the tax advantage applies per employer, and it also covers one-off bonuses and rewards, not only the 13th and 14th salary.</p>
<h2>How the special payments are taxed</h2>
<p>Instead of the scale, which takes ${h.pct(h.P.tarif.saetze[2])} or ${h.pct(h.P.tarif.saetze[3])} of each extra euro on mid-range salaries, fixed rates apply. Social insurance comes off first, then:</p>
<ul>
<li>the first ${h.eur(S.freibetrag)} per calendar year: tax-free,</li>
<li>the next ${h.eur(S.stufen[1][0])}: ${h.pct(S.stufen[1][1])},</li>
<li>beyond that ${h.pct(S.stufen[2][1])} and ${h.pct(S.stufen[3][1], 2)}, which only matters for very large special payments.</li>
</ul>
<p>This holds only as far as the special payments fit within the annual sixth, which with a steady salary means up to two monthly salaries. What happens above it, and how payroll checks it again in December, is covered in detail on the ${h.a('jahressechstel', 'annual sixth')} page.</p>
<h3>The exemption limit for small salaries</h3>
<p>If the annual sixth is no more than ${h.eur(S.freigrenze_sechstel)}, special payments bear no wage tax at all. With twelve equal salaries that is the case up to ${h.eur(freiBis, 2)} gross a month. It is a limit, not an allowance: once exceeded, the whole amount is taxed at the fixed rates. At ${h.eur(1300)} gross both payments are free of wage tax; at ${h.eur(1400)} they cost ${h.eur(ueber.lstUz + ueber.lstWr, 2)} together. For 2027 the limit has already been raised to ${h.eur(S.freigrenze_sechstel_2027)}.</p>
<h3>Social insurance without the Chamber levy and housing contribution</h3>
<p>Special payments carry health, pension and unemployment insurance, at most ${h.pct(svSzSatz, 2)} in total. The reduced unemployment rate for small amounts looks at the size of the special payment itself. Both share an annual ceiling of ${h.eur(h.P.sv.hbg_sz_jahr)} (${h.src('oegkWerte', 'ÖGK')}), so high earners pay fewer contributions on Christmas pay than on holiday pay. Details on each item are on the ${h.a('sozialversicherung', 'social insurance')} page.</p>
<h2>Net table: holiday pay and Christmas pay</h2>
${h.table(['Monthly gross', 'Holiday pay net', 'Christmas pay net', 'Wage tax on both', 'Regular monthly net', 'Net share of special payments'], tab.map((z) => [h.eur(z.b), h.eur(z.uz, 2), h.eur(z.wr, 2), h.eur(z.lstUz + z.lstWr, 2), h.eur(z.k.nettoMonat, 2), h.pct(z.quote, 1)]), 'One monthly salary each, paid in June and November, outside Vienna; figures from this site’s engine', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The table shows why Austrians value these payments: from mid-range salaries on, far more of them reaches your account than of an ordinary month’s pay. At ${h.eur(B)}, ${h.pct(x.quote, 1)} of the two payments is left after deductions, against ${h.pct(x.k.nettoMonat / B, 1)} of a regular salary. When comparing a job offer in Austria with one abroad, annual gross must include both extra salaries; the ${h.a('jahresgehalt', 'annual salary page')} does that conversion. At the top of the table the order of holiday and Christmas pay flips, because the contribution ceiling for special payments is largely used up in June.</p>
<!--mini:urlaubsgeld-->
<h2>Joining or leaving during the year</h2>
<p>If you are not with one employer for the full year, you normally receive the special payments pro rata. How exactly, and whether resigning or dismissal changes it, is set by your collective agreement; this page cannot replace the rules of the many sector agreements. For tax little changes: pro-rata Christmas pay in the final settlement is still an “other payment” at the fixed rate, and the sixth is built from the months already paid.</p>
<p>Take ${h.eur(B)} gross, holiday pay in June and a departure at the end of September. With the last salary come nine twelfths of Christmas pay, ${h.eur(sep.sz, 2)} gross. After ${h.eur(sep.svSz, 2)} social insurance and ${h.eur(sep.lstSzFest, 2)} wage tax, ${h.eur(ausWrNetto, 2)} remain. Because the job ends, the December control calculation, which could otherwise claw back over-favoured amounts, does not apply. At a new employer the allowance and the sixth start again; your annual tax assessment then combines the special payments from both.</p>
<h2>The 2026 employee bonus</h2>
<p>On top of holiday and Christmas pay, the law allows one more tax-free payment in 2026, the Mitarbeiterprämie (${h.src('estg124b', 'section 124b')}). The conditions:</p>
<ul>
<li>paid in July to December 2026, tax-free up to ${h.eur(MP)} per employee;</li>
<li>based on a collective or works agreement; without a works council, a contractual arrangement for all employees is enough;</li>
<li>an additional payment not usually made before, or a temporary bonus in place of a pay rise;</li>
<li>together with a tax-free profit share, no more than ${h.eur(h.P.mitarbeiterpraemie_2026_mit_gewinnbeteiligung_max)}; if more is treated as tax-free, a tax assessment becomes mandatory.</li>
</ul>
<p>For your special payments the key point is that the bonus neither raises the annual sixth nor counts against it. Holiday and Christmas pay keep the same tax advantage as without it. Model your own year, with bonus, pay rise or departure, in the ${h.a('sonderzahlungen', 'holiday and Christmas pay calculator')}.</p>
`,
  },
});
