import { describe, expect, it } from "vitest"
import { makeQueryKey } from "./make-query-key"

describe("makeQueryKey", () => {
    it("returns just the url when no deps or params are given", () => {
        expect(makeQueryKey({ url: "/orders" })).toEqual(["/orders"])
    })

    it("appends deps then param values, preserving order", () => {
        expect(
            makeQueryKey({
                url: "/orders",
                deps: ["list", 1],
                params: { page: 2, search: "abc" },
            }),
        ).toEqual(["/orders", "list", 1, 2, "abc"])
    })

    it("drops falsy param values so empty filters don't fragment the cache", () => {
        // page=0, search="" and active=false must NOT split the cache key —
        // otherwise an empty search produces a different key than no search.
        expect(
            makeQueryKey({
                url: "/orders",
                params: { page: 0, search: "", active: false, name: "uzpin" },
            }),
        ).toEqual(["/orders", "uzpin"])
    })

    it("ignores a non-array deps value", () => {
        expect(
            makeQueryKey({
                url: "/orders",
                // @ts-expect-error — guarding the runtime fallback for bad deps
                deps: "oops",
            }),
        ).toEqual(["/orders"])
    })

    it("tolerates a null params value", () => {
        expect(
            makeQueryKey({
                url: "/orders",
                // @ts-expect-error — guarding the runtime fallback for bad params
                params: null,
            }),
        ).toEqual(["/orders"])
    })

    it("builds distinct keys for distinct param values", () => {
        const a = makeQueryKey({ url: "/x", params: { page: 1 } })
        const b = makeQueryKey({ url: "/x", params: { page: 2 } })
        expect(a).not.toEqual(b)
    })
})
