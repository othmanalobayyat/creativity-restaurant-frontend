// src/screens/Profile/OrderDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { BASE_URL } from "../../config/api";
import { apiFetch } from "../../utils/apiFetch";

export default function OrderDetailsScreen({ route }) {
  const orderId = route.params?.orderId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!orderId) return;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // ✅ الصح: تفاصيل الطلب
        const res = await apiFetch(`${BASE_URL}/api/orders/${orderId}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error || "Failed to load order");

        // المتوقع: { order: {...}, items: [...] }
        setData(json);
      } catch (e) {
        setErr(String(e.message || e));
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (!orderId) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Missing orderId</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{err}</Text>
      </View>
    );
  }

  if (!data?.order) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Order not found</Text>
      </View>
    );
  }

  const { order, items } = data;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order #{order.id}</Text>

      <View style={styles.metaBox}>
        <Text style={styles.meta}>Status: {String(order.status || "-")}</Text>
        <Text style={styles.meta}>
          Total: $ {Number(order.total || 0).toFixed(2)}
        </Text>
        <Text style={styles.meta}>
          Address: {order.city || "-"}, {order.street || "-"}
        </Text>
        <Text style={styles.meta}>
          Date: {String(order.created_at || order.createdAt || "-")}
        </Text>
      </View>

      <Text style={styles.sub}>Items</Text>

      <FlatList
        data={Array.isArray(items) ? items : []}
        keyExtractor={(x, idx) => String(x.item_id ?? x.id ?? idx)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const img = item.image_url || item.image || "";
          const name = item.name || "Item";
          const qty = Number(item.quantity || 0);
          const price = Number(item.price || 0);

          return (
            <View style={styles.row}>
              {img ? (
                <Image source={{ uri: img }} style={styles.img} />
              ) : (
                <View style={styles.imgPlaceholder} />
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.small}>
                  {qty} x $ {price.toFixed(2)}
                </Text>
              </View>

              <Text style={styles.lineTotal}>$ {(qty * price).toFixed(2)}</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No items</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  error: { color: "red", textAlign: "center" },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  metaBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  meta: { marginBottom: 4, color: "#444" },

  sub: { marginTop: 14, marginBottom: 8, fontWeight: "bold", fontSize: 16 },

  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },
  img: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  imgPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: "#ddd",
  },

  name: { fontWeight: "bold" },
  small: { color: "#666", marginTop: 4 },

  lineTotal: { fontWeight: "bold", marginLeft: 8 },
  empty: { textAlign: "center", color: "#666", marginTop: 20 },
});
