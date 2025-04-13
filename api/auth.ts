import client from './client';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export const register = async (data: RegisterData) => {
  try {
    const response = await client.post('/auth/register', data);
    console.log(response.data);
  } catch (error) {
    throw error;
  }
}; 