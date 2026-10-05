import { defineGuide } from '../../lib/guide-types';
import { kbgEinkommensabhaengig, kbgKonto } from '../../lib/engine/leistungen';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

/** Einkommensabhängiges KBG 2026: Werte aus params, Beispiele und Schwellen aus dem Motor. */
const K = P.kbg;
const SZ = K.wochengeld_sz_zuschlag;
const konto1 = kbgKonto(K.konto_tage_ein_elternteil_min);
const konto2 = kbgKonto(K.konto_tage_beide_min, true);
const kontoLang = kbgKonto(K.konto_tage_ein_elternteil_max);
/** Netto im Monat, ab dem die Variante mehr als den Mindestsatz (= Tagsatz der kürzesten Konto-Variante) bringt. */
let ab = 500;
while (kbgEinkommensabhaengig(ab).tagsatz <= K.konto_tag_max) ab += 1;
/** Netto im Monat, ab dem der Höchstbetrag erreicht ist. */
let max = ab;
while (!kbgEinkommensabhaengig(max).gedeckelt) max += 1;
const BSP = [1500, 2000, 2500, 3000].map((n) => {
  const e = kbgEinkommensabhaengig(n);
  return { n, e, summe: r2(e.tagsatz * K.ea_tage_ein), plus: r2(e.tagsatz * K.ea_tage_ein - konto1.gesamt) };
});
const [, n2000, n2500] = BSP;
/** Beide Eltern: 426 Tage, davon 61 für den zweiten Elternteil. */
const beide2500 = r2(n2500.e.tagsatz * K.ea_tage_beide);
/** Günstigkeitsrechnung aus dem Steuerbescheid: (Einkünfte × 0,62 + 4.000) ÷ 365. */
const ausBescheid = (eink: number) => r2((eink * K.ea_steuerbescheid_quote + K.ea_steuerbescheid_sockel) / 365);
const EINK = 35000;
const bescheidMax = Math.ceil((K.ea_tag_max * 365 - K.ea_steuerbescheid_sockel) / K.ea_steuerbescheid_quote);

