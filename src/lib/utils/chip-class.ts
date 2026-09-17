import { cn } from "@/lib/utils/shadcn"

/** Adesk uslubidagi filtr chipi — faol holatda brend rangi bilan bo'yaladi. */
export const chipClass = (active: boolean) =>
    cn(
        "cursor-pointer rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors",
        active ?
            "bg-brand-cyan/15 border-brand-cyan/40 text-brand-cyan"
        :   "bg-background border-border text-muted-foreground hover:text-foreground",
    )
