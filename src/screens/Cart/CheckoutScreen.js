import React, { useMemo, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CartContext } from "../../context/CartContext";

export default function CheckoutScreen({ route, navigation }) {
  const { clearCart } = useContext(CartContext);

  const items = route.params?.items ?? [];

  const totalPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return acc + price * qty;
    }, 0);
  }, [items]);

  const confirmOrder = useCallback(() => {
    if (!items.length) {
      Alert.alert("Cart is empty", "Add items before checkout.");
      return;
    }

    Alert.alert(
      "Confirm Order",
      "Do you want to place this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            // FE جاهز: هون مستقبلاً رح تنادي API
            clearCart?.();
            navigation.replace("OrderConfirmation", {
              total: totalPrice,
              itemsCount: items.length,
            });
          },
        },
      ],
      { cancelable: true },
    );
  }, [items.length, clearCart, navigation, totalPrice]);

  const goToAddress = useCallback(() => {
    navigation.navigate("Address");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ff851b" />
      <ScrollView>
        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Address</Text>
            <TouchableOpacity onPress={goToAddress}>
              <Text style={styles.changeText}>change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.addressContainer}>
            <View style={styles.logoAddressContainer}>
              <Icon name="location-on" size={24} color="#ff851b" />
              <View style={styles.addressDetails}>
                {/* مؤقت: بعدين بتجيبها من state/AsyncStorage */}
                <Text style={styles.addressText}>
                  Bethlehem, Wadshaheen st.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          {items.map((item) => {
            const price = Number(item.price) || 0;
            const qty = Number(item.quantity) || 0;
            const line = price * qty;

            return (
              <View key={String(item.id)} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>
                  {qty} x $ {price.toFixed(2)} = $ {line.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Item Total</Text>
          <Text style={styles.summaryText}>$ {totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Discount</Text>
          <Text style={styles.summaryText}>$ 0.00</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>Delivery Fee</Text>
          <Text style={styles.freeText}>Free</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalText}>$ {totalPrice.toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton} onPress={confirmOrder}>
        <Text style={styles.confirmButtonText}>CONFIRM ORDER</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: StatusBar.currentHeight || 0 },
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
