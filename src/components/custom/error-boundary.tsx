import { Button } from "@/components/ui/button"
import i18n from "@/lib/i18n/request"
import { captureError } from "@/lib/monitoring/sentry"
import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
}

// Render paytidagi kutilmagan xatolarni ushlab, butun oq ekran o'rniga
// tiklash tugmasi bo'lgan fallback ko'rsatadi va Sentry'ga yuboradi.
// Matn uchun `i18n.t()` singleton ishlatamiz — React context'ga bog'liq emas,
// shuning uchun provayderlar qulasa ham fallback ishlayveradi.
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        captureError(error, { componentStack: info.componentStack })
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (!this.state.hasError) return this.props.children

        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
                <h1 className="text-2xl font-semibold">
                    {i18n.t("somethingWentWrong")}
                </h1>
                <p className="text-muted-foreground max-w-md">
                    {i18n.t("unexpectedError")}
                </p>
                <Button onClick={this.handleReload}>
                    {i18n.t("reloadPage")}
                </Button>
            </div>
        )
    }
}
