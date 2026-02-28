import React, {
  useMemo,
  useCallback,
  useContext,
  useState,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { CartContext } from "../../context/CartContext";
import { apiFetch } from "../../api/apiFetch";

import CheckoutAddressSection from "./components/CheckoutAddressSection";
import CheckoutItemsSection from "./components/CheckoutItemsSection";
import CheckoutSummary from "./components/CheckoutSummary";
import CheckoutConfirmButton from "./components/CheckoutConfirmButton";

export default function CheckoutScreen({ route, navigation }) {
  const { clearCart } = useContext(CartContext);
  const items = route.params?.items ?? [];

  const [address, setAddress] = useState({ city: "", street: "" });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Checkout",
      headerBackTitleVisible: false,
      headerTintColor: "#fff",
      headerStyle: { backgroundColor: "#ff851b" },
      headerTitleStyle: { fontWeight: "bold" },
    });
  }, [navigation]);

  const loadAddress = useCallback(async () => {
    try {
      const json = await apiFetch("/api/me/address");
      setAddress({ city: json?.city || "", street: json?.street || "" });
    } catch (e) {
      console.log("Address load error:", e?.message || e);
      setAddress({ city: "", street: "" });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAddress();
    }, [loadAddress]),
  );

  const totalPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);
  }, [items]);

  const goToAddress = useCallback(() => {
    navigation.navigate("Address");
  }, [navigation]);

  const placeOrder = useCallback(async () => {
    try {
      const payload = {
        items: items.map((x) => ({ itemId: x.id, quantity: x.quantity })),
      };

      const json = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      clearCart?.();
      navigation.replace("OrderConfirmation", {
        total: Number(json?.total || totalPrice),
        itemsCount: items.length,
      });
    } catch (e) {
      Alert.alert("Error", String(e.message || e));
    }
  }, [items, clearCart, navigation, totalPrice]);

  const confirmOrder = useCallback(() => {
    if (!items.length) {
      Alert.alert("Cart is empty", "Add items before checkout.");
      return;
    }

    const hasAddress = address.city.trim() && address.street.trim();
    if (!hasAddress) {
      Alert.alert(
        "Address required",
        "Please add your delivery address before confirming the order.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Add Address", onPress: goToAddress },
        ],
      );
      return;
    }

    Alert.alert(
      "Confirm Address",
      `Deliver to:\n${address.city}, ${address.street}\n\nIs this correct?`,
      [
        { text: "Change", onPress: goToAddress },
        { text: "Yes, continue", onPress: placeOrder },
      ],
      { cancelable: true },
    );
  }, [items, address, goToAddress, placeOrder]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ff851b" barStyle="light-content" />

      <ScrollView>
        <CheckoutAddressSection
          styles={styles}
          address={address}
          onChangePress={goToAddress}
        />

        <CheckoutItemsSection styles={styles} items={items} />
      </ScrollView>

      <CheckoutSummary styles={styles} totalPrice={totalPrice} />

      <CheckoutConfirmButton styles={styles} onPress={confirmOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 15,
    marginVertical: 8,
    marginLeft: 10,
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "bold" },
  changeText: { color: "#ff851b", fontWeight: "bold", fontSize: 14 },
  addressContainer: { marginBottom: 16 },
  logoAddressContainer: { flexDirection: "row", alignItems: "center" },
  addressDetails: { marginLeft: 8 },
  addressText: { fontSize: 14, marginBottom: 4 },

  orderItem: { marginBottom: 8 },
  itemName: { fontSize: 16, fontWeight: "bold" },
  itemQuantity: { fontSize: 14, color: "#666" },

  summaryContainer: { padding: 16, borderTopWidth: 1, borderColor: "#ddd" },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryText: { fontSize: 16 },
  freeText: { fontSize: 16, color: "green" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 16,
  },
  totalText: { fontSize: 18, fontWeight: "bold" },

  confirmButton: {
    backgroundColor: "#ff851b",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  confirmButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
