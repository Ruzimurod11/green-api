export interface PaginatedResponse<T> {
    page: number
    page_size: number
    total: number
    total_pages: number
    next_page: string | null
    prev_page: string | null
    data: T[]
}

export type OptionIdNumber = {
    name: string
    id: number
}
export type OptionIdString = {
    name: string
    id: string
}

export type MonthIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
