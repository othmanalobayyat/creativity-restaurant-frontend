// src/components/ProductCard.js
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { isFavorite, toggleFavorite } from "../utils/favoritesStorage";

function ProductCard({ item, onOpen, onFavChanged, favSyncKey }) {
  const [fav, setFav] = useState(false);

  const handlePress = useCallback(() => onOpen(item), [onOpen, item]);

  // لما الكرت ينرسم: افحص هل هو مفضّل
  useEffect(() => {
    let active = true;
    (async () => {
      const ok = await isFavorite(item.id);
      if (active) setFav(ok);
    })();
    return () => {
      active = false;
    };
  }, [item.id, favSyncKey]);

  const onToggleFav = useCallback(async () => {
    const nextList = await toggleFavorite(item.id);
    const isNowFav = nextList.includes(String(item.id));
    setFav(isNowFav);

    // ✅ بلّغ الشاشة الأم (FavoritesScreen) عشان تشيل العنصر فورًا إذا انشال من المفضلة
    if (onFavChanged) onFavChanged(item.id, isNowFav);
  }, [item.id, onFavChanged]);

  return (
    <Pressable
      style={({ pressed }) => [
        { backgroundColor: pressed ? "rgb(210, 230, 255)" : "#fff" },
        styles.item,
      ]}
      onPress={handlePress}
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.price}>${Number(item.price).toFixed(2)}</Text>
      </View>

      {/* ❤️ Favorite */}
      <TouchableOpacity style={styles.favButton} onPress={onToggleFav}>
        <Icon name={fav ? "heart" : "heart-o"} size={18} color="#ff851b" />
      </TouchableOpacity>

      {/* + Open */}
      <TouchableOpacity style={styles.addButton} onPress={handlePress}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </Pressable>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginLeft: 10,
    marginRight: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
  },
  textContainer: { flex: 1 },
  title: { fontSize: 16, fontWeight: "bold" },
  price: { marginTop: 10, fontSize: 16, fontWeight: "bold" },

  favButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17,
    marginRight: 10,
    backgroundColor: "#fff",
  },

  addButton: {
    backgroundColor: "#ff851b",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  addButtonText: { fontSize: 18, color: "#fff" },
});
