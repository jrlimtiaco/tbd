import React from "react"
import { StyleSheet } from "react-native"

import Text from "./Text"

import { Colors, DEFAULT_PADDING, Fonts } from "../../constants/style"

export default ({ children }) => (
  <Text
    color={Colors.darkGray}
    size="xxxxxlarge"
    style={styles.text}
    type={Fonts.CerealExtraBold}
  >
    {children}
  </Text>
)

const styles = StyleSheet.create({
  text: {
    paddingHorizontal: 1,
    paddingVertical: DEFAULT_PADDING,
  },
})
