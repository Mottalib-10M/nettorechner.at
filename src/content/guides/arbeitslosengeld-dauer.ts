import { defineGuide } from '../../lib/guide-types';
import { algDauer, arbeitslosengeld } from '../../lib/engine/leistungen';
import { P, DE, EN } from '../../lib/fmt';

/** Stufen des § 18 AlVG aus params: [nötige Wochen, Mindestalter, Bezugswochen] und Beobachtungszeitraum in Jahren. */
const A = P.alg;
const ST = A.dauer_wochen as [number, number, number][];
const RJ = A.dauer_rahmen_jahre as number[];
const [W20, W30, W39, W52] = ST.map((s) => s[2]);
const [, B30, B39, B52] = ST.map((s) => s[0]);
const [, , AL39, AL52] = ST.map((s) => s[1]);
/** Beispielpersonen, Dauer aus dem Motor. */
const fall = (alter: number, jahre: number) => ({ alter, jahre, wochen: algDauer(Math.round(jahre * 52), alter) });
const F = [fall(24, 2), fall(36, 4), fall(45, 7), fall(45, 5), fall(55, 10)];
/** Was die Dauer in Euro bedeutet: Arbeitslosengeld bei 3.000 € brutto (Motor, ohne Familienzuschlag). */
const alg = arbeitslosengeld(3000);
const summe = (w: number) => alg.tagsatz * w * 7;
const jahre = (w: number) => w / 52;

