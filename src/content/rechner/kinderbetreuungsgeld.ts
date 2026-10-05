import { defineGuide } from '../../lib/guide-types';
import { kbgKonto, kbgEinkommensabhaengig } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

const K = P.kbg;
const SZ = K.wochengeld_sz_zuschlag.zwei_monatsbezuege;
/** Konto-Varianten für einen Elternteil und für beide, aus dem Motor. */
const kurz1 = kbgKonto(K.konto_tage_ein_elternteil_min), lang1 = kbgKonto(K.konto_tage_ein_elternteil_max);
const kurz2 = kbgKonto(K.konto_tage_beide_min, true), lang2 = kbgKonto(K.konto_tage_beide_max, true);
const KONTO_TAGE = [365, 456, 548, 730, 851];
const konto = KONTO_TAGE.map((t) => kbgKonto(t));
/** Einkommensabhängig: Beispiel 2.000 € netto, Tabelle 1.500 bis 3.000 €. */
const e2 = kbgEinkommensabhaengig(2000);
const e2Summe = e2.tagsatz * K.ea_tage_ein;
const NETTO = [1500, 2000, 2500, 3000];
const ea = NETTO.map((n) => { const r = kbgEinkommensabhaengig(n); return { n, r, summe: r.tagsatz * K.ea_tage_ein }; });
/** Netto im Monat, ab dem der Höchstbetrag erreicht wird (Umkehrung der Wochengeld-Schätzung). */
const nettoDeckel = K.ea_tag_max / K.ea_quote * 365 / 12 / (1 + SZ);
const nettoBoden = K.konto_tag_max / K.ea_quote * 365 / 12 / (1 + SZ);

