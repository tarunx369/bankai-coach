import { auth } from '../firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, { method = 'GET', body } = {}) {
  const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  generateLesson: (payload) => request('/lessons/generate', { method: 'POST', body: payload }),
  generateMockTest: (payload) => request('/tests/generate', { method: 'POST', body: payload }),
  evaluateAnswer: (payload) => request('/tests/evaluate', { method: 'POST', body: payload }),
  generateFlashcards: (payload) => request('/flashcards/generate', { method: 'POST', body: payload }),
  askDoubt: (payload) => request('/doubt/ask', { method: 'POST', body: payload }),
  getCurrentAffairs: (date) => request(`/current-affairs?date=${date}`),
  generateRevisionQuiz: (payload) => request('/tests/revision-quiz', { method: 'POST', body: payload }),
};
