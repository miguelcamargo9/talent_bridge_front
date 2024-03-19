import { User, BaseUser } from '../models/User';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const fetchUsers = async (): Promise<BaseUser[]> => {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error getting the users');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting the users', error);
        throw error;
    }
};

export const fetchUser = async (id: number): Promise<User> => {
    try {
        const response = await fetch(`${BASE_URL}/user/profile/${id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error getting the user');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting the user', error);
        throw error;
    }
};

export const createUser = async (user: User): Promise<BaseUser> => {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error('Error creating the user');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating the user:', error);
        throw error;
    }
};

export const updateUser = async (id: number, user: User): Promise<BaseUser> => {
    try {
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error('Error updating the user');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating the user:', error);
        throw error;
    }
}

export const deleteUser = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/users/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error deleting the user');
        }
    } catch (error) {
        console.error('Error deleting the user:', error);
        throw error;
    }
}
