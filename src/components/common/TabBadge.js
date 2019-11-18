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
      <View style={styles.top}>
        <Text color={Colors.white} size="small">
          {count}
        </Text>
      </View>
      <View style={styles.triangle} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    top: -28,
  },
  top: {
    alignItems: "center",
    backgroundColor: Colors.red,
    borderRadius: 5,
    justifyContent: "center",
    height: 22,
    width: 35,
  },
  triangle: {
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: Colors.red,
    height: 0,
    width: 0,
  },
})
