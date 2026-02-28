import React from "react";
import { View, Text } from "react-native";

export default function CheckoutItemsSection({ styles, items }) {
  return (
    <View style={styles.section}>
      {items.map((item) => {
        const price = Number(item.price) || 0;
        const qty = Number(item.quantity) || 0;
        const line = price * qty;

        return (
          <View key={String(item.id)} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQuantity}>
              {qty} x $ {price.toFixed(2)} = $ {line.toFixed(2)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
