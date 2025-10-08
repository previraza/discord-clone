import languine from '@/languine.json';
import { LocaleSetting } from '../types';

export const defaultLocale = languine.locale.source;
export const locales = [...new Set([defaultLocale, ...languine.locale.targets])];

const defaultDictionary = () => import(`./en.locale`);
type Dictionary = typeof defaultDictionary;

// Dictionnaires dynamiques (pour l'import lazy)
export const dictionaries: Record<string, Dictionary> = Object.fromEntries(
  locales.map((locale) => [
    locale,
    () =>
      import(`./${locale as "en"}.locale`)
        .catch((err) => {
          console.error(
            `Failed to load dictionary for locale: ${locale}`,
            err
          );
          return defaultDictionary();
        }),
  ])
);

// --- Locale Settings ---
// Récupère le 'setting' exporté dans chaque fichier de langue
export const localeSettings: Record<string, Promise<LocaleSetting>> = Object.fromEntries(
  locales.map((locale) => [
    locale,
    import(`./${locale as "en"}.locale`).then((mod) => mod.setting)
      .catch((err) => {
        console.error(
          `Failed to load locale setting for locale: ${locale}`,
          err
        );
        return null;
      }),
  ]).filter(([, setting]) => setting !== null)
);

export const localeSettingsList = Promise.all(Object.values(localeSettings));