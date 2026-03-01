import * as ImagePicker from "expo-image-picker";

export async function pickImage() {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) throw new Error("Permission denied");

  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (res.canceled) return null;
  return res.assets[0]; // { uri, width, height, ... }
}

export async function uploadToCloudinary(imageAsset) {
  const CLOUD_NAME = "YOUR_CLOUD_NAME";
  const UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";
  const FOLDER = "creativity/products";

  const uri = imageAsset.uri;
  const fileName = uri.split("/").pop() || `photo_${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(fileName);
  const ext = match?.[1] || "jpg";

  const form = new FormData();
  form.append("file", {
    uri,
    name: fileName,
    type: `image/${ext}`,
  });
  form.append("upload_preset", UPLOAD_PRESET);
  form.append("folder", FOLDER);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: form,
    },
  );

  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.error?.message || "Cloudinary upload failed");

  return json.secure_url; // هذا اللي نخزنه بالـ DB
}
