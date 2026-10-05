/**
 * Monat für Monat durch das Kalenderjahr: laufende Bezüge, 13./14. Bezug und Prämien mit Jahressechstel.
 *
 * § 67 Abs. 2 EStG: Das Jahressechstel ist ein Sechstel der bereits zugeflossenen, auf das Kalenderjahr
 * umgerechneten laufenden Bezüge, der laufende Bezug des Auszahlungsmonats eingeschlossen. Was an sonstigen
 * Bezügen darüber liegt (oder über 83.333 € nach SV), wird im Auszahlungsmonat wie ein laufender Bezug
 * nach dem Tarif versteuert (§ 67 Abs. 10). § 77 Abs. 4a: Am Jahresende darf nicht mehr als ein Sechstel der
 * tatsächlich zugeflossenen laufenden Bezüge mit festen Sätzen versteuert sein (Kontrollrechnung).
 */
import { P, r2 } from './params';
import { svLaufend, svSonderzahlung, lohnsteuerLaufend, festeSaetze, type Steuerprofil } from './lohn';

export interface Monatsbezug {
  /** Laufender Bruttobezug des Monats (0 = kein Bezug, z. B. vor dem Eintritt). */
  laufend: number;
  /** Steuerfreier Teil des laufenden Bezugs (z. B. Überstundenzuschläge nach § 68). */
  steuerfrei?: number;
  /** Sonstiger Bezug in diesem Monat (Urlaubszuschuss, Weihnachtsremuneration, Prämie), brutto. */
  sz?: number;
}
export interface MonatsErgebnis {
  monat: number; laufend: number; sz: number;
  svLaufend: number; lstLaufend: number;
  svSz: number; lstSzFest: number; szImSechstel: number; szUeberSechstel: number; sechstel: number;
  /** Lohnsteuer, die der Teil über dem Sechstel nach dem Tarif zusätzlich auslöst (in lstLaufend enthalten). */
  lstSzTarif: number;
  netto: number;
}
export interface JahresErgebnis {
  monate: MonatsErgebnis[];
  brutto: number; sv: number; lst: number; netto: number;
  /** Nachversteuerung aus der Kontrollrechnung (§ 77 Abs. 4a), im letzten Bezugsmonat. */
  kontrolle: { ueberhang: number; mehrsteuer: number; art: 'nachversteuerung' | 'gutschrift' | null };
  sechstelEnde: number; szFestGesamt: number;
}

/**
 * @param ausnahme Ausnahme von § 77 Abs. 4a Z 1 liegt vor (Austritt ohne neues Dienstverhältnis beim selben Arbeitgeber,
 *                 Elternkarenz, Krankengeld, Reha-, Pflege-, Hospizkarenz, Wiedereingliederung, Präsenz-/Zivildienst, Altersteilzeit, Teilpension).
 */
