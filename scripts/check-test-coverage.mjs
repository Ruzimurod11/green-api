// Surfaces changed *logic* source files that lack a colocated unit test, so the
// /tayyor gate can no longer go green on new untested logic just because the
// pre-existing suite passes. Heuristic, not a hard CI block — it classifies the
// working-tree diff (vs HEAD) into:
//   LOGIC — pure functions worth a cheap unit test (lib/hooks/schema/payload/data)
//   UI    — components where a test is recommended but not blocking
// and checks each against the repo's colocated `<name>.test.*` convention.
//
// Run: pnpm test:coverage-gate
// Exit: 0 = no untested logic · 2 = untested LOGIC files found (gate must act)
import { execSync } from "child_process"
import { existsSync, readdirSync } from "fs"
import { dirname, join } from "path"

const sh = (cmd) => execSync(cmd, { encoding: "utf8" }).trim()

// Everything /tayyor is about to commit: tracked changes since HEAD (index +
// working tree) PLUS brand-new untracked files. The untracked half matters most
// — a new feature is typically untracked at gate time (before `git add`), and a
// HEAD-only diff would miss exactly the files we most want a test for.
const tracked = sh("git diff --name-only --diff-filter=ACMR HEAD")
const untracked = sh("git ls-files --others --exclude-standard")
const changed = [...new Set([...tracked.split("\n"), ...untracked.split("\n")])]
    .filter(Boolean)
    .filter((f) => f.startsWith("src/"))

const isTest = (f) => /\.(test|spec)\.[tj]sx?$/.test(f)

// Files that never warrant their own unit test.
const IGNORE = (f) =>
    isTest(f) ||
    /\.(gen|d)\.ts$/.test(f) ||
    /\.(css|json)$/.test(f) ||
    f.startsWith("src/types/") ||
    /(^|\/)__root\.tsx$/.test(f) ||
    /(^|\/)route(Tree)?\.gen\.ts$/.test(f) ||
    /vite-env\.d\.ts$/.test(f) ||
    /(^|\/)main\.tsx$/.test(f)

// LOGIC: pure, cheaply unit-testable. Either a .ts under lib/hooks, or any file
// matching the project's logic-file naming (schema/payload/data/utils).
const isLogic = (f) =>
    (/\.ts$/.test(f) &&
        (f.startsWith("src/lib/") || f.startsWith("src/hooks/"))) ||
    /(\.schema|\.payload|-data|-?utils)\.tsx?$/.test(f)

// UI: components/route -components. Test recommended, not blocking.
const isUI = (f) =>
    /\.tsx$/.test(f) &&
    (f.startsWith("src/components/") || /\/-components\//.test(f))

// A file is "covered" if a sibling test file shares its basename (the repo's
// colocated convention: get-number.ts ↔ get-number.test.ts), or any test file
// anywhere references that basename (covers barrels / shared-module tests).
const allTests = sh("git ls-files 'src/**/*.test.*' 'src/**/*.spec.*'")
    .split("\n")
    .filter(Boolean)

const hasTest = (f) => {
    const dir = dirname(f)
    const base = f.slice(dir.length + 1).replace(/\.[tj]sx?$/, "")
    const sibling =
        existsSync(dir) ?
            readdirSync(dir).some(
                (n) => isTest(join(dir, n)) && n.startsWith(base + "."),
            )
        :   false
    if (sibling) return true
    return allTests.some((t) => t.includes("/" + base + "."))
}

const logicGaps = []
const uiGaps = []
for (const f of changed) {
    if (IGNORE(f)) continue
    if (isLogic(f)) {
        if (!hasTest(f)) logicGaps.push(f)
    } else if (isUI(f)) {
        if (!hasTest(f)) uiGaps.push(f)
    }
}

if (!logicGaps.length && !uiGaps.length) {
    console.log(
        "✓ Test qamrovi: o'zgargan logika fayllari testlar bilan qoplangan.",
    )
    process.exit(0)
}

if (logicGaps.length) {
    console.error(
        `\n🔴 Testsiz LOGIKA fayllari (${logicGaps.length}) — colocated test yozish kerak:`,
    )
    for (const f of logicGaps)
        console.error(`    ${f}  →  ${f.replace(/\.(tsx?)$/, ".test.$1")}`)
}
if (uiGaps.length) {
    console.error(
        `\n🟡 Testsiz UI fayllari (${uiGaps.length}) — test tavsiya etiladi (bloklamaydi):`,
    )
    for (const f of uiGaps) console.error(`    ${f}`)
}
console.error(
    "\nHar biri uchun: colocated test yoz, yoki nega test shart emasligini ayt. Yangi logikani jim commit qilma.",
)

process.exit(logicGaps.length ? 2 : 0)
