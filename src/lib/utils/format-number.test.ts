import { describe, expect, it } from "vitest"
import { formatNumber } from "./format-number"

describe("formatNumber — thousand grouping", () => {
    it("groups thousands with a space separator", () => {
        expect(formatNumber(2500)).toBe("2 500")
        expect(formatNumber(1234567)).toBe("1 234 567")
    })

    it("accepts numeric strings", () => {
        expect(formatNumber("2500")).toBe("2 500")
    })

    it("keeps the decimal part", () => {
        expect(formatNumber(1234.5)).toBe("1 234.5")
    })

    it("groups negative amounts", () => {
        expect(formatNumber(-5000)).toBe("-5 000")
    })
})

describe("formatNumber — zero / empty handling", () => {
    it("renders zero as an empty string by default", () => {
        expect(formatNumber(0)).toBe("")
    })

    it("renders zero as '0' when isShowZero is set", () => {
        expect(formatNumber(0, { isShowZero: true })).toBe("0")
    })

    it("renders an empty string for non-numeric / nullish input", () => {
        expect(formatNumber(undefined)).toBe("")
        expect(formatNumber(null)).toBe("")
        expect(formatNumber("not-a-number")).toBe("")
    })
})

describe("formatNumber — forwarded react-number-format props", () => {
    it("supports a fixed decimal scale and prefix", () => {
        expect(
            formatNumber(1000, {
                decimalScale: 2,
                fixedDecimalScale: true,
                prefix: "$",
            }),
        ).toBe("$1 000.00")
    })
})
