import { buildOcrApiUrl } from "@/features/ocr/api/config";
import type { ApiEnvelope } from "@/features/ocr/api/types";

export type AuthUser = {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: string;
};

export type Credits = {
  balance: number;
};

export type ApiKeyRecord = {
  id: string;
  name: string;
  key_prefix: string | null;
  last_four: string | null;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
};

export type CreatedApiKey = ApiKeyRecord & {
  key: string;
};

const parseEnvelope = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json()) as ApiEnvelope<T>;
  if (!response.ok || !payload.success || payload.data == null) {
    throw new Error(payload.message || "Request failed.");
  }
  return payload.data;
};

const jsonRequest = async <T>(
  path: string,
  init: RequestInit,
  token?: string | null
): Promise<T> => {
  const url = buildOcrApiUrl(path);
  if (!url) throw new Error("API endpoint is not configured.");
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return parseEnvelope<T>(await fetch(url, { ...init, headers }));
};

export const loginWithPassword = (email: string, password: string) =>
  jsonRequest<{ access_token: string; token_type: string }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerWithPassword = async (email: string, password: string) => {
  await jsonRequest<AuthUser>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return loginWithPassword(email, password);
};

export const loginWithGoogleToken = (idToken: string) =>
  jsonRequest<{ access_token: string; token_type: string }>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ id_token: idToken }),
  });

export const getCurrentUser = (token: string) =>
  jsonRequest<AuthUser>("/api/v1/users/me", { method: "GET" }, token);

export const getCurrentCredits = (token: string) =>
  jsonRequest<Credits>("/api/v1/users/me/credits", { method: "GET" }, token);

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
};

export const listApiKeys = (token: string, page = 1, pageSize = 20) =>
  jsonRequest<Page<ApiKeyRecord>>(
    `/api/v1/api-keys?page=${page}&page_size=${pageSize}`,
    { method: "GET" },
    token
  );

export const createApiKey = (token: string, name: string) =>
  jsonRequest<CreatedApiKey>("/api/v1/api-keys", {
    method: "POST",
    body: JSON.stringify({ name }),
  }, token);

export const revokeApiKey = (token: string, id: string) =>
  jsonRequest<{ revoked: boolean }>(`/api/v1/api-keys/${id}`, {
    method: "DELETE",
  }, token);
