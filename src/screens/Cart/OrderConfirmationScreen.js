import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function OrderConfirmationScreen({ route, navigation }) {
  const total = Number(route.params?.total || 0);
  const itemsCount = Number(route.params?.itemsCount || 0);

  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={90} color="#ff851b" />
      <Text style={styles.title}>Order Confirmed!</Text>
      <Text style={styles.subtitle}>
        {itemsCount} item(s) • Total: $ {total.toFixed(2)}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("HomeTab")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={() => navigation.navigate("AllMyOrders")}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>
          View Orders
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: { fontSize: 26, fontWeight: "bold", marginTop: 16 },
  subtitle: { fontSize: 16, color: "#666", marginTop: 8, marginBottom: 24 },
  button: {
    backgroundColor: "#ff851b",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  secondary: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ff851b",
  },
  secondaryText: { color: "#ff851b" },
});
