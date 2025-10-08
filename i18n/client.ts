"use client";

import { createI18nClient } from "next-international/client";
import { dictionaries } from "./locales/_index";

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, useCurrentLocale } = createI18nClient(dictionaries);
