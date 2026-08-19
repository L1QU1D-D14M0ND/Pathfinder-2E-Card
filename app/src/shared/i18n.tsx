import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import en from '../locales/en.json'
import es from '../locales/es.json'

export type Locale = 'en' | 'es'

export type MessageTree = { [key: string]: string | MessageTree }

export type TranslateFn = (
  key: string,
  vars?: Record<string, string | number>,
) => string

export const LOCALES: readonly Locale[] = ['en', 'es']
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_STORAGE_KEY = 'ttrpg-sheet.locale'

export const CATALOGS: Record<Locale, MessageTree> = {
  en: en as MessageTree,
  es: es as MessageTree,
}

function lookup(tree: MessageTree, path: string): string | undefined {
  const parts = path.split('.')
  let node: string | MessageTree | undefined = tree
  for (const part of parts) {
    if (typeof node === 'string' || node == null) return undefined
    node = node[part]
  }
  return typeof node === 'string' ? node : undefined
}

function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name)
      ? String(vars[name])
      : `{${name}}`,
  )
}

/** Resolve `shell.newSheet` (etc.). Fallback: locale → English → key. Interpolation: `{name}`. */
export function translate(
  catalog: MessageTree,
  key: string,
  vars?: Record<string, string | number>,
  fallback: MessageTree = CATALOGS.en,
): string {
  const template = lookup(catalog, key) ?? lookup(fallback, key) ?? key
  return interpolate(template, vars)
}

export function isLocale(value: unknown): value is Locale {
  return value === 'en' || value === 'es'
}

export function readStoredLocale(): Locale {
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(raw)) return raw
  } catch {
    // Private mode / missing storage.
  }
  return DEFAULT_LOCALE
}

function writeStoredLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    // Ignore quota / private mode.
  }
}

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslateFn
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(
    () => initialLocale ?? readStoredLocale(),
  )
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    writeStoredLocale(next)
  }, [])
  const t = useCallback<TranslateFn>(
    (key, vars) => translate(CATALOGS[locale], key, vars),
    [locale],
  )
  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  )
  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used inside I18nProvider')
  }
  return ctx
}

export function useT(): TranslateFn {
  return useI18n().t
}
