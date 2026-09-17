import en from "../lib/i18n/locales/en.json"

const resources = {
    en: { translation: en },
} as const

// Only the flat, string-valued keys are usable as standalone translation keys;
// nested groups (e.g. `landing`) are addressed via dotted paths through `t()`.
type StringValuedKeys<T> = {
    [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

export type TranslationKey = StringValuedKeys<typeof en>

export default resources
