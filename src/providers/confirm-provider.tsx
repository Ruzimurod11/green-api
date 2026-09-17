import type { TranslationKey } from "@/@types/resources"
import ClientTranslate from "@/components/client-translate"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createContext, type ReactNode, useCallback, useState } from "react"

// Types
interface ConfirmOptions {
    title?: TranslationKey | ""
    description?: TranslationKey | ""
    confirmText?: TranslationKey | ""
    cancelText?: TranslationKey | ""
    variant?: "default" | "destructive"
}

interface ConfirmContextType {
    confirm: (options?: ConfirmOptions) => Promise<boolean>
}

interface ConfirmState extends ConfirmOptions {
    open: boolean
    resolve?: (value: boolean) => void
}

// Context
// eslint-disable-next-line react-refresh/only-export-components
export const ConfirmContext = createContext<ConfirmContextType | undefined>(
    undefined,
)

// Provider Component
export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ConfirmState>({
        open: false,
        title: "areYouSure",
        description: "thisActionCannotBeUndone",
        confirmText: "continue",
        cancelText: "cancel",
        variant: "default",
    })

    const confirm = useCallback(
        (options?: ConfirmOptions): Promise<boolean> => {
            return new Promise((resolve) => {
                setState({
                    open: true,
                    title: options?.title ?? "areYouSure",
                    description:
                        options?.description ?? "thisActionCannotBeUndone",
                    confirmText: options?.confirmText ?? "continue",
                    cancelText: options?.cancelText ?? "cancel",
                    variant: options?.variant ?? "default",
                    resolve,
                })
            })
        },
        [],
    )

    const handleConfirm = () => {
        state.resolve?.(true)
        setState((prev) => ({ ...prev, open: false }))
    }

    const handleCancel = () => {
        state.resolve?.(false)
        setState((prev) => ({ ...prev, open: false }))
    }

    return (
        <ConfirmContext value={{ confirm }}>
            {children}
            <AlertDialog open={state.open} onOpenChange={handleCancel}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <ClientTranslate
                                translationKey={state.title || "areYouSure"}
                            />
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            <ClientTranslate
                                translationKey={
                                    state.description ||
                                    "thisActionCannotBeUndone"
                                }
                            />
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>
                            <ClientTranslate
                                translationKey={state.cancelText || "cancel"}
                            />
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className={
                                state.variant === "destructive" ?
                                    "bg-red-600 hover:bg-red-700 focus:ring-red-600"
                                :   "from-brand-cyan to-brand-teal bg-transparent bg-linear-to-r text-white hover:bg-transparent hover:opacity-90"
                            }
                        >
                            <ClientTranslate
                                translationKey={state.confirmText || "continue"}
                            />
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmContext>
    )
}
