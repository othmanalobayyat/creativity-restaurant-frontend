// src/screens/Home/HomeScreen.js
import React, { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import ProductCard from "../../components/ProductCard";
import SearchInput from "../../components/SearchInput";

import Categories from "./components/Categories";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { openProductDetail } from "./utils/homeNav";
import DataFetch from "../../services/FetchData";

const PRIMARY = "#ff851b";

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");

  const debouncedSearch = useDebouncedValue(search, 350);

  // ✅ path فقط (بدون BASE_URL)
  const path = useMemo(() => {
    const s = encodeURIComponent(debouncedSearch || "");
    return `/api/items?categoryId=${selectedCategory}&search=${s}`;
  }, [debouncedSearch, selectedCategory]);

  const { data, loading, error } = DataFetch(path);

  const [favSyncKey, setFavSyncKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setFavSyncKey((x) => x + 1); // يحدث القلوب لما ترجع للـ Home
    }, []),
  );

  const onOpenProduct = useCallback(
    (item) => openProductDetail(navigation, item),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <AppHeader showLogo />

      <SearchInput value={search} onChangeText={setSearch} />

      <Categories onCategorySelect={setSelectedCategory} />

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={PRIMARY} />
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
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ProductCard
              item={{ ...item, image: `${item.image}?v=${item.id}` }}
              onOpen={onOpenProduct}
              favSyncKey={favSyncKey}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.msg}>No items found.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },

  listContent: { paddingBottom: 24, paddingTop: 6 },

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
