import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { fetchAdminDashboard } from "../../api/adminApi";

const PRIMARY = "#ff851b";

export default function AdminDashboardScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const json = await fetchAdminDashboard();
      setData(json || null);
    } catch (e) {
      Alert.alert("Dashboard Error", String(e?.message || e));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totals = data?.totals || { totalOrders: 0, totalRevenue: 0 };
  const byStatus = data?.byStatus || {};
  const lastOrders = Array.isArray(data?.lastOrders) ? data.lastOrders : [];

  const cards = useMemo(
    () => [
      { label: "Total Orders", value: totals.totalOrders },
      {
        label: "Total Revenue",
        value: `$${Number(totals.totalRevenue || 0).toFixed(2)}`,
      },
      { label: "Pending", value: byStatus.PENDING || 0 },
      { label: "Processing", value: byStatus.PROCESSING || 0 },
      { label: "Completed", value: byStatus.COMPLETED || 0 },
      { label: "Rejected", value: byStatus.REJECTED || 0 },
    ],
    [totals, byStatus],
  );

  return (
    <View style={s.container}>
      <View style={s.topRow}>
        <Text style={s.title}>Admin Dashboard</Text>
        <TouchableOpacity style={s.refreshBtn} onPress={load}>
          <Text style={s.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" />
          <Text style={s.muted}>Loading...</Text>
        </View>
      ) : !data ? (
        <Text style={s.muted}>No data</Text>
      ) : (
        <>
          <View style={s.grid}>
            {cards.map((c) => (
              <View key={c.label} style={s.statCard}>
                <Text style={s.statLabel}>{c.label}</Text>
                <Text style={s.statValue}>{String(c.value)}</Text>
              </View>
            ))}
          </View>

          <Text style={s.section}>Last Orders</Text>

          {lastOrders.length === 0 ? (
            <Text style={s.muted}>No recent orders</Text>
          ) : (
            <FlatList
              data={lastOrders}
              keyExtractor={(x) => String(x.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={s.orderCard}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("AdminOrders")}
                >
                  <View style={s.orderRow}>
                    <Text style={s.orderTitle}>Order #{item.id}</Text>
                    <Text style={s.badge}>{item.status}</Text>
                  </View>
                  <Text style={s.orderSub}>
                    {item.fullName} • {item.email}
                  </Text>
                  <Text style={s.orderSub}>
                    ${Number(item.total || 0).toFixed(2)} • {item.city},{" "}
                    {item.street}
                  </Text>
                  <Text style={s.orderDate}>
                    {String(item.created_at || "")}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          )}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  refreshBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refreshText: { color: "#fff", fontWeight: "bold" },

  center: { alignItems: "center", marginTop: 16 },
  muted: { textAlign: "center", marginTop: 12, color: "#666" },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    marginBottom: 10,
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

  section: { fontSize: 16, fontWeight: "bold", marginTop: 8, marginBottom: 8 },

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
