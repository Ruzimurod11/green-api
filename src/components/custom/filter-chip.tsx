// Adesk uslubidagi filtr chiplari — yo'nalishlar ro'yxati va operatsiyalar
// jurnali bir xil ko'rinishdan foydalanadi.
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { chipClass } from "@/lib/utils/chip-class"
import { cn } from "@/lib/utils/shadcn"
import { Search } from "lucide-react"
import { useState } from "react"

export type ChipOption = { id: string; name: string }

/** Bitta tanlovli chip (masalan "Barchasi / Reja / Fakt"). */
export function SingleSelectChip<T extends string>({
    label,
    options,
    value,
    onChange,
    active,
    width = "w-48",
}: {
    label: string
    options: { id: T; label: string }[]
    value: T
    onChange: (v: T) => void
    // chip "yoqilgan" ko'rinishda bo'lsinmi (default qiymatdan farq qilsa)
    active: boolean
    width?: string
}) {
    return (
        <Popover>
            <PopoverTrigger className={chipClass(active)}>
                {label}
            </PopoverTrigger>
            <PopoverContent align="start" className={cn(width, "p-1.5")}>
                {options.map((o) => (
                    <button
                        key={o.id}
                        type="button"
                        onClick={() => onChange(o.id)}
                        className={cn(
                            "hover:bg-foreground/5 w-full cursor-pointer rounded-lg px-2.5 py-1.5 text-left text-[13px]",
                            value === o.id && "text-brand-cyan font-semibold",
                        )}
                    >
                        {o.label}
                    </button>
                ))}
            </PopoverContent>
        </Popover>
    )
}

/** Qidiruvli, ko'p tanlovli checkbox ro'yxati (Adesk'dagi "Все счета" chipi). */
export function MultiSelectChip({
    label,
    activeLabel,
    searchPlaceholder,
    options,
    selected,
    onChange,
}: {
    label: string
    activeLabel: string
    searchPlaceholder: string
    options: ChipOption[]
    selected: readonly string[]
    onChange: (next: string[]) => void
}) {
    const [query, setQuery] = useState("")
    const visible = options.filter((o) =>
        o.name.toLowerCase().includes(query.trim().toLowerCase()),
    )
    const toggle = (id: string) =>
        onChange(
            selected.includes(id) ?
                selected.filter((s) => s !== id)
            :   [...selected, id],
        )

    return (
        <Popover>
            <PopoverTrigger className={chipClass(selected.length > 0)}>
                {selected.length > 0 ? activeLabel : label}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2">
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="mb-2 h-9"
                />
                <div className="max-h-56 space-y-0.5 overflow-y-auto">
                    {visible.map((o) => (
                        <label
                            key={o.id}
                            className="hover:bg-foreground/5 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5"
                        >
                            <Checkbox
                                checked={selected.includes(o.id)}
                                onCheckedChange={() => toggle(o.id)}
                            />
                            <span className="text-foreground truncate text-[13px]">
                                {o.name}
                            </span>
                        </label>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

/** Matn qidiruvi chipi — Enter yoki tugma bosilganda qo'llanadi. */
export function SearchChip({
    label,
    placeholder,
    findLabel,
    value,
    onChange,
}: {
    label: string
    placeholder: string
    findLabel: string
    value: string
    onChange: (s: string) => void
}) {
    const [draft, setDraft] = useState(value)

    return (
        <Popover>
            <PopoverTrigger className={chipClass(!!value)}>
                {value || label}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-2">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onChange(draft.trim())
                    }}
                >
                    <Input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={placeholder}
                        className="mb-2 h-9"
                    />
                    <button
                        type="submit"
                        className="from-brand-cyan to-brand-teal flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-linear-to-r py-2 text-[13px] font-bold text-white"
                    >
                        <Search className="size-3.5" />
                        {findLabel}
                    </button>
                </form>
            </PopoverContent>
        </Popover>
    )
}
