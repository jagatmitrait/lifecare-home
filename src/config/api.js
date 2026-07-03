/**
 * API base URL for production (Render) vs local dev (Vite proxy).
 * Set VITE_API_URL on Vercel, e.g. https://lifecare-api.onrender.com/api
 */
const raw = import.meta.env.VITE_API_URL || '/api';

export const API_BASE = raw.replace(/\/$/, '');
