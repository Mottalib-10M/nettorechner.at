# Eine Seite hinzufügen (Brutto-Netto Österreich)

Anleitung für Agenten, die die Seite erweitern. Vor der ersten Zeile ganz lesen, zusammen mit
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §4.1, §6, §7, §9.3, §11, §17.4, §21, §26).

## Prinzip

Eine Seite = **eine Datei**:

- Ratgeber und Betragsseiten: `src/content/guides/<id>.ts`
- Rechnerseiten (voller Rechner oben): `src/content/rechner/<id>.ts`

Die Datei trägt beide Sprachen (`de` für Österreich, `en` für Menschen, die in Österreich arbeiten), FAQ,
Quellen, Mini-Rechner und Verlinkung. Der Kern liest sie selbst: Routen (`src/i18n/routes.ts`), Menüs und
Fußzeile (`src/i18n/nav.ts`), Sitemap, hreflang, Schemas `Article`, `WebPage`, `FAQPage`, `BreadcrumbList`,
Karten „Passende Rechner“. **Für eine neue Seite keine Datei des Kerns ändern.**

Vorlagen, Struktur kopieren, **nie Sätze**:

| Typ | Vorlage |
|---|---|
| Rechnerseite | `src/content/rechner/pendlerpauschale.ts` |
| Ratgeber | `src/content/guides/jahressechstel.ts` |
| Betragsseite | `src/content/guides/netto-3000.ts` |

## Die goldene Regel: keine Zahl von Hand

- **Rechtswerte** (Sätze, Grenzen, Beträge) kommen aus `src/data/params-2026.json`: im Körper über `h.P`,
  im zitierbaren Absatz, in Titeln und FAQ über `P` aus `src/lib/fmt.ts`.
- **Ergebnisse** (Netto, Lohnsteuer, Tagsatz …) kommen aus dem Motor (`src/lib/engine/`): `kurz()`,
  `rechneJahr()`, `arbeitslosengeld()`, `kbgKonto()` … am Kopf der Datei berechnen, dann einsetzen.
- **Formatieren** nur mit `DE.eur / DE.pct / DE.num` bzw. `EN.…` (`src/lib/fmt.ts`) oder `h.eur / h.pct / h.num`
  im Körper. Nie `toFixed`, nie „3.000“ von Hand.
- Ein neuer Rechtswert gehört zuerst in `params-2026.json` (mit Quelle in `sources`), dann in den Text.
  **Eine Zahl, die Sie nicht an einer amtlichen Quelle gelesen haben, wird nicht veröffentlicht.**

## Die Felder

| Feld | Regel |
|---|---|
| `id` | = Dateiname. Für Links: `h.a('<id>', 'Text')`. |
| `group` | `rechner`, `lohn`, `absetz`, `betrag`, `leistungen` (Menüspalte). |
| `order` | Platz in der Gruppe, in Zehnerschritten. |
| `tool` | Nur Rechnerseiten: `brutto`, `netto`, `sonderzahlung`, `pendler`, `familienbonus`, `ueberstunden`, `alg`, `kbg`, `abfertigung`, `dienstgeber`. `toolPreset` setzt Startwerte (z. B. `{ land: 'wien' }`). |
| `mini` | Ratgeber/Betrag: Name einer Datei aus `src/lib/minis/` (Liste unten). `miniDefaults` setzt Startwerte (Betragsseite: `{ b: 3000 }`). `<!--mini:kind-->` im Körper setzt einen weiteren ein. |
| `miniHref` | Ziel des Mini-Buttons (Standard: Startseite). |
| `related` | 3 bis 6 bestehende IDs. |
| `sources` | mindestens 2 Schlüssel aus `params-2026.json > sources`. |

### Text je Sprache

| Feld | Regel |
|---|---|
| `slug` | Kleinbuchstaben und Bindestriche, ohne Jahr. Nur Betragsseiten tragen eine Zahl. |
| `nav`, `card` | Menüname, ein Satz für Karten. |
| `title` | **50 bis 60 Zeichen**, mit 2026, Suchbegriff zuerst (nie Land, „Rechner“, Frage oder Rubrik am Anfang), kein Gedankenstrich. |
| `description` | **150 bis 160 Zeichen**, mit 2026 und einer Zahl. Mit dem Test nachzählen. |
| `h1` | ohne Jahr. |
| `intro` | ein Satz. |
| `resume` | **EIN** Absatz, mindestens 120 Wörter, zitierbar für sich, mit Zahlen und Regel (§21). Erster Satz = die Antwort. |
| `faqs` | 4 bis 8 echte Fragen (Betragsseiten und Rechnerseiten: 3 bis 8), Antworten **40 bis 90 Wörter** mit Zahl, Bedingung, Quelle. Eine Frage existiert nur einmal auf der ganzen Seite, beide Sprachen zusammen. |
| `body` | `(h) => \`…\``: `h2`, `h3`, `p`, `ul`, `ol`, `h.table(...)`, `h.src('<quelle>', 'Text')`. Ratgeber: insgesamt mindestens 1.100 Wörter mit `resume` und FAQ, Rechnerseiten 450, Betragsseiten 650. |

