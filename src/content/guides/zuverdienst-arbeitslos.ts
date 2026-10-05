import { defineGuide } from '../../lib/guide-types';
import { arbeitslosengeld } from '../../lib/engine/leistungen';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

/** Zuverdienst neben Arbeitslosengeld und Notstandshilfe 2026: Grenzen aus params, Beispiel aus dem Motor. */
const A = P.alg;
const G = P.sv.geringfuegigkeit;
const alg = arbeitslosengeld(3000);
/** Vorübergehende Beschäftigung (unter 4 Wochen) im April: Netto über der Grenze zu 90 % angerechnet, je Kalendertag abgezogen. */
const TAGE = 30, ARBEIT = 21, FREI = TAGE - ARBEIT;
const anrechnung = (netto: number) => r2((Math.max(0, netto - G) * A.voruebergehend_anrechnung_quote) / TAGE);
const kurz1 = { netto: 1200, tag: anrechnung(1200) };
const rest1 = r2(Math.max(0, alg.tagsatz - kurz1.tag));
const kurz2 = { netto: 2500, tag: anrechnung(2500) };
const wegfall2 = kurz2.tag > alg.tagsatz;
/** Ohne Job: ganzer Monat Arbeitslosengeld. */
const ohneJob = r2(alg.tagsatz * TAGE);
const mitJob1 = r2(rest1 * FREI + kurz1.netto);

