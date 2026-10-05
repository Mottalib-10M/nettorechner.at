import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { rechneJahr, standardJahr } from '../../lib/engine/jahr';
import { svLaufend, lohnsteuerLaufend } from '../../lib/engine/lohn';
import { P, DE, EN } from '../../lib/fmt';

/** Alle Ergebnisse aus dem Motor. Erhöhung um 3 % bei verschiedenen Gehältern. */
const PROZ = 0.03;
const TAB = [2000, 2500, 3000, 4000, 5000, 6000].map((b) => {
  const o = kurz(b), n = kurz(b * (1 + PROZ));
  return { b, plusB: b * PROZ, plusN: n.nettoMonat - o.nettoMonat, plusJ: n.nettoJahr - o.nettoJahr, quote: (n.nettoMonat - o.nettoMonat) / (b * PROZ) };
});
const t3000 = TAB[2];
/** Grenzbelastung je Stufe: was von 100 € mehr brutto im laufenden Monat bleibt. */
const STUFEN = [1200, 1500, 2000, 2800, 3500, 5000, 6500, 8000].map((b) => {
  const sv = svLaufend(b), st = lohnsteuerLaufend(b - sv.summe);
  return { b, sv: sv.satz, gst: st.grenzsteuersatz, bleibt: (kurz(b + 100).nettoMonat - kurz(b).nettoMonat) / 100 };
});
/** Sprünge an den Grenzen der Arbeitslosenversicherung (Staffel nach Brutto). */
const SPRUNG = P.sv.av_staffel.map(([g]) => {
  const vor = kurz(g).nettoMonat, nach = kurz(g + 1).nettoMonat;
  let aus = g + 1;
  while (kurz(aus).nettoMonat < vor && aus < g + 200) aus += 1;
  return { g, vor, nach, verlust: vor - nach, aus };
});
const s1 = SPRUNG[0], s3 = SPRUNG[2];
const minB = Math.min(...STUFEN.map((s) => s.bleibt)), maxB = Math.max(...STUFEN.map((s) => s.bleibt));
/** Brutto, ab dem der laufende Bezug die 40-Prozent-Stufe erreicht (voller SV-Satz). */
const SV_VOLL = P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av + P.sv.dn.ak + P.sv.dn.wf;
const b40 = (P.tarif.grenzen[2] + P.tarif.werbungskostenpauschale) / 12 / (1 - SV_VOLL);
/** Zeitpunkt: 3.500 € mit 3 % ab Jänner oder ab Oktober, Sonderzahlungen in Höhe des aktuellen Gehalts. */
const ALT = 3500, NEU = ALT * (1 + PROZ);
const jan = rechneJahr(standardJahr(NEU));
const okt = rechneJahr(Array.from({ length: 12 }, (_, i) => { const g = i < 9 ? ALT : NEU; return { laufend: g, sz: i === 5 || i === 10 ? g : 0 }; }));
const ohne = rechneJahr(standardJahr(ALT));

