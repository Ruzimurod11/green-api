import { postRequest } from "@/lib/api/default-requests"
import { API } from "@/lib/constants/api-endpoints"
import { CookieService } from "@/lib/utils/cookie-service"

/** Sessiyani tugatadi: backendga logout yuboradi (refresh tokenni bekor qiladi),
 *  tokenlar va localStorage'ni tozalab, /home'ga yo'naltiradi.
 *  Tasdiqsiz — kerak bo'lsa chaqiruvchi o'zi confirm qiladi. */
export function performLogout() {
    // Fire-and-forget: javobni kutmaymiz, xatoni yutamiz (toast chiqarmaymiz).
    void postRequest(API.USER.LOGOUT.INDEX, {
        refresh: CookieService.getRefreshToken(),
    }).catch(() => undefined)
    CookieService.clearAllTokens()
    localStorage.clear()
    location.replace("/home")
}
