import React from "react";
import { TouchableOpacity, Text } from "react-native";

export default function CheckoutConfirmButton({ styles, onPress }) {
  return (
    <TouchableOpacity style={styles.confirmButton} onPress={onPress}>
      <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
    </TouchableOpacity>
  );
}
