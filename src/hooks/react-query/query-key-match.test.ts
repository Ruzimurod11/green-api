import { describe, expect, it } from "vitest"
import { queryKeyMatchesEndpoint } from "./query-key-match"

describe("queryKeyMatchesEndpoint", () => {
    it("matches the exact list URL regardless of trailing slash", () => {
        expect(
            queryKeyMatchesEndpoint(
                "operations/accounts/",
                "operations/accounts",
            ),
        ).toBe(true)
        expect(queryKeyMatchesEndpoint("directions/", "directions")).toBe(true)
    })

    it("matches sub-resources of the endpoint prefix", () => {
        expect(
            queryKeyMatchesEndpoint(
                "operations/accounts/5/",
                "operations/accounts",
            ),
        ).toBe(true)
        expect(
            queryKeyMatchesEndpoint("directions/5/statistics/", "directions"),
        ).toBe(true)
        expect(
            queryKeyMatchesEndpoint(
                "operations/transactions/statistics/",
                "operations/transactions",
            ),
        ).toBe(true)
    })

    it("does NOT match sibling URLs that merely share a string prefix", () => {
        // The substring `.includes()` bug this fix removes.
        expect(
            queryKeyMatchesEndpoint("team/members-pending/", "team/members"),
        ).toBe(false)
        expect(
            queryKeyMatchesEndpoint(
                "operations/accounts-archive/",
                "operations/accounts",
            ),
        ).toBe(false)
        expect(queryKeyMatchesEndpoint("users-temp/", "users")).toBe(false)
    })

    it("ignores non-string keys", () => {
        expect(queryKeyMatchesEndpoint(42, "users")).toBe(false)
        expect(queryKeyMatchesEndpoint(undefined, "users")).toBe(false)
    })
})
