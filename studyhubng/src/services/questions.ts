import { Question } from '../types';
import { fetchApi } from './api';

export const fetchQuestions = async (): Promise<Question[]> => {
  return fetchApi('/questions');
};

export const createQuestion = async (question: Question): Promise<Question> => {
  return fetchApi('/questions', {
    method: 'POST',
    body: JSON.stringify(question),
  });
};

export const updateQuestion = async (id: string, question: Question): Promise<Question> => {
  return fetchApi(`/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(question),
  });
};

export const deleteQuestion = async (id: string): Promise<void> => {
  return fetchApi(`/questions/${id}`, {
    method: 'DELETE',
  });
};

export const bulkUploadQuestions = async (questions: Question[]): Promise<Question[]> => {
  return fetchApi('/questions/bulk', {
    method: 'POST',
    body: JSON.stringify(questions),
  });
};
