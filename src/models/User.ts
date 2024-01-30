export interface User {
    name: string;
    email: string;
    phone: string;
    is_active?: number;
}

export interface BaseUser extends User {
    id: number;
    is_active: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}
  