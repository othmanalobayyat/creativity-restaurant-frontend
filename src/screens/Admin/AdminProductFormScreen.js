// src/screens/Admin/AdminProductFormScreen.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import { uploadToCloudinaryUnsigned } from "../../api/cloudinaryUpload";
import {
  createAdminProduct,
  updateAdminProduct,
  fetchAdminCategories,
} from "../../api/adminApi";

const PRIMARY = "#ff851b";

function toNumberOrNull(v) {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function AdminProductFormScreen({ navigation, route }) {
  const mode = route?.params?.mode || "create";
  const product = route?.params?.product || null;
  const isEdit = mode === "edit";

  const [name, setName] = useState(isEdit ? String(product?.name ?? "") : "");
  const [price, setPrice] = useState(
    isEdit ? String(product?.price ?? "") : "",
  );
  const [quantity, setQuantity] = useState(
    isEdit ? String(product?.quantity ?? 0) : "0",
  );
  const [description, setDescription] = useState(
    isEdit ? String(product?.description ?? "") : "",
  );
  const [categoryId, setCategoryId] = useState(
    isEdit ? String(product?.category_id ?? "") : "",
  );
  const [imageUrl, setImageUrl] = useState(
    isEdit ? String(product?.image_url ?? "") : "",
  );

  const [categories, setCategories] = useState([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const title = useMemo(
    () => (isEdit ? "Edit Product" : "Create Product"),
    [isEdit],
  );

  // load categories
  useEffect(() => {
    (async () => {
      try {
        setLoadingCats(true);
        const rows = await fetchAdminCategories("");
        setCategories(Array.isArray(rows) ? rows : []);
        if (!isEdit && !categoryId && Array.isArray(rows) && rows.length) {
          setCategoryId(String(rows[0].id));
        }
      } catch {
        setCategories([]);
      } finally {
        setLoadingCats(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ pick + compress + upload (DIRECT TO CLOUDINARY)
  const pickImage = useCallback(async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== "granted") {
        return Alert.alert(
          "Permission",
          "We need photo permission to pick images.",
        );
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: false,
      });

      if (result.canceled) return;

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        return Alert.alert("Error", "No image selected");
      }

      setUploading(true);

      // ✅ compress/resize + convert to JPEG (fix HEIC)
      const manipulated = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 900 } }],
        {
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        },
      );

      if (!manipulated?.base64) {
        throw new Error("Failed to process image");
      }

      const dataUrl = `data:image/jpeg;base64,${manipulated.base64}`;

      const url = await uploadToCloudinaryUnsigned(dataUrl);
      setImageUrl(url);
    } catch (e) {
      Alert.alert("Upload Error", String(e?.message || e));
    } finally {
      setUploading(false);
    }
  }, []);

  const validate = useCallback(() => {
    const trimmedName = name.trim();
    if (!trimmedName) return "Name is required";

    const p = toNumberOrNull(price);
    if (p == null || p < 0) return "Price must be a valid number >= 0";

    const qn = toNumberOrNull(quantity);
    if (qn == null || qn < 0) return "Quantity must be a number >= 0";

    const cid = toNumberOrNull(categoryId);
    if (!cid || cid <= 0) return "Category is required";

    return null;
  }, [name, price, quantity, categoryId]);

  const submit = useCallback(async () => {
    try {
      const err = validate();
      if (err) return Alert.alert("Validation", err);

      const body = {
        name: name.trim(),
        price: Number(price),
        quantity: Math.max(0, Math.floor(Number(quantity || 0))),
        description: description.trim() ? description.trim() : null,
        image_url: imageUrl.trim() ? imageUrl.trim() : null,
        category_id: Number(categoryId),
      };

      setSaving(true);

      if (isEdit) {
        await updateAdminProduct(Number(product.id), body);
      } else {
        // ✅ NO id here (AUTO_INCREMENT)
        await createAdminProduct(body);
      }

      Alert.alert("Success", "Saved ✅", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", String(e?.message || e));
    } finally {
      setSaving(false);
    }
  }, [
    validate,
    isEdit,
    name,
    price,
    quantity,
    description,
    imageUrl,
    categoryId,
    product,
    navigation,
  ]);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <Text style={s.title}>{title}</Text>

      <Text style={s.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="مثلاً Classic Burger"
        style={s.input}
      />

      <View style={s.row}>
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Price</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="12.00"
            keyboardType="decimal-pad"
            style={s.input}
          />
        </View>
        <View style={{ width: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={s.label}>Quantity</Text>
          <TextInput
            value={quantity}
            onChangeText={setQuantity}
            placeholder="0"
            keyboardType="number-pad"
            style={s.input}
          />
        </View>
      </View>

      <Text style={s.label}>Category</Text>
      {loadingCats ? (
        <Text style={s.muted}>Loading categories...</Text>
      ) : categories.length === 0 ? (
        <Text style={s.muted}>No categories (create one first)</Text>
      ) : (
        <View style={s.chipsWrap}>
          {categories.map((c) => {
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

      <Text style={s.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="اختياري..."
        style={[s.input, { height: 90, textAlignVertical: "top" }]}
        multiline
      />

      <Text style={s.label}>Image</Text>

      <View style={s.imageRow}>
        <View style={s.previewBox}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={s.preview} />
          ) : (
            <Text style={s.previewText}>No Image</Text>
          )}
        </View>

        <View style={{ flex: 1, gap: 10 }}>
          <TouchableOpacity
            style={s.pickBtn}
            onPress={pickImage}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator />
            ) : (
              <Text style={s.pickText}>Pick & Upload</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.pickBtn, { backgroundColor: "#f2f2f2" }]}
            onPress={() => setImageUrl("")}
            disabled={uploading}
          >
            <Text style={[s.pickText, { color: "#333" }]}>Remove Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={s.label}>Image URL (optional)</Text>
      <TextInput
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="https://..."
        style={s.input}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={s.saveBtn}
        onPress={submit}
        disabled={saving || uploading}
      >
        {saving ? <ActivityIndicator /> : <Text style={s.saveText}>Save</Text>}
      </TouchableOpacity>

      <Text style={s.note}>
        ملاحظة: الرفع صار مباشرة على Cloudinary، و الـ ID صار Auto Increment من
        قاعدة البيانات.
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },

  label: { marginTop: 10, marginBottom: 6, color: "#444", fontWeight: "600" },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  row: { flexDirection: "row" },
  muted: { color: "#666" },

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

  imageRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  previewBox: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: "#f2f2f2",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: { width: "100%", height: "100%" },
  previewText: { color: "#777", fontSize: 12 },

  pickBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  pickText: { color: "#fff", fontWeight: "bold" },

  saveBtn: {
    marginTop: 18,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  note: { marginTop: 12, color: "#777", fontSize: 12, lineHeight: 18 },
});
