"use client"

import type { TranslationKey } from "@/@types/resources"
import { Inbox } from "lucide-react"
import ClientTranslate from "../client-translate"

interface NoDataProps {
    title?: TranslationKey
    description?: TranslationKey
}

const NoData = ({
    title = "noData",
    description = "noAnythingAtMoment",
}: NoDataProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 rounded-xl border-dashed border-gray-300 text-center space-y-2">
            <Inbox className="h-12 w-12 text-gray-400" />
            {!!title && (
                <h3 className="text-gray-700 text-lg font-semibold">
                    <ClientTranslate translationKey={title} />{" "}
                </h3>
            )}
            {!!description && (
                <p className="text-gray-500 text-sm">
                    <ClientTranslate translationKey={description} />{" "}
                </p>
            )}
        </div>
    )
}

export default NoData
