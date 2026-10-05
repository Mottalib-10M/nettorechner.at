import { defineGuide } from '../../lib/guide-types';
import { arbeitslosengeld, notstandshilfe } from '../../lib/engine/leistungen';
import { r2 } from '../../lib/engine/params';
import { P, DE, EN } from '../../lib/fmt';

/** § 36 AlVG: Sätze und Deckel aus params, Beispiele aus dem Motor. */
const A = P.alg;
const ST = A.dauer_wochen as [number, number, number][];
const [W20, W30, W39, W52] = ST.map((s) => s[2]);
const azTag = r2(A.ausgleichszulage_richtsatz / 30);
const emTag = r2(A.existenzminimum_monat / 30);
const BSP = [2000, 3000, 4000, 6000].map((b) => {
  const alg = arbeitslosengeld(b);
  return { b, alg, nh: notstandshilfe(alg, W20), d20: notstandshilfe(alg, W20, true), d30: notstandshilfe(alg, W30, true), d39: notstandshilfe(alg, W39, true) };
});
const [k, m, g] = BSP; // 2.000, 3.000 und 4.000 € brutto
const geringfuegig = P.sv.geringfuegigkeit;
/** Ein Jahr Notstandshilfe bei 4.000 € früherem Brutto nach 20 Wochen Arbeitslosengeld: sechs Monate voll, sechs gedeckelt (30-Tage-Monate). */
const jahrOhne = r2(g.nh.tagsatz * 30 * 12), jahrMit = r2(g.nh.tagsatz * 30 * 6 + g.d20.tagsatz * 30 * 6);
/** Erstes Monatsbrutto (in 10-€-Schritten), ab dem der Grundbetrag über dem Richtsatz/30 liegt: dort wechselt die Quote. */
let schwelle = 1000;
while (arbeitslosengeld(schwelle).grundbetrag <= azTag) schwelle += 10;

