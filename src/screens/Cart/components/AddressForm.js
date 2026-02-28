import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function AddressForm({
  styles,
  city,
  street,
  onChangeCity,
  onChangeStreet,
  onSave,
  loading,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={onChangeCity}
      />

      <Text style={styles.label}>Street</Text>
      <TextInput
        style={styles.input}
        value={street}
        onChangeText={onChangeStreet}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={onSave}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Save Address"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
