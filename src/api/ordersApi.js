import { apiFetch } from "./apiFetch";

export function normalizeOrders(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.orders)) return json.orders;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
}

export async function fetchMyOrders() {
  const json = await apiFetch("/api/me/orders");
  return normalizeOrders(json);
}

export async function fetchAdminOrders({ status } = {}) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const json = await apiFetch(`/api/admin/orders${qs}`);
  return normalizeOrders(json);
}

export async function fetchOrderById(orderId) {
  return apiFetch(`/api/orders/${encodeURIComponent(orderId)}`);
}

export async function fetchAdminOrderById(orderId) {
  return apiFetch(`/api/admin/orders/${encodeURIComponent(orderId)}`);
}

export async function updateAdminOrderStatus(orderId, status) {
  return apiFetch(
    `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    },
  );
}

