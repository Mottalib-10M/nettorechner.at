/** Dienstgeberkosten 2026: SV-Dienstgeberanteil, MV-Kasse, DB, DZ je Bundesland, Kommunalsteuer. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { dienstgeberkosten } from '../../lib/engine/leistungen';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';
import { PROFIL0, LandFeld, LAND_NAME, type ProfilState } from './Profil';

export default function DienstgeberRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const pc = (x: number) => formatPercent(x, 2, lang);
  const [b, setB] = useState(3000);
  const [s, setS] = useState<ProfilState>(PROFIL0);
  const set = (x: Partial<ProfilState>) => setS((o) => ({ ...o, ...x }));
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setB(num(u, 'b', 3000)); if (u.get('l')) set({ land: u.get('l') as ProfilState['land'] }); }, []);
  useEffect(() => { updateURL({ b, l: s.land }); }, [b, s]);
  const d = useMemo(() => dienstgeberkosten(b, s.land), [b, s.land]);
  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="dg-b" label={tx(lang, 'Bruttogehalt pro Monat', 'Gross salary per month')} value={b} onChange={setB} unit="€" max={500000} lang={lang} />
            <LandFeld lang={lang} id="dg" s={s} set={set} />
          </div>
          <p className="text-sm text-navy-700">{tx(lang, `Zuschlag zum DB in ${LAND_NAME[s.land]}: ${pc(P.dienstgeber.dz[s.land])}. Nicht enthalten: Wiener Dienstgeberabgabe, Betriebsratsumlagen, freiwillige Leistungen.`, `Employer surcharge in ${LAND_NAME[s.land]}: ${pc(P.dienstgeber.dz[s.land])}. Not included: Vienna employer levy, works council levies, voluntary benefits.`)}</p>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Kosten für den Dienstgeber pro Jahr', 'Employer cost per year')} wert={$(d.jahr)} unter={tx(lang, `${$(d.jahrBrutto)} brutto plus ${formatPercent(d.aufschlag, 1, lang)} Lohnnebenkosten`, `${$(d.jahrBrutto)} gross plus ${formatPercent(d.aufschlag, 1, lang)} payroll costs`)} />
          <Lohnzettel rows={[
            { label: tx(lang, 'Bruttogehalt', 'Gross salary'), value: $(b, 2) },
            { label: tx(lang, 'Sozialversicherung Dienstgeber', 'Employer social insurance'), value: $(d.sv, 2), muted: true },
            { label: tx(lang, `Mitarbeitervorsorge ${pc(P.sv.dg.mv)}`, `Severance fund ${pc(P.sv.dg.mv)}`), value: $(d.mv, 2), muted: true },
            { label: tx(lang, `Dienstgeberbeitrag ${pc(P.dienstgeber.db)}`, `Family fund contribution ${pc(P.dienstgeber.db)}`), value: $(d.db, 2), muted: true },
            { label: tx(lang, 'Zuschlag zum DB', 'DB surcharge'), value: $(d.dz, 2), muted: true },
            { label: tx(lang, `Kommunalsteuer ${pc(P.dienstgeber.kommunalsteuer)}`, `Municipal tax ${pc(P.dienstgeber.kommunalsteuer)}`), value: $(d.kommst, 2), muted: true },
            { label: tx(lang, 'Kosten pro Monat', 'Cost per month'), value: $(b + d.monat, 2), strong: true, sep: true },
          ]} />
          <Aktionen lang={lang} text={() => tx(lang, `Dienstgeberkosten ${$(d.jahr)} im Jahr bei ${$(b)} brutto`, `Employer cost ${$(d.jahr)} a year on ${$(b)} gross`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode', 'Calculation method')}</a></p>}
        </div>
      </div>
    </div>
  );
}
