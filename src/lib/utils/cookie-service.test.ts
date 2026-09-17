import { beforeEach, describe, expect, it } from "vitest"
import { CookieService } from "./cookie-service"

// The shared setup.ts afterEach wipes the jsdom cookie jar, but reset here too
// so each assertion starts from a known-empty state regardless of ordering.
beforeEach(() => {
    CookieService.clearAllTokens()
})

describe("CookieService — access token", () => {
    it("round-trips an access token", () => {
        CookieService.setAccessToken("acc-123")
        expect(CookieService.getAccessToken()).toBe("acc-123")
    })

    it("removes the access token", () => {
        CookieService.setAccessToken("acc-123")
        CookieService.removeAccessToken()
        expect(CookieService.getAccessToken()).toBeUndefined()
    })
})

describe("CookieService — refresh token", () => {
    it("round-trips a refresh token independently of the access token", () => {
        CookieService.setRefreshToken("ref-456")
        expect(CookieService.getRefreshToken()).toBe("ref-456")
        expect(CookieService.getAccessToken()).toBeUndefined()
    })
})

describe("CookieService — hasTokens", () => {
    it("is false until BOTH tokens are present", () => {
        expect(CookieService.hasTokens()).toBe(false)

        CookieService.setAccessToken("acc")
        expect(CookieService.hasTokens()).toBe(false)

        CookieService.setRefreshToken("ref")
        expect(CookieService.hasTokens()).toBe(true)
    })
})

describe("CookieService — clearAllTokens", () => {
    it("removes both tokens", () => {
        CookieService.setAccessToken("acc")
        CookieService.setRefreshToken("ref")

        CookieService.clearAllTokens()

        expect(CookieService.getAccessToken()).toBeUndefined()
        expect(CookieService.getRefreshToken()).toBeUndefined()
        expect(CookieService.hasTokens()).toBe(false)
    })
})
