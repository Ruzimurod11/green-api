// Validates that every locale in src/lib/i18n/locales has the same set of keys
// as the canonical `en` locale. Catches missing/extra translation keys that
// the flat `resources.ts` types do not cover for nested keys.
//
// Run: pnpm lint:i18n   (exits non-zero on any mismatch)
import { readFileSync, readdirSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const dir = join(
    dirname(fileURLToPath(import.meta.url)),
    "../src/lib/i18n/locales",
)
const CANONICAL = "en"

const flatten = (obj, prefix = "") =>
    Object.entries(obj).flatMap(([k, v]) => {
        const key = prefix ? `${prefix}.${k}` : k
        return v && typeof v === "object" ? flatten(v, key) : [key]
    })

const load = (locale) =>
    JSON.parse(readFileSync(join(dir, `${locale}.json`), "utf8"))

const locales = readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))

const canonicalKeys = new Set(flatten(load(CANONICAL)))
let failed = false

for (const locale of locales) {
    if (locale === CANONICAL) continue
    const keys = new Set(flatten(load(locale)))
    const missing = [...canonicalKeys].filter((k) => !keys.has(k))
    const extra = [...keys].filter((k) => !canonicalKeys.has(k))
    if (missing.length || extra.length) {
        failed = true
        console.error(`\n✖ ${locale}.json out of sync with ${CANONICAL}.json`)
        if (missing.length)
            console.error(`  missing (${missing.length}):\n    ${missing.join("\n    ")}`)
        if (extra.length)
            console.error(`  extra (${extra.length}):\n    ${extra.join("\n    ")}`)
    } else {
        console.log(`✓ ${locale}.json — ${keys.size} keys in sync`)
    }
}

if (failed) {
    console.error("\ni18n key mismatch — add the missing keys to each locale.")
    process.exit(1)
}
console.log("\nAll locales in sync.")
