// Qayta ishlatiladigan zod bo'laklari — RHF + zodResolver formalar uchun.
// Xabarlar i18n'dan kelgani uchun har bir helper `t` ni qabul qiladi va
// komponent ichida chaqiriladi (sxema render paytida quriladi).
import type { TFunction } from "i18next"
import { z } from "zod"

/** Majburiy matn (trim + min uzunlik). */
export const requiredString = (t: TFunction, min = 1) =>
    z.string().trim().min(min, t("requiredField"))

/** Nom — kamida 2 belgi. */
export const nameField = (t: TFunction) =>
    z.string().trim().min(2, t("validation.nameMin2"))

/** Ixtiyoriy matn — "" ham, undefined ham bo'lishi mumkin. */
export const optionalString = () => z.string().trim().optional()

/** INN — bo'sh yoki roppa-rosa 9 raqam. */
export const innField = (t: TFunction) =>
    z
        .union([
            z.literal(""),
            z.string().regex(/^\d{9}$/, t("validation.invalidInn")),
        ])
        .optional()

/** Email format. */
export const emailField = (t: TFunction) =>
    z.string().trim().email(t("validation.invalidEmail"))

/** Parol — kamida 8 belgi. */
export const passwordField = (t: TFunction) =>
    z.string().min(8, t("validation.passwordMin8"))

/** URL format; default ixtiyoriy. */
export const urlField = (t: TFunction, { optional = true } = {}) => {
    const base = z.string().trim().url(t("validation.invalidUrl"))
    return optional ? z.union([z.literal(""), base]).optional() : base
}

/** Musbat summa (NumberField raqam saqlaydi). */
export const amountField = (t: TFunction) =>
    z
        .number({ message: t("validation.amountRequired") })
        .positive(t("validation.amountPositive"))

/** Majburiy raqamli select (id). undefined → xato. */
export const requiredNumberId = (t: TFunction) =>
    z.number({ message: t("validation.selectRequired") })

/** Majburiy matnli select (id). */
export const requiredStringId = (t: TFunction) =>
    z.string().min(1, t("validation.selectRequired"))
