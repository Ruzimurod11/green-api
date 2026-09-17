import i18n from "@/lib/i18n/request"
import { toast } from "sonner"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onError(err: any) {
    // Tarmoq/timeout xatolarida response bo'lmaydi; axios `code` orqali
    // ularni ajratamiz va xom texnik matn o'rniga tushunarli xabar beramiz.
    // Stabil `id` — bir vaqtda bir nechta query xato bersa (global queryCache
    // onError), bir xil toast ustma-ust chiqmasdan bittaga yig'iladi.
    const code = err?.code
    if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
        toast.error(i18n.t("requestTimeout"), {
            id: "req-timeout",
            duration: 5000,
        })
        return
    }
    if (code === "ERR_NETWORK") {
        toast.error(i18n.t("networkError"), {
            id: "net-error",
            duration: 5000,
        })
        return
    }

    const status = err?.response?.status
    const errorData = err?.response?.data

    // DRF odatda JSON obyekt qaytaradi ({detail: "..."} yoki {field: [...]}).
    // Lekin 404/500 da Django HTML sahifa (DEBUG) yoki oddiy matn qaytishi mumkin —
    // u holda errorData STRING bo'ladi. Uni xom ko'rsatib bo'lmaydi, aks holda
    // Object.entries har bir belgini alohida qator qilib ulkan toast hosil qiladi.
    if (!errorData || typeof errorData !== "object") {
        const fallback =
            status === 404 ? i18n.t("notFound")
            : status ? i18n.t("requestFailed", { status })
            : err?.message || i18n.t("unexpectedError")
        toast.error(fallback, { id: `http-${status ?? "err"}`, duration: 5000 })
        return
    }

    // DRF standart xato maydoni — qisqa va tushunarli.
    if (typeof errorData.detail === "string") {
        toast.error(errorData.detail, { id: errorData.detail, duration: 5000 })
        return
    }

    const entries = Object.entries(errorData)
    if (entries.length > 0) {
        const formattedMessage = entries
            .map(
                ([key, value]) =>
                    `${key}: ${Array.isArray(value) ? value.join(", ") : value}`,
            )
            .join("; ")
            .slice(0, 300)

        // Bir xil matnli xatolar ham bittaga yig'ilsin (matnning o'zi id).
        toast.error(formattedMessage, { id: formattedMessage, duration: 5000 })
    } else {
        const message = err?.message || i18n.t("unexpectedError")
        toast.error(message, { id: message, duration: 5000 })
    }
}
