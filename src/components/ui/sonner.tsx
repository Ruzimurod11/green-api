"use client"

import { useTheme } from "@/hooks/use-theme"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
    // Ilovaning yagona tema manbasidan o'qiymiz, shuning uchun toast'lar ham
    // tema almashtirilganda darhol ergashadi (next-themes emas).
    const { theme } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                } as React.CSSProperties
            }
            toastOptions={{
                classNames: {
                    success: "!text-green-500",
                    error: "!text-destructive",
                    warning: "!text-warning",
                    info: "!text-info",
                    closeButton:
                        "-right-3! !left-[unset] !text-popover-foreground [&_svg]:!text-popover-foreground [&_svg]:!stroke-popover-foreground [&_svg]:!opacity-100 hover:bg-background!",
                },
                closeButton: true,
            }}
            {...props}
        />
    )
}

export { Toaster }
