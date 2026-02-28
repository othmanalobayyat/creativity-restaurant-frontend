import React from "react";
import { View, Text } from "react-native";

export default function CheckoutSummary({ styles, totalPrice }) {
  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Item Total</Text>
        <Text style={styles.summaryText}>$ {totalPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Discount</Text>
        <Text style={styles.summaryText}>$ 0.00</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>Delivery Fee</Text>
        <Text style={styles.freeText}>Free</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalText}>$ {totalPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
}
