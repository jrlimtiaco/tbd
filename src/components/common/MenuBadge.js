import React from "react"
import { StyleSheet, View } from "react-native"

import Text from "./Text"

import { Colors } from "../../constants/style"

export default ({ count }) => {
  if (count === 0) {
    return null
  }
  return (
    <View style={styles.container}>
      <Text color={Colors.white} size="xxsmall">
        {count}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: Colors.purple,
    borderRadius: 9,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    top: 0,
    height: 18,
    width: 18,
  },
})
