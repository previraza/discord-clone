import type { getI18n } from "./server";

export type I18nTranslator = Awaited<ReturnType<typeof getI18n>>

export type LocaleSetting = {
  code: string, // code court ISO (utile pour les routes, ex: /fr)
  name: string, // nom de la langue en anglais
  native: string, // nom dans la langue elle-même
  direction: "ltr" | "rtl", // direction de lecture
  locale: `${string}-${string}`, // code complet pour Intl
  flag: string, // emoji de la drapeau
  icon: `${string}.${"svg"|"png"}`, // chemin vers l'icone de la langue
  logo: `${string}.${"svg"|"png"|"webp"|"jpg"|"jpeg"}`, // optionnel : logo ou image promotionnelle
}