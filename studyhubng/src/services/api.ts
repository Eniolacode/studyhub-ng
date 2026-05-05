export const API_URL = 'http://localhost:5001/api';

export const getAuthToken = () => localStorage.getItem('studyhub_token');

export const setAuthToken = (token: string) => {
  if (token) {
    localStorage.setItem('studyhub_token', token);
  } else {
    localStorage.removeItem('studyhub_token');
  }
};

const defaultHeaders = () => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders(),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      // Auto logout if unauthorized (token expired, etc)
      setAuthToken('');
      window.dispatchEvent(new Event('auth_unauthorized'));
    }
    throw new Error(data?.message || 'API request failed');
  }

  return data;
};
