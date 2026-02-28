import React, { useContext, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { CartContext } from "../../context/CartContext";
import AppHeader from "../../components/AppHeader";

import EmptyCart from "./components/EmptyCart";
import CartItem from "./components/CartItem";

const PRIMARY = "#ff851b";

export default function CartScreen({ navigation }) {
  const { cart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0);
  }, [cart]);

  const handleCheckout = useCallback(() => {
    navigation.navigate("Checkout", { items: cart });
  }, [navigation, cart]);

  const goHome = useCallback(() => {
    navigation.navigate("HomeTab");
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }) => (
      <CartItem
        styles={styles}
        item={item}
        onDecrease={() => decreaseQuantity(item.id)}
        onIncrease={() => increaseQuantity(item.id)}
      />
    ),
    [decreaseQuantity, increaseQuantity],
  );

  return (
    <View style={styles.container}>
      <AppHeader showLogo />

      <Text style={styles.title}>Cart</Text>

      {cart.length === 0 ? (
        <EmptyCart styles={styles} onGoHome={goHome} />
      ) : (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={cart}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }}
          />

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Item Total</Text>
              <Text style={styles.summaryText}>$ {totalPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Discount</Text>
              <Text style={styles.summaryText}>0%</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryText}>Delivery Fee</Text>
              <Text style={styles.summaryText}>Free</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total</Text>
              <Text style={styles.totalText}>$ {totalPrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  cartContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 14 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  product: {
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
    marginLeft: 5,
    marginRight: 5,
  },

  itemImage: { width: 60, height: 60, borderRadius: 10, marginRight: 16 },

  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 16, color: "#666", fontWeight: "bold", marginTop: 6 },

  itemQuantity: { flexDirection: "row", alignItems: "center" },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    borderRadius: 15,
  },
  quantityButtonText: { fontSize: 18, color: "#333" },
  quantityText: { marginHorizontal: 8, fontSize: 16 },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyImage: { width: 110, height: 110, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "900" },
  emptySubText: { marginTop: 6, color: "#666", textAlign: "center" },

  emptyBtn: {
    marginTop: 14,
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  emptyBtnText: { color: "#fff", fontWeight: "900" },

  summaryContainer: { padding: 16, borderTopWidth: 1, borderColor: "#ddd" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryText: { fontSize: 16 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  totalText: { fontSize: 18, fontWeight: "bold" },

  checkoutButton: {
    backgroundColor: "#ff851b",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
