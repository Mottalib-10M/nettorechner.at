/** Steuerprofil-Felder (Kinder, Familienbonus, AVAB/AEAB, Pendler, Bundesland), gemeinsam für mehrere Rechner. */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import type { Steuerprofil, PendlerArt, Fahrten } from '../../lib/engine/lohn';
import { BUNDESLAENDER, type Bundesland } from '../../lib/engine/params';
import { tx, type L } from './kit';

export interface ProfilState { land: Bundesland; k1: number; k2: number; geteilt: string; avab: string; pendler: PendlerArt; km: number; fahrten: Fahrten }
export const PROFIL0: ProfilState = { land: 'wien', k1: 0, k2: 0, geteilt: '0', avab: '0', pendler: 'keine', km: 0, fahrten: 'voll' };
export const LAND_NAME: Record<Bundesland, string> = { burgenland: 'Burgenland', kaernten: 'Kärnten', niederoesterreich: 'Niederösterreich', oberoesterreich: 'Oberösterreich', salzburg: 'Salzburg', steiermark: 'Steiermark', tirol: 'Tirol', vorarlberg: 'Vorarlberg', wien: 'Wien' };

export function zuProfil(s: ProfilState): Steuerprofil {
  return { wien: s.land === 'wien', kinderU18: s.k1, kinderUe18: s.k2, fbGeteilt: s.geteilt === '1', avab: s.avab === '1', avabKinder: s.k1 + s.k2, pendler: s.pendler, km: s.km, fahrten: s.fahrten };
}
export function profilAusUrl(u: URLSearchParams, d: ProfilState = PROFIL0): ProfilState {
  const n = (k: string, def: number) => { const v = u.get(k); const x = v === null ? NaN : parseFloat(v); return isNaN(x) ? def : x; };
  const land = (u.get('l') ?? d.land) as Bundesland;
  const p = (u.get('p') ?? d.pendler) as PendlerArt;
  const f = (u.get('f') ?? d.fahrten) as Fahrten;
  return { land: BUNDESLAENDER.includes(land) ? land : d.land, k1: n('k1', d.k1), k2: n('k2', d.k2), geteilt: u.get('g') === '1' ? '1' : '0', avab: u.get('a') === '1' ? '1' : '0', pendler: ['keine', 'klein', 'gross'].includes(p) ? p : 'keine', km: n('km', d.km), fahrten: ['voll', 'zweiDrittel', 'einDrittel'].includes(f) ? f : 'voll' };
}
export const profilZuUrl = (s: ProfilState) => ({ l: s.land, k1: s.k1 || undefined, k2: s.k2 || undefined, g: s.geteilt === '1' ? 1 : undefined, a: s.avab === '1' ? 1 : undefined, p: s.pendler !== 'keine' ? s.pendler : undefined, km: s.pendler !== 'keine' ? s.km : undefined, f: s.fahrten !== 'voll' ? s.fahrten : undefined });

export function LandFeld({ lang, id, s, set }: { lang: L; id: string; s: ProfilState; set: (p: Partial<ProfilState>) => void }) {
  return <SelectField id={`${id}-l`} label={tx(lang, 'Bundesland des Arbeitsorts', 'Federal state of workplace')} value={s.land} onChange={(x) => set({ land: x as Bundesland })} options={BUNDESLAENDER.map((b) => ({ value: b, label: LAND_NAME[b] }))} />;
}

export function FamilieFelder({ lang, id, s, set }: { lang: L; id: string; s: ProfilState; set: (p: Partial<ProfilState>) => void }) {
  const jn = [{ value: '0', label: tx(lang, 'Nein', 'No') }, { value: '1', label: tx(lang, 'Ja', 'Yes') }];
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <NumberField id={`${id}-k1`} label={tx(lang, 'Kinder unter 18 (Familienbonus)', 'Children under 18 (Familienbonus)')} value={s.k1} onChange={(x) => set({ k1: Math.round(x) })} max={15} lang={lang} />
        <NumberField id={`${id}-k2`} label={tx(lang, 'Kinder ab 18 mit Familienbeihilfe', 'Children 18+ with family allowance')} value={s.k2} onChange={(x) => set({ k2: Math.round(x) })} max={15} lang={lang} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <SelectField id={`${id}-g`} label={tx(lang, 'Familienbonus geteilt (je 50 %)', 'Familienbonus split (50% each)')} value={s.geteilt} onChange={(x) => set({ geteilt: x })} options={jn} />
        <SelectField id={`${id}-a`} label={tx(lang, 'Alleinverdiener / Alleinerzieher', 'Sole earner / single parent')} value={s.avab} onChange={(x) => set({ avab: x })} options={jn} />
      </div>
    </>
  );
}

export function PendlerFelder({ lang, id, s, set }: { lang: L; id: string; s: ProfilState; set: (p: Partial<ProfilState>) => void }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <SelectField id={`${id}-p`} label={tx(lang, 'Pendlerpauschale', 'Commuter allowance')} value={s.pendler} onChange={(x) => set({ pendler: x as PendlerArt, km: x !== 'keine' && s.km === 0 ? 25 : s.km })}
          options={[{ value: 'keine', label: tx(lang, 'Keine', 'None') }, { value: 'klein', label: tx(lang, 'Klein (Öffis zumutbar)', 'Small (public transport reasonable)') }, { value: 'gross', label: tx(lang, 'Groß (Öffis unzumutbar)', 'Large (public transport unreasonable)') }]} />
        <NumberField id={`${id}-km`} label={tx(lang, 'Einfache Strecke laut Pendlerrechner', 'One-way distance per Pendlerrechner')} value={s.km} onChange={(x) => set({ km: x })} unit="km" max={500} lang={lang} />
      </div>
      {s.pendler !== 'keine' && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <SelectField id={`${id}-f`} label={tx(lang, 'Fahrten pro Monat', 'Commutes per month')} value={s.fahrten} onChange={(x) => set({ fahrten: x as Fahrten })}
            options={[{ value: 'voll', label: tx(lang, '11 oder mehr (voll)', '11 or more (full)') }, { value: 'zweiDrittel', label: tx(lang, '8 bis 10 (zwei Drittel)', '8 to 10 (two thirds)') }, { value: 'einDrittel', label: tx(lang, '4 bis 7 (ein Drittel)', '4 to 7 (one third)') }]} />
        </div>
      )}
    </>
  );
}
