import { Button } from "@/components/ui/button"
import { captureError } from "@/lib/monitoring/sentry"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

// Marshrut darajasidagi xato chegarasi. TanStack Router buni faqat shu
// marshrutning `<Outlet />` o'rnida render qiladi — `_layout` (sidebar/nav)
// mount bo'lib qoladi, faqat seksiya fallback bilan almashadi.
// Global oq ekran o'rniga lokal tiklanish: `reset` marshrutni qayta render
// qiladi, navigatsiyada esa avtomatik tozalanadi.
export function RouteErrorBoundary({ error, reset }: ErrorComponentProps) {
    const { t } = useTranslation()

    useEffect(() => {
        captureError(error)
    }, [error])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
            <h2 className="text-xl font-semibold">{t("somethingWentWrong")}</h2>
            <p className="text-muted-foreground max-w-md">
                {t("unexpectedError")}
            </p>
            <Button onClick={reset}>{t("tryAgain")}</Button>
        </div>
    )
}
