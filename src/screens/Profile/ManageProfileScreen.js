// src/screens/Profile/ManageProfileScreen.js
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { apiFetch } from "../../api/apiFetch";
import { loadProfileLocal, saveProfileLocal } from "./utils/profileStorage";

export default function ManageProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const applyProfile = useCallback((p) => {
    setFullName(p?.fullName || "");
    setPhone(p?.phone || "");
    setEmail(p?.email || "");
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      // 1) server
      const json = await apiFetch("/api/me");

      const p = {
        fullName: json.fullName || json.name || "",
        phone: json.phone || "",
        email: json.email || "",
      };

      applyProfile(p);
      await saveProfileLocal(p);
    } catch {
      // 2) local fallback
      const local = await loadProfileLocal();
      if (local) applyProfile(local);
    } finally {
      setLoading(false);
    }
  }, [applyProfile]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
    };

    if (!payload.fullName) {
      Alert.alert("Missing info", "Please enter your full name.");
      return;
    }
    if (
      payload.email &&
      (!payload.email.includes("@") || !payload.email.includes("."))
    ) {
      Alert.alert("Invalid email", "Please enter a valid email.");
      return;
    }

    try {
      setSaving(true);

      // server save
      await apiFetch("/api/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      await saveProfileLocal(payload);
      Alert.alert("Saved", "Profile updated successfully ✅");
      navigation.goBack();
    } catch (e) {
      // local fallback
      await saveProfileLocal(payload);
      Alert.alert(
        "Saved locally",
        "Server update failed, but profile saved on device ✅",
      );
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }, [fullName, phone, email, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Profile</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Your name"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        placeholder="05xxxxxxxx"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="name@email.com"
      />

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={save}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  label: { fontWeight: "bold", marginTop: 10, marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#ff851b",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
