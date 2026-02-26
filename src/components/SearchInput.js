import React, { memo } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

function SearchInput({
  value,
  onChangeText,
  placeholder = "Search...",
  containerStyle,
}) {
  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <Icon name="search" size={20} color="#ff851b" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

export default memo(SearchInput);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 5,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
});
