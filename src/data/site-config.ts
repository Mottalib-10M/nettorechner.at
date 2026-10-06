/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://nettorechner.at";
export const SITE_NAMES: Record<string, string> = {"de": "Nettorechner", "en": "Nettorechner"};
export const LANG_TAGS: Record<string, string> = {"de": "de-AT", "en": "en-AT"};
export const OG_LOCALES: Record<string, string> = {"de": "de_AT", "en": "en_GB"};
/** Zahlenformat je Sprache: deutsch mit Punkt als Tausendertrennzeichen (1.308,39), englisch für Expats (1,308.39). */
export const LOCALE_BY_LANG: Record<string, string> = { de: 'de-DE', en: 'en-GB' };
export const LOCALE_TAG = 'de-DE';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-05';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"de": "Herausgeber von Lohn- und Sozialrechnern für Österreich", "en": "Publisher of Austrian payroll and benefit calculators"};
export const AUTHOR_DESC: Record<string, string> = {"de": "Radif Partners rechnet österreichische Gehälter nach EStG und ASVG nach: Lohnsteuer, Sozialversicherung, 13. und 14. Bezug mit Jahressechstel, Pendlerpauschale, Familienbonus Plus sowie Arbeitslosengeld und Kinderbetreuungsgeld. Jeder Wert ist im RIS, beim BMF, bei der ÖGK oder beim AMS nachgelesen und datiert; der Rechner ist gegen 408 Fälle des amtlichen BMF-Rechners geprüft.", "en": "Radif Partners recalculates Austrian pay under the Income Tax Act and the General Social Insurance Act: wage tax, social insurance, the 13th and 14th salary with the annual sixth rule, commuter allowance, Familienbonus Plus, plus unemployment and childcare benefits. Every figure is read and dated at RIS, the Finance Ministry, ÖGK or AMS, and the calculator is checked against 408 cases of the official BMF calculator."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"de": ["Lohnsteuer Österreich", "Sozialversicherungsbeiträge nach ASVG", "13. und 14. Bezug, Jahressechstel", "Pendlerpauschale und Pendlereuro", "Familienbonus Plus und Kindermehrbetrag", "Alleinverdiener- und Alleinerzieherabsetzbetrag", "Arbeitslosengeld und Notstandshilfe", "Kinderbetreuungsgeld", "Abfertigung neu und alt", "Überstundenzuschläge"], "en": ["Austrian wage tax", "Austrian social insurance contributions", "13th and 14th salary, annual sixth rule", "Commuter allowance (Pendlerpauschale)", "Familienbonus Plus child tax credit", "Sole earner and single parent credits", "Unemployment benefit and emergency assistance", "Childcare allowance", "Severance pay (Abfertigung)", "Overtime premiums"]};
export const CONTACT_EMAIL = "contact@nettorechner.at";
export const THEME_COLOR = '#C8102E';
export const LOGO_SYMBOL = '€';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime de consentement : 'opt-in' = rien avant l'accord (UE, Suisse) ;
 *  'notice' = mesure d'audience active avec information préalable et retrait (CA, AU). */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'opt-in';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif). Vide = aucun traceur ni bandeau. */
export const CLARITY_ID = 'ytm5h0kk2i';
export const INDEXNOW_KEY = '6550dc08928915401112f98b8e9e99ce';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : publication à titre personnel, pas de société
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "USt",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
