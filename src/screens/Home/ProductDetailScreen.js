// src/screens/Home/ProductDetailScreen.js
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { CartContext } from "../../context/CartContext";
import { apiFetch } from "../../api/apiFetch";

const PRIMARY = "#ff851b";

async function fetchItemById(itemId) {
  return apiFetch(`/api/items/${encodeURIComponent(itemId)}`);
}

export default function ProductDetailScreen({ route }) {
  const { addToCart } = useContext(CartContext);
  const itemId = route?.params?.itemId;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        const data = await fetchItemById(itemId);
        if (active) setItem(data);
      } catch (e) {
        if (active) setErr(e);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [itemId]);

  const normalized = useMemo(() => {
    if (!item) return null;
    return {
      id: item.id ?? item.item_id ?? itemId,
      name: item.name ?? item.itemName ?? item.title ?? "Item",
      price: item.price ?? item.itemPrice ?? 0,
      image: item.image ?? item.itemImage ?? item.img ?? "",
      description: item.description ?? item.itemDescription ?? "",
    };
  }, [item, itemId]);

  const handleAddToCart = useCallback(() => {
    if (!normalized) return;
    addToCart(normalized);
    Alert.alert("Item Added", `1 ${normalized.name} added to cart!`);
  }, [addToCart, normalized]);

  if (!itemId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errText}>Missing itemId</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.msg}>Loading item...</Text>
      </View>
    );
  }

  if (err) {
    return (
      <View style={styles.center}>
        <Text style={styles.errText}>Error: {String(err.message || err)}</Text>
      </View>
    );
  }

  if (!normalized) {
    return (
      <View style={styles.center}>
        <Text style={styles.errText}>Item not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Item Details</Text>

        {normalized.image ? (
          <Image source={{ uri: normalized.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imageFallback]}>
            <Text style={{ color: "#666" }}>No image</Text>
          </View>
        )}

        <View style={styles.namePriceContainer}>
          <Text style={styles.name}>{normalized.name}</Text>
          <Text style={styles.price}>
            $ {Number(normalized.price).toFixed(2)}
          </Text>
        </View>

        <Text style={styles.description}>{normalized.description}</Text>

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
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  image: { width: "100%", height: 220, borderRadius: 15, marginBottom: 16 },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f2f2f2",
  },

  namePriceContainer: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: { fontSize: 18, fontWeight: "bold" },

  price: { fontSize: 22, fontWeight: "bold", color: PRIMARY },

  description: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    color: "#444",
  },

  addButton: {
    backgroundColor: PRIMARY,
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

  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  msg: { marginTop: 10, color: "#666" },
  errText: { color: "#d11a2a", textAlign: "center" },
});
