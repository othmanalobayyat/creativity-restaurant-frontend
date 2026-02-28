// src/screens/Favorites/utils/favoritesNav.js
export function openProductFromFavorites(navigation, item) {
  navigation.navigate("HomeTab", {
    screen: "ProductDetail",
    params: { itemId: item.id },
  });
}
