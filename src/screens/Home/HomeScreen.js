import React, { useMemo, useCallback, useState } from "react";
import mockData from "../../data/mockData";
import { View, FlatList, StyleSheet } from "react-native";

import Categories from "../../components/Categories";
import AppHeader from "../../components/AppHeader";
import ProductCard from "../../components/ProductCard";
import SearchInput from "../../components/SearchInput";
import { filterProducts } from "../../utils/filterProducts";

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("0");

  const data = mockData;

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

  const filteredData = useMemo(
    () => filterProducts(data, { search, selectedCategory }),
    [data, search, selectedCategory],
  );

  return (
    <View style={styles.container}>
      <AppHeader showLogo />

      <SearchInput value={search} onChangeText={setSearch} />

      <Categories onCategorySelect={setSelectedCategory} />

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <ProductCard
            item={{ ...item, image: `${item.image}?=${item.id}` }}
            onOpen={onOpenProduct}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
