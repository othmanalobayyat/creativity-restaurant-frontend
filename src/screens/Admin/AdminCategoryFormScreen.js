// src/screens/Admin/AdminCategoryFormScreen.js
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { createAdminCategory, updateAdminCategory } from "../../api/adminApi";

const PRIMARY = "#ff851b";

export default function AdminCategoryFormScreen({ navigation, route }) {
  const mode = route?.params?.mode || "create";
  const category = route?.params?.category || null;
  const isEdit = mode === "edit";

  const [name, setName] = useState(isEdit ? String(category?.name ?? "") : "");
  const [saving, setSaving] = useState(false);

  const title = useMemo(
    () => (isEdit ? "Edit Category" : "Create Category"),
    [isEdit],
  );

  const submit = useCallback(async () => {
    try {
      const trimmed = name.trim();
      if (!trimmed) return Alert.alert("Validation", "Name is required");

      setSaving(true);

      if (isEdit) {
        await updateAdminCategory(Number(category.id), { name: trimmed });
      } else {
        // ✅ NO id here (AUTO_INCREMENT)
        await createAdminCategory({ name: trimmed });
      }

      Alert.alert("Success", "Saved ✅", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", String(e?.message || e));
    } finally {
      setSaving(false);
    }
  }, [name, isEdit, category, navigation]);

  return (
    <View style={s.container}>
      <Text style={s.title}>{title}</Text>

      <Text style={s.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="مثلاً Burgers"
        style={s.input}
      />

      <TouchableOpacity style={s.saveBtn} onPress={submit} disabled={saving}>
        {saving ? <ActivityIndicator /> : <Text style={s.saveText}>Save</Text>}
      </TouchableOpacity>

      <Text style={s.note}>
        ملاحظة: الـ ID صار Auto Increment من قاعدة البيانات.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },

  label: { marginTop: 10, marginBottom: 6, color: "#444" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  saveBtn: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  note: { marginTop: 12, color: "#777", fontSize: 12, lineHeight: 18 },
});
