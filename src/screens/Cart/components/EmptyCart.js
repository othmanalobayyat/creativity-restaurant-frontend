import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function EmptyCart({ styles, onGoHome }) {
  return (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../assets/empty-cart.png")}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubText}>
        Add some tasty items from the menu 🍔🍕
      </Text>

      <TouchableOpacity style={styles.emptyBtn} onPress={onGoHome}>
        <Text style={styles.emptyBtnText}>Browse menu</Text>
      </TouchableOpacity>
    </View>
  );
}
