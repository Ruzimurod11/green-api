// GET /accounts/profile/ — UserProfileSerializer
export interface IProfile {
    id: number
    email: string
    phone?: string | null
    first_name: string
    last_name: string
    middle_name?: string
    full_name: string
    avatar?: string | null
    avatar_url?: string | null
    role: string
    role_display: string
    department?: string | null
    department_display?: string
    position?: string
    inn?: string | null
    birth_date?: string | null
    address?: string
    is_active: boolean
    created_at: string
    updated_at: string
    last_login?: string | null
}
