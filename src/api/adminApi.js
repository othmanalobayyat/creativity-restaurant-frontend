import { apiFetch } from "./apiFetch";

// Dashboard
export const fetchAdminDashboard = () => apiFetch("/api/admin/dashboard");

// Categories
export const fetchAdminCategories = (q = "") =>
  apiFetch(`/api/admin/categories${q ? `?q=${encodeURIComponent(q)}` : ""}`);

export const createAdminCategory = (body) =>
  apiFetch("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateAdminCategory = (id, body) =>
  apiFetch(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteAdminCategory = (id) =>
  apiFetch(`/api/admin/categories/${id}`, { method: "DELETE" });

// Products
export const fetchAdminProducts = ({
  q = "",
  categoryId = "",
  limit = 50,
  offset = 0,
} = {}) => {
  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (categoryId) params.append("categoryId", categoryId);
  params.append("limit", String(limit));
  params.append("offset", String(offset));
  return apiFetch(`/api/admin/products?${params.toString()}`);
};

export const createAdminProduct = (body) =>
  apiFetch("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateAdminProduct = (id, body) =>
  apiFetch(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteAdminProduct = (id) =>
  apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });

// Cloudinary upload
export const uploadAdminImage = (base64) =>
  apiFetch("/api/admin/upload", {
    method: "POST",
    body: JSON.stringify({ base64 }),
  });

// item active toggle
export const setAdminProductActive = (id, is_active) =>
  apiFetch(`/api/admin/products/${id}/toggle-active`, {
    method: "PUT",
    body: JSON.stringify({ is_active }),
  });
