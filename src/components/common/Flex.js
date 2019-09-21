import React from "react"
import { StyleSheet, SafeAreaView } from "react-native"
import { Colors } from "../../constants/style"

export default ({ children, style }) => {
  return <SafeAreaView style={[styles.container, style]}>{children}</SafeAreaView>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
})
