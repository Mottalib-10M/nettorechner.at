import { defineGuide } from '../../lib/guide-types';
import { arbeitslosengeld } from '../../lib/engine/leistungen';
import { AK_ZEILEN, AK_MITTEL, AK_MAX } from '../../lib/pruefung';
import ak from '../../../tests/fixtures/ak-alg-2026.json';
import { P, DE, EN } from '../../lib/fmt';

const A = P.alg;
/** Beispiele aus dem Motor: 3.000 € ohne Angehörige, 2.000 € mit und ohne zwei Angehörige, Deckel ab 6.000 €. */
const b3 = arbeitslosengeld(3000);
const b2 = arbeitslosengeld(2000), b2f = arbeitslosengeld(2000, 2);
const hoch = arbeitslosengeld(7000);
const richtsatzTag = A.ausgleichszulage_richtsatz / 30;
const STUFEN = [1500, 2000, 2500, 3000, 4000, 5000, 6000];
const zeilen = STUFEN.map((b) => ({ b, r: arbeitslosengeld(b) }));
/** Abgleich: Zeilen der AK-Tabelle (Antrag März 2026) neben unserem Tagsatz. */
const VERGLEICH = [1500, 2000, 3000, 4000].map((b) => {
  const z = ak.zeilen.find((x) => x.brutto === b)!;
  return { b, ak: z.tagsatz, wir: arbeitslosengeld(b).tagsatz };
});

