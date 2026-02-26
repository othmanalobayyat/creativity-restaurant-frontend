import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Icon from "react-native-vector-icons/FontAwesome";

import { CartContext } from "../context/CartContext";

// screens
import HomeScreen from "../screens/Home/HomeScreen";
import ProductDetailScreen from "../screens/Home/ProductDetailScreen";
import CheckoutScreen from "../screens/Cart/CheckoutScreen";
import CartScreen from "../screens/Cart/CartScreen";
import OrderConfirmationScreen from "../screens/Cart/OrderConfirmationScreen";
import AddressScreen from "../screens/Cart/AddressScreen";
import ProfileScreen from "../screens/Profile/ProfileScreen";
import ManageProfileScreen from "../screens/Profile/ManageProfileScreen";
import ChangePasswordScreen from "../screens/Profile/ChangePasswordScreen";
import AllMyOrdersScreen from "../screens/Profile/AllMyOrdersScreen";
import FavoritesScreen from "../screens/Favorites/FavoritesScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{
          title: "Product Detail",
          headerStyle: { backgroundColor: "#ff851b" },
          headerTintColor: "#ffffff",
        }}
      />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{
          title: "Checkout",
          headerStyle: { backgroundColor: "#ff851b" },
          headerTintColor: "#ffffff",
        }}
      />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{
          title: "Confirmation",
          headerStyle: { backgroundColor: "#ff851b" },
          headerTintColor: "#fff",
        }}
      />

      <Stack.Screen
        name="Address"
        component={AddressScreen}
        options={{
          title: "Address",
          headerStyle: { backgroundColor: "#ff851b" },
          headerTintColor: "#fff",
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageProfile"
        component={ManageProfileScreen}
        options={{
          title: "Manage Profile",
          headerStyle: { backgroundColor: "#ff851b" },
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          title: "Change Your Password",
          headerStyle: { backgroundColor: "#ff851b" },
        }}
      />
      <Stack.Screen
        name="AllMyOrders"
        component={AllMyOrdersScreen}
        options={{
          title: "All My Orders",
          headerStyle: { backgroundColor: "#ff851b" },
        }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { cart } = useContext(CartContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = "circle";
          if (route.name === "HomeTab") iconName = "home";
          if (route.name === "CartTab") iconName = "shopping-cart";
          if (route.name === "ProfileTab") iconName = "user";
          if (route.name === "Favorites") iconName = "heart";
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ headerShown: false, title: "Home" }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartStack}
        options={{
          headerShown: false,
          tabBarBadge: cart?.length ? cart.length : undefined,
          tabBarBadgeStyle: { backgroundColor: "#ff851b", color: "white" },
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
