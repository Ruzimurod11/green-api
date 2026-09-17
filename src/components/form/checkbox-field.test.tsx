import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { FormHarness } from "../../test/form-harness"
import CheckboxField from "./checkbox-field"

interface Form {
    agree: boolean
}

describe("CheckboxField", () => {
    it("toggles the checked state on click", async () => {
        const user = userEvent.setup()
        render(
            <FormHarness<Form>>
                {(methods) => (
                    <CheckboxField
                        methods={methods}
                        name="agree"
                        label="I agree"
                    />
                )}
            </FormHarness>,
        )

        const checkbox = screen.getByRole("checkbox")
        expect(checkbox).not.toBeChecked()

        await user.click(checkbox)
        expect(checkbox).toBeChecked()
    })

    it("submits the boolean value once checked", async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(
            <FormHarness<Form> onSubmit={onSubmit}>
                {(methods) => (
                    <CheckboxField
                        methods={methods}
                        name="agree"
                        label="I agree"
                    />
                )}
            </FormHarness>,
        )

        await user.click(screen.getByRole("checkbox"))
        await user.click(screen.getByRole("button", { name: "submit" }))

        expect(onSubmit).toHaveBeenCalledWith({ agree: true })
    })

    it("blocks submit with a required error when not optional", async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(
            <FormHarness<Form> onSubmit={onSubmit}>
                {(methods) => (
                    <CheckboxField
                        methods={methods}
                        name="agree"
                        label="I agree"
                        optional={false}
                        showError
                    />
                )}
            </FormHarness>,
        )

        await user.click(screen.getByRole("button", { name: "submit" }))

        expect(
            await screen.findByText("Belgilash majburiy!"),
        ).toBeInTheDocument()
        expect(onSubmit).not.toHaveBeenCalled()
    })
})
