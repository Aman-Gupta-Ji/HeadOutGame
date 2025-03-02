// src/config/api.js
export const API_URL = process.env.REACT_APP_API_URL || 'https://globerotter-backend.onrender.com';

export const ENDPOINTS = {
  LOGIN: `${API_URL}/api/auth/login`,
  SIGNUP: `${API_URL}/api/auth/signup`,
  LOGOUT: `${API_URL}/api/auth/logout`,
  USER: `${API_URL}/api/user`,
  QUESTIONS: `${API_URL}/api/game/questions`,
  CHECK_ANSWERS: `${API_URL}/api/game/check-answers`,
  LEADERBOARD: `${API_URL}/api/leaderboard`,
  CHALLENGES: `${API_URL}/api/challenges`,
};