/**
 * Lohnverrechnung Österreich 2026: Sozialversicherung, Lohnsteuer laufend, Sonderzahlungen (13./14. Bezug).
 * Alle Werte aus params-2026.json. Rechenweg wie der amtliche BMF-Brutto-Netto-Rechner:
 *  - laufender Bezug: (Brutto − SV) × 12 − Werbungskostenpauschale − Pendlerpauschale → Tarif § 33 Abs. 1,
 *    davon Familienbonus Plus (§ 33 Abs. 3a), dann Verkehrsabsetzbetrag, AVAB/AEAB, Pendlereuro; ÷ 12.
 *  - Sonderzahlungen: § 67 Abs. 1 und 2 (Jahressechstel, Freibetrag 620 €, Freigrenze, feste Sätze),
 *    SV ohne AK-Umlage und Wohnbauförderung, eigene Höchstbeitragsgrundlage.
 * Geprüft gegen 408 Fälle des BMF-Rechners (tests/fixtures/bmf-2026.json).
 */
import { P, r2, type Bundesland } from './params';

export type PendlerArt = 'keine' | 'klein' | 'gross';
/** Fahrten im Monat: ab 11 voll, 8 bis 10 zwei Drittel, 4 bis 7 ein Drittel (§ 16 Abs. 1 Z 6 lit. e EStG). */
export type Fahrten = 'voll' | 'zweiDrittel' | 'einDrittel';

export interface Steuerprofil {
  /** Kinder unter 18 mit Familienbeihilfe, für die der Familienbonus beantragt ist. */
  kinderU18?: number;
  /** Kinder ab 18 mit Familienbeihilfe, für die der Familienbonus beantragt ist. */
  kinderUe18?: number;
  /** Familienbonus mit dem anderen Elternteil geteilt (je 50 %). */
  fbGeteilt?: boolean;
  /** Alleinverdiener- oder Alleinerzieherabsetzbetrag beantragt. */
  avab?: boolean;
  /** Anzahl Kinder für AVAB/AEAB (Familienbeihilfe), sonst kinderU18 + kinderUe18. */
  avabKinder?: number;
  pendler?: PendlerArt;
  /** Einfache Wegstrecke Wohnung–Arbeitsstätte in km. */
  km?: number;
  fahrten?: Fahrten;
  /** Beschäftigung in Wien: Wohnbauförderungsbeitrag 0,75 % statt 0,5 % (ab 2026). */
  wien?: boolean;
}

/* ---------------------------------------------------------------- Tarif */

/** Einkommensteuer nach § 33 Abs. 1 EStG 2026 für ein Jahreseinkommen. */
export function tarif(einkommen: number): number {
  const g = P.tarif.grenzen, s = P.tarif.saetze;
  let st = 0, lo = 0;
  for (let i = 0; i < s.length; i++) {
    const hi = i < g.length ? g[i] : Infinity;
    if (einkommen > lo) st += (Math.min(einkommen, hi) - lo) * s[i];
    lo = hi;
  }
  return st;
}
/** Grenzsteuersatz für ein Jahreseinkommen. */
export function grenzsteuersatz(einkommen: number): number {
  const g = P.tarif.grenzen, s = P.tarif.saetze;
  for (let i = 0; i < g.length; i++) if (einkommen <= g[i]) return s[i];
  return s[s.length - 1];
}

/* ---------------------------------------------------------------- Sozialversicherung */

export function avSatz(brutto: number): number {
  for (const [bis, satz] of P.sv.av_staffel) if (brutto <= bis) return satz;
  return P.sv.dn.av;
}
export interface SvTeile { kv: number; pv: number; av: number; ak: number; wf: number; summe: number; satz: number; geringfuegig: boolean; gedeckelt: boolean }

/** Dienstnehmeranteil vom laufenden Monatsbezug. Bis zur Geringfügigkeitsgrenze 0. */
export function svLaufend(brutto: number, wien = false): SvTeile {
  const d = P.sv.dn;
  if (brutto <= P.sv.geringfuegigkeit) return { kv: 0, pv: 0, av: 0, ak: 0, wf: 0, summe: 0, satz: 0, geringfuegig: true, gedeckelt: false };
  const basis = Math.min(brutto, P.sv.hbg_monat);
  const av = avSatz(brutto), wf = wien ? d.wf_wien : d.wf;
  const satz = d.kv + d.pv + av + d.ak + wf;
  return { kv: r2(basis * d.kv), pv: r2(basis * d.pv), av: r2(basis * av), ak: r2(basis * d.ak), wf: r2(basis * wf), summe: r2(basis * satz), satz, geringfuegig: false, gedeckelt: brutto > P.sv.hbg_monat };
}
/**
 * Dienstnehmeranteil von einer Sonderzahlung: KV, PV und AV (Staffel nach der Höhe der Sonderzahlung),
 * keine AK-Umlage, kein Wohnbauförderungsbeitrag. `bereits` = im Jahr schon verbeitragte Sonderzahlungen
 * (Höchstbeitragsgrundlage 13.860 € pro Jahr).
 */
export function svSonderzahlung(sz: number, bereits = 0, laufendGeringfuegig = false): { summe: number; basis: number; satz: number } {
  if (laufendGeringfuegig || sz <= 0) return { summe: 0, basis: 0, satz: 0 };
  const basis = Math.max(0, Math.min(sz, P.sv.hbg_sz_jahr - bereits));
  const satz = P.sv.dn.kv + P.sv.dn.pv + avSatz(sz);
  return { summe: r2(basis * satz), basis, satz };
}

/* ---------------------------------------------------------------- Pendler, Absetzbeträge */

const ALIQUOT: Record<Fahrten, number> = { voll: 1, zweiDrittel: 2 / 3, einDrittel: 1 / 3 };

