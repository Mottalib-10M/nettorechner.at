/** Arbeitslosengeld 2026 (§ 21 AlVG): Tagsatz, Monat, Bezugsdauer, anschließende Notstandshilfe. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { arbeitslosengeld, algDauer, notstandshilfe } from '../../lib/engine/leistungen';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';

export default function AlgRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [b, setB] = useState(2800);
  const [fz, setFz] = useState(0);
  const [alter, setAlter] = useState(35);
  const [jahre, setJahre] = useState(5);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setB(num(u, 'b', 2800)); setFz(num(u, 'fz', 0)); setAlter(num(u, 'a', 35)); setJahre(num(u, 'j', 5)); }, []);
  useEffect(() => { updateURL({ b, fz: fz || undefined, a: alter, j: jahre }); }, [b, fz, alter, jahre]);
  const a = useMemo(() => arbeitslosengeld(b, Math.round(fz)), [b, fz]);
  const wochen = Math.round(jahre * 52);
  const dauer = algDauer(wochen, alter);
  const nh = notstandshilfe(a, dauer), nh6 = notstandshilfe(a, dauer, true);
  const regel = { grund: tx(lang, '55 % des fiktiven Nettos', '55% of notional net pay'), ergaenzung60: tx(lang, 'Ergänzungsbetrag bis 60 % des Nettos', 'Top-up to 60% of net pay'), ergaenzung80: tx(lang, 'Ergänzungsbetrag bis 80 % (mit Angehörigen)', 'Top-up to 80% (with dependants)') }[a.quoteRegel];
  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="al-b" label={tx(lang, 'Monatsbrutto ohne Sonderzahlungen', 'Monthly gross without special payments')} value={b} onChange={setB} unit="€" max={100000} lang={lang} />
            <NumberField id="al-fz" label={tx(lang, 'Angehörige mit Familienzuschlag', 'Dependants with family supplement')} value={fz} onChange={setFz} max={15} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="al-a" label={tx(lang, 'Alter bei Antrag', 'Age when claiming')} value={alter} onChange={setAlter} unit={tx(lang, 'Jahre', 'years')} max={70} lang={lang} />
            <NumberField id="al-j" label={tx(lang, 'Versicherte Jahre (letzte 10 bis 15)', 'Insured years (last 10 to 15)')} value={jahre} onChange={setJahre} unit={tx(lang, 'Jahre', 'years')} max={50} decimals={1} lang={lang} />
          </div>
          <p className="text-sm text-navy-700">{tx(lang, 'Das AMS nimmt die letzten zwölf abgeschlossenen Beitragsmonate vor der einjährigen Berichtigungsfrist, nicht Ihr letztes Gehalt. Schwankende Bezüge: Durchschnitt eintragen.', 'AMS uses the last twelve completed contribution months before the one-year correction period, not your last salary. If pay varied, enter the average.')}</p>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Arbeitslosengeld pro Tag', 'Unemployment benefit per day')} wert={$(a.tagsatz, 2)} unter={tx(lang, `rund ${$(a.monat30)} im Monat (30 Tage) · ${dauer} Wochen`, `about ${$(a.monat30)} a month (30 days) · ${dauer} weeks`)} />
          <Lohnzettel rows={[
            { label: tx(lang, 'Bemessung: Brutto + 1/6 für Sonderzahlungen', 'Basis: gross + 1/6 for special payments'), value: $(a.bemessungMonat, 2) },
            ...(a.gedeckelt ? [{ label: tx(lang, 'gedeckelt bei der Höchstbemessungsgrundlage', 'capped at the maximum basis'), value: $(P.alg.hoechstbemessung_monat), muted: true }] : []),
            { label: tx(lang, 'Fiktives Nettoeinkommen pro Tag', 'Notional net income per day'), value: $(a.nettoTag, 2), muted: true },
            { label: tx(lang, 'Grundbetrag 55 %', 'Basic amount 55%'), value: $(a.grundbetrag, 2) },
            ...(a.ergaenzung > 0 ? [{ label: tx(lang, 'Ergänzungsbetrag', 'Top-up amount'), value: $(a.ergaenzung, 2) }] : []),
            ...(a.familienzuschlag > 0 ? [{ label: tx(lang, `Familienzuschläge (${$(P.alg.familienzuschlag_tag, 2)} je Person)`, `Family supplements (${$(P.alg.familienzuschlag_tag, 2)} each)`), value: $(a.familienzuschlag, 2) }] : []),
            { label: tx(lang, 'Tagsatz', 'Daily rate'), value: $(a.tagsatz, 2), strong: true, sep: true },
            { label: tx(lang, `Danach Notstandshilfe (${Math.round(nh.quote * 100)} %)`, `Then emergency assistance (${Math.round(nh.quote * 100)}%)`), value: $(nh.tagsatz, 2) },
            ...(nh6.deckel !== null ? [{ label: tx(lang, 'Notstandshilfe ab dem 7. Monat (Deckel)', 'Emergency assistance from month 7 (cap)'), value: $(nh6.tagsatz, 2), muted: true }] : []),
          ]} />
          <p className="mt-3 text-sm text-navy-700">{regel}. {tx(lang, 'Seit 1. Jänner 2026 ist ein geringfügiger Zuverdienst während des Bezugs grundsätzlich nicht mehr erlaubt.', 'Since 1 January 2026, a marginal side job while on benefit is no longer allowed as a rule.')}</p>
          <Aktionen lang={lang} text={() => tx(lang, `Arbeitslosengeld ${$(a.tagsatz, 2)} am Tag, ${dauer} Wochen`, `Unemployment benefit ${$(a.tagsatz, 2)} a day, ${dauer} weeks`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode und Abgleich mit der AK-Tabelle', 'Method and check against the AK table')}</a></p>}
        </div>
      </div>
    </div>
  );
}
