// src/screens/Cart/AddressScreen.js
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BASE_URL } from "../../config/api";
import { apiFetch } from "../../utils/apiFetch";

export default function AddressScreen({ navigation }) {
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Address",
      headerBackTitleVisible: false,
      headerTintColor: "#fff",
      headerStyle: { backgroundColor: "#ff851b" },
      headerTitleStyle: { fontWeight: "900" },
    });
  }, [navigation]);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(`${BASE_URL}/api/me/address`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to load address");
      setCity(json.city || "");
      setStreet(json.street || "");
    } catch (e) {
      Alert.alert("Error", String(e.message || e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    try {
      setLoading(true);

      const res = await apiFetch(`${BASE_URL}/api/me/address`, {
        method: "PUT",
        body: JSON.stringify({ city, street }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save address");

      // ✅ رجّع المستخدم فورًا، والـ Checkout رح يعمل reload بسبب useFocusEffect
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>City</Text>
      <TextInput style={styles.input} value={city} onChangeText={setCity} />

      <Text style={styles.label}>Street</Text>
      <TextInput style={styles.input} value={street} onChangeText={setStreet} />

      <TouchableOpacity style={styles.button} onPress={save} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Save Address"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fafafa" },
  label: { fontWeight: "900", marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ff851b",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "900" },
});
