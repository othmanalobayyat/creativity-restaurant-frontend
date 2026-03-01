// src/screens/Profile/components/ProfileSection.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProfileSection({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
