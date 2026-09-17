import type { ReactNode } from "react"
import {
    useForm,
    type DefaultValues,
    type FieldValues,
    type UseFormReturn,
} from "react-hook-form"

interface Props<T extends FieldValues> {
    defaultValues?: DefaultValues<T>
    onSubmit?: (values: T) => void
    children: (methods: UseFormReturn<T>) => ReactNode
}

/**
 * Test-only wrapper that supplies a real react-hook-form instance to the
 * `methods`-prop form controls and renders a submit button so tests can trigger
 * validation the same way the app does.
 */
export function FormHarness<T extends FieldValues>({
    defaultValues,
    onSubmit,
    children,
}: Props<T>) {
    const methods = useForm<T>({ defaultValues })
    return (
        <form onSubmit={methods.handleSubmit((values) => onSubmit?.(values))}>
            {children(methods)}
            <button type="submit">submit</button>
        </form>
    )
}
