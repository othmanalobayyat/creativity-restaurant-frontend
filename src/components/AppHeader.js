// components/AppHeader.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function AppHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  showLogo = true,
}) {
  return (
    <>
      {/* ✅ يخلي شريط الإشعارات شفاف ويمر فوق اللون */}
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor="transparent"
      />

      {/* ✅ هذا بس لتلوين منطقة النوتش بالأيفون */}
      <SafeAreaView edges={["top"]} style={styles.safeTop} />

      {/* ✅ الهيدر الحقيقي مع البوردر ريديوس */}
      <View style={styles.header}>
        {onBack || rightIcon || title || subtitle ? (
          <View style={styles.row}>
            {/* LEFT */}
            {onBack ? (
              <TouchableOpacity
                onPress={onBack}
                style={styles.iconBtn}
                hitSlop={10}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconPlaceholder} />
            )}

            {/* CENTER */}
            <View style={styles.center}>
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {subtitle ? (
                <Text style={styles.subtitle}>{subtitle}</Text>
              ) : null}
            </View>

            {/* RIGHT */}
            {rightIcon ? (
              <TouchableOpacity
                onPress={onRightPress}
                style={styles.iconBtn}
                hitSlop={10}
              >
                <Ionicons name={rightIcon} size={22} color="#fff" />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconPlaceholder} />
            )}
          </View>
        ) : null}

        {/* LOGO */}
        {showLogo ? (
          <Image
            source={require("../../assets/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  // ✅ يغطي فقط safe area فوق (النوتش)
  safeTop: {
    backgroundColor: "#ff851b",
  },

  // ✅ هنا الشكل (radius) بدون ما نخرب لون النوتش
  header: {
    backgroundColor: "#ff851b",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    paddingBottom: 8,
    paddingTop: 6,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 4,
  },

  iconBtn: {
    padding: 6,
  },

  iconPlaceholder: {
    width: 36,
  },

  center: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },

  subtitle: {
    fontSize: 12,
    marginTop: 2,
    color: "rgba(255,255,255,0.85)",
  },

  logo: {
    width: 150,
    height: 55,
    alignSelf: "flex-start",
    marginLeft: 14,
  },
});
