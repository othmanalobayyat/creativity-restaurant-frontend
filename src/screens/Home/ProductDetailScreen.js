// src/screens/Home/ProductDetailScreen.js
import React, { useContext, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CartContext } from "../../context/CartContext";

export default function ProductDetailScreen({ route }) {
  const { addToCart } = useContext(CartContext);

  const { itemId, itemName, itemPrice, itemImage, itemDescription } =
    route.params;

  const item = useMemo(
    () => ({
      id: itemId,
      name: itemName,
      price: itemPrice,
      image: itemImage,
      description: itemDescription,
    }),
    [itemId, itemName, itemPrice, itemImage, itemDescription],
  );

  const handleAddToCart = useCallback(() => {
    addToCart(item);
    Alert.alert("Item Added", `1 ${item.name} added to cart!`);
  }, [addToCart, item]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Item Details</Text>

        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.namePriceContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>$ {Number(item.price).toFixed(2)}</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        {/* ✅ زر جديد احترافي */}
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.85}
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 20 },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 15,
    marginBottom: 16,
  },

  namePriceContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: { fontSize: 18, fontWeight: "bold" },

  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff851b",
  },

  description: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    color: "#444",
  },

  /* 🔥 الزر الجديد */
  addButton: {
    backgroundColor: "#ff851b",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
