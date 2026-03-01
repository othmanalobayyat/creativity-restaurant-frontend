// src/screens/Profile/components/ProfileRow.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const PRIMARY = "#ff851b";

export default function ProfileRow({
  icon,
  label,
  onPress,
  right = "chevron",
  switchValue,
  onSwitchChange,
}) {
  const Left = (
    <View style={styles.sectionItemContent}>
      <Icon name={icon} size={24} color={PRIMARY} />
      <Text style={styles.sectionItemText}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.sectionItem}>
      {onPress ? (
        <TouchableOpacity
          style={styles.touchRow}
          onPress={onPress}
          activeOpacity={0.85}
        >
          {Left}
        </TouchableOpacity>
      ) : (
        Left
      )}

      {right === "chevron" ? (
        <Icon name="chevron-right" size={24} color="#000" />
      ) : right === "switch" ? (
        <Switch
          value={!!switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: "#e0e0e0", true: PRIMARY }}
          thumbColor={PRIMARY}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  touchRow: { flex: 1 },
  sectionItemText: { marginLeft: 15 },
  sectionItemContent: { flexDirection: "row", alignItems: "center" },
});
