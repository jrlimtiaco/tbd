import React from "react"
import { StyleSheet, View } from "react-native"
import { Colors } from "../../constants/style"

export default ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
})
