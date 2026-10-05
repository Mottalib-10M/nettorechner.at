/** Gemeinsame Bausteine der Rechner: Lohnzettel-Zeilen, Ergebnis-Kopf, Aktionen (Kopieren, Link, Drucken). */
import { useState } from 'react';

export type L = 'de' | 'en';
export const tx = <A,>(l: L, de: A, en: A) => (l === 'en' ? en : de);

/** Zeilen im Stil eines österreichischen Lohnzettels: Bezeichnung links, Betrag rechts, Abzüge mit Minus. */
export function Lohnzettel({ rows, caption }: { rows: Array<{ label: string; value: string; strong?: boolean; muted?: boolean; sep?: boolean }>; caption?: string }) {
  return (
    <table className="lohnzettel mt-3 w-full text-sm">
      {caption && <caption className="mb-1 text-left text-xs font-semibold uppercase tracking-wide text-navy-600">{caption}</caption>}
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={`${r.sep ? 'border-t-2 border-navy-800' : 'border-t border-navy-200'} ${r.strong ? 'font-semibold text-navy-900' : r.muted ? 'text-navy-600' : 'text-navy-800'}`}>
            <th scope="row" className="py-1.5 pr-3 text-left font-normal">{r.label}</th>
            <td className="tabular-nums whitespace-nowrap py-1.5 pl-2 text-right">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Aktionen({ lang, text }: { lang: L; text: () => string }) {
  const [done, setDone] = useState('');
  const copy = (what: 'text' | 'link') => {
    const s = what === 'text' ? `${text()} · ${window.location.href}` : window.location.href;
    navigator.clipboard?.writeText(s).then(() => { setDone(what); setTimeout(() => setDone(''), 1500); });
  };
  const b = 'rounded-md border border-navy-300 bg-white px-3 py-1.5 text-sm font-medium text-navy-800 hover:bg-navy-50';
  return (
    <div className="no-print mt-4 flex flex-wrap gap-2">
      <button type="button" className={b} onClick={() => copy('text')}>{done === 'text' ? tx(lang, 'Kopiert', 'Copied') : tx(lang, 'Ergebnis kopieren', 'Copy result')}</button>
      <button type="button" className={b} onClick={() => copy('link')}>{done === 'link' ? tx(lang, 'Link kopiert', 'Link copied') : tx(lang, 'Link teilen', 'Share link')}</button>
      <button type="button" className={b} onClick={() => window.print()}>{tx(lang, 'Drucken', 'Print')}</button>
    </div>
  );
}

/** Ergebnis-Kopf: eine große Zahl, eine Zeile darunter. */
export function Kopf({ label, wert, unter }: { label: string; wert: string; unter?: string }) {
  return (
    <div>
      <p className="text-sm font-medium text-navy-700">{label}</p>
      <p className="tabular-nums mt-1 font-serif text-4xl font-bold text-navy-900">{wert}</p>
      {unter && <p className="tabular-nums mt-1 text-sm text-navy-700">{unter}</p>}
    </div>
  );
}

export const kasten = 'mt-6 rounded-xl border border-accent-200 bg-accent-50/50 p-4 sm:p-5 lg:mt-0 lg:sticky lg:top-20';
export const rahmen = 'rechner not-prose overflow-hidden rounded-xl border border-navy-200 bg-white';
