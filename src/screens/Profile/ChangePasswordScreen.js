// src/screens/Profile/ChangePasswordScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { apiFetch } from "../../api/apiFetch";

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = useCallback(async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return Alert.alert("Missing info", "Please fill in all fields.");
    }

    if (newPassword.length < 6) {
      return Alert.alert(
        "Weak password",
        "New password must be at least 6 characters.",
      );
    }

    if (newPassword !== confirmPassword) {
      return Alert.alert(
        "Mismatch",
        "New password and confirm password do not match.",
      );
    }

    try {
      setSaving(true);

      await apiFetch("/api/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      Alert.alert("Success", "Password changed successfully.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", String(e.message || e));
    } finally {
      setSaving(false);
    }
  }, [currentPassword, newPassword, confirmPassword, navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Icon name="password" size={40} color="#ff851b" />
        </View>

        <Text style={styles.title}>Password Settings</Text>
        <Text style={styles.subtitle}>Update your account password</Text>

        <Text style={styles.label}>Current Password</Text>
        <TextInput
          placeholder="Enter current password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <Text style={styles.label}>New Password</Text>
        <TextInput
          placeholder="Enter new password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          placeholder="Re-enter new password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          onPress={handlePasswordChange}
          style={[styles.button, saving && styles.buttonDisabled]}
          activeOpacity={0.9}
          disabled={saving}
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
