// src/screens/Favorites/FavoritesScreen.js
import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AppHeader from "../../components/AppHeader";
import ProductCard from "../../components/ProductCard";

import EmptyFavorites from "./components/EmptyFavorites";
import { useFavorites } from "./hooks/useFavorites";
import { openProductFromFavorites } from "./utils/favoritesNav";

const PRIMARY = "#ff851b";

export default function FavoritesScreen({ navigation }) {
  const { favorites, loading, error, onFavChanged } = useFavorites();

  const onOpenProduct = useCallback(
    (item) => openProductFromFavorites(navigation, item),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <AppHeader showLogo />
      <Text style={styles.title}>Favorites</Text>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.msg}>Loading favorites...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.err}>
            Error: {String(error.message || error)}
          </Text>
        </View>
      ) : favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard
              item={{ ...item, image: `${item.image}?=${item.id}` }}
              onOpen={onOpenProduct}
              onFavChanged={onFavChanged}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 6 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  centerBox: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  msg: { marginTop: 10, textAlign: "center", color: "#666" },
  err: {
    marginTop: 10,
    textAlign: "center",
    color: "#d11a2a",
    paddingHorizontal: 16,
  },
});
