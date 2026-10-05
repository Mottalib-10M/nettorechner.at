/**
 * Urlaubszuschuss und Weihnachtsremuneration Monat für Monat: Jahressechstel, Gehaltserhöhung, Eintritt, Austritt,
 * Prämie, regelmäßige Überstunden, Kontrollrechnung am Jahresende. Motor: lib/engine/jahr.ts.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { rechneJahr, type Monatsbezug } from '../../lib/engine/jahr';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';
import { PROFIL0, LandFeld, type ProfilState } from './Profil';

const MON = { de: ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'], en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] };

export default function SonderzahlungRechner({ lang = 'de', methodHref }: { lang?: L; methodHref?: string }) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const mo = (i: number) => MON[lang][i - 1];
  const opts = (von = 1, bis = 12) => Array.from({ length: bis - von + 1 }, (_, i) => ({ value: String(von + i), label: mo(von + i) }));
  const [b1, setB1] = useState(3000);
  const [ab, setAb] = useState('0');
  const [b2, setB2] = useState(3150);
  const [ein, setEin] = useState('1');
  const [aus, setAus] = useState('0');
  const [uzM, setUzM] = useState('6');
  const [uz, setUz] = useState(3000);
  const [wrM, setWrM] = useState('11');
  const [wr, setWr] = useState(3000);
  const [pr, setPr] = useState(0);
  const [prM, setPrM] = useState('12');
  const [ue, setUe] = useState(0);
  const [ausn, setAusn] = useState('0');
  const [s, setS] = useState<ProfilState>(PROFIL0);
  const set = (x: Partial<ProfilState>) => setS((o) => ({ ...o, ...x }));

  useEffect(() => {
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    const st = (k: string, d: string) => u.get(k) ?? d;
    setB1(num(u, 'b1', 3000)); setAb(st('ab', '0')); setB2(num(u, 'b2', 3150)); setEin(st('e', '1')); setAus(st('x', '0'));
    setUzM(st('um', '6')); setUz(num(u, 'u', 3000)); setWrM(st('wm', '11')); setWr(num(u, 'w', 3000)); setPr(num(u, 'pr', 0)); setPrM(st('pm', '12')); setUe(num(u, 'ue', 0)); setAusn(st('k', '0'));
    if (u.get('l')) set({ land: u.get('l') as ProfilState['land'] });
  }, []);
  useEffect(() => { updateURL({ b1, ab: ab !== '0' ? ab : undefined, b2: ab !== '0' ? b2 : undefined, e: ein !== '1' ? ein : undefined, x: aus !== '0' ? aus : undefined, um: uzM, u: uz, wm: wrM, w: wr, pr: pr || undefined, pm: pr ? prM : undefined, ue: ue || undefined, k: ausn !== '0' ? ausn : undefined, l: s.land }); }, [b1, ab, b2, ein, aus, uzM, uz, wrM, wr, pr, prM, ue, ausn, s]);

  const monate: Monatsbezug[] = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const aktiv = m >= Number(ein) && (aus === '0' || m <= Number(aus));
    const lfd = aktiv ? (ab !== '0' && m >= Number(ab) ? b2 : b1) + ue : 0;
    let sz = 0;
    if (aktiv || (aus !== '0' && m === Number(aus))) {
      if (m === Number(uzM)) sz += uz;
      if (m === Number(wrM)) sz += wr;
      if (pr > 0 && m === Number(prM)) sz += pr;
    }
    // Austritt vor dem Auszahlungsmonat: anteilige Sonderzahlungen kommen mit der Endabrechnung (Eingabe in den Beträgen)
    if (aus !== '0' && m === Number(aus)) {
      if (Number(uzM) > m) sz += uz;
      if (Number(wrM) > m) sz += wr;
      if (pr > 0 && Number(prM) > m) sz += pr;
    }
    return { laufend: lfd, sz };
  }), [b1, ab, b2, ein, aus, uzM, uz, wrM, wr, pr, prM, ue]);
  const j = useMemo(() => rechneJahr(monate, { wien: s.land === 'wien' }, true, aus !== '0' || ausn === '1'), [monate, s.land, aus, ausn]);
  const szMonate = j.monate.filter((m) => m.sz > 0);
  const szNetto = szMonate.reduce((a, m) => a + m.sz - m.svSz - m.lstSzFest - m.lstSzTarif, 0) - j.kontrolle.mehrsteuer;
  const szBrutto = szMonate.reduce((a, m) => a + m.sz, 0);

  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="sz-b1" label={tx(lang, 'Monatsgehalt brutto', 'Monthly gross salary')} value={b1} onChange={setB1} unit="€" max={500000} lang={lang} />
            <LandFeld lang={lang} id="sz" s={s} set={set} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="sz-ab" label={tx(lang, 'Gehaltserhöhung ab', 'Pay rise from')} value={ab} onChange={setAb} options={[{ value: '0', label: tx(lang, 'keine', 'none') }, ...opts(2, 12)]} />
            {ab !== '0' ? <NumberField id="sz-b2" label={tx(lang, 'Neues Monatsgehalt', 'New monthly salary')} value={b2} onChange={setB2} unit="€" max={500000} lang={lang} /> : <NumberField id="sz-ue" label={tx(lang, 'Regelmäßige Überstunden brutto', 'Regular overtime, gross')} value={ue} onChange={setUe} unit={tx(lang, '€/Monat', '€/month')} max={100000} lang={lang} />}
          </div>
          {ab !== '0' && <div className="grid grid-cols-2 gap-x-4 gap-y-4"><NumberField id="sz-ue2" label={tx(lang, 'Regelmäßige Überstunden brutto', 'Regular overtime, gross')} value={ue} onChange={setUe} unit={tx(lang, '€/Monat', '€/month')} max={100000} lang={lang} /></div>}
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="sz-e" label={tx(lang, 'Beschäftigt seit', 'Employed since')} value={ein} onChange={setEin} options={[{ value: '1', label: tx(lang, 'ganzes Jahr', 'whole year') }, ...opts(2, 12)]} />
            <SelectField id="sz-x" label={tx(lang, 'Austritt Ende', 'Leaving at end of')} value={aus} onChange={setAus} options={[{ value: '0', label: tx(lang, 'kein Austritt', 'not leaving') }, ...opts(1, 11)]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="sz-u" label={tx(lang, 'Urlaubszuschuss brutto', 'Holiday pay, gross')} value={uz} onChange={setUz} unit="€" max={500000} lang={lang} />
            <SelectField id="sz-um" label={tx(lang, 'ausbezahlt im', 'paid in')} value={uzM} onChange={setUzM} options={opts()} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="sz-w" label={tx(lang, 'Weihnachtsremuneration brutto', 'Christmas pay, gross')} value={wr} onChange={setWr} unit="€" max={500000} lang={lang} />
            <SelectField id="sz-wm" label={tx(lang, 'ausbezahlt im', 'paid in')} value={wrM} onChange={setWrM} options={opts()} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="sz-pr" label={tx(lang, 'Prämie oder Bonus brutto', 'Bonus, gross')} value={pr} onChange={setPr} unit="€" max={2000000} lang={lang} />
            <SelectField id="sz-pm" label={tx(lang, 'ausbezahlt im', 'paid in')} value={prM} onChange={setPrM} options={opts()} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <SelectField id="sz-k" label={tx(lang, 'Karenz, Krankengeld oder Pflegekarenz im Jahr', 'Parental leave, sick pay or care leave this year')} value={ausn} onChange={setAusn} options={[{ value: '0', label: tx(lang, 'Nein', 'No') }, { value: '1', label: tx(lang, 'Ja', 'Yes') }]} />
          </div>
          <div className="overflow-x-auto rounded-lg bg-navy-50 p-3">
            <table className="lohnzettel w-full text-sm">
              <caption className="mb-1 text-left text-xs font-semibold uppercase tracking-wide text-navy-600">{tx(lang, 'Jede Sonderzahlung im Detail', 'Each special payment in detail')}</caption>
              <thead><tr className="text-left text-navy-700"><th scope="col">{tx(lang, 'Monat', 'Month')}</th><th scope="col" className="text-right">{tx(lang, 'Brutto', 'Gross')}</th><th scope="col" className="text-right">{tx(lang, 'Sechstel offen', 'Sixth left')}</th><th scope="col" className="text-right">{tx(lang, 'über Sechstel', 'over sixth')}</th><th scope="col" className="text-right">SV</th><th scope="col" className="text-right">{tx(lang, 'Steuer', 'Tax')}</th><th scope="col" className="text-right">Netto</th></tr></thead>
              <tbody>{szMonate.map((m) => (
                <tr key={m.monat} className="border-t border-navy-200 text-navy-800"><th scope="row" className="text-left font-normal">{mo(m.monat)}</th><td className="tabular-nums text-right">{$(m.sz)}</td><td className="tabular-nums text-right">{$(m.szImSechstel)}</td><td className="tabular-nums text-right">{$(m.szUeberSechstel)}</td><td className="tabular-nums text-right">{$(m.svSz)}</td><td className="tabular-nums text-right">{$(m.lstSzFest + m.lstSzTarif)}</td><td className="tabular-nums text-right">{$(m.sz - m.svSz - m.lstSzFest - m.lstSzTarif)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Sonderzahlungen netto im Jahr', 'Special payments net for the year')} wert={$(szNetto)} unter={tx(lang, `von ${$(szBrutto)} brutto · Jahressechstel ${$(j.sechstelEnde)}`, `from ${$(szBrutto)} gross · annual sixth ${$(j.sechstelEnde)}`)} />
          <Lohnzettel rows={[
            { label: tx(lang, 'Sonderzahlungen brutto', 'Special payments gross'), value: $(szBrutto, 2) },
            { label: tx(lang, 'Sozialversicherung (ohne AK und WF)', 'Social insurance (no AK, no WF)'), value: `− ${$(szMonate.reduce((a, m) => a + m.svSz, 0), 2)}`, muted: true },
            { label: tx(lang, `Feste Sätze (${$(P.sonderzahlungen.freibetrag)} frei, dann ${formatPercent(P.sonderzahlungen.stufen[1][1], 0, lang)})`, `Fixed rates (${$(P.sonderzahlungen.freibetrag)} free, then ${formatPercent(P.sonderzahlungen.stufen[1][1], 0, lang)})`), value: `− ${$(szMonate.reduce((a, m) => a + m.lstSzFest, 0), 2)}`, muted: true },
            { label: tx(lang, 'Tarifsteuer auf den Teil über dem Sechstel', 'Scale tax on the part above the sixth'), value: `− ${$(szMonate.reduce((a, m) => a + m.lstSzTarif, 0), 2)}`, muted: true },
            ...(j.kontrolle.art === 'nachversteuerung' ? [{ label: tx(lang, `Kontrollrechnung: ${$(j.kontrolle.ueberhang)} über dem Kontrollsechstel nachversteuert`, `Year-end check: ${$(j.kontrolle.ueberhang)} above the control sixth re-taxed`), value: `− ${$(j.kontrolle.mehrsteuer, 2)}`, muted: true }] : []),
            ...(j.kontrolle.art === 'gutschrift' ? [{ label: tx(lang, `Kontrollrechnung: ${$(j.kontrolle.ueberhang)} doch mit festen Sätzen (Gutschrift)`, `Year-end check: ${$(j.kontrolle.ueberhang)} moved back to fixed rates (refund)`), value: `+ ${$(-j.kontrolle.mehrsteuer, 2)}`, muted: true }] : []),
            { label: tx(lang, 'Netto', 'Net'), value: $(szNetto, 2), strong: true, sep: true },
            { label: tx(lang, 'Jahresnetto gesamt', 'Total annual net'), value: $(j.netto) },
          ]} />
          <p className="mt-3 text-sm text-navy-700">{tx(lang, 'Das Sechstel ist ein Sechstel der bis zum Auszahlungsmonat bezahlten laufenden Bezüge, aufs Jahr hochgerechnet. Was darüber liegt, wird wie ein Monatsgehalt nach Tarif versteuert.', 'The sixth is one sixth of the regular pay received up to the payment month, extrapolated to a year. Anything above it is taxed on the scale like a monthly salary.')}</p>
          <Aktionen lang={lang} text={() => tx(lang, `Sonderzahlungen netto ${$(szNetto)} von ${$(szBrutto)} brutto`, `Special payments net ${$(szNetto)} from ${$(szBrutto)} gross`)} />
          {methodHref && <p className="mt-2 text-sm"><a className="underline" href={methodHref}>{tx(lang, 'So rechnen wir', 'How we calculate')}</a></p>}
        </div>
      </div>
    </div>
  );
}
