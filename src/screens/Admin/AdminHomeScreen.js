import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchAdminDashboard } from "../../api/adminApi";

const PRIMARY = "#ff851b";

export default function AdminHomeScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const json = await fetchAdminDashboard();
      setData(json || null);
    } catch (e) {
      Alert.alert("Dashboard Error", String(e?.message || e));
      setData(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load();
      setLoading(false);
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const totals = data?.totals || { totalOrders: 0, totalRevenue: 0 };
  const byStatus = data?.byStatus || {
    PENDING: 0,
    PROCESSING: 0,
    COMPLETED: 0,
    REJECTED: 0,
  };
  const lastOrders = Array.isArray(data?.lastOrders) ? data.lastOrders : [];

  // Cards: نخليها قابلة للضغط وتوديك على Orders بفلتر
  const statCards = useMemo(
    () => [
      {
        label: "Total Orders",
        value: totals.totalOrders,
        onPress: () => navigation.navigate("AdminOrders"),
      },
      {
        label: "Total Revenue",
        value: `$${Number(totals.totalRevenue || 0).toFixed(2)}`,
        onPress: () => navigation.navigate("AdminOrders"),
      },
      {
        label: "Pending",
        value: byStatus.PENDING || 0,
        onPress: () =>
          navigation.navigate("AdminOrders", { initialStatus: "PENDING" }),
      },
      {
        label: "Processing",
        value: byStatus.PROCESSING || 0,
        onPress: () =>
          navigation.navigate("AdminOrders", { initialStatus: "PROCESSING" }),
      },
      {
        label: "Completed",
        value: byStatus.COMPLETED || 0,
        onPress: () =>
          navigation.navigate("AdminOrders", { initialStatus: "COMPLETED" }),
      },
      {
        label: "Rejected",
        value: byStatus.REJECTED || 0,
        onPress: () =>
          navigation.navigate("AdminOrders", { initialStatus: "REJECTED" }),
      },
    ],
    [totals, byStatus, navigation],
  );
  const formatIsoLocal = (raw) => {
    if (!raw) return "-";
    const d = new Date(raw);

    // نحول للوقت المحلي بدون ما نغير الشكل
    const offset = d.getTimezoneOffset() * 60000;
    const local = new Date(d.getTime() - offset);

    return local.toISOString().replace("Z", "");
  };

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingBottom: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={s.topRow}>
        <View>
          <Text style={s.title}>Admin Control Center</Text>
          <Text style={s.sub}>Everything you need in one place ✅</Text>
        </View>

        <TouchableOpacity
          style={s.refreshBtn}
          onPress={onRefresh}
          activeOpacity={0.9}
        >
          <Text style={s.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* STATS */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" />
          <Text style={s.muted}>Loading dashboard...</Text>
        </View>
      ) : !data ? (
        <View style={s.emptyBox}>
          <Text style={s.emptyTitle}>No data yet</Text>
          <Text style={s.muted}>Try refresh, or create some orders.</Text>
        </View>
      ) : (
        <View style={s.grid}>
          {statCards.map((c) => (
            <TouchableOpacity
              key={c.label}
              style={s.statCard}
              onPress={c.onPress}
              activeOpacity={0.85}
            >
              <Text style={s.statLabel}>{c.label}</Text>
              <Text style={s.statValue}>{String(c.value)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* QUICK ACTIONS */}
      <Text style={s.section}>Quick Actions</Text>

      <TouchableOpacity
        style={s.actionCard}
        onPress={() => navigation.navigate("AdminProducts")}
        activeOpacity={0.9}
      >
        <View style={s.actionRow}>
          <Icon name="shopping-bag" size={20} color={PRIMARY} />
          <Text style={s.actionTitle}>Products</Text>
        </View>
        <Text style={s.actionSub}>Add / Edit / Disable products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.actionCard}
        onPress={() => navigation.navigate("AdminCategories")}
        activeOpacity={0.9}
      >
        <View style={s.actionRow}>
          <Icon name="tags" size={20} color={PRIMARY} />
          <Text style={s.actionTitle}>Categories</Text>
        </View>
        <Text style={s.actionSub}>Create & organize categories</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.actionCard}
        onPress={() => navigation.navigate("AdminOrders")}
        activeOpacity={0.9}
      >
        <View style={s.actionRow}>
          <Icon name="shopping-cart" size={20} color={PRIMARY} />
          <Text style={s.actionTitle}>Orders</Text>
        </View>
        <Text style={s.actionSub}>View & update order status</Text>
      </TouchableOpacity>

      {/* LAST ORDERS */}
      <View style={s.lastHeader}>
        <Text style={s.section}>Last Orders</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AdminOrders")}
          activeOpacity={0.85}
        >
          <Text style={s.link}>See all</Text>
        </TouchableOpacity>
      </View>

      {!loading && data && lastOrders.length === 0 ? (
        <Text style={s.muted}>No recent orders</Text>
      ) : (
        lastOrders.slice(0, 6).map((o) => (
          <TouchableOpacity
            key={String(o.id)}
            style={s.orderCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("AdminOrders")}
          >
            <View style={s.orderRow}>
              <Text style={s.orderTitle}>Order #{o.id}</Text>
              <Text style={s.badge}>{o.status}</Text>
            </View>

            <Text style={s.orderSub}>
              {o.fullName} • {o.email}
            </Text>

            <Text style={s.orderSub}>
              ${Number(o.total || 0).toFixed(2)} • {o.city}, {o.street}
            </Text>

            <Text style={s.orderDate}>
              {formatIsoLocal(o.created_at || o.createdAt)}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 22, fontWeight: "bold" },
  sub: { color: "#666", marginTop: 6 },

  refreshBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refreshText: { color: "#fff", fontWeight: "bold" },

  center: { alignItems: "center", marginTop: 16 },
  muted: { textAlign: "center", marginTop: 10, color: "#666" },

  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginTop: 12,
  },
  emptyTitle: { fontSize: 16, fontWeight: "bold" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 14,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  statLabel: { color: "#666", marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: "bold" },

  section: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },

  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  actionTitle: { fontSize: 18, fontWeight: "bold", color: PRIMARY },
  actionSub: { marginTop: 6, color: "#666" },

  lastHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  link: { color: PRIMARY, fontWeight: "bold" },

  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderTitle: { fontSize: 16, fontWeight: "bold" },
  badge: {
    backgroundColor: PRIMARY,
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "bold",
  },
  orderSub: { marginTop: 6, color: "#444" },
  orderDate: { marginTop: 8, color: "#777", fontSize: 12 },
});
