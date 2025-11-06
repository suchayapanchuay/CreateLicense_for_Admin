// // src/app/api.js
// import { API_BASE } from "../config";

// async function api(path, opts = {}) {
//   const res = await fetch(`${API_BASE}${path}`, {
//     headers: {
//       "Content-Type": "application/json",
//       ...(opts.headers || {}),
//     },
//     credentials: "include",
//     ...opts,
//   });
//   if (!res.ok) {
//     const msg = await res.text().catch(() => "");
//     throw new Error(msg || `HTTP ${res.status}`);
//   }
//   return res.status === 204 ? null : res.json();
// }

// // --- Admin API Key endpoints ---
// export const listApiKeys = () => api("/admin/api-keys");
// export const createApiKey = (payload) =>
//   api("/admin/api-keys", { method: "POST", body: JSON.stringify(payload) });
// export const revokeApiKey = (id) =>
//   api(`/admin/api-keys/${id}`, { method: "DELETE" });

// src/lib/api.js
// src/lib/api.js
import { API_BASE } from "../config";

/** low-level fetch helper */
async function api(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    credentials: "include",
    ...opts,
  });
  if (res.status === 204) return null;
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

/* ---------------- Activity Logs ---------------- */
export function listActivityLogs({ user, action, since } = {}) {
  const params = new URLSearchParams();
  if (user) params.set("user", user);
  if (action) params.set("action", action);
  if (since) params.set("since", since);
  const qs = params.toString();
  return api(`/admin/activity-logs${qs ? `?${qs}` : ""}`);
}

/* ---------------- API Keys ---------------- */
export function listApiKeys({ q, status, scope, page = 1, page_size = 50 } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (scope) params.set("scope", scope);
  params.set("page", String(page));
  params.set("page_size", String(page_size));
  const qs = params.toString();
  return api(`/admin/api-keys?${qs}`);
}

export function createApiKey(payload) {
  return api(`/admin/api-keys`, { method: "POST", body: JSON.stringify(payload) });
}

export async function revokeApiKey(id) {
  try {
    return await api(`/admin/api-keys/${id}/revoke`, { method: "POST" });
  } catch {
    // fallback ถ้า backend ใช้ DELETE แทน revoke
    return api(`/admin/api-keys/${id}`, { method: "DELETE" });
  }
}

export function deleteApiKey(id) {
  // ลบจริงถาวร (แยกจาก revoke)
  return api(`/admin/api-keys/${id}`, { method: "DELETE" });
}
