import { defineGuide } from '../../lib/guide-types';
import { kurz } from '../../lib/engine/leistungen';
import { svLaufend } from '../../lib/engine/lohn';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

/** Alles aus params-2026.json und dem Motor: Deckel der Sozialversicherung 2026. */
const S = P.sv;
const HBG = S.hbg_monat;
const maxSv = svLaufend(HBG);
const maxSvWien = svLaufend(HBG, true);
const szSatz = S.dn.kv + S.dn.pv + S.dn.av;
const maxSvSz = r2(S.hbg_sz_jahr * szSatz);
const maxSvJahr = r2(maxSv.summe * 12 + maxSvSz);
const jahresBasis = HBG * 12 + S.hbg_sz_jahr;
const dgSatz = S.dg.kv + S.dg.pv + S.dg.av + S.dg.uv + S.dg.ie + S.dg.wf;
const mehrfachMonat = S.hbg_tag * S.pv_erstattung_hbg_tage;
/** Grenzbelastung: was von 100 € mehr brutto bleibt, unter und über dem Deckel. */
const rand = (b: number) => (kurz(b + 100).nettoMonat - kurz(b).nettoMonat) / 100;
const mUnter = rand(6400), mUeber = rand(7000), mHoch = rand(9000);
/** Brutto, ab dem der laufende Bezug in die 48-Prozent-Stufe kommt (über dem Deckel: SV fix). */
const b48 = (P.tarif.grenzen[3] + P.tarif.werbungskostenpauschale) / 12 + maxSv.summe;
const beispiele = [6000, HBG, 8000, 10000, 12000].map((b) => ({ b, k: kurz(b), sv: svLaufend(b) }));
const b8 = beispiele[2];
/** Eintritt am 16. eines Monats: 15 Versicherungstage, je ein Dreißigstel. */
const teilTage = 15;
const teilDeckel = S.hbg_tag * teilTage;

