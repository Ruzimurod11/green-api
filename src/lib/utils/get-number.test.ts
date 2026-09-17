import { describe, expect, it } from "vitest"
import { getNumber } from "./get-number"

describe("getNumber — primitives", () => {
    it("returns numbers untouched (including negatives and decimals)", () => {
        expect(getNumber(42)).toBe(42)
        expect(getNumber(-7)).toBe(-7)
        expect(getNumber(3.14)).toBe(3.14)
        expect(getNumber(0)).toBe(0)
    })

    it("maps booleans to 1 / 0", () => {
        expect(getNumber(true)).toBe(1)
        expect(getNumber(false)).toBe(0)
    })

    it("treats null and undefined as 0", () => {
        expect(getNumber(null)).toBe(0)
        expect(getNumber(undefined)).toBe(0)
    })
})

describe("getNumber — messy money strings", () => {
    it("strips thousands separators", () => {
        expect(getNumber("2,500")).toBe(2500)
        expect(getNumber("1 234 567")).toBe(1234567)
    })

    it("strips currency symbols and stray characters", () => {
        expect(getNumber("$1,234.56")).toBe(1234.56)
        expect(getNumber("12px")).toBe(12)
        expect(getNumber("  -42 ")).toBe(-42)
    })

    it("returns 0 for non-numeric / empty strings", () => {
        expect(getNumber("abc")).toBe(0)
        expect(getNumber("")).toBe(0)
        expect(getNumber("   ")).toBe(0)
    })
})

describe("getNumber — valueOf-able objects", () => {
    it("uses valueOf() for wrapper-like objects", () => {
        expect(getNumber({ valueOf: () => 99 })).toBe(99)
    })

    it("reads a Date as its epoch milliseconds", () => {
        const date = new Date("2020-01-01T00:00:00.000Z")
        expect(getNumber(date)).toBe(date.getTime())
    })
})
