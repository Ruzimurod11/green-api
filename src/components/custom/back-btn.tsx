import type { TranslationKey } from "@/@types/resources"
import { type NavigateOptions, useNavigate } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import ClientTranslate from "../client-translate"
import { Button } from "../ui/button"

type Props = {
    className?: string
    text?: TranslationKey
    navigateOptions?: NavigateOptions
}

export default function BackBtn({
    className = "",
    text = "back",
    navigateOptions,
}: Props) {
    const navigate = useNavigate()

    const clickHandler = () => {
        if (navigateOptions) {
            navigate(navigateOptions)
        } else window.history.back()
    }

    return (
        <Button
            className={className}
            onClick={clickHandler}
            variant={"outline"}
            size={"sm"}
        >
            <ArrowLeft size={16} />
            <ClientTranslate translationKey={text} />
        </Button>
    )
}
