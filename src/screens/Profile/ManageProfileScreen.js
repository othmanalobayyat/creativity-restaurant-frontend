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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config/api";
import { apiFetch } from "../../utils/apiFetch";

const PROFILE_KEY = "APP_PROFILE";

export default function ManageProfileScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadLocal = useCallback(async () => {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      setFullName(p?.fullName || "");
      setPhone(p?.phone || "");
      setEmail(p?.email || "");
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) حاول من السيرفر
        const res = await apiFetch(`${BASE_URL}/api/me`);
        const json = await res.json();

        if (res.ok && json) {
          setFullName(json.fullName || json.name || "");
          setPhone(json.phone || "");
          setEmail(json.email || "");

          // خزن نسخة احتياط محلياً
          await AsyncStorage.setItem(
            PROFILE_KEY,
            JSON.stringify({
              fullName: json.fullName || json.name || "",
              phone: json.phone || "",
              email: json.email || "",
            }),
          );
        } else {
          // 2) لو فشل: استخدم المحلي
          await loadLocal();
        }
      } catch {
        await loadLocal();
      } finally {
        setLoading(false);
      }
    })();
  }, [loadLocal]);

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

      // 1) جرّب حفظ على السيرفر
      const res = await apiFetch(`${BASE_URL}/api/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to save profile");

      // 2) خزّن محلياً (backup)
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

      Alert.alert("Saved", "Profile updated successfully ✅");
      navigation.goBack();
    } catch (e) {
      // حتى لو السيرفر فشل، خلّيه يشتغل محلياً
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
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
