export interface User {
    id: number
    email: string
    first_name: string
    last_name: string
    middle_name?: string
    phone?: string
    avatar?: string
    role: string
    role_display: string
    department?: string
    department_display?: string
    position?: string
    is_active: boolean
    created_at: string
    updated_at: string
    last_login?: string
}

export interface AuthTokens {
    access: string
    refresh: string
}

export interface GoogleAuthResponse {
    success: boolean
    message: string
    user: User
    tokens: AuthTokens
}

export interface GoogleAuthRequest {
    token: string
}
