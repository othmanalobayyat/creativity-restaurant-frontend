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
} from "react-native";
import { fetchAdminCategories, deleteAdminCategory } from "../../api/adminApi";

const PRIMARY = "#ff851b";

export default function AdminCategoriesScreen({ navigation }) {
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await fetchAdminCategories(q.trim());
      setList(Array.isArray(rows) ? rows : []);
    } catch (e) {
      Alert.alert("Admin Categories Error", String(e?.message || e));
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  const onDelete = useCallback(
    (item) => {
      Alert.alert(
        "Delete category?",
        `${item.name} (#${item.id})`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await deleteAdminCategory(item.id);
                await load();
              } catch (e) {
                Alert.alert("Error", String(e?.message || e));
              }
            },
          },
        ],
        { cancelable: true },
      );
    },
    [load],
  );

  const header = useMemo(
    () => (
      <View style={{ marginBottom: 12 }}>
        <Text style={s.title}>Manage Categories</Text>

        <View style={s.searchRow}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search..."
            style={s.search}
            autoCapitalize="none"
          />
          <TouchableOpacity style={s.btn} onPress={load}>
            <Text style={s.btnText}>Go</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[s.btnWide, { backgroundColor: PRIMARY }]}
          onPress={() =>
            navigation.navigate("AdminCategoryForm", { mode: "create" })
          }
        >
          <Text style={s.btnWideText}>+ Add Category</Text>
        </TouchableOpacity>
      </View>
    ),
    [q, load, navigation],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={s.card}>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitle}>{item.name}</Text>
          <Text style={s.cardSub}>ID: {item.id}</Text>
        </View>

        <TouchableOpacity
          style={[s.smallBtn, { backgroundColor: "#1f7aec" }]}
          onPress={() =>
            navigation.navigate("AdminCategoryForm", {
              mode: "edit",
              category: item,
            })
          }
        >
          <Text style={s.smallBtnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.smallBtn, { backgroundColor: "#e53935" }]}
          onPress={() => onDelete(item)}
        >
          <Text style={s.smallBtnText}>Del</Text>
        </TouchableOpacity>
      </View>
    ),
    [navigation, onDelete],
  );

  return (
    <View style={s.container}>
      {header}

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" />
          <Text style={s.muted}>Loading...</Text>
        </View>
      ) : list.length === 0 ? (
        <Text style={s.muted}>No categories</Text>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(x) => String(x.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
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

  btnWide: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnWideText: { color: "#fff", fontWeight: "bold" },

  muted: { textAlign: "center", marginTop: 12, color: "#666" },
  center: { alignItems: "center", marginTop: 16 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 10,
    gap: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold" },
  cardSub: { marginTop: 4, color: "#666" },

  smallBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  smallBtnText: { color: "#fff", fontWeight: "bold" },
});
