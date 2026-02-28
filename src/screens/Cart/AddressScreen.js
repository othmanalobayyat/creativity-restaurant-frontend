import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { StyleSheet, Alert } from "react-native";
import { apiFetch } from "../../api/apiFetch";
import AddressForm from "./components/AddressForm";

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
      const json = await apiFetch("/api/me/address");
      setCity(json?.city || "");
      setStreet(json?.street || "");
    } catch (e) {
      Alert.alert("Error", String(e.message || e));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    try {
      setLoading(true);
      await apiFetch("/api/me/address", {
        method: "PUT",
        body: JSON.stringify({ city, street }),
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", String(e.message || e));
    } finally {
      setLoading(false);
    }
  }, [city, street, navigation]);

  return (
    <AddressForm
      styles={styles}
      city={city}
      street={street}
      onChangeCity={setCity}
      onChangeStreet={setStreet}
      onSave={save}
      loading={loading}
    />
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
