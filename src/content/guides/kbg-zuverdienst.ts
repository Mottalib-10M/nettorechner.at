import { defineGuide } from '../../lib/guide-types';
import { svLaufend } from '../../lib/engine/lohn';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

/** Zuverdienst beim Kinderbetreuungsgeld 2026: Rechenmethode der BKA-Broschüre, Werte aus params. */
const K = P.kbg;
const WK = P.tarif.werbungskostenpauschale;
const AUF = 1 + K.zuverdienst_aufschlag;
/** Laufender Zuverdienst aus der monatlichen Lohnsteuerbemessungsgrundlage (ohne Sonderzahlungen): × 12 − Werbungskosten, × 1,3. */
const zuverdienst = (bmgMonat: number) => r2((bmgMonat * 12 - WK) * AUF);
/** Individuelle Grenze (Konto): Einkünfte des relevanten Jahres × 1,3 × 60 %, mindestens 18.000 €. */
const individuell = (eink: number) => Math.max(K.zuverdienst_konto, r2(eink * AUF * K.zuverdienst_individuell_quote));
const abIndividuell = Math.ceil(K.zuverdienst_konto / (AUF * K.zuverdienst_individuell_quote));
const EINK = [20000, 25380, 35000, 50000];
/** Höchste monatliche Bemessungsgrundlage beim einkommensabhängigen KBG nach derselben Methode. */
const bmgEa = Math.floor(((K.zuverdienst_ea / AUF + WK) / 12) * 100) / 100;
/** Bruttogehalt, das eine Bemessungsgrundlage von 1.164 € ergibt (Brutto − Sozialversicherung, Motor). */
const bruttoFuer = (bmg: number) => { let b = bmg; while (b - svLaufend(b).summe < bmg) b += 0.5; return b; };
const bruttoKonto = bruttoFuer(K.zuverdienst_lst_bmg_monat);
/** Einschleifregelung: Teilzeit mit 1.300 € Bemessungsgrundlage beim Konto. */
const TZ = 1300;
const tz = zuverdienst(TZ), rueck = r2(Math.max(0, tz - K.zuverdienst_konto));
const pbMin = K.partnerschaftsbonus_min_tage;
/** Jahr des Wiedereinstiegs: KBG bis 15. Oktober, Jänner bis Juni ohne Lohn, Juli bis September Teilzeit mit 900 € Bemessungsgrundlage. */
const ANSPRUCH = [0, 0, 0, 0, 0, 0, 900, 900, 900];
const wieder = r2((ANSPRUCH.reduce((s, x) => s + x, 0) / ANSPRUCH.length * 12 - WK) * AUF);
const ohneSchnitt = zuverdienst(900);
const pbQ = Math.round(K.partnerschaftsbonus_teilung_max * 100);
const QUOTE_DE = `50 : 50 und ${pbQ} : ${100 - pbQ}`, QUOTE_EN = `50:50 to ${pbQ}:${100 - pbQ}`;

