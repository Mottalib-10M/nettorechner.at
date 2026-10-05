/**
 * Leistungen und Sonderfälle: Arbeitslosengeld, Notstandshilfe, Kinderbetreuungsgeld, Abfertigung,
 * Überstunden, Netto→Brutto, Dienstgeberkosten. Werte aus params-2026.json.
 */
import { P, r2, type Bundesland } from './params';
import { svLaufend, svSonderzahlung, lohnsteuerLaufend, tarif, avSatz, type Steuerprofil } from './lohn';
import { rechneJahr, standardJahr } from './jahr';

/* ---------------------------------------------------------------- Netto → Brutto */

/** Monatsbrutto, das bei gegebenem Profil den gewünschten laufenden Monatsnetto ergibt (Bisektion auf 1 Cent). */
export function bruttoAusNetto(netto: number, profil: Steuerprofil = {}): number {
  const n = (b: number) => { const sv = svLaufend(b, profil.wien).summe; return b - sv - lohnsteuerLaufend(b - sv, profil).lst; };
  let lo = 0, hi = Math.max(1000, netto * 3);
  while (n(hi) < netto) hi *= 2;
  for (let i = 0; i < 80 && hi - lo > 0.004; i++) { const m = (lo + hi) / 2; if (n(m) < netto) lo = m; else hi = m; }
  return r2(hi);
}

/* ---------------------------------------------------------------- Arbeitslosengeld (§ 21 AlVG) */

export interface AlgErgebnis {
  bemessungMonat: number; nettoTag: number; grundbetrag: number; ergaenzung: number; familienzuschlag: number;
  tagsatz: number; monat30: number; gedeckelt: boolean; quoteRegel: 'grund' | 'ergaenzung60' | 'ergaenzung80';
}
/**
 * Arbeitslosengeld-Tagsatz. Brutto = laufender Monatsbezug ohne Sonderzahlungen; das Gesetz rechnet
 * pauschal ein Sechstel für Sonderzahlungen hinzu und deckelt bei der Höchstbemessungsgrundlage
 * (6.825 € im Jahr 2026, inklusive Sonderzahlungen).
 * Fiktives Netto: wie die Richtwerttabelle der AK (Antrag März 2026) – Abzug der SV ohne Arbeitslosenversicherung
 * und der Lohnsteuer eines alleinstehenden Angestellten mit 14 Bezügen (Verkehrsabsetzbetrag, ohne Werbungskostenpauschale). Abgleich: 102 Tabellenwerte,
 * mittlere Abweichung 0,08 %, höchstens 0,43 % (alg.test.ts).
 */
export function arbeitslosengeld(bruttoLaufend: number, angehoerige = 0): AlgErgebnis {
  const A = P.alg;
  const bemessungMonat = Math.min(bruttoLaufend * 7 / 6, A.hoechstbemessung_monat);
  const b = bemessungMonat * 6 / 7; // laufender Anteil
  const d = P.sv.dn;
  const satzL = d.kv + d.pv + d.ak + d.wf, satzS = d.kv + d.pv;
  const svL = Math.min(b, P.sv.hbg_monat) * (b > P.sv.geringfuegigkeit ? satzL : 0);
  const svS = Math.min(b, P.sv.hbg_monat) * (b > P.sv.geringfuegigkeit ? satzS : 0);
  const lstJahr = Math.max(0, tarif(Math.max(0, (b - svL) * 12)) - P.absetzbetraege.verkehrsabsetzbetrag);
  const szSteuer = 2 * b <= P.sonderzahlungen.freigrenze_sechstel ? 0 : Math.max(0, 2 * (b - svS) - P.sonderzahlungen.freibetrag) * 0.06;
  const nettoJahr = 12 * (b - svL) - lstJahr + 2 * (b - svS) - szSteuer;
  const nettoTag = nettoJahr / 365;
  const grundbetrag = r2(nettoTag * A.grundbetrag_quote);
  const azTag = r2(A.ausgleichszulage_richtsatz / 30);
  const fz = r2(angehoerige * A.familienzuschlag_tag);
  const deckel = r2(nettoTag * (angehoerige > 0 ? A.ergaenzung_quote_mit_fz : A.ergaenzung_quote_ohne_fz));
  let tagsatz = grundbetrag, ergaenzung = 0, quoteRegel: AlgErgebnis['quoteRegel'] = 'grund';
  if (grundbetrag < azTag) {
    const ziel = Math.min(azTag, deckel);
    if (ziel > grundbetrag) { ergaenzung = r2(ziel - grundbetrag); tagsatz = ziel; quoteRegel = angehoerige > 0 ? 'ergaenzung80' : 'ergaenzung60'; }
  }
  let mitFz = tagsatz + fz;
  if (angehoerige > 0) mitFz = Math.min(mitFz, Math.max(tagsatz, deckel));
  const ts = r2(mitFz);
  return { bemessungMonat: r2(bemessungMonat), nettoTag: r2(nettoTag), grundbetrag, ergaenzung, familienzuschlag: r2(ts - tagsatz), tagsatz: ts, monat30: r2(ts * 30), gedeckelt: bruttoLaufend * 7 / 6 > A.hoechstbemessung_monat, quoteRegel };
}

