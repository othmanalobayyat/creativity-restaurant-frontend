import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function CartItem({ styles, item, onDecrease, onIncrease }) {
  return (
    <View style={styles.product}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />

      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>$ {Number(item.price).toFixed(2)}</Text>
      </View>

      <View style={styles.itemQuantity}>
        <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantityText}>{item.quantity}</Text>

        <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
