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
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "../../api/ordersApi";

import { colors, spacing, radii } from "../../theme";
import OrderStatusBadge, {
  getOrderStatusStyle,
} from "../../components/OrderStatusBadge";

const STATUSES = [
  "PENDING",
  "PROCESSING",
  "DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "REJECTED",
];

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

      const list = await fetchAdminOrders({ status: statusFilter });
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
        await updateAdminOrderStatus(orderId, nextStatus);
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
      return (
        <TouchableOpacity
          style={styles.card}
          onPress={() => openPicker(item.id)}
          activeOpacity={0.85}
        >
          <View style={styles.rowBetween}>
            <Text style={styles.title}>Order #{item.id}</Text>

            <View style={styles.rowRight}>
              <OrderStatusBadge status={item.status} style={styles.status} />

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

          <Text style={styles.line}>User: {item.userFullName || "-"}</Text>

          <Text style={[styles.line, { color: "#666", fontSize: 12 }]}>
            {item.userEmail || "-"}
            {item.userPhone ? ` • ${item.userPhone}` : ""}
          </Text>

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
              const st = getOrderStatusStyle(s);
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
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.screenBg },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  screenTitle: { fontSize: 20, fontWeight: "bold" },
  filterLine: { marginTop: 4, color: "#666", fontSize: 12 },

  refreshBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.sm,
  },
  refreshText: { color: colors.white, fontWeight: "bold" },

  msg: { textAlign: "center", marginTop: 12, color: colors.muted },
  card: {
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: radii.md,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fafafa",
  },
  detailsText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },
  line: { marginBottom: 4, color: "#333" },
  date: { marginTop: 6, color: "#777", fontSize: 12 },
  hint: { marginTop: 8, color: colors.faint, fontSize: 12 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 18,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetTitle: { fontSize: 18, fontWeight: "bold" },
  sheetSub: { marginTop: 6, color: colors.muted, marginBottom: 12 },

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
    borderRadius: radii.md,
    backgroundColor: "#f5f5f5",
  },
  cancelText: { fontWeight: "bold", color: "#333" },
});