/** Bezugsdauer in Wochen (§ 18 AlVG): 20, 30 (156 Wochen), 39 (312 Wochen in 10 Jahren, ab 40), 52 (468 Wochen in 15 Jahren, ab 50). */
export function algDauer(wochenGesamt: number, alter: number, wochen10J = wochenGesamt, wochen15J = wochenGesamt): number {
  if (alter >= 50 && wochen15J >= 468) return 52;
  if (alter >= 40 && wochen10J >= 312) return 39;
  if (wochenGesamt >= 156) return 30;
  return 20;
}

export interface NhErgebnis { tagsatz: number; quote: number; deckel: number | null; monat30: number }
/**
 * Notstandshilfe (§ 36 AlVG): 95 % des ALG (Grund- und Ergänzungsbetrag), wenn der Grundbetrag den
 * Ausgleichszulagenrichtsatz/30 nicht übersteigt, sonst 92 % des Grundbetrags, mindestens 95 % des Richtsatzes/30.
 * Nach 6 Monaten: höchstens Richtsatz (nach 20 Wochen ALG) bzw. Existenzminimum (nach 30 Wochen), nicht bei 39/52 Wochen.
 * Familienzuschläge kommen dazu. Ohne Anrechnung eigenen Einkommens.
 */
export function notstandshilfe(alg: AlgErgebnis, algWochen: number, nachSechsMonaten = false): NhErgebnis {
  const A = P.alg;
  const azTag = r2(A.ausgleichszulage_richtsatz / 30);
  let nh: number, quote: number;
  if (alg.grundbetrag <= azTag) { nh = r2(A.nh_quote_hoch * alg.grundbetrag) + r2(A.nh_quote_hoch * alg.ergaenzung); quote = A.nh_quote_hoch; }
  else { nh = Math.max(r2(A.nh_quote * alg.grundbetrag), r2(A.nh_quote_hoch * azTag)); quote = A.nh_quote; }
  let deckel: number | null = null;
  if (nachSechsMonaten) {
    if (algWochen <= 20) deckel = azTag;
    else if (algWochen <= 30) deckel = r2(A.existenzminimum_monat / 30);
  }
  if (deckel !== null) nh = Math.min(nh, deckel);
  const ts = r2(nh + alg.familienzuschlag);
  return { tagsatz: ts, quote, deckel, monat30: r2(ts * 30) };
}

/* ---------------------------------------------------------------- Kinderbetreuungsgeld */

