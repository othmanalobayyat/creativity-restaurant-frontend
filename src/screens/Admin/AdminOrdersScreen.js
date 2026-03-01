// src/screens/Admin/AdminOrdersScreen.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { apiFetch } from "../../api/apiFetch";

const STATUSES = ["PENDING", "PROCESSING", "REJECTED", "COMPLETED"];

function normalizeOrders(json) {
  // يقبل:
  // 1) Array مباشرة: [...]
  // 2) Object: { orders: [...] }
  // 3) Object: { data: [...] }
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.orders)) return json.orders;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
}

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");

      const json = await apiFetch("/api/admin/orders");
      const list = normalizeOrders(json);

      setOrders(list);
    } catch (e) {
      const msg = String(e?.message || e);
      setErr(msg);
      setOrders([]);
      // Alert اختياري — خليته بس للتنبيه
      Alert.alert("Admin Orders Error", msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changeStatus = useCallback(
    async (orderId, nextStatus) => {
      try {
        await apiFetch(
          `/api/admin/orders/${encodeURIComponent(orderId)}/status`,
          {
            method: "PUT",
            body: JSON.stringify({ status: nextStatus }),
          },
        );
        await load();
      } catch (e) {
        Alert.alert("Error", String(e?.message || e));
      }
    },
    [load],
  );

  const askChangeStatus = useCallback(
    (orderId) => {
      Alert.alert(
        "Change status",
        `Order #${orderId}`,
        [
          ...STATUSES.map((s) => ({
            text: s,
            onPress: () => changeStatus(orderId, s),
          })),
          { text: "Cancel", style: "cancel" },
        ],
        { cancelable: true },
      );
    },
    [changeStatus],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => askChangeStatus(item.id)}
        activeOpacity={0.85}
      >
        <View style={styles.rowBetween}>
          <Text style={styles.title}>Order #{item.id}</Text>
          <Text style={styles.status}>{String(item.status || "-")}</Text>
        </View>

        <Text style={styles.line}>User: {String(item.user_id ?? "-")}</Text>
        <Text style={styles.line}>
          Total: $ {Number(item.total || 0).toFixed(2)}
        </Text>
        <Text style={styles.line}>
          Address: {item.city || "-"}, {item.street || "-"}
        </Text>
        <Text style={styles.date}>{String(item.created_at || "")}</Text>
        <Text style={styles.hint}>Tap to change status</Text>
      </TouchableOpacity>
    ),
    [askChangeStatus],
  );

  const header = useMemo(
    () => (
      <View style={styles.topRow}>
        <Text style={styles.screenTitle}>Admin Orders</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={load}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    ),
    [load],
  );

  return (
    <View style={styles.container}>
      {header}

      {/* Debug صغير مفيد */}
      <Text style={styles.debug}>count: {orders.length}</Text>

      {loading ? (
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <ActivityIndicator size="large" />
          <Text style={styles.msg}>Loading...</Text>
        </View>
      ) : err ? (
        <Text style={[styles.msg, { color: "red" }]}>{err}</Text>
      ) : orders.length === 0 ? (
        <Text style={styles.msg}>No orders</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(x) => String(x.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  screenTitle: { fontSize: 20, fontWeight: "bold" },
  refreshBtn: {
    backgroundColor: "#ff851b",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refreshText: { color: "#fff", fontWeight: "bold" },
  msg: { textAlign: "center", marginTop: 12, color: "#666" },

  debug: { color: "#999", fontSize: 12, marginBottom: 8 },

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
  title: { fontSize: 16, fontWeight: "bold" },
  status: {
    backgroundColor: "#ff851b",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "bold",
  },
  line: { marginBottom: 4, color: "#333" },
  date: { marginTop: 6, color: "#777", fontSize: 12 },
  hint: { marginTop: 8, color: "#999", fontSize: 12 },
});
