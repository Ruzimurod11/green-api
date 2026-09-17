import { SEARCH_PARAMS } from "@/lib/constants/search-params"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Input, type InputProps } from "../ui/input"

interface Props extends InputProps {
    searchKey?: string
    currentPageKey?: string
}

export default function FilterInput({
    searchKey = SEARCH_PARAMS.SEARCH,
    currentPageKey = SEARCH_PARAMS.PAGE,
    ...props
}: Props) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const search = useSearch({ strict: false }) as Record<string, unknown>
    const value = search[searchKey] as string | undefined
    const onChange = (val: string) => {
        navigate({
            // Dynamic search keys — router can't statically verify computed
            // keys against the route's closed search schema.
            search: {
                ...search,
                [searchKey]: val || undefined,
                [currentPageKey]: undefined,
            } as never,
        })
    }

    return (
        <Input
            type="search"
            handleDebouncedInputValue={onChange}
            placeholder={t("search")}
            defaultValue={value}
            {...props}
        />
    )
}