export default defineGuide({
  id: 'kinderbetreuungsgeld',
  group: 'rechner',
  order: 70,
  tool: 'kbg',
  related: ['kbg-einkommensabhaengig', 'kbg-zuverdienst', 'wochengeld', 'familienbonus', 'kindermehrbetrag'],
  sources: ['kbgKonto', 'kbgEa', 'kbgBroschuere'],
  de: {
    slug: 'kinderbetreuungsgeld-rechner',
    nav: 'Kinderbetreuungsgeld-Rechner',
    card: 'KBG-Konto oder einkommensabhängig: Tagsatz, Monatsbetrag und Gesamtsumme 2026 im Vergleich.',
    title: 'Kinderbetreuungsgeld 2026: Konto oder einkommensabhängig',
    description: `Kinderbetreuungsgeld-Rechner 2026: KBG-Konto von ${DE.eur(K.konto_tag_max, 2)} bis ${DE.eur(K.konto_tag_min, 2)} am Tag gegen ${DE.pct(K.ea_quote)} Einkommensersatz bis ${DE.eur(K.ea_tag_max, 2)}, mit Gesamtsumme und Monatsbetrag.`,
    h1: 'Kinderbetreuungsgeld 2026: welches System mehr bringt',
    intro: 'Der direkte Vergleich der beiden Systeme in Euro pro Tag, pro Monat und über die ganze Bezugszeit, bevor Sie sich beim Antrag festlegen.',
    resume: `Beim Kinderbetreuungsgeld-Konto bekommt ein Elternteil 2026 zwischen ${DE.eur(K.konto_tag_max, 2)} am Tag bei ${K.konto_tage_ein_elternteil_min} Tagen und ${DE.eur(K.konto_tag_min, 2)} bei ${K.konto_tage_ein_elternteil_max} Tagen, insgesamt aber immer rund ${DE.eur(kurz1.gesamt)}: Wer länger bezieht, verteilt denselben Betrag nur dünner. Teilen sich beide Eltern das Konto, wächst die Summe auf rund ${DE.eur(kurz2.gesamt)}, weil ${K.konto_tage_beide_min} bis ${K.konto_tage_beide_max} Tage möglich sind. Das einkommensabhängige Kinderbetreuungsgeld ersetzt dagegen ${DE.pct(K.ea_quote)} des Wochengeldes bzw. der Letzteinkünfte, mindestens ${DE.eur(K.konto_tag_max, 2)} und höchstens ${DE.eur(K.ea_tag_max, 2)} am Tag, bis zum ${K.ea_tage_ein}. Lebenstag des Kindes. Bei ${DE.eur(2000)} netto im Monat sind das geschätzt ${DE.eur(e2.tagsatz, 2)} am Tag und ${DE.eur(e2Summe)} im Jahr, also ${DE.eur(e2Summe - kurz1.gesamt)} mehr als das kürzeste Konto. Voraussetzung sind ${K.ea_erwerb_tage} Tage versicherte Erwerbstätigkeit vor der Geburt. Die Wahl bindet beide Eltern und lässt sich nur binnen ${K.systemwechsel_frist_tage} Tagen ab dem ersten Antrag ändern.`,
    faqs: [
      { q: 'Lohnt sich beim Kinderbetreuungsgeld das längste Konto?', a: `Nur wenn Sie länger zu Hause bleiben wollen, nicht wegen des Geldes. Die Kontosumme ist fix: ${K.konto_tage_ein_elternteil_max} Tage zu ${DE.eur(lang1.tagsatz, 2)} ergeben rund ${DE.eur(lang1.gesamt)}, genauso viel wie ${K.konto_tage_ein_elternteil_min} Tage zu ${DE.eur(kurz1.tagsatz, 2)}. Der Monatsbetrag sinkt dabei von etwa ${DE.eur(kurz1.monat)} auf ${DE.eur(lang1.monat)}. Wer die Variante einmal ändern will, muss das spätestens ${K.variantenwechsel_vorlauf_tage} Tage vor dem ursprünglichen Ende beantragen.` },
      { q: 'Ab welchem Netto ist das einkommensabhängige Kinderbetreuungsgeld gedeckelt?', a: `Nach unserer Wochengeld-Schätzung mit ${DE.pct(SZ)} Sonderzahlungszuschlag ab rund ${DE.eur(nettoDeckel)} netto im Monat. Darüber bleibt es bei ${DE.eur(K.ea_tag_max, 2)} am Tag. Unter etwa ${DE.eur(nettoBoden)} netto greift der Mindestbetrag von ${DE.eur(K.konto_tag_max, 2)}. Maßgeblich ist das tatsächliche Wochengeld der Mutter; beim Vater ein fiktives Wochengeld aus den acht Wochen vor der Geburt, danach prüft die Krankenkasse noch den Steuerbescheid.` },
      { q: 'Kann ich beim Kinderbetreuungsgeld das System später noch wechseln?', a: `Nur innerhalb von ${K.systemwechsel_frist_tage} Tagen ab dem ersten Antrag, danach ausnahmslos nicht mehr. Die Wahl gilt auch für den zweiten Elternteil. Innerhalb des Kontos kann die Dauer pro Kind einmal geändert werden, wenn der Antrag spätestens ${K.variantenwechsel_vorlauf_tage} Tage vor Ablauf der ursprünglich gewählten Dauer einlangt. Rückwirkend ändern sich dann die Tagesbeträge, nicht die schon bezogenen Zeiträume.` },
      { q: 'Wie viel Kinderbetreuungsgeld bekommen beide Eltern zusammen?', a: `Beim Konto bis zu rund ${DE.eur(kurz2.gesamt)} statt ${DE.eur(kurz1.gesamt)}, verteilt auf ${K.konto_tage_beide_min} bis ${K.konto_tage_beide_max} Tage; etwa ${DE.pct(K.partner_anteil)} sind dem zweiten Elternteil vorbehalten. Beim einkommensabhängigen Modell verlängert sich der Bezug bis zum ${K.ea_tage_beide}. Tag, ${K.ea_partner_tage} Tage pro Elternteil sind unübertragbar. Teilen Sie annähernd gleich, gibt es zusätzlich je ${DE.eur(K.partnerschaftsbonus_je)} Partnerschaftsbonus.` },
    ],
    body: (h) => `
<h2>Was der Rechner vergleicht</h2>
<p>Links wählen Sie die Bezugsdauer für das Konto in Tagen ab der Geburt und ob beide Eltern beziehen; rechts geben Sie das Monatsnetto vor der Geburt ein. Der Rechner zeigt dann nebeneinander den Tagsatz des Kontos, die Gesamtsumme, das geschätzte Wochengeld, den einkommensabhängigen Tagsatz und den Unterschied über die ganze Bezugszeit. Die Gesamtsumme ist die Zahl, die zählt, denn beim Konto verschiebt eine längere Dauer nur das Geld auf mehr Monate.</p>
<h2>Das Konto: ein Betrag, verschieden lang verteilt</h2>
${h.table(['Dauer (ein Elternteil)', 'pro Tag', 'pro Monat (30 Tage)', 'gesamt'], konto.map((k) => [`${k.tage} Tage`, h.eur(k.tagsatz, 2), h.eur(k.monat), h.eur(k.gesamt)]), 'Kinderbetreuungsgeld-Konto 2026, ein Elternteil, aus unserem Motor', ['l', 'r', 'r', 'r'])}
<p>Die Grenzen ${h.eur(h.P.kbg.konto_tag_max, 2)} und ${h.eur(h.P.kbg.konto_tag_min, 2)} nennt das ${h.src('kbgKonto', 'Bundeskanzleramt')}. Teilen sich beide Eltern den Bezug, reicht das Konto ${h.P.kbg.konto_tage_beide_min} bis ${h.P.kbg.konto_tage_beide_max} Tage; in der kürzesten Variante sind ${kurz2.partnerTage} Tage dem zweiten Elternteil vorbehalten, bei ${h.P.kbg.konto_tage_beide_max} Tagen ${lang2.partnerTage}. Bei Mehrlingen erhöht sich der Tagsatz des Kontos für jedes weitere Kind um ${h.pct(h.P.kbg.mehrling_zuschlag)}; das einkommensabhängige Modell kennt diesen Zuschlag nicht.</p>
<h2>Einkommensabhängig: ${h.pct(h.P.kbg.ea_quote)}, gedeckelt</h2>
${h.table(['Netto im Monat', 'Tagsatz geschätzt', `gesamt (${h.P.kbg.ea_tage_ein} Tage)`, 'mehr als kürzestes Konto'], ea.map(({ n, r, summe }) => [h.eur(n), h.eur(r.tagsatz, 2), h.eur(summe), h.eur(summe - kurz1.gesamt)]), `Schätzung über das Wochengeld (Netto je Kalendertag plus ${h.pct(SZ)} Sonderzahlungszuschlag)`, ['r', 'r', 'r', 'r'])}
<p>Das einkommensabhängige Kinderbetreuungsgeld ist nach der ${h.src('kbgEa', 'Beschreibung des Bundeskanzleramts')} ein Einkommensersatz für Eltern, die nur kurz aussteigen. Es bringt fast immer mehr Geld, aber kürzer: Ein Elternteil kann es höchstens ${h.P.kbg.ea_tage_ein} Tage beziehen. Details zur Berechnung über Wochengeld und Steuerbescheid stehen auf der Seite zum ${h.a('kbg-einkommensabhaengig', 'einkommensabhängigen Kinderbetreuungsgeld')}, die Grundlage für Mütter auf der Seite zum ${h.a('wochengeld', 'Wochengeld')}.</p>
<h2>Was neben dem Geld entscheidet</h2>
<ul>
<li><strong>Erwerbstätigkeit vor der Geburt:</strong> Für das einkommensabhängige Modell müssen Sie in den ${h.P.kbg.ea_erwerb_tage} Kalendertagen davor durchgehend kranken- und pensionsversichert gearbeitet haben, ohne Arbeitslosengeld. Wer das nicht schafft, bekommt dort nur den Mindestbetrag.</li>
<li><strong>Zuverdienst:</strong> Beim Konto sind ${h.eur(h.P.kbg.zuverdienst_konto)} im Kalenderjahr erlaubt oder ${h.pct(h.P.kbg.zuverdienst_individuell_quote)} der früheren Einkünfte, wenn das mehr ist; beim einkommensabhängigen Modell nur ${h.eur(h.P.kbg.zuverdienst_ea)}. Mehr dazu unter ${h.a('kbg-zuverdienst', 'Zuverdienst beim KBG')}.</li>
<li><strong>Dauer zu Hause:</strong> Wer zwei Jahre beim Kind bleiben will, kommt mit dem einkommensabhängigen Modell nur das erste Jahr aus.</li>
<li><strong>Blöcke und Wechsel:</strong> Jeder Bezugsblock dauert mindestens ${h.P.kbg.block_min_tage} Tage; beim ersten Wechsel dürfen beide Eltern bis zu ${h.P.kbg.gleichzeitig_max_tage} Tage gleichzeitig beziehen, was die Gesamtdauer um diese Tage kürzt.</li>
</ul>
<p>Alle Werte stammen aus der ${h.src('kbgBroschuere', 'Broschüre Kinderbetreuungsgeld 2026')}. Unser Rechner schätzt das Wochengeld aus dem Netto; den verbindlichen Betrag berechnet Ihre Krankenkasse.</p>
`,
  },
  en: {
    slug: 'childcare-allowance-calculator',
    nav: 'Childcare allowance calculator',
    card: 'Flat-rate account or earnings-related: daily rate, monthly amount and total for 2026 compared.',
    title: 'Kinderbetreuungsgeld 2026: Flat Account or Earnings-Related',
    description: `Kinderbetreuungsgeld calculator 2026: flat-rate account from ${EN.eur(K.konto_tag_max, 2)} to ${EN.eur(K.konto_tag_min, 2)} a day or ${EN.pct(K.ea_quote)} of earnings up to ${EN.eur(K.ea_tag_max, 2)}, with totals and monthly amounts compared.`,
    h1: 'Austrian childcare allowance 2026: which scheme pays more',
    intro: 'Both schemes side by side in euros per day, per month and over the whole claim, before you commit to one on the application form.',
    resume: `Austrian childcare allowance (Kinderbetreuungsgeld, KBG) comes in two schemes. On the flat-rate account (KBG-Konto) one parent gets between ${EN.eur(K.konto_tag_max, 2)} a day over ${K.konto_tage_ein_elternteil_min} days and ${EN.eur(K.konto_tag_min, 2)} over ${K.konto_tage_ein_elternteil_max} days, but the total is always about ${EN.eur(kurz1.gesamt)}: a longer claim spreads the same money more thinly. When both parents share it, the total rises to about ${EN.eur(kurz2.gesamt)} over ${K.konto_tage_beide_min} to ${K.konto_tage_beide_max} days. The earnings-related scheme (einkommensabhängiges KBG) replaces ${EN.pct(K.ea_quote)} of maternity pay or previous earnings, at least ${EN.eur(K.konto_tag_max, 2)} and at most ${EN.eur(K.ea_tag_max, 2)} a day, until the child's ${K.ea_tage_ein}th day of life. On ${EN.eur(2000)} net a month that is an estimated ${EN.eur(e2.tagsatz, 2)} a day and ${EN.eur(e2Summe)} over the year, ${EN.eur(e2Summe - kurz1.gesamt)} more than the shortest account. It requires ${K.ea_erwerb_tage} days of insured work before the birth. The choice binds both parents and can only be changed within ${K.systemwechsel_frist_tage} days of the first application.`,
    faqs: [
      { q: 'Does the longest childcare allowance account pay more in total?', a: `No. The account total is fixed: ${K.konto_tage_ein_elternteil_max} days at ${EN.eur(lang1.tagsatz, 2)} add up to about ${EN.eur(lang1.gesamt)}, the same as ${K.konto_tage_ein_elternteil_min} days at ${EN.eur(kurz1.tagsatz, 2)}. Only the monthly amount changes, from roughly ${EN.eur(kurz1.monat)} to ${EN.eur(lang1.monat)}. Pick the length that matches how long you want to stay home. You may change the length once per child, applying at least ${K.variantenwechsel_vorlauf_tage} days before the originally chosen end.` },
      { q: 'At what net salary does the earnings-related childcare allowance hit its cap?', a: `Using our maternity-pay estimate with a ${EN.pct(SZ)} special-payment surcharge, from about ${EN.eur(nettoDeckel)} net a month; above that you get ${EN.eur(K.ea_tag_max, 2)} a day. Below roughly ${EN.eur(nettoBoden)} net the minimum of ${EN.eur(K.konto_tag_max, 2)} applies. For mothers the actual Wochengeld (maternity pay) counts; for fathers a notional one based on the eight weeks before the birth, after which the health insurer also checks the tax assessment.` },
      { q: 'Can I switch childcare allowance scheme after applying?', a: `Only within ${K.systemwechsel_frist_tage} days of the first application, with no exceptions afterwards, and the choice binds the other parent too. Within the account you can change the length once per child if the request arrives at least ${K.variantenwechsel_vorlauf_tage} days before the original end date. Past daily amounts are then recalculated, but periods already claimed cannot be moved.` },
      { q: 'How much childcare allowance do both parents get together?', a: `On the account up to about ${EN.eur(kurz2.gesamt)} instead of ${EN.eur(kurz1.gesamt)}, over ${K.konto_tage_beide_min} to ${K.konto_tage_beide_max} days, with around ${EN.pct(K.partner_anteil)} reserved for the second parent. On the earnings-related scheme the claim runs until day ${K.ea_tage_beide}, and ${K.ea_partner_tage} days per parent cannot be transferred. Parents who split roughly equally each get a partnership bonus (Partnerschaftsbonus) of ${EN.eur(K.partnerschaftsbonus_je)}.` },
    ],
    body: (h) => `
<h2>What the calculator compares</h2>
<p>Choose the account length in days from the birth and whether both parents will claim, then enter your monthly net pay before the birth. The calculator lines up the account's daily rate and total, an estimate of maternity pay, the earnings-related daily rate and the difference over the whole claim. Look at the total: on the account, a longer duration only moves the same money into more months.</p>
<h2>The account: one sum, different lengths</h2>
${h.table(['Length (one parent)', 'Per day', 'Per month (30 days)', 'Total'], konto.map((k) => [`${k.tage} days`, h.eur(k.tagsatz, 2), h.eur(k.monat), h.eur(k.gesamt)]), 'Childcare allowance account 2026, one parent, from our engine', ['l', 'r', 'r', 'r'])}
<p>The limits of ${h.eur(h.P.kbg.konto_tag_max, 2)} and ${h.eur(h.P.kbg.konto_tag_min, 2)} are published by the ${h.src('kbgKonto', 'Federal Chancellery')}. If both parents claim, the account stretches from ${h.P.kbg.konto_tage_beide_min} to ${h.P.kbg.konto_tage_beide_max} days; the second parent's reserved share is ${kurz2.partnerTage} days in the shortest version and ${lang2.partnerTage} at ${h.P.kbg.konto_tage_beide_max} days. For twins or more, the account rate rises by ${h.pct(h.P.kbg.mehrling_zuschlag)} for each additional child; the earnings-related scheme has no such supplement.</p>
<h2>Earnings-related: ${h.pct(h.P.kbg.ea_quote)} with a cap</h2>
${h.table(['Monthly net', 'Estimated daily rate', `Total (${h.P.kbg.ea_tage_ein} days)`, 'Above shortest account'], ea.map(({ n, r, summe }) => [h.eur(n), h.eur(r.tagsatz, 2), h.eur(summe), h.eur(summe - kurz1.gesamt)]), `Estimate via maternity pay (net per calendar day plus ${h.pct(SZ)} special-payment surcharge)`, ['r', 'r', 'r', 'r'])}
<p>The ${h.src('kbgEa', 'Federal Chancellery')} describes the earnings-related allowance as income replacement for parents who step away from work only briefly. It nearly always pays more, but for a shorter time: one parent can claim it for at most ${h.P.kbg.ea_tage_ein} days. How it is worked out from maternity pay and the tax assessment is explained on the page about the ${h.a('kbg-einkommensabhaengig', 'earnings-related childcare allowance')}; the mother's starting point is ${h.a('wochengeld', 'Wochengeld (maternity pay)')}.</p>
<h2>What matters besides the money</h2>
<ul>
<li><strong>Work before the birth:</strong> the earnings-related scheme needs ${h.P.kbg.ea_erwerb_tage} calendar days of uninterrupted work with Austrian health and pension insurance, without unemployment benefit. Newcomers to Austria who started a job only a few months before the birth often miss this and get the minimum.</li>
<li><strong>Side income:</strong> the account allows ${h.eur(h.P.kbg.zuverdienst_konto)} per calendar year, or ${h.pct(h.P.kbg.zuverdienst_individuell_quote)} of earlier income if higher; the earnings-related scheme only ${h.eur(h.P.kbg.zuverdienst_ea)}. See ${h.a('kbg-zuverdienst', 'earning while on childcare allowance')}.</li>
<li><strong>Time at home:</strong> if you plan two years with your child, the earnings-related scheme only covers the first.</li>
<li><strong>Blocks and handovers:</strong> each block lasts at least ${h.P.kbg.block_min_tage} days; at the first handover both parents may claim at the same time for up to ${h.P.kbg.gleichzeitig_max_tage} days, which shortens the total by those days.</li>
</ul>
<p>All figures come from the ${h.src('kbgBroschuere', 'childcare allowance brochure 2026')}. Our calculator estimates maternity pay from your net salary; your health insurer sets the binding amount.</p>
`,
  },
});
