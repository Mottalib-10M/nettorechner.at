/** Abfertigung neu (BV-Kasse, 1,53 %) und alt (§ 23 AngG), beide mit 6 % Lohnsteuer. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { abfertigungNeu, abfertigungAlt } from '../../lib/engine/leistungen';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';

export default function AbfertigungRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [system, setSystem] = useState('neu');
  const [b, setB] = useState(3200);
  const [j, setJ] = useState(8);
  const [zins, setZins] = useState(2);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setSystem(u.get('s') === 'alt' ? 'alt' : 'neu'); setB(num(u, 'b', 3200)); setJ(num(u, 'j', 8)); setZins(num(u, 'z', 2)); }, []);
  useEffect(() => { updateURL({ s: system, b, j, z: system === 'neu' ? zins : undefined }); }, [system, b, j, zins]);
  const neu = useMemo(() => abfertigungNeu(b, j, zins / 100), [b, j, zins]);
  const alt = useMemo(() => abfertigungAlt(b, j), [b, j]);
  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="ab-s" label={tx(lang, 'System', 'Scheme')} value={system} onChange={setSystem} options={[{ value: 'neu', label: tx(lang, 'Abfertigung neu (ab 2003)', 'New scheme (from 2003)') }, { value: 'alt', label: tx(lang, 'Abfertigung alt (vor 2003)', 'Old scheme (before 2003)') }]} />
            <NumberField id="ab-b" label={tx(lang, 'Monatsbrutto (Durchschnitt)', 'Monthly gross (average)')} value={b} onChange={setB} unit="€" max={500000} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ab-j" label={system === 'neu' ? tx(lang, 'Beitragsjahre in der BV-Kasse', 'Years paid into the fund') : tx(lang, 'Dienstjahre beim Arbeitgeber', 'Years with the employer')} value={j} onChange={setJ} unit={tx(lang, 'Jahre', 'years')} max={50} decimals={1} lang={lang} />
            {system === 'neu' && <NumberField id="ab-z" label={tx(lang, 'Angenommene Verzinsung (Ihre Annahme)', 'Assumed return (your assumption)')} value={zins} onChange={setZins} unit="%" max={10} decimals={1} lang={lang} />}
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          {system === 'neu' ? <>
            <Kopf label={tx(lang, 'Guthaben in der BV-Kasse', 'Balance in the provision fund')} wert={$(neu.kapital)} unter={tx(lang, `ausbezahlt mit 6 %: ${$(neu.netto6)}`, `paid out at 6%: ${$(neu.netto6)}`)} />
            <Lohnzettel rows={[
              { label: tx(lang, `Beitrag ${formatPercent(P.abfertigung.mv_satz, 2, lang)} von 14 Bezügen pro Jahr`, `Contribution ${formatPercent(P.abfertigung.mv_satz, 2, lang)} of 14 payments a year`), value: $(neu.beitraegeJahr, 2) },
              { label: tx(lang, 'Eingezahlt gesamt', 'Paid in, total'), value: $(neu.einzahlungen) },
              { label: tx(lang, 'Guthaben mit Ihrer Verzinsungsannahme', 'Balance with your return assumption'), value: $(neu.kapital), strong: true, sep: true },
              { label: tx(lang, 'Lohnsteuer 6 % bei Auszahlung', 'Wage tax 6% on payout'), value: `− ${$(neu.kapital - neu.netto6)}`, muted: true },
            ]} />
            <p className="mt-3 text-sm text-navy-700">{neu.anspruch ? tx(lang, 'Auszahlung möglich, wenn der Arbeitgeber kündigt oder einvernehmlich gelöst wird; bei Selbstkündigung bleibt das Geld in der Kasse und wandert mit.', 'Payout possible if the employer ends the job or by mutual agreement; if you resign, the money stays in the fund and moves with you.') : tx(lang, `Unter ${P.abfertigung.neu_mindest_beitragsjahre} Einzahlungsjahren keine Auszahlung: das Guthaben bleibt in der Kasse.`, `Under ${P.abfertigung.neu_mindest_beitragsjahre} years of contributions there is no payout: the balance stays in the fund.`)}</p>
          </> : <>
            <Kopf label={tx(lang, 'Abfertigung alt brutto', 'Old-scheme severance, gross')} wert={$(alt.brutto)} unter={tx(lang, `${alt.monate} Monatsentgelte · netto ${$(alt.netto)}`, `${alt.monate} months’ pay · net ${$(alt.netto)}`)} />
            <Lohnzettel rows={[
              { label: tx(lang, 'Monatsentgelt inkl. 1/6 Sonderzahlungen', 'Monthly pay incl. 1/6 special payments'), value: $(alt.monatsentgelt, 2) },
              { label: tx(lang, 'Monatsentgelte nach § 23 AngG', 'Months’ pay under s. 23 AngG'), value: String(alt.monate) },
              { label: tx(lang, 'Abfertigung brutto', 'Severance gross'), value: $(alt.brutto), strong: true, sep: true },
              { label: tx(lang, 'Lohnsteuer 6 %', 'Wage tax 6%'), value: `− ${$(alt.lst6)}`, muted: true },
            ]} />
            <p className="mt-3 text-sm text-navy-700">{tx(lang, 'Anspruch ab 3 Dienstjahren, nicht bei Selbstkündigung, verschuldeter Entlassung oder unberechtigtem Austritt.', 'Entitlement from 3 years of service, not after resignation, dismissal for cause or unjustified walk-out.')}</p>
          </>}
          <Aktionen lang={lang} text={() => system === 'neu' ? tx(lang, `Abfertigung neu: ${$(neu.kapital)} Guthaben`, `New-scheme severance: ${$(neu.kapital)} balance`) : tx(lang, `Abfertigung alt: ${$(alt.brutto)} brutto`, `Old-scheme severance: ${$(alt.brutto)} gross`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode', 'Calculation method')}</a></p>}
        </div>
      </div>
    </div>
  );
}
