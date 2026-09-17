import { QueryClient } from "@tanstack/react-query"
import axios from "axios"
import Cookies from "js-cookie"
import { BASE_URL } from "../constants/base-url"
import { COOKIES } from "../constants/cookies"
import { captureError } from "../monitoring/sentry"
import { CookieService } from "../utils/cookie-service"

const lang = Cookies.get(COOKIES.LANGUAGE)

const REQUEST_TIMEOUT_MS = 30_000

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
        "Content-Type": "application/json",
        "Accept-Language": lang || "ru",
    },
    formSerializer: {
        indexes: null,
    },
    paramsSerializer: {
        indexes: null,
    },
})

// Tashqi va GREEN-API URL so'rovlarini aniqlash
const isExternalOrGreenApi = (url: string) => {
    return (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.includes("green-api.com")
    )
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
    const refresh = CookieService.getRefreshToken()
    if (!refresh) return null

    // Agar loyihangizda REFRESH_TOKEN endpoint constants bo'lmasa, uni to'g'ridan-to'g'ri string qilib yozishingiz mumkin:
    const res = await axios.post(
        `${BASE_URL.replace(/\/$/, "")}/auth/refresh/`,
        { refresh },
    )

    const accessToken: string | undefined = res?.data?.access
    const refreshToken: string | undefined = res?.data?.refresh
    if (refreshToken) CookieService.setRefreshToken(refreshToken)
    if (accessToken) {
        CookieService.setAccessToken(accessToken)
        return accessToken
    }
    return null
}

export function setupAxiosInterceptors(_queryClient: QueryClient) {
    // Request interceptor
    axiosInstance.interceptors.request.use(
        function (config) {
            const reqUrl = config.url || ""

            // GREEN-API yoki tashqi so'rov bo'lsa, keraksiz header'larni qo'shmaymiz
            if (isExternalOrGreenApi(reqUrl)) {
                return config
            }

            const token = CookieService.getAccessToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            config.headers["X-Device-Id"] = CookieService.getOrCreateDeviceId()

            if (
                typeof FormData !== "undefined" &&
                config.data instanceof FormData
            ) {
                config.timeout = 0
                config.headers.delete("Content-Type")
            }
            return config
        },
        function (error) {
            return Promise.reject(error)
        },
    )

    // Response interceptor
    axiosInstance.interceptors.response.use(
        function (response) {
            return response
        },
        async function (error) {
            const originalRequest = error.config
            const status = error.response?.status
            const reqUrl: string = originalRequest?.url || ""

            // GREEN-API so'rovlarida token refresh funksiyasi ishlamaydi
            if (isExternalOrGreenApi(reqUrl)) {
                return Promise.reject(error)
            }

            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true
                try {
                    refreshPromise ??= refreshAccessToken()
                    const accessToken = await refreshPromise
                    if (accessToken) {
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`
                        return axiosInstance(originalRequest)
                    }
                } catch (refreshError) {
                    CookieService.removeAccessToken()
                    CookieService.removeRefreshToken()
                    return Promise.reject(refreshError)
                } finally {
                    refreshPromise = null
                }
            }

            if (!status || status >= 500) {
                captureError(error, { url: reqUrl, status })
            }

            return Promise.reject(error)
        },
    )
}

export default axiosInstance
