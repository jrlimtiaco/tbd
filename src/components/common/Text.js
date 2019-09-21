import React from "react"
import { StyleSheet, Text } from "react-native"

import { DEVICE_WIDTH } from "../../constants/dimensions"
import { Colors, Fonts } from "../../constants/style"

const isSmallDevice = DEVICE_WIDTH < 370

const sizes = {
  xxsmall: isSmallDevice ? 10 * 0.85 : 10,
  xsmall: isSmallDevice ? 12 * 0.85 : 12,
  small: isSmallDevice ? 14 * 0.85 : 14,
  medium: isSmallDevice ? 16 * 0.85 : 16,
  large: isSmallDevice ? 18 * 0.85 : 18,
  xlarge: isSmallDevice ? 20 * 0.85 : 20,
  xxlarge: isSmallDevice ? 22 * 0.85 : 22,
  xxxlarge: isSmallDevice ? 24 * 0.85 : 24,
  xxxxlarge: isSmallDevice ? 30 * 0.85 : 30,
  xxxxxlarge: isSmallDevice ? 38 * 0.85 : 38,
}

export default ({
  align,
  children,
  color,
  size,
  style,
  type,
  ...props
}) => {
  return (
    <Text
      {...props}
      style={[
        { fontSize: size ? sizes[size] : sizes.medium },
        { fontFamily: type ? type : Fonts.CerealMedium },
        { textAlign: align ? align : "left" },
        { color: color ? color : Colors.black },
        style,
      ]}
    >
      {children}
    </Text>
  )
}
