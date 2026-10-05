import { defineGuide } from '../../lib/guide-types';
import { rechneJahr, standardJahr, type JahresErgebnis, type MonatsErgebnis } from '../../lib/engine/jahr';
import { P, DE, EN } from '../../lib/fmt';

/** Alle Fälle aus dem Motor (rechneJahr), Arbeitsort außerhalb Wiens, ohne Kinder. */
const B = 3000;
/** Netto einer Sonderzahlung = Brutto − SV − feste Steuer − Tarifsteuer auf den Teil über dem Sechstel. */
const szNetto = (m: MonatsErgebnis) => m.sz - m.svSz - m.lstSzFest - m.lstSzTarif;

/** 1. Das normale Jahr: 3.000 € mal vierzehn. */
const std = rechneJahr(standardJahr(B));
const uzStd = std.monate[5], wrStd = std.monate[10];

/** 2. Eintritt am 1. September: Weihnachtsremuneration anteilig (4/12) oder voll. */
const EIN = 9, monateDa = 12 - EIN + 1;
const anteilWr = B * monateDa / 12;
const herbst = (wr: number): JahresErgebnis => rechneJahr(Array.from({ length: 12 }, (_, i) => ({ laufend: i + 1 >= EIN ? B : 0, sz: i === 10 ? wr : 0 })));
const hAnteil = herbst(anteilWr), hVoll = herbst(B);

/** 3. Prämie im Dezember zusätzlich zu beiden Sonderzahlungen. */
const PRAEMIE = 2000;
const praemie = rechneJahr(Array.from({ length: 12 }, (_, i) => ({ laufend: B, sz: i === 5 ? B : i === 10 ? B : i === 11 ? PRAEMIE : 0 })));
const prDez = praemie.monate[11];

/** 4. Austritt Ende September: anteilige Weihnachtsremuneration (9/12) mit der Endabrechnung. */
const AUS = 9;
const anteilAus = B * AUS / 12;
const austritt = (ausnahme: boolean) => rechneJahr(Array.from({ length: 12 }, (_, i) => ({ laufend: i < AUS ? B : 0, sz: i === 5 ? B : i === AUS - 1 ? anteilAus : 0 })), {}, true, ausnahme);
const aMit = austritt(true), aOhne = austritt(false);
const S = P.sonderzahlungen;

