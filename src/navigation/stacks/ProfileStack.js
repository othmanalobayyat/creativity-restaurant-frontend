// src/navigation/stacks/ProfileStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultStackOptions } from "../theme/navigationTheme";

// screens
import ProfileScreen from "../../screens/Profile/ProfileScreen";
import ManageProfileScreen from "../../screens/Profile/ManageProfileScreen";
import ChangePasswordScreen from "../../screens/Profile/ChangePasswordScreen";
import AllMyOrdersScreen from "../../screens/Profile/AllMyOrdersScreen";
import OrderDetailsScreen from "../../screens/Profile/OrderDetailsScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageProfile"
        component={ManageProfileScreen}
        options={{ title: "Manage Profile" }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: "Change Your Password" }}
      />
      <Stack.Screen
        name="AllMyOrders"
        component={AllMyOrdersScreen}
        options={{ title: "All My Orders" }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: "Order Details" }}
      />
    </Stack.Navigator>
  );
}