export default defineGuide({
  id: 'gehaltserhoehung',
  group: 'lohn',
  order: 65,
  mini: 'gehaltserhoehung',
  related: ['jahressechstel', 'netto-brutto', 'sozialversicherung', 'lohnsteuer', 'netto-2500'],
  sources: ['estg33', 'oegkAv', 'estg67'],
  de: {
    slug: 'gehaltserhoehung-netto',
    nav: 'Gehaltserhöhung netto',
    card: `Wie viel von einer Erhöhung bleibt, wo die Arbeitslosenversicherung Netto frisst und welcher Monat günstig ist.`,
    title: 'Gehaltserhöhung netto 2026: was von mehr Brutto ankommt',
    description: `Gehaltserhöhung 2026 in Österreich: Von 3 % mehr bei ${DE.eur(3000)} bleiben ${DE.eur(t3000.plusN, 2)} netto im Monat. Grenzbelastung je Stufe und Sprünge an den Grenzen der AV.`,
    h1: 'Gehaltserhöhung: wie viel davon netto bleibt',
    intro: 'Die Rechnung hinter jeder Lohnerhöhung, mit den Stellen, an denen ein kleines Plus beim Brutto weniger Netto bedeutet.',
    resume: `Von einer Gehaltserhöhung bleibt in Österreich 2026 je nach Einkommen zwischen ${DE.pct(minB)} und ${DE.pct(maxB)} netto übrig. Bei ${DE.eur(3000)} brutto bringt eine Erhöhung um ${DE.pct(PROZ)} brutto ${DE.eur(t3000.plusB)} mehr im Monat, netto ${DE.eur(t3000.plusN, 2)}, also ${DE.pct(t3000.quote, 1)} davon; aufs Jahr gerechnet mit Urlaubszuschuss und Weihnachtsremuneration sind es ${DE.eur(t3000.plusJ)}. Der Grund ist die Grenzbelastung: Jeder zusätzliche Euro kostet ${DE.pct(P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av + P.sv.dn.ak + P.sv.dn.wf, 2)} Sozialversicherung und vom Rest den Grenzsteuersatz des Tarifs nach § 33 EStG, 20, 30, 40 oder 48 Prozent. Eine Falle gibt es knapp über ${DE.eur(s1.g)}, ${DE.eur(P.sv.av_staffel[1][0])} und ${DE.eur(s3.g)} brutto: Dort steigt der Arbeitslosenversicherungsbeitrag stufenweise für das ganze Gehalt, und ein Euro mehr Brutto kostet bis zu ${DE.eur(Math.max(...SPRUNG.map((s) => s.verlust)), 2)} Netto. Erst ab ${DE.eur(s1.aus)} brutto ist der Verlust an der ersten Grenze wieder aufgeholt. Wird die Erhöhung erst im Herbst wirksam, reicht das Jahressechstel im November nicht ganz; den Teil der Weihnachtsremuneration darüber gleicht meist die Kontrollrechnung im Dezember aus.`,
    faqs: [
      { q: 'Warum bekomme ich nach einer Gehaltserhöhung um 1 Euro weniger netto?', a: `Weil die Arbeitslosenversicherung bei kleinen Einkommen gestaffelt ist und der höhere Satz für das ganze Gehalt gilt. Bis ${DE.eur(s1.g)} zahlen Sie ${DE.pct(0)}, darüber ${DE.pct(P.sv.av_staffel[1][1])}, ab ${DE.eur(P.sv.av_staffel[1][0])} ${DE.pct(P.sv.av_staffel[2][1])} und ab ${DE.eur(s3.g)} ${DE.pct(P.sv.dn.av, 2)}. An der ersten Grenze sinkt das Netto so von ${DE.eur(s1.vor, 2)} auf ${DE.eur(s1.nach, 2)}. Grundlage ist die Regelung der ÖGK ab 1. Jänner 2026.` },
      { q: 'Wie viel muss eine Gehaltserhöhung über einer AV-Grenze mindestens betragen?', a: `So viel, dass der Sprung im Arbeitslosenversicherungsbeitrag aufgefangen ist. Wer genau ${DE.eur(s1.g)} verdient, braucht mindestens ${DE.eur(s1.aus)} brutto, um wieder auf das alte Netto von ${DE.eur(s1.vor, 2)} zu kommen. An der letzten Grenze von ${DE.eur(s3.g)} sind es ${DE.eur(s3.aus)}. Diese Beträge gelten für 2026 und den laufenden Monatsbezug außerhalb Wiens.` },
      { q: 'Lohnt sich eine Gehaltserhöhung ab Jänner mehr als ab Herbst?', a: `Ja, weil sie zwölf Monate statt drei wirkt; am Satz ändert sich nichts. Bei ${DE.eur(ALT)} und ${DE.pct(PROZ)} mehr ab Jänner steigt das Jahresnetto um ${DE.eur(jan.netto - ohne.netto)}, ab Oktober um ${DE.eur(okt.netto - ohne.netto)}. Ein Herbstbeginn verschiebt zusätzlich einen Teil der Weihnachtsremuneration über das Jahressechstel; die Kontrollrechnung im Dezember holt die Mehrsteuer meist zurück.` },
      { q: 'Rutscht man durch eine Gehaltserhöhung in eine höhere Steuerklasse?', a: `Österreich hat keine Steuerklassen, sondern einen Stufentarif: Nur der Teil des Jahreseinkommens über einer Grenze wird mit dem höheren Satz besteuert. Wer mit der Erhöhung die Grenze von ${DE.eur(P.tarif.grenzen[2])} überschreitet, zahlt 40 Prozent nur auf den Euro darüber. Das Netto kann wegen des Tarifs daher nie sinken; Rückgänge entstehen nur an den Grenzen der Arbeitslosenversicherung.` },
      { q: 'Erhöht eine Gehaltserhöhung automatisch auch Urlaubsgeld und Weihnachtsgeld?', a: `Wenn die Sonderzahlungen nach Kollektivvertrag oder Vertrag ein Monatsgehalt betragen, ja: Sie richten sich dann nach dem Gehalt im Auszahlungsmonat. Netto bleibt davon mehr als vom laufenden Plus, weil im Jahressechstel nur ${DE.pct(P.sonderzahlungen.stufen[1][1])} Lohnsteuer anfallen. Bei ${DE.eur(3000)} bringen ${DE.pct(PROZ)} mehr deshalb ${DE.eur(t3000.plusJ)} im Jahr, mehr als vierzehnmal das Monatsplus von ${DE.eur(t3000.plusN, 2)}.` },
    ],
    body: (h) => `
<h2>Grenzbelastung: was von 100 Euro mehr bleibt</h2>
<p>Für eine Erhöhung zählt nicht der Durchschnitt Ihrer Abzüge, sondern was auf den nächsten Euro anfällt. Zuerst geht die Sozialversicherung ab, dann wird der Rest mit dem Grenzsteuersatz des ${h.src('estg33', 'Tarifs nach § 33 EStG')} besteuert. Über der Höchstbeitragsgrundlage entfällt die Sozialversicherung, dort bleibt mehr vom Plus.</p>
${h.table(['Brutto pro Monat', 'SV-Satz', 'Grenzsteuersatz', 'von 100 € bleiben'], STUFEN.map((s) => [h.eur(s.b), h.pct(s.sv, 2), h.pct(s.gst, 0), h.eur(s.bleibt * 100, 2)]), 'Laufender Monat 2026, außerhalb Wiens, ohne Kinder und Pendlerpauschale', ['r', 'r', 'r', 'r'])}
<p>Bei kleinen Einkommen ist die Lohnsteuer noch null, aber die Sozialversicherung wirkt voll. Im mittleren Bereich kommen Sozialversicherung und 30 Prozent Steuer zusammen, ab ${h.eur(b40)} brutto 40 Prozent. Der Sprung nach oben bei ${h.eur(8000)} kommt von der ${h.a('hoechstbeitragsgrundlage', 'Höchstbeitragsgrundlage')}: Über ${h.eur(h.P.sv.hbg_monat)} kostet ein zusätzlicher Euro keine Sozialversicherung mehr.</p>

<h2>Drei Prozent mehr: die Tabelle</h2>
<p>Eine Erhöhung in Prozent bringt bei hohen Gehältern mehr Euro, aber einen kleineren Anteil netto. Das Jahresplus enthält die beiden Sonderzahlungen, die meist mitsteigen.</p>
${h.table(['Brutto vorher', 'plus brutto/Monat', 'plus netto/Monat', 'Netto-Anteil', 'plus netto/Jahr'], TAB.map((t) => [h.eur(t.b), h.eur(t.plusB), h.eur(t.plusN, 2), h.pct(t.quote, 1), h.eur(t.plusJ)]), `Erhöhung um ${h.pct(PROZ, 0)}, 14 Bezüge, 2026`, ['r', 'r', 'r', 'r', 'r'])}
<p>Bei ${h.eur(2000)} bleibt der größte Anteil: Auch das neue Brutto von ${h.eur(2000 * (1 + PROZ))} liegt unter ${h.eur(h.P.sv.av_staffel[0][0])}, es fällt also kein Arbeitslosenversicherungsbeitrag an, und die Lohnsteuer greift erst mit 20 Prozent. Ab ${h.eur(5000)} kommt nur noch knapp die Hälfte an, weil Sozialversicherung und die 40-Prozent-Stufe zusammenwirken. Wer ${h.eur(2500)} verdient, zahlt bereits ${h.pct(h.P.sv.av_staffel[2][1], 0)} Arbeitslosenversicherung und dazu 30 Prozent Steuer auf den Zuwachs.</p>

<h2>Die Falle an den Grenzen der Arbeitslosenversicherung</h2>
<p>Seit 2026 gilt für den Dienstnehmeranteil zur Arbeitslosenversicherung diese Staffel (${h.src('oegkAv', 'ÖGK, Arbeitslosenversicherung bei geringem Einkommen')}): bis ${h.eur(h.P.sv.av_staffel[0][0])} null, bis ${h.eur(h.P.sv.av_staffel[1][0])} ${h.pct(h.P.sv.av_staffel[1][1], 0)}, bis ${h.eur(h.P.sv.av_staffel[2][0])} ${h.pct(h.P.sv.av_staffel[2][1], 0)}, darüber ${h.pct(h.P.sv.dn.av, 2)}. Der Satz gilt nicht nur für den Teil über der Grenze, sondern für das ganze Monatsbrutto. Wer die Grenze um einen Euro überschreitet, zahlt auf einen Schlag mehr Beitrag, als er gewinnt.</p>
${h.table(['Grenze', 'Netto genau an der Grenze', 'Netto 1 € darüber', 'Verlust', 'aufgeholt ab Brutto'], SPRUNG.map((s) => [h.eur(s.g), h.eur(s.vor, 2), h.eur(s.nach, 2), h.eur(s.verlust, 2), h.eur(s.aus)]), 'Laufender Monat 2026, außerhalb Wiens', ['r', 'r', 'r', 'r', 'r'])}
<p>Der Lohnsteuertarif dämpft den Verlust etwas, weil weniger Steuer auf das niedrigere steuerpflichtige Einkommen anfällt; ausgleichen kann er ihn nicht. Liegt Ihr neues Gehalt in einer dieser Lücken, ist es fairer, eine etwas höhere Erhöhung zu verhandeln oder einen Teil als steuerfreie Leistung zu vereinbaren. Für Lehrlinge gilt eine eigene, niedrigere Staffel.</p>

<h2>Der Zeitpunkt im Jahr und das Jahressechstel</h2>
<p>Am Netto pro Monat ändert der Starttermin nichts. Er beeinflusst aber, wie Urlaubszuschuss und Weihnachtsremuneration besteuert werden, weil das ${h.a('jahressechstel', 'Jahressechstel')} aus den bisher bezahlten Gehältern gebildet wird (${h.src('estg67', '§ 67 Abs. 2 EStG')}). Eine Erhöhung ab Oktober macht die Weihnachtsremuneration im November größer, das Sechstel wächst aber nur mit drei von elf Monaten mit.</p>
${h.table(['Variante', 'Jahresnetto', 'plus gegenüber ohne Erhöhung', 'Teil der Weihnachtsremuneration über dem Sechstel'], [
  ['ohne Erhöhung', h.eur(ohne.netto, 2), h.eur(0), h.eur(ohne.monate[10].szUeberSechstel, 2)],
  [`${h.pct(PROZ, 0)} ab Jänner`, h.eur(jan.netto, 2), h.eur(jan.netto - ohne.netto, 2), h.eur(jan.monate[10].szUeberSechstel, 2)],
  [`${h.pct(PROZ, 0)} ab Oktober`, h.eur(okt.netto, 2), h.eur(okt.netto - ohne.netto, 2), h.eur(okt.monate[10].szUeberSechstel, 2)],
], `Ausgangsgehalt ${h.eur(ALT)}, Sonderzahlungen in Höhe des aktuellen Gehalts`, ['l', 'r', 'r', 'r'])}
<p>Im Oktober-Fall liegen ${h.eur(okt.monate[10].szUeberSechstel, 2)} der Weihnachtsremuneration über dem Sechstel und werden im November mit dem Tarif versteuert. Im Dezember prüft die Kontrollrechnung alle zwölf Gehälter, dann passt der Betrag ins Sechstel und die Mehrsteuer kommt zurück (Ergebnis im Beispiel: ${h.eur(-okt.kontrolle.mehrsteuer, 2)}). Wer im Herbst mehr bekommt, sieht also im November ein etwas kleineres Weihnachtsgeld als gedacht und im Dezember ein etwas größeres Gehalt.</p>

<h2>Was eine Erhöhung über das Netto hinaus bringt</h2>
<p>Ein höheres Brutto wirkt auch dort, wo man es auf dem Konto nicht sofort sieht. Die Beitragsgrundlage steigt, und nach ihr richten sich später das ${h.a('arbeitslosengeld', 'Arbeitslosengeld')} und die Pension. Der Arbeitgeber zahlt außerdem ${h.pct(h.P.sv.dg.mv, 2)} des Entgelts in Ihre BV-Kasse, die ${h.a('abfertigung-neu', 'Abfertigung neu')} wächst also mit jeder Erhöhung. Eine Einmalprämie bringt dagegen nur einmal Geld und erhöht weder das laufende Sechstel noch künftige Sonderzahlungen.</p>

<h2>Brutto verhandeln, Netto prüfen</h2>
<p>Bevor Sie zusagen, rechnen Sie das neue Gehalt im ${h.a('home', 'Brutto-Netto-Rechner')} durch, mit Ihrem Bundesland, Kindern und Pendlerpauschale; diese Absetzbeträge ändern die Lohnsteuer, aber nicht die Grenzbelastung des nächsten Euros. Wer umgekehrt ein Nettoziel hat, findet das nötige Brutto im ${h.a('netto-brutto', 'Netto-Brutto-Rechner')}.</p>
`,
  },
  en: {
    slug: 'pay-rise-net',
    nav: 'Pay rise: net effect',
    card: 'How much of an Austrian pay rise reaches your account, where unemployment insurance eats it and when timing matters.',
    title: 'Pay Rise Austria 2026: How Much You Keep After Tax and SI',
    description: `Pay rise in Austria 2026: a 3% raise on ${EN.eur(3000)} adds ${EN.eur(t3000.plusN, 2)} net a month. Marginal rates by band, unemployment insurance traps and why the timing matters.`,
    h1: 'Getting a pay rise in Austria: what you actually keep',
    intro: 'For employees in Austria weighing an offer: the maths behind a raise, including the spots where a little more gross means less net.',
    resume: `In Austria in 2026 you keep between ${EN.pct(minB)} and ${EN.pct(maxB)} of a pay rise, depending on your salary. On ${EN.eur(3000)} gross a month, a ${EN.pct(PROZ)} raise adds ${EN.eur(t3000.plusB)} gross and ${EN.eur(t3000.plusN, 2)} net, so ${EN.pct(t3000.quote, 1)} reaches you; over a year, with holiday and Christmas pay rising as well, the gain is ${EN.eur(t3000.plusJ)}. Why so little? Each extra euro first loses ${EN.pct(P.sv.dn.kv + P.sv.dn.pv + P.sv.dn.av + P.sv.dn.ak + P.sv.dn.wf, 2)} in social insurance, and the rest is taxed at your marginal rate on the wage tax scale: 20, 30, 40 or 48 percent. There is a trap just above ${EN.eur(s1.g)}, ${EN.eur(P.sv.av_staffel[1][0])} and ${EN.eur(s3.g)} gross, where the unemployment insurance rate steps up for your whole salary and one extra euro gross can cost up to ${EN.eur(Math.max(...SPRUNG.map((s) => s.verlust)), 2)} net. Only at ${EN.eur(s1.aus)} gross is the loss at the first step recovered. A raise that starts in autumn also pushes part of your Christmas pay above the annual sixth in November; the December check usually gives the extra tax back.`,
    faqs: [
      { q: 'Why did a small pay rise leave me with less net pay?', a: `Because unemployment insurance for lower earners is charged in steps, and the higher rate applies to your entire salary. Up to ${EN.eur(s1.g)} you pay nothing, above it ${EN.pct(P.sv.av_staffel[1][1])}, from ${EN.eur(P.sv.av_staffel[1][0])} ${EN.pct(P.sv.av_staffel[2][1])} and from ${EN.eur(s3.g)} the full ${EN.pct(P.sv.dn.av, 2)}. At the first step net pay falls from ${EN.eur(s1.vor, 2)} to ${EN.eur(s1.nach, 2)}. These are the ÖGK rules from 1 January 2026.` },
      { q: 'How big must a pay rise be to clear an unemployment insurance step?', a: `Large enough to absorb the jump in contributions. At exactly ${EN.eur(s1.g)} you need at least ${EN.eur(s1.aus)} gross to get back to your old net of ${EN.eur(s1.vor, 2)}. At the last step, ${EN.eur(s3.g)}, the break-even is ${EN.eur(s3.aus)}. If an employer offers a raise that lands in between, ask for a little more; the figures apply to regular monthly pay in 2026 outside Vienna.` },
      { q: 'Is a pay rise from January worth more than one from October?', a: `Yes, simply because it runs for twelve months instead of three; the rate is the same. On ${EN.eur(ALT)} with ${EN.pct(PROZ)} more from January your annual net rises by ${EN.eur(jan.netto - ohne.netto)}, from October by ${EN.eur(okt.netto - ohne.netto)}. An autumn start also pushes part of the Christmas pay above the annual sixth in November, which the December control calculation usually corrects.` },
      { q: 'Does a pay rise in Austria also increase my holiday and Christmas pay?', a: `If your contract or collective agreement sets each special payment at one monthly salary, yes: they follow the salary in the month they are paid. More of that increase reaches you, because within the annual sixth wage tax is only ${EN.pct(P.sonderzahlungen.stufen[1][1])}. That is why ${EN.pct(PROZ)} on ${EN.eur(3000)} adds ${EN.eur(t3000.plusJ)} a year, more than fourteen times the monthly gain of ${EN.eur(t3000.plusN, 2)}.` },
    ],
    body: (h) => `
<h2>Marginal rates: what you keep from an extra €100</h2>
<p>A raise is taxed at the margin, not at your average rate. Social insurance comes off first; the rest is taxed at the marginal rate of the ${h.src('estg33', 'wage tax scale in section 33 of the Income Tax Act')}. Above the contribution ceiling, social insurance stops and more of each raise reaches you.</p>
${h.table(['Gross per month', 'SI rate', 'Marginal tax rate', 'kept from €100'], STUFEN.map((s) => [h.eur(s.b), h.pct(s.sv, 2), h.pct(s.gst, 0), h.eur(s.bleibt * 100, 2)]), 'Regular month 2026, outside Vienna, no children or commuter allowance', ['r', 'r', 'r', 'r'])}
<p>At low salaries wage tax is still zero but social insurance bites in full. In the middle range, social insurance and the 30 percent band combine; from ${h.eur(b40)} gross it is 40 percent. The jump at ${h.eur(8000)} comes from the ${h.a('hoechstbeitragsgrundlage', 'contribution ceiling')}: above ${h.eur(h.P.sv.hbg_monat)} a month, extra pay carries no social insurance.</p>

<h2>A 3 percent raise at different salaries</h2>
<p>A percentage raise gives more euros on a high salary but a smaller share net. Austrian employees are usually paid 14 times a year, so the annual figure includes the two special payments, which normally rise too.</p>
${h.table(['Gross before', 'extra gross/month', 'extra net/month', 'net share', 'extra net/year'], TAB.map((t) => [h.eur(t.b), h.eur(t.plusB), h.eur(t.plusN, 2), h.pct(t.quote, 1), h.eur(t.plusJ)]), `${h.pct(PROZ, 0)} raise, 14 payments, 2026`, ['r', 'r', 'r', 'r', 'r'])}
<p>At ${h.eur(2000)} you keep the largest share: even the new gross of ${h.eur(2000 * (1 + PROZ))} is below ${h.eur(h.P.sv.av_staffel[0][0])}, so no unemployment insurance is due, and tax on the extra only runs at 20 percent. From ${h.eur(5000)} barely half arrives, because full social insurance meets the 40 percent band. On ${h.eur(2500)} you already pay ${h.pct(h.P.sv.av_staffel[2][1], 0)} unemployment insurance and 30 percent tax on the gain.</p>

<h2>The unemployment insurance trap</h2>
<p>From 2026 the employee's unemployment insurance share is charged in steps (${h.src('oegkAv', 'ÖGK, reduced rates for low earnings')}): nothing up to ${h.eur(h.P.sv.av_staffel[0][0])}, ${h.pct(h.P.sv.av_staffel[1][1], 0)} up to ${h.eur(h.P.sv.av_staffel[1][0])}, ${h.pct(h.P.sv.av_staffel[2][1], 0)} up to ${h.eur(h.P.sv.av_staffel[2][0])} and ${h.pct(h.P.sv.dn.av, 2)} above. The rate applies to the whole monthly gross, not only to the part above the step. Cross a step by one euro and the extra contribution outweighs the gain.</p>
${h.table(['Step', 'Net exactly at the step', 'Net €1 above', 'Loss', 'recovered from gross'], SPRUNG.map((s) => [h.eur(s.g), h.eur(s.vor, 2), h.eur(s.nach, 2), h.eur(s.verlust, 2), h.eur(s.aus)]), 'Regular month 2026, outside Vienna', ['r', 'r', 'r', 'r', 'r'])}
<p>Wage tax softens the drop slightly, since the lower taxable pay carries less tax, but it cannot cancel it. If a proposed salary lands in one of these gaps, it is reasonable to ask for a slightly bigger raise or for part of it as a tax-free benefit. Apprentices have their own, lower scale.</p>

<h2>Timing and the annual sixth</h2>
<p>The start date does not change your monthly net. It does affect how holiday and Christmas pay are taxed, because the ${h.a('jahressechstel', 'annual sixth')} (Jahressechstel, the share of special payments taxed at low fixed rates) is built from salaries already paid (${h.src('estg67', 'section 67(2)')}). A raise from October makes the November Christmas pay larger, while the sixth only reflects three of eleven months at the new level.</p>
${h.table(['Scenario', 'Annual net', 'gain vs. no raise', 'Christmas pay above the sixth'], [
  ['no raise', h.eur(ohne.netto, 2), h.eur(0), h.eur(ohne.monate[10].szUeberSechstel, 2)],
  [`${h.pct(PROZ, 0)} from January`, h.eur(jan.netto, 2), h.eur(jan.netto - ohne.netto, 2), h.eur(jan.monate[10].szUeberSechstel, 2)],
  [`${h.pct(PROZ, 0)} from October`, h.eur(okt.netto, 2), h.eur(okt.netto - ohne.netto, 2), h.eur(okt.monate[10].szUeberSechstel, 2)],
], `Starting salary ${h.eur(ALT)}, special payments equal to the current salary`, ['l', 'r', 'r', 'r'])}
<p>In the October case, ${h.eur(okt.monate[10].szUeberSechstel, 2)} of the Christmas pay sit above the sixth and are taxed on the scale in November. In December the control calculation looks at all twelve salaries, the amount fits again and the extra tax is refunded (here ${h.eur(-okt.kontrolle.mehrsteuer, 2)}). So an autumn raise means a slightly smaller Christmas payout than expected and a slightly larger December salary.</p>

<h2>What a raise brings beyond net pay</h2>
<p>A higher gross also counts where you do not see it straight away. Your contribution base rises, and later ${h.a('arbeitslosengeld', 'unemployment benefit')} and your pension are worked out from it. Your employer also pays ${h.pct(h.P.sv.dg.mv, 2)} of your pay into your severance fund, so the ${h.a('abfertigung-neu', 'new-style severance')} grows with every raise. A one-off bonus pays once and lifts neither the annual sixth nor future special payments.</p>

<h2>Negotiate gross, check net</h2>
<p>Before you accept, run the new salary through the ${h.a('home', 'gross-to-net calculator')} with your federal state, children and commuter allowance; those credits change your wage tax but not the marginal rate on the next euro. If you have a net target instead, the ${h.a('netto-brutto', 'net-to-gross calculator')} finds the gross you need to ask for.</p>
`,
  },
});
