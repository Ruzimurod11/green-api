import { beforeEach, describe, expect, it, vi } from "vitest"

// Mock the toast surface and i18n so we assert on what the user is shown,
// without booting sonner or the real i18next instance.
vi.mock("sonner", () => ({
    toast: { error: vi.fn() },
}))
vi.mock("@/lib/i18n/request", () => ({
    default: { t: (key: string) => key },
}))

import { toast } from "sonner"
import { onError } from "./on-error"

const errorToast = vi.mocked(toast.error)

beforeEach(() => {
    errorToast.mockClear()
})

describe("onError — server validation payloads", () => {
    it("flattens a field-error object into one toast", () => {
        onError({
            response: {
                data: { email: "Invalid email", password: "Too short" },
            },
        })

        expect(errorToast).toHaveBeenCalledTimes(1)
        expect(errorToast).toHaveBeenCalledWith(
            "email: Invalid email; password: Too short",
            {
                id: "email: Invalid email; password: Too short",
                duration: 5000,
            },
        )
    })

    it("stringifies array values in the payload", () => {
        onError({ response: { data: { detail: ["Not found"] } } })

        expect(errorToast).toHaveBeenCalledWith("detail: Not found", {
            id: "detail: Not found",
            duration: 5000,
        })
    })
})

describe("onError — fallbacks", () => {
    it("uses err.message when there is no response payload", () => {
        onError({ message: "Network Error" })

        expect(errorToast).toHaveBeenCalledWith("Network Error", {
            id: "http-err",
            duration: 5000,
        })
    })

    it("falls back to a translated key for an empty payload and no message", () => {
        onError({ response: { data: {} } })

        expect(errorToast).toHaveBeenCalledWith("unexpectedError", {
            id: "unexpectedError",
            duration: 5000,
        })
    })
})
