// src/navigation/stacks/HomeStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultStackOptions } from "../theme/navigationTheme";

// screens
import HomeScreen from "../../screens/Home/HomeScreen";
import ProductDetailScreen from "../../screens/Home/ProductDetailScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: "Product Detail" }}
      />
    </Stack.Navigator>
  );
}
