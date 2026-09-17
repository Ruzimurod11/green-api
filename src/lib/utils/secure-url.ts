// Backend avatar/media URL'ni "http://" bilan qaytaradi; sahifa https'da
// bo'lsa brauzer mixed-content sifatida bloklaydi — shuning uchun https'ga
// ko'taramiz.
export const secureUrl = (url?: string | null) => {
    if (!url) return url
    if (
        typeof window !== "undefined" &&
        window.location.protocol === "https:"
    ) {
        return url.replace(/^http:\/\//i, "https://")
    }
    return url
}
