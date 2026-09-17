import BaseSelect from "@/components/ui/base-select"
import { cn } from "@/lib/utils/shadcn"

export type ComboOption = { id: string | number; name: string }

// Thin wrapper over BaseSelect (react-select) that speaks plain string ids, so
// it drops in where a native <select value onChange> used to be. `md` matches
// the form-field height; `sm` matches the compact inline filter look.
export default function Combo({
    options,
    value,
    onChange,
    placeholder,
    isClearable = true,
    className,
    size = "md",
}: {
    options: ComboOption[]
    value: string
    onChange: (val: string) => void
    placeholder?: string
    isClearable?: boolean
    className?: string
    size?: "sm" | "md"
}) {
    const current = options.find((o) => String(o.id) === value) ?? null
    return (
        <BaseSelect<ComboOption>
            options={options}
            value={current}
            onChange={(opt) => onChange(opt ? String(opt.id) : "")}
            isClearable={isClearable}
            placeholder={placeholder}
            className={className}
            // flip up instead of scroll-jumping when near the viewport bottom
            menuPlacement="auto"
            menuShouldScrollIntoView={false}
            maxMenuHeight={220}
            classNames={{
                control: ({ isFocused }) =>
                    cn(
                        "flex cursor-pointer rounded-lg border bg-background",
                        size === "sm" ?
                            "text-muted-foreground min-h-[30px] px-2.5 text-[11px]"
                        :   "min-h-[42px] px-3 text-sm",
                        isFocused ? "border-brand-cyan/50" : "border-border",
                    ),
            }}
        />
    )
}
