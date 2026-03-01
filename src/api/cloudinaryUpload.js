export async function uploadToCloudinaryUnsigned(base64DataUrl) {
  const cloudName = "PUT_YOUR_CLOUD_NAME_HERE";
  const uploadPreset = "creativity_products";

  const form = new FormData();
  form.append("file", base64DataUrl);
  form.append("upload_preset", uploadPreset);
  form.append("folder", "creativity_products"); // نفس اسم preset (اختياري)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "Upload failed");

  return json.secure_url;
}
