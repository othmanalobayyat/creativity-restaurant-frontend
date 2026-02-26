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

const AUTH_KEY = "APP_AUTH";
const PROFILE_KEY = "APP_PROFILE";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const onRegister = useCallback(async () => {
    const n = fullName.trim();
    const e = email.trim().toLowerCase();

    if (!n || !e || !password || !confirm) {
      Alert.alert("Missing info", "Please fill all fields.");
      return;
    }
    if (!e.includes("@") || !e.includes(".")) {
      Alert.alert("Invalid email", "Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }

    // ✅ مؤقت بدون BE: نحفظ “بروفايل” + نعتبره مسجل دخول
    await AsyncStorage.setItem(
      PROFILE_KEY,
      JSON.stringify({ fullName: n, email: e }),
    );
    await AsyncStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ isLoggedIn: true, email: e }),
    );

    Alert.alert("Success", "Account created successfully!");
    navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  }, [fullName, email, password, confirm, navigation]);

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
            Already have an account?{" "}
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
