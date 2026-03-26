// src/screens/Cart/OrderConfirmationScreen.js
import React, { useCallback, useEffect, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { StackActions } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { CartContext } from "../../context/CartContext";
import { colors, spacing, radii } from "../../theme";

export default function OrderConfirmationScreen({ route, navigation }) {
  const total = Number(route.params?.total || 0);
  const itemsCount = Number(route.params?.itemsCount || 0);

  const { clearCart } = useContext(CartContext);

  // ✅ يفضّي الكارت أول ما يوصل المستخدم لهون
  useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const goHome = useCallback(() => {
    navigation.dispatch(StackActions.popToTop());
    const tabNav = navigation.getParent();
    if (tabNav) tabNav.navigate("HomeTab");
    else navigation.navigate("HomeTab");
  }, [navigation]);

  const goOrders = useCallback(() => {
    navigation.dispatch(StackActions.popToTop());
    const tabNav = navigation.getParent();
    if (tabNav) tabNav.navigate("ProfileTab");
    else navigation.navigate("ProfileTab");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Icon name="check-circle" size={90} color={colors.primary} />
      <Text style={styles.title}>Order Confirmed!</Text>
      <Text style={styles.subtitle}>
        {itemsCount} item(s) • Total: $ {total.toFixed(2)}
      </Text>

      <TouchableOpacity style={styles.button} onPress={goHome}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondary]}
        onPress={goOrders}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>
          View Orders
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  title: { fontSize: 26, fontWeight: "bold", marginTop: 16 },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
    marginTop: 12,
    width: "80%",
    alignItems: "center",
  },
  buttonText: { color: colors.white, fontWeight: "900", fontSize: 16 },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryText: { color: colors.primary },
});
