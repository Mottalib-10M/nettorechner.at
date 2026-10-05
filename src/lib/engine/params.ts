/** Typed access to params-2026.json: every legal value of the site lives there, never in pages or code. */
import raw from '../../data/params-2026.json';

export type SourceKey = keyof typeof raw.sources;
export type Params = typeof raw;
export const P: Params = raw;
export type Bundesland = keyof typeof raw.dienstgeber.dz;
export const BUNDESLAENDER = Object.keys(raw.dienstgeber.dz) as Bundesland[];

/** Kaufmännische Rundung auf Cent (wie Lohnverrechnung und AMS: „kaufmännisch gerundet auf einen Cent“). */
export const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
