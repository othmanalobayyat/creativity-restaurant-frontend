import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function CheckoutAddressSection({
  styles,
  address,
  onChangePress,
}) {
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Address</Text>
        <TouchableOpacity onPress={onChangePress}>
          <Text style={styles.changeText}>change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.addressContainer}>
        <View style={styles.logoAddressContainer}>
          <Icon name="location-on" size={24} color="#ff851b" />
          <View style={styles.addressDetails}>
            <Text style={styles.addressText}>
              {address.city && address.street
                ? `${address.city}, ${address.street}`
                : "No saved address"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
