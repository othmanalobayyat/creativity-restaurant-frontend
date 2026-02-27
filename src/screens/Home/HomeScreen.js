// src/screens/Home/HomeScreen.js
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";

import Categories from "../../components/Categories";
import AppHeader from "../../components/AppHeader";
import ProductCard from "../../components/ProductCard";
import SearchInput from "../../components/SearchInput";
import DataFetch from "../../services/FetchData";
import { BASE_URL } from "../../config/api";

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const url = useMemo(() => {
    const s = encodeURIComponent(debouncedSearch || "");
    return `${BASE_URL}/api/items?categoryId=${selectedCategory}&search=${s}`;
  }, [debouncedSearch, selectedCategory]);

  const { data, loading, error } = DataFetch(url);

  const [favSyncKey, setFavSyncKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFavSyncKey((x) => x + 1); // ✅ كل ما ترجع للـ Home يحدث القلوب
    }, []),
  );

  const onOpenProduct = useCallback(
    (item) => {
      navigation.navigate("ProductDetail", {
        itemId: item.id,
        itemName: item.name,
        itemPrice: item.price,
        itemDescription: item.description,
        itemImage: item.image,
      });
    },
    [navigation],
  );

  return (
    <View style={styles.container}>
      <AppHeader showLogo />

      <SearchInput value={search} onChangeText={setSearch} />

      <Categories onCategorySelect={setSelectedCategory} />

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#ff851b" />
          <Text style={styles.msg}>Loading items...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={styles.err}>
            Error: {String(error.message || error)}
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ProductCard
              item={{ ...item, image: `${item.image}?v=${item.id}` }}
              onOpen={onOpenProduct}
              favSyncKey={favSyncKey}
            />
          )}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 6 }}
          ListEmptyComponent={<Text style={styles.msg}>No items found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },

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
