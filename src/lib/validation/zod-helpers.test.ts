import type { TFunction } from "i18next"
import { describe, expect, it } from "vitest"
import { amountField, emailField, innField } from "./zod-helpers"

// Helperlar `t` ni faqat xabar matni uchun ishlatadi — kalitni qaytaruvchi stub yetarli.
const t = ((key: string) => key) as unknown as TFunction

describe("innField", () => {
    const inn = innField(t)
    it("bo'sh qiymatni qabul qiladi (ixtiyoriy)", () => {
        expect(inn.safeParse("").success).toBe(true)
        expect(inn.safeParse(undefined).success).toBe(true)
    })
    it("roppa-rosa 9 raqamni qabul qiladi", () => {
        expect(inn.safeParse("123456789").success).toBe(true)
    })
    it("9 dan kam/ko'p raqamni rad etadi", () => {
        expect(inn.safeParse("12345").success).toBe(false)
        expect(inn.safeParse("1234567890").success).toBe(false)
        expect(inn.safeParse("12345678a").success).toBe(false)
    })
})

describe("amountField", () => {
    const amount = amountField(t)
    it("musbat sonni qabul qiladi", () => {
        expect(amount.safeParse(100).success).toBe(true)
    })
    it("0 va manfiy sonni rad etadi", () => {
        expect(amount.safeParse(0).success).toBe(false)
        expect(amount.safeParse(-5).success).toBe(false)
    })
})

describe("emailField", () => {
    const email = emailField(t)
    it("to'g'ri emailni qabul qiladi", () => {
        expect(email.safeParse("user@example.com").success).toBe(true)
    })
    it("noto'g'ri emailni rad etadi", () => {
        expect(email.safeParse("not-an-email").success).toBe(false)
    })
})
