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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
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

      const json = await apiFetch("/api/me");

      const p = {
        fullName: json.fullName || json.name || "",
        phone: json.phone || "",
        email: json.email || "",
      };

      applyProfile(p);
      await saveProfileLocal(p);
    } catch {
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

      await apiFetch("/api/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      await saveProfileLocal(payload);
      Alert.alert("Saved", "Profile updated successfully.");
      navigation.goBack();
    } catch (e) {
      await saveProfileLocal(payload);
      Alert.alert(
        "Saved locally",
        "Server update failed, but profile was saved on this device.",
      );
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }, [fullName, phone, email, navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff851b" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Icon name="person" size={40} color="#ff851b" />
        </View>

        <Text style={styles.title}>Personal Information</Text>
        <Text style={styles.subtitle}>Update your profile details</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Enter your phone number"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={save}
          disabled={saving}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 32,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 15,
  },
  iconWrapper: {
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#222",
    marginBottom: 10,
  },
  button: {
    marginTop: 24,
    backgroundColor: "#ff851b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