export default defineGuide({
  id: 'notstandshilfe',
  group: 'leistungen',
  order: 20,
  mini: 'notstandshilfe',
  miniHref: 'arbeitslosengeld',
  related: ['arbeitslosengeld', 'arbeitslosengeld-dauer', 'zuverdienst-arbeitslos', 'geringfuegig', 'sozialversicherung'],
  sources: ['alvg36', 'ogvNotstandshilfe', 'akAlv'],
  de: {
    slug: 'notstandshilfe',
    nav: 'Notstandshilfe',
    card: `${DE.pct(A.nh_quote_hoch)} oder ${DE.pct(A.nh_quote)} des Arbeitslosengeldes, gedeckelt nach sechs Monaten: wie viel nach dem Arbeitslosengeld bleibt.`,
    title: 'Notstandshilfe 2026: Höhe, Deckel nach 6 Monaten und Antrag',
    description: `Notstandshilfe 2026: ${DE.pct(A.nh_quote_hoch)} oder ${DE.pct(A.nh_quote)} des Arbeitslosengeldes, nach sechs Monaten höchstens ${DE.eur(A.ausgleichszulage_richtsatz, 2)} oder ${DE.eur(A.existenzminimum_monat)}. Einkommen des Partners zählt nicht mehr.`,
    h1: 'Notstandshilfe: was nach dem Arbeitslosengeld kommt',
    intro: 'Wie das AMS die Notstandshilfe aus Ihrem Arbeitslosengeld ableitet, wann sie gekürzt wird und welches Einkommen sie mindert.',
    resume: `Die Notstandshilfe beträgt 2026 ${DE.pct(A.nh_quote_hoch)} des Arbeitslosengeldes, wenn dessen täglicher Grundbetrag ${DE.eur(azTag, 2)} nicht übersteigt, also ein Dreißigstel des Ausgleichszulagenrichtsatzes von ${DE.eur(A.ausgleichszulage_richtsatz, 2)}. Liegt er darüber, gibt es ${DE.pct(A.nh_quote)} des Grundbetrags, mindestens aber ${DE.pct(A.nh_quote_hoch)} von ${DE.eur(azTag, 2)} (§ 36 AlVG). Bei ${DE.eur(m.b)} früherem Bruttogehalt werden aus ${DE.eur(m.alg.tagsatz, 2)} Arbeitslosengeld so ${DE.eur(m.nh.tagsatz, 2)} Notstandshilfe am Tag. Nach sechs Monaten greift ein Deckel: Wer zuvor nur ${W20} Wochen Arbeitslosengeld hatte, bekommt höchstens den Richtsatz von ${DE.eur(A.ausgleichszulage_richtsatz, 2)} im Monat, nach ${W30} Wochen höchstens das Existenzminimum von ${DE.eur(A.existenzminimum_monat)}; nach ${W39} oder ${W52} Wochen wird nicht gekürzt. Die Notstandshilfe wird für ${A.nh_dauer_wochen} Wochen gewährt und kann unbegrenzt oft verlängert werden. Seit 1. Juli 2018 zählt das Einkommen von Ehe- oder Lebenspartnern nicht mehr, eigenes Einkommen über ${DE.eur(geringfuegig, 2)} im Monat dagegen schon. Beantragen müssen Sie sie binnen ${A.nh_antrag_frist_jahre} Jahren nach dem Ende des Arbeitslosengeldes.`,
    faqs: [
      { q: 'Wie viel Notstandshilfe bekomme ich nach dem Arbeitslosengeld?', a: `Bei einem niedrigen Arbeitslosengeld ${DE.pct(A.nh_quote_hoch)}, sonst ${DE.pct(A.nh_quote)} des Grundbetrags. Aus ${DE.eur(k.b)} brutto folgen ${DE.eur(k.alg.tagsatz, 2)} Arbeitslosengeld und ${DE.eur(k.nh.tagsatz, 2)} Notstandshilfe am Tag, aus ${DE.eur(g.b)} brutto ${DE.eur(g.alg.tagsatz, 2)} und ${DE.eur(g.nh.tagsatz, 2)}. Familienzuschläge von ${DE.eur(A.familienzuschlag_tag, 2)} je Person und Tag kommen wie beim Arbeitslosengeld dazu. Eigenes Einkommen über der Geringfügigkeitsgrenze mindert den Betrag.` },
      { q: 'Wird das Einkommen meines Partners auf die Notstandshilfe angerechnet?', a: `Nein, seit 1. Juli 2018 nicht mehr. Davor zog das AMS das Nettoeinkommen von Ehepartnern und Lebensgefährten im gemeinsamen Haushalt nach Freibeträgen ab. Heute zählt nur Ihr eigenes Einkommen, und auch das erst, soweit Erwerbseinkommen ${DE.eur(geringfuegig, 2)} im Monat übersteigt. Gesetzliche Unterhaltszahlungen, die Sie bekommen, werden ebenfalls nur über dieser Grenze angerechnet.` },
      { q: 'Warum sinkt meine Notstandshilfe nach sechs Monaten?', a: `Weil § 36 Abs. 5 AlVG ab dem Monatsersten nach sechs Monaten Bezug einen Deckel einzieht. Nach ${W20} Wochen Arbeitslosengeld sind es höchstens ${DE.eur(azTag, 2)} am Tag, nach ${W30} Wochen höchstens ${DE.eur(emTag, 2)}. Bei ${DE.eur(g.b)} früherem Brutto fällt die Notstandshilfe so von ${DE.eur(g.nh.tagsatz, 2)} auf ${DE.eur(g.d20.tagsatz, 2)}. Wer ${W39} oder ${W52} Wochen Arbeitslosengeld hatte, behält den vollen Betrag.` },
      { q: 'Wie lange kann man Notstandshilfe beziehen?', a: `Jeweils ${A.nh_dauer_wochen} Wochen, danach stellen Sie einen Antrag auf Weitergewährung. Das ist laut AK unbegrenzt oft möglich, solange Sie arbeitsfähig, arbeitswillig und verfügbar sind und eine Notlage besteht. Eine Höchstdauer gibt es nicht. Kranken- und Pensionsversicherung laufen während des Bezugs automatisch weiter, und wer eine Pension beantragt, kann einen Pensionsvorschuss in Höhe der Notstandshilfe bekommen.` },
      { q: 'Bis wann muss ich die Notstandshilfe beantragen?', a: `Innerhalb von ${A.nh_antrag_frist_jahre} Jahren nach dem letzten Tag Arbeitslosengeld. Für einen Fortbezug nach einer Unterbrechung gilt dieselbe Frist ab dem letzten Bezugstag. Die ${A.nh_antrag_frist_jahre} Jahre verlängern sich um Zeiten, die auch die Rahmenfrist der Anwartschaft verlängern, etwa Kinderbetreuungsgeld, Krankengeld oder eine Ausbildung. Am besten stellen Sie den Antrag noch vor dem letzten Tag Arbeitslosengeld, damit die Zahlung ohne Lücke weiterläuft.` },
      { q: 'Darf ich neben der Notstandshilfe geringfügig arbeiten?', a: `Seit 1. Jänner 2026 im Regelfall nicht mehr. Erlaubt bleibt eine Nebenbeschäftigung, die schon mindestens ${A.zv_vorher_wochen} Wochen vor der Arbeitslosigkeit ununterbrochen bestand, sowie einige weitere Ausnahmen, etwa nach ${A.zv_nach_bezug_tage} Tagen Leistungsbezug. Wer mehr als ${DE.eur(geringfuegig, 2)} im Monat verdient, gilt in dieser Zeit nicht als arbeitslos und bekommt keine Notstandshilfe. Jede Beschäftigung ist dem AMS sofort zu melden.` },
    ],
    body: (h) => `
<h2>Wann die Notstandshilfe zusteht</h2>
<p>Die Notstandshilfe schließt an das ${h.a('arbeitslosengeld', 'Arbeitslosengeld')} an, wenn dessen Bezugsdauer ausgeschöpft ist. Voraussetzung ist eine Notlage: Ohne die Leistung könnten Sie Ihren Lebensunterhalt nicht bestreiten. Dafür berücksichtigt das AMS nach ${h.src('alvg36', '§ 36 Abs. 2 AlVG')} die gesamten wirtschaftlichen Verhältnisse, rechnet aber seit Mitte 2018 nur noch Ihr eigenes Einkommen an. Arbeitsfähigkeit, Arbeitswilligkeit und Verfügbarkeit für mindestens ${h.num(A.verfuegbarkeit_stunden)} Wochenstunden (mit Kind unter zehn Jahren ${h.num(A.verfuegbarkeit_stunden_betreuung)}) gelten weiter. Anders als in den ersten Wochen Arbeitslosengeld gibt es keinen Berufs- und Entgeltschutz mehr: Jede zumutbare Stelle ist anzunehmen.</p>
<h2>Die Rechnung des § 36 AlVG</h2>
<p>Ausgangspunkt ist der tägliche Grundbetrag Ihres Arbeitslosengeldes, also ${h.pct(A.grundbetrag_quote)} des fiktiven Nettoeinkommens. Das Gesetz vergleicht ihn mit einem Dreißigstel des Ausgleichszulagenrichtsatzes, 2026 ${h.eur(azTag, 2)}.</p>
<ol>
<li><strong>Grundbetrag bis ${h.eur(azTag, 2)}:</strong> Notstandshilfe = ${h.pct(A.nh_quote_hoch)} des Grundbetrags plus ${h.pct(A.nh_quote_hoch)} des Ergänzungsbetrags. Das betrifft frühere Bruttogehälter bis rund ${h.eur(schwelle - 10)}.</li>
<li><strong>Grundbetrag darüber:</strong> Notstandshilfe = ${h.pct(A.nh_quote)} des Grundbetrags, aber nie weniger als ${h.pct(A.nh_quote_hoch)} von ${h.eur(azTag, 2)}, also ${h.eur(r2(A.nh_quote_hoch * azTag), 2)} am Tag.</li>
</ol>
<p>Beide Ergebnisse werden kaufmännisch auf Cent gerundet. Familienzuschläge kommen dazu, solange das Ganze ${h.pct(A.ergaenzung_quote_mit_fz)} des fiktiven Nettos nicht überschreitet. Die ${h.src('ogvNotstandshilfe', 'Notstandshilfe-Seite von oesterreich.gv.at')} beschreibt dieselbe Rechnung; ausbezahlt wird monatlich im Nachhinein.</p>
${h.table(['Brutto vorher', 'Arbeitslosengeld', 'Notstandshilfe', 'ab 7. Monat nach 20 Wochen', 'nach 30 Wochen', 'nach 39/52 Wochen'], BSP.map((x) => [h.eur(x.b), h.eur(x.alg.tagsatz, 2), h.eur(x.nh.tagsatz, 2), h.eur(x.d20.tagsatz, 2), h.eur(x.d30.tagsatz, 2), h.eur(x.d39.tagsatz, 2)]), 'Tagsätze 2026 ohne Familienzuschlag und ohne eigenes Einkommen, berechnet mit dem Motor dieser Seite', ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>Die Tabelle zeigt, dass der Abstand zum Arbeitslosengeld mit dem Gehalt wächst: Bei ${h.eur(k.b)} brutto sind es ${h.eur(k.alg.tagsatz - k.nh.tagsatz, 2)} am Tag weniger, bei ${h.eur(g.b)} schon ${h.eur(g.alg.tagsatz - g.nh.tagsatz, 2)}, und nach sechs Monaten mit Deckel ${h.eur(g.alg.tagsatz - g.d20.tagsatz, 2)}.</p>
<!--mini:alg-->
<h2>Der Deckel nach sechs Monaten</h2>
<p>Bei einem ersten Antrag im Anschluss an das Arbeitslosengeld greift ${h.src('alvg36', '§ 36 Abs. 5 AlVG')} ab dem Ersten des Monats, der auf sechs Monate nach dem Beginn der Notstandshilfe folgt. Wie hoch der Deckel ist, hängt allein davon ab, wie lange Ihr Arbeitslosengeld gedauert hat:</p>
${h.table(['Arbeitslosengeld vorher', 'Obergrenze pro Monat', 'pro Tag'], [
  [`${h.num(W20)} Wochen`, `${h.eur(A.ausgleichszulage_richtsatz, 2)} (Ausgleichszulagenrichtsatz)`, h.eur(azTag, 2)],
  [`${h.num(W30)} Wochen`, `${h.eur(A.existenzminimum_monat)} (Existenzminimum)`, h.eur(emTag, 2)],
  [`${h.num(W39)} oder ${h.num(W52)} Wochen`, 'kein Deckel', '–'],
], 'Obergrenzen 2026 nach AK-Broschüre Arbeitslosenversicherung', ['l', 'l', 'r'])}
<p>Wer das ${h.num(A.nh_laengste_dauer_ab_alter)}. Lebensjahr vollendet hat, wird nach der längsten jemals zuerkannten Bezugsdauer beurteilt. Wer also mit ${h.num(ST[2][1])} einmal ${h.num(W39)} Wochen Arbeitslosengeld hatte, behält diese Einstufung auch bei einer späteren, kürzeren Arbeitslosigkeit. Welche Dauer Ihnen zusteht, erklärt die Seite zur ${h.a('arbeitslosengeld-dauer', 'Bezugsdauer des Arbeitslosengeldes')}.</p>
<h2>Welches Einkommen die Notstandshilfe mindert</h2>
<ul>
<li><strong>Eigenes Erwerbseinkommen bis ${h.eur(geringfuegig, 2)}:</strong> wird nicht angerechnet. Eine solche Beschäftigung ist seit 2026 aber nur noch in Ausnahmefällen erlaubt, mehr dazu unter ${h.a('zuverdienst-arbeitslos', 'Zuverdienst und Arbeitslosengeld')}.</li>
<li><strong>Eigenes Erwerbseinkommen darüber:</strong> Sie gelten für diese Zeit nicht als arbeitslos, es gibt keine Notstandshilfe.</li>
<li><strong>Anderes eigenes Einkommen</strong> (etwa Mieteinnahmen): wird im Folgemonat nach Abzug der Aufwendungen angerechnet, gerundet auf volle Euro (§ 36 Abs. 3 und 4).</li>
<li><strong>Unterhalt, den Sie bekommen:</strong> nur soweit er ${h.eur(geringfuegig, 2)} im Monat übersteigt.</li>
<li><strong>Einkommen des Partners:</strong> zählt seit 1. Juli 2018 nicht mehr.</li>
<li><strong>Schulungsbeihilfen</strong> für kursbedingte Mehrkosten: zählen nicht.</li>
</ul>
<h2>Ein Jahr Notstandshilfe durchgerechnet</h2>
<p>Ein früherer Angestellter mit ${h.eur(g.b)} brutto, der nur ${h.num(W20)} Wochen Arbeitslosengeld hatte, bekommt in den ersten sechs Monaten Notstandshilfe rund ${h.eur(g.nh.monat30)} im Monat. Danach greift der Richtsatz-Deckel, und es bleiben ${h.eur(g.d20.monat30)}. Übers Jahr sind das ${h.eur(jahrMit)} statt ${h.eur(jahrOhne)} ohne Deckel, ein Unterschied von ${h.eur(jahrOhne - jahrMit)}. Hätte dieselbe Person mit ${h.num(ST[2][1])} Jahren und genug Versicherungszeiten ${h.num(W39)} Wochen Arbeitslosengeld bekommen, gäbe es diese Kürzung nicht. Wer knapp unter einer Stufe der Bezugsdauer liegt, verliert also nicht nur Wochen Arbeitslosengeld, sondern später auch Notstandshilfe.</p>
<h2>Antrag, Dauer und Verlängerung</h2>
<p>Die Notstandshilfe wird jeweils für ${h.num(A.nh_dauer_wochen)} Wochen zuerkannt. Danach stellen Sie einen neuen Antrag; die Weitergewährung ist unbegrenzt oft möglich, solange die Voraussetzungen vorliegen. Der erste Antrag muss innerhalb von ${h.num(A.nh_antrag_frist_jahre)} Jahren nach dem Ende des Arbeitslosengeldes gestellt werden, ein Fortbezug innerhalb von ${h.num(A.nh_antrag_frist_jahre)} Jahren ab dem letzten Bezugstag. Die ${h.src('akAlv', 'AK Niederösterreich')} weist darauf hin, dass sich die Frist um alle Zeiten verlängert, die auch die Rahmenfrist der Anwartschaft verlängern. Während des Bezugs sind Sie kranken- und pensionsversichert; bei Krankheit zahlt die Krankenkasse Krankengeld in Höhe der Notstandshilfe.</p>
`,
  },
  en: {
    slug: 'emergency-assistance-notstandshilfe',
    nav: 'Emergency assistance (Notstandshilfe)',
    card: `${EN.pct(A.nh_quote_hoch)} or ${EN.pct(A.nh_quote)} of your unemployment benefit, capped after six months: what you get once benefit runs out.`,
    title: 'Notstandshilfe 2026: Austria Emergency Assistance Explained',
    description: `Notstandshilfe 2026 in Austria: ${EN.pct(A.nh_quote_hoch)} or ${EN.pct(A.nh_quote)} of unemployment benefit, capped at ${EN.eur(A.ausgleichszulage_richtsatz, 2)} or ${EN.eur(A.existenzminimum_monat)} after six months. Your partner’s income is not counted.`,
    h1: 'Emergency assistance: the payment after unemployment benefit',
    intro: 'How the AMS derives Notstandshilfe from your unemployment benefit, when it is capped and which income reduces it.',
    resume: `Emergency assistance (Notstandshilfe) in Austria is ${EN.pct(A.nh_quote_hoch)} of your unemployment benefit in 2026 if the daily base amount of that benefit does not exceed ${EN.eur(azTag, 2)}, one thirtieth of the equalisation supplement reference rate of ${EN.eur(A.ausgleichszulage_richtsatz, 2)}. Above that it is ${EN.pct(A.nh_quote)} of the base amount, but never less than ${EN.pct(A.nh_quote_hoch)} of ${EN.eur(azTag, 2)} (section 36 of the Unemployment Insurance Act). Someone who earned ${EN.eur(m.b)} gross a month goes from ${EN.eur(m.alg.tagsatz, 2)} of unemployment benefit to ${EN.eur(m.nh.tagsatz, 2)} a day. After six months a cap applies: if your unemployment benefit lasted only ${W20} weeks, Notstandshilfe is limited to ${EN.eur(A.ausgleichszulage_richtsatz, 2)} a month; after ${W30} weeks to the protected minimum of ${EN.eur(A.existenzminimum_monat)}; after ${W39} or ${W52} weeks there is no cap. It is granted for ${A.nh_dauer_wochen} weeks at a time and can be renewed any number of times. Since July 2018 a spouse's or partner's income no longer counts, but your own earnings above ${EN.eur(geringfuegig, 2)} a month do. You must apply within ${A.nh_antrag_frist_jahre} years of your unemployment benefit ending.`,
    faqs: [
      { q: 'How much Notstandshilfe will I get once my unemployment benefit ends?', a: `${EN.pct(A.nh_quote_hoch)} of a low benefit, otherwise ${EN.pct(A.nh_quote)} of the base amount. A previous gross salary of ${EN.eur(k.b)} gives ${EN.eur(k.alg.tagsatz, 2)} of benefit and ${EN.eur(k.nh.tagsatz, 2)} of emergency assistance a day; ${EN.eur(g.b)} gross gives ${EN.eur(g.alg.tagsatz, 2)} and ${EN.eur(g.nh.tagsatz, 2)}. Family supplements of ${EN.eur(A.familienzuschlag_tag, 2)} per dependant and day are added as before. Your own income above the marginal-earnings limit reduces the amount.` },
      { q: 'Does my partner’s salary reduce my emergency assistance in Austria?', a: `No, not since 1 July 2018. Before that date the AMS deducted the net income of a spouse or cohabiting partner after allowances. Today only your own income counts, and earnings only to the extent that they exceed ${EN.eur(geringfuegig, 2)} a month. Child or spousal maintenance you receive is also counted only above that limit.` },
      { q: 'Why does Notstandshilfe drop after six months?', a: `Section 36(5) imposes a cap from the first of the month after six months of payment. After ${W20} weeks of unemployment benefit the ceiling is ${EN.eur(azTag, 2)} a day, after ${W30} weeks ${EN.eur(emTag, 2)}. With a previous gross salary of ${EN.eur(g.b)}, the payment falls from ${EN.eur(g.nh.tagsatz, 2)} to ${EN.eur(g.d20.tagsatz, 2)}. Anyone who had ${W39} or ${W52} weeks of unemployment benefit keeps the full amount.` },
      { q: 'Is there a time limit on emergency assistance in Austria?', a: `No overall limit. It is granted for ${A.nh_dauer_wochen} weeks, then you apply for an extension, which the Chamber of Labour says is possible any number of times as long as you remain able and willing to work, available and in need. Health and pension insurance continue automatically, and if you apply for a pension you can receive an advance (Pensionsvorschuss) at the same rate.` },
      { q: 'What is the deadline to apply for Notstandshilfe?', a: `${A.nh_antrag_frist_jahre} years from your last day of unemployment benefit. The same ${A.nh_antrag_frist_jahre}-year window applies to resuming Notstandshilfe after a break, counted from the last day you received it. The window is extended by periods that also extend the qualifying window for unemployment benefit, such as childcare allowance, sick pay or full-time study. Ideally, apply before your last day of unemployment benefit so that payments continue without a gap.` },
      { q: 'Can I keep a mini-job while on emergency assistance?', a: `Since 1 January 2026, usually not. A side job you had held without interruption for at least ${A.zv_vorher_wochen} weeks before becoming unemployed may continue, and a few other exceptions apply, for instance after ${A.zv_nach_bezug_tage} days on benefit. Earning more than ${EN.eur(geringfuegig, 2)} a month means you are not unemployed for that period and receive no Notstandshilfe. Report any work to the AMS straight away.` },
    ],
    body: (h) => `
<h2>Who qualifies</h2>
<p>Notstandshilfe follows on from ${h.a('arbeitslosengeld', 'unemployment benefit')} once its duration is used up. You must be in financial need, meaning you could not cover your living costs without it. Under ${h.src('alvg36', 'section 36(2) of the Unemployment Insurance Act (AlVG)')} the AMS looks at your overall finances, but since mid-2018 only your own income is counted. You must still be able and willing to work and available for at least ${h.num(A.verfuegbarkeit_stunden)} hours a week (${h.num(A.verfuegbarkeit_stunden_betreuung)} with a child under ten). The protection you had in the first months of unemployment benefit, against being placed outside your occupation or below a set share of your old pay, no longer applies: any reasonable job must be accepted.</p>
<h2>How section 36 works out the amount</h2>
<p>The starting point is the daily base amount (Grundbetrag) of your unemployment benefit, ${h.pct(A.grundbetrag_quote)} of a notional net income. The law compares it with one thirtieth of the equalisation supplement reference rate (Ausgleichszulagenrichtsatz, the minimum pension level), ${h.eur(azTag, 2)} in 2026.</p>
<ol>
<li><strong>Base amount up to ${h.eur(azTag, 2)}:</strong> Notstandshilfe = ${h.pct(A.nh_quote_hoch)} of the base amount plus ${h.pct(A.nh_quote_hoch)} of the top-up (Ergänzungsbetrag). This covers previous gross salaries up to about ${h.eur(schwelle - 10)}.</li>
<li><strong>Base amount above that:</strong> Notstandshilfe = ${h.pct(A.nh_quote)} of the base amount, never less than ${h.pct(A.nh_quote_hoch)} of ${h.eur(azTag, 2)}, which is ${h.eur(r2(A.nh_quote_hoch * azTag), 2)} a day.</li>
</ol>
<p>Each result is rounded to the cent. Family supplements are added as long as the total stays within ${h.pct(A.ergaenzung_quote_mit_fz)} of the notional net income. The government portal ${h.src('ogvNotstandshilfe', 'oesterreich.gv.at')} describes the same method; payment is monthly in arrears.</p>
${h.table(['Previous gross', 'Unemployment benefit', 'Notstandshilfe', 'month 7+ after 20 weeks', 'after 30 weeks', 'after 39/52 weeks'], BSP.map((x) => [h.eur(x.b), h.eur(x.alg.tagsatz, 2), h.eur(x.nh.tagsatz, 2), h.eur(x.d20.tagsatz, 2), h.eur(x.d30.tagsatz, 2), h.eur(x.d39.tagsatz, 2)]), 'Daily rates 2026 without family supplement or own income, from this site’s engine', ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>The gap to unemployment benefit grows with your former salary: ${h.eur(k.alg.tagsatz - k.nh.tagsatz, 2)} a day less at ${h.eur(k.b)} gross, ${h.eur(g.alg.tagsatz - g.nh.tagsatz, 2)} at ${h.eur(g.b)}, and ${h.eur(g.alg.tagsatz - g.d20.tagsatz, 2)} once the six-month cap bites.</p>
<!--mini:alg-->
<h2>The six-month cap</h2>
<p>For a first claim straight after unemployment benefit, ${h.src('alvg36', 'section 36(5)')} applies from the first day of the month following six months of Notstandshilfe. The ceiling depends only on how long your unemployment benefit lasted:</p>
${h.table(['Benefit lasted', 'monthly ceiling', 'per day'], [
  [`${h.num(W20)} weeks`, `${h.eur(A.ausgleichszulage_richtsatz, 2)} (reference rate)`, h.eur(azTag, 2)],
  [`${h.num(W30)} weeks`, `${h.eur(A.existenzminimum_monat)} (protected minimum)`, h.eur(emTag, 2)],
  [`${h.num(W39)} or ${h.num(W52)} weeks`, 'no cap', '–'],
], '2026 ceilings according to the Chamber of Labour', ['l', 'l', 'r'])}
<p>From age ${h.num(A.nh_laengste_dauer_ab_alter)}, the longest benefit duration you were ever granted is used. If you once had ${h.num(W39)} weeks, you keep that status in a later, shorter spell of unemployment. The page on ${h.a('arbeitslosengeld-dauer', 'unemployment benefit duration')} shows which tier applies to you.</p>
<h2>Which income reduces it</h2>
<ul>
<li><strong>Your own earnings up to ${h.eur(geringfuegig, 2)}:</strong> not counted, but since 2026 such a job is allowed only in exceptional cases; see ${h.a('zuverdienst-arbeitslos', 'side jobs and unemployment benefit')}.</li>
<li><strong>Your own earnings above that:</strong> you are not considered unemployed for that period and get no Notstandshilfe.</li>
<li><strong>Other income of your own</strong>, such as rent: deducted in the following month after expenses, rounded to whole euros (section 36(3) and (4)).</li>
<li><strong>Maintenance you receive:</strong> only the part above ${h.eur(geringfuegig, 2)} a month.</li>
<li><strong>Your partner’s income:</strong> ignored since 1 July 2018.</li>
<li><strong>Course allowances</strong> covering training costs: ignored.</li>
</ul>
<h2>One year of Notstandshilfe worked through</h2>
<p>A former employee on ${h.eur(g.b)} gross who had only ${h.num(W20)} weeks of unemployment benefit receives about ${h.eur(g.nh.monat30)} a month in the first six months of emergency assistance. Then the reference-rate cap applies and ${h.eur(g.d20.monat30)} remain. Over the year that is ${h.eur(jahrMit)} instead of ${h.eur(jahrOhne)} without the cap, a difference of ${h.eur(jahrOhne - jahrMit)}. Had the same person been ${h.num(ST[2][1])} with enough insured weeks for ${h.num(W39)} weeks of benefit, there would be no cut. Falling just short of a duration tier therefore costs twice: fewer weeks of benefit, and a lower Notstandshilfe later.</p>
<h2>Applying and renewing</h2>
<p>Notstandshilfe is granted for ${h.num(A.nh_dauer_wochen)} weeks at a time; then you apply again, as often as needed while the conditions are met. The first application must reach the AMS within ${h.num(A.nh_antrag_frist_jahre)} years after unemployment benefit ends, and a resumption within ${h.num(A.nh_antrag_frist_jahre)} years of the last payment. The ${h.src('akAlv', 'Chamber of Labour')} notes that this window is extended by any period that extends the qualifying window. While you receive it you are covered by health and pension insurance, and if you fall ill the health insurer pays sick pay at the same daily rate.</p>
`,
  },
});
