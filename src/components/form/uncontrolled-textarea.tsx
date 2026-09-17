"use client"

import { cn } from "@/lib/utils/shadcn"
import {
    type ChangeEvent,
    type ReactNode,
    type TextareaHTMLAttributes,
} from "react"
import {
    useFormState,
    type FieldValues,
    type Path,
    type UseFormReturn,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { type ClassNameValue } from "tailwind-merge"
import ErrorMessage from "../ui/error-message"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"

interface IProps<IForm extends FieldValues> {
    methods: UseFormReturn<IForm>
    name: Path<IForm>
    label?: ReactNode
    wrapperClassName?: ClassNameValue
    showError?: boolean
    optional?: boolean
    onValueChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export default function UncontrolledTextarea<IForm extends FieldValues>({
    methods,
    name,
    label,
    wrapperClassName,
    showError = false,
    optional = false,
    onValueChange,
    className,
    ...props
}: IProps<IForm> & TextareaHTMLAttributes<HTMLTextAreaElement>) {
    // See UncontrolledInput: React Compiler memoizes this component, so the
    // field needs its own useFormState subscription plus "use no memo" to
    // re-render when a validation error appears.
    "use no memo"
    const { t } = useTranslation()
    const { register } = methods
    const { errors } = useFormState({ control: methods.control, name })

    const { onChange, ...reg } = register(name, {
        required: {
            value: !optional,
            message: t("requiredField"),
        },
    })

    return (
        <fieldset
            className={cn("flex flex-col gap-2 w-full", wrapperClassName)}
        >
            {label && (
                <Label
                    htmlFor={name}
                    className={cn(!!errors?.[name] && "text-destructive")}
                    required={!optional}
                >
                    {label}
                </Label>
            )}
            <Textarea
                placeholder={typeof label === "string" ? label : ""}
                id={name}
                onChange={(e) => {
                    onChange(e)
                    onValueChange?.(e)
                }}
                className={cn("min-h-40", className)}
                {...reg}
                {...props}
            />
            {showError && errors[name] && (
                <ErrorMessage>
                    {(errors[name]?.message as string) ||
                        errors.root?.[name]?.message}
                </ErrorMessage>
            )}
        </fieldset>
    )
}