export default defineGuide({
  id: 'hoechstbeitragsgrundlage',
  group: 'lohn',
  order: 60,
  mini: 'hbg',
  related: ['sozialversicherung', 'netto-7000', 'netto-10000', 'sonderzahlungen', 'dienstgeberkosten'],
  sources: ['oegkWerte', 'oegkHbg', 'wkoBeitraege', 'asvg70'],
  de: {
    slug: 'hoechstbeitragsgrundlage',
    nav: 'Höchstbeitragsgrundlage',
    card: `Ab ${DE.eur(HBG)} brutto steigt die Sozialversicherung nicht mehr: was der Deckel monatlich und im Jahr bringt.`,
    title: `Höchstbeitragsgrundlage 2026: ${DE.eur(HBG)} und was sie deckelt`,
    description: `Höchstbeitragsgrundlage 2026: ${DE.eur(HBG)} im Monat, ${DE.eur(S.hbg_tag)} am Tag, ${DE.eur(S.hbg_sz_jahr)} für Sonderzahlungen. Ab wann die SV nicht mehr steigt und was netto übrig bleibt.`,
    h1: 'Die Höchstbeitragsgrundlage: wo die Sozialversicherung aufhört',
    intro: 'Der Betrag, über dem kein Euro mehr Sozialversicherung kostet, und warum hohe Gehälter darüber prozentual weniger abgeben.',
    resume: `Die Höchstbeitragsgrundlage 2026 beträgt ${DE.eur(HBG)} brutto im Monat, das sind ${DE.eur(S.hbg_tag)} pro Kalendertag; für Urlaubszuschuss und Weihnachtsremuneration gilt zusammen eine eigene Jahresgrenze von ${DE.eur(S.hbg_sz_jahr)}. Was ein Dienstnehmer darüber verdient, ist beitragsfrei. Der Dienstnehmeranteil erreicht damit sein Maximum bei ${DE.eur(maxSv.summe, 2)} im Monat (${DE.pct(maxSv.satz, 2)} von ${DE.eur(HBG)}), in Wien wegen des höheren Wohnbauförderungsbeitrags bei ${DE.eur(maxSvWien.summe, 2)}. Von beiden Sonderzahlungen zusammen gehen höchstens ${DE.eur(maxSvSz, 2)} ab, im ganzen Jahr also nie mehr als ${DE.eur(maxSvJahr, 2)}. Bei ${DE.eur(8000)} brutto sinkt die Belastung dadurch auf ${DE.pct(b8.sv.summe / 8000, 1)} statt ${DE.pct(maxSv.satz, 2)}. Für freie Dienstnehmer ohne Sonderzahlungen liegt die Grenze bei ${DE.eur(S.hbg_freie_dn_monat)} im Monat. Alle Werte folgen aus der Aufwertungszahl ${DE.num(S.aufwertungszahl, 3)}, die für 2026 mit BGBl. II Nr. 263/2025 kundgemacht wurde, und werden jedes Jahr neu festgesetzt. Die Lohnsteuer kennt keinen solchen Deckel: Sie wächst über der Grenze weiter mit dem Tarif.`,
    faqs: [
      { q: 'Ab welchem Bruttogehalt greift die Höchstbeitragsgrundlage 2026?', a: `Ab einem laufenden Monatsbezug von ${DE.eur(HBG)}. Bis dorthin kostet jeder Euro ${DE.pct(maxSv.satz, 2)} Dienstnehmerbeitrag, darüber nichts mehr. Bei 14 gleichen Bezügen entspricht das einem Jahresbrutto von ${DE.eur(HBG * 14)}. Die Sonderzahlungen haben ihre eigene Jahresgrenze von ${DE.eur(S.hbg_sz_jahr)}, das sind genau zwei Monatsgrenzen. Rechtsgrundlage sind die veränderlichen Werte der ÖGK für 2026.` },
      { q: 'Wie viel bleibt netto von einer Erhöhung über der Höchstbeitragsgrundlage?', a: `Über ${DE.eur(HBG)} fällt die Sozialversicherung weg, es bleibt nur die Lohnsteuer. Bei rund ${DE.eur(7000)} brutto liegt der Grenzsteuersatz bei 40 Prozent: Von ${DE.eur(100)} mehr kommen ${DE.eur(mUeber * 100, 2)} an, knapp unter der Grenze waren es ${DE.eur(mUnter * 100, 2)}. Ab ${DE.eur(b48)} brutto greift die 48-Prozent-Stufe, dann bleiben ${DE.eur(mHoch * 100, 2)} von ${DE.eur(100)}.` },
      { q: 'Wie wird die Höchstbeitragsgrundlage bei Eintritt mitten im Monat berechnet?', a: `Tageweise. Die ÖGK setzt für jeden versicherten Tag ein Dreißigstel der Monatsgrenze an, also ${DE.eur(S.hbg_tag)}. Wer am 16. eines Monats beginnt und ${teilTage} Tage versichert ist, hat für diesen Monat eine Grenze von ${DE.eur(teilDeckel)}. Ein voller Kalendermonat zählt immer mit 30 Tagen, auch im Februar oder in Monaten mit 31 Tagen.` },
      { q: 'Gilt die Höchstbeitragsgrundlage auch für die Abfertigung neu?', a: `Nein. Der Beitrag zur Betrieblichen Vorsorge von ${DE.pct(S.dg.mv, 2)}, den der Arbeitgeber an die BV-Kasse zahlt, ist laut ÖGK auch über der Höchstbeitragsgrundlage zu entrichten. Bei ${DE.eur(10000)} brutto wird er also vom vollen Gehalt berechnet, während Kranken-, Pensions- und Arbeitslosenversicherung bei ${DE.eur(HBG)} enden. Der Rucksack wächst bei hohen Gehältern daher weiter mit.` },
      { q: 'Was passiert mit der Höchstbeitragsgrundlage bei zwei gleichzeitigen Jobs?', a: `Jeder Arbeitgeber deckelt nur seinen eigenen Bezug. Liegt die Summe aller Beitragsgrundlagen eines Jahres samt Sonderzahlungen über der Summe der monatlichen Höchstbeitragsgrundlagen, erstattet die Pensionsversicherung nach § 70 ASVG ${DE.pct(S.pv_erstattung_quote)} der aufgewerteten Beiträge auf den Überschreitungsbetrag. Als Monatsgrenze gilt dabei das 35-Fache des Tageswerts, ${DE.eur(mehrfachMonat)}. Die Erstattung betrifft nur die Pensionsversicherung.` },
    ],
    body: (h) => `
<h2>Die Grenzen 2026 auf einen Blick</h2>
${h.table(['Grenze', 'Betrag 2026'], [
  ['pro Kalendertag', h.eur(h.P.sv.hbg_tag, 2)],
  ['pro Monat (laufender Bezug)', h.eur(h.P.sv.hbg_monat, 2)],
  ['Sonderzahlungen pro Kalenderjahr', h.eur(h.P.sv.hbg_sz_jahr, 2)],
  ['freie Dienstnehmer ohne Sonderzahlungen, pro Monat', h.eur(h.P.sv.hbg_freie_dn_monat, 2)],
  ['Aufwertungszahl 2026', h.num(h.P.sv.aufwertungszahl, 3)],
], 'Werte laut ÖGK, veränderliche Werte 2026', ['l', 'r'])}
<p>Die Höchstbeitragsgrundlage ist im ${h.src('oegkHbg', 'Beitragsrecht der ÖGK')} eine Tagesgrenze: Die durchschnittliche Beitragsgrundlage pro Kalendertag darf ${h.eur(h.P.sv.hbg_tag)} nicht übersteigen. Für einen ganzen Kalendermonat mit voller Versicherung werden immer 30 Tage angesetzt, daraus ergeben sich die ${h.eur(h.P.sv.hbg_monat)}. Die Sonderzahlungen haben einen eigenen Topf, der pro Kalenderjahr gilt und nicht mit den Monaten verrechnet wird. Jedes Jahr werden die Werte mit der Aufwertungszahl angepasst, die per Verordnung kundgemacht wird; für 2026 beträgt sie ${h.num(h.P.sv.aufwertungszahl, 3)} (${h.src('oegkWerte', 'ÖGK, veränderliche Werte 2026')}).</p>

<h2>Ab wann die Sozialversicherung nicht mehr steigt</h2>
<p>Bis ${h.eur(h.P.sv.hbg_monat)} brutto wächst der Dienstnehmerbeitrag mit jedem Euro um ${h.pct(maxSv.satz, 2)}: Kranken-, Pensions- und Arbeitslosenversicherung, Arbeiterkammerumlage und Wohnbauförderungsbeitrag (${h.src('wkoBeitraege', 'WKO, Beitragssätze 2026')}). Genau an der Grenze ist das Maximum erreicht.</p>
${h.table(['Teil', 'Satz', 'Höchstbetrag pro Monat'], [
  ['Krankenversicherung', h.pct(h.P.sv.dn.kv, 2), h.eur(maxSv.kv, 2)],
  ['Pensionsversicherung', h.pct(h.P.sv.dn.pv, 2), h.eur(maxSv.pv, 2)],
  ['Arbeitslosenversicherung', h.pct(h.P.sv.dn.av, 2), h.eur(maxSv.av, 2)],
  ['Arbeiterkammerumlage', h.pct(h.P.sv.dn.ak, 2), h.eur(maxSv.ak, 2)],
  ['Wohnbauförderung (außer Wien)', h.pct(h.P.sv.dn.wf, 2), h.eur(maxSv.wf, 2)],
  ['<strong>Summe</strong>', h.pct(maxSv.satz, 2), `<strong>${h.eur(maxSv.summe, 2)}</strong>`],
], `Dienstnehmeranteil bei ${h.eur(h.P.sv.hbg_monat)} brutto und darüber`, ['l', 'r', 'r'])}
<p>In Wien beträgt der Wohnbauförderungsbeitrag seit 2026 ${h.pct(h.P.sv.dn.wf_wien, 2)}, das Maximum liegt deshalb bei ${h.eur(maxSvWien.summe, 2)}. Von den Sonderzahlungen werden weder Arbeiterkammerumlage noch Wohnbauförderung abgezogen; auf Urlaubszuschuss und Weihnachtsremuneration zusammen fallen höchstens ${h.eur(maxSvSz, 2)} an. Damit ergibt sich eine feste Obergrenze für das ganze Jahr: ${h.eur(maxSvJahr, 2)} Dienstnehmerbeitrag, ganz gleich, ob jemand ${h.eur(h.P.sv.hbg_monat * 14)} oder das Doppelte verdient.</p>

<h2>Was der Deckel mit dem Netto macht</h2>
<p>Über der Grenze sinkt der Anteil der Sozialversicherung am Brutto mit jedem Euro. Die Lohnsteuer wird aber aus Brutto minus Sozialversicherung berechnet: Weil die Sozialversicherung gleich bleibt, wächst die Steuerbasis über der Grenze Euro für Euro mit.</p>
${h.table(['Brutto pro Monat', 'SV Dienstnehmer', 'Anteil am Brutto', 'Lohnsteuer', 'Netto'], beispiele.map(({ b, k, sv }) => [h.eur(b), h.eur(sv.summe, 2), h.pct(sv.summe / b, 1), h.eur(k.lstMonat, 2), h.eur(k.nettoMonat, 2)]), 'Laufender Monat 2026, außerhalb Wiens, ohne Absetzbeträge für Kinder oder Pendeln', ['r', 'r', 'r', 'r', 'r'])}
<p>Für eine Gehaltsverhandlung in diesem Bereich zählt die Grenzbelastung. Knapp unter ${h.eur(h.P.sv.hbg_monat)} bleiben von ${h.eur(100)} zusätzlichem Brutto ${h.eur(mUnter * 100, 2)}. Knapp darüber sind es ${h.eur(mUeber * 100, 2)}, weil nur noch die 40-Prozent-Stufe der Lohnsteuer greift. Ab ${h.eur(b48)} brutto beginnt die 48-Prozent-Stufe, von ${h.eur(100)} mehr kommen dann ${h.eur(mHoch * 100, 2)} an. Die Seiten zu ${h.a('netto-7000', '7.000 Euro brutto')} und ${h.a('netto-10000', '10.000 Euro brutto')} zeigen diese Gehälter im Detail.</p>
<!--mini:svBeitrag-->

<h2>Die Sonderzahlungen und ihr eigener Jahresdeckel</h2>
<p>Für Sonderzahlungen gilt die Grenze von ${h.eur(h.P.sv.hbg_sz_jahr)} pro Kalenderjahr, unabhängig von den Monaten. Wer ${h.eur(9000)} im Monat verdient, bekommt einen Urlaubszuschuss von ${h.eur(9000)}: Davon sind ${h.eur(h.P.sv.hbg_sz_jahr - h.P.sv.hbg_monat)} über der halben Jahresgrenze, aber trotzdem beitragspflichtig, weil der Topf von ${h.eur(h.P.sv.hbg_sz_jahr)} noch nicht ausgeschöpft ist. Bei der Weihnachtsremuneration bleiben dann nur noch ${h.eur(h.P.sv.hbg_sz_jahr - 9000)} beitragspflichtig, der Rest ist frei. Die Reihenfolge entscheidet also, welche Zahlung mehr Sozialversicherung kostet, die Summe ändert sich nicht.</p>
<p>Die ÖGK rechnet auch mehrere Dienstverhältnisse beim selben Arbeitgeber im selben Jahr zusammen: Was aus einem früheren Dienstverhältnis schon an Sonderzahlungen verbeitragt wurde, wird vom Jahresdeckel abgezogen. Rechnen Sie den Verlauf beider Zahlungen im ${h.a('sonderzahlungen', 'Urlaubsgeld- und Weihnachtsgeld-Rechner')} nach.</p>

<h2>Teilmonate, freie Dienstnehmer und Betriebliche Vorsorge</h2>
<ul>
<li><strong>Eintritt oder Austritt im Monat:</strong> Pro versichertem Tag wird ein Dreißigstel der Monatsgrenze angesetzt. Bei ${teilTage} Tagen sind es ${h.eur(teilDeckel)}.</li>
<li><strong>Freie Dienstnehmer:</strong> Ohne Sonderzahlungen gilt ${h.eur(h.P.sv.hbg_freie_dn_monat)} im Monat. Wer als freier Dienstnehmer Sonderzahlungen bekommt, hat dieselben Grenzen wie ein Angestellter.</li>
<li><strong>Abfertigung neu:</strong> Der Beitrag von ${h.pct(h.P.sv.dg.mv, 2)} an die BV-Kasse wird auch über der Grenze vom ganzen Entgelt bezahlt (${h.src('oegkHbg', 'ÖGK, Höchstbeitragsgrundlagen')}).</li>
</ul>

<h2>Der Arbeitgeber spart mit</h2>
<p>Auch der Dienstgeberanteil der Sozialversicherung von ${h.pct(dgSatz, 2)} endet bei ${h.eur(h.P.sv.hbg_monat)}. Dienstgeberbeitrag zum Familienlastenausgleichsfonds, Zuschlag und Kommunalsteuer werden dagegen vom vollen Bruttobezug berechnet. Was ein Gehalt über der Grenze den Betrieb insgesamt kostet, zeigt der ${h.a('dienstgeberkosten', 'Dienstgeberkosten-Rechner')}.</p>

<h2>Zwei Jobs zugleich: Erstattung aus der Pensionsversicherung</h2>
<p>Jeder Arbeitgeber wendet die Grenze nur auf das Entgelt an, das er selbst bezahlt. Wer gleichzeitig zwei gut bezahlte Dienstverhältnisse hat, kann deshalb insgesamt über der Grenze verbeitragt werden. Für die Pensionsversicherung sieht ${h.src('asvg70', '§ 70 ASVG')} einen Ausgleich vor: Übersteigt die Summe aller Beitragsgrundlagen eines Jahres, Sonderzahlungen eingeschlossen, die Summe der monatlichen Höchstbeitragsgrundlagen, werden ${h.pct(h.P.sv.pv_erstattung_quote, 0)} der aufgewerteten Beiträge auf den Überschreitungsbetrag erstattet. Als monatliche Grenze gilt dafür das 35-Fache des Tageswerts, also ${h.eur(mehrfachMonat)}. Bei einem einzigen ganzjährigen Dienstverhältnis mit zwei Sonderzahlungen kommen höchstens ${h.eur(jahresBasis)} Beitragsgrundlage zusammen, genau zwölf dieser Monatsgrenzen. Die Erstattung erfolgt laut Gesetz bis zum 30. Juni des Folgejahres nach der vollständigen Entrichtung. Für Kranken- und Arbeitslosenversicherung enthält § 70 ASVG keine solche Regel.</p>
`,
  },
  en: {
    slug: 'contribution-ceiling',
    nav: 'Contribution ceiling',
    card: `Above ${EN.eur(HBG)} gross a month, Austrian social insurance stops growing: what the cap is worth per month and per year.`,
    title: `Contribution Ceiling Austria 2026: ${EN.eur(HBG)} and What It Caps`,
    description: `Austria's social insurance ceiling 2026 (Höchstbeitragsgrundlage): ${EN.eur(HBG)} a month, ${EN.eur(S.hbg_tag)} a day, ${EN.eur(S.hbg_sz_jahr)} for bonuses. See where your contributions stop.`,
    h1: 'The contribution ceiling: where Austrian social insurance stops',
    intro: 'For higher earners in Austria: the monthly amount above which no further social insurance is charged, and what that does to your take-home pay.',
    resume: `In 2026 the Austrian contribution ceiling (Höchstbeitragsgrundlage) is ${EN.eur(HBG)} gross per month, or ${EN.eur(S.hbg_tag)} per calendar day, plus a separate annual cap of ${EN.eur(S.hbg_sz_jahr)} for the two special payments, holiday pay and Christmas pay. Anything you earn above it is free of social insurance. The employee share therefore peaks at ${EN.eur(maxSv.summe, 2)} a month, which is ${EN.pct(maxSv.satz, 2)} of ${EN.eur(HBG)}; in Vienna, where the housing contribution is higher, the peak is ${EN.eur(maxSvWien.summe, 2)}. The special payments together never cost more than ${EN.eur(maxSvSz, 2)}, so a full year tops out at ${EN.eur(maxSvJahr, 2)}. On a salary of ${EN.eur(8000)} this brings the effective rate down to ${EN.pct(b8.sv.summe / 8000, 1)}. Freelance employees (freie Dienstnehmer) without special payments have a higher monthly cap of ${EN.eur(S.hbg_freie_dn_monat)}. The figures are re-indexed every year with an official revaluation factor, ${EN.num(S.aufwertungszahl, 3)} for 2026. Wage tax has no such ceiling and keeps rising with the scale.`,
    faqs: [
      { q: 'At what salary does the Austrian contribution ceiling start to apply?', a: `From a regular monthly salary of ${EN.eur(HBG)}. Up to that point each euro costs ${EN.pct(maxSv.satz, 2)} in employee contributions; above it, nothing. With the usual 14 equal payments that is ${EN.eur(HBG * 14)} a year. The holiday and Christmas pay have their own annual cap of ${EN.eur(S.hbg_sz_jahr)}, exactly two monthly ceilings. The figures come from the 2026 values published by ÖGK, the health insurer that collects contributions.` },
      { q: 'How much of a raise above the contribution ceiling do I actually keep?', a: `Above ${EN.eur(HBG)} only wage tax is deducted. Around ${EN.eur(7000)} gross your marginal tax rate is 40 percent, so an extra ${EN.eur(100)} leaves ${EN.eur(mUeber * 100, 2)}; just below the ceiling it was ${EN.eur(mUnter * 100, 2)}. From ${EN.eur(b48)} gross the 48 percent band applies and you keep ${EN.eur(mHoch * 100, 2)} of every ${EN.eur(100)}. Raises in this range are therefore worth more than the same raise slightly below the cap.` },
      { q: 'How is the contribution ceiling applied if I start mid-month?', a: `By the day. ÖGK uses one thirtieth of the monthly ceiling for every insured day, which is ${EN.eur(S.hbg_tag)}. If you start on the 16th and are insured for ${teilTage} days, your cap for that month is ${EN.eur(teilDeckel)}. A full calendar month always counts as 30 days, whether it is February or a 31-day month. Your first payslip may therefore show a lower cap than later ones.` },
      { q: 'Does the contribution ceiling also limit the severance fund payments?', a: `No. The ${EN.pct(S.dg.mv, 2)} that your employer pays into your severance fund (BV-Kasse, the "Abfertigung neu" scheme) is due on your full pay, even above the ceiling, according to ÖGK. On ${EN.eur(10000)} gross it is worked out on the whole salary, while health, pension and unemployment insurance stop at ${EN.eur(HBG)}. Your severance pot keeps growing with your salary.` },
      { q: 'What happens to the contribution ceiling if I hold two jobs at once?', a: `Each employer only caps its own pay. If the total of all your contribution bases in a year, special payments included, exceeds the sum of the monthly ceilings, the pension insurer refunds ${EN.pct(S.pv_erstattung_quote)} of the revalued contributions on the excess under section 70 of the General Social Insurance Act. For this refund the monthly ceiling is 35 times the daily figure, ${EN.eur(mehrfachMonat)}. Only pension contributions are refunded.` },
    ],
    body: (h) => `
<h2>The 2026 ceilings at a glance</h2>
${h.table(['Ceiling', 'Amount 2026'], [
  ['per calendar day', h.eur(h.P.sv.hbg_tag, 2)],
  ['per month (regular pay)', h.eur(h.P.sv.hbg_monat, 2)],
  ['special payments per calendar year', h.eur(h.P.sv.hbg_sz_jahr, 2)],
  ['freelance employees without special payments, per month', h.eur(h.P.sv.hbg_freie_dn_monat, 2)],
  ['revaluation factor 2026', h.num(h.P.sv.aufwertungszahl, 3)],
], 'Source: ÖGK, variable values 2026', ['l', 'r'])}
<p>Legally the ceiling is a daily limit: according to ${h.src('oegkHbg', 'ÖGK contribution rules')}, your average contribution base per calendar day may not exceed ${h.eur(h.P.sv.hbg_tag)}. A full insured month always counts as 30 days, which gives the ${h.eur(h.P.sv.hbg_monat)}. Special payments, the 13th and 14th salary that most Austrian employees receive as holiday pay (Urlaubszuschuss) and Christmas pay (Weihnachtsremuneration), have a separate annual pot. The amounts are raised each year by the revaluation factor (Aufwertungszahl), ${h.num(h.P.sv.aufwertungszahl, 3)} for 2026 (${h.src('oegkWerte', 'ÖGK, variable values 2026')}).</p>

<h2>Where your contributions stop growing</h2>
<p>Up to ${h.eur(h.P.sv.hbg_monat)} gross, every extra euro adds ${h.pct(maxSv.satz, 2)} to your employee contribution, made up of health, pension and unemployment insurance plus the Chamber of Labour levy and the housing contribution (${h.src('wkoBeitraege', 'Chamber of Commerce rates 2026')}). At the ceiling each part reaches its maximum.</p>
${h.table(['Component', 'Rate', 'Maximum per month'], [
  ['Health insurance', h.pct(h.P.sv.dn.kv, 2), h.eur(maxSv.kv, 2)],
  ['Pension insurance', h.pct(h.P.sv.dn.pv, 2), h.eur(maxSv.pv, 2)],
  ['Unemployment insurance', h.pct(h.P.sv.dn.av, 2), h.eur(maxSv.av, 2)],
  ['Chamber of Labour levy', h.pct(h.P.sv.dn.ak, 2), h.eur(maxSv.ak, 2)],
  ['Housing contribution (outside Vienna)', h.pct(h.P.sv.dn.wf, 2), h.eur(maxSv.wf, 2)],
  ['<strong>Total</strong>', h.pct(maxSv.satz, 2), `<strong>${h.eur(maxSv.summe, 2)}</strong>`],
], `Employee share at ${h.eur(h.P.sv.hbg_monat)} gross and above`, ['l', 'r', 'r'])}
<p>If you work in Vienna, the housing contribution is ${h.pct(h.P.sv.dn.wf_wien, 2)} from 2026, so your maximum is ${h.eur(maxSvWien.summe, 2)}. Special payments carry neither the Chamber levy nor the housing contribution, and both together cost at most ${h.eur(maxSvSz, 2)}. That gives a hard annual limit of ${h.eur(maxSvJahr, 2)} in employee contributions, whether you earn ${h.eur(h.P.sv.hbg_monat * 14)} a year or twice that.</p>

<h2>What the cap does to your net pay</h2>
<p>Above the ceiling, social insurance shrinks as a share of your gross. Wage tax, however, is charged on gross minus social insurance; since the contribution stays flat, your taxable pay now grows one-for-one with your salary.</p>
${h.table(['Gross per month', 'Employee SI', 'Share of gross', 'Wage tax', 'Net'], beispiele.map(({ b, k, sv }) => [h.eur(b), h.eur(sv.summe, 2), h.pct(sv.summe / b, 1), h.eur(k.lstMonat, 2), h.eur(k.nettoMonat, 2)]), 'Regular month in 2026, outside Vienna, no child or commuter credits', ['r', 'r', 'r', 'r', 'r'])}
<p>When negotiating pay at this level, look at the marginal rate. Just below ${h.eur(h.P.sv.hbg_monat)} an extra ${h.eur(100)} gross leaves ${h.eur(mUnter * 100, 2)}. Just above it you keep ${h.eur(mUeber * 100, 2)}, because only the 40 percent tax band applies. From ${h.eur(b48)} gross the 48 percent band starts and you keep ${h.eur(mHoch * 100, 2)}. Detailed breakdowns are on the pages for ${h.a('netto-7000', '€7,000 gross')} and ${h.a('netto-10000', '€10,000 gross')}.</p>
<!--mini:svBeitrag-->

<h2>Holiday and Christmas pay have their own cap</h2>
<p>The ${h.eur(h.P.sv.hbg_sz_jahr)} limit for special payments runs per calendar year, not per payment. Say you earn ${h.eur(9000)} a month and receive ${h.eur(9000)} holiday pay in June: the whole amount is subject to contributions, because the annual pot is not yet used up. In November only ${h.eur(h.P.sv.hbg_sz_jahr - 9000)} of your Christmas pay is charged and the rest is free. The order decides which payment costs more; the annual total is the same.</p>
<p>ÖGK also adds up several employment contracts with the same employer in the same year, so special payments already charged under an earlier contract reduce the remaining pot. You can model both payments month by month in the ${h.a('sonderzahlungen', 'holiday and Christmas pay calculator')}.</p>

<h2>Part months, freelancers and the severance fund</h2>
<ul>
<li><strong>Starting or leaving mid-month:</strong> each insured day counts as one thirtieth of the monthly ceiling, so ${teilTage} days give a cap of ${h.eur(teilDeckel)}.</li>
<li><strong>Freelance employees</strong> (freie Dienstnehmer, a contract type between employee and self-employed): without special payments the cap is ${h.eur(h.P.sv.hbg_freie_dn_monat)} a month; with them, the employee figures apply.</li>
<li><strong>Severance fund:</strong> the employer's ${h.pct(h.P.sv.dg.mv, 2)} contribution is paid on your full pay, above the ceiling too (${h.src('oegkHbg', 'ÖGK')}).</li>
</ul>

<h2>Your employer saves as well</h2>
<p>The employer's own social insurance share of ${h.pct(dgSatz, 2)} also stops at ${h.eur(h.P.sv.hbg_monat)}. Payroll taxes such as the family fund contribution, its surcharge and the municipal tax are still charged on the full salary. The ${h.a('dienstgeberkosten', 'employer cost calculator')} shows the total cost of a salary above the cap.</p>

<h2>Two jobs at once: a pension refund</h2>
<p>Each employer applies the ceiling only to what it pays you. With two well-paid jobs at the same time you can end up paying contributions on more than the ceiling overall. For pension insurance, ${h.src('asvg70', 'section 70 of the General Social Insurance Act (ASVG)')} provides a refund: if the sum of all your contribution bases in a year, special payments included, exceeds the sum of the monthly ceilings, ${h.pct(h.P.sv.pv_erstattung_quote, 0)} of the revalued contributions on the excess are paid back. For this purpose the monthly ceiling is 35 times the daily figure, ${h.eur(mehrfachMonat)}. A single full-year job with two special payments reaches at most ${h.eur(jahresBasis)}, exactly twelve of these monthly limits. By law the refund is made by 30 June of the year after the contributions were fully paid. Section 70 covers pension insurance only, not health or unemployment insurance.</p>
`,
  },
});