/** Pendlerpauschale pro Jahr (§ 16 Abs. 1 Z 6 lit. c und d EStG), aliquotiert nach Fahrten im Monat. */
export function pendlerpauschale(art: PendlerArt = 'keine', km = 0, fahrten: Fahrten = 'voll'): number {
  if (art === 'keine' || km <= 0) return 0;
  const k = Math.ceil(km);
  const tab = art === 'klein' ? P.pendlerpauschale.klein : P.pendlerpauschale.gross;
  const stufe = tab.find(([von, bis], i) => (i === 0 ? k >= von : k > von) && k <= bis);
  return stufe ? r2(stufe[2] * ALIQUOT[fahrten]) : 0;
}
/** Pendlereuro pro Jahr: 6 € je km der einfachen Strecke (§ 33 Abs. 5 Z 4 EStG), nur mit Pendlerpauschale. */
export function pendlereuro(art: PendlerArt = 'keine', km = 0, fahrten: Fahrten = 'voll'): number {
  if (pendlerpauschale(art, km, fahrten) <= 0) return 0;
  return r2(P.absetzbetraege.pendlereuro_je_km * Math.ceil(km) * ALIQUOT[fahrten]);
}
/** Alleinverdiener-/Alleinerzieherabsetzbetrag pro Jahr (§ 33 Abs. 4 Z 1 und 2). */
export function avab(kinder: number): number {
  const a = P.absetzbetraege;
  if (kinder <= 0) return 0;
  if (kinder === 1) return a.avab_1_kind;
  return a.avab_2_kinder + (kinder - 2) * a.avab_je_weiteres_kind;
}
/** Verkehrsabsetzbetrag in der Lohnverrechnung: 496 €, mit Pendlerpauschale bis 853 € (eingeschliffen). */
export function verkehrsabsetzbetrag(einkommen: number, mitPendler: boolean): number {
  const a = P.absetzbetraege;
  if (!mitPendler) return a.verkehrsabsetzbetrag;
  if (einkommen <= a.vab_erhoeht_bis) return a.vab_erhoeht;
  if (einkommen >= a.vab_erhoeht_einschleif_bis) return a.verkehrsabsetzbetrag;
  const t = (einkommen - a.vab_erhoeht_bis) / (a.vab_erhoeht_einschleif_bis - a.vab_erhoeht_bis);
  return a.vab_erhoeht - t * (a.vab_erhoeht - a.verkehrsabsetzbetrag);
}
/** Familienbonus Plus pro Monat (§ 33 Abs. 3a), vor der Begrenzung auf die Steuer. */
export function familienbonusMonat(p: Steuerprofil): number {
  const a = P.absetzbetraege;
  const f = p.fbGeteilt ? 0.5 : 1;
  return r2(((p.kinderU18 ?? 0) * a.familienbonus_monat_u18 + (p.kinderUe18 ?? 0) * a.familienbonus_monat_ue18) * f);
}

/* ---------------------------------------------------------------- Lohnsteuer laufend */

export interface LstLaufend {
  lst: number; tarifMonat: number; familienbonus: number; absetzMonat: number;
  bemessungJahr: number; grenzsteuersatz: number; pendlerpauschaleJahr: number; pendlereuroJahr: number; vab: number; avab: number;
}
/**
 * Lohnsteuer eines Monats für den laufenden Bezug. `steuerpflichtig` = Brutto − SV (bereits ohne steuerfreie Teile).
 * Der Familienbonus wird vorrangig abgezogen und auf die Tarifsteuer begrenzt; danach die übrigen Absetzbeträge.
 */
export function lohnsteuerLaufend(steuerpflichtig: number, p: Steuerprofil = {}): LstLaufend {
  const pp = pendlerpauschale(p.pendler, p.km, p.fahrten);
  const pe = pendlereuro(p.pendler, p.km, p.fahrten);
  const bem = Math.max(0, steuerpflichtig * 12 - P.tarif.werbungskostenpauschale - pp);
  const tarifMonat = tarif(bem) / 12;
  const fb = Math.min(familienbonusMonat(p), tarifMonat);
  const vab = verkehrsabsetzbetrag(bem, pp > 0);
  const kinder = p.avabKinder ?? (p.kinderU18 ?? 0) + (p.kinderUe18 ?? 0);
  const av = p.avab ? avab(kinder) : 0;
  const absetzMonat = (vab + av + pe) / 12;
  const lst = r2(Math.max(0, tarifMonat - fb - absetzMonat));
  return { lst, tarifMonat, familienbonus: r2(fb), absetzMonat, bemessungJahr: bem, grenzsteuersatz: grenzsteuersatz(bem), pendlerpauschaleJahr: pp, pendlereuroJahr: pe, vab, avab: av };
}

/* ---------------------------------------------------------------- Feste Sätze § 67 Abs. 1 */

/**
 * Lohnsteuer für sonstige Bezüge innerhalb des Jahressechstels mit festen Sätzen.
 * `basisBisher` = im Jahr bereits mit festen Sätzen versteuerte Bemessungsgrundlage (nach SV, vor Freibetrag).
 * Liefert die Steuer für `basis` neu hinzukommende Euro.
 */
export function festeSaetze(basis: number, basisBisher = 0): number {
  const stufen = P.sonderzahlungen.stufen as [number, number][];
  const steuerBis = (x: number) => {
    let st = 0, lo = 0;
    for (const [breite, satz] of stufen) {
      const hi = lo + breite;
      if (x > lo) st += (Math.min(x, hi) - lo) * satz;
      lo = hi;
    }
    return st;
  };
  return r2(steuerBis(basisBisher + basis) - steuerBis(basisBisher));
}
