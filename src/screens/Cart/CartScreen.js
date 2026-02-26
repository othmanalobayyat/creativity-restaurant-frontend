import React, { useContext, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import { CartContext } from "../../context/CartContext";
import AppHeader from "../../components/AppHeader";

const EmptyCart = () => (
  <View style={styles.emptyCartContainer}>
    <Image
      source={require("../assets/empty-cart.png")}
      style={styles.emptyCartImage}
    />
    <Text style={styles.emptyCartText}>Your Cart is empty</Text>
  </View>
);

const CartItem = ({ item, onDecrease, onIncrease }) => (
  <View style={styles.product}>
    <Image source={{ uri: item.image }} style={styles.itemImage} />

    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>$ {Number(item.price).toFixed(2)}</Text>
    </View>

    <View style={styles.itemQuantity}>
      <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>

      <Text style={styles.quantityText}>{item.quantity}</Text>

      <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

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

  const renderItem = useCallback(
    ({ item, index }) => (
      <CartItem
        item={item}
        onDecrease={() => decreaseQuantity(index)}
        onIncrease={() => increaseQuantity(index)}
      />
    ),
    [decreaseQuantity, increaseQuantity],
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ff851b" />
      <AppHeader showLogo />

      <View style={styles.cartContainer}>
        <Text style={styles.title}>Cart</Text>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={cart}
              keyExtractor={(item) => String(item.id)}
              renderItem={renderItem}
            />

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Item Total</Text>
                <Text style={styles.summaryText}>
                  $ {totalPrice.toFixed(2)}
                </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  cartContainer: { flex: 1, padding: 20 },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 5,
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
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 16,
  },
  itemDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemPrice: { fontSize: 16, color: "#666", fontWeight: "bold" },

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

  emptyCartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  emptyCartImage: { width: 80, height: 80, marginRight: 16 },
  emptyCartText: { fontSize: 18, fontWeight: "bold" },

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
