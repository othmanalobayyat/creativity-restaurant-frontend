// src/navigation/stacks/AdminStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultStackOptions } from "../theme/navigationTheme";

import AdminProductsScreen from "../../screens/Admin/AdminProductsScreen";
import AdminProductFormScreen from "../../screens/Admin/AdminProductFormScreen";
import AdminCategoriesScreen from "../../screens/Admin/AdminCategoriesScreen";
import AdminCategoryFormScreen from "../../screens/Admin/AdminCategoryFormScreen";
import AdminOrdersScreen from "../../screens/Admin/AdminOrdersScreen";
import AdminHomeScreen from "../../screens/Admin/AdminHomeScreen";

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen
        name="AdminHome"
        component={AdminHomeScreen}
        options={{ title: "Admin Dashboard" }}
      />

      <Stack.Screen
        name="AdminProducts"
        component={AdminProductsScreen}
        options={{ title: "Manage Products" }}
      />

      <Stack.Screen
        name="AdminProductForm"
        component={AdminProductFormScreen}
        options={{ title: "Product" }}
      />

      <Stack.Screen
        name="AdminCategories"
        component={AdminCategoriesScreen}
        options={{ title: "Manage Categories" }}
      />

      <Stack.Screen
        name="AdminCategoryForm"
        component={AdminCategoryFormScreen}
        options={{ title: "Category" }}
      />

      <Stack.Screen
        name="AdminOrders"
        component={AdminOrdersScreen}
        options={{ title: "Manage Orders" }}
      />
    </Stack.Navigator>
  );
}
