import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const CATEGORIES = [
  {
    id: "0",
    name: "All",
    icon: require("../assets/all.png"),
    selectedIcon: require("../assets/all-click.png"),
  },
  {
    id: "2",
    name: "Main Dishes",
    icon: require("../assets/main-course.png"),
    selectedIcon: require("../assets/main-course-click.png"),
  },
  {
    id: "1",
    name: "Appetizer",
    icon: require("../assets/appetizer.png"),
    selectedIcon: require("../assets/appetizer-click.png"),
  },
  {
    id: "3",
    name: "Salads",
    icon: require("../assets/salad.png"),
    selectedIcon: require("../assets/salad-click.png"),
  },
  {
    id: "4",
    name: "Dessert",
    icon: require("../assets/dessert.png"),
    selectedIcon: require("../assets/dessert-click.png"),
  },
  {
    id: "5",
    name: "Drinks",
    icon: require("../assets/Drinks.png"),
    selectedIcon: require("../assets/Drinks-click.png"),
  },
];

const CategoryItem = memo(function CategoryItem({ item, isSelected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.category, isSelected && styles.selectedCategory]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={isSelected ? item.selectedIcon : item.icon}
        style={styles.categoryIcon}
      />
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={isSelected ? styles.selectedText : styles.text}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
});

export default function Categories({ onCategorySelect }) {
  const [selectedId, setSelectedId] = useState("0");

  const handleSelect = useCallback(
    (id) => {
      setSelectedId(id);
      onCategorySelect?.(id);
    },
    [onCategorySelect],
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((category) => (
          <CategoryItem
            key={category.id}
            item={category}
            isSelected={selectedId === category.id}
            onPress={() => handleSelect(category.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  scrollContainer: { paddingLeft: 15, paddingRight: 5 },
  category: {
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    padding: 10,
    width: 95,
    height: 95,
    borderRadius: 10,
    marginLeft: 10,
  },
  selectedCategory: { backgroundColor: "#ff851b" },
  categoryIcon: { width: 50, height: 50, marginBottom: 5 },
  text: { color: "#000", fontSize: 11, textAlign: "center", marginTop: 2 },
  selectedText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 2,
  },
});
