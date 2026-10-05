/** Netto-Brutto-Rechner: welches Monatsbrutto ergibt den gewünschten Nettobetrag? Motor: bruttoAusNetto (Bisektion). */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { bruttoAusNetto } from '../../lib/engine/leistungen';
import { rechneJahr, standardJahr } from '../../lib/engine/jahr';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';
import { PROFIL0, zuProfil, profilAusUrl, profilZuUrl, LandFeld, FamilieFelder, PendlerFelder, type ProfilState } from './Profil';

export default function NettoBruttoRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [netto, setNetto] = useState(2200);
  const [s, setS] = useState<ProfilState>(PROFIL0);
  const set = (x: Partial<ProfilState>) => setS((o) => ({ ...o, ...x }));
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setNetto(num(u, 'n', 2200)); setS(profilAusUrl(u)); }, []);
  useEffect(() => { updateURL({ n: netto, ...profilZuUrl(s) }); }, [netto, s]);
  const profil = zuProfil(s);
  const brutto = useMemo(() => bruttoAusNetto(netto, profil), [netto, JSON.stringify(profil)]);
  const j = useMemo(() => rechneJahr(standardJahr(brutto), profil), [brutto, JSON.stringify(profil)]);
  const m = j.monate[0];
  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="nb-n" label={tx(lang, 'Gewünschtes Netto pro Monat', 'Target net per month')} value={netto} onChange={setNetto} unit="€" max={500000} lang={lang} />
            <LandFeld lang={lang} id="nb" s={s} set={set} />
          </div>
          <details className="rounded-lg border border-navy-200 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-navy-900">{tx(lang, 'Kinder, Alleinverdiener, Arbeitsweg', 'Children, sole earner, commute')}</summary>
            <div className="mt-4 space-y-4"><FamilieFelder lang={lang} id="nb" s={s} set={set} /><PendlerFelder lang={lang} id="nb" s={s} set={set} /></div>
          </details>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Nötiges Bruttogehalt pro Monat', 'Gross salary needed per month')} wert={$(brutto)} unter={tx(lang, `Jahresbrutto ${$(j.brutto)} bei 14 Bezügen`, `Annual gross ${$(j.brutto)} with 14 payments`)} />
          <Lohnzettel rows={[
            { label: tx(lang, 'Brutto', 'Gross'), value: $(brutto, 2) },
            { label: tx(lang, 'Sozialversicherung', 'Social insurance'), value: `− ${$(m.svLaufend, 2)}`, muted: true },
            { label: tx(lang, 'Lohnsteuer', 'Wage tax'), value: `− ${$(m.lstLaufend, 2)}`, muted: true },
            { label: tx(lang, 'Netto', 'Net'), value: $(m.netto, 2), strong: true, sep: true },
            { label: tx(lang, 'Jahresnetto inkl. 13. und 14.', 'Annual net incl. 13th and 14th'), value: $(j.netto) },
            { label: tx(lang, 'Abzüge vom Jahresbrutto', 'Deductions from annual gross'), value: formatPercent((j.sv + j.lst) / Math.max(1, j.brutto), 1, lang) },
          ]} />
          <Aktionen lang={lang} text={() => tx(lang, `Für ${$(netto)} netto braucht es ${$(brutto)} brutto`, `${$(netto)} net needs ${$(brutto)} gross`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode', 'Calculation method')}</a></p>}
        </div>
      </div>
    </div>
  );
}
