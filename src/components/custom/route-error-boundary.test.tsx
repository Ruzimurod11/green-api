import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

// i18n key'ni o'zini qaytaradi, Sentry capture'ni kuzatamiz.
vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}))
const captureError = vi.fn()
vi.mock("@/lib/monitoring/sentry", () => ({
    captureError: (...args: unknown[]) => captureError(...args),
}))

import { RouteErrorBoundary } from "./route-error-boundary"

describe("RouteErrorBoundary", () => {
    it("renders the fallback and reports the error", () => {
        render(
            <RouteErrorBoundary
                error={new Error("boom")}
                reset={() => undefined}
                info={{ componentStack: "" }}
            />,
        )

        expect(screen.getByText("somethingWentWrong")).toBeInTheDocument()
        expect(screen.getByText("tryAgain")).toBeInTheDocument()
        expect(captureError).toHaveBeenCalledOnce()
    })

    it("calls reset when the retry button is clicked", () => {
        const reset = vi.fn()

        render(
            <RouteErrorBoundary
                error={new Error("boom")}
                reset={reset}
                info={{ componentStack: "" }}
            />,
        )

        fireEvent.click(screen.getByText("tryAgain"))
        expect(reset).toHaveBeenCalledOnce()
    })
})
