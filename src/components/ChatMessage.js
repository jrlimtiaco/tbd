import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"

import Text from "./common/Text"

import { DEVICE_WIDTH } from "../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

const ChatMessage = ({ isMyMessage, message }) => {
  return (
    <View
      style={[
        styles.container,
        isMyMessage ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text type={Fonts.CerealBook}>
        {message.message}
      </Text>
    </View>
  )
}

export default ChatMessage

const styles = StyleSheet.create({
  container: {
    borderColor: Colors.lightGray,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: DEFAULT_PADDING,
    marginHorizontal: DEFAULT_PADDING,
    maxWidth: DEVICE_WIDTH * 0.75,
    padding: DEFAULT_PADDING,
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.lightWhiteGray,
  },
})
