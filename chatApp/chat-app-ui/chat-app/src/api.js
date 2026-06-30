
// const base = require('./config.json')
import base from './config.json'
const BASE_URL = `${base.baseUrl}/api`

export const api = async (path, options = {}) => {
  const token = localStorage.getItem("chat_token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Only set JSON content type for non-FormData requests
  if (!options?.isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return res.json();
};