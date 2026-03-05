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
  Modal,
  Pressable,
} from "react-native";
import { apiFetch } from "../../api/apiFetch";

const PRIMARY = "#ff851b";

const STATUSES = [
  "PENDING",
  "PROCESSING",
  "DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "REJECTED",
];

const STATUS_STYLES = {
  PENDING: { bg: "#f0ad4e", text: "#fff" },
  PROCESSING: { bg: "#5bc0de", text: "#fff" },
  DELIVERY: { bg: "#6f42c1", text: "#fff" },
  DELIVERED: { bg: "#17a2b8", text: "#fff" },
  COMPLETED: { bg: "#28a745", text: "#fff" },
  REJECTED: { bg: "#dc3545", text: "#fff" },
};

function normalizeOrders(json) {
  if (Array.isArray(json)) return json;
  if (json && Array.isArray(json.orders)) return json.orders;
  if (json && Array.isArray(json.data)) return json.data;
  return [];
}

export default function AdminOrdersScreen({ route, navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // ✅ status filter from AdminHome (initialStatus)
  const [statusFilter, setStatusFilter] = useState(null);

  // ✅ status picker modal
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // ✅ whenever initialStatus changes, update filter
  useEffect(() => {
    const s = route?.params?.initialStatus;
    if (s) setStatusFilter(String(s).trim().toUpperCase());
    else setStatusFilter(null);
  }, [route?.params?.initialStatus]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");

      const qs = statusFilter
        ? `?status=${encodeURIComponent(statusFilter)}`
        : "";
      const json = await apiFetch(`/api/admin/orders${qs}`);
      const list = normalizeOrders(json);

      setOrders(list);
    } catch (e) {
      const msg = String(e?.message || e);
      setErr(msg);
      setOrders([]);
      Alert.alert("Admin Orders Error", msg);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

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

  const openPicker = useCallback((orderId) => {
    setSelectedOrderId(orderId);
    setPickerOpen(true);
  }, []);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    setSelectedOrderId(null);
  }, []);

  const onPickStatus = useCallback(
    async (status) => {
      const orderId = selectedOrderId;
      closePicker();
      if (!orderId) return;
      await changeStatus(orderId, status);
    },
    [selectedOrderId, changeStatus, closePicker],
  );

  const renderItem = useCallback(
    ({ item }) => {
      const st = STATUS_STYLES[item.status] || STATUS_STYLES.PENDING;

      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => openPicker(item.id)}
          activeOpacity={0.85}
        >
          <View style={styles.rowBetween}>
            <Text style={styles.title}>Order #{item.id}</Text>

            <View style={styles.rowRight}>
              <Text
                style={[
                  styles.status,
                  { backgroundColor: st.bg, color: st.text },
                ]}
              >
                {String(item.status || "-")}
              </Text>

              <TouchableOpacity
                style={styles.detailsBtn}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("AdminOrderDetails", {
                    orderId: item.id,
                  })
                }
              >
                <Text style={styles.detailsText}>Details</Text>
              </TouchableOpacity>
            </View>
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
      );
    },
    [openPicker],
  );

  const header = useMemo(
    () => (
      <View style={styles.topRow}>
        <View>
          <Text style={styles.screenTitle}>Admin Orders</Text>
          <Text style={styles.filterLine}>Filter: {statusFilter || "ALL"}</Text>
        </View>

        <TouchableOpacity style={styles.refreshBtn} onPress={load}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    ),
    [load, statusFilter],
  );

  return (
    <View style={styles.container}>
      {header}

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
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}

      {/* ✅ Status Picker Modal */}
      <Modal visible={pickerOpen} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={closePicker}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Change status</Text>
            <Text style={styles.sheetSub}>Order #{selectedOrderId || "-"}</Text>

            {STATUSES.map((s) => {
              const st = STATUS_STYLES[s] || STATUS_STYLES.PENDING;
              return (
                <TouchableOpacity
                  key={s}
                  style={styles.sheetItem}
                  activeOpacity={0.85}
                  onPress={() => onPickStatus(s)}
                >
                  <View style={[styles.dot, { backgroundColor: st.bg }]} />
                  <Text style={styles.sheetItemText}>{s}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.cancelBtn} onPress={closePicker}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
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
  filterLine: { marginTop: 4, color: "#666", fontSize: 12 },

  refreshBtn: {
    backgroundColor: PRIMARY,
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
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsBtn: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  detailsText: {
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY,
  },
  line: { marginBottom: 4, color: "#333" },
  date: { marginTop: 6, color: "#777", fontSize: 12 },
  hint: { marginTop: 8, color: "#999", fontSize: 12 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 18,
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  sheetTitle: { fontSize: 18, fontWeight: "bold" },
  sheetSub: { marginTop: 6, color: "#666", marginBottom: 12 },

  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  dot: { width: 10, height: 10, borderRadius: 999, marginRight: 10 },
  sheetItemText: { fontSize: 15, fontWeight: "600", color: "#222" },

  cancelBtn: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  cancelText: { fontWeight: "bold", color: "#333" },
});
