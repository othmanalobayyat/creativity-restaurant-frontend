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
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../../components/AppHeader";

const AUTH_KEY = "APP_AUTH"; // تخزين مؤقت
const PROFILE_KEY = "APP_PROFILE";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = useCallback(async () => {
    const e = email.trim().toLowerCase();
    const p = password;

    if (!e || !p) {
      Alert.alert("Missing info", "Please enter email and password.");
      return;
    }
    if (!e.includes("@") || !e.includes(".")) {
      Alert.alert("Invalid email", "Please enter a valid email.");
      return;
    }
    if (p.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    // ✅ مؤقت بدون BE:
    await AsyncStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ isLoggedIn: true, email: e }),
    );

    // (اختياري) إذا ما في profile، اعمل واحد بسيط
    const rawProfile = await AsyncStorage.getItem(PROFILE_KEY);
    if (!rawProfile) {
      await AsyncStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({ fullName: "Guest", email: e }),
      );
    }

    // روح على التطبيق
    navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  }, [email, password, navigation]);

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
            Don&apos;t have an account?{" "}
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
