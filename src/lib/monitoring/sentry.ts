import * as Sentry from "@sentry/react"

// DSN faqat `.env` da bo'lsa Sentry yoqiladi. Dev/local'da odatda bo'sh —
// u holda init ham, capture ham no-op (ortiqcha shovqin/yuk yo'q).
const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined

export function initSentry() {
    if (!dsn) return
    Sentry.init({
        dsn,
        environment: import.meta.env.MODE,
        // Faqat xato reporting — tracing/replay ataylab yoqilmagan (bundle yengil).
        integrations: [],
    })
}

export function captureError(
    error: unknown,
    context?: Record<string, unknown>,
) {
    if (!dsn) return
    Sentry.captureException(error, context ? { extra: context } : undefined)
}
