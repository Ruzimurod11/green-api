"use client"

import type { TranslationKey } from "@/@types/resources"
import { cn } from "@/lib/utils/shadcn"
import { type ChangeEvent, type ReactNode } from "react"
import {
    useFormState,
    type FieldValues,
    type Path,
    type UseFormReturn,
} from "react-hook-form"
import { useTranslation } from "react-i18next"
import { type ClassNameValue } from "tailwind-merge"
import ErrorMessage from "../ui/error-message"
import { Input, type InputProps } from "../ui/input"
import { Label } from "../ui/label"

interface IProps<IForm extends FieldValues> {
    methods: UseFormReturn<IForm>
    name: Path<IForm>
    label?: ReactNode
    wrapperClassName?: ClassNameValue
    showError?: boolean
    optional?: boolean
    onValueChange?: (e: ChangeEvent<HTMLInputElement>) => void
    labelClassName?: string
}

export default function UncontrolledInput<IForm extends FieldValues>({
    methods,
    name,
    label,
    wrapperClassName,
    showError = false,
    optional = false,
    onValueChange,
    placeholder,
    labelClassName,
    ...props
}: IProps<IForm> & InputProps) {
    // "use no memo" + useFormState: React Compiler memoizes this component
    // (all props are referentially stable), so it never re-renders when a
    // validation error appears. useFormState gives the field its own
    // subscription, and the directive lets that re-render actually happen.
    "use no memo"
    const { t } = useTranslation()
    const { register } = methods
    const { errors } = useFormState({ control: methods.control, name })

    const { onChange, ref, ...reg } = register(name, {
        required: {
            value: !optional,
            message: t("requiredField"),
        },
        ...(props.type === "email" && {
            pattern: {
                value: /\S+@\S+\.\S+/,
                message: t("incorrectEmail"),
            },
        }),
        ...(props.type === "password" && {
            minLength: { value: 4, message: t("passwordLength") },
            maxLength: { value: 120, message: t("passwordLength") },
        }),
        ...(props.type !== "password" &&
            props.minLength != null && {
                minLength: {
                    value: Number(props.minLength),
                    message: t("minLengthError", {
                        min: Number(props.minLength),
                    }),
                },
            }),
    })

    return (
        <fieldset
            className={cn("flex flex-col gap-2 w-full", wrapperClassName)}
        >
            {label && (
                <Label
                    htmlFor={name}
                    className={cn(
                        !!errors?.[name] && "text-destructive",
                        labelClassName,
                    )}
                    required={!optional}
                >
                    {label}
                </Label>
            )}
            <Input
                type={"text"}
                placeholder={
                    placeholder ? placeholder
                    : typeof label === "string" ?
                        t(label as TranslationKey)
                    :   ""
                }
                id={name}
                onChange={(e) => {
                    onChange(e)
                    onValueChange?.(e)
                }}
                {...reg}
                {...props}
                ref={ref}
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
