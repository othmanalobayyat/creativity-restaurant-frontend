import React from "react";
import { Text, StyleSheet } from "react-native";

const ORDER_STATUS_STYLES = {
  PENDING: { bg: "#f0ad4e", text: "#fff" },
  PROCESSING: { bg: "#5bc0de", text: "#fff" },
  DELIVERY: { bg: "#6f42c1", text: "#fff" },
  DELIVERED: { bg: "#17a2b8", text: "#fff" },
  COMPLETED: { bg: "#28a745", text: "#fff" },
  REJECTED: { bg: "#dc3545", text: "#fff" },
};

export function getOrderStatusStyle(status) {
  const key = String(status || "")
    .trim()
    .toUpperCase();
  return ORDER_STATUS_STYLES[key] || ORDER_STATUS_STYLES.PENDING;
}

export default function OrderStatusBadge({ status, style }) {
  const st = getOrderStatusStyle(status);
  const label = String(status || "-");

  return (
    <Text style={[styles.badge, { backgroundColor: st.bg, color: st.text }, style]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "bold",
  },
});