export default defineGuide({
  id: 'kbg-einkommensabhaengig',
  group: 'leistungen',
  order: 40,
  mini: 'kbgEa',
  miniHref: 'kinderbetreuungsgeld',
  related: ['kinderbetreuungsgeld', 'wochengeld', 'kbg-zuverdienst', 'familienbonus', 'netto-brutto'],
  sources: ['kbgEa', 'kbgBroschuere', 'oegkWochengeld'],
  de: {
    slug: 'einkommensabhaengiges-kinderbetreuungsgeld',
    nav: 'Einkommensabhängiges KBG',
    card: `${DE.pct(K.ea_quote)} des Wochengeldes, höchstens ${DE.eur(K.ea_tag_max, 2)} am Tag: ab welchem Netto die Variante das Konto schlägt.`,
    title: 'Einkommensabhängiges Kinderbetreuungsgeld 2026: Höhe, Dauer',
    description: `Einkommensabhängiges Kinderbetreuungsgeld 2026: ${DE.pct(K.ea_quote)} des Wochengeldes, höchstens ${DE.eur(K.ea_tag_max, 2)} am Tag, ${K.ea_tage_ein} oder ${K.ea_tage_beide} Tage. Ab ${DE.eur(ab)} netto schlägt es das Konto.`,
    h1: 'Einkommensabhängiges Kinderbetreuungsgeld: lohnt es sich?',
    intro: 'Die kurze, hohe Variante des Kinderbetreuungsgeldes: wie sie aus dem Wochengeld entsteht, wer sie bekommt und ab welchem Einkommen sie sich rechnet.',
    resume: `Das einkommensabhängige Kinderbetreuungsgeld beträgt 2026 ${DE.pct(K.ea_quote)} der Letzteinkünfte, bei Müttern mit Wochengeld ${DE.pct(K.ea_quote)} des Wochengeldes, höchstens ${DE.eur(K.ea_tag_max, 2)} und mindestens ${DE.eur(K.konto_tag_max, 2)} am Tag. Es läuft bis zum ${K.ea_tage_ein}. Tag nach der Geburt, wenn ein Elternteil bezieht, und bis zum ${K.ea_tage_beide}. Tag, wenn sich beide abwechseln; jedem Elternteil sind ${K.ea_partner_tage} Tage unübertragbar vorbehalten. Voraussetzung sind ${K.ea_erwerb_tage} Kalendertage kranken- und pensionsversicherungspflichtige Erwerbstätigkeit in Österreich unmittelbar vor der Geburt oder dem Mutterschutz, ohne Arbeitslosengeld in dieser Zeit. Neben dem Bezug sind nur ${DE.eur(K.zuverdienst_ea)} Zuverdienst im Kalenderjahr erlaubt. Nach dem Motor dieser Seite liegt die Variante ab rund ${DE.eur(ab)} Nettogehalt im Monat über dem Tagsatz der kürzesten Konto-Variante (${DE.eur(K.konto_tag_max, 2)}), den Höchstbetrag erreicht man ab etwa ${DE.eur(max)} netto. Bei ${DE.eur(n2500.n)} netto bringt sie in ${K.ea_tage_ein} Tagen ${DE.eur(n2500.summe)}, das sind ${DE.eur(n2500.plus)} mehr als das Konto mit ${DE.eur(konto1.gesamt)}. Bei gleicher Aufteilung gibt es ${DE.eur(K.partnerschaftsbonus_je)} Partnerschaftsbonus je Elternteil.`,
    faqs: [
      { q: 'Wie hoch ist das einkommensabhängige Kinderbetreuungsgeld bei 2.000 Euro netto?', a: `Rund ${DE.eur(n2000.e.tagsatz, 2)} am Tag oder ${DE.eur(n2000.e.monat)} für 30 Tage. Der Motor schätzt dafür ein Wochengeld von ${DE.eur(n2000.e.wochengeldTag, 2)} am Tag: das Netto der letzten drei Monate je Kalendertag plus ${DE.pct(SZ.zwei_monatsbezuege)} Sonderzahlungszuschlag bei Urlaubs- und Weihnachtsgeld. Davon gibt es ${DE.pct(K.ea_quote)}. Den genauen Betrag berechnet die ÖGK aus der Arbeits- und Entgeltbestätigung Ihres Arbeitgebers.` },
      { q: 'Ab welchem Nettoeinkommen lohnt sich das einkommensabhängige Kinderbetreuungsgeld?', a: `Rein rechnerisch ab rund ${DE.eur(ab)} netto im Monat: Darunter liegt der Tagsatz beim Mindestbetrag von ${DE.eur(K.konto_tag_max, 2)}, den auch die kürzeste Konto-Variante zahlt. Darüber steigt er bis ${DE.eur(K.ea_tag_max, 2)}. Wer länger als ein Jahr zu Hause bleiben oder mehr als ${DE.eur(K.zuverdienst_ea)} im Jahr dazuverdienen will, fährt mit dem Konto trotzdem oft besser, weil dort bis zu ${DE.eur(K.zuverdienst_konto)} erlaubt sind.` },
      { q: 'Welche Erwerbstätigkeit brauche ich für das einkommensabhängige Kinderbetreuungsgeld?', a: `In den ${K.ea_erwerb_tage} Kalendertagen vor der Geburt eine in Österreich kranken- und pensionsversicherungspflichtige Erwerbstätigkeit, tatsächlich und ohne Unterbrechung; Lücken bis ${K.ea_unterbrechung_tage} Tage schaden nicht. Ein geringfügiger Job reicht also nicht. Mutterschutz und Elternkarenz bei aufrechtem Dienstverhältnis zählen als Erwerbstätigkeit, wenn sie direkt anschließen. In diesen ${K.ea_erwerb_tage} Tagen darf kein Arbeitslosengeld und keine Notstandshilfe bezogen werden.` },
      { q: 'Wie lange gibt es einkommensabhängiges Kinderbetreuungsgeld, wenn sich beide Eltern abwechseln?', a: `Bis zum ${K.ea_tage_beide}. Tag ab der Geburt statt bis zum ${K.ea_tage_ein}. Ein Elternteil kann aber nie mehr als ${K.ea_tage_ein} Tage beziehen, und ${K.ea_partner_tage} Tage sind dem anderen unübertragbar vorbehalten. Ein Block dauert mindestens ${K.ea_partner_tage} Tage. Beim ersten Wechsel dürfen beide bis zu ${K.gleichzeitig_max_tage} Tage gleichzeitig beziehen, die Gesamtdauer verkürzt sich dann um diese Tage. Beide sind an das einmal gewählte System gebunden.` },
      { q: 'Wie wird das einkommensabhängige Kinderbetreuungsgeld für Väter berechnet?', a: `Väter bekommen kein Wochengeld, deshalb rechnet die Krankenkasse ein fiktives Wochengeld. Statt des Beginns der Schutzfrist zählt ein Zeitraum von acht Wochen vor der Geburt; davon gibt es ${DE.pct(K.ea_quote)}, höchstens ${DE.eur(K.ea_tag_max, 2)} am Tag. Danach folgt dieselbe Günstigkeitsrechnung aus dem Steuerbescheid wie bei Müttern. Auch für Väter gelten die ${K.ea_erwerb_tage} Tage Erwerbstätigkeit vor der Geburt.` },
      { q: 'Was zahlt das einkommensabhängige Kinderbetreuungsgeld, wenn mir Tage der Erwerbstätigkeit fehlen?', a: `Dann gibt es auf Antrag eine Sonderleistung von ${DE.eur(K.konto_tag_max, 2)} am Tag, sofern alle anderen Voraussetzungen erfüllt sind. Das ist genau der Tagsatz der kürzesten Konto-Variante, aber mit den strengeren Regeln des einkommensabhängigen Systems, etwa der Zuverdienstgrenze von ${DE.eur(K.zuverdienst_ea)}. Wer die ${K.ea_erwerb_tage} Tage knapp verfehlt, sollte daher das Konto ernsthaft prüfen.` },
    ],
    body: (h) => `
<h2>Zwei Systeme, eine Entscheidung</h2>
<p>Für jedes Kind wählen die Eltern beim ersten Antrag ein System, und beide sind daran gebunden. Das ${h.a('kinderbetreuungsgeld', 'Kinderbetreuungsgeld-Konto')} zahlt einen Pauschalbetrag, den man auf ${h.num(K.konto_tage_ein_elternteil_min)} bis ${h.num(K.konto_tage_ein_elternteil_max)} Tage verteilt. Das einkommensabhängige Kinderbetreuungsgeld ist laut ${h.src('kbgEa', 'Bundeskanzleramt')} ein Einkommensersatz für Eltern, die nur kurz aus dem Beruf aussteigen und vorher gut verdient haben.</p>
${h.table(['', 'einkommensabhängig', 'Konto (kürzeste Variante)'], [
  ['Tagsatz', `${h.pct(K.ea_quote)} der Letzteinkünfte, ${h.eur(K.konto_tag_max, 2)} bis ${h.eur(K.ea_tag_max, 2)}`, h.eur(K.konto_tag_max, 2)],
  ['Dauer ein Elternteil', `bis Tag ${h.num(K.ea_tage_ein)}`, `${h.num(K.konto_tage_ein_elternteil_min)} bis ${h.num(K.konto_tage_ein_elternteil_max)} Tage`],
  ['Dauer beide Eltern', `bis Tag ${h.num(K.ea_tage_beide)}, ${h.num(K.ea_partner_tage)} Partnertage`, `${h.num(K.konto_tage_beide_min)} bis ${h.num(K.konto_tage_beide_max)} Tage`],
  ['Erwerbstätigkeit vorher', `${h.num(K.ea_erwerb_tage)} Tage, voll versichert`, 'nicht nötig'],
  ['Zuverdienst im Jahr', h.eur(K.zuverdienst_ea), `${h.eur(K.zuverdienst_konto)} oder ${h.pct(K.zuverdienst_individuell_quote)} der Letzteinkünfte`],
  ['Mehrlingszuschlag, Beihilfe', 'nein', 'ja'],
], `Vergleich nach der ${h.src('kbgBroschuere', 'Broschüre Kinderbetreuungsgeld 2026')}`, ['l', 'l', 'l'])}
<h2>Wie der Tagsatz entsteht</h2>
<p>Bei Müttern mit Wochengeld ist die Rechnung einfach: Das Kinderbetreuungsgeld beträgt ${h.pct(K.ea_quote)} des ${h.a('wochengeld', 'Wochengeldes')}. Das Wochengeld wiederum ist der durchschnittliche Nettoverdienst der letzten drei Kalendermonate vor der Schutzfrist je Tag, erhöht um einen Sonderzahlungszuschlag. Die ${h.src('oegkWochengeld', 'ÖGK')} nennt dafür ${h.pct(SZ.ein_monatsbezug)} bei einer, ${h.pct(SZ.zwei_monatsbezuege)} bei zwei und ${h.pct(SZ.mehr)} bei mehr Sonderzahlungen im Jahr. Für Väter, Adoptiv- und Pflegeeltern wird ein fiktives Wochengeld aus den acht Wochen vor der Geburt gerechnet, für Beamtinnen eines nach dem Muster einer Vertragsbediensteten.</p>
<p>Danach folgt eine Günstigkeitsrechnung: Die Krankenkasse nimmt die Einkünfte aus dem Steuerbescheid des Jahres vor der Geburt und rechnet (Einkünfte × ${h.num(K.ea_steuerbescheid_quote, 2)} + ${h.eur(K.ea_steuerbescheid_sockel)}) ÷ 365. Ist das Ergebnis höher, gilt es, niedriger wird der Tagsatz dadurch nie. Bei ${h.eur(EINK)} Einkünften ergibt die Formel ${h.eur(ausBescheid(EINK), 2)} am Tag; den Höchstbetrag erreicht sie ab rund ${h.eur(bescheidMax)}. Einen Steuerbescheid gibt es oft nur, wenn Sie eine ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')} gemacht haben.</p>
<h2>Was bei welchem Netto herauskommt</h2>
${h.table(['Netto im Monat', 'Wochengeld je Tag (Schätzung)', 'KBG je Tag', 'in 365 Tagen', 'mehr als Konto'], BSP.map((x) => [h.eur(x.n), h.eur(x.e.wochengeldTag, 2), h.eur(x.e.tagsatz, 2), h.eur(x.summe), h.eur(x.plus)]), `Ein Elternteil, ${h.pct(SZ.zwei_monatsbezuege)} Sonderzahlungszuschlag; Konto: ${h.eur(konto1.gesamt)} in der kürzesten Variante`, ['r', 'r', 'r', 'r', 'r'])}
<p>Die Schwelle liegt nach dieser Rechnung bei rund ${h.eur(ab)} netto im Monat. Darunter ist das einkommensabhängige Modell nie höher als das Konto, nur strenger. Ab etwa ${h.eur(max)} netto ist der Deckel von ${h.eur(K.ea_tag_max, 2)} erreicht, rund ${h.eur(r2(K.ea_tag_max * 30))} für 30 Tage; mehr Gehalt bringt dann nichts mehr. Teilen sich beide Eltern die ${h.num(K.ea_tage_beide)} Tage und verdienen beide ${h.eur(n2500.n)} netto, fließen ${h.eur(beide2500)} gegenüber ${h.eur(konto2.gesamt)} im Konto.</p>
<!--mini:kbgKonto-->
<h2>Die ${h.num(K.ea_erwerb_tage)} Tage vor der Geburt</h2>
<p>Die Erwerbstätigkeit muss in Österreich kranken- und pensionsversicherungspflichtig sein, tatsächlich ausgeübt und ununterbrochen. Unterbrechungen von zusammen bis zu ${h.num(K.ea_unterbrechung_tage)} Tagen sind egal; Krankenstand oder Urlaub mit Entgeltfortzahlung zählen nicht als Unterbrechung. Gleichgestellt sind direkt anschließend der Mutterschutz und eine Elternkarenz bis höchstens zum zweiten Geburtstag eines Kindes, solange das Dienstverhältnis aufrecht ist. Wer in diesen Tagen Arbeitslosengeld oder Notstandshilfe bekommt, verliert den Anspruch. Fehlen die Tage, gibt es auf Antrag nur ${h.eur(K.konto_tag_max, 2)} täglich als Sonderleistung.</p>
<h2>Wann das Konto trotz gutem Gehalt besser passt</h2>
<p>Der Vergleich pro Tag erzählt nur die halbe Geschichte. Das einkommensabhängige Modell endet spätestens am ersten Geburtstag, wenn nur ein Elternteil bezieht. Wer ${h.num(K.konto_tage_ein_elternteil_max)} Tage zu Hause bleiben will, bekommt im Konto ${h.eur(kontoLang.tagsatz, 2)} am Tag und insgesamt ${h.eur(kontoLang.gesamt)}; im einkommensabhängigen System gibt es nach dem ${h.num(K.ea_tage_ein)}. Tag gar nichts mehr. Ein zweiter Punkt ist der Wiedereinstieg: Wer schon im ersten Jahr wieder in Teilzeit arbeiten möchte, stößt beim einkommensabhängigen Modell schnell an die ${h.eur(K.zuverdienst_ea)}, beim Konto erst an ${h.eur(K.zuverdienst_konto)} oder die höhere individuelle Grenze. Und bei Zwillingen zahlt nur das Konto den Mehrlingszuschlag von ${h.pct(K.mehrling_zuschlag)} je weiterem Kind. Weil beide Eltern an das einmal beantragte System gebunden sind, lohnt es sich, diese Punkte vor dem ersten Antrag gemeinsam durchzugehen.</p>
<h2>Was neben dem Bezug erlaubt ist</h2>
<p>Weil die Leistung das Einkommen ersetzt, sind nur ${h.eur(K.zuverdienst_ea)} Zuverdienst im Kalenderjahr erlaubt, ein geringfügiger Job geht sich aus. Leistungen aus der Arbeitslosenversicherung sind im ganzen Bezugszeitraum ausgeschlossen. Was genau als Zuverdienst zählt und was bei einer Überschreitung zurückzuzahlen ist, steht auf der Seite ${h.a('kbg-zuverdienst', 'Zuverdienst beim Kinderbetreuungsgeld')}. Teilen sich die Eltern den Bezug annähernd gleich, gibt es zusätzlich einmalig ${h.eur(K.partnerschaftsbonus_je)} Partnerschaftsbonus für jeden.</p>
`,
  },
  en: {
    slug: 'earnings-related-childcare-allowance',
    nav: 'Earnings-related childcare allowance',
    card: `${EN.pct(K.ea_quote)} of maternity pay, up to ${EN.eur(K.ea_tag_max, 2)} a day: the net salary at which it beats the flat-rate account.`,
    title: 'Earnings-Related Childcare Allowance Austria 2026: Amounts',
    description: `Earnings-related childcare allowance Austria 2026: ${EN.pct(K.ea_quote)} of maternity pay, ${EN.eur(K.konto_tag_max, 2)} to ${EN.eur(K.ea_tag_max, 2)} a day for ${K.ea_tage_ein} or ${K.ea_tage_beide} days. Better than the account above ${EN.eur(ab)} net.`,
    h1: 'Earnings-related childcare allowance: is it worth it?',
    intro: 'The short, high-paying version of Austrian childcare allowance (Kinderbetreuungsgeld): how it is derived, who qualifies, and from which salary it pays off.',
    resume: `Austria’s earnings-related childcare allowance (einkommensabhängiges Kinderbetreuungsgeld) pays ${EN.pct(K.ea_quote)} of your recent earnings in 2026, or ${EN.pct(K.ea_quote)} of maternity pay (Wochengeld) for mothers who received it, between ${EN.eur(K.konto_tag_max, 2)} and ${EN.eur(K.ea_tag_max, 2)} a day. It runs until day ${K.ea_tage_ein} after the birth if one parent claims, and until day ${K.ea_tage_beide} if both take turns; ${K.ea_partner_tage} days are reserved for each parent and cannot be transferred. To qualify you must have worked ${K.ea_erwerb_tage} calendar days immediately before the birth or maternity leave in a job with Austrian health and pension insurance, without drawing unemployment benefit. While claiming, you may earn only ${EN.eur(K.zuverdienst_ea)} per calendar year. Using this site’s engine, the scheme pays more than the shortest flat-rate account option (${EN.eur(K.konto_tag_max, 2)} a day) from a net monthly salary of about ${EN.eur(ab)}, and reaches its ceiling at around ${EN.eur(max)} net. At ${EN.eur(n2500.n)} net it pays ${EN.eur(n2500.summe)} over ${K.ea_tage_ein} days, ${EN.eur(n2500.plus)} more than the ${EN.eur(konto1.gesamt)} account. Parents who split the time roughly equally each get a ${EN.eur(K.partnerschaftsbonus_je)} partnership bonus.`,
    faqs: [
      { q: 'How much earnings-related childcare allowance do I get on €2,000 net a month?', a: `About ${EN.eur(n2000.e.tagsatz, 2)} a day, or ${EN.eur(n2000.e.monat)} per 30 days. The engine estimates maternity pay of ${EN.eur(n2000.e.wochengeldTag, 2)} a day: net pay over the last three months per calendar day plus a ${EN.pct(SZ.zwei_monatsbezuege)} surcharge for holiday and Christmas bonuses. You receive ${EN.pct(K.ea_quote)} of that. The health insurer (ÖGK) calculates the exact figure from the earnings confirmation your employer sends.` },
      { q: 'At what salary does the earnings-related option beat the childcare allowance account?', a: `On the numbers alone, from about ${EN.eur(ab)} net a month. Below that the daily rate sits at the ${EN.eur(K.konto_tag_max, 2)} minimum, the same as the shortest account option; above it, the rate climbs to ${EN.eur(K.ea_tag_max, 2)}. If you want to stay home longer than a year or earn more than ${EN.eur(K.zuverdienst_ea)} a year on the side, the account can still be the better choice, as it allows up to ${EN.eur(K.zuverdienst_konto)}.` },
      { q: 'What work history do I need for earnings-related childcare allowance in Austria?', a: `${K.ea_erwerb_tage} calendar days right before the birth in work subject to Austrian health and pension insurance, actually performed and continuous; gaps of up to ${K.ea_unterbrechung_tage} days are ignored. A marginal mini-job is not enough; cross-border cases within the EU follow special rules. Maternity protection and parental leave directly afterwards count as work if your employment contract continues. No unemployment benefit may be drawn during those days.` },
      { q: 'How long does the earnings-related allowance last if both parents share it?', a: `Until day ${K.ea_tage_beide} after the birth instead of day ${K.ea_tage_ein}. One parent can never claim more than ${K.ea_tage_ein} days, and ${K.ea_partner_tage} days are reserved for the other. Each block lasts at least ${K.ea_partner_tage} days. At the first switch both may claim together for up to ${K.gleichzeitig_max_tage} days, which shortens the total by those days. Both parents are bound by the scheme chosen first.` },
      { q: 'How is the earnings-related allowance worked out for fathers?', a: `Fathers do not receive maternity pay, so the health insurer calculates a notional one. Instead of the start of maternity protection, it looks at an eight-week period before the birth and pays ${EN.pct(K.ea_quote)} of the result, up to ${EN.eur(K.ea_tag_max, 2)} a day. The same check against the previous year’s tax assessment then applies. Fathers also need the ${K.ea_erwerb_tage} days of insured work before the birth.` },
      { q: 'What does the earnings-related allowance pay if I fall short of the work requirement?', a: `On application you receive a special payment (Sonderleistung) of ${EN.eur(K.konto_tag_max, 2)} a day, provided every other condition is met. That equals the shortest account option’s rate but comes with the stricter rules of the earnings-related scheme, such as the ${EN.eur(K.zuverdienst_ea)} earnings limit. If you narrowly miss the ${K.ea_erwerb_tage} days, compare the account option carefully before applying.` },
    ],
    body: (h) => `
<h2>Two schemes, one choice</h2>
<p>For each child, parents choose a scheme with the first application, and both are bound by it. The ${h.a('kinderbetreuungsgeld', 'childcare allowance account')} (Kinderbetreuungsgeld-Konto) pays a fixed total that you spread over ${h.num(K.konto_tage_ein_elternteil_min)} to ${h.num(K.konto_tage_ein_elternteil_max)} days. The earnings-related version is, in the words of the ${h.src('kbgEa', 'Federal Chancellery')}, an income replacement for parents who take only a short break and earned well before.</p>
${h.table(['', 'earnings-related', 'account (shortest option)'], [
  ['Daily rate', `${h.pct(K.ea_quote)} of recent earnings, ${h.eur(K.konto_tag_max, 2)} to ${h.eur(K.ea_tag_max, 2)}`, h.eur(K.konto_tag_max, 2)],
  ['Duration, one parent', `until day ${h.num(K.ea_tage_ein)}`, `${h.num(K.konto_tage_ein_elternteil_min)} to ${h.num(K.konto_tage_ein_elternteil_max)} days`],
  ['Duration, both parents', `until day ${h.num(K.ea_tage_beide)}, ${h.num(K.ea_partner_tage)} partner days`, `${h.num(K.konto_tage_beide_min)} to ${h.num(K.konto_tage_beide_max)} days`],
  ['Prior work needed', `${h.num(K.ea_erwerb_tage)} days, fully insured`, 'no'],
  ['Side earnings per year', h.eur(K.zuverdienst_ea), `${h.eur(K.zuverdienst_konto)} or ${h.pct(K.zuverdienst_individuell_quote)} of earlier income`],
  ['Multiple-birth supplement, low-income top-up', 'no', 'yes'],
], `Comparison based on the ${h.src('kbgBroschuere', 'childcare allowance brochure 2026')}`, ['l', 'l', 'l'])}
<h2>How the daily rate is set</h2>
<p>For mothers who received maternity pay, the rule is simple: the allowance is ${h.pct(K.ea_quote)} of ${h.a('wochengeld', 'Wochengeld')}. Maternity pay is your average net pay per day over the three calendar months before maternity protection began, plus a surcharge for special payments. The ${h.src('oegkWochengeld', 'ÖGK')} sets that surcharge at ${h.pct(SZ.ein_monatsbezug)} for one, ${h.pct(SZ.zwei_monatsbezuege)} for two and ${h.pct(SZ.mehr)} for more special payments a year. For fathers and adoptive or foster parents a notional figure is calculated from the eight weeks before the birth.</p>
<p>The insurer then runs a favourability check using your income tax assessment for the year before the birth: (income × ${h.num(K.ea_steuerbescheid_quote, 2)} + ${h.eur(K.ea_steuerbescheid_sockel)}) ÷ 365. If the result is higher it applies; it can never lower your rate. With ${h.eur(EINK)} of income the formula gives ${h.eur(ausBescheid(EINK), 2)} a day, and it reaches the ceiling at about ${h.eur(bescheidMax)}. Employees often have an assessment only if they filed an ${h.a('arbeitnehmerveranlagung', 'employee tax return')}, so filing for that year can pay off.</p>
<h2>What each net salary produces</h2>
${h.table(['Net per month', 'maternity pay per day (estimate)', 'allowance per day', 'over 365 days', 'more than account'], BSP.map((x) => [h.eur(x.n), h.eur(x.e.wochengeldTag, 2), h.eur(x.e.tagsatz, 2), h.eur(x.summe), h.eur(x.plus)]), `One parent, ${h.pct(SZ.zwei_monatsbezuege)} special-payment surcharge; account: ${h.eur(konto1.gesamt)} in the shortest option`, ['r', 'r', 'r', 'r', 'r'])}
<p>On this calculation the break-even is about ${h.eur(ab)} net a month. Below it the earnings-related scheme never pays more than the account, it only has stricter rules. From roughly ${h.eur(max)} net the ${h.eur(K.ea_tag_max, 2)} ceiling applies, about ${h.eur(r2(K.ea_tag_max * 30))} per 30 days, and a higher salary adds nothing. If both parents earn ${h.eur(n2500.n)} net and share the ${h.num(K.ea_tage_beide)} days, the family receives ${h.eur(beide2500)} against ${h.eur(konto2.gesamt)} from the account.</p>
<!--mini:kbgKonto-->
<h2>The ${h.num(K.ea_erwerb_tage)} days before the birth</h2>
<p>The work must be subject to Austrian health and pension insurance, actually performed and continuous. Breaks totalling up to ${h.num(K.ea_unterbrechung_tage)} days do not matter, and sick leave or holiday with continued pay are not breaks at all. Maternity protection and parental leave up to a child’s second birthday count as work if they follow directly and your contract continues. Drawing unemployment benefit or emergency assistance during those days rules the scheme out. Expats who moved to Austria shortly before the birth should check this first: without the days, only the ${h.eur(K.konto_tag_max, 2)} special payment is available.</p>
<h2>When the account suits better despite a good salary</h2>
<p>The daily comparison is only half the picture. The earnings-related scheme ends at the child’s first birthday if one parent claims. If you want ${h.num(K.konto_tage_ein_elternteil_max)} days at home, the account pays ${h.eur(kontoLang.tagsatz, 2)} a day and ${h.eur(kontoLang.gesamt)} in total, while the earnings-related scheme pays nothing after day ${h.num(K.ea_tage_ein)}. Returning to work early matters too: part-time work in the first year quickly hits the ${h.eur(K.zuverdienst_ea)} limit, whereas the account allows ${h.eur(K.zuverdienst_konto)} or more. Only the account pays the ${h.pct(K.mehrling_zuschlag)} supplement per additional child for twins.</p>
<h2>What you may earn alongside</h2>
<p>Because the allowance replaces income, only ${h.eur(K.zuverdienst_ea)} of side earnings per calendar year are allowed, enough for a marginal mini-job. No unemployment insurance benefits may be drawn during the whole period. What counts as earnings and what is clawed back above the limit is explained on ${h.a('kbg-zuverdienst', 'childcare allowance and side earnings')}. Parents who split the allowance roughly equally also receive a one-off ${h.eur(K.partnerschaftsbonus_je)} partnership bonus each.</p>
`,
  },
});
