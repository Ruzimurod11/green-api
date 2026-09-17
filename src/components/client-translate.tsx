import type { TranslationKey } from "@/@types/resources"
import parse from "html-react-parser"
import { useTranslation } from "react-i18next"

interface Props {
    translationKey: TranslationKey
    values?: Record<string, string | number | Date>
    className?: string
    isParse?: boolean
}

export default function ClientTranslate({
    translationKey,
    className,
    values,
    isParse = false,
}: Props) {
    const { t } = useTranslation()

    if (!translationKey) return ""
    return (
        <span className={className}>
            {isParse ?
                parse(t(translationKey, values))
            :   t(translationKey, values)}
        </span>
    )
}
