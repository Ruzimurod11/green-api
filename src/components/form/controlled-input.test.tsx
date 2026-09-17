import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { FormHarness } from "../../test/form-harness"
import ControlledInput from "./controlled-input"

interface Form {
    title: string
}

describe("ControlledInput", () => {
    it("renders the label and lets the user type", async () => {
        const user = userEvent.setup()
        render(
            <FormHarness<Form>>
                {(methods) => (
                    <ControlledInput
                        methods={methods}
                        name="title"
                        label="Title"
                    />
                )}
            </FormHarness>,
        )

        const input = screen.getByRole("textbox")
        await user.type(input, "Counterparty A")
        expect(input).toHaveValue("Counterparty A")
    })

    it("fires onValueChange alongside the form update", async () => {
        const user = userEvent.setup()
        const onValueChange = vi.fn()
        render(
            <FormHarness<Form>>
                {(methods) => (
                    <ControlledInput
                        methods={methods}
                        name="title"
                        label="Title"
                        onValueChange={onValueChange}
                    />
                )}
            </FormHarness>,
        )

        await user.type(screen.getByRole("textbox"), "ab")
        expect(onValueChange).toHaveBeenCalledTimes(2)
    })

    it("shows the required error on submit when the field is empty", async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(
            <FormHarness<Form> onSubmit={onSubmit}>
                {(methods) => (
                    <ControlledInput
                        methods={methods}
                        name="title"
                        label="Title"
                        showError
                    />
                )}
            </FormHarness>,
        )

        await user.click(screen.getByRole("button", { name: "submit" }))

        expect(
            await screen.findByText("Ushbu maydon majburiy"),
        ).toBeInTheDocument()
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it("submits without error when marked optional", async () => {
        const user = userEvent.setup()
        const onSubmit = vi.fn()
        render(
            <FormHarness<Form> onSubmit={onSubmit}>
                {(methods) => (
                    <ControlledInput
                        methods={methods}
                        name="title"
                        label="Title"
                        optional
                        showError
                    />
                )}
            </FormHarness>,
        )

        await user.click(screen.getByRole("button", { name: "submit" }))

        expect(
            screen.queryByText("Ushbu maydon majburiy"),
        ).not.toBeInTheDocument()
        expect(onSubmit).toHaveBeenCalledTimes(1)
    })
})
