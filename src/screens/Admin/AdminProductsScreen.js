import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Switch,
} from "react-native";
import {
  fetchAdminProducts,
  fetchAdminCategories,
  setAdminProductActive,
} from "../../api/adminApi";

const PRIMARY = "#ff851b";

function safeImg(url) {
  if (!url) return null;
  const s = String(url).trim();
  if (!s) return null;
  return s;
}

// لو is_active مش جاي من الباك (لسا ما عدلت SELECT) نفترضه active
function isActive(item) {
  const v = item?.is_active;
  if (v === 0 || v === "0" || v === false) return false;
  if (v === 1 || v === "1" || v === true) return true;
  return true;
}

export default function AdminProductsScreen({ navigation }) {
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState(""); // empty = all
  const [showDisabled, setShowDisabled] = useState(true); // خلّيها true عشان تشوفهم
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      setCatLoading(true);
      const rows = await fetchAdminCategories("");
      setCategories(Array.isArray(rows) ? rows : []);
    } catch {
      setCategories([]);
    } finally {
      setCatLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const json = await fetchAdminProducts({
        q: q.trim().toLowerCase(),
        categoryId,
        limit: 200,
        offset: 0,
      });
      const list = Array.isArray(json?.products) ? json.products : [];
      setProducts(list);
    } catch (e) {
      Alert.alert("Admin Products Error", String(e?.message || e));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [q, categoryId]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // لما نرجع من شاشة الفورم نعمل refresh
  useEffect(() => {
    const unsub = navigation.addListener("focus", () => {
      loadProducts();
      loadCategories();
    });
    return unsub;
  }, [navigation, loadProducts, loadCategories]);

  const categoryChips = useMemo(() => {
    const allChip = { id: "", name: "All" };
    return [allChip, ...categories];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (showDisabled) return products;
    return products.filter((p) => isActive(p));
  }, [products, showDisabled]);

  const onToggleActive = useCallback(
    (item) => {
      const currentlyActive = isActive(item);
      const next = currentlyActive ? 0 : 1;

      Alert.alert(
        next ? "Enable product?" : "Disable product?",
        `${item.name} (#${item.id})`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: next ? "Enable" : "Disable",
            style: next ? "default" : "destructive",
            onPress: async () => {
              try {
                await setAdminProductActive(item.id, next);
                await loadProducts();
              } catch (e) {
                Alert.alert("Error", String(e?.message || e));
              }
            },
          },
        ],
        { cancelable: true },
      );
    },
    [loadProducts],
  );

  const header = useMemo(() => {
    return (
      <View style={{ marginBottom: 12 }}>
        <Text style={s.title}>Manage Products</Text>

        <View style={s.searchRow}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search products..."
            style={s.search}
            autoCapitalize="none"
          />
          <TouchableOpacity style={s.btn} onPress={loadProducts}>
            <Text style={s.btnText}>Go</Text>
          </TouchableOpacity>
        </View>

        <View style={s.toggleRow}>
          <Text style={s.toggleLabel}>Show disabled</Text>
          <Switch value={showDisabled} onValueChange={setShowDisabled} />
        </View>

        <Text style={s.filterLabel}>Filter by category</Text>

        {catLoading ? (
          <Text style={s.muted}>Loading categories...</Text>
        ) : (
          <View style={s.chipsWrap}>
            {categoryChips.map((c) => {
              const active = String(categoryId) === String(c.id);
              return (
                <TouchableOpacity
                  key={String(c.id)}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => setCategoryId(String(c.id))}
                >
                  <Text style={[s.chipText, active && s.chipTextActive]}>
                    {c.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={s.addBtn}
          onPress={() =>
            navigation.navigate("AdminProductForm", { mode: "create" })
          }
          activeOpacity={0.9}
        >
          <Text style={s.addText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>
    );
  }, [
    q,
    loadProducts,
    catLoading,
    categoryChips,
    categoryId,
    navigation,
    showDisabled,
  ]);

  const renderItem = useCallback(
    ({ item }) => {
      const img = safeImg(item.image_url);
      const active = isActive(item);

      return (
        <View style={[s.card, !active && s.cardDisabled]}>
          <View style={s.imgBox}>
            {img ? (
              <Image source={{ uri: img }} style={s.img} />
            ) : (
              <Text style={s.imgPlaceholder}>No Image</Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View style={s.rowBetween}>
              <Text style={s.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>

              <Text style={[s.badge, active ? s.badgeOn : s.badgeOff]}>
                {active ? "ACTIVE" : "DISABLED"}
              </Text>
            </View>

            <Text style={s.cardSub}>
              #{item.id} • ${Number(item.price || 0).toFixed(2)} • Qty{" "}
              {item.quantity}
            </Text>
            <Text style={s.cardSub}>
              Category: {item.category_name || item.category_id}
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            <TouchableOpacity
              style={[s.smallBtn, { backgroundColor: "#1f7aec" }]}
              onPress={() =>
                navigation.navigate("AdminProductForm", {
                  mode: "edit",
                  product: item,
                })
              }
            >
              <Text style={s.smallBtnText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                s.smallBtn,
                { backgroundColor: active ? "#e53935" : "#2e7d32" },
              ]}
              onPress={() => onToggleActive(item)}
            >
              <Text style={s.smallBtnText}>
                {active ? "Disable" : "Enable"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [navigation, onToggleActive],
  );

  return (
    <View style={s.container}>
      {header}

      <Text style={s.debug}>count: {filteredProducts.length}</Text>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" />
          <Text style={s.muted}>Loading...</Text>
        </View>
      ) : filteredProducts.length === 0 ? (
        <Text style={s.muted}>No products</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(x) => String(x.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },

  searchRow: { flexDirection: "row", gap: 10 },
  search: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  btn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 12,
  },
  btnText: { color: "#fff", fontWeight: "bold" },

  toggleRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: { color: "#444", fontWeight: "600" },

  filterLabel: {
    marginTop: 10,
    marginBottom: 6,
    color: "#444",
    fontWeight: "600",
  },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  chipText: { color: "#333", fontWeight: "600" },
  chipTextActive: { color: "#fff" },

  addBtn: {
    marginTop: 12,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  addText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  debug: { color: "#999", fontSize: 12, marginBottom: 8 },
  muted: { textAlign: "center", marginTop: 12, color: "#666" },
  center: { alignItems: "center", marginTop: 16 },

  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
  },
  cardDisabled: {
    opacity: 0.7,
  },

  imgBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  img: { width: "100%", height: "100%" },
  imgPlaceholder: { fontSize: 10, color: "#777" },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  cardTitle: { fontSize: 16, fontWeight: "bold", flex: 1 },
  cardSub: { marginTop: 4, color: "#666", fontSize: 12 },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "bold",
  },
  badgeOn: { backgroundColor: "#2e7d32", color: "#fff" },
  badgeOff: { backgroundColor: "#757575", color: "#fff" },

  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  smallBtnText: { color: "#fff", fontWeight: "bold" },
});
