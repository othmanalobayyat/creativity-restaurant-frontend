// src/screens/Auth/RegisterScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { BASE_URL } from "../../config/api";
import { useAuth } from "../../context/AuthContext";

const PRIMARY = "#ff851b";
const LOGO_SIZE = 140;

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const onRegister = useCallback(async () => {
    const n = fullName.trim();
    const e = email.trim().toLowerCase();
    const ph = phone.trim();
    const p = password;

    if (!n || !e || !p || !confirm)
      return Alert.alert("Missing info", "Please fill all required fields.");
    if (!e.includes("@") || !e.includes("."))
      return Alert.alert("Invalid email", "Please enter a valid email.");
    if (p.length < 6)
      return Alert.alert(
        "Weak password",
        "Password must be at least 6 characters.",
      );
    if (p !== confirm)
      return Alert.alert("Mismatch", "Passwords do not match.");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: n,
          email: e,
          phone: ph || null,
          password: p,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Register failed");

      await login({ token: json.token, user: json.user });
      Alert.alert("Success", "Account created successfully!");
    } catch (err) {
      Alert.alert("Register error", String(err.message || err));
    } finally {
      setLoading(false);
    }
  }, [fullName, email, phone, password, confirm, login]);

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      {/* الخلفية البرتقالية */}
      <View style={styles.topBg} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.centerWrap}>
            {/* Logo + Title */}
            <View style={styles.logoSection}>
              <View style={styles.logoBadge}>
                <Image
                  source={require("../../screens/assets/empty-logo.png")}
                  style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.brand}>Creativity Restaurant</Text>
              <Text style={styles.subtitle}>Create your account ✨</Text>
            </View>

            {/* Card */}
            <View style={styles.card}>
              <Text style={styles.title}>Register</Text>

              {/* Full Name */}
              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBubble}>
                    <Icon name="user" size={16} color={PRIMARY} />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Your name"
                    placeholderTextColor="#9aa0a6"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.field}>
                <Text style={styles.label}>Phone (optional)</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBubble}>
                    <Icon name="phone" size={16} color={PRIMARY} />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="05xxxxxxxx"
                    placeholderTextColor="#9aa0a6"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBubble}>
                    <Icon name="envelope" size={16} color={PRIMARY} />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#9aa0a6"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBubble}>
                    <Icon name="lock" size={16} color={PRIMARY} />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9aa0a6"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPass((v) => !v)}
                    style={styles.eyeBtn}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name={showPass ? "eye-slash" : "eye"}
                      size={18}
                      color={PRIMARY}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.field}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputRow}>
                  <View style={styles.iconBubble}>
                    <Icon name="check" size={16} color={PRIMARY} />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#9aa0a6"
                    value={confirm}
                    onChangeText={setConfirm}
                    secureTextEntry={!showConfirm}
                  />

                  <TouchableOpacity
                    onPress={() => setShowConfirm((v) => !v)}
                    style={styles.eyeBtn}
                    activeOpacity={0.8}
                  >
                    <Icon
                      name={showConfirm ? "eye-slash" : "eye"}
                      size={18}
                      color={PRIMARY}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Button */}
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.7 }]}
                onPress={onRegister}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                )}
              </TouchableOpacity>

              {/* Login link */}
              <View style={styles.row}>
                <Text style={styles.gray}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.link}> Login</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.footer}>© Creativity Restaurant</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },

  topBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
    backgroundColor: PRIMARY,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    opacity: 0.98,
  },

  scroll: { flexGrow: 1 },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    paddingTop: (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 22,
  },

  logoSection: {
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 20,
  },

  logoBadge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.96)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.22,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    marginBottom: 10,
  },

  brand: { color: "#fff", fontSize: 20, fontWeight: "900", letterSpacing: 0.3 },
  subtitle: { color: "rgba(255,255,255,0.92)", marginTop: 4, fontSize: 13 },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 18,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 12,
    textAlign: "center",
    color: "#111",
  },

  field: { marginBottom: 12 },
  label: { color: "#444", fontWeight: "800", marginBottom: 7, fontSize: 13 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 10,
  },

  iconBubble: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    color: "#111",
  },

  eyeBtn: { paddingHorizontal: 10, paddingVertical: 10, borderRadius: 12 },

  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.8,
  },

  row: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  gray: { color: "#666" },
  link: { color: PRIMARY, fontWeight: "900" },

  footer: { textAlign: "center", color: "#999", marginTop: 14 },
});
