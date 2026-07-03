import axios, { AxiosError } from "axios";
import type {
  FileRecord,
  GenerationResponse,
  KeywordResult,
  SocialResult,
  SummaryResult,
  TitleResult,
  TokenResponse,
  UserResponse,
} from "../types/api";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const TOKEN_STORAGE_KEY = "aica_access_token";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** The backend issues a single 30-minute access token with no refresh endpoint,
 * so a 401 here always means the session is over — clear it and let the UI react. */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("aica:session-expired"));
    }
    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: string | { msg: string }[] } | undefined)?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    if (error.message === "Network Error") return "Can't reach the API server. Is the backend running?";
  }
  return fallback;
}

// ---------- Auth ----------

export async function registerUser(name: string, email: string, password: string) {
  const { data } = await api.post("/auth/register", { name, email, passward: password });
  return data as { success: boolean; message: string };
}

export async function loginUser(email: string, password: string) {
  const { data } = await api.post<TokenResponse>("/auth/login", { email, passward: password });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<UserResponse>("/users/me");
  return data;
}

// ---------- Files ----------

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<FileRecord>("/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function listFiles() {
  const { data } = await api.get<{ files: FileRecord[] }>("/files");
  return data.files;
}

export async function extractFileText(fileId: number) {
  const { data } = await api.get<{ text: string }>(`/files/${fileId}/extract`);
  return data.text;
}

export async function deleteFile(fileId: number) {
  const { data } = await api.delete(`/files/${fileId}`);
  return data;
}

// ---------- AI Generation ----------

export async function generateSummary(text: string) {
  const { data } = await api.post<SummaryResult>("/generate/summary", { text });
  return data;
}

export async function generateTitles(text: string) {
  const { data } = await api.post<TitleResult>("/generate/title", { text });
  return data;
}

export async function generateKeywords(text: string) {
  const { data } = await api.post<KeywordResult>("/generate/keywords", { text });
  return data;
}

export async function generateSocialPosts(text: string) {
  const { data } = await api.post<SocialResult>("/generate/social", { text });
  return data;
}

// ---------- History ----------

export async function getHistory() {
  const { data } = await api.get<GenerationResponse[]>("/history");
  return data;
}

export async function getHistoryItem(id: number) {
  const { data } = await api.get<GenerationResponse>(`/history/${id}`);
  return data;
}

export async function deleteHistoryItem(id: number) {
  const { data } = await api.delete(`/history/${id}`);
  return data;
}
