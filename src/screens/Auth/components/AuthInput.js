import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const PRIMARY = "#ff851b";

export default function AuthInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  rightText,
  onRightPress,
  rightIcon,
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputRow}>
        <View style={styles.iconBubble}>
          <Icon name={icon} size={16} color={PRIMARY} />
        </View>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9aa0a6"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
        />

        {rightText ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.eyeBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.eyeText}>{rightText}</Text>
          </TouchableOpacity>
        ) : null}

        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.eyeBtn}
            activeOpacity={0.8}
          >
            <Icon name={rightIcon} size={18} color={PRIMARY} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 12 },
  label: { color: "#444", fontWeight: "800", marginBottom: 7, fontSize: 13 },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 10,
  },

  iconBubble: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 14 : 12,
    color: "#111",
  },

  eyeBtn: { paddingHorizontal: 10, paddingVertical: 10, borderRadius: 12 },
  eyeText: { color: PRIMARY, fontWeight: "900", fontSize: 13 },
});
