import IconCloseCircle from "@/assets/icons/close-circle"
import IconOctagonCheck from "@/assets/icons/octagon-check"
import ClientTranslate from "@/components/client-translate"
import { Button } from "@/components/ui/button"
import { ClockIcon } from "lucide-react"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "../../ui/dialog"
import { useMessageStore } from "./use-message-store"

export default function MessageModal() {
    const { isOpen, closeMessageModal, message, variant, title } =
        useMessageStore()
    const handleClose = () => {
        closeMessageModal()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            {isOpen && (
                <DialogContent
                    className="max-w-sm flex flex-col gap-5"
                    aria-describedby=""
                >
                    <DialogTitle className="flex flex-col gap-3 items-center clamp-[text,lg,2xl]!">
                        {variant === "success" && (
                            <>
                                <IconOctagonCheck />
                                <ClientTranslate
                                    translationKey={title || "successfully"}
                                    className="text-success"
                                />
                            </>
                        )}
                        {variant === "error" && (
                            <>
                                <IconCloseCircle />
                                <ClientTranslate
                                    translationKey={title || "failed"}
                                    className="text-destructive"
                                />
                            </>
                        )}
                        {variant === "warning" && (
                            <>
                                <ClockIcon className="text-warning" />
                                <ClientTranslate
                                    translationKey={title || "warning"}
                                    className="text-warning"
                                />
                            </>
                        )}
                    </DialogTitle>
                    {message && (
                        <DialogDescription className="text-center text-base">
                            {variant === "error" ?
                                getErrorMessage(message)
                            :   message}
                        </DialogDescription>
                    )}
                    <DialogClose asChild>
                        <Button variant={"outline"}>
                            <ClientTranslate translationKey="close" />
                        </Button>
                    </DialogClose>
                </DialogContent>
            )}
        </Dialog>
    )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getErrorMessage(err: any) {
    const errorData = err?.response?.data

    if (errorData && Object.keys(errorData).length > 0) {
        const formattedMessage = Object.entries(errorData)
            .map(([_key, value]) => `${value}`)
            .join("; ")

        return formattedMessage
    } else {
        return err?.message || "An unexpected error occurred"
    }
}
