// Majburiy env tekshiruvi
const rawBaseUrl = import.meta.env.VITE_DEFAULT_URL
if (!rawBaseUrl) {
    throw new Error(
        "VITE_DEFAULT_URL aniqlanmagan. `.env` faylga API manzilini qo'shing " +
            "(masalan VITE_DEFAULT_URL=https://api.example.com/api/).",
    )
}

// Dev'da same-origin `/__api` proxy, Prod'da asl backend URL
export const BASE_URL: string = import.meta.env.DEV ? "/__api" : rawBaseUrl

// WebSocket manzillarini xavfsiz shakllantirish
const wsUrl = (path: string): string => {
    try {
        if (import.meta.env.DEV) {
            const protocol = location.protocol === "https:" ? "wss:" : "ws:"
            return `${protocol}//${location.host}${path}`
        }

        const url = new URL(rawBaseUrl)
        url.protocol = url.protocol === "https:" ? "wss:" : "ws:"
        // Path'ni mavjud path bilaningiz bo'yicha birlashtirish (masalan /api/ + ws/team/)
        const cleanBasePath = url.pathname.replace(/\/$/, "")
        const cleanPath = path.replace(/^\//, "")
        url.pathname = `${cleanBasePath}/${cleanPath}`
        url.search = ""

        return url.toString()
    } catch {
        return ""
    }
}

export const TEAM_WS_URL: string = wsUrl("/ws/team/")
export const SUPPORT_WS_URL: string = wsUrl("/ws/support/")
