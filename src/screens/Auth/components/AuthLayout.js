import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

const PRIMARY = "#ff851b";
const LOGO_SIZE = 140;

export default function AuthLayout({
  children,
  subtitle,
  brand = "Creativity Restaurant",
  logoSource,
}) {
  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
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
            <View style={styles.logoSection}>
              <View style={styles.logoBadge}>
                <Image
                  source={logoSource}
                  style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.brand}>{brand}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            {children}

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

  footer: { textAlign: "center", color: "#999", marginTop: 14 },
});
