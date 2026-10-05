/**
 * Zahlenformat für Texte außerhalb von `body(h)`: zitierbarer Absatz, FAQ, Titel. Jede Rechtszahl kommt aus P,
 * jedes Beispielergebnis aus dem Motor; geschrieben wird sie nur über diese Formatierer (RECETTE §4.1, §17.4).
 */
import { formatMoney, formatNumber, formatPercent } from './format';
export { P } from './engine/params';
const mk = (l: 'de' | 'en') => ({
  /** Euro, ohne Cent (oder mit d Nachkommastellen). */
  eur: (n: number, d = 0) => formatMoney(n, d, l),
  /** Zahl ohne Währung. */
  num: (n: number, d = 0) => formatNumber(n, d, l),
  /** Prozent aus Anteil (0,3 → „30 %“). */
  pct: (x: number, d = 0) => formatPercent(x, d, l),
});
export const DE = mk('de');
export const EN = mk('en');
