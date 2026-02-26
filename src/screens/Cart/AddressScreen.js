import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function AddressScreen({ navigation }) {
  const [city, setCity] = useState("Bethlehem");
  const [street, setStreet] = useState("Wadshaheen st.");

  const save = () => {
    // لاحقاً: تخزينها AsyncStorage أو Context
    Alert.alert("Saved", "Address updated (temporary).");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>City</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <Text style={styles.label}>Street</Text>
      <TextInput style={styles.input} value={street} onChangeText={setStreet} />

      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save Address</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: "bold", marginTop: 12, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 },
  button: {
    marginTop: 20,
    backgroundColor: "#ff851b",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
