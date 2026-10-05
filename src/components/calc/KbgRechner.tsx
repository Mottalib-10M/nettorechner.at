/** Kinderbetreuungsgeld 2026: Konto (Tage wählen) gegen einkommensabhängige Variante. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { kbgKonto, kbgEinkommensabhaengig } from '../../lib/engine/leistungen';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';

export default function KbgRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const K = P.kbg;
  const [tage, setTage] = useState(365);
  const [beide, setBeide] = useState('0');
  const [netto, setNetto] = useState(2000);
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setTage(num(u, 't', 365)); setBeide(u.get('2') === '1' ? '1' : '0'); setNetto(num(u, 'n', 2000)); }, []);
  useEffect(() => { updateURL({ t: tage, 2: beide === '1' ? 1 : undefined, n: netto }); }, [tage, beide, netto]);
  const k = useMemo(() => kbgKonto(tage, beide === '1'), [tage, beide]);
  const e = useMemo(() => kbgEinkommensabhaengig(netto), [netto]);
  const eaTage = beide === '1' ? K.ea_tage_beide : K.ea_tage_ein;
  const eaGesamt = e.tagsatz * eaTage;
  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(ev) => ev.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="kb-t" label={tx(lang, 'Bezugsdauer ab Geburt (Konto)', 'Duration from birth (account)')} value={tage} onChange={setTage} unit={tx(lang, 'Tage', 'days')} max={2000} lang={lang} />
            <SelectField id="kb-2" label={tx(lang, 'Beide Elternteile beziehen', 'Both parents claim')} value={beide} onChange={setBeide} options={[{ value: '0', label: tx(lang, 'Nein', 'No') }, { value: '1', label: tx(lang, 'Ja', 'Yes') }]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="kb-n" label={tx(lang, 'Netto pro Monat vor der Geburt', 'Net per month before birth')} value={netto} onChange={setNetto} unit="€" max={100000} lang={lang} />
          </div>
          <p className="text-sm text-navy-700">{tx(lang, `Konto: ${K.konto_tage_ein_elternteil_min} bis ${K.konto_tage_ein_elternteil_max} Tage für einen Elternteil, ${K.konto_tage_beide_min} bis ${K.konto_tage_beide_max} Tage für beide. Einkommensabhängig: bis zum ${K.ea_tage_ein}. Tag, mit beiden Eltern bis zum ${K.ea_tage_beide}.`, `Account: ${K.konto_tage_ein_elternteil_min} to ${K.konto_tage_ein_elternteil_max} days for one parent, ${K.konto_tage_beide_min} to ${K.konto_tage_beide_max} days for both. Earnings-related: up to day ${K.ea_tage_ein}, with both parents up to day ${K.ea_tage_beide}.`)}</p>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'KBG-Konto pro Tag', 'Account allowance per day')} wert={$(k.tagsatz, 2)} unter={tx(lang, `${k.tage} Tage · rund ${$(k.monat)} im Monat · gesamt ${$(k.gesamt)}`, `${k.tage} days · about ${$(k.monat)} a month · total ${$(k.gesamt)}`)} />
          <Lohnzettel rows={[
            ...(k.partnerTage > 0 ? [{ label: tx(lang, 'davon dem zweiten Elternteil vorbehalten (20 %)', 'reserved for the second parent (20%)'), value: `${k.partnerTage} ${tx(lang, 'Tage', 'days')}`, muted: true }] : []),
            { label: tx(lang, 'Wochengeld geschätzt (Netto + 17 % Zuschlag)', 'Estimated maternity pay (net + 17%)'), value: $(e.wochengeldTag, 2), muted: true },
            { label: tx(lang, 'Einkommensabhängig pro Tag (80 %)', 'Earnings-related per day (80%)'), value: $(e.tagsatz, 2), strong: true, sep: true },
            { label: tx(lang, `Einkommensabhängig gesamt (${eaTage} Tage)`, `Earnings-related total (${eaTage} days)`), value: $(eaGesamt) },
            { label: tx(lang, 'Unterschied zum gewählten Konto', 'Difference to the chosen account'), value: $(eaGesamt - k.gesamt) },
          ]} />
          <p className="mt-3 text-sm text-navy-700">{e.gedeckelt ? tx(lang, `Gedeckelt bei ${$(K.ea_tag_max, 2)} am Tag.`, `Capped at ${$(K.ea_tag_max, 2)} a day.`) : e.mindest ? tx(lang, `Mindestens ${$(K.konto_tag_max, 2)} am Tag.`, `At least ${$(K.konto_tag_max, 2)} a day.`) : ''} {tx(lang, `Zuverdienst 2026: ${$(K.zuverdienst_konto)} beim Konto, ${$(K.zuverdienst_ea)} beim einkommensabhängigen KBG.`, `2026 earnings limit: ${$(K.zuverdienst_konto)} on the account, ${$(K.zuverdienst_ea)} on the earnings-related scheme.`)}</p>
          <Aktionen lang={lang} text={() => tx(lang, `KBG-Konto ${$(k.tagsatz, 2)}/Tag, einkommensabhängig ${$(e.tagsatz, 2)}/Tag`, `Childcare account ${$(k.tagsatz, 2)}/day, earnings-related ${$(e.tagsatz, 2)}/day`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode', 'Calculation method')}</a></p>}
        </div>
      </div>
    </div>
  );
}
