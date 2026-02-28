// src/screens/Home/utils/homeNav.js
export function openProductDetail(navigation, item) {
  navigation.navigate("ProductDetail", { itemId: item.id });
}