export default defineGuide({
  id: 'zuverdienst-arbeitslos',
  group: 'leistungen',
  order: 30,
  mini: 'zuverdienst',
  miniHref: 'arbeitslosengeld',
  related: ['arbeitslosengeld', 'geringfuegig', 'notstandshilfe', 'arbeitslosengeld-dauer', 'stundenlohn'],
  sources: ['akAlv', 'alvg12', 'amsWerte', 'oegkWerte'],
  de: {
    slug: 'zuverdienst-arbeitslosengeld',
    nav: 'Zuverdienst und Arbeitslosengeld',
    card: `Seit 2026 ist der geringfügige Job neben dem AMS-Bezug grundsätzlich verboten: die fünf Ausnahmen und die Grenze von ${DE.eur(G, 2)}.`,
    title: 'Zuverdienst Arbeitslosengeld 2026: neues Verbot, 5 Ausnahmen',
    description: `Zuverdienst zum Arbeitslosengeld 2026: seit Jänner ist auch ein Minijob bis ${DE.eur(G, 2)} grundsätzlich verboten. Die fünf Ausnahmen und die Meldepflicht beim AMS.`,
    h1: 'Dazuverdienen beim Arbeitslosengeld: was seit 2026 gilt',
    intro: 'Der Minijob neben dem Arbeitslosengeld war bis Ende 2025 erlaubt. Seit 1. Jänner 2026 ist er die Ausnahme. Wer sie nutzen darf und was ein kurzer Job kostet.',
    resume: `Seit 1. Jänner 2026 ist neben Arbeitslosengeld und Notstandshilfe grundsätzlich auch ein geringfügiger Zuverdienst nicht mehr erlaubt: Wer einer selbständigen oder unselbständigen Beschäftigung nachgeht, gilt nicht als arbeitslos. Bis dahin durften Arbeitslose bis zur Geringfügigkeitsgrenze, 2026 ${DE.eur(G, 2)} im Monat, dazuverdienen. Fünf Ausnahmen stehen in § 12 Abs. 2 AlVG: ein Minijob, der schon ${A.zv_vorher_wochen} Wochen ununterbrochen neben der vollversicherten Arbeit lief; ein einmaliger Minijob für höchstens ${A.zv_einmalig_wochen} Wochen nach ${A.zv_nach_bezug_tage} Tagen Bezug; ein unbefristeter Minijob nach ${A.zv_nach_bezug_tage} Tagen Bezug ab ${A.zv_unbegrenzt_ab_alter} Jahren oder mit Behinderung; ${A.zv_krankengeld_zuverdienst_wochen} Wochen nach mindestens ${A.zv_krankengeld_wochen} Wochen Krankheit; und ein Minijob während einer AMS-Umschulung von mindestens ${A.zv_massnahme_monate} Monaten mit ${A.zv_massnahme_wochenstunden} Wochenstunden. Wer mehr als ${DE.eur(G, 2)} verdient, ist in dieser Zeit nicht arbeitslos. Ein kurzer Job unter ${A.voruebergehend_wochen} Wochen wird angerechnet: ${DE.pct(A.voruebergehend_anrechnung_quote)} des Nettos über der Grenze, verteilt auf die Kalendertage. Jede Beschäftigung ist dem AMS sofort zu melden.`,
    faqs: [
      { q: 'Darf ich 2026 neben dem Arbeitslosengeld geringfügig dazuverdienen?', a: `Nur in einer der fünf Ausnahmen des § 12 Abs. 2 AlVG. Die häufigste: Sie hatten den Minijob schon mindestens ${A.zv_vorher_wochen} Wochen ununterbrochen neben Ihrer vollversicherten Stelle und führen ihn weiter. Sonst ist ein Zuverdienst bis ${DE.eur(G, 2)} erst nach ${A.zv_nach_bezug_tage} Tagen Bezug möglich, einmalig für ${A.zv_einmalig_wochen} Wochen oder ab ${A.zv_unbegrenzt_ab_alter} Jahren unbefristet. Ohne Ausnahme gelten Sie mit dem Job nicht als arbeitslos.` },
      { q: 'Was passiert, wenn mein Zuverdienst neben dem Arbeitslosengeld über der Geringfügigkeitsgrenze liegt?', a: `Dann sind Sie für die Dauer dieser Beschäftigung nicht arbeitslos und bekommen kein Arbeitslosengeld, auch nicht anteilig. Die Grenze beträgt 2026 ${DE.eur(G, 2)} brutto im Monat aus unselbständiger Arbeit; Selbständige gelten bis ${DE.eur(G, 2)} im Monat oder ${DE.eur(A.zv_selbststaendig_jahr, 2)} im Jahr als geringfügig. Bei einem Job unter ${A.voruebergehend_wochen} Wochen kürzt das AMS stattdessen nach der Anrechnungsregel für vorübergehende Beschäftigung.` },
      { q: 'Darf ich meinen bisherigen Minijob neben dem Arbeitslosengeld behalten?', a: `Ja, wenn Sie ihn bereits mindestens ${A.zv_vorher_wochen} Wochen ununterbrochen neben der vollversicherten Hauptbeschäftigung ausgeübt haben (§ 12 Abs. 2 Z 1 AlVG). Wer den Minijob erst kurz vor dem Jobverlust angenommen hat, erfüllt das nicht. Das Entgelt muss weiter unter ${DE.eur(G, 2)} im Monat bleiben. Geben Sie den Job im Antrag an, damit das AMS die Ausnahme prüfen kann.` },
      { q: 'Wie wird ein kurzer Job unter vier Wochen auf das Arbeitslosengeld angerechnet?', a: `Vom Nettoeinkommen wird die Geringfügigkeitsgrenze von ${DE.eur(G, 2)} abgezogen, ${DE.pct(A.voruebergehend_anrechnung_quote)} des Rests durch die Kalendertage des Monats geteilt und vom Tagsatz abgezogen. Das gekürzte Arbeitslosengeld gibt es für die Tage ohne Arbeit. Bei ${DE.eur(kurz1.netto)} netto im April sind das ${DE.eur(kurz1.tag, 2)} pro Tag. Übersteigt der Anrechnungsbetrag das Arbeitslosengeld, entfällt es für den ganzen Monat.` },
      { q: 'Muss ich dem AMS einen Zuverdienst neben dem Arbeitslosengeld melden?', a: `Ja, und zwar unverzüglich, jede Beschäftigung, auch eine geringfügige. Wer bei einer nicht gemeldeten Tätigkeit angetroffen wird, bei dem nimmt das AMS unwiderlegbar ein Einkommen über ${DE.eur(G, 2)} an: Für diese Zeit gilt er nicht als arbeitslos, und die Leistung ist für mindestens ${A.pfusch_rueckzahlung_min_wochen} Wochen zurückzuzahlen. Dazu kommen Verwaltungsstrafen der Bezirkshauptmannschaft.` },
      { q: 'Darf ich mit Gewerbeschein neben dem Arbeitslosengeld etwas verdienen?', a: `Nein. Wer als Selbständiger in der Pensionsversicherung pflichtversichert ist, etwa mit aufrechtem Gewerbeschein, gilt laut AK jedenfalls nicht als arbeitslos, auch bei geringem Gewinn. Arbeitslos ist nach § 12 Abs. 1 AlVG nur, wer nicht mehr in der Pensionsversicherung pflichtversichert ist. Für Landwirte gilt eine eigene Grenze: Bei einem Einheitswert über ${DE.eur(A.landwirtschaft_einheitswert_max)} besteht keine Arbeitslosigkeit.` },
    ],
    body: (h) => `
<h2>Was sich am 1. Jänner 2026 geändert hat</h2>
<p>Bis Ende 2025 war der geringfügige Job ein fester Teil der Arbeitslosigkeit in Österreich: Wer bis zur Geringfügigkeitsgrenze verdiente, bekam das volle Arbeitslosengeld weiter. Seit 2026 gilt laut ${h.src('akAlv', 'AK-Broschüre Arbeitslosenversicherung')}: Wer einer selbständigen oder unselbständigen Beschäftigung nachgeht, ist nicht arbeitslos, und damit ist auch ein geringfügiger Zuverdienst grundsätzlich unzulässig. Für die ${h.a('notstandshilfe', 'Notstandshilfe')} gilt dasselbe. Die Ausnahmen stehen abschließend in ${h.src('alvg12', '§ 12 Abs. 2 AlVG')}.</p>
<p>Die Grenze selbst ist gleich geblieben: ${h.eur(G, 2)} brutto im Monat (${h.src('oegkWerte', 'ÖGK, veränderliche Werte 2026')}; das ${h.src('amsWerte', 'AMS')} nennt denselben Betrag). Ein Einkommen bis zu diesem Betrag unterliegt laut AK nicht der Sozialversicherung und gilt als geringfügig. Was ein solcher Job netto bringt, zeigt die Seite zur ${h.a('geringfuegig', 'geringfügigen Beschäftigung')}.</p>
<h2>Die fünf Ausnahmen</h2>
${h.table(['Fall', 'Bedingung', 'wie lange'], [
  ['Minijob von vorher', `mindestens ${h.num(A.zv_vorher_wochen)} Wochen ununterbrochen neben der vollversicherten Arbeit`, 'unbefristet'],
  ['Nach einem Jahr Bezug', `${h.num(A.zv_nach_bezug_tage)} Tage Arbeitslosengeld oder Notstandshilfe, Unterbrechungen bis ${h.num(A.zv_unterbrechung_max_tage)} Tage zählen nicht`, `einmalig höchstens ${h.num(A.zv_einmalig_wochen)} Wochen`],
  [`Ab ${h.num(A.zv_unbegrenzt_ab_alter)} oder mit Behinderung`, `${h.num(A.zv_nach_bezug_tage)} Tage Bezug, dazu vollendetes ${h.num(A.zv_unbegrenzt_ab_alter)}. Lebensjahr, begünstigte Behinderung nach § 2 BEinstG oder Behindertenpass`, 'unbefristet'],
  ['Nach langer Krankheit', `mindestens ${h.num(A.zv_krankengeld_wochen)} Wochen Kranken-, Rehabilitations- oder Umschulungsgeld`, `höchstens ${h.num(A.zv_krankengeld_zuverdienst_wochen)} Wochen`],
  ['Während einer Umschulung', `AMS-Maßnahme von mindestens ${h.num(A.zv_massnahme_monate)} Monaten und ${h.num(A.zv_massnahme_wochenstunden)} Wochenstunden`, 'für die Dauer der Maßnahme'],
], 'Erlaubter geringfügiger Zuverdienst nach § 12 Abs. 2 AlVG, Stand 2026', ['l', 'l', 'l'])}
<p>Die erste Ausnahme verlangt, dass der Minijob <em>neben</em> einer vollversicherten Beschäftigung lief. Wer vor dem Jobverlust nur geringfügig gearbeitet hat oder den Nebenjob erst in der Kündigungsfrist begonnen hat, kann sich darauf nicht berufen. Die zweite Ausnahme gibt es pro Person einmal, danach ist sie verbraucht.</p>
<!--mini:alg-->
<h2>Über der Grenze: kein Arbeitslosengeld</h2>
<p>Ein Einkommen über ${h.eur(G, 2)} beendet die Arbeitslosigkeit für die Zeit der Beschäftigung. Es wird nicht anteilig gekürzt, sondern es gibt in dieser Zeit gar nichts. Bei Selbständigen ist die Grenze ${h.eur(G, 2)} im Monat oder ${h.eur(A.zv_selbststaendig_jahr, 2)} im Jahr. Wer in der Pensionsversicherung als Selbständiger pflichtversichert ist, etwa mit aktivem Gewerbeschein, ist in jedem Fall nicht arbeitslos, ebenso wer einen landwirtschaftlichen Betrieb mit einem Einheitswert über ${h.eur(A.landwirtschaft_einheitswert_max)} führt. Auch die Mitarbeit im Betrieb von Ehepartner, Eltern oder Kindern schließt Arbeitslosigkeit aus, wenn das Entgelt dafür über der Geringfügigkeitsgrenze läge.</p>
<h2>Kurze Jobs unter vier Wochen</h2>
<p>Für eine Beschäftigung, die für weniger als ${h.num(A.voruebergehend_wochen)} Wochen vereinbart ist, rechnet das AMS anders. Vom Nettoeinkommen wird die Geringfügigkeitsgrenze abgezogen, vom Rest werden ${h.pct(A.voruebergehend_anrechnung_quote)} durch die Kalendertage des Monats geteilt. Dieser Tagesbetrag wird vom Arbeitslosengeld abgezogen, und das gekürzte Arbeitslosengeld gibt es für die Tage, an denen Sie nicht gearbeitet haben.</p>
${h.table(['', `Job mit ${h.eur(kurz1.netto)} netto`, `Job mit ${h.eur(kurz2.netto)} netto`], [
  ['Arbeitslosengeld vorher je Tag', h.eur(alg.tagsatz, 2), h.eur(alg.tagsatz, 2)],
  [`Anrechnung je Tag (${h.pct(A.voruebergehend_anrechnung_quote)} über ${h.eur(G, 2)}, ÷ ${h.num(TAGE)})`, h.eur(kurz1.tag, 2), h.eur(kurz2.tag, 2)],
  ['Arbeitslosengeld je arbeitsfreiem Tag', h.eur(rest1, 2), wegfall2 ? 'entfällt für den ganzen Monat' : h.eur(alg.tagsatz - kurz2.tag, 2)],
], `Beispiel: früher ${h.eur(3000)} brutto, ${h.num(ARBEIT)} Arbeitstage im April (${h.num(TAGE)} Tage)`, ['l', 'r', 'r'])}
<p>Im ersten Fall kommen zum Lohn von ${h.eur(kurz1.netto)} noch ${h.num(FREI)} Tage gekürztes Arbeitslosengeld, zusammen ${h.eur(mitJob1)} statt ${h.eur(ohneJob)} ohne Job. Im zweiten Fall übersteigt die Anrechnung den Tagsatz, und das Arbeitslosengeld fällt für den gesamten Kalendermonat weg, obwohl der Job nur drei Wochen dauerte.</p>
<h2>Wann Selbständige und Landwirte als geringfügig gelten</h2>
<p>Für selbständige Arbeit prüft ${h.src('alvg12', '§ 12 Abs. 6 AlVG')} zwei Werte: das Einkommen samt den als Werbungskosten abgezogenen Sozialversicherungsbeiträgen und ${h.pct(A.selbststaendig_umsatz_quote, 1)} des Umsatzes. Keiner der beiden darf die Geringfügigkeitsgrenze übersteigen. Ein Honorar von ${h.eur(6000)} Umsatz im Monat ist damit schon zu viel, auch wenn nach Kosten kaum Gewinn bleibt. Bei Landwirten zählen ${h.pct(A.landwirtschaft_einheitswert_quote)} des Einheitswertes; die Grenze von ${h.eur(A.landwirtschaft_einheitswert_max)} ist genau der Einheitswert, bei dem diese ${h.pct(A.landwirtschaft_einheitswert_quote)} die monatliche Geringfügigkeitsgrenze erreichen. Auch für diese Gruppen gilt seit 2026: Geringfügig zu sein reicht nicht, es braucht zusätzlich eine der fünf Ausnahmen.</p>
<h2>Melden, bevor Sie anfangen</h2>
<p>Jede Aufnahme einer Beschäftigung ist dem AMS unverzüglich zu melden, auch ein geringfügiger Job in einer der Ausnahmen. Die Folgen einer Unterlassung sind hart: Wer bei einer nicht gemeldeten Arbeit angetroffen wird, bei dem gilt unwiderlegbar ein Verdienst über der Grenze. Die Leistung für diese Zeit wird zurückgefordert, mindestens für ${h.num(A.pfusch_rueckzahlung_min_wochen)} Wochen. Eine Ausbildung bis ${h.num(A.ausbildung_zulaessig_monate)} Monate im Jahr ist dagegen immer zulässig, und eine AMS-Schulung gilt ohnehin nicht als Beschäftigung (§ 12 Abs. 5 AlVG). Wie sich ein Zuverdienst neben dem Kinderbetreuungsgeld auswirkt, ist eine ganz andere Regel; dazu die Seite ${h.a('kbg-zuverdienst', 'Zuverdienst beim Kinderbetreuungsgeld')}.</p>
`,
  },
  en: {
    slug: 'side-job-unemployment-benefit',
    nav: 'Side jobs on unemployment benefit',
    card: `Since 2026 a mini-job alongside AMS benefit is banned in principle: the five exceptions and the ${EN.eur(G, 2)} limit.`,
    title: 'Side Job on Unemployment Benefit Austria 2026: New Rules',
    description: `Side job on unemployment benefit in Austria 2026: since January even a mini-job up to ${EN.eur(G, 2)} is banned in principle. Five exceptions and the duty to report.`,
    h1: 'Earning on the side while on unemployment benefit',
    intro: 'Until the end of 2025 a small job alongside Austrian unemployment benefit was allowed. Since 1 January 2026 it is the exception. Who still qualifies and what a short job costs.',
    resume: `Since 1 January 2026, even a marginal side job (geringfügige Beschäftigung, a mini-job below the social insurance threshold) is in principle no longer allowed alongside Austrian unemployment benefit or emergency assistance: anyone in employment or self-employment does not count as unemployed. Until 2025 you could earn up to the marginal-earnings limit, ${EN.eur(G, 2)} a month in 2026, and keep your full benefit. Section 12(2) of the Unemployment Insurance Act now lists five exceptions: a mini-job you already held for ${A.zv_vorher_wochen} uninterrupted weeks next to fully insured work; a one-off mini-job for up to ${A.zv_einmalig_wochen} weeks after ${A.zv_nach_bezug_tage} days on benefit; an open-ended mini-job after ${A.zv_nach_bezug_tage} days if you are ${A.zv_unbegrenzt_ab_alter} or older or have a recognised disability; up to ${A.zv_krankengeld_zuverdienst_wochen} weeks after at least ${A.zv_krankengeld_wochen} weeks of illness; and a mini-job during an AMS retraining course of at least ${A.zv_massnahme_monate} months and ${A.zv_massnahme_wochenstunden} hours a week. Earning more than ${EN.eur(G, 2)} means you are not unemployed for that period. A job agreed for less than ${A.voruebergehend_wochen} weeks is offset instead: ${EN.pct(A.voruebergehend_anrechnung_quote)} of net pay above the limit, spread over the calendar days. Every job must be reported to the AMS immediately.`,
    faqs: [
      { q: 'Can I still have a mini-job while claiming Austrian unemployment benefit in 2026?', a: `Only under one of the five exceptions in section 12(2) AlVG. The most common: you held the mini-job for at least ${A.zv_vorher_wochen} uninterrupted weeks alongside your fully insured job and simply keep it. Otherwise a side income up to ${EN.eur(G, 2)} is possible only after ${A.zv_nach_bezug_tage} days on benefit, once for ${A.zv_einmalig_wochen} weeks, or open-ended from age ${A.zv_unbegrenzt_ab_alter}. Without an exception, the job means you are not unemployed.` },
      { q: 'What happens if my side earnings exceed the marginal limit while unemployed?', a: `You are not considered unemployed while that job lasts and receive no unemployment benefit for that time, not even a reduced amount. The 2026 limit is ${EN.eur(G, 2)} gross a month for employees; self-employed people count as marginal up to ${EN.eur(G, 2)} a month or ${EN.eur(A.zv_selbststaendig_jahr, 2)} a year. For a job of less than ${A.voruebergehend_wochen} weeks, the AMS applies the offset rule for temporary work instead.` },
      { q: 'Can I keep the mini-job I had before losing my main job?', a: `Yes, if you held it without interruption for at least ${A.zv_vorher_wochen} weeks alongside your fully insured main job (section 12(2)(1) AlVG). A mini-job started shortly before you were laid off does not qualify. The pay must stay below ${EN.eur(G, 2)} a month. Declare the job on your benefit application so the AMS can confirm the exception applies.` },
      { q: 'How is a short temporary job offset against unemployment benefit?', a: `The AMS takes your net pay, subtracts the ${EN.eur(G, 2)} limit, divides ${EN.pct(A.voruebergehend_anrechnung_quote)} of the rest by the calendar days of the month and deducts that from your daily rate. The reduced benefit is paid for the days you did not work. ${EN.eur(kurz1.netto)} net in April means ${EN.eur(kurz1.tag, 2)} off per day. If the daily offset exceeds your benefit, you lose the whole month.` },
      { q: 'Do I have to tell the AMS about small side earnings?', a: `Yes, immediately and for every job, including a permitted mini-job. If you are caught working without having reported it, the AMS conclusively assumes you earned more than ${EN.eur(G, 2)}: you are treated as not unemployed for that time and must repay benefit for at least ${A.pfusch_rueckzahlung_min_wochen} weeks. Administrative fines from the district authority come on top.` },
      { q: 'Can I keep a trade licence while receiving unemployment benefit?', a: `Not an active one. Anyone compulsorily insured in the pension scheme as self-employed, for example with an active trade licence (Gewerbeschein), is never considered unemployed according to the Chamber of Labour, however small the profit. Under section 12(1) AlVG you are unemployed only once that compulsory pension insurance has ended. Farmers have their own limit: above an assessed farm value (Einheitswert) of ${EN.eur(A.landwirtschaft_einheitswert_max)} there is no unemployment.` },
    ],
    body: (h) => `
<h2>What changed on 1 January 2026</h2>
<p>Until the end of 2025 a mini-job was a normal part of being unemployed in Austria: you kept your full benefit as long as you stayed under the marginal-earnings limit. Since 2026, as the ${h.src('akAlv', 'Chamber of Labour guide to unemployment insurance')} puts it, anyone in employed or self-employed work is not unemployed, so even a marginal side income is generally not permitted. The same applies to ${h.a('notstandshilfe', 'emergency assistance (Notstandshilfe)')}. The exceptions are listed exhaustively in ${h.src('alvg12', 'section 12(2) of the Unemployment Insurance Act')}.</p>
<p>The limit itself has not moved: ${h.eur(G, 2)} gross a month (${h.src('oegkWerte', 'ÖGK health insurer, 2026 values')}; the ${h.src('amsWerte', 'AMS')} publishes the same figure). Pay up to that amount is not subject to social insurance contributions and counts as marginal, according to the Chamber of Labour. What such a job pays net is on the page about ${h.a('geringfuegig', 'marginal employment')}.</p>
<h2>The five exceptions</h2>
${h.table(['Case', 'condition', 'how long'], [
  ['Existing mini-job', `held for at least ${h.num(A.zv_vorher_wochen)} uninterrupted weeks next to fully insured work`, 'no limit'],
  ['After a year on benefit', `${h.num(A.zv_nach_bezug_tage)} days of unemployment benefit or Notstandshilfe, gaps up to ${h.num(A.zv_unterbrechung_max_tage)} days ignored`, `once, up to ${h.num(A.zv_einmalig_wochen)} weeks`],
  [`Age ${h.num(A.zv_unbegrenzt_ab_alter)}+ or disability`, `${h.num(A.zv_nach_bezug_tage)} days on benefit plus age ${h.num(A.zv_unbegrenzt_ab_alter)}, recognised disability (section 2 BEinstG) or a disability pass`, 'no limit'],
  ['After long illness', `at least ${h.num(A.zv_krankengeld_wochen)} weeks on sick pay, rehabilitation or retraining allowance`, `up to ${h.num(A.zv_krankengeld_zuverdienst_wochen)} weeks`],
  ['During retraining', `AMS course of at least ${h.num(A.zv_massnahme_monate)} months and ${h.num(A.zv_massnahme_wochenstunden)} hours a week`, 'while the course lasts'],
], 'Permitted marginal side income under section 12(2) AlVG, 2026', ['l', 'l', 'l'])}
<p>The first exception requires that the mini-job ran <em>alongside</em> a fully insured job. If you only ever had the mini-job, or started it during your notice period, it does not apply. The second exception can be used once per person.</p>
<!--mini:alg-->
<h2>Above the limit: no benefit at all</h2>
<p>Income above ${h.eur(G, 2)} ends your unemployment for the duration of the job. Benefit is not reduced pro rata; nothing is paid for that period. For self-employed work the limit is ${h.eur(G, 2)} a month or ${h.eur(A.zv_selbststaendig_jahr, 2)} a year. Anyone compulsorily pension-insured as self-employed, for instance with an active trade licence, is never unemployed, and neither is someone running a farm with an assessed value above ${h.eur(A.landwirtschaft_einheitswert_max)}. Helping out in a spouse’s, parent’s or child’s business also rules out unemployment if the work would be worth more than the marginal limit.</p>
<h2>Short jobs of less than four weeks</h2>
<p>A job agreed for less than ${h.num(A.voruebergehend_wochen)} weeks is handled differently. The AMS subtracts the marginal limit from your net pay, takes ${h.pct(A.voruebergehend_anrechnung_quote)} of the rest and divides it by the calendar days of the month. That daily amount comes off your benefit, and the reduced benefit is paid for the days on which you did not work.</p>
${h.table(['', `Job paying ${h.eur(kurz1.netto)} net`, `Job paying ${h.eur(kurz2.netto)} net`], [
  ['Daily benefit before', h.eur(alg.tagsatz, 2), h.eur(alg.tagsatz, 2)],
  [`Daily offset (${h.pct(A.voruebergehend_anrechnung_quote)} above ${h.eur(G, 2)}, ÷ ${h.num(TAGE)})`, h.eur(kurz1.tag, 2), h.eur(kurz2.tag, 2)],
  ['Benefit per day not worked', h.eur(rest1, 2), wegfall2 ? 'lost for the whole month' : h.eur(alg.tagsatz - kurz2.tag, 2)],
], `Example: previous salary ${h.eur(3000)} gross, ${h.num(ARBEIT)} working days in April (${h.num(TAGE)} days)`, ['l', 'r', 'r'])}
<p>In the first case you keep your ${h.eur(kurz1.netto)} wage plus ${h.num(FREI)} days of reduced benefit, ${h.eur(mitJob1)} in total against ${h.eur(ohneJob)} without the job. In the second, the offset exceeds the daily rate and the benefit is lost for the entire calendar month, even though the job lasted three weeks.</p>
<h2>When freelance and farm income count as marginal</h2>
<p>For self-employed work, ${h.src('alvg12', 'section 12(6) AlVG')} tests two figures: income plus the social insurance contributions deducted as expenses, and ${h.pct(A.selbststaendig_umsatz_quote, 1)} of turnover. Neither may exceed the marginal limit. A freelancer invoicing ${h.eur(6000)} in a month is therefore over the line even if little profit remains after costs. For farmers, ${h.pct(A.landwirtschaft_einheitswert_quote)} of the assessed farm value counts; the ${h.eur(A.landwirtschaft_einheitswert_max)} threshold is exactly the value at which that ${h.pct(A.landwirtschaft_einheitswert_quote)} reaches the monthly marginal limit. Since 2026 being marginal is not enough for these groups either: one of the five exceptions must also apply.</p>
<h2>Report before you start</h2>
<p>Every job must be reported to the AMS without delay, including a permitted mini-job. The consequences of not doing so are severe: if you are found working unreported, earnings above the limit are assumed and cannot be disproved. Benefit for that time is reclaimed, for at least ${h.num(A.pfusch_rueckzahlung_min_wochen)} weeks. Training of up to ${h.num(A.ausbildung_zulaessig_monate)} months a year is always allowed, and an AMS course does not count as employment in the first place (section 12(5) AlVG). Earning money while on childcare allowance follows completely different rules, explained on ${h.a('kbg-zuverdienst', 'childcare allowance and side earnings')}.</p>
`,
  },
});
