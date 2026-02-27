import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import AppHeader from "../../components/AppHeader";
import { BASE_URL } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { login } = useAuth();

  const onRegister = useCallback(async () => {
    const n = fullName.trim();
    const e = email.trim().toLowerCase();
    const ph = phone.trim();

    if (!n || !e || !password || !confirm)
      return Alert.alert("Missing info", "Please fill all fields.");
    if (!e.includes("@") || !e.includes("."))
      return Alert.alert("Invalid email", "Please enter a valid email.");
    if (password.length < 6)
      return Alert.alert(
        "Weak password",
        "Password must be at least 6 characters.",
      );
    if (password !== confirm)
      return Alert.alert("Mismatch", "Passwords do not match.");

    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: n,
          email: e,
          phone: ph || null,
          password,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Register failed");

      // ✅ سجل دخول مباشرة بعد التسجيل
      await login({ token: json.token, user: json.user });
      Alert.alert("Success", "Account created successfully!");
    } catch (err) {
      Alert.alert("Register error", String(err.message || err));
    }
  }, [fullName, email, phone, password, confirm, login]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ff851b" />
      <AppHeader showLogo />

      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone (optional)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={onRegister}>
          <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkWrap}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.link}>
            {"Already have an account? "}
            <Text style={styles.linkStrong}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: StatusBar.currentHeight || 0 },
  content: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#ff851b",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  linkWrap: { marginTop: 14, alignItems: "center" },
  link: { color: "#666" },
  linkStrong: { color: "#ff851b", fontWeight: "bold" },
});
