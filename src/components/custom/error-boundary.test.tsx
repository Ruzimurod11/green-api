import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

// i18n singleton va Sentry capture'ni mock qilamiz — fallback matnini key bo'yicha
// tekshiramiz va xato haqiqatan reporter'ga uzatilishini tasdiqlaymiz.
vi.mock("@/lib/i18n/request", () => ({
    default: { t: (key: string) => key },
}))
const captureError = vi.fn()
vi.mock("@/lib/monitoring/sentry", () => ({
    captureError: (...args: unknown[]) => captureError(...args),
}))

import { ErrorBoundary } from "./error-boundary"

function Boom(): never {
    throw new Error("boom")
}

describe("ErrorBoundary", () => {
    it("renders the fallback and reports the error when a child throws", () => {
        // React render xatosini console'ga chiqarishini bostiramiz (test shovqini).
        const spy = vi
            .spyOn(console, "error")
            .mockImplementation(() => undefined)

        render(
            <ErrorBoundary>
                <Boom />
            </ErrorBoundary>,
        )

        expect(screen.getByText("somethingWentWrong")).toBeInTheDocument()
        expect(screen.getByText("reloadPage")).toBeInTheDocument()
        expect(captureError).toHaveBeenCalledOnce()

        spy.mockRestore()
    })

    it("renders children unchanged when there is no error", () => {
        render(
            <ErrorBoundary>
                <span>healthy</span>
            </ErrorBoundary>,
        )

        expect(screen.getByText("healthy")).toBeInTheDocument()
    })
})
