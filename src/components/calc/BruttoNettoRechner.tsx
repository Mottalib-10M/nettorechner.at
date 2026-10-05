/**
 * Brutto-Netto-Rechner Österreich 2026 (Startseite, Wien-Seite, Einbettung).
 * Motor: lib/engine/jahr.ts (Monat für Monat, Jahressechstel). Erster Rendervorgang = Standardwerte
 * (RECETTE §17.5), der geteilte Link wird erst in useEffect gelesen.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import StackedBar from '../ui/StackedBar';
import { rechneJahr, standardJahr } from '../../lib/engine/jahr';
import { svLaufend, lohnsteuerLaufend, avSatz } from '../../lib/engine/lohn';
import { dienstgeberkosten } from '../../lib/engine/leistungen';
import { P } from '../../lib/engine/params';
import { formatMoney, formatPercent } from '../../lib/format';
import { readParams, num, updateURL } from '../../lib/url-state';
import { Lohnzettel, Aktionen, Kopf, kasten, rahmen, tx, type L } from './kit';
import { PROFIL0, zuProfil, profilAusUrl, profilZuUrl, LandFeld, FamilieFelder, PendlerFelder, LAND_NAME, type ProfilState } from './Profil';

interface Props { lang?: L; methodHref?: string; preset?: Partial<ProfilState>; bruttoStart?: number }

export default function BruttoNettoRechner({ lang = 'de', methodHref, preset = {}, bruttoStart = 3000 }: Props) {
  const $ = (x: number, d = 0) => formatMoney(x, d, lang);
  const p0 = { ...PROFIL0, ...preset };
  const [brutto, setBrutto] = useState(bruttoStart);
  const [zeitraum, setZeitraum] = useState('m');
  const [szAnz, setSzAnz] = useState('2');
  const [s, setS] = useState<ProfilState>(p0);
  const set = (x: Partial<ProfilState>) => setS((o) => ({ ...o, ...x }));

  useEffect(() => {
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    setBrutto(num(u, 'b', bruttoStart)); setZeitraum(u.get('z') === 'j' ? 'j' : 'm'); setSzAnz(['0', '1', '2'].includes(u.get('s') ?? '') ? u.get('s')! : '2');
    setS(profilAusUrl(u, p0));
  }, []);

  const n = Number(szAnz);
  const monat = zeitraum === 'j' ? brutto / (12 + n) : brutto;
  const profil = zuProfil(s);
  const j = useMemo(() => rechneJahr(standardJahr(monat, n), profil), [monat, n, JSON.stringify(profil)]);
  useEffect(() => { updateURL({ b: brutto, z: zeitraum === 'j' ? 'j' : undefined, s: szAnz !== '2' ? szAnz : undefined, ...profilZuUrl(s) }); }, [brutto, zeitraum, szAnz, s]);

  const m = j.monate[0];
  const sv = svLaufend(monat, profil.wien);
  const lst = lohnsteuerLaufend(Math.max(0, monat - sv.summe), profil);
  const uz = n >= 1 ? j.monate[5] : null, wr = n >= 2 ? j.monate[10] : null;
  const dg = dienstgeberkosten(monat, s.land, n);
  const abz = j.brutto > 0 ? (j.sv + j.lst) / j.brutto : 0;
  const av = avSatz(monat);
  const pc = (x: number, d = 2) => formatPercent(x, d, lang);

  const zeilen = [
    { label: tx(lang, 'Bruttobezug', 'Gross pay'), value: $(monat, 2) },
    { label: tx(lang, `Krankenversicherung ${pc(P.sv.dn.kv)}`, `Health insurance ${pc(P.sv.dn.kv)}`), value: `− ${$(sv.kv, 2)}`, muted: true },
    { label: tx(lang, `Pensionsversicherung ${pc(P.sv.dn.pv)}`, `Pension insurance ${pc(P.sv.dn.pv)}`), value: `− ${$(sv.pv, 2)}`, muted: true },
    { label: tx(lang, `Arbeitslosenversicherung ${pc(av)}`, `Unemployment insurance ${pc(av)}`), value: `− ${$(sv.av, 2)}`, muted: true },
    { label: tx(lang, `Arbeiterkammerumlage ${pc(P.sv.dn.ak, 1)}`, `Chamber of Labour levy ${pc(P.sv.dn.ak, 1)}`), value: `− ${$(sv.ak, 2)}`, muted: true },
    { label: tx(lang, `Wohnbauförderung ${pc(profil.wien ? P.sv.dn.wf_wien : P.sv.dn.wf)}`, `Housing subsidy ${pc(profil.wien ? P.sv.dn.wf_wien : P.sv.dn.wf)}`), value: `− ${$(sv.wf, 2)}`, muted: true },
    { label: tx(lang, 'Sozialversicherung gesamt', 'Social insurance total'), value: `− ${$(m.svLaufend, 2)}` },
    ...(lst.familienbonus > 0 ? [{ label: tx(lang, 'davon Familienbonus Plus abgezogen', 'Familienbonus Plus deducted'), value: $(lst.familienbonus, 2), muted: true }] : []),
    { label: tx(lang, 'Lohnsteuer', 'Wage tax'), value: `− ${$(m.lstLaufend, 2)}` },
    { label: tx(lang, 'Netto pro Monat', 'Net per month'), value: $(m.netto, 2), strong: true, sep: true },
  ];
  const jahr = [
    { label: tx(lang, 'Jänner bis Dezember, je', 'January to December, each'), value: $(m.netto, 2) },
    ...(uz ? [{ label: tx(lang, `Urlaubszuschuss (Juni): SV ${$(uz.svSz, 2)}, LSt ${$(uz.lstSzFest, 2)}`, `Holiday pay (June): SI ${$(uz.svSz, 2)}, tax ${$(uz.lstSzFest, 2)}`), value: $(uz.sz - uz.svSz - uz.lstSzFest, 2) }] : []),
    ...(wr ? [{ label: tx(lang, `Weihnachtsremuneration (November): SV ${$(wr.svSz, 2)}, LSt ${$(wr.lstSzFest, 2)}`, `Christmas pay (November): SI ${$(wr.svSz, 2)}, tax ${$(wr.lstSzFest, 2)}`), value: $(wr.sz - wr.svSz - wr.lstSzFest, 2) }] : []),
    { label: tx(lang, `Jahresnetto aus ${12 + n} Bezügen`, `Annual net from ${12 + n} payments`), value: $(j.netto), strong: true, sep: true },
  ];
  const segs = [
    { label: tx(lang, 'Netto', 'Net'), value: Math.max(0, j.netto), color: '#7f0d1f' },
    { label: tx(lang, 'Sozialversicherung', 'Social insurance'), value: j.sv, color: '#94a3b8' },
    { label: tx(lang, 'Lohnsteuer', 'Wage tax'), value: j.lst, color: '#e2e8f0' },
  ];
  const hinweise: string[] = [];
  if (sv.geringfuegig) hinweise.push(tx(lang, `Unter der Geringfügigkeitsgrenze (${$(P.sv.geringfuegigkeit, 2)}): keine Sozialversicherung vom Dienstnehmer.`, `Below the marginal-employment limit (${$(P.sv.geringfuegigkeit, 2)}): no employee social insurance.`));
  if (sv.gedeckelt) hinweise.push(tx(lang, `Über der Höchstbeitragsgrundlage (${$(P.sv.hbg_monat)}): SV nur bis zu diesem Betrag.`, `Above the contribution ceiling (${$(P.sv.hbg_monat)}): social insurance only up to that amount.`));
  if (av > 0 && av < 0.0295) hinweise.push(tx(lang, `Geringes Einkommen: Arbeitslosenversicherung nur ${pc(av, 0)} statt ${pc(P.sv.dn.av)}.`, `Low pay: unemployment insurance only ${pc(av, 0)} instead of ${pc(P.sv.dn.av)}.`));
  if (lst.pendlerpauschaleJahr > 0) hinweise.push(tx(lang, `Pendlerpauschale ${$(lst.pendlerpauschaleJahr)} und Pendlereuro ${$(lst.pendlereuroJahr)} im Jahr berücksichtigt.`, `Commuter allowance ${$(lst.pendlerpauschaleJahr)} and commuter euro ${$(lst.pendlereuroJahr)} a year included.`));
  if (profil.wien) hinweise.push(tx(lang, `Wien: Wohnbauförderungsbeitrag ${pc(P.sv.dn.wf_wien)} seit 1. Jänner 2026.`, `Vienna: housing-subsidy contribution ${pc(P.sv.dn.wf_wien)} since 1 January 2026.`));

  return (
    <div className={rahmen} data-chrome>
      <div className="rwr h-1.5" aria-hidden="true" />
      <div className="p-4 sm:p-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <NumberField id="bn-b" label={zeitraum === 'j' ? tx(lang, 'Jahresbrutto', 'Annual gross') : tx(lang, 'Bruttogehalt pro Monat', 'Gross salary per month')} value={brutto} onChange={setBrutto} unit="€" max={2000000} lang={lang} />
            <SelectField id="bn-z" label={tx(lang, 'Eingabe als', 'Amount is')} value={zeitraum} onChange={setZeitraum} options={[{ value: 'm', label: tx(lang, 'Monatsbezug', 'Monthly pay') }, { value: 'j', label: tx(lang, 'Jahresbrutto', 'Annual gross') }]} />
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <LandFeld lang={lang} id="bn" s={s} set={set} />
            <SelectField id="bn-s" label={tx(lang, 'Sonderzahlungen', 'Special payments')} value={szAnz} onChange={setSzAnz} options={[{ value: '2', label: tx(lang, '13. und 14. Gehalt', '13th and 14th salary') }, { value: '1', label: tx(lang, 'nur eine', 'one only') }, { value: '0', label: tx(lang, 'keine', 'none') }]} />
          </div>
          <details className="rounded-lg border border-navy-200 p-4" open={s.k1 + s.k2 > 0 || s.pendler !== 'keine' || s.avab === '1'}>
            <summary className="cursor-pointer text-sm font-semibold text-navy-900">{tx(lang, 'Kinder, Alleinverdiener, Arbeitsweg', 'Children, sole earner, commute')}</summary>
            <div className="mt-4 space-y-4">
              <FamilieFelder lang={lang} id="bn" s={s} set={set} />
              <PendlerFelder lang={lang} id="bn" s={s} set={set} />
            </div>
          </details>
        </form>
        <div aria-live="polite" className={kasten}>
          <Kopf label={tx(lang, 'Netto pro Monat', 'Net per month')} wert={$(m.netto)} unter={tx(lang, `Jahresnetto ${$(j.netto)} · Abzüge ${formatPercent(abz, 1, lang)} · ${LAND_NAME[s.land]}`, `Annual net ${$(j.netto)} · deductions ${formatPercent(abz, 1, lang)} · ${LAND_NAME[s.land]}`)} />
          <div className="mt-4"><StackedBar segments={segs} total={Math.max(1, j.brutto)} ariaPrefix={tx(lang, 'Aufteilung des Jahresbruttos', 'Split of annual gross')} /></div>
          <Lohnzettel rows={zeilen} />
          <div className="mt-4 rounded-lg bg-white/70 p-3"><Lohnzettel caption={tx(lang, 'Ihr Jahr in Zahlungen', 'Your year in payments')} rows={jahr} /></div>
          {hinweise.length > 0 && <ul className="mt-3 space-y-1 text-sm text-navy-700">{hinweise.map((h) => <li key={h}>{h}</li>)}</ul>}
          <p className="mt-3 text-sm text-navy-700">{tx(lang, `Grenzsteuersatz ${formatPercent(lst.grenzsteuersatz, 0, lang)} · Dienstgeber zahlt zusätzlich ${$(dg.monat)} im Monat`, `Marginal tax rate ${formatPercent(lst.grenzsteuersatz, 0, lang)} · employer pays an extra ${$(dg.monat)} a month`)}</p>
          <Aktionen lang={lang} text={() => tx(lang, `Netto ${$(m.netto)} pro Monat, ${$(j.netto)} im Jahr bei ${$(monat)} brutto`, `Net ${$(m.netto)} a month, ${$(j.netto)} a year on ${$(monat)} gross`)} />
          <details className="mt-3 text-sm text-navy-700">
            <summary className="cursor-pointer font-medium text-navy-800">{tx(lang, 'Annahmen', 'Assumptions')}</summary>
            <p className="mt-2">{tx(lang, 'Angestellte oder Arbeiter mit gleichem Bezug jeden Monat, Sonderzahlungen in Höhe eines Monatsbezugs im Juni und November, Werte 2026. Nicht enthalten: Sachbezüge, Überstunden, Betriebsratsumlage, Gewerkschaftsbeitrag, Rückerstattungen aus der Arbeitnehmerveranlagung.', 'Salaried or blue-collar employee with the same pay each month, special payments of one month’s pay in June and November, 2026 values. Not included: benefits in kind, overtime, works council levy, union dues, refunds from the annual tax assessment.')}</p>
            {methodHref && <p className="mt-1"><a className="underline" href={methodHref}>{tx(lang, 'Berechnungsmethode und Abgleich mit dem BMF', 'Calculation method and BMF check')}</a></p>}
          </details>
        </div>
      </div>
    </div>
  );
}
