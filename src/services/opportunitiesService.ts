import { Opportunity } from '../models/Opportunity';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const fetchOpportunities = async (): Promise<Opportunity[]> => {
    try {
        const response = await fetch(`${BASE_URL}/opportunities`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error getting the opportunities');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting the opportunities', error);
        throw error;
    }
};

export const fetchOpportunity = async (id: number): Promise<Opportunity> => {
    try {
        const response = await fetch(`${BASE_URL}/opportunities/${id}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Error getting the opportunity');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error getting the opportunity', error);
        throw error;
    }
};

export const createOpportunity = async (opportunity: Opportunity): Promise<Opportunity> => {
    try {
        const response = await fetch(`${BASE_URL}/opportunities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opportunity)
        });

        if (!response.ok) {
            throw new Error('Error creating the opportunity');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating the opportunity:', error);
        throw error;
    }
};

export const updateOpportunity = async (id: number, opportunity: Opportunity): Promise<Opportunity> => {
    try {
        const response = await fetch(`${BASE_URL}/opportunities/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(opportunity)
        });

        if (!response.ok) {
            throw new Error('Error updating the opportunity');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating the opportunity:', error);
        throw error;
    }
}

export const deleteOpportunity = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}/opportunities/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error deleting the opportunity');
        }
    } catch (error) {
        console.error('Error deleting the opportunity:', error);
        throw error;
    }
}
