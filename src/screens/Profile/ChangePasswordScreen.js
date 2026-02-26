import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ChangePasswordScreen({ navigation }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = useCallback(() => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing info", "Please fill all fields.");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert(
        "Weak password",
        "New password must be at least 6 characters.",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Mismatch",
        "New password and confirm password do not match.",
      );
      return;
    }

    // مؤقتاً: ما في BE. لاحقاً هون call API
    Alert.alert("Success", "Password changed successfully (temporary).");
    navigation.goBack();
  }, [currentPassword, newPassword, confirmPassword, navigation]);

  return (
    <View style={styles.container}>
      <Icon name="password" size={50} color="#ff851b" />
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        placeholder="Current Password"
        secureTextEntry
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        onPress={handlePasswordChange}
        style={styles.changeButton}
      >
        <Text style={styles.changeButtonText}>CHANGE PASSWORD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: {
    width: "80%",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },
  changeButton: {
    backgroundColor: "#ff851b",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  changeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
