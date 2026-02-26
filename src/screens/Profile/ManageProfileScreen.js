import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "APP_PROFILE";

export default function ManageProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setFullName(p?.fullName || "");
        setPhone(p?.phone || "");
        setEmail(p?.email || "");
      }
    })();
  }, []);

  const save = useCallback(async () => {
    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    };

    if (!payload.fullName) {
      Alert.alert("Missing info", "Please enter your full name.");
      return;
    }

    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
    Alert.alert("Saved", "Profile updated successfully.");
    navigation.goBack();
  }, [fullName, phone, email, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Profile</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 6 },
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