## Ton

- **Deutsch**: österreichisch (Jänner, Lohnzettel, Weihnachtsremuneration, Arbeitnehmerveranlagung, „bekommen“), menschlich, die Zahl zuerst.
- **Englisch**: für Expats in Österreich, nicht übersetzt; österreichische Begriffe beim ersten Auftreten erklärt (Lohnzettel = payslip, Sonderzahlung = special payment …). Beträge in Euro.
- Verboten: Gedankenstrich „—“, „es ist wichtig zu beachten“, „tauchen wir ein“, „egal ob … oder …“, Aufzählungen von „zudem / außerdem / darüber hinaus“, Dreier-Rhythmen am laufenden Band, Schlussabsätze, die zusammenfassen, Emojis.
- **Einzigartigkeit** (§6): `check-unique` vergleicht alle Seiten (Zahlen neutralisiert, Schwelle 30 %). Schreiben Sie, was nur zu diesem Thema gehört: eigener Fall, eigene Regel, eigener Wortschatz. Keine Formulierung einer anderen Seite übernehmen, auch nicht von einer Sprache in die andere.
- **Kein deutsches Recht**: keine Steuerklassen, kein Solidaritätszuschlag, keine Kirchensteuer im Lohnzettel, kein Bürgergeld. Österreich: Lohnsteuer nach EStG 1988, Sozialversicherung nach ASVG, ÖGK, AMS.

## Mini-Rechner (`src/lib/minis/`)

`nettoMonat, lohnsteuer, svBeitrag, sechstel, urlaubsgeld, pendlereuro, familienbonus, familienbonusAntrag, kindermehrbetrag, avab, vab, unterhalt, teilzeit, geringfuegig, wienVergleich, hbg, gehaltserhoehung, stundenlohn, jahresgehalt, ueberstunden, lohnzettel, steuerklasse, veranlagung, alg, algDauer, notstandshilfe, zuverdienst, kbgKonto, kbgEa, kbgZuverdienst, wochengeld, abfertigungNeu, abfertigungAlt, dienstgeber`.

Ein neuer Mini: `src/lib/minis/<kind>.ts`, ein bis zwei Felder, die Zahl des Themas groß, zwei bis vier Zeilen,
**ruft den Motor auf**, Texte in beiden Sprachen über `T(l, 'de', 'en')`.

## Kontrollen

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/at-brutto-netto
export NODE_PATH=$(npm root -g):$PWD/node_modules
PAGE_FILES=<id> npx vitest run tests/pages.test.ts   # eine Seite
npx vitest run                                        # alle Tests, inkl. 408 BMF-Fälle
npm run build                                         # inkl. typo-nbsp und check-snippets (blockierend)
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py . ; python3 scripts/check-hreflang.py . ; python3 scripts/check-anglais.py .
python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py .
node scripts/check-sources.mjs . ; node scripts/check-legal.mjs . ; node scripts/typo-nbsp.mjs dist --check
node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60 ; node scripts/check-nombres.mjs dist
node scripts/check-layout.mjs dist > /tmp/layout-at.log 2>&1 &   # lang: im Hintergrund
```

Die Skripte in `scripts/` sind Kopien von `~/Documents/GitHub/_trame/_template/scripts/`; ist die Trame neuer, zuerst kopieren.
Server nur über den Port stoppen (`lsof -ti tcp:<port> | xargs kill`), nie `pkill -f` mit kurzem Muster.

## Die Motor-Prüfungen (nicht abschwächen)

- `src/lib/engine/bmf.test.ts`: 408 Fälle des amtlichen BMF-Rechners (`tests/fixtures/bmf-2026.json`, abgerufen am 2026-10-05 über dessen JSON-Schnittstelle). Neuer Jahrgang: Abruf mit dem Skript im Bericht wiederholen, Werte ersetzen, Tests grün machen.
- `src/lib/engine/alg.test.ts`: 102 Zeilen der AK-Tabelle zum Arbeitslosengeld.
- `src/lib/engine/lohn.test.ts`: Grenzwerte, Jahressechstel, Kontrollrechnung (§ 77 Abs. 4a, beide Richtungen und Ausnahmen).

## Was man nicht tut

- Kein GitHub-Repository, kein Push, kein DNS ohne Freigabe des Herausgebers.
- `_trame` und RECETTE nicht ändern: Vorschläge in den Bericht.
- Keine Werbung aktivieren, keine Links zu anderen Seiten des Portfolios (`_trame/domaines-ovh.txt`).
- Keine Person nennen: Herausgeber ist Radif Partners.
- Für 2027 sind die Tarifgrenzen schon kundgemacht (BGBl. II Nr. 260/2026, Anmerkungen zu § 33 im RIS): Jahreswechsel = neue `params-2027.json`, nicht 2026 überschreiben.
