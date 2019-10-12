import React from "react"
import { StyleSheet } from "react-native"

import * as Icon from "@expo/vector-icons"
import Button from "./Button"
import Text from "./Text"

import { DEVICE_WIDTH } from "../../constants/dimensions"
import { Colors } from "../../constants/style"

export default ({ onPress, text }) => {
  return (
    <Button
      onPress={onPress}
      style={styles.addButton}
    >
      <Icon.Ionicons color={Colors.black} name="md-add" size={20} />
      <Text style={styles.addButtonText}>
        {text}
      </Text>
    </Button>
  )
}

const styles = StyleSheet.create({
  addButton: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: Colors.white,
    borderRadius: 30,
    borderWidth: 2,
    flexDirection: "row",
    width: DEVICE_WIDTH / 2,
  },
  addButtonText: {
    paddingLeft: 10,
  },
})