/** KBG-Konto: der Kontobetrag (41,14 € × 365 bzw. × 456 bei beiden Elternteilen) verteilt auf die gewählten Tage. */
export function kbgKonto(tage: number, beideEltern = false): { tage: number; tagsatz: number; gesamt: number; monat: number; partnerTage: number } {
  const K = P.kbg;
  const min = beideEltern ? K.konto_tage_beide_min : K.konto_tage_ein_elternteil_min;
  const max = beideEltern ? K.konto_tage_beide_max : K.konto_tage_ein_elternteil_max;
  const t = Math.round(Math.min(max, Math.max(min, tage)));
  const gesamt = K.konto_tag_max * min;
  const tagsatz = r2(Math.min(K.konto_tag_max, gesamt / t));
  return { tage: t, tagsatz, gesamt: r2(tagsatz * t), monat: r2(tagsatz * 30), partnerTage: beideEltern ? Math.round(t * K.partner_anteil) : 0 };
}
/**
 * Einkommensabhängiges KBG (Schätzung): 80 % des Wochengeldes, höchstens 80,12 € am Tag.
 * Wochengeld ≈ Nettoverdienst der letzten drei Monate je Kalendertag plus Sonderzahlungszuschlag (ÖGK: 17 % bei 13. und 14. Bezug).
 */
export function kbgEinkommensabhaengig(nettoMonat: number, szZuschlag = P.kbg.wochengeld_sz_zuschlag.zwei_monatsbezuege): { wochengeldTag: number; tagsatz: number; monat: number; gedeckelt: boolean; mindest: boolean } {
  const K = P.kbg;
  const wg = r2((nettoMonat * 12 / 365) * (1 + szZuschlag));
  const roh = wg * K.ea_quote;
  const tagsatz = r2(Math.min(K.ea_tag_max, Math.max(K.konto_tag_max, roh)));
  return { wochengeldTag: wg, tagsatz, monat: r2(tagsatz * 30), gedeckelt: roh > K.ea_tag_max, mindest: roh < K.konto_tag_max };
}

/* ---------------------------------------------------------------- Abfertigung */

/** Abfertigung neu: 1,53 % des Monatsentgelts inkl. Sonderzahlungen; Zinssatz der BV-Kasse ist eine Annahme des Nutzers. */
export function abfertigungNeu(bruttoMonat: number, jahre: number, zinsProJahr = 0, szAnzahl = 2): { beitraegeJahr: number; einzahlungen: number; kapital: number; netto6: number; anspruch: boolean } {
  const jahrBeitrag = bruttoMonat * (12 + szAnzahl) * P.abfertigung.mv_satz;
  let kap = 0;
  for (let j = 0; j < Math.floor(jahre); j++) kap = kap * (1 + zinsProJahr) + jahrBeitrag;
  const rest = jahre - Math.floor(jahre);
  kap = kap * (1 + zinsProJahr * rest) + jahrBeitrag * rest;
  return { beitraegeJahr: r2(jahrBeitrag), einzahlungen: r2(jahrBeitrag * jahre), kapital: r2(kap), netto6: r2(kap * (1 - P.abfertigung.steuersatz)), anspruch: jahre >= P.abfertigung.neu_mindest_beitragsjahre };
}
/** Abfertigung alt (§ 23 AngG): Monatsentgelte nach Dienstjahren; das Monatsentgelt schließt Sonderzahlungen anteilig ein. */
export function abfertigungAlt(bruttoMonat: number, dienstjahre: number, szAnzahl = 2): { monate: number; monatsentgelt: number; brutto: number; lst6: number; netto: number } {
  const st = P.abfertigung.alt_staffel as [number, number][];
  let monate = 0;
  for (const [ab, m] of st) if (dienstjahre >= ab) monate = m;
  const me = bruttoMonat * (12 + szAnzahl) / 12;
  const brutto = r2(me * monate);
  const lst6 = r2(brutto * P.abfertigung.steuersatz);
  return { monate, monatsentgelt: r2(me), brutto, lst6, netto: r2(brutto - lst6) };
}

/* ---------------------------------------------------------------- Überstunden 2026 */

export interface UeberstundenErgebnis {
  stundenlohn: number; grundvergutung: number; zuschlag: number; steuerfreierZuschlag: number;
  bruttoMehr: number; nettoMehr: number; nettoOhne: number; nettoMit: number; svMehr: number; lstMehr: number;
}
/**
 * Monat mit Überstunden: Grundlohn je Stunde = Monatsbrutto ÷ (Wochenstunden × 4,33); Zuschlag 50 % (§ 10 AZG).
 * Steuerfrei 2026: Zuschläge für die ersten 15 Überstunden, höchstens 50 % des Grundlohns und 170 € (§ 68 Abs. 2 iVm § 124b EStG).
 * Sozialversicherung auf den ganzen Betrag.
 */
