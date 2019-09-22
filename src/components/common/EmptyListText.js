import React from "react"
import { StyleSheet } from "react-native"

import Text from "./Text"

import { DEVICE_HEIGHT } from "../../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../../constants/style"

const EmptyListText = ({
  children,
  color = Colors.darkGray,
  font = Fonts.CerealExtraBold,
  size = "xxxxxlarge",
  style,
}) => {
  return (
    <Text
      color={color}
      size={size}
      style={[styles.text, style]}
      type={font}
    >
      {children}
    </Text>
  )
}

export default EmptyListText

const styles = StyleSheet.create({
  text: {
    padding: DEFAULT_PADDING,
    textAlign: "center",
  },
})