export default defineGuide({
  id: 'arbeitslosengeld',
  group: 'rechner',
  order: 60,
  tool: 'alg',
  related: ['arbeitslosengeld-dauer', 'notstandshilfe', 'zuverdienst-arbeitslos', 'abfertigung', 'netto-2000', 'method'],
  sources: ['alvg21', 'amsWerte', 'akAlv', 'ogvAlg'],
  de: {
    slug: 'arbeitslosengeld-rechner',
    nav: 'Arbeitslosengeld-Rechner',
    card: 'Tagsatz nach § 21 AlVG: Grundbetrag, Ergänzungsbetrag, Familienzuschlag und Deckel 2026.',
    title: 'Arbeitslosengeld 2026: Tagsatz vom Brutto zum AMS-Betrag',
    description: `Arbeitslosengeld-Rechner 2026: Tagsatz aus dem Brutto plus 1/6, ${DE.pct(A.grundbetrag_quote)} des fiktiven Nettos samt Ergänzungsbetrag, Familienzuschlag und Deckel bei ${DE.eur(A.hoechstbemessung_monat)}.`,
    h1: 'Arbeitslosengeld 2026 berechnen: der Tagsatz des AMS',
    intro: 'Wie das AMS aus Ihren gespeicherten Beitragsgrundlagen einen Tagsatz macht, Schritt für Schritt und mit der Tabelle der Arbeiterkammer abgeglichen.',
    resume: `Wer zuletzt ${DE.eur(3000)} brutto im Monat verdient hat, bekommt 2026 rund ${DE.eur(b3.tagsatz, 2)} Arbeitslosengeld pro Tag, für 30 Tage gerechnet ${DE.eur(b3.monat30, 2)}. Das AMS rechnet nach § 21 AlVG: Es nimmt die zwölf letzten gespeicherten monatlichen Beitragsgrundlagen vor der einjährigen Berichtigungsfrist, schlägt pauschal ein Sechstel für Urlaubs- und Weihnachtsgeld auf, zieht davon Sozialversicherung und Lohnsteuer eines alleinstehenden Angestellten ab und zahlt ${DE.pct(A.grundbetrag_quote)} dieses fiktiven Nettos als Grundbetrag. Berücksichtigt wird das Einkommen höchstens bis zur Höchstbemessungsgrundlage von ${DE.eur(A.hoechstbemessung_monat)} im Monat, deshalb endet der Tagsatz ohne Angehörige bei ${DE.eur(hoch.tagsatz, 2)}. Bei kleinen Einkommen hebt ein Ergänzungsbetrag den Tagsatz in Richtung ${DE.eur(richtsatzTag, 2)}, höchstens auf ${DE.pct(A.ergaenzung_quote_ohne_fz)} des Nettos, mit Familienzuschlag auf ${DE.pct(A.ergaenzung_quote_mit_fz)}. Je unterhaltener Person kommen ${DE.eur(A.familienzuschlag_tag, 2)} am Tag dazu. Unser Motor trifft die ${AK_ZEILEN} Zeilen der Tabelle der Arbeiterkammer im Mittel auf ${DE.pct(AK_MITTEL, 2)} genau.`,
    faqs: [
      { q: 'Warum rechnet das AMS das Arbeitslosengeld nicht mit meinem letzten Gehalt?', a: 'Weil Beitragsgrundlagen ein Jahr lang berichtigt werden dürfen. Das AMS nimmt deshalb die zwölf letzten Monate, die vor dieser Berichtigungsfrist liegen, also grob die Monate 13 bis 24 vor dem Antrag (§ 21 Abs. 1 AlVG). Eine Gehaltserhöhung aus dem letzten Jahr wirkt sich daher noch nicht aus, eine Kürzung durch Teilzeit ebenso wenig. Monate mit Krankengeld, Kinderbetreuungsgeld oder Pflegekarenz werden übersprungen.' },
      { q: 'Wie hoch ist das Arbeitslosengeld 2026 höchstens?', a: `Ohne Angehörige ${DE.eur(hoch.tagsatz, 2)} am Tag, das sind ${DE.eur(hoch.monat30)} für 30 Tage. Die Grenze kommt aus der Höchstbemessungsgrundlage von ${DE.eur(A.hoechstbemessung_monat)} brutto im Monat inklusive Sonderzahlungen; das AlVG nimmt dafür die Höchstbeitragsgrundlage von vor drei Jahren. Wer mehr verdient hat, bekommt nicht mehr. Familienzuschläge von ${DE.eur(A.familienzuschlag_tag, 2)} je Person kommen noch dazu.` },
      { q: 'Was ist der Ergänzungsbetrag beim Arbeitslosengeld?', a: `Ein Aufschlag für kleine Einkommen. Liegt der Grundbetrag unter dem Ausgleichszulagenrichtsatz von ${DE.eur(A.ausgleichszulage_richtsatz, 2)} im Monat, also ${DE.eur(richtsatzTag, 2)} am Tag, wird aufgestockt, aber nur bis ${DE.pct(A.ergaenzung_quote_ohne_fz)} des fiktiven Nettos, mit Familienzuschlägen bis ${DE.pct(A.ergaenzung_quote_mit_fz)}. Bei ${DE.eur(2000)} brutto ohne Angehörige macht er ${DE.eur(b2.ergaenzung, 2)} am Tag aus.` },
      { q: 'Für wen gibt es den Familienzuschlag zum Arbeitslosengeld?', a: `Für Kinder, Enkel, Stief-, Wahl- und Pflegekinder mit Familienbeihilfe, zu deren Unterhalt Sie wesentlich beitragen, je ${DE.eur(A.familienzuschlag_tag, 2)} am Tag. Für Ehe- oder Lebenspartner gibt es ihn nur, wenn zugleich für mindestens ein minderjähriges Kind oder eine behinderte Person ein Zuschlag zusteht. Arbeitslosengeld samt Zuschlägen darf ${DE.pct(A.ergaenzung_quote_mit_fz)} des fiktiven Nettoeinkommens nie überschreiten.` },
      { q: 'Behalte ich ab 45 meine frühere Bemessung für das Arbeitslosengeld?', a: 'Ja. Wer das 45. Lebensjahr vollendet hat, behält bei jedem weiteren Anspruch das monatliche Brutto der früheren Bemessung, bis ein höheres vorliegt (§ 21 Abs. 8 AlVG). Wer nach einer Arbeitslosigkeit einen schlechter bezahlten Job annimmt und ihn wieder verliert, fällt also nicht auf das niedrigere Gehalt zurück. Im Rechner tragen Sie in diesem Fall das frühere Brutto ein.' },
    ],
    body: (h) => `
<h2>Was der Rechner ausgibt</h2>
<p>Sie tragen Ihr durchschnittliches Monatsbrutto ohne Sonderzahlungen ein, die Zahl der Angehörigen, für die Ihnen ein Familienzuschlag zusteht, Ihr Alter und die versicherten Jahre. Heraus kommen der Tagsatz mit allen Bausteinen, der Betrag für 30 Tage, die Bezugsdauer in Wochen und der Tagsatz der Notstandshilfe, die danach folgen kann. Die Dauer erklärt die Seite zur ${h.a('arbeitslosengeld-dauer', 'Bezugsdauer des Arbeitslosengeldes')}, die Anschlussleistung die Seite zur ${h.a('notstandshilfe', 'Notstandshilfe')}.</p>
<h2>Vom Brutto zum Tagsatz in vier Schritten</h2>
<ol>
<li><strong>Bemessung:</strong> laufendes Brutto plus ein Sechstel für Sonderzahlungen. Aus ${h.eur(3000)} werden ${h.eur(b3.bemessungMonat, 2)}, gedeckelt bei ${h.eur(h.P.alg.hoechstbemessung_monat)} (${h.src('amsWerte', 'AMS, Maßgebliche Werte 2026')}).</li>
<li><strong>Fiktives Netto:</strong> Davon gehen die Abgaben eines alleinstehenden Angestellten ab, ohne Freibeträge, die einen Antrag brauchen. Mal zwölf, geteilt durch 365, ergibt ${h.eur(b3.nettoTag, 2)} am Tag.</li>
<li><strong>Grundbetrag:</strong> ${h.pct(h.P.alg.grundbetrag_quote)} davon, kaufmännisch auf den Cent gerundet: ${h.eur(b3.grundbetrag, 2)}.</li>
<li><strong>Zuschläge:</strong> Ergänzungsbetrag bei kleinen Einkommen, Familienzuschläge je Angehörigem. Bei ${h.eur(3000)} ohne Angehörige bleibt es beim Grundbetrag.</li>
</ol>
<p>So steht es in ${h.src('alvg21', '§ 21 Abs. 3 AlVG')}. Der Rechner zeigt jeden Schritt einzeln, damit Sie Ihren Bescheid Zeile für Zeile nachvollziehen können.</p>
<h2>Tagsätze 2026 nach Monatsbrutto</h2>
${h.table(['Brutto im Monat', 'Bemessung mit 1/6', 'Tagsatz', 'für 30 Tage'], zeilen.map(({ b, r }) => [h.eur(b), h.eur(r.bemessungMonat, 2), h.eur(r.tagsatz, 2), h.eur(r.monat30, 2)]), 'Arbeitslosengeld ohne Angehörige, Antrag 2026, aus unserem Motor', ['r', 'r', 'r', 'r'])}
<p>Ab einem laufenden Brutto von ${h.eur(h.P.alg.hoechstbemessung_monat * 6 / 7, 2)} greift der Deckel: Mehr Einkommen erhöht den Tagsatz nicht mehr.</p>
<h2>Ergänzungsbetrag und Familienzuschlag am Beispiel</h2>
<p>Bei ${h.eur(2000)} brutto ergibt sich ein fiktives Netto von ${h.eur(b2.nettoTag, 2)} am Tag und ein Grundbetrag von ${h.eur(b2.grundbetrag, 2)}. Weil das unter dem Richtsatz liegt, kommt ein Ergänzungsbetrag von ${h.eur(b2.ergaenzung, 2)} dazu, bis ${h.pct(h.P.alg.ergaenzung_quote_ohne_fz)} des Nettos: Tagsatz ${h.eur(b2.tagsatz, 2)}. Mit zwei Angehörigen darf bis ${h.pct(h.P.alg.ergaenzung_quote_mit_fz)} aufgestockt werden; der Ergänzungsbetrag steigt auf ${h.eur(b2f.ergaenzung, 2)}, dazu ${h.eur(b2f.familienzuschlag, 2)} Familienzuschläge. Ergebnis: ${h.eur(b2f.tagsatz, 2)} am Tag statt ${h.eur(b2.tagsatz, 2)}. Die Regeln dazu fasst die ${h.src('ogvAlg', 'Seite von oesterreich.gv.at')} zusammen.</p>
<h2>Unser Abgleich mit der Tabelle der Arbeiterkammer</h2>
<p>Die AK Niederösterreich druckt in ihrer ${h.src('akAlv', 'Broschüre Arbeitslosenversicherung 2026')} eine Tabelle mit Richtwerten für einen Antrag im März 2026. Wir haben alle ${AK_ZEILEN} Zeilen nachgerechnet: Die Abweichung beträgt im Mittel ${h.pct(AK_MITTEL, 2)}, höchstens ${h.pct(AK_MAX, 2)}, meist ein bis fünf Cent am Tag.</p>
${h.table(['Brutto im Monat', 'AK-Tabelle', 'unser Rechner'], VERGLEICH.map((v) => [h.eur(v.b), h.eur(v.ak, 2), h.eur(v.wir, 2)]), 'Tagsatz ohne Angehörige, AK-Tabelle Stand 1.3.2026', ['r', 'r', 'r'])}
<p>Die kleinen Unterschiede kommen von Rundungen in der Lohnsteuer auf die Sonderzahlungen. Den genauen Betrag legt nur das AMS fest; die Methode beschreibt die Seite ${h.a('method', 'Berechnungsmethode')}.</p>
<h2>Welche Monate zählen und welche nicht</h2>
<p>Übersprungen werden Kalendermonate, in denen wegen Krankheit, Schwangerschaft oder Beschäftigungslosigkeit nicht das volle Entgelt floss, außerdem Monate mit Kinderbetreuungsgeld, Pflegekarenz, Bildungsteilzeitgeld, Rehabilitations- oder Wiedereingliederungsgeld. Gibt es weniger als zwölf brauchbare Monate, aber mindestens sechs, wird über diese gemittelt. Grundlagen aus dem vorvorigen Kalenderjahr oder früher werden mit dem Aufwertungsfaktor des ASVG erhöht. Wer neben dem Bezug etwas dazuverdienen will, liest vorher die Seite zum ${h.a('zuverdienst-arbeitslos', 'Zuverdienst bei Arbeitslosigkeit')}: Seit Jänner 2026 sind die Regeln deutlich strenger.</p>
`,
  },
  en: {
    slug: 'unemployment-benefit-calculator',
    nav: 'Unemployment benefit calculator',
    card: 'Daily rate under section 21 AlVG: basic amount, top-up, family supplement and the 2026 cap.',
    title: 'Arbeitslosengeld 2026: Austrian Unemployment Daily Rate',
    description: `Arbeitslosengeld calculator 2026: work out your AMS daily rate from gross pay plus 1/6, ${EN.pct(A.grundbetrag_quote)} of notional net, top-up, family supplement and the ${EN.eur(A.hoechstbemessung_monat)} cap.`,
    h1: 'Austrian unemployment benefit 2026: your daily rate',
    intro: 'How the AMS turns your stored contribution records into a daily rate, step by step, checked against the Chamber of Labour table.',
    resume: `If you last earned ${EN.eur(3000)} gross a month, Austrian unemployment benefit (Arbeitslosengeld) in 2026 comes to about ${EN.eur(b3.tagsatz, 2)} a day, or ${EN.eur(b3.monat30, 2)} for 30 days. The AMS, Austria's public employment service, follows section 21 of the Unemployment Insurance Act (AlVG): it takes the last twelve monthly contribution bases stored before the one-year correction period, adds a flat sixth for holiday and Christmas pay, deducts the social insurance and wage tax of a single salaried employee, and pays ${EN.pct(A.grundbetrag_quote)} of that notional net as the basic amount (Grundbetrag). Earnings count only up to the assessment ceiling of ${EN.eur(A.hoechstbemessung_monat)} a month, so the daily rate without dependants tops out at ${EN.eur(hoch.tagsatz, 2)}. Low earners get a top-up (Ergänzungsbetrag) towards ${EN.eur(richtsatzTag, 2)} a day, limited to ${EN.pct(A.ergaenzung_quote_ohne_fz)} of net pay, or ${EN.pct(A.ergaenzung_quote_mit_fz)} with family supplements of ${EN.eur(A.familienzuschlag_tag, 2)} per dependant. Our engine matches the ${AK_ZEILEN} rows of the Chamber of Labour table to within ${EN.pct(AK_MITTEL, 2)} on average.`,
    faqs: [
      { q: 'Why does the AMS ignore my most recent salary for unemployment benefit?', a: 'Contribution records may be corrected for a year after the fact, so the AMS uses the twelve months that lie before that correction window, roughly months 13 to 24 before your claim (section 21(1) AlVG). A raise you got last year therefore does not count yet, and neither does a recent cut to part-time. Months with sick pay, childcare allowance or care leave are skipped altogether.' },
      { q: 'What is the maximum Austrian unemployment benefit in 2026?', a: `Without dependants, ${EN.eur(hoch.tagsatz, 2)} a day, which is ${EN.eur(hoch.monat30)} for 30 days. The limit comes from the assessment ceiling of ${EN.eur(A.hoechstbemessung_monat)} gross a month including special payments, which the law takes from the contribution ceiling of three years earlier. Earning more before you lost your job does not raise it. Family supplements of ${EN.eur(A.familienzuschlag_tag, 2)} per person come on top.` },
      { q: 'How does the low-income top-up to unemployment benefit work?', a: `If the basic amount is below the minimum-income reference rate (Ausgleichszulagenrichtsatz) of ${EN.eur(A.ausgleichszulage_richtsatz, 2)} a month, or ${EN.eur(richtsatzTag, 2)} a day, the AMS adds a top-up, but never beyond ${EN.pct(A.ergaenzung_quote_ohne_fz)} of notional net pay, or ${EN.pct(A.ergaenzung_quote_mit_fz)} if you receive family supplements. At ${EN.eur(2000)} gross with no dependants the top-up is ${EN.eur(b2.ergaenzung, 2)} a day.` },
      { q: 'Which dependants count for the family supplement on unemployment benefit?', a: `Children, grandchildren, stepchildren, adopted and foster children for whom family allowance (Familienbeihilfe) is paid and whose upkeep you substantially fund, at ${EN.eur(A.familienzuschlag_tag, 2)} a day each. A spouse or partner only counts if a supplement is also due for at least one minor child or a disabled person. Benefit plus supplements can never exceed ${EN.pct(A.ergaenzung_quote_mit_fz)} of notional net income.` },
    ],
    body: (h) => `
<h2>What the calculator gives you</h2>
<p>Enter your average monthly gross without special payments (the 13th and 14th salary), the number of dependants who qualify for a family supplement, your age and your insured years. You get the daily rate with each component, the amount for 30 days, the number of weeks you can claim and the daily rate of emergency assistance that may follow. Duration has its own page on ${h.a('arbeitslosengeld-dauer', 'how long benefit lasts')}, and the follow-on benefit is covered under ${h.a('notstandshilfe', 'Notstandshilfe (emergency assistance)')}.</p>
<h2>From gross pay to daily rate</h2>
<ol>
<li><strong>Assessment basis:</strong> regular gross plus one sixth for special payments. ${h.eur(3000)} becomes ${h.eur(b3.bemessungMonat, 2)}, capped at ${h.eur(h.P.alg.hoechstbemessung_monat)} (${h.src('amsWerte', 'AMS reference values 2026')}).</li>
<li><strong>Notional net:</strong> the deductions of a single salaried employee are taken off, ignoring any allowance you would have to apply for. Times twelve, divided by 365: ${h.eur(b3.nettoTag, 2)} a day.</li>
<li><strong>Basic amount:</strong> ${h.pct(h.P.alg.grundbetrag_quote)} of that, rounded to the cent: ${h.eur(b3.grundbetrag, 2)}.</li>
<li><strong>Add-ons:</strong> a top-up for low incomes and family supplements per dependant. At ${h.eur(3000)} with no dependants, the basic amount is the whole benefit.</li>
</ol>
<p>This is the method set out in ${h.src('alvg21', 'section 21(3) AlVG')}. The calculator shows every step separately, so you can check the AMS decision letter (Bescheid) line by line.</p>
<h2>Daily rates 2026 by monthly gross</h2>
${h.table(['Monthly gross', 'Basis incl. 1/6', 'Daily rate', 'For 30 days'], zeilen.map(({ b, r }) => [h.eur(b), h.eur(r.bemessungMonat, 2), h.eur(r.tagsatz, 2), h.eur(r.monat30, 2)]), 'Unemployment benefit without dependants, 2026 claim, from our engine', ['r', 'r', 'r', 'r'])}
<p>From a regular gross of ${h.eur(h.P.alg.hoechstbemessung_monat * 6 / 7, 2)} the ceiling applies and extra salary no longer moves the rate.</p>
<h2>A low earner with a family</h2>
<p>At ${h.eur(2000)} gross, notional net is ${h.eur(b2.nettoTag, 2)} a day and the basic amount ${h.eur(b2.grundbetrag, 2)}. Because that sits below the reference rate, a top-up of ${h.eur(b2.ergaenzung, 2)} is added, up to ${h.pct(h.P.alg.ergaenzung_quote_ohne_fz)} of net: ${h.eur(b2.tagsatz, 2)} a day. With two dependants the ceiling rises to ${h.pct(h.P.alg.ergaenzung_quote_mit_fz)}, the top-up grows to ${h.eur(b2f.ergaenzung, 2)} and ${h.eur(b2f.familienzuschlag, 2)} of family supplements are added, for ${h.eur(b2f.tagsatz, 2)} a day. The government portal ${h.src('ogvAlg', 'oesterreich.gv.at')} summarises these rules in German.</p>
<h2>How we checked the numbers</h2>
<p>The Chamber of Labour in Lower Austria (AK, the statutory employee chamber) prints a reference table for claims made in March 2026 in its ${h.src('akAlv', 'unemployment insurance guide')}. We recalculated all ${AK_ZEILEN} rows: the average gap is ${h.pct(AK_MITTEL, 2)}, the largest ${h.pct(AK_MAX, 2)}, usually one to five cents a day.</p>
${h.table(['Monthly gross', 'AK table', 'Our calculator'], VERGLEICH.map((v) => [h.eur(v.b), h.eur(v.ak, 2), h.eur(v.wir, 2)]), 'Daily rate without dependants, AK table as of 1 March 2026', ['r', 'r', 'r'])}
<p>The small differences come from rounding in the wage tax on special payments. Only the AMS sets the binding amount; the ${h.a('method', 'method page')} explains our assumptions.</p>
<h2>Months that count and months that do not</h2>
<p>Calendar months in which illness, pregnancy or unemployment meant you did not receive full pay are left out, as are months with care leave, educational part-time pay, rehabilitation or reintegration pay. With fewer than twelve usable months but at least six, the AMS averages those. Records from the year before last or earlier are uprated with the ASVG revaluation factor. If you are 45 or older, a higher earlier basis is kept for later claims (section 21(8)). Planning to earn something on the side? Read the page on ${h.a('zuverdienst-arbeitslos', 'side income while unemployed')} first, because the rules became much stricter in January 2026.</p>
`,
  },
});
