import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function EmptyFavorites() {
  return (
    <View style={s.container}>
      <Image
        source={require("../assets/empty-favorites.png")}
        style={s.image}
      />
      <Text style={s.title}>No favorites yet</Text>
      <Text style={s.subtitle}>Tap ❤️ on any product to save it here.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  image: { width: 110, height: 110, marginBottom: 16 },
  title: { fontSize: 18, fontWeight: "bold" },
  subtitle: { marginTop: 6, color: "#666", textAlign: "center" },
});
