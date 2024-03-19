const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

interface User {
  id: number;
  username: string;
  role: string;
  is_active?: number;
}

interface ResponseLogin {
  message: string;
  token: string;
  user: User;
}

export const loginService = async (username: string, password: string): Promise<ResponseLogin> => {
  try {
    const url = `${BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

