// src/screens/Profile/AllMyOrdersScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { apiFetch } from "../../api/apiFetch";

const STATUS_STYLES = {
  PENDING: { bg: "#f0ad4e", text: "#fff" },
  PROCESSING: { bg: "#5bc0de", text: "#fff" },
  DELIVERY: { bg: "#6f42c1", text: "#fff" },
  DELIVERED: { bg: "#17a2b8", text: "#fff" },
  COMPLETED: { bg: "#28a745", text: "#fff" },
  REJECTED: { bg: "#dc3545", text: "#fff" },
};

export default function AllMyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const json = await apiFetch("/api/me/orders");

      const list = Array.isArray(json)
        ? json
        : Array.isArray(json?.orders)
          ? json.orders
          : [];

      setOrders(list);
    } catch (e) {
      console.log("Orders load error:", e?.message || e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const renderItem = ({ item }) => {
    const st = STATUS_STYLES[item.status] || STATUS_STYLES.PENDING;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("OrderDetails", { orderId: item.id })
        }
      >
        <View style={styles.rowBetween}>
          <Text style={styles.orderTitle}>Order #{item.id}</Text>

          <Text
            style={[styles.status, { backgroundColor: st.bg, color: st.text }]}
          >
            {String(item.status || "-")}
          </Text>
        </View>

        <Text style={styles.line}>
          Total: $ {Number(item.total || 0).toFixed(2)}
        </Text>

        <Text style={styles.line}>
          Address: {item.city || "-"}, {item.street || "-"}
        </Text>

        <Text style={styles.date}>{String(item.created_at || "")}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All My Orders</Text>

      {loading ? (
        <Text style={styles.msg}>Loading...</Text>
      ) : orders.length === 0 ? (
        <Text style={styles.msg}>No orders yet</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.refreshBtn}
        onPress={loadOrders}
        activeOpacity={0.9}
      >
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  msg: { textAlign: "center", marginTop: 30, color: "#666" },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  orderTitle: { fontSize: 16, fontWeight: "bold" },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "bold",
  },

  line: { marginBottom: 4, color: "#333" },
  date: { marginTop: 6, color: "#777", fontSize: 12 },

  refreshBtn: {
    marginTop: 10,
    alignSelf: "center",
    backgroundColor: "#ff851b",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  refreshText: { color: "#fff", fontWeight: "bold" },
});
