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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const onLogin = useCallback(async () => {
    const e = email.trim().toLowerCase();
    const p = password;

    if (!e || !p)
      return Alert.alert("Missing info", "Please enter email and password.");
    if (!e.includes("@") || !e.includes("."))
      return Alert.alert("Invalid email", "Please enter a valid email.");
    if (p.length < 6)
      return Alert.alert(
        "Weak password",
        "Password must be at least 6 characters.",
      );

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, password: p }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Login failed");

      await login({ token: json.token, user: json.user });
    } catch (err) {
      Alert.alert("Login error", String(err.message || err));
    }
  }, [email, password, login]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ff851b" />
      <AppHeader showLogo />

      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>

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

        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkWrap}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.link}>
            {"Don't have an account? "}
            <Text style={styles.linkStrong}>Register</Text>
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
