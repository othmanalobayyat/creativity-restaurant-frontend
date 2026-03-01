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
import { validateEmail, validatePassword } from "./utils/validators";

const PRIMARY = "#ff851b";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = useCallback(async () => {
    const ve = validateEmail(email);
    if (!ve.ok) return Alert.alert("Invalid email", ve.msg);

    const vp = validatePassword(password);
    if (!vp.ok) return Alert.alert("Weak password", vp.msg);

    try {
      setLoading(true);

      const json = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: ve.value, password: vp.value }),
      });

      await login({ token: json.token, user: json.user });
    } catch (err) {
      Alert.alert("Login error", String(err.message || err));
    } finally {
      setLoading(false);
    }
  }, [email, password, login]);

  const onForgot = useCallback(() => {
    Alert.alert("Forgot password", "Later we can add OTP / email reset.");
  }, []);

  return (
    <AuthLayout
      subtitle="Welcome back 👋"
      logoSource={require("../../screens/assets/empty-logo.png")}
    >
      <AuthCard title="Login">
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
          rightText={showPass ? "Hide" : "Show"}
          onRightPress={() => setShowPass((v) => !v)}
        />

        <TouchableOpacity
          style={styles.forgotWrap}
          onPress={onForgot}
          activeOpacity={0.85}
        >
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={onLogin}
          disabled={loading}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>LOGIN</Text>
          )}
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.gray}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.link}> Register</Text>
          </TouchableOpacity>
        </View>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  forgotWrap: { marginTop: -4, marginBottom: 10, alignItems: "flex-end" },
  forgot: { color: PRIMARY, fontWeight: "800" },

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
