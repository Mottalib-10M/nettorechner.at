/** Überstunden 2026: Stundenlohn, Zuschlag, steuerfreier Teil (15 Stunden, 170 €), was netto bleibt. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { ueberstunden } from '../../lib/engine/leistungen';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';
import { PROFIL0, LandFeld, type ProfilState } from './Profil';

export default function UeberstundenRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [b, setB] = useState(3000);
  const [w, setW] = useState(40);
  const [h, setH] = useState(10);
  const [z, setZ] = useState('50');
  const [s, setS] = useState<ProfilState>(PROFIL0);
  const set = (x: Partial<ProfilState>) => setS((o) => ({ ...o, ...x }));
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setB(num(u, 'b', 3000)); setW(num(u, 'w', 40)); setH(num(u, 'h', 10)); setZ(u.get('z') === '100' ? '100' : '50'); if (u.get('l')) set({ land: u.get('l') as ProfilState['land'] }); }, []);
  useEffect(() => { updateURL({ b, w, h, z, l: s.land }); }, [b, w, h, z, s]);
  const r = useMemo(() => ueberstunden(b, Math.max(1, w), h, Number(z) / 100, { wien: s.land === 'wien' }), [b, w, h, z, s.land]);
  const U = P.ueberstunden;
  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ue-b" label={tx(lang, 'Monatsgehalt brutto', 'Monthly gross salary')} value={b} onChange={setB} unit="€" max={500000} lang={lang} />
            <NumberField id="ue-w" label={tx(lang, 'Normalarbeitszeit pro Woche', 'Normal hours per week')} value={w} onChange={setW} unit="h" max={60} decimals={1} lang={lang} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="ue-h" label={tx(lang, 'Überstunden in diesem Monat', 'Overtime hours this month')} value={h} onChange={setH} unit="h" max={200} decimals={1} lang={lang} />
            <SelectField id="ue-z" label={tx(lang, 'Zuschlag', 'Premium')} value={z} onChange={setZ} options={[{ value: '50', label: tx(lang, '50 % (gesetzlich)', '50% (statutory)') }, { value: '100', label: tx(lang, '100 % (z. B. Sonntag laut KV)', '100% (e.g. Sunday per agreement)') }]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4"><LandFeld lang={lang} id="ue" s={s} set={set} /></div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Davon bleibt netto', 'What you keep, net')} wert={$(r.nettoMehr, 2)} unter={tx(lang, `von ${$(r.bruttoMehr, 2)} brutto · ${formatPercent(r.bruttoMehr > 0 ? r.nettoMehr / r.bruttoMehr : 0, 0, lang)}`, `from ${$(r.bruttoMehr, 2)} gross · ${formatPercent(r.bruttoMehr > 0 ? r.nettoMehr / r.bruttoMehr : 0, 0, lang)}`)} />
          <Lohnzettel rows={[
            { label: tx(lang, `Grundlohn je Stunde (÷ ${String(U.wochen_je_monat).replace('.', lang === 'de' ? ',' : '.')} Wochen)`, `Base pay per hour (÷ ${U.wochen_je_monat} weeks)`), value: $(r.stundenlohn, 2) },
            { label: tx(lang, 'Grundvergütung der Überstunden', 'Base pay for overtime'), value: $(r.grundvergutung, 2) },
            { label: tx(lang, 'Überstundenzuschläge', 'Overtime premiums'), value: $(r.zuschlag, 2) },
            { label: tx(lang, `davon steuerfrei (max. ${U.frei_stunden_2026} Std., ${$(U.frei_max_2026)})`, `tax-free part (max. ${U.frei_stunden_2026} h, ${$(U.frei_max_2026)})`), value: $(r.steuerfreierZuschlag, 2), muted: true },
            { label: tx(lang, 'mehr Sozialversicherung', 'extra social insurance'), value: `− ${$(r.svMehr, 2)}`, muted: true },
            { label: tx(lang, 'mehr Lohnsteuer', 'extra wage tax'), value: `− ${$(r.lstMehr, 2)}`, muted: true },
            { label: tx(lang, 'Netto des Monats', 'Net for the month'), value: $(r.nettoMit, 2), strong: true, sep: true },
          ]} />
          <Aktionen lang={lang} text={() => tx(lang, `${h} Überstunden: ${$(r.nettoMehr, 2)} netto von ${$(r.bruttoMehr, 2)} brutto`, `${h} overtime hours: ${$(r.nettoMehr, 2)} net from ${$(r.bruttoMehr, 2)} gross`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode', 'Calculation method')}</a></p>}
        </div>
      </div>
    </div>
  );
}
