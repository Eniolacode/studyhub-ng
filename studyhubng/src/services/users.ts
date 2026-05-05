import { fetchApi } from './api';

export const fetchUsers = async () => {
  return await fetchApi('/users');
}
