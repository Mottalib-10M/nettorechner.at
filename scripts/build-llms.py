#!/usr/bin/env python3
"""Erzeugt public/llms.txt aus dem Build (RECETTE §21). Aufruf: npm run build && python3 scripts/build-llms.py && npm run build"""
import glob, html, json, os, re
SITE = re.search(r'SITE_URL = "([^"]+)"', open('src/data/site-config.ts').read()).group(1)
N = len(json.load(open('tests/fixtures/bmf-2026.json'))['faelle'])
rows = {'de': [], 'en': []}
for f in sorted(glob.glob('dist/*/**/index.html', recursive=True)):
    d = open(f, encoding='utf-8').read()
    if 'noindex' in d[:3000] or '/embed/' in f: continue
    path = '/' + os.path.relpath(os.path.dirname(f), 'dist').replace(os.sep, '/') + '/'
    lang = path.split('/')[1]
    if lang not in rows: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', d, re.S).group(1))
    m = re.search(r'name="description" content="(.*?)"', d, re.S)
    rows[lang].append((path, t, html.unescape(m.group(1)) if m else ''))
out = ['# Brutto-Netto Österreich', '', '> Brutto-Netto-Rechner für Österreich 2026 mit Lohnsteuer, Sozialversicherung, 13. und 14. Gehalt Monat für Monat (Jahressechstel, Kontrollrechnung), Pendlerpauschale und Pendlereuro, Familienbonus Plus, Arbeitslosengeld, Kinderbetreuungsgeld und Abfertigung. Herausgeber: Radif Partners, unabhängig von Behörden und Arbeitgebern. Alle Rechtswerte 2026 stehen datiert in einer geprüften Parameterdatei; der Lohnrechner stimmt in ' + str(N) + ' Fällen auf den Cent mit dem amtlichen BMF-Rechner überein.', '',
       'Alle Berechnungen laufen im Browser. Ergebnisse sind Schätzungen nach den amtlichen Werten und ersetzen weder Lohnzettel noch Bescheid.', '']
for lang, titel in (('de', '## Seiten auf Deutsch'), ('en', '## Pages in English')):
    out.append(titel); out.append('')
    for p, t, d in rows[lang]: out.append(f'- [{t}]({SITE}{p}): {d}')
    out.append('')
open('public/llms.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('llms.txt:', sum(len(v) for v in rows.values()), 'Seiten')
