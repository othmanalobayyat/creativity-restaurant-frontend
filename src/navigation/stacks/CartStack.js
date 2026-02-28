// src/navigation/stacks/CartStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultStackOptions } from "../theme/navigationTheme";

// screens
import CartScreen from "../../screens/Cart/CartScreen";
import CheckoutScreen from "../../screens/Cart/CheckoutScreen";
import OrderConfirmationScreen from "../../screens/Cart/OrderConfirmationScreen";
import AddressScreen from "../../screens/Cart/AddressScreen";

const Stack = createNativeStackNavigator();

export default function CartStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Checkout" }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{ title: "Confirmation" }}
      />
      <Stack.Screen
        name="Address"
        component={AddressScreen}
        options={{ title: "Address" }}
      />
    </Stack.Navigator>
  );
}
