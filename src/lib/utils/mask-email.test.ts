import { describe, expect, it } from "vitest"
import { maskEmail } from "./mask-email"

describe("maskEmail — defaults", () => {
    it("keeps up to 3 local chars and masks the domain", () => {
        expect(maskEmail("caz123@example.com")).toBe("caz****@****")
    })

    it("keeps the whole local part when it is shorter than 3 chars", () => {
        expect(maskEmail("ab@domain.ru")).toBe("ab****@****")
    })
})

describe("maskEmail — options", () => {
    it("can preserve the domain", () => {
        expect(maskEmail("alice@uzpin.com", { maskDomain: false })).toBe(
            "ali****@uzpin.com",
        )
    })

    it("respects custom visible length and mask count", () => {
        expect(
            maskEmail("johndoe@uzpin.com", {
                visibleLocal: 2,
                localMaskCount: 2,
            }),
        ).toBe("jo**@****")
    })
})

describe("maskEmail — invalid input", () => {
    it("returns the value unchanged when there is no usable local part", () => {
        expect(maskEmail("noatsign")).toBe("noatsign")
        expect(maskEmail("@leading.com")).toBe("@leading.com")
    })

    it("throws a TypeError for an empty string", () => {
        expect(() => maskEmail("")).toThrow(TypeError)
    })
})
