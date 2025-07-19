import axios from "axios";

export const API_BASE_URL = "http://127.0.0.1:8000/api";

export const authAxios = axios.create({
  baseURL: API_BASE_URL,
});

authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
