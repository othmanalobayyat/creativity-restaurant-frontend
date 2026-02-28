// src/navigation/AppNavigator.js
import React, { useContext, useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { CartContext } from "../context/CartContext";
import { tabBarOptions, COLORS } from "./theme/navigationTheme";

// stacks
import HomeStack from "./stacks/HomeStack";
import CartStack from "./stacks/CartStack";
import ProfileStack from "./stacks/ProfileStack";
import FavoritesStack from "./stacks/FavoritesStack";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  HomeTab: "home",
  CartTab: "shopping-cart",
  FavoritesTab: "heart",
  ProfileTab: "user",
};

export default function AppNavigator() {
  const { cart } = useContext(CartContext);

  const cartBadge = useMemo(() => {
    return cart?.length ? cart.length : undefined;
  }, [cart?.length]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...tabBarOptions,
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={TAB_ICONS[route.name] || "circle"}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: "Home" }}
      />

      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          title: "Cart",
          tabBarBadge: cartBadge,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: COLORS.white,
          },
        }}
      />

      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStack}
        options={{ title: "Favorites" }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
