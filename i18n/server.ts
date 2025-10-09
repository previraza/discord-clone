import { createI18nServer } from 'next-international/server'
import { dictionaries } from './locales/_index'

export const { getI18n, getScopedI18n, getStaticParams } =
  createI18nServer(dictionaries)
