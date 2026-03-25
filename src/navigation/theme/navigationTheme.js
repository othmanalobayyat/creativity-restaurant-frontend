// src/navigation/theme/navigationTheme.js
import { Platform } from "react-native";
import { colors } from "../../theme";

export const COLORS = {
  primary: colors.primary,
  white: colors.white,
  gray: "gray",
};

export const defaultStackOptions = {
  headerStyle: { backgroundColor: COLORS.primary },
  headerTintColor: COLORS.white,
  headerTitleStyle: { fontWeight: "bold" },
  headerBackTitleVisible: false,

  // Android status bar
  statusBarStyle: "light",
  statusBarColor: COLORS.primary,
  statusBarTranslucent: Platform.OS === "android" ? false : undefined,
};

export const tabBarOptions = {
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.gray,
};
