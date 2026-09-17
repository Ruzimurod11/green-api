import NumberInput from "@/components/custom/number-input"
import type { ColumnDef } from "@tanstack/react-table"
import type { JSX } from "react"
import { formatDateTime } from "./format-date"

export const textColumn = <T,>(
    accessorKey: keyof T,
    header: string,
    other?: Omit<ColumnDef<T>, "accessorKey" | "header">,
): ColumnDef<T> => ({
    ...other,
    accessorKey,
    header,
})

export const customColumn = <T,>(
    header: string,
    cell: (props: { row: { original: T } }) => JSX.Element,
): ColumnDef<T> => ({
    header,
    cell,
})

export const columnAction = <T,>(
    header: string,
    accessorKey: "action",
    cell: (props: { row: { original: T } }) => JSX.Element,
): ColumnDef<T> => ({
    header,
    accessorKey,
    cell,
})

export const dateTimeColumn = <T,>(
    accessorKey: keyof T,
    header: string,
): ColumnDef<T> => {
    return {
        accessorKey,
        header,
        cell: ({ row }) => {
            const date = row.original[accessorKey] as string
            return formatDateTime(date)
        },
    }
}

export const numberColumn = <T,>(
    accessorKey: keyof T,
    header = " ",
): ColumnDef<T> => ({
    accessorKey,
    header,
    cell: ({ row: { original } }) => {
        const num = Number(original[accessorKey])
        return <NumberInput displayType="text" value={num} />
    },
})
