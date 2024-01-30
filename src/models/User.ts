export interface User {
    name: string;
    email: string;
    phone: string;
    is_active?: number;
}

export interface BaseUser extends User {
    id: number;
    is_active: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
  