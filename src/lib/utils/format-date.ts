import { format } from "date-fns"

export function formatDate(date: string | Date | undefined | null) {
    return date ? format(new Date(date), "yyyy.MM.dd") : ""
}
export function formatDateTime(date: string | undefined | Date | null) {
    return date ? format(new Date(date), "yyyy.MM.dd HH:mm:ss") : ""
}
