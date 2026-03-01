// src/screens/Admin/AdminHomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const PRIMARY = "#ff851b";

export default function AdminHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.sub}>Manage your restaurant content بسهولة ✅</Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminProducts")}
        activeOpacity={0.9}
      >
        <Text style={styles.cardTitle}>🛍 Manage Products</Text>
        <Text style={styles.cardSub}>Add / Edit / Delete products</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminCategories")}
        activeOpacity={0.9}
      >
        <Text style={styles.cardTitle}>🗂 Manage Categories</Text>
        <Text style={styles.cardSub}>Add / Edit / Delete categories</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminOrders")}
        activeOpacity={0.9}
      >
        <Text style={styles.cardTitle}>📦 Manage Orders</Text>
        <Text style={styles.cardSub}>View & update order status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  title: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  sub: { color: "#666", marginTop: 6, marginBottom: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: PRIMARY },
  cardSub: { marginTop: 6, color: "#666" },
});
