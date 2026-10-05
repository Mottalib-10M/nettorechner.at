/** Pendlerpauschale und Pendlereuro 2026 im Lohnzettel: was sie netto bringen, für alle Stufen. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { rechneJahr, standardJahr } from '../../lib/engine/jahr';
import { pendlerpauschale, pendlereuro, type PendlerArt } from '../../lib/engine/lohn';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';
import { PROFIL0, zuProfil, profilAusUrl, profilZuUrl, LandFeld, PendlerFelder, type ProfilState } from './Profil';

export default function PendlerRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [brutto, setBrutto] = useState(3000);
  const [s, setS] = useState<ProfilState>({ ...PROFIL0, pendler: 'klein', km: 35 });
  const set = (x: Partial<ProfilState>) => setS((o) => ({ ...o, ...x }));
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setBrutto(num(u, 'b', 3000)); setS(profilAusUrl(u, { ...PROFIL0, pendler: 'klein', km: 35 })); }, []);
  useEffect(() => { updateURL({ b: brutto, ...profilZuUrl(s) }); }, [brutto, s]);
  const ohne = useMemo(() => rechneJahr(standardJahr(brutto), zuProfil({ ...s, pendler: 'keine' })), [brutto, s.land]);
  const mit = useMemo(() => rechneJahr(standardJahr(brutto), zuProfil(s)), [brutto, JSON.stringify(s)]);
  const plus = mit.monate[0].netto - ohne.monate[0].netto;
  const pp = pendlerpauschale(s.pendler, s.km, s.fahrten), pe = pendlereuro(s.pendler, s.km, s.fahrten);
  const stufen: Array<{ art: PendlerArt; km: number; label: string }> = [
    ...P.pendlerpauschale.klein.map(([von, bis]) => ({ art: 'klein' as PendlerArt, km: bis > 999 ? von + 10 : bis, label: `${tx(lang, 'klein', 'small')} ${bis > 999 ? `> ${von}` : `${von}–${bis}`} km` })),
    ...P.pendlerpauschale.gross.map(([von, bis]) => ({ art: 'gross' as PendlerArt, km: bis > 999 ? von + 10 : bis, label: `${tx(lang, 'groß', 'large')} ${bis > 999 ? `> ${von}` : `${von}–${bis}`} km` })),
  ];
  const zeile = (st: typeof stufen[number]) => {
    const r = rechneJahr(standardJahr(brutto), zuProfil({ ...s, pendler: st.art, km: st.km, fahrten: 'voll' }));
    return r.monate[0].netto - ohne.monate[0].netto;
  };
  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="pe-b" label={tx(lang, 'Bruttogehalt pro Monat', 'Gross salary per month')} value={brutto} onChange={setBrutto} unit="€" max={500000} lang={lang} />
            <LandFeld lang={lang} id="pe" s={s} set={set} />
          </div>
          <PendlerFelder lang={lang} id="pe" s={s} set={set} />
          <div className="overflow-x-auto rounded-lg bg-navy-50 p-3">
            <table className="lohnzettel w-full text-sm">
              <caption className="mb-1 text-left text-xs font-semibold uppercase tracking-wide text-navy-600">{tx(lang, `Alle Stufen bei ${$(brutto)} brutto (volle Fahrten)`, `Every band at ${$(brutto)} gross (full commutes)`)}</caption>
              <thead><tr className="text-left text-navy-700"><th scope="col">{tx(lang, 'Stufe', 'Band')}</th><th scope="col" className="text-right">{tx(lang, 'Pauschale/Jahr', 'Allowance/yr')}</th><th scope="col" className="text-right">{tx(lang, 'Netto mehr/Monat', 'Extra net/month')}</th></tr></thead>
              <tbody>{stufen.map((st) => <tr key={st.label} className="border-t border-navy-200"><th scope="row" className="text-left font-normal text-navy-800">{st.label}</th><td className="tabular-nums text-right">{$(pendlerpauschale(st.art, st.km))}</td><td className="tabular-nums text-right">{$(zeile(st), 2)}</td></tr>)}</tbody>
            </table>
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Mehr netto pro Monat', 'Extra net per month')} wert={$(plus, 2)} unter={tx(lang, `${$(plus * 12)} im Jahr über den Lohnzettel`, `${$(plus * 12)} a year through payroll`)} />
          <Lohnzettel rows={[
            { label: tx(lang, 'Pendlerpauschale (Freibetrag) pro Jahr', 'Commuter allowance (deduction) per year'), value: $(pp) },
            { label: tx(lang, `Pendlereuro (${$(P.absetzbetraege.pendlereuro_je_km)} je km) pro Jahr`, `Commuter euro (${$(P.absetzbetraege.pendlereuro_je_km)} per km) per year`), value: $(pe) },
            { label: tx(lang, 'Lohnsteuer ohne Pendler', 'Wage tax without commuting'), value: $(ohne.monate[0].lstLaufend, 2), muted: true },
            { label: tx(lang, 'Lohnsteuer mit Pendler', 'Wage tax with commuting'), value: $(mit.monate[0].lstLaufend, 2), muted: true },
            { label: tx(lang, 'Netto pro Monat mit Pendler', 'Net per month with commuting'), value: $(mit.monate[0].netto, 2), strong: true, sep: true },
          ]} />
          {pp > 0 && mit.monate[0].lstLaufend === 0 && <p className="mt-3 text-sm text-navy-700">{tx(lang, `Die Lohnsteuer ist schon null: der Rest kommt über die Arbeitnehmerveranlagung als SV-Rückerstattung (mit Pendlerpauschale bis ${$(P.absetzbetraege.sv_rueckerstattung_pendler_max)}).`, `Wage tax is already zero: the rest comes back through the annual assessment as a social insurance refund (up to ${$(P.absetzbetraege.sv_rueckerstattung_pendler_max)} with a commuter allowance).`)}</p>}
          {pp === 0 && s.pendler !== 'keine' && <p className="mt-3 text-sm text-navy-700">{tx(lang, 'Keine Pauschale: das kleine Pauschale beginnt bei 20 km, das große bei 2 km, und es braucht mindestens 4 Fahrten im Monat.', 'No allowance: the small one starts at 20 km, the large one at 2 km, and you need at least 4 commutes a month.')}</p>}
          <Aktionen lang={lang} text={() => tx(lang, `Pendlerpauschale ${$(pp)} und Pendlereuro ${$(pe)}: ${$(plus, 2)} mehr netto im Monat`, `Commuter allowance ${$(pp)} and commuter euro ${$(pe)}: ${$(plus, 2)} more net a month`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode', 'Calculation method')}</a></p>}
        </div>
      </div>
    </div>
  );
}
