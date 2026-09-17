import Cookies from "js-cookie"
import { COOKIES } from "../constants/cookies"

// Cookie configuration for better security
const cookieOptions: (typeof Cookies)["attributes"] = {
    secure: import.meta.env.MODE === "production", // Only transmitted over HTTPS
    sameSite: "strict", // Protect against CSRF
    path: "/", // Available across the site
}

export const CookieService = {
    // Access Token methods
    getAccessToken: (): string | undefined => {
        return Cookies.get(COOKIES.ACCESS_TOKEN)
    },

    setAccessToken: (token: string): void => {
        Cookies.set(COOKIES.ACCESS_TOKEN, token, {
            ...cookieOptions,
            expires: 7, // 1 hafta — sessiya kamida shuncha saqlanadi
        })
    },

    removeAccessToken: (): void => {
        Cookies.remove(COOKIES.ACCESS_TOKEN, { path: "/" })
    },

    // Refresh Token methods
    getRefreshToken: (): string | undefined => {
        return Cookies.get(COOKIES.REFRESH_TOKEN)
    },

    setRefreshToken: (token: string): void => {
        Cookies.set(COOKIES.REFRESH_TOKEN, token, {
            ...cookieOptions,
            expires: 30, // 30 days
        })
    },

    removeRefreshToken: (): void => {
        Cookies.remove(COOKIES.REFRESH_TOKEN, { path: "/" })
    },

    // Barqaror qurilma identifikatori — birinchi marta yaratiladi, keyin
    // saqlanadi. Backend shu bo'yicha sessiyalarni dedup qiladi (bir xil qurilma
    // qayta kirsa yangi yozuv yaratmaydi). Logout/clearAllTokens uni O'CHIRMAYDI.
    getOrCreateDeviceId: (): string => {
        let id = Cookies.get(COOKIES.DEVICE_ID)
        if (!id) {
            id = crypto.randomUUID()
            Cookies.set(COOKIES.DEVICE_ID, id, {
                ...cookieOptions,
                expires: 3650, // ~10 yil
            })
        }
        return id
    },

    // Utility methods
    clearAllTokens: (): void => {
        CookieService.removeAccessToken()
        CookieService.removeRefreshToken()
    },

    hasTokens: (): boolean => {
        return !!(
            CookieService.getAccessToken() && CookieService.getRefreshToken()
        )
    },
}
