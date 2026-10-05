import type { Locale } from './routes';
const de = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionsgrundsätze', contactLabel: 'Kontakt', reviewedBy: 'Geprüft von',
  skipToContent: 'Zum Inhalt', mainNav: 'Hauptnavigation', breadcrumbLabel: 'Brotkrümelnavigation', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Häufige Fragen', relatedCalculators: 'Passende Rechner und Seiten', sourcesTitle: 'Quellen', writtenBy: 'Verfasst von',
  asOf: 'Werte', lastUpdated: 'geprüft am', footerValidated: 'Gegen den BMF-Rechner geprüft', footerBrowser: 'Rechnet nur in Ihrem Browser · keine Datenübertragung · kostenlos',
  footerDisclaimer: 'Unabhängige Seite von Radif Partners, ohne Verbindung zu BMF, ÖGK, AMS, Arbeiterkammer oder einem Arbeitgeber. Alle Ergebnisse sind Schätzungen nach den amtlichen Werten 2026 und ersetzen weder Lohnzettel noch Bescheid oder Beratung.', footerPopular: '', notFound: 'Diese Seite gibt es nicht.',
  readMore: 'Weiterlesen',
};
const en: typeof de = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related calculators and pages', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Figures', lastUpdated: 'checked on', footerValidated: 'Checked against the Finance Ministry calculator', footerBrowser: 'Runs only in your browser · no data sent · free',
  footerDisclaimer: 'Independent site by Radif Partners, not affiliated with the Finance Ministry, ÖGK, AMS, the Chamber of Labour or any employer. Each result is an estimate based on official 2026 values; it does not replace your payslip, an official decision or advice.', footerPopular: '', notFound: 'This page does not exist.',
  readMore: 'Read more',
};
export function t(lang: Locale) { return lang === 'en' ? en : de; }
