import { cn } from "@/lib/utils/shadcn"

/** iDonate wordmark — works in light and dark.
 *  `collapsed` ⇒ faqat brend belgisi (rail holatida wordmark berkitiladi). */
export default function Logo({ collapsed }: { collapsed?: boolean }) {
    return (
        <div
            className={cn(
                "flex items-center gap-2.75",
                collapsed && "justify-center",
            )}
        >
            <div className="bg-brand flex size-10 shrink-0 items-center justify-center rounded-[11px] text-lg font-black text-white shadow-[0_0_16px_rgba(33,150,243,0.5)]">
                iD
            </div>
            {!collapsed && (
                <div className="text-[20px] leading-none font-black tracking-[-0.6px]">
                    <span className="text-foreground">i</span>
                    <span className="text-brand">Donate</span>
                </div>
            )}
        </div>
    )
}