export function rechneJahr(monate: Monatsbezug[], profil: Steuerprofil = {}, kontrollrechnung = true, ausnahme = false): JahresErgebnis {
  const wien = !!profil.wien;
  let sumL = 0, nL = 0, szImSechstelSumme = 0, festBasis = 0, svSzBasis = 0;
  const out: MonatsErgebnis[] = [];
  const tarifBasis: Array<{ basis: number; zusatz: number }> = [];
  let letzter = -1;
  monate.forEach((m, i) => {
    const L = m.laufend || 0, sz = m.sz || 0;
    if (L <= 0 && sz <= 0) { tarifBasis.push({ basis: 0, zusatz: 0 }); out.push({ monat: i + 1, laufend: 0, sz: 0, svLaufend: 0, lstLaufend: 0, svSz: 0, lstSzFest: 0, szImSechstel: 0, szUeberSechstel: 0, sechstel: 0, lstSzTarif: 0, netto: 0 }); return; }
    letzter = i;
    const sv = svLaufend(L, wien);
    if (L > 0) { sumL += L; nL++; }
    let svSz = 0, lstFest = 0, imSechstel = 0, ueber = 0, sechstel = 0, tarifZusatz = 0;
    if (sz > 0) {
      const s = svSonderzahlung(sz, svSzBasis, sv.geringfuegig && L > 0);
      svSzBasis += s.basis; svSz = s.summe;
      sechstel = nL > 0 ? (sumL / nL) * 12 / 6 : 0;
      imSechstel = Math.min(sz, Math.max(0, sechstel - szImSechstelSumme));
      ueber = sz - imSechstel;
      const svIn = sz > 0 ? svSz * imSechstel / sz : 0;
      const svUe = svSz - svIn;
      let basisIn = Math.max(0, imSechstel - svIn);
      // über 83.333 € (nach SV) hinaus gilt der Tarif
      const frei = Math.max(0, P.sonderzahlungen.obergrenze_feste_saetze - festBasis);
      const zuTarif = Math.max(0, basisIn - frei);
      basisIn -= zuTarif;
      if (sechstel > P.sonderzahlungen.freigrenze_sechstel) lstFest = festeSaetze(basisIn, festBasis);
      festBasis += basisIn;
      szImSechstelSumme += imSechstel;
      tarifZusatz = Math.max(0, ueber - svUe) + zuTarif;
    }
    const basisL = Math.max(0, L - sv.summe - (m.steuerfrei ?? 0));
    tarifBasis.push({ basis: basisL, zusatz: tarifZusatz });
    const lst = lohnsteuerLaufend(basisL + tarifZusatz, profil);
    const lstSzTarif = tarifZusatz > 0 ? r2(lst.lst - lohnsteuerLaufend(basisL, profil).lst) : 0;
    out.push({ monat: i + 1, laufend: L, sz, svLaufend: sv.summe, lstLaufend: lst.lst, svSz, lstSzFest: lstFest, szImSechstel: imSechstel, szUeberSechstel: ueber, sechstel, lstSzTarif, netto: r2(L + sz - sv.summe - lst.lst - svSz - lstFest) });
  });

  // Kontrollrechnung § 77 Abs. 4a beim letzten laufenden Bezug des Jahres (Kontrollsechstel = ein Sechstel der
  // im Jahr zugeflossenen laufenden Bezüge).
  //  Z 1: mehr als das Kontrollsechstel mit festen Sätzen versteuert → Überhang nach dem Tarif nachversteuern;
  //       entfällt u. a. bei Beendigung des Dienstverhältnisses (lit. j), Elternkarenz, Krankengeld (lit. a bis i).
  //  Z 2: weniger als das Kontrollsechstel mit festen Sätzen versteuert, aber sonstige Bezüge nach dem Tarif
  //       versteuert → Differenz mit festen Sätzen neu versteuern (Gutschrift).
  let ueberhang = 0, mehrsteuer = 0;
  let art: 'nachversteuerung' | 'gutschrift' | null = null;
  const sechstelEnde = sumL / 6;
  const svQuote = out.reduce((s, m) => s + m.svSz, 0) / Math.max(1, out.reduce((s, m) => s + m.sz, 0));
  if (kontrollrechnung && letzter >= 0) {
    const lm = out[letzter];
    if (szImSechstelSumme > sechstelEnde + 0.005 && !ausnahme) {
      ueberhang = r2(szImSechstelSumme - sechstelEnde);
      const basisUe = Math.min(festBasis, ueberhang * (1 - svQuote));
      const festAlt = festeSaetze(festBasis, 0), festNeu = festeSaetze(festBasis - basisUe, 0);
      const z = tarifBasis[letzter];
      const ohne = lohnsteuerLaufend(z.basis + z.zusatz, profil).lst;
      const mit = lohnsteuerLaufend(z.basis + z.zusatz + basisUe, profil).lst;
      mehrsteuer = r2(mit - ohne - (festAlt - festNeu));
      art = 'nachversteuerung';
    } else if (szImSechstelSumme < sechstelEnde - 0.005) {
      const ueberGesamt = out.reduce((s, m) => s + m.szUeberSechstel, 0);
      if (ueberGesamt > 0.005) {
        ueberhang = r2(Math.min(sechstelEnde - szImSechstelSumme, ueberGesamt));
        let rest = ueberhang * (1 - svQuote), entlastung = 0, verschoben = 0;
        for (let i = 11; i >= 0 && rest > 0.004; i--) {
          const z = tarifBasis[i];
          if (!z || z.zusatz <= 0) continue;
          const d = Math.min(rest, z.zusatz);
          entlastung += lohnsteuerLaufend(z.basis + z.zusatz, profil).lst - lohnsteuerLaufend(z.basis + z.zusatz - d, profil).lst;
          verschoben += d; rest -= d;
        }
        mehrsteuer = r2(festeSaetze(verschoben, festBasis) - entlastung);
        art = 'gutschrift';
      }
    }
    lm.lstLaufend = r2(lm.lstLaufend + mehrsteuer);
    lm.netto = r2(lm.netto - mehrsteuer);
  }
  const sum = (f: (m: MonatsErgebnis) => number) => r2(out.reduce((s, m) => s + f(m), 0));
  const brutto = sum((m) => m.laufend + m.sz), sv = sum((m) => m.svLaufend + m.svSz), lst = sum((m) => m.lstLaufend + m.lstSzFest);
  return { monate: out, brutto, sv, lst, netto: r2(brutto - sv - lst), kontrolle: { ueberhang, mehrsteuer, art }, sechstelEnde, szFestGesamt: szImSechstelSumme };
}

/** Das übliche Jahr: 12 gleiche Monatsbezüge, Urlaubszuschuss im Juni und Weihnachtsremuneration im November. */
export function standardJahr(brutto: number, szAnzahl = 2, szHoehe = brutto, szMonate: number[] = [6, 11]): Monatsbezug[] {
  return Array.from({ length: 12 }, (_, i) => ({ laufend: brutto, sz: szMonate.slice(0, szAnzahl).includes(i + 1) ? szHoehe : 0 }));
}
