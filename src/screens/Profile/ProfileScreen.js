// src/screens/Profile/ProfileScreen.js
import React, { useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AppHeader from "../../components/AppHeader";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import { useProfileLocal } from "./hooks/useProfileLocal";
import { clearProfileLocal } from "./utils/profileStorage";
import ProfileSection from "./components/ProfileSection";
import ProfileRow from "./components/ProfileRow";
import {
  goManageProfile,
  goChangePassword,
  goAllOrders,
} from "./utils/profileNav";

const PRIMARY = "#ff851b";

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth();
  const { clearCart } = useContext(CartContext);

  const { profileName, isNotificationEnabled, toggleNotifications } =
    useProfileLocal();

  const onLogout = useCallback(() => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          clearCart?.();
          await clearProfileLocal();
          await logout();
        },
      },
    ]);
  }, [clearCart, logout]);

  return (
    <View style={styles.container}>
      <AppHeader showLogo />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          Hi, {profileName?.trim() ? profileName : "Guest"}
        </Text>

        <ScrollView>
          <ProfileSection title="My Account">
            <ProfileRow
              icon="person"
              label="Manage Profile"
              onPress={() => goManageProfile(navigation)}
            />
            <ProfileRow
              icon="lock"
              label="Change Password"
              onPress={() => goChangePassword(navigation)}
            />
          </ProfileSection>

          <ProfileSection title="My Orders">
            <ProfileRow
              icon="local-shipping"
              label="My All Orders"
              onPress={() => goAllOrders(navigation)}
            />
          </ProfileSection>

          <ProfileSection title="Notification">
            <ProfileRow
              icon="notifications"
              label="Notification"
              right="switch"
              switchValue={isNotificationEnabled}
              onSwitchChange={toggleNotifications}
            />
          </ProfileSection>

          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onLogout}
              activeOpacity={0.9}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginLeft: 20, marginTop: 20 },
  subtitle: {
    marginLeft: 20,
    marginTop: 6,
    fontSize: 18,
    fontWeight: "666",
    color: "#000",
  },

  logoutContainer: { padding: 16 },
  logoutButton: {
    backgroundColor: PRIMARY,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 15,
  },
  logoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
