import { fetchApi, setAuthToken } from './api';

export const registerUser = async (fullName: string, email: string, password: string, role: string) => {
  const data = await fetchApi('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: fullName, email, password, role }),
  });
  
  if (data?.token) {
    setAuthToken(data.token);
  }
  return data;
}

export const loginUser = async (email: string, password: string) => {
  const data = await fetchApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data?.token) {
    setAuthToken(data.token);
  }
  return data;
}
