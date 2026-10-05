/** Familienbonus Plus 2026: wie viel davon wirkt bei Ihrem Gehalt, plus Kindermehrbetrag für Alleinverdiener/-erzieher. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import { rechneJahr, standardJahr } from '../../lib/engine/jahr';
import { tarif, svLaufend, familienbonusMonat } from '../../lib/engine/lohn';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';
import { PROFIL0, zuProfil, profilAusUrl, profilZuUrl, LandFeld, FamilieFelder, type ProfilState } from './Profil';

export function kindermehrbetrag(brutto: number, kinder: number, wien = false): number {
  const sv = svLaufend(brutto, wien).summe;
  const est = tarif(Math.max(0, (brutto - sv) * 12 - P.tarif.werbungskostenpauschale));
  if (kinder <= 0 || est >= P.absetzbetraege.kindermehrbetrag * kinder) return 0;
  return Math.max(0, P.absetzbetraege.kindermehrbetrag * kinder - est);
}

export default function FamilienbonusRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const [brutto, setBrutto] = useState(2800);
  const s0 = { ...PROFIL0, k1: 2 };
  const [s, setS] = useState<ProfilState>(s0);
  const set = (x: Partial<ProfilState>) => setS((o) => ({ ...o, ...x }));
  useEffect(() => { const u = readParams(window.location.search); if (![...u.keys()].length) return; setBrutto(num(u, 'b', 2800)); setS(profilAusUrl(u, s0)); }, []);
  useEffect(() => { updateURL({ b: brutto, ...profilZuUrl(s) }); }, [brutto, s]);
  const profil = zuProfil(s);
  const ohne = useMemo(() => rechneJahr(standardJahr(brutto), { ...profil, kinderU18: 0, kinderUe18: 0 }), [brutto, JSON.stringify(profil)]);
  const mit = useMemo(() => rechneJahr(standardJahr(brutto), profil), [brutto, JSON.stringify(profil)]);
  const max = familienbonusMonat(profil) * 12;
  const genutzt = (mit.netto - ohne.netto);
  const kmb = s.avab === '1' ? kindermehrbetrag(brutto, s.k1 + s.k2, profil.wien) : 0;
  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="fb-b" label={tx(lang, 'Bruttogehalt pro Monat', 'Gross salary per month')} value={brutto} onChange={setBrutto} unit="€" max={500000} lang={lang} />
            <LandFeld lang={lang} id="fb" s={s} set={set} />
          </div>
          <FamilieFelder lang={lang} id="fb" s={s} set={set} />
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Familienbonus, der bei Ihnen wirkt', 'Familienbonus that actually applies')} wert={$(genutzt)} unter={tx(lang, `von möglichen ${$(max)} im Jahr · ${$(genutzt / 12, 2)} pro Monat`, `out of a possible ${$(max)} a year · ${$(genutzt / 12, 2)} per month`)} />
          <Lohnzettel rows={[
            { label: tx(lang, 'Lohnsteuer pro Monat ohne Familienbonus', 'Monthly wage tax without Familienbonus'), value: $(ohne.monate[0].lstLaufend, 2), muted: true },
            { label: tx(lang, 'Lohnsteuer pro Monat mit Familienbonus', 'Monthly wage tax with Familienbonus'), value: $(mit.monate[0].lstLaufend, 2), muted: true },
            { label: tx(lang, 'Netto pro Monat', 'Net per month'), value: $(mit.monate[0].netto, 2), strong: true, sep: true },
            ...(max - genutzt > 1 ? [{ label: tx(lang, 'Nicht nutzbar (Steuer zu niedrig)', 'Unusable (tax too low)'), value: $(max - genutzt) }] : []),
            ...(kmb > 0 ? [{ label: tx(lang, 'Kindermehrbetrag über die Veranlagung', 'Kindermehrbetrag via tax assessment'), value: $(kmb), strong: true }] : []),
          ]} />
          {max - genutzt > 1 && s.avab !== '1' && <p className="mt-3 text-sm text-navy-700">{tx(lang, `Alleinverdienende und Alleinerziehende mit niedriger Steuer bekommen bis zu ${$(P.absetzbetraege.kindermehrbetrag)} je Kind als Kindermehrbetrag ausbezahlt: oben „Alleinverdiener / Alleinerzieher“ wählen.`, `Sole earners and single parents with low tax receive up to ${$(P.absetzbetraege.kindermehrbetrag)} per child as Kindermehrbetrag: choose “Sole earner / single parent” above.`)}</p>}
          <Aktionen lang={lang} text={() => tx(lang, `Familienbonus Plus: ${$(genutzt)} von ${$(max)} wirken`, `Familienbonus Plus: ${$(genutzt)} of ${$(max)} applies`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode', 'Calculation method')}</a></p>}
        </div>
      </div>
    </div>
  );
}
