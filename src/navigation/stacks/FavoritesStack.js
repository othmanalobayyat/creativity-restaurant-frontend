// src/navigation/stacks/FavoritesStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultStackOptions } from "../theme/navigationTheme";

// screens
import FavoritesScreen from "../../screens/Favorites/FavoritesScreen";

const Stack = createNativeStackNavigator();

export default function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={defaultStackOptions}>
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
