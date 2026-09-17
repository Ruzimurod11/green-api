import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { FormHarness } from "../../test/form-harness"
import NumberField from "./number-field"

// NumberField uses t() for its required message — return the key verbatim.
vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}))

interface Form {
    amount: number
}

describe("NumberField — formatting", () => {
    it("formats input with a thousand separator as the user types", async () => {
        const user = userEvent.setup()
        render(
            <FormHarness<Form>>
                {(methods) => (
                    <NumberField
                        methods={methods}
                        name="amount"
                        label="Amount"
                    />
                )}
            </FormHarness>,
        )

        const input = screen.getByRole("textbox")
        await user.type(input, "2500000")
        expect(input).toHaveValue("2 500 000")
    })

    it("submits the parsed numeric value, not the formatted string", async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(
            <FormHarness<Form> onSubmit={onSubmit}>
                {(methods) => (
                    <NumberField
                        methods={methods}
                        name="amount"
                        label="Amount"
                    />
                )}
            </FormHarness>,
        )

        await user.type(screen.getByRole("textbox"), "1500")
        await user.click(screen.getByRole("button", { name: "submit" }))

        expect(onSubmit).toHaveBeenCalledWith({ amount: 1500 })
    })

    it("blocks input that would exceed the max prop", async () => {
        const user = userEvent.setup()
        render(
            <FormHarness<Form>>
                {(methods) => (
                    <NumberField
                        methods={methods}
                        name="amount"
                        label="Amount"
                        max={100}
                    />
                )}
            </FormHarness>,
        )

        const input = screen.getByRole("textbox")
        await user.type(input, "150")
        // "150" > 100 is rejected, leaving the last allowed value "15"
        expect(input).toHaveValue("15")
    })
})

describe("NumberField — required validation", () => {
    it("reports the value as required when left at 0", async () => {
        const user = userEvent.setup()
        render(
            <FormHarness<Form>>
                {(methods) => (
                    <NumberField
                        methods={methods}
                        name="amount"
                        label="Amount"
                        showError
                    />
                )}
            </FormHarness>,
        )

        await user.click(screen.getByRole("button", { name: "submit" }))
        expect(await screen.findByText("required")).toBeInTheDocument()
    })

    it("accepts 0 as valid when allowZero is set", async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(
            <FormHarness<Form> onSubmit={onSubmit}>
                {(methods) => (
                    <NumberField
                        methods={methods}
                        name="amount"
                        label="Amount"
                        allowZero
                        showError
                    />
                )}
            </FormHarness>,
        )

        await user.click(screen.getByRole("button", { name: "submit" }))

        expect(screen.queryByText("required")).not.toBeInTheDocument()
        expect(onSubmit).toHaveBeenCalledWith({ amount: 0 })
    })
})
