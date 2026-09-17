import type { TranslationKey } from "@/@types/resources"
import { cn } from "@/lib/utils/shadcn"
import ClientTranslate from "../client-translate"
import { Button, buttonVariants } from "../ui/button"
import { DialogClose } from "../ui/dialog"

type Props = {
    loading?: boolean
    className?: string
    disabled?: boolean
    submitName?: TranslationKey
    isModal?: boolean
}

export default function FormAction({
    loading,
    disabled,
    className,
    submitName = "save",
    isModal = true,
}: Props) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-2 mt-3",
                className,
            )}
        >
            {isModal && (
                <DialogClose disabled={disabled || loading}>
                    <div className={cn(buttonVariants({ variant: "outline" }))}>
                        <ClientTranslate translationKey="back" />
                    </div>
                </DialogClose>
            )}
            <Button isLoading={loading} type="submit" disabled={disabled}>
                <ClientTranslate translationKey={submitName} />
            </Button>
        </div>
    )
}
