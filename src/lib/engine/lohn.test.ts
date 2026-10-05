/** Einzelregeln: Tarif, Pendler, AVAB, feste Sätze, Freigrenze, Jahressechstel, Kontrollrechnung, Überstunden. */
import { describe, expect, it } from 'vitest';
import { P } from './params';
import { tarif, pendlerpauschale, pendlereuro, avab, festeSaetze, svLaufend, svSonderzahlung, lohnsteuerLaufend, avSatz } from './lohn';
import { rechneJahr, standardJahr } from './jahr';
import { ueberstunden, bruttoAusNetto, dienstgeberkosten, abfertigungAlt, abfertigungNeu, kbgKonto, kbgEinkommensabhaengig } from './leistungen';

describe('Tarif § 33 EStG 2026', () => {
  it('Grenzen 2026 wie im RIS (§ 33 Abs. 1, Fassung ab 1.1.2026)', () => {
    expect(P.tarif.grenzen).toEqual([13539, 21992, 36458, 70365, 104859, 1000000]);
  });
  it('Stufen', () => {
    expect(tarif(13539)).toBe(0);
    expect(tarif(21992)).toBeCloseTo(8453 * 0.2, 6);
    expect(tarif(30000)).toBeCloseTo(8453 * 0.2 + (30000 - 21992) * 0.3, 6);
  });
});

describe('Sozialversicherung', () => {
  it('Geringfügigkeitsgrenze 551,10 €', () => { expect(svLaufend(551.1).summe).toBe(0); expect(svLaufend(551.11).summe).toBeGreaterThan(0); });
  it('AV-Staffel an den Grenzen', () => {
    expect(avSatz(2225)).toBe(0); expect(avSatz(2225.01)).toBe(0.01); expect(avSatz(2427)).toBe(0.01);
    expect(avSatz(2427.01)).toBe(0.02); expect(avSatz(2630)).toBe(0.02); expect(avSatz(2630.01)).toBe(0.0295);
  });
  it('Höchstbeitragsgrundlage 6.930 €', () => { expect(svLaufend(9000).summe).toBe(svLaufend(6930).summe); });
  it('Wien: 0,25 Prozentpunkte mehr', () => { expect(svLaufend(3000, true).summe - svLaufend(3000).summe).toBeCloseTo(7.5, 2); });
  it('Sonderzahlung: keine AK und keine WF, Jahresdeckel 13.860 €', () => {
    expect(svSonderzahlung(3000).summe).toBeCloseTo(3000 * 0.1707, 2);
    expect(svSonderzahlung(10000, 10000).basis).toBe(3860);
  });
});

describe('Pendler', () => {
  it('kleines Pauschale erst ab 20 km', () => { expect(pendlerpauschale('klein', 19.5)).toBe(696); expect(pendlerpauschale('klein', 19)).toBe(0); expect(pendlerpauschale('klein', 40)).toBe(696); expect(pendlerpauschale('klein', 40.2)).toBe(1356); });
  it('großes Pauschale ab 2 km', () => { expect(pendlerpauschale('gross', 2)).toBe(372); expect(pendlerpauschale('gross', 21)).toBe(1476); expect(pendlerpauschale('gross', 61)).toBe(3672); });
  it('Aliquotierung nach Fahrten', () => { expect(pendlerpauschale('klein', 30, 'zweiDrittel')).toBe(464); expect(pendlerpauschale('klein', 30, 'einDrittel')).toBe(232); });
  it('Pendlereuro 6 € je km, 35 km = +140 € gegenüber 2025 (BMF)', () => {
    expect(pendlereuro('klein', 35)).toBe(210);
    expect(pendlereuro('klein', 35) - 35 * P.absetzbetraege.pendlereuro_je_km_2025).toBe(140);
    expect(pendlereuro('klein', 10)).toBe(0);
  });
});

describe('AVAB / AEAB', () => { it('612 / 828 / +273', () => { expect(avab(1)).toBe(612); expect(avab(2)).toBe(828); expect(avab(4)).toBe(1374); }); });

describe('Feste Sätze § 67 Abs. 1', () => {
  it('620 € frei, dann 6 %', () => { expect(festeSaetze(620)).toBe(0); expect(festeSaetze(1620)).toBe(60); });
  it('27 % ab 25.000 €, 35,75 % ab 50.000 €', () => {
    expect(festeSaetze(26000)).toBeCloseTo(24380 * 0.06 + 1000 * 0.27, 2);
    expect(festeSaetze(1000, 50000)).toBeCloseTo(357.5, 2);
  });
  it('Freigrenze: Sechstel 2.614 € steuerfrei, 2.616 € nicht', () => {
    expect(rechneJahr(standardJahr(1307)).monate[5].lstSzFest).toBe(0);
    expect(rechneJahr(standardJahr(1308)).monate[10].lstSzFest).toBeGreaterThan(0);
  });
});

