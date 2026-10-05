import { P } from '../engine/params';
import { T, eur, type L } from './_kit';
export default (l: L) => ({
  title: T(l, 'Pendlereuro 2026 gegen 2025', 'Commuter euro 2026 versus 2025'),
  cta: T(l, 'Pendlerpauschale-Rechner', 'Commuter allowance calculator'),
  inputs: [{ id: 'k', label: T(l, 'Einfache Strecke', 'One-way distance'), def: 35, unit: 'km', max: 500 }],
  run: ({ k }: Record<string, number>) => { const real = k >= 2 ? P.absetzbetraege.pendlereuro_je_km * Math.ceil(k) : 0; const alt = k >= 2 ? P.absetzbetraege.pendlereuro_je_km_2025 * Math.ceil(k) : 0;
    return { head: [T(l, 'Pendlereuro 2026 pro Jahr', 'Commuter euro 2026 per year'), eur(real, l)], rows: [[T(l, 'Pendlereuro 2025', 'Commuter euro 2025'), eur(alt, l)], [T(l, 'Mehr Steuerersparnis 2026', 'Extra tax saving 2026'), eur(real - alt, l)], [T(l, 'pro Monat', 'per month'), eur((real - alt) / 12, l, 2)]] as [string, string][], note: T(l, 'Nur mit Anspruch auf Pendlerpauschale (klein ab 20 km, groß ab 2 km).', 'Only with a commuter allowance (small from 20 km, large from 2 km).') }; },
});
