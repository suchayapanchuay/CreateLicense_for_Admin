// src/app/config.js
const ORIGIN =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_BASE) ||
  "http://127.0.0.1:8000";

// ให้ลงท้ายด้วย /api เสมอ (กันพลาด)
export const API_BASE = ORIGIN.endsWith("/api") ? ORIGIN : `${ORIGIN}/api`;
