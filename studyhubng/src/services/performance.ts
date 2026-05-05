import { fetchApi } from './api';

export const recordAttempt = async (questionId: string, passed: boolean) => {
  return fetchApi('/performance', {
    method: 'POST',
    body: JSON.stringify({ questionId, passed }),
  });
};

export const fetchDashboardStats = async () => {
  return fetchApi('/performance/dashboard');
};
