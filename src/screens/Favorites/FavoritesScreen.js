import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppHeader from "../../components/AppHeader";
import mockData from "../../data/mockData";
import ProductCard from "../../components/ProductCard";
import { getFavoriteIds } from "../../utils/favoritesStorage";

export default function FavoritesScreen({ navigation }) {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      (async () => {
        const ids = await getFavoriteIds();
        if (active) setFavoriteIds(ids);
      })();

      return () => {
        active = false;
      };
    }, []),
  );

  const favorites = useMemo(() => {
    const set = new Set(favoriteIds.map(String));
    return mockData.filter((p) => set.has(String(p.id)));
  }, [favoriteIds]);

  // ✅ افتح ProductDetail اللي داخل HomeStack
  const onOpenProduct = useCallback(
    (item) => {
      navigation.navigate("HomeTab", {
        screen: "ProductDetail",
        params: {
          itemId: item.id,
          itemName: item.name,
          itemPrice: item.price,
          itemDescription: item.description,
          itemImage: item.image,
        },
      });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ff851b" />
      <AppHeader showLogo />

      <Text style={styles.title}>Favorites</Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../assets/empty-favorites.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubText}>
            Tap ❤️ on any product to save it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard
              item={{ ...item, image: `${item.image}?=${item.id}` }}
              onOpen={onOpenProduct}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: StatusBar.currentHeight || 0 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyImage: { width: 110, height: 110, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "bold" },
  emptySubText: { marginTop: 6, color: "#666", textAlign: "center" },
});