export default defineGuide({
  id: 'kbg-zuverdienst',
  group: 'leistungen',
  order: 50,
  mini: 'kbgZuverdienst',
  miniHref: 'kinderbetreuungsgeld',
  related: ['kinderbetreuungsgeld', 'kbg-einkommensabhaengig', 'teilzeit', 'geringfuegig', 'wochengeld'],
  sources: ['kbgBroschuere', 'kbgKonto', 'kbgEa'],
  de: {
    slug: 'kinderbetreuungsgeld-zuverdienst',
    nav: 'Zuverdienst beim KBG',
    card: `${DE.eur(K.zuverdienst_konto)} oder ${DE.pct(K.zuverdienst_individuell_quote)} der Letzteinkünfte beim Konto, ${DE.eur(K.zuverdienst_ea)} beim einkommensabhängigen KBG: so rechnet die Krankenkasse.`,
    title: 'Kinderbetreuungsgeld Zuverdienst 2026: Grenze und Rechnung',
    description: `Kinderbetreuungsgeld Zuverdienst 2026: ${DE.eur(K.zuverdienst_konto)} oder ${DE.pct(K.zuverdienst_individuell_quote)} der Letzteinkünfte beim Konto, ${DE.eur(K.zuverdienst_ea)} einkommensabhängig. Was zählt, was zurückgezahlt wird.`,
    h1: 'Dazuverdienen beim Kinderbetreuungsgeld',
    intro: 'Wie viel Sie neben dem Kinderbetreuungsgeld verdienen dürfen, wie die Krankenkasse den Zuverdienst rechnet und was eine Überschreitung kostet.',
    resume: `Neben dem Kinderbetreuungsgeld-Konto dürfen Sie 2026 bis zu ${DE.eur(K.zuverdienst_konto)} im Kalenderjahr dazuverdienen, oder mehr, wenn Ihre individuelle Grenze höher ist: ${DE.pct(K.zuverdienst_individuell_quote)} der Einkünfte aus dem letzten Kalenderjahr vor der Geburt ohne Kinderbetreuungsgeld, zuvor um ${DE.pct(K.zuverdienst_aufschlag)} erhöht. Beim einkommensabhängigen Kinderbetreuungsgeld liegt die Grenze bei ${DE.eur(K.zuverdienst_ea)}, und Arbeitslosengeld ist im ganzen Bezugszeitraum ausgeschlossen. Gezählt wird nur der beziehende Elternteil, jedes Kalenderjahr für sich und nur in Monaten, in denen an allen Tagen Kinderbetreuungsgeld bezogen wurde. Die Krankenkasse rechnet die Lohnsteuerbemessungsgrundlage ohne Sonderzahlungen auf zwölf Monate hoch, zieht mindestens ${DE.eur(WK)} Werbungskosten ab und schlägt ${DE.pct(K.zuverdienst_aufschlag)} auf. Beim Konto entspricht die Grenze so einer Bemessungsgrundlage von ${DE.eur(K.zuverdienst_lst_bmg_monat)} im Monat, rund ${DE.eur(bruttoKonto)} brutto. Urlaubs- und Weihnachtsgeld zählen nicht mit. Wer die Grenze überschreitet, zahlt genau den Überschreitungsbetrag zurück (Einschleifregelung): Bei ${DE.eur(TZ)} Bemessungsgrundlage im Monat sind das ${DE.eur(rueck, 2)}. Eine Rückforderung kann auch den Partnerschaftsbonus von ${DE.eur(K.partnerschaftsbonus_je)} je Elternteil kosten.`,
    faqs: [
      { q: 'Wie viel darf ich beim Kinderbetreuungsgeld-Konto im Monat dazuverdienen?', a: `Bei gleichbleibendem Gehalt über das ganze Jahr bis zu ${DE.eur(K.zuverdienst_lst_bmg_monat)} Lohnsteuerbemessungsgrundlage im Monat, das nennt die Broschüre des Bundeskanzleramts ausdrücklich. Bei einer Teilzeitstelle mit voller Sozialversicherung sind das nach unserem Motor rund ${DE.eur(bruttoKonto)} brutto. Die Bemessungsgrundlage steht auf Ihrem Lohnzettel. Mit einer höheren individuellen Grenze darf es entsprechend mehr sein.` },
      { q: 'Wie berechne ich meine individuelle Zuverdienstgrenze beim Kinderbetreuungsgeld?', a: `Nehmen Sie aus dem Steuerbescheid des relevanten Jahres die Einkünfte aus nichtselbständiger Arbeit nach Werbungskosten und ohne 13. und 14. Gehalt, multiplizieren Sie mit ${DE.num(AUF, 1)} und dann mit ${DE.num(K.zuverdienst_individuell_quote, 1)}. Bei ${DE.eur(25380)} Einkünften ergibt das ${DE.eur(individuell(25380), 2)}. Über ${DE.eur(K.zuverdienst_konto)} liegt die Grenze erst ab rund ${DE.eur(abIndividuell)} Einkünften. Sie gilt nur beim Konto.` },
      { q: 'Was passiert, wenn ich die Zuverdienstgrenze beim Kinderbetreuungsgeld überschreite?', a: `Sie zahlen den Betrag zurück, um den Sie die Grenze überschritten haben, nicht das ganze Kinderbetreuungsgeld. Liegt Ihr berechneter Zuverdienst etwa ${DE.eur(1000)} über ${DE.eur(K.zuverdienst_konto)}, fordert die Krankenkasse ${DE.eur(1000)} zurück. Geprüft wird im Nachhinein, sobald die Daten der Finanz vorliegen. Die Rückforderung kann sich auch gegen den anderen Elternteil oder den Partner richten.` },
      { q: 'Zählt das Weihnachtsgeld zum Zuverdienst beim Kinderbetreuungsgeld?', a: `Nein. Sonstige Bezüge nach § 67 EStG, also 13. und 14. Gehalt, bleiben außer Ansatz, ebenso Familienbeihilfe, Alimente, Wochengeld, Abfertigungen und Pflegegeld. Mitgezählt werden dagegen Arbeitslosengeld, Notstandshilfe und Pensionen, Einkünfte aus einem Minijob und ein Resturlaub, der nach dem Wochengeld noch ausbezahlt wird. Die pauschalen ${DE.pct(K.zuverdienst_aufschlag)} Aufschlag gleichen Sonderzahlungen und Sozialversicherung aus.` },
      { q: 'Darf ich beim einkommensabhängigen Kinderbetreuungsgeld geringfügig arbeiten?', a: `Ja. Die Grenze von ${DE.eur(K.zuverdienst_ea)} im Kalenderjahr lässt laut Bundeskanzleramt ein geringfügiges Dienstverhältnis zu. Nach derselben Rechenmethode wie beim Konto entspricht sie einer Bemessungsgrundlage von rund ${DE.eur(bmgEa, 2)} im Monat, die Geringfügigkeitsgrenze liegt bei ${DE.eur(P.sv.geringfuegigkeit, 2)}. Arbeitslosengeld oder Notstandshilfe dürfen Sie in dieser Zeit aber nicht beziehen.` },
      { q: 'Verliere ich den Partnerschaftsbonus, wenn ich zu viel zum Kinderbetreuungsgeld dazuverdiene?', a: `Möglicherweise. Eine Rückforderung von Kinderbetreuungsgeld löst die Rückforderung beider Partnerschaftsboni aus, wenn dadurch einer der Eltern unter ${pbMin} Bezugstage fällt oder die Aufteilung nicht mehr zwischen ${QUOTE_DE} liegt. Der Bonus beträgt ${DE.eur(K.partnerschaftsbonus_je)} je Elternteil und wird nach dem Ende der Anspruchsdauer auf Antrag ausbezahlt, spätestens ${K.partnerschaftsbonus_antrag_tage} Tage danach.` },
    ],
    body: (h) => `
<h2>Die Grenzen 2026 im Überblick</h2>
${h.table(['', 'Kinderbetreuungsgeld-Konto', 'einkommensabhängig'], [
  ['Grenze im Kalenderjahr', `${h.eur(K.zuverdienst_konto)} oder individuell ${h.pct(K.zuverdienst_individuell_quote)} der Letzteinkünfte`, h.eur(K.zuverdienst_ea)],
  ['monatliche Bemessungsgrundlage bei gleichem Gehalt', h.eur(K.zuverdienst_lst_bmg_monat), `rund ${h.eur(bmgEa, 2)}`],
  ['Arbeitslosengeld daneben', `zählt als Zuverdienst (× ${h.num(1 + K.zuverdienst_aufschlag_alv, 2)})`, 'nicht erlaubt'],
  ['Folge einer Überschreitung', 'Rückzahlung des Überschreitungsbetrags', 'Rückzahlung des Überschreitungsbetrags'],
], `Nach der ${h.src('kbgBroschuere', 'Broschüre Kinderbetreuungsgeld 2026')} und der Seite zum ${h.src('kbgEa', 'einkommensabhängigen KBG')}`, ['l', 'l', 'l'])}
<p>Beide Grenzen gelten für den Elternteil, der gerade Kinderbetreuungsgeld bezieht. Was der andere verdient, spielt keine Rolle. Wechseln sich die Eltern ab, hat jeder seine eigene Grenze aus seinen eigenen Einkünften.</p>
<h2>Die individuelle Grenze beim Konto</h2>
<p>Wer vor der Geburt gut verdient hat, kann beim ${h.src('kbgKonto', 'Kinderbetreuungsgeld-Konto')} mehr als ${h.eur(K.zuverdienst_konto)} dazuverdienen. Grundlage ist der Steuerbescheid des letzten Kalenderjahres vor der Geburt, in dem Sie kein Kinderbetreuungsgeld bezogen haben, höchstens bis zum drittvorangegangenen Jahr. Einkünfte aus nichtselbständiger Arbeit nach Werbungskosten werden mal ${h.num(AUF, 1)} genommen, Arbeitslosengeld mal ${h.num(1 + K.zuverdienst_aufschlag_alv, 2)}; davon ${h.pct(K.zuverdienst_individuell_quote)}. Ohne Steuerbescheid gilt ${h.eur(K.zuverdienst_konto)}.</p>
${h.table(['Einkünfte im relevanten Jahr', 'individuelle Grenze'], EINK.map((e) => [h.eur(e), h.eur(individuell(e), 2)]), `Einkünfte nach Werbungskosten, ohne 13. und 14. Gehalt; unter ${h.eur(abIndividuell)} gilt der Mindestwert`, ['r', 'r'])}
<p>Die so festgestellte Grenze bleibt für den ganzen Bezug gleich. Ändert sich der Steuerbescheid, ist auf Antrag eine Neuberechnung möglich. Die Krankenkasse nennt die Grenze in der Mitteilung über den Leistungsanspruch, wenn der Bescheid schon vorliegt; oft gibt es ihn nur nach einer ${h.a('arbeitnehmerveranlagung', 'Arbeitnehmerveranlagung')}.</p>
<h2>Wie der tatsächliche Zuverdienst gerechnet wird</h2>
<ol>
<li><strong>Anspruchsmonate zählen.</strong> Nur Kalendermonate, in denen an allen Tagen Kinderbetreuungsgeld bezogen wurde. Endet der Bezug am 15., zählt dieser Monat nicht.</li>
<li><strong>Bemessungsgrundlagen addieren.</strong> Für jeden Anspruchsmonat die Lohnsteuerbemessungsgrundlage ohne Sonderzahlungen, also Brutto minus Sozialversicherung.</li>
<li><strong>Hochrechnen.</strong> Summe durch die Zahl der Anspruchsmonate, mal zwölf, minus Werbungskosten (mindestens ${h.eur(WK)}), mal ${h.num(AUF, 1)}.</li>
</ol>
<p>Liegt das Ergebnis unter der Grenze, ist alles in Ordnung. Für Selbständige wird der Jahresgewinn um ${h.pct(K.zuverdienst_aufschlag)} erhöht; nur mit einer Zwischenbilanz für den Bezugszeitraum, vorgelegt bis Ende des zweiten Folgejahres, zählt allein der Gewinn dieser Monate.</p>
<!--mini:kbgKonto-->
<h2>Die Einschleifregelung an einem Beispiel</h2>
<p>Eine Mutter geht nach dem Wochengeld in Elternteilzeit und hat das ganze Jahr ${h.eur(TZ)} Bemessungsgrundlage im Monat, ohne individuelle Grenze. Hochgerechnet ergibt das (${h.eur(TZ)} × 12 − ${h.eur(WK)}) × ${h.num(AUF, 1)} = ${h.eur(tz, 2)}. Das sind ${h.eur(rueck, 2)} über ${h.eur(K.zuverdienst_konto)}, und genau diesen Betrag fordert die Krankenkasse zurück. Wer die Grenze im Voraus kommen sieht, kann für ganze Kalendermonate auf das Kinderbetreuungsgeld verzichten. In diesen Monaten bekommt auch der andere Elternteil nichts, und bei gleichbleibendem Monatsgehalt hilft ein Verzicht wenig, weil der Durchschnitt gleich bleibt.</p>
<h2>Das Jahr des Wiedereinstiegs</h2>
<p>Weil nur Anspruchsmonate zählen, ist das Jahr, in dem der Bezug endet, oft entspannter als gedacht. Beispiel: Kinderbetreuungsgeld bis 15. Oktober, ab Juli Teilzeit mit ${h.eur(900)} Bemessungsgrundlage im Monat. Anspruchsmonate sind Jänner bis September, denn im Oktober wurde nicht an allen Tagen bezogen. In diesen ${h.num(ANSPRUCH.length)} Monaten liegen sechs ohne Lohn und drei mit ${h.eur(900)}. Hochgerechnet ergibt das ${h.eur(wieder, 2)}, weit unter ${h.eur(K.zuverdienst_konto)}. Das volle Gehalt ab Oktober zählt gar nicht. Hätte die Mutter das ganze Jahr ${h.eur(900)} verdient, wären es ${h.eur(ohneSchnitt, 2)}. Wichtig ist der Durchschnitt über die Anspruchsmonate des Kalenderjahres, nicht der einzelne Monat; das nächste Kalenderjahr beginnt die Rechnung von vorn.</p>
<h2>Was zählt und was nicht</h2>
<ul>
<li><strong>Zählt:</strong> Lohn aus Dienstverhältnis und Minijob, Gewinn aus selbständiger Arbeit, Gewerbe und Landwirtschaft, ausländische Einkünfte, Pensionen, Arbeitslosengeld, Notstandshilfe, Resturlaub, der nach dem Wochengeld ausbezahlt wird.</li>
<li><strong>Zählt nicht:</strong> 13. und 14. Gehalt und andere sonstige Bezüge nach § 67 EStG, Familienbeihilfe, Alimente, Kinderbetreuungsgeld, Wochengeld, Abfertigungen, Pflegegeld, Studienbeihilfe, steuerfreie Einkünfte.</li>
</ul>
<p>Die Grenze von ${h.eur(K.zuverdienst_ea)} beim ${h.a('kbg-einkommensabhaengig', 'einkommensabhängigen Kinderbetreuungsgeld')} lässt einen ${h.a('geringfuegig', 'geringfügigen Job')} zu, eine echte Teilzeit meist nicht. Beim Konto ist eine ${h.a('teilzeit', 'Teilzeitstelle')} bis rund ${h.eur(bruttoKonto)} brutto möglich.</p>
<h2>Partnerschaftsbonus und Rückforderung</h2>
<p>Teilen sich die Eltern das Kinderbetreuungsgeld zwischen ${QUOTE_DE} und bezieht jeder mindestens ${h.num(pbMin)} Tage, bekommt jeder einmalig ${h.eur(K.partnerschaftsbonus_je)}. Der Antrag ist spätestens ${h.num(K.partnerschaftsbonus_antrag_tage)} Tage nach dem Ende der höchstmöglichen Anspruchsdauer zu stellen. Wird Kinderbetreuungsgeld wegen eines zu hohen Zuverdienstes zurückgefordert und fällt dadurch ein Elternteil unter ${h.num(pbMin)} Tage oder aus der Quote, sind beide Boni zurückzuzahlen.</p>
`,
  },
  en: {
    slug: 'childcare-allowance-earnings-limit',
    nav: 'Childcare allowance earnings limit',
    card: `${EN.eur(K.zuverdienst_konto)} or ${EN.pct(K.zuverdienst_individuell_quote)} of earlier income on the account, ${EN.eur(K.zuverdienst_ea)} on the earnings-related scheme: how the insurer counts it.`,
    title: 'Childcare Allowance Earnings Limit Austria 2026: Side Income',
    description: `Childcare allowance earnings limit Austria 2026: ${EN.eur(K.zuverdienst_konto)} or ${EN.pct(K.zuverdienst_individuell_quote)} of earlier income on the account, ${EN.eur(K.zuverdienst_ea)} if earnings-related. What counts, what is clawed back.`,
    h1: 'Working while on childcare allowance',
    intro: 'How much you may earn alongside Austrian childcare allowance (Kinderbetreuungsgeld), how the health insurer calculates it and what going over costs.',
    resume: `Alongside the flat-rate childcare allowance account (Kinderbetreuungsgeld-Konto) you may earn up to ${EN.eur(K.zuverdienst_konto)} per calendar year in 2026, or more if your individual limit is higher: ${EN.pct(K.zuverdienst_individuell_quote)} of your income in the last calendar year before the birth without childcare allowance, first increased by ${EN.pct(K.zuverdienst_aufschlag)}. On the earnings-related scheme the limit is ${EN.eur(K.zuverdienst_ea)}, and unemployment benefit is not allowed at all during the claim. Only the parent currently claiming is assessed, each calendar year separately, and only months in which allowance was paid on every day. The health insurer annualises your taxable pay excluding special payments (Lohnsteuerbemessungsgrundlage, gross minus social insurance), deducts at least ${EN.eur(WK)} of work expenses and adds ${EN.pct(K.zuverdienst_aufschlag)}. On the account that limit equals ${EN.eur(K.zuverdienst_lst_bmg_monat)} of taxable pay a month, about ${EN.eur(bruttoKonto)} gross. Holiday and Christmas bonuses are not counted. Going over means repaying exactly the excess (Einschleifregelung, a gradual clawback): with ${EN.eur(TZ)} of monthly taxable pay that is ${EN.eur(rueck, 2)}. A clawback can also cost both parents their ${EN.eur(K.partnerschaftsbonus_je)} partnership bonus.`,
    faqs: [
      { q: 'How much can I earn per month on the childcare allowance account?', a: `With the same pay every month all year, up to ${EN.eur(K.zuverdienst_lst_bmg_monat)} of taxable pay (Lohnsteuerbemessungsgrundlage) a month, a figure the Federal Chancellery brochure states explicitly. For a part-time job with full social insurance, our engine puts that at about ${EN.eur(bruttoKonto)} gross. The taxable amount is shown on your payslip. With a higher individual limit you may earn correspondingly more.` },
      { q: 'How do I work out my individual earnings limit for childcare allowance?', a: `Take employment income after work expenses from the tax assessment for the relevant year, excluding the 13th and 14th salary, multiply by ${EN.num(AUF, 1)} and then by ${EN.num(K.zuverdienst_individuell_quote, 1)}. With ${EN.eur(25380)} of income that gives ${EN.eur(individuell(25380), 2)}. The limit only rises above ${EN.eur(K.zuverdienst_konto)} from about ${EN.eur(abIndividuell)} of income. It applies to the account scheme only.` },
      { q: 'What happens if I go over the childcare allowance earnings limit?', a: `You repay the amount by which you exceeded the limit, not the whole allowance. If your calculated earnings come to ${EN.eur(1000)} above ${EN.eur(K.zuverdienst_konto)}, the insurer reclaims ${EN.eur(1000)}. The check happens afterwards, once the tax authority’s data is available. The claim can also be directed at the other parent or your partner.` },
      { q: 'Does my Christmas bonus count towards the childcare allowance limit?', a: `No. Special payments taxed under section 67 of the Income Tax Act, such as the 13th and 14th salary, are left out, as are family allowance, maintenance, maternity pay, severance pay and care allowance. Unemployment benefit, emergency assistance, pensions, mini-job pay and leftover holiday paid out after maternity pay do count. The flat ${EN.pct(K.zuverdienst_aufschlag)} uplift is meant to cover special payments and social insurance.` },
      { q: 'Can I keep a mini-job on the earnings-related childcare allowance?', a: `Yes. The Federal Chancellery says the ${EN.eur(K.zuverdienst_ea)} annual limit allows a marginal job (geringfügige Beschäftigung). Using the same method as for the account, it corresponds to about ${EN.eur(bmgEa, 2)} of taxable pay a month, while the marginal limit is ${EN.eur(P.sv.geringfuegigkeit, 2)}. You may not draw unemployment benefit or emergency assistance at the same time.` },
      { q: 'Can earning too much on childcare allowance cost us the partnership bonus?', a: `It can. A clawback of childcare allowance triggers repayment of both partnership bonuses if, as a result, one parent drops below ${pbMin} days of entitlement or the split falls outside ${QUOTE_EN}. The bonus is ${EN.eur(K.partnerschaftsbonus_je)} per parent, paid on application after the maximum entitlement period ends, at the latest ${K.partnerschaftsbonus_antrag_tage} days afterwards.` },
    ],
    body: (h) => `
<h2>The 2026 limits at a glance</h2>
${h.table(['', 'allowance account', 'earnings-related'], [
  ['Limit per calendar year', `${h.eur(K.zuverdienst_konto)} or individually ${h.pct(K.zuverdienst_individuell_quote)} of earlier income`, h.eur(K.zuverdienst_ea)],
  ['monthly taxable pay at a steady salary', h.eur(K.zuverdienst_lst_bmg_monat), `about ${h.eur(bmgEa, 2)}`],
  ['unemployment benefit alongside', `counts as earnings (× ${h.num(1 + K.zuverdienst_aufschlag_alv, 2)})`, 'not allowed'],
  ['if exceeded', 'repay the excess', 'repay the excess'],
], `Based on the ${h.src('kbgBroschuere', 'childcare allowance brochure 2026')} and the ${h.src('kbgEa', 'earnings-related allowance page')}`, ['l', 'l', 'l'])}
<p>Both limits apply only to the parent currently receiving the allowance; what the other parent earns is irrelevant. If you take turns, each parent has a limit based on their own income. A partner’s full-time salary therefore never reduces the allowance of the parent at home.</p>
<h2>The individual limit on the account</h2>
<p>If you earned well before the birth, the ${h.src('kbgKonto', 'allowance account')} lets you earn more than ${h.eur(K.zuverdienst_konto)}. The basis is the tax assessment for the last calendar year before the birth in which you received no childcare allowance, going back at most to the third year before. Employment income after work expenses is multiplied by ${h.num(AUF, 1)}, unemployment benefit by ${h.num(1 + K.zuverdienst_aufschlag_alv, 2)}, and ${h.pct(K.zuverdienst_individuell_quote)} of the total is your limit. Without an assessment the limit is ${h.eur(K.zuverdienst_konto)}, so newcomers without an Austrian assessment start from that figure.</p>
${h.table(['Income in the relevant year', 'individual limit'], EINK.map((e) => [h.eur(e), h.eur(individuell(e), 2)]), `Income after work expenses, excluding 13th and 14th salary; below ${h.eur(abIndividuell)} the minimum applies`, ['r', 'r'])}
<p>Once set, the limit stays the same for the whole claim; if the tax assessment changes, you can ask for a recalculation. The insurer states it in the notice confirming your entitlement when the assessment already exists, which for employees often requires an ${h.a('arbeitnehmerveranlagung', 'employee tax return')}.</p>
<h2>How actual earnings are calculated</h2>
<ol>
<li><strong>Count the qualifying months.</strong> Only calendar months in which allowance was paid on every single day. If your claim ends on the 15th, that month is ignored.</li>
<li><strong>Add up taxable pay.</strong> For each qualifying month, taxable pay excluding special payments: gross minus employee social insurance.</li>
<li><strong>Annualise.</strong> Divide by the number of qualifying months, multiply by twelve, subtract work expenses (at least ${h.eur(WK)}), multiply by ${h.num(AUF, 1)}.</li>
</ol>
<p>If the result is below your limit, you are fine. For self-employed income the annual profit is increased by ${h.pct(K.zuverdienst_aufschlag)}; only with interim accounts for the claim period, filed by the end of the second following year, does the profit of those months alone count.</p>
<!--mini:kbgKonto-->
<h2>The gradual clawback in practice</h2>
<p>A mother returns to part-time work (Elternteilzeit) after maternity leave and has ${h.eur(TZ)} of taxable pay every month of the year, with no individual limit. Annualised: (${h.eur(TZ)} × 12 − ${h.eur(WK)}) × ${h.num(AUF, 1)} = ${h.eur(tz, 2)}. That is ${h.eur(rueck, 2)} above ${h.eur(K.zuverdienst_konto)}, and exactly this amount is reclaimed. If you can see the limit coming, you may waive the allowance in advance for whole calendar months. The other parent then cannot claim for those months either, and with a steady monthly salary a waiver hardly helps because the average stays the same.</p>
<h2>The year you go back to work</h2>
<p>Because only qualifying months count, the year your claim ends is often easier than expected. Example: allowance until 15 October, part-time work from July with ${h.eur(900)} of taxable pay a month. Qualifying months are January to September, since October was not covered on every day. Of those ${h.num(ANSPRUCH.length)} months, six had no pay and three had ${h.eur(900)}. Annualised that is ${h.eur(wieder, 2)}, far below ${h.eur(K.zuverdienst_konto)}, and the full salary from October is ignored. Had the same pay run all year, the figure would be ${h.eur(ohneSchnitt, 2)}. What matters is the average over the qualifying months of the calendar year; the next year starts afresh.</p>
<h2>What counts and what does not</h2>
<ul>
<li><strong>Counts:</strong> pay from employment and mini-jobs, profit from self-employment, business or farming, foreign income, pensions, unemployment benefit, emergency assistance, leftover holiday paid after maternity pay.</li>
<li><strong>Does not count:</strong> 13th and 14th salary and other special payments under section 67, family allowance, maintenance, childcare allowance, maternity pay, severance pay, care allowance, student grants, tax-free income.</li>
</ul>
<p>The ${h.eur(K.zuverdienst_ea)} limit on the ${h.a('kbg-einkommensabhaengig', 'earnings-related allowance')} leaves room for a ${h.a('geringfuegig', 'marginal job')} but rarely for real part-time work. On the account, a ${h.a('teilzeit', 'part-time job')} up to about ${h.eur(bruttoKonto)} gross fits.</p>
<h2>Partnership bonus and clawbacks</h2>
<p>If parents split the allowance between ${QUOTE_EN.replace(' to ', ' and ')} and each claims at least ${h.num(pbMin)} days, each receives a one-off ${h.eur(K.partnerschaftsbonus_je)}. Apply no later than ${h.num(K.partnerschaftsbonus_antrag_tage)} days after the maximum entitlement period ends. If allowance is reclaimed because of excess earnings and one parent drops below ${h.num(pbMin)} days or out of the ratio, both bonuses must be repaid.</p>
`,
  },
});