describe('Jahressechstel und Kontrollrechnung', () => {
  it('Gehaltserhöhung im Juli: Überhang im November, Gutschrift im Dezember (§ 77 Abs. 4a Z 2)', () => {
    const m = Array.from({ length: 12 }, (_, i) => ({ laufend: i < 6 ? 3000 : 3300, sz: i === 5 ? 3000 : i === 10 ? 3300 : 0 }));
    const j = rechneJahr(m);
    expect(j.monate[10].sechstel).toBeCloseTo((6 * 3000 + 5 * 3300) / 11 * 2, 2);
    expect(j.monate[10].szUeberSechstel).toBeCloseTo(3300 - ((6 * 3000 + 5 * 3300) / 11 * 2 - 3000), 2);
    expect(j.monate[10].lstSzTarif).toBeGreaterThan(0);
    expect(j.kontrolle.art).toBe('gutschrift');
    expect(j.kontrolle.ueberhang).toBeCloseTo(j.monate[10].szUeberSechstel, 2);
    expect(j.kontrolle.mehrsteuer).toBeLessThan(0);
    expect(j.kontrolle.mehrsteuer).toBeCloseTo(-(j.monate[10].lstSzTarif - j.monate[10].szUeberSechstel * (1 - 0.1707) * 0.06), 0);
  });
  it('Teilzeit ab Juli, Weihnachtsremuneration nach altem Gehalt: Nachversteuerung (§ 77 Abs. 4a Z 1)', () => {
    const m = Array.from({ length: 12 }, (_, i) => ({ laufend: i < 6 ? 4000 : 2000, sz: i === 5 ? 4000 : i === 10 ? 4000 : 0 }));
    const j = rechneJahr(m);
    expect(j.monate[10].szImSechstel).toBeCloseTo((6 * 4000 + 5 * 2000) / 11 * 2 - 4000, 2);
    expect(j.kontrolle.art).toBe('nachversteuerung');
    expect(j.kontrolle.ueberhang).toBeCloseTo((6 * 4000 + 5 * 2000) / 11 * 2 - 6000, 2);
    expect(j.kontrolle.mehrsteuer).toBeGreaterThan(0);
  });
  it('Austritt Ende Juni: keine Nachversteuerung (Ausnahme lit. j)', () => {
    const m = Array.from({ length: 12 }, (_, i) => ({ laufend: i < 6 ? 3000 : 0, sz: i === 5 ? 3000 + 1500 : 0 }));
    expect(rechneJahr(m, {}, true, true).kontrolle.mehrsteuer).toBe(0);
    expect(rechneJahr(m, {}, true, false).kontrolle.art).toBe('nachversteuerung');
  });
  it('Eintritt im Juli: Sechstel aus dem Monatsschnitt', () => {
    const m = Array.from({ length: 12 }, (_, i) => ({ laufend: i >= 6 ? 3000 : 0, sz: i === 10 ? 3000 : 0 }));
    const j = rechneJahr(m);
    expect(j.monate[10].sechstel).toBeCloseTo(6000, 2);
    expect(j.monate[10].szUeberSechstel).toBe(0);
  });
});

describe('Überstunden 2026 gegen den BMF-Rechner (steuerfreie Bezüge)', () => {
  it('3.000 €, 40 h, 10 Überstunden', () => {
    const u = ueberstunden(3000, 40, 10);
    expect(u.steuerfreierZuschlag).toBeCloseTo(86.61, 1);
    const b = 3000 + u.bruttoMehr; const sv = svLaufend(b).summe;
    expect(sv).toBeCloseTo(589.05, 1);
    expect(Math.abs(lohnsteuerLaufend(b - sv - u.steuerfreierZuschlag).lst - 321.7)).toBeLessThan(0.05);
  });
  it('Deckel 170 €', () => { expect(ueberstunden(6000, 38.5, 20).steuerfreierZuschlag).toBe(170); });
  it('BMF: 4.500 € brutto, 170 € steuerfrei → LSt 648,27', () => { const sv = svLaufend(4500).summe; expect(lohnsteuerLaufend(4500 - sv - 170).lst).toBeCloseTo(648.27, 2); });
});

describe('Netto → Brutto', () => {
  it('Umkehrung trifft auf den Cent', () => {
    for (const n of [1200, 2000, 2800, 4000]) { const b = bruttoAusNetto(n); const sv = svLaufend(b).summe; expect(b - sv - lohnsteuerLaufend(b - sv).lst).toBeCloseTo(n, 1); }
  });
});

describe('Dienstgeberkosten gegen den BMF-Rechner', () => {
  it('3.000 € Tirol: SV 629,40, DB 111, DZ 11,70, KommSt 90, MV 45,90', () => {
    const d = dienstgeberkosten(3000, 'tirol');
    expect(d.sv).toBeCloseTo(629.4, 2); expect(d.db).toBe(111); expect(d.dz).toBeCloseTo(11.7, 2); expect(d.kommst).toBe(90); expect(d.mv).toBeCloseTo(45.9, 2);
    expect(d.svSz).toBeCloseTo(614.4, 2);
  });
  it('Wien: SV 636,90', () => { expect(dienstgeberkosten(3000, 'wien').sv).toBeCloseTo(636.9, 2); });
});

describe('Abfertigung', () => {
  it('alt: Staffel § 23 AngG', () => { expect(abfertigungAlt(3000, 2.9).monate).toBe(0); expect(abfertigungAlt(3000, 3).monate).toBe(2); expect(abfertigungAlt(3000, 25).monate).toBe(12); expect(abfertigungAlt(3000, 10).brutto).toBe(14000); });
  it('neu: 1,53 % von 14 Bezügen', () => { expect(abfertigungNeu(3000, 1).beitraegeJahr).toBeCloseTo(642.6, 2); expect(abfertigungNeu(3000, 2).anspruch).toBe(false); });
});

describe('Kinderbetreuungsgeld 2026', () => {
  it('Konto: 41,14 € bei 365 Tagen, 17,65 € bei 851 Tagen', () => { expect(kbgKonto(365).tagsatz).toBe(41.14); expect(kbgKonto(851).tagsatz).toBe(17.65); expect(kbgKonto(1063, true).tagsatz).toBe(17.65); });
  it('einkommensabhängig: Deckel 80,12 €, Mindestens 41,14 €', () => { expect(kbgEinkommensabhaengig(5000).tagsatz).toBe(80.12); expect(kbgEinkommensabhaengig(900).tagsatz).toBe(41.14); });
});