export function ueberstunden(bruttoMonat: number, wochenstunden: number, stunden: number, zuschlagSatz = P.ueberstunden.zuschlag_gesetzlich, profil: Steuerprofil = {}): UeberstundenErgebnis {
  const U = P.ueberstunden;
  const sl = bruttoMonat / (wochenstunden * U.wochen_je_monat);
  const grund = sl * stunden, zuschlag = sl * zuschlagSatz * stunden;
  const frei = Math.min(Math.min(stunden, U.frei_stunden_2026) * sl * Math.min(zuschlagSatz, 0.5), U.frei_max_2026);
  const netto = (b: number, sf: number) => { const sv = svLaufend(b, profil.wien).summe; const l = lohnsteuerLaufend(Math.max(0, b - sv - sf), profil).lst; return { n: b - sv - l, sv, l }; };
  const o = netto(bruttoMonat, 0), m = netto(bruttoMonat + grund + zuschlag, frei);
  return { stundenlohn: r2(sl), grundvergutung: r2(grund), zuschlag: r2(zuschlag), steuerfreierZuschlag: r2(frei), bruttoMehr: r2(grund + zuschlag), nettoMehr: r2(m.n - o.n), nettoOhne: r2(o.n), nettoMit: r2(m.n), svMehr: r2(m.sv - o.sv), lstMehr: r2(m.l - o.l) };
}

/* ---------------------------------------------------------------- Dienstgeberkosten */

export interface DgErgebnis { sv: number; svSz: number; mv: number; db: number; dz: number; kommst: number; monat: number; jahr: number; jahrBrutto: number; aufschlag: number }
/** Lohnnebenkosten des Dienstgebers für 12 + n gleiche Bezüge (ohne Wiener Dienstgeberabgabe und ohne Betriebsvereinbarungen). */
export function dienstgeberkosten(brutto: number, land: Bundesland = 'wien', szAnzahl = 2): DgErgebnis {
  const g = P.sv.dg, D = P.dienstgeber;
  const wien = land === 'wien';
  const gering = brutto <= P.sv.geringfuegigkeit;
  const basis = Math.min(brutto, P.sv.hbg_monat);
  const satzL = gering ? g.uv : g.kv + g.pv + g.av + g.uv + g.ie + (wien ? g.wf_wien : g.wf);
  const satzS = gering ? g.uv : g.kv + g.pv + g.av + g.uv + g.ie;
  const sv = r2(basis * satzL);
  const szBasis = Math.min(brutto, P.sv.hbg_sz_jahr / Math.max(1, szAnzahl));
  const svSz = r2(szBasis * satzS);
  const mv = r2(brutto * g.mv), db = r2(brutto * D.db), dz = r2(brutto * D.dz[land]), kommst = r2(brutto * D.kommunalsteuer);
  const monat = r2(sv + mv + db + dz + kommst);
  const szKosten = r2(svSz + mv + db + dz + kommst);
  const jahr = r2(12 * (brutto + monat) + szAnzahl * (brutto + szKosten));
  const jahrBrutto = brutto * (12 + szAnzahl);
  return { sv, svSz, mv, db, dz, kommst, monat, jahr, jahrBrutto, aufschlag: jahr / jahrBrutto - 1 };
}

/* ---------------------------------------------------------------- Kurzfassung für Mini-Rechner */

/** Monatliches und jährliches Netto für 12 + n gleiche Bezüge. */
export function kurz(brutto: number, profil: Steuerprofil = {}, szAnzahl = 2) {
  const j = rechneJahr(standardJahr(brutto, szAnzahl), profil);
  const m = j.monate[0];
  return { nettoMonat: m.netto, svMonat: m.svLaufend, lstMonat: m.lstLaufend, nettoJahr: j.netto, svJahr: j.sv, lstJahr: j.lst, bruttoJahr: j.brutto, avSatz: avSatz(brutto), uz: j.monate[5], wr: j.monate[10] };
}
export { svSonderzahlung };
