import React from "react"
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native"

import { DEVICE_WIDTH } from "../../constants/dimensions"
import { Colors } from "../../constants/style"

export default ({
  children,
  color,
  disabled,
  onPress,
  pending,
  rounded,
  style,
  transparent,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      onPress={() => !disabled && onPress()}
      style={[
        styles.default,
        color && { backgroundColor: color },
        rounded && { borderRadius: 20 },
        disabled && { backgroundColor: Colors.lightGray },
        transparent && { backgroundColor: Colors.transparent },
        style,
      ]}
    >
      {pending ? <ActivityIndicator size="small" /> : children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  default: {
    alignItems: "center",
    backgroundColor: "gray",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
})