export default defineGuide({
  id: 'sonderzahlungen',
  group: 'rechner',
  order: 20,
  tool: 'sonderzahlung',
  related: ['jahressechstel', 'dreizehntes-gehalt', 'gehaltserhoehung', 'ueberstunden', 'abfertigung'],
  sources: ['estg67', 'estg77', 'estg124b', 'oegkWerte'],
  de: {
    slug: 'urlaubsgeld-weihnachtsgeld-rechner',
    nav: 'Urlaubsgeld- und Weihnachtsgeld-Rechner',
    card: 'Urlaubszuschuss, Weihnachtsremuneration und Prämien netto, Monat für Monat mit Eintritt, Austritt und Erhöhung.',
    title: 'Urlaubsgeld und Weihnachtsgeld netto 2026 Monat für Monat',
    description: `Urlaubsgeld und Weihnachtsgeld 2026 netto: bei ${DE.eur(B)} brutto bleiben ${DE.eur(szNetto(uzStd), 2)} vom Urlaubszuschuss. Mit Eintritt, Austritt, Prämie und Kontrollrechnung.`,
    h1: 'Urlaubszuschuss und Weihnachtsremuneration netto berechnen',
    intro: 'Der Rechner geht Ihr Jahr Monat für Monat durch und zeigt, was von jeder Sonderzahlung tatsächlich am Konto ankommt.',
    resume: `Bei ${DE.eur(B)} brutto im Monat bleiben 2026 vom Urlaubszuschuss im Juni ${DE.eur(szNetto(uzStd), 2)} netto und von der Weihnachtsremuneration im November ${DE.eur(szNetto(wrStd), 2)}. Der Unterschied kommt vom Freibetrag von ${DE.eur(S.freibetrag)}, den die erste Sonderzahlung des Jahres verbraucht; danach kostet jeder Euro ${DE.pct(S.stufen[1][1])} Lohnsteuer, nach Abzug von Kranken-, Pensions- und Arbeitslosenversicherung. AK-Umlage und Wohnbauförderungsbeitrag fallen auf Sonderzahlungen nicht an. So einfach bleibt es nur, solange das Gehalt das ganze Jahr gleich ist. Wer im September eintritt, verlässt die Firma vor Weihnachten, bekommt eine Prämie im Dezember oder eine Erhöhung im Herbst, und schon verschiebt sich, welcher Teil mit dem festen Satz und welcher nach dem Tarif besteuert wird. Eine zusätzliche Prämie von ${DE.eur(PRAEMIE)} im Dezember etwa bringt nach zwei vollen Sonderzahlungen nur ${DE.eur(szNetto(prDez), 2)} netto. Der Rechner bildet jeden Monat einzeln ab und führt am Ende die Kontrollrechnung des § 77 Abs. 4a EStG durch.`,
    faqs: [
      { q: 'Warum ist die Weihnachtsremuneration netto weniger als der Urlaubszuschuss?', a: `Weil der Freibetrag von ${DE.eur(S.freibetrag)} pro Jahr nur einmal zusteht und von der ersten Sonderzahlung verbraucht wird, meist vom Urlaubszuschuss im Juni. Bei ${DE.eur(B)} brutto zahlen Sie im Juni ${DE.eur(uzStd.lstSzFest, 2)} Lohnsteuer auf den Urlaubszuschuss, im November ${DE.eur(wrStd.lstSzFest, 2)} auf die Weihnachtsremuneration. Die Sozialversicherung ist auf beide gleich hoch.` },
      { q: 'Was bleibt vom Weihnachtsgeld, wenn ich erst im Herbst eingetreten bin?', a: `Bei Eintritt am 1. September und ${DE.eur(B)} brutto ergibt eine anteilige Weihnachtsremuneration, wie sie viele Kollektivverträge vorsehen, ${DE.eur(anteilWr)}; davon bleiben ${DE.eur(szNetto(hAnteil.monate[10]), 2)}. Zahlt er freiwillig eine volle, liegt sie im Dezember über dem Kontrollsechstel und wird teilweise nachversteuert: ${DE.eur(hVoll.kontrolle.mehrsteuer, 2)} Mehrsteuer auf ${DE.eur(hVoll.kontrolle.ueberhang)}. Die Höhe des Anteils legt Ihr Kollektivvertrag fest.` },
      { q: 'Wie wird eine Prämie neben Urlaubs- und Weihnachtsgeld versteuert?', a: `Nach zwei vollen Sonderzahlungen ist das Jahressechstel meist ausgeschöpft. Eine Prämie von ${DE.eur(PRAEMIE)} im Dezember wird dann wie ein laufender Bezug nach dem Tarif versteuert: ${DE.eur(prDez.lstSzTarif, 2)} Lohnsteuer und ${DE.eur(prDez.svSz, 2)} Sozialversicherung, netto bleiben ${DE.eur(szNetto(prDez), 2)}. Eine Mitarbeiterprämie bis ${DE.eur(P.mitarbeiterpraemie_2026_max)} von Juli bis Dezember 2026 ist dagegen steuerfrei, wenn sie auf einem Kollektivvertrag oder einer Betriebsvereinbarung beruht.` },
      { q: 'Muss ich bei einem Austritt vor Weihnachten Lohnsteuer auf Sonderzahlungen nachzahlen?', a: `Nein. Endet das Dienstverhältnis und beginnt im selben Jahr kein neues beim selben Arbeitgeber, entfällt die Nachversteuerung aus der Kontrollrechnung (§ 77 Abs. 4a EStG). Im Beispiel mit Austritt Ende September und anteiliger Weihnachtsremuneration von ${DE.eur(anteilAus)} wären sonst ${DE.eur(aOhne.kontrolle.mehrsteuer, 2)} fällig geworden. Im Rechner setzen Sie dafür einfach den Austrittsmonat.` },
    ],
    body: (h) => `
<h2>Was Sie im Rechner eintragen</h2>
<p>Der Rechner fragt nach Ihrem Monatsgehalt brutto, einer Gehaltserhöhung samt Monat, dem Monat des Eintritts und des Austritts, Höhe und Monat von Urlaubszuschuss und Weihnachtsremuneration, einer Prämie und regelmäßigen Überstunden. Daraus baut er zwölf Monatsabrechnungen. Für jede Sonderzahlung sehen Sie, wie viel ins Sechstel passt, was darüber liegt, welche Sozialversicherung (ohne AK und WF) und welche Steuer anfällt. Die Beträge der Sonderzahlungen geben Sie selbst ein, weil Höhe und Anteile im Kollektivvertrag stehen, nicht im Steuerrecht.</p>
<h2>Das normale Jahr als Ausgangspunkt</h2>
${h.table(['Zahlung', 'Brutto', 'Sozialversicherung', 'Lohnsteuer', 'Netto'], [
  ['Urlaubszuschuss Juni', h.eur(uzStd.sz), h.eur(uzStd.svSz, 2), h.eur(uzStd.lstSzFest, 2), h.eur(szNetto(uzStd), 2)],
  ['Weihnachtsremuneration November', h.eur(wrStd.sz), h.eur(wrStd.svSz, 2), h.eur(wrStd.lstSzFest, 2), h.eur(szNetto(wrStd), 2)],
], `${h.eur(B)} brutto das ganze Jahr, Arbeitsort außerhalb Wiens, ohne Kinder`, ['l', 'r', 'r', 'r', 'r'])}
<p>Beide Zahlungen liegen ganz im Sechstel. Die Steuer folgt den festen Sätzen des ${h.src('estg67', '§ 67 Abs. 1 EStG')}: ${h.eur(h.P.sonderzahlungen.freibetrag)} frei, dann ${h.pct(h.P.sonderzahlungen.stufen[1][1])}. Wie das Sechstel selbst entsteht, erklärt die Seite zum ${h.a('jahressechstel', 'Jahressechstel')}; hier geht es um die Fälle, in denen das Jahr nicht glatt verläuft.</p>
<h2>Eintritt im Herbst</h2>
<p>Wer am 1. September beginnt, hat im November erst drei Gehälter bezogen. Das Sechstel wird trotzdem aufs Jahr hochgerechnet und beträgt ${h.eur(hVoll.monate[10].sechstel)}, die Weihnachtsremuneration passt also hinein. Abgerechnet wird aber im Dezember: Das Kontrollsechstel umfasst nur die vier tatsächlich bezahlten Gehälter, ${h.eur(hVoll.sechstelEnde)}.</p>
${h.table(['Weihnachtsremuneration', 'Brutto', 'Netto im November', 'Nachversteuerung im Dezember'], [
  ['anteilig', h.eur(anteilWr), h.eur(szNetto(hAnteil.monate[10]), 2), h.eur(hAnteil.kontrolle.mehrsteuer, 2)],
  ['voll', h.eur(B), h.eur(szNetto(hVoll.monate[10]), 2), h.eur(hVoll.kontrolle.mehrsteuer, 2)],
], `Eintritt am 1. September, ${h.eur(B)} brutto im Monat`, ['l', 'r', 'r', 'r'])}
<p>Eine volle Weihnachtsremuneration nach kurzem Dienstverhältnis ist also teurer, als die Novemberabrechnung vermuten lässt. Ein Eintritt zählt nicht zu den Ausnahmen des ${h.src('estg77', '§ 77 Abs. 4a EStG')}, ein Austritt schon.</p>
<h2>Austritt vor Weihnachten</h2>
<p>Bei einem Austritt Ende September kommt die anteilige Weihnachtsremuneration mit der Endabrechnung, im Beispiel ${h.eur(anteilAus)}. Das Septembersechstel ist hochgerechnet, sie passt hinein und kostet ${h.eur(aMit.monate[AUS - 1].lstSzFest, 2)} Lohnsteuer. Das Kontrollsechstel aus neun Gehältern wäre kleiner; weil das Dienstverhältnis aber endet, verzichtet das Gesetz auf die Nachversteuerung von ${h.eur(aOhne.kontrolle.mehrsteuer, 2)}. Fängt man im selben Jahr wieder beim selben Arbeitgeber oder im Konzern an, gilt die Ausnahme nicht. Was beim Austritt sonst noch abgerechnet wird, zeigt der ${h.a('abfertigung', 'Abfertigungsrechner')}.</p>
<h2>Prämie im Dezember</h2>
<p>Eine Bilanz- oder Leistungsprämie zusätzlich zu zwei vollen Sonderzahlungen findet im Sechstel keinen Platz mehr. Die ${h.eur(PRAEMIE)} werden im Dezember nach dem Tarif versteuert und kosten ${h.eur(prDez.lstSzTarif, 2)} Lohnsteuer, rund ${h.pct(prDez.lstSzTarif / (PRAEMIE - prDez.svSz))} des Betrags nach Sozialversicherung. Anders die Mitarbeiterprämie 2026: Bis ${h.eur(h.P.mitarbeiterpraemie_2026_max)}, bezahlt von Juli bis Dezember auf Grund eines Kollektivvertrags oder einer Betriebsvereinbarung, ist sie steuerfrei und verbraucht das Sechstel nicht (${h.src('estg124b', '§ 124b EStG')}). Wer die Wahl hat, sollte die Prämie so gestalten lassen.</p>
<h2>Erhöhung und Überstunden</h2>
<p>Eine Gehaltserhöhung im Herbst lässt das Sechstel hinterherhinken; die Weihnachtsremuneration nach neuem Gehalt passt dann nicht mehr ganz hinein, und die Kontrollrechnung im Dezember gibt den Großteil zurück. Regelmäßige Überstunden wirken umgekehrt: Sie erhöhen das Sechstel und schaffen Platz für eine Prämie. Beides tragen Sie im Rechner ein; die Wirkung einer Erhöhung über das ganze Jahr zeigt die Seite zur ${h.a('gehaltserhoehung', 'Gehaltserhöhung')}, die Bedeutung von Sonderzahlungen im Vertrag der Ratgeber zum ${h.a('dreizehntes-gehalt', '13. und 14. Gehalt')}.</p>
`,
  },
  en: {
    slug: 'holiday-christmas-pay-calculator',
    nav: 'Holiday and Christmas pay calculator',
    card: 'Net holiday pay, Christmas pay and bonuses month by month, including joining, leaving and raises.',
    title: 'Holiday and Christmas Pay Austria 2026: Net Calculator',
    description: `Holiday and Christmas pay in Austria 2026: on ${EN.eur(B)} gross, ${EN.eur(szNetto(uzStd), 2)} of the June holiday pay reaches you. Covers joining, leaving, bonuses, year-end checks.`,
    h1: 'Net holiday pay and Christmas pay in Austria',
    intro: 'The calculator walks through your year month by month and shows how much of each extra salary actually reaches your account.',
    resume: `On a gross salary of ${EN.eur(B)} a month, the June holiday pay (Urlaubszuschuss) leaves you ${EN.eur(szNetto(uzStd), 2)} net in 2026 and the November Christmas pay (Weihnachtsremuneration) ${EN.eur(szNetto(wrStd), 2)}. These two special payments (Sonderzahlungen), often called the 13th and 14th salary, are taxed far more lightly than regular pay. The gap between them comes from a yearly tax-free amount of ${EN.eur(S.freibetrag)} that the first special payment of the year uses up; after that, each euro is taxed at ${EN.pct(S.stufen[1][1])} once health, pension and unemployment insurance have been deducted. The chamber levy and housing levy do not apply. That simple picture only holds if your salary stays the same all year. Join in September, leave before Christmas, receive a December bonus or a raise in autumn, and the split between the flat rate and the normal scale shifts. A ${EN.eur(PRAEMIE)} bonus in December on top of two full special payments, for instance, leaves only ${EN.eur(szNetto(prDez), 2)}. The calculator models each month separately and runs the year-end control calculation under section 77(4a) of the Income Tax Act.`,
    faqs: [
      { q: 'Why is my Christmas pay lower net than my holiday pay?', a: `Because the ${EN.eur(S.freibetrag)} tax-free amount applies once a year and is used by the first special payment, usually the June holiday pay. On ${EN.eur(B)} gross you pay ${EN.eur(uzStd.lstSzFest, 2)} of wage tax on the holiday pay and ${EN.eur(wrStd.lstSzFest, 2)} on the Christmas pay. Social insurance is the same on both. Nothing is wrong with your November payslip.` },
      { q: 'How much Christmas pay do I keep if I only started work in Austria in the autumn?', a: `If you start on 1 September on ${EN.eur(B)} gross, a pro-rata Christmas pay, as many collective agreements provide, comes to ${EN.eur(anteilWr)}, of which ${EN.eur(szNetto(hAnteil.monate[10]), 2)} is net. If they pay a full one, part of it exceeds the December control sixth and is taxed again: ${EN.eur(hVoll.kontrolle.mehrsteuer, 2)} extra on ${EN.eur(hVoll.kontrolle.ueberhang)}. Your collective agreement (Kollektivvertrag) sets the pro-rata share.` },
      { q: 'How is a year-end bonus taxed on top of holiday and Christmas pay?', a: `After two full special payments the annual sixth is usually used up. A ${EN.eur(PRAEMIE)} bonus in December is then taxed like regular pay on the normal scale: ${EN.eur(prDez.lstSzTarif, 2)} wage tax and ${EN.eur(prDez.svSz, 2)} social insurance, leaving ${EN.eur(szNetto(prDez), 2)}. An employee bonus (Mitarbeiterprämie) of up to ${EN.eur(P.mitarbeiterpraemie_2026_max)} paid between July and December 2026 under a collective or works agreement is tax-free instead.` },
      { q: 'Do I owe extra tax on special payments if I leave my job before Christmas?', a: `No. If the employment ends and you do not start again with the same employer or group in that year, the year-end recalculation that would tax the excess is waived (section 77(4a)). In the example of leaving at the end of September with a pro-rata Christmas pay of ${EN.eur(anteilAus)}, it would otherwise have cost ${EN.eur(aOhne.kontrolle.mehrsteuer, 2)}. Just set the leaving month in the calculator.` },
    ],
    body: (h) => `
<h2>What you enter</h2>
<p>The calculator asks for your monthly gross salary, any raise and the month it starts, the months you joined and left, the amount and month of holiday pay and Christmas pay, a bonus and regular overtime. It then builds twelve monthly payslips. For each special payment you see how much fits within the annual sixth (Jahressechstel), what lies above it, which social insurance applies (without the chamber and housing levies) and the tax. You type in the amounts yourself, because their size and any pro-rata share come from your collective agreement, not from tax law.</p>
<h2>A normal year as the baseline</h2>
${h.table(['Payment', 'Gross', 'Social insurance', 'Wage tax', 'Net'], [
  ['Holiday pay, June', h.eur(uzStd.sz), h.eur(uzStd.svSz, 2), h.eur(uzStd.lstSzFest, 2), h.eur(szNetto(uzStd), 2)],
  ['Christmas pay, November', h.eur(wrStd.sz), h.eur(wrStd.svSz, 2), h.eur(wrStd.lstSzFest, 2), h.eur(szNetto(wrStd), 2)],
], `${h.eur(B)} gross all year, workplace outside Vienna, no children`, ['l', 'r', 'r', 'r', 'r'])}
<p>Both payments sit entirely within the sixth and follow the fixed rates of ${h.src('estg67', 'section 67(1) of the Income Tax Act')}: ${h.eur(h.P.sonderzahlungen.freibetrag)} free, then ${h.pct(h.P.sonderzahlungen.stufen[1][1])}. The ${h.a('jahressechstel', 'annual sixth page')} explains how the ceiling itself is built; this page is about the years that do not run smoothly.</p>
<h2>Joining in the autumn</h2>
<p>If you start on 1 September, by November you have received three salaries. The sixth is still scaled up to a full year and stands at ${h.eur(hVoll.monate[10].sechstel)}, so the Christmas pay fits. The reckoning comes in December: the control sixth only counts the four salaries actually paid, ${h.eur(hVoll.sechstelEnde)}.</p>
${h.table(['Christmas pay', 'Gross', 'Net in November', 'Extra tax in December'], [
  ['pro rata', h.eur(anteilWr), h.eur(szNetto(hAnteil.monate[10]), 2), h.eur(hAnteil.kontrolle.mehrsteuer, 2)],
  ['full', h.eur(B), h.eur(szNetto(hVoll.monate[10]), 2), h.eur(hVoll.kontrolle.mehrsteuer, 2)],
], `Joining on 1 September, ${h.eur(B)} gross a month`, ['l', 'r', 'r', 'r'])}
<p>A generous full Christmas pay after a short employment is therefore worth less than the November payslip suggests. Joining is not one of the exceptions in ${h.src('estg77', 'section 77(4a)')}; leaving is.</p>
<h2>Leaving before Christmas</h2>
<p>When you leave at the end of September, the pro-rata Christmas pay comes with the final payslip, ${h.eur(anteilAus)} in the example. It fits into the scaled-up September sixth and costs ${h.eur(aMit.monate[AUS - 1].lstSzFest, 2)} of wage tax. The control sixth based on nine salaries would be smaller, but because the employment ends the law waives the ${h.eur(aOhne.kontrolle.mehrsteuer, 2)} of extra tax. If you rejoin the same employer or group in the same year, the exception falls away. The ${h.a('abfertigung', 'severance calculator')} covers the rest of a final settlement.</p>
<h2>A bonus in December</h2>
<p>A performance or year-end bonus on top of two full special payments no longer fits into the sixth. The ${h.eur(PRAEMIE)} are taxed in December on the normal scale, costing ${h.eur(prDez.lstSzTarif, 2)} of wage tax, around ${h.pct(prDez.lstSzTarif / (PRAEMIE - prDez.svSz))} of the amount after social insurance. The 2026 employee bonus works differently: up to ${h.eur(h.P.mitarbeiterpraemie_2026_max)} paid between July and December under a collective or works agreement is tax-free and does not use up the sixth (${h.src('estg124b', 'section 124b')}). If your employer can choose how to pay you, that route is worth asking about.</p>
<h2>Raises and overtime</h2>
<p>A raise in autumn makes the sixth lag behind, so Christmas pay at the new salary may not fit entirely, and the December control calculation returns most of the extra tax. Regular overtime works the other way: it enlarges the sixth and leaves room for a bonus. Enter both in the calculator. The ${h.a('gehaltserhoehung', 'pay rise page')} shows the effect of a raise over the whole year, and the guide to the ${h.a('dreizehntes-gehalt', '13th and 14th salary')} explains what your contract should say.</p>
`,
  },
});