export default defineGuide({
  id: 'arbeitslosengeld-dauer',
  group: 'leistungen',
  order: 10,
  mini: 'algDauer',
  miniHref: 'arbeitslosengeld',
  related: ['arbeitslosengeld', 'notstandshilfe', 'zuverdienst-arbeitslos', 'abfertigung', 'netto-brutto'],
  sources: ['alvg18', 'alvg14', 'akAlv'],
  de: {
    slug: 'arbeitslosengeld-bezugsdauer',
    nav: 'Bezugsdauer Arbeitslosengeld',
    card: `${W20}, ${W30}, ${W39} oder ${W52} Wochen: welche Versicherungszeiten und welches Alter die Dauer bestimmen.`,
    title: `Arbeitslosengeld Bezugsdauer 2026: ${W20} bis ${W52} Wochen beim AMS`,
    description: `Arbeitslosengeld Bezugsdauer 2026: ${W20} Wochen Grundanspruch, ${W30} ab ${B30} Versicherungswochen, ${W39} ab ${AL39}, ${W52} ab ${AL52} Jahren. Mit Anwartschaft, Sperre und Schulungen.`,
    h1: 'Wie lange es Arbeitslosengeld gibt',
    intro: 'Die vier Stufen des § 18 AlVG, die Anwartschaft davor und die Fälle, in denen sich die Dauer verlängert, verschiebt oder verkürzt.',
    resume: `Arbeitslosengeld gibt es in Österreich 2026 für ${W20} Wochen, wenn nur die Anwartschaft erfüllt ist. ${W30} Wochen bekommt, wer vor dem Antrag ${B30} Wochen arbeitslosenversicherungspflichtig beschäftigt war, also rund ${DE.num(jahre(B30))} Jahre. Auf ${W39} Wochen steigt die Dauer ab dem ${AL39}. Geburtstag, wenn in den letzten ${RJ[2]} Jahren ${B39} Versicherungswochen liegen, auf ${W52} Wochen ab dem ${AL52}. Geburtstag mit ${B52} Wochen in den letzten ${RJ[3]} Jahren (§ 18 AlVG). Davor steht die Anwartschaft: beim ersten Antrag ${A.anwartschaft_wochen} Wochen Beschäftigung in ${A.anwartschaft_rahmenfrist_monate} Monaten, unter ${A.anwartschaft_u25_alter} Jahren ${A.anwartschaft_u25_wochen} Wochen in ${A.anwartschaft_u25_rahmenfrist_monate} Monaten, bei jedem weiteren Antrag ${A.anwartschaft_weitere_wochen} Wochen in ${A.anwartschaft_weitere_rahmenfrist_monate} Monaten (§ 14 AlVG). Eine Selbstkündigung sperrt das Geld für ${A.sperre_selbstkuendigung_wochen} Wochen, kürzt die Bezugsdauer aber nicht; dasselbe gilt für das Ruhen während einer Urlaubsersatzleistung. Schulungen des AMS verlängern die Dauer um die Kurszeit. Bei ${DE.eur(3000)} brutto ergibt der Unterschied zwischen ${W20} und ${W39} Wochen rund ${DE.eur(summe(W39) - summe(W20))} Arbeitslosengeld.`,
    faqs: [
      { q: 'Wie lange bekomme ich Arbeitslosengeld, wenn ich erst zwei Jahre gearbeitet habe?', a: `${W20} Wochen. Zwei Jahre sind rund ${DE.num(104)} Versicherungswochen, für ${W30} Wochen verlangt § 18 AlVG aber ${B30} Wochen arbeitslosenversicherungspflichtige Beschäftigung vor dem Antrag. Gezählt werden alle Zeiten, die auch für die Anwartschaft gelten, etwa Lehrzeit, Krankengeld oder Wochengeld. Kinderbetreuungsgeld und Präsenzdienst zählen nur, wenn in der Rahmenfrist mindestens ${A.anwartschaft_kbg_praesenz_mind_wochen} Wochen sonstige Zeiten liegen.` },
      { q: 'Verkürzt eine Selbstkündigung die Bezugsdauer des Arbeitslosengeldes?', a: `Nein. Wer ohne triftigen Grund selbst kündigt, ungerechtfertigt austritt oder berechtigt entlassen wird, bekommt ${A.sperre_selbstkuendigung_wochen} Wochen ab dem Ende des Dienstverhältnisses kein Arbeitslosengeld. Die ${W20} oder ${W30} Wochen bleiben aber vollständig erhalten, sie verschieben sich nur nach hinten. Eine einvernehmliche Auflösung löst keine Sperre aus. Laut AK verlängert sich die Sperre nicht, wenn gleichzeitig Urlaubsersatzleistung oder Krankengeld läuft.` },
      { q: 'Zählen Jobs im EU-Ausland für die Bezugsdauer des Arbeitslosengeldes?', a: `Ja, Beschäftigungszeiten in EU-Staaten werden angerechnet, soweit die EU-Verordnung das vorsieht (§ 14 Abs. 5 AlVG); für einige weitere Staaten wie Serbien gibt es Abkommen. Die letzte Beschäftigung muss laut AK aber in Österreich gewesen sein. Wer etwa ${DE.num(B30)} Wochen aus Deutschland und Österreich zusammen nachweist, kommt so auf ${W30} statt ${W20} Wochen. Für die Höhe zählt dagegen nur das in Österreich verdiente Entgelt.` },
      { q: 'Verlängert ein AMS-Kurs die Bezugsdauer des Arbeitslosengeldes?', a: `Ja. Nach § 18 Abs. 4 AlVG verlängert sich die Bezugsdauer um die Zeit, in der Sie an einer Schulung oder Maßnahme zur Wiedereingliederung teilnehmen. Die Kurswochen werden also nicht vom Anspruch abgezogen. In einer anerkannten Arbeitsstiftung ist eine Verlängerung um bis zu ${A.stiftung_verlaengerung_wochen} Wochen möglich, bei längerer gesetzlich geregelter Ausbildung bis ${A.stiftung_verlaengerung_max_wochen} Wochen; der Betrieb zahlt dann einen Zuschuss.` },
      { q: 'Was passiert mit den restlichen Wochen Arbeitslosengeld, wenn ich vorher wieder Arbeit finde?', a: `Sie verfallen nicht sofort. Ist die Höchstdauer nicht ausgeschöpft, können Sie den Rest als Fortbezug beantragen, wenn das innerhalb von ${A.fortbezug_frist_jahre} Jahren ab dem letzten Bezugstag geschieht. Bei einer Unterbrechung unter ${A.wiedermeldung_tage} Tagen genügt eine elektronische oder telefonische Wiedermeldung, danach braucht es einen neuen Antrag. Neue Beschäftigung von genug Wochen kann stattdessen einen neuen, eigenen Anspruch begründen.` },
      { q: 'Ab welchem Alter gibt es 52 Wochen Arbeitslosengeld?', a: `Ab dem vollendeten ${AL52}. Lebensjahr am Tag der Geltendmachung, und nur mit ${B52} Wochen arbeitslosenversicherungspflichtiger Beschäftigung in den letzten ${RJ[3]} Jahren, das sind rund ${DE.num(jahre(B52))} Jahre. Wer mit ${AL52} diese Zeiten nicht hat, prüft die nächste Stufe: ${W39} Wochen ab ${AL39} mit ${B39} Wochen in ${RJ[2]} Jahren. Maßgeblich ist das Alter beim Antrag, nicht beim Jobverlust.` },
    ],
    body: (h) => `
<h2>Die vier Stufen des § 18 AlVG</h2>
<p>Die Bezugsdauer hängt an zwei Dingen: wie viele Wochen Sie vor dem Antrag arbeitslosenversicherungspflichtig gearbeitet haben und wie alt Sie bei der Geltendmachung sind. Das Gehalt spielt keine Rolle. Die Stufen stehen in ${h.src('alvg18', '§ 18 AlVG')}, die AK fasst sie in ihrer ${h.src('akAlv', 'Broschüre Arbeitslosenversicherung 2026')} gleich zusammen.</p>
${h.table(['Bezugsdauer', 'in Tagen', 'nötige Versicherungswochen', 'Zeitraum', 'Alter beim Antrag'], [
  [`${h.num(W20)} Wochen`, h.num(W20 * 7), 'Anwartschaft erfüllt', '–', '–'],
  [`${h.num(W30)} Wochen`, h.num(W30 * 7), `${h.num(B30)} (rund ${h.num(jahre(B30))} Jahre)`, 'gesamtes Berufsleben', '–'],
  [`${h.num(W39)} Wochen`, h.num(W39 * 7), `${h.num(B39)} (rund ${h.num(jahre(B39))} Jahre)`, `letzte ${h.num(RJ[2])} Jahre`, `ab ${h.num(AL39)}`],
  [`${h.num(W52)} Wochen`, h.num(W52 * 7), `${h.num(B52)} (rund ${h.num(jahre(B52))} Jahre)`, `letzte ${h.num(RJ[3])} Jahre`, `ab ${h.num(AL52)}`],
], 'Bezugsdauer nach § 18 Abs. 1 und 2 AlVG', ['l', 'r', 'l', 'l', 'l'])}
<p>Nach einer abgeschlossenen beruflichen Rehabilitation aus der Sozialversicherung erhöht sich die Dauer auf ${h.num(A.dauer_reha_wochen)} Wochen (§ 18 Abs. 2 lit. c). Für alle anderen gilt die Tabelle.</p>
<h2>Fünf Lebensläufe, fünf Ergebnisse</h2>
${h.table(['Person', 'Alter', 'Versicherungsjahre', 'Bezugsdauer'], F.map((f, i) => [String.fromCharCode(65 + i), h.num(f.alter), h.num(f.jahre), `${h.num(f.wochen)} Wochen`]), 'Ergebnis des Rechners auf dieser Seite; Jahre jeweils im maßgeblichen Zeitraum', ['l', 'r', 'r', 'r'])}
<p>Person D zeigt die Falle der Altersstufen: Mit ${h.num(F[3].alter)} Jahren hat sie zwar das Alter für ${h.num(W39)} Wochen, aber nur ${h.num(F[3].jahre)} Versicherungsjahre im Zehnjahreszeitraum. Es bleibt bei ${h.num(F[3].wochen)} Wochen. Wer in den letzten Jahren selbständig war, im Ausland ohne Abkommen gearbeitet oder lange studiert hat, fällt oft genau hier eine Stufe tiefer.</p>
<h2>Erst die Anwartschaft, dann die Dauer</h2>
<p>Bevor die Dauer überhaupt zählt, muss die Anwartschaft nach ${h.src('alvg14', '§ 14 AlVG')} erfüllt sein. Beim ersten Arbeitslosengeld sind das ${h.num(A.anwartschaft_wochen)} Wochen arbeitslosenversicherungspflichtige Beschäftigung in den letzten ${h.num(A.anwartschaft_rahmenfrist_monate)} Monaten. Wer den Antrag vor dem ${h.num(A.anwartschaft_u25_alter)}. Geburtstag stellt, braucht nur ${h.num(A.anwartschaft_u25_wochen)} Wochen in ${h.num(A.anwartschaft_u25_rahmenfrist_monate)} Monaten. Bei jedem weiteren Bezug reichen ${h.num(A.anwartschaft_weitere_wochen)} Wochen in ${h.num(A.anwartschaft_weitere_rahmenfrist_monate)} Monaten.</p>
<p>Der Unterschied zwischen beiden Rechnungen ist im Alltag wichtig. Für die Anwartschaft wird jede Zeit nur einmal verwendet: Wer einen Anspruch ausgeschöpft hat, muss neue Wochen sammeln. Für die Bezugsdauer zählen dagegen alle anrechenbaren Zeiten im jeweiligen Zeitraum, auch solche, die schon einmal einen Anspruch begründet haben. Die Rahmenfrist der Anwartschaft verlängert sich um Ausbildung, Präsenz- oder Zivildienst und andere Zeiten, meist um höchstens ${h.num(A.rahmenfrist_verlaengerung_max_jahre)} Jahre, um Kinderbetreuungsgeld oder Krankengeld sogar unbegrenzt. Die ${h.num(RJ[2])} und ${h.num(RJ[3])} Jahre der Bezugsdauer lassen sich laut AK nicht verlängern.</p>
<!--mini:alg-->
<h2>Was die Dauer verschiebt, aber nicht kürzt</h2>
<h3>Sperre nach Selbstkündigung</h3>
<p>Endet das Dienstverhältnis durch Ihre Kündigung, einen unberechtigten Austritt oder eine verschuldete Entlassung, gibt es ${h.num(A.sperre_selbstkuendigung_wochen)} Wochen kein Geld. Das gilt auch, wenn Sie in der Probezeit selbst gehen. Die ${h.num(A.sperre_selbstkuendigung_wochen * 7)} Tage werden aber nicht von Ihrem Anspruch abgezogen: Wer ${h.num(W30)} Wochen zusteht, bekommt auch nach der Sperre ${h.num(W30)} Wochen, nur beginnt die Auszahlung später. Bei einer einvernehmlichen Auflösung gibt es keine Sperre.</p>
<h3>Ruhen während der Urlaubsersatzleistung</h3>
<p>Wird offener Urlaub bei Ende des Dienstverhältnisses ausbezahlt, läuft die Versicherung um diese Tage weiter, und das Arbeitslosengeld ruht. Ruhen heißt: in dieser Zeit wird nichts ausbezahlt, der Gesamtanspruch bleibt gleich. Dasselbe gilt bei Krankengeld, Kündigungsentschädigung, einem nicht bewilligten Auslandsaufenthalt oder Präsenzdienst. Stellen Sie den Antrag trotzdem sofort, frühestens ${h.num(A.antrag_vorab_wochen)} Wochen vor dem letzten Arbeitstag: Arbeitslosengeld wird nicht rückwirkend ausbezahlt.</p>
<h2>Was die Dauer verlängert</h2>
<p>Die Zeit einer Schulung oder Wiedereingliederungsmaßnahme hängt sich an die Bezugsdauer an (§ 18 Abs. 4). In einer anerkannten Arbeitsstiftung kann sich der Bezug um bis zu ${h.num(A.stiftung_verlaengerung_wochen)} Wochen verlängern, bei gesetzlich längerer Ausbildung oder ab ${h.num(AL52)} Jahren um bis zu ${h.num(A.stiftung_verlaengerung_max_wochen)} Wochen insgesamt (§ 18 Abs. 5).</p>
<h2>Was die Dauer tatsächlich verkürzt</h2>
<p>Anders als die Sperre kostet ein Anspruchsverlust echte Wochen. Wer eine zumutbare Stelle ablehnt, keine Bemühungen nachweist oder eine Schulung vereitelt, verliert ${h.num(A.anspruchsverlust_wochen)} Wochen, bei jeder weiteren Weigerung ${h.num(A.anspruchsverlust_wiederholt_wochen)} Wochen. Eine versäumte Kontrollmeldung sperrt das Geld bis zur Wiedermeldung; verloren gehen dabei höchstens ${h.num(A.wiedermeldung_tage)} Tage.</p>
<h2>Was die Dauer in Euro bedeutet</h2>
<p>Bei ${h.eur(3000)} brutto im Monat beträgt das Arbeitslosengeld ${h.eur(alg.tagsatz, 2)} am Tag. Über die Bezugsdauer summiert sich das so:</p>
${h.table(['Bezugsdauer', 'Summe Arbeitslosengeld'], [W20, W30, W39, W52].map((w) => [`${h.num(w)} Wochen`, h.eur(summe(w))]), `Tagsatz ${h.eur(alg.tagsatz, 2)} bei ${h.eur(3000)} brutto, ohne Familienzuschlag`, ['l', 'r'])}
<p>Die Dauer wirkt auch nach dem Ende weiter. Die ${h.a('notstandshilfe', 'Notstandshilfe')} wird nach sechs Monaten gedeckelt, wenn vorher nur ${h.num(W20)} oder ${h.num(W30)} Wochen Arbeitslosengeld zustanden; nach ${h.num(W39)} oder ${h.num(W52)} Wochen gibt es keinen Deckel. Ab ${h.num(A.nh_laengste_dauer_ab_alter)} zählt dafür die längste je zuerkannte Bezugsdauer (§ 36 Abs. 5 AlVG). Ihre Tageshöhe rechnet der ${h.a('arbeitslosengeld', 'Arbeitslosengeld-Rechner')} aus.</p>
`,
  },
  en: {
    slug: 'unemployment-benefit-duration',
    nav: 'Unemployment benefit duration',
    card: `${W20}, ${W30}, ${W39} or ${W52} weeks: how insured weeks and age set the length of Austrian unemployment benefit.`,
    title: `Unemployment Benefit Duration Austria 2026: ${W20} to ${W52} Weeks`,
    description: `Unemployment benefit duration in Austria 2026: ${W20} weeks basic, ${W30} after ${B30} insured weeks, ${W39} from age ${AL39}, ${W52} from ${AL52}. Qualifying period and AMS rules.`,
    h1: 'How long Austrian unemployment benefit lasts',
    intro: 'The four tiers of section 18 of the Unemployment Insurance Act, the qualifying period before them, and what delays, extends or cuts your claim.',
    resume: `Austrian unemployment benefit (Arbeitslosengeld, paid by the AMS public employment service) lasts ${W20} weeks in 2026 if you only just meet the qualifying period. You get ${W30} weeks if you worked ${B30} weeks in jobs covered by unemployment insurance before claiming, roughly ${EN.num(jahre(B30))} years. It rises to ${W39} weeks from age ${AL39} with ${B39} insured weeks in the last ${RJ[2]} years, and to ${W52} weeks from age ${AL52} with ${B52} weeks in the last ${RJ[3]} years (section 18 AlVG). Your salary does not affect the length. The qualifying period comes first: ${A.anwartschaft_wochen} weeks in ${A.anwartschaft_rahmenfrist_monate} months for a first claim, ${A.anwartschaft_u25_wochen} weeks in ${A.anwartschaft_u25_rahmenfrist_monate} months under age ${A.anwartschaft_u25_alter}, and ${A.anwartschaft_weitere_wochen} weeks in ${A.anwartschaft_weitere_rahmenfrist_monate} months for any later claim (section 14). Resigning blocks payment for ${A.sperre_selbstkuendigung_wochen} weeks but does not shorten the entitlement, and payment for unused holiday only postpones the start. AMS courses add their length on top. On a ${EN.eur(3000)} gross salary, ${W39} instead of ${W20} weeks is worth about ${EN.eur(summe(W39) - summe(W20))}.`,
    faqs: [
      { q: 'How long is unemployment benefit paid in Austria after two years of work?', a: `${W20} weeks. Two years are about ${EN.num(104)} insured weeks, while ${W30} weeks require ${B30} weeks of employment covered by unemployment insurance before the claim. All periods that count for the qualifying period also count here, such as apprenticeship, sick pay or maternity pay. Childcare allowance and military service only count if the qualifying window also holds at least ${A.anwartschaft_kbg_praesenz_mind_wochen} weeks of other periods.` },
      { q: 'Does quitting my job shorten my Arbeitslosengeld entitlement?', a: `No. If you resign without good reason, leave without justification or are dismissed for misconduct, nothing is paid for the first ${A.sperre_selbstkuendigung_wochen} weeks after the job ends. Your ${W20} or ${W30} weeks stay intact; they simply start later. Ending the job by mutual agreement (einvernehmliche Auflösung) triggers no block. According to the Chamber of Labour, the block does not get longer if holiday compensation or sick pay runs at the same time.` },
      { q: 'Do jobs in another EU country count towards the length of Austrian unemployment benefit?', a: `Yes, insured work in EU states counts as far as the EU regulation provides (section 14(5) AlVG), and Austria has agreements with a few other countries such as Serbia. Your last job must have been in Austria, though. Someone with ${EN.num(B30)} weeks across Germany and Austria combined reaches ${W30} instead of ${W20} weeks. The daily amount, by contrast, is based only on pay earned in Austria.` },
      { q: 'Does an AMS training course extend my unemployment benefit period?', a: `Yes. Section 18(4) adds the time you spend on an AMS training or re-integration measure to your benefit period, so course weeks are not deducted from the claim. In a recognised labour foundation (Arbeitsstiftung) the period can be extended by up to ${A.stiftung_verlaengerung_wochen} weeks, and to ${A.stiftung_verlaengerung_max_wochen} weeks in total for longer statutory training or claimants aged ${AL52} and over.` },
      { q: 'Can I resume unused unemployment benefit weeks after a new job ends?', a: `Yes, if you apply within ${A.fortbezug_frist_jahre} years of your last day of benefit. This is called Fortbezug (continued payment). After a break of less than ${A.wiedermeldung_tage} days a simple online or phone re-registration is enough; after a longer break you file a new claim. If the new job lasted long enough, it may instead give you a fresh entitlement with its own length.` },
      { q: 'Who gets 52 weeks of unemployment benefit in Austria?', a: `People who are at least ${AL52} on the day they claim and can show ${B52} insured weeks, about ${EN.num(jahre(B52))} years, within the last ${RJ[3]} years. If you are ${AL52} but have fewer weeks, check the ${W39}-week tier: age ${AL39} and ${B39} weeks in ${RJ[2]} years. What counts is your age when you file the claim, not when the job ended.` },
    ],
    body: (h) => `
<h2>Four tiers set by law</h2>
<p>Only two facts decide the length: how many weeks you worked in jobs covered by unemployment insurance before claiming, and your age when you claim. Your previous salary sets the daily amount but not the duration. The tiers are in ${h.src('alvg18', 'section 18 of the Unemployment Insurance Act (AlVG)')}, and the Chamber of Labour lists them in its ${h.src('akAlv', '2026 guide to unemployment insurance')}.</p>
${h.table(['Duration', 'days', 'insured weeks needed', 'window', 'age at claim'], [
  [`${h.num(W20)} weeks`, h.num(W20 * 7), 'qualifying period met', '–', '–'],
  [`${h.num(W30)} weeks`, h.num(W30 * 7), `${h.num(B30)} (about ${h.num(jahre(B30))} years)`, 'whole career', '–'],
  [`${h.num(W39)} weeks`, h.num(W39 * 7), `${h.num(B39)} (about ${h.num(jahre(B39))} years)`, `last ${h.num(RJ[2])} years`, `${h.num(AL39)}+`],
  [`${h.num(W52)} weeks`, h.num(W52 * 7), `${h.num(B52)} (about ${h.num(jahre(B52))} years)`, `last ${h.num(RJ[3])} years`, `${h.num(AL52)}+`],
], 'Benefit duration under section 18(1) and (2) AlVG', ['l', 'r', 'l', 'l', 'l'])}
<p>After completing a vocational rehabilitation programme run by social insurance, the duration rises to ${h.num(A.dauer_reha_wochen)} weeks (section 18(2)(c)).</p>
<h2>Five careers, five results</h2>
${h.table(['Person', 'age', 'insured years', 'duration'], F.map((f, i) => [String.fromCharCode(65 + i), h.num(f.alter), h.num(f.jahre), `${h.num(f.wochen)} weeks`]), 'Result of the calculator on this page; years within the relevant window', ['l', 'r', 'r', 'r'])}
<p>Person D is the typical trap for people who moved to Austria mid-career: at ${h.num(F[3].alter)} the age condition for ${h.num(W39)} weeks is met, but ${h.num(F[3].jahre)} insured years in the ten-year window are not enough, so the claim stays at ${h.num(F[3].wochen)} weeks. Years worked abroad only help if an EU rule or a bilateral agreement brings them in.</p>
<h2>Qualifying first, duration second</h2>
<p>Before any duration applies you must meet the qualifying period (Anwartschaft) in ${h.src('alvg14', 'section 14 AlVG')}. For a first claim that is ${h.num(A.anwartschaft_wochen)} weeks of insured work in the last ${h.num(A.anwartschaft_rahmenfrist_monate)} months. If you claim before turning ${h.num(A.anwartschaft_u25_alter)}, ${h.num(A.anwartschaft_u25_wochen)} weeks in ${h.num(A.anwartschaft_u25_rahmenfrist_monate)} months are enough. Every later claim needs ${h.num(A.anwartschaft_weitere_wochen)} weeks in ${h.num(A.anwartschaft_weitere_rahmenfrist_monate)} months.</p>
<p>The two counts work differently. For qualifying, each period can be used only once: after you exhaust a claim, you need new weeks. For the duration, every countable period inside the window counts, even weeks that already supported an earlier claim. The qualifying window (Rahmenfrist) is stretched by study, military or civilian service and similar periods, usually by up to ${h.num(A.rahmenfrist_verlaengerung_max_jahre)} years, and without limit by childcare allowance or sick pay. The ${h.num(RJ[2])}- and ${h.num(RJ[3])}-year windows for the longer durations cannot be stretched.</p>
<!--mini:alg-->
<h2>What delays payment without cutting weeks</h2>
<h3>The four-week block after resigning</h3>
<p>If the job ended because you resigned, walked out without justification or were fairly dismissed, no benefit is paid for ${h.num(A.sperre_selbstkuendigung_wochen)} weeks. Resigning during probation counts too. These ${h.num(A.sperre_selbstkuendigung_wochen * 7)} days are not taken off your entitlement: with ${h.num(W30)} weeks due, you still receive ${h.num(W30)} weeks, just later. Mutual termination carries no block, which is worth knowing before you sign a resignation letter.</p>
<h3>Holiday compensation on leaving</h3>
<p>Unused leave paid out at the end of a job (Urlaubsersatzleistung) extends your insurance by those days, and the benefit is suspended (ruht) for that time. Suspended means nothing is paid, but the total stays the same. Sick pay, notice-period compensation, an unapproved stay abroad or military service also suspend the benefit. File the claim on time anyway, at the earliest ${h.num(A.antrag_vorab_wochen)} weeks before your last working day, because the AMS does not pay retroactively.</p>
<h2>What adds weeks</h2>
<p>Time on an AMS training or re-integration measure is added to your benefit period (section 18(4)). In a recognised labour foundation the extension can reach ${h.num(A.stiftung_verlaengerung_wochen)} weeks, and up to ${h.num(A.stiftung_verlaengerung_max_wochen)} weeks in total for longer statutory training or from age ${h.num(AL52)} (section 18(5)).</p>
<h2>What really costs weeks</h2>
<p>Unlike the resignation block, a loss of entitlement (Anspruchsverlust) removes weeks for good. Turning down a suitable job, showing no job search or sabotaging a course costs ${h.num(A.anspruchsverlust_wochen)} weeks, each repeat ${h.num(A.anspruchsverlust_wiederholt_wochen)} weeks. Missing an AMS appointment without good reason stops payment until you report back, with at most ${h.num(A.wiedermeldung_tage)} days lost.</p>
<h2>The duration in euros</h2>
<p>On a ${h.eur(3000)} gross monthly salary the benefit is ${h.eur(alg.tagsatz, 2)} a day. Over each tier that adds up to:</p>
${h.table(['Duration', 'total benefit'], [W20, W30, W39, W52].map((w) => [`${h.num(w)} weeks`, h.eur(summe(w))]), `Daily rate ${h.eur(alg.tagsatz, 2)} at ${h.eur(3000)} gross, no family supplement`, ['l', 'r'])}
<p>The tier also matters afterwards. ${h.a('notstandshilfe', 'Emergency assistance (Notstandshilfe)')} is capped after six months if your benefit lasted only ${h.num(W20)} or ${h.num(W30)} weeks; after ${h.num(W39)} or ${h.num(W52)} weeks there is no cap. From age ${h.num(A.nh_laengste_dauer_ab_alter)} the longest duration you were ever granted is used (section 36(5) AlVG). Work out your daily amount with the ${h.a('arbeitslosengeld', 'unemployment benefit calculator')}.</p>
`,
  },
});
