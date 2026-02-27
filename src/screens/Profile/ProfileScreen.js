import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../../components/AppHeader";
import { CartContext } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const PROFILE_KEY = "APP_PROFILE";
const SETTINGS_KEY = "APP_SETTINGS";

export default function ProfileScreen({ navigation }) {
  const { logout } = useAuth(); // ✅ لازم جوا component
  const { clearCart } = useContext(CartContext); // ✅ لازم جوا component

  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [profileName, setProfileName] = useState("Guest");

  useEffect(() => {
    (async () => {
      const rawProfile = await AsyncStorage.getItem(PROFILE_KEY);
      if (rawProfile) {
        const p = JSON.parse(rawProfile);
        setProfileName(p?.fullName || "Guest");
      }

      const rawSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (rawSettings) {
        const s = JSON.parse(rawSettings);
        setIsNotificationEnabled(Boolean(s?.notifications));
      }
    })();
  }, []);

  const toggleSwitch = useCallback(async () => {
    setIsNotificationEnabled((prev) => {
      const next = !prev;
      AsyncStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ notifications: next }),
      );
      return next;
    });
  }, []);

  const onLogout = useCallback(() => {
    Alert.alert("Logout", "Do you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          clearCart?.(); // ✅ يفضّي السلة
          await logout(); // ✅ يغير isLoggedIn=false فوراً => RootNavigator يرجع Login
        },
      },
    ]);
  }, [clearCart, logout]);

  return (
    <View style={styles.container}>
      <AppHeader showLogo />

      <View style={styles.contentContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Hi, {profileName}</Text>

        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Account</Text>

            <TouchableOpacity
              style={styles.sectionItem}
              onPress={() => navigation.navigate("ManageProfile")}
            >
              <View style={styles.sectionItemContent}>
                <Icon name="person" size={24} color="#ff851b" />
                <Text style={styles.sectionItemText}>Manage Profile</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sectionItem}
              onPress={() => navigation.navigate("ChangePassword")}
            >
              <View style={styles.sectionItemContent}>
                <Icon name="lock" size={24} color="#ff851b" />
                <Text style={styles.sectionItemText}>Change Password</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Orders</Text>
            <TouchableOpacity
              style={styles.sectionItem}
              onPress={() => navigation.navigate("AllMyOrders")}
            >
              <View style={styles.sectionItemContent}>
                <Icon name="local-shipping" size={24} color="#ff851b" />
                <Text style={styles.sectionItemText}>My All Orders</Text>
              </View>
              <Icon name="chevron-right" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification</Text>
            <View style={styles.sectionItem}>
              <View style={styles.sectionItemContent}>
                <Icon name="notifications" size={24} color="#ff851b" />
                <Text style={styles.sectionItemText}>Notification</Text>
              </View>
              <Switch
                value={isNotificationEnabled}
                onValueChange={toggleSwitch}
                trackColor={{ false: "#e0e0e0", true: "#ff851b" }}
                thumbColor="#ff851b"
              />
            </View>
          </View>

          <View style={styles.logoutContainer}>
            {/* ✅ لازم onLogout مش logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: StatusBar.currentHeight || 0 },
  contentContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginLeft: 20, marginTop: 20 },
  subtitle: { marginLeft: 20, marginTop: 6, color: "#666" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 15,
    marginVertical: 8,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold", paddingVertical: 10 },
  sectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionItemText: { marginLeft: 15 },
  sectionItemContent: { flexDirection: "row", alignItems: "center" },
  logoutContainer: { padding: 16 },
  logoutButton: {
    backgroundColor: "#ff851b",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 15,
  },
  logoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
