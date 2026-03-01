import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { apiFetch } from "../../api/apiFetch";

import AuthLayout from "./components/AuthLayout";
import AuthCard from "./components/AuthCard";
import AuthInput from "./components/AuthInput";
import {
  validateEmail,
  validatePassword,
  validateFullName,
  validateConfirmPassword,
} from "./utils/validators";

const PRIMARY = "#ff851b";

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const onRegister = useCallback(async () => {
    const vn = validateFullName(fullName);
    if (!vn.ok) return Alert.alert("Missing info", vn.msg);

    const ve = validateEmail(email);
    if (!ve.ok) return Alert.alert("Invalid email", ve.msg);

    const vp = validatePassword(password);
    if (!vp.ok) return Alert.alert("Weak password", vp.msg);

    const vc = validateConfirmPassword(password, confirm);
    if (!vc.ok) return Alert.alert("Mismatch", vc.msg);

    try {
      setLoading(true);

      const json = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: vn.value,
          email: ve.value,
          phone: phone.trim() || null,
          password: vp.value,
        }),
      });

      await login({ token: json.token, user: json.user });
      Alert.alert("Success", "Account created successfully!");
    } catch (err) {
      Alert.alert("Register error", String(err.message || err));
    } finally {
      setLoading(false);
    }
  }, [fullName, email, phone, password, confirm, login]);

  return (
    <AuthLayout
      subtitle="Create your account ✨"
      logoSource={require("../../screens/assets/empty-logo.png")}
    >
      <AuthCard title="Register">
        <AuthInput
          label="Full Name"
          icon="user"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your name"
        />

        <AuthInput
          label="Phone (optional)"
          icon="phone"
          value={phone}
          onChangeText={setPhone}
          placeholder="05xxxxxxxx"
          keyboardType="phone-pad"
        />

        <AuthInput
          label="Email"
          icon="envelope"
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AuthInput
          label="Password"
          icon="lock"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={!showPass}
          rightIcon={showPass ? "eye-slash" : "eye"}
          onRightPress={() => setShowPass((v) => !v)}
        />

        <AuthInput
          label="Confirm Password"
          icon="check"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="••••••••"
          secureTextEntry={!showConfirm}
          rightIcon={showConfirm ? "eye-slash" : "eye"}
          onRightPress={() => setShowConfirm((v) => !v)}
        />

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

        <View style={styles.row}>
          <Text style={styles.gray}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.link}> Login</Text>
          </TouchableOpacity>
        </View>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
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
});
