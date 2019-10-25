import React from "react"
import { StyleSheet, View } from "react-native"

import FlexImage from "./common/FlexImage"
import Text from "./common/Text"

import { DEVICE_WIDTH } from "../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

const ChatMessage = ({ chatMessage, isMyMessage }) => {
  const { image, message } = chatMessage
  if (!image) {
    return (
      <View
        style={[
          styles.container,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text type={Fonts.CerealBook}>
          {message}
        </Text>
      </View>
    )
  } else if (!message) {
    return (
      <FlexImage
        source={{ uri: image }}
        style={[styles.image, isMyMessage ? styles.myMessage : styles.otherMessage ]}
      />
    )
  } else {
    return (
      <>
        <View
          style={[
            styles.container,
            isMyMessage ? styles.myMessage : styles.otherMessage,
          ]}
        >
          <Text type={Fonts.CerealBook}>
            {message}
          </Text>
        </View>
        <FlexImage
          source={{ uri: image }}
          style={[styles.image, isMyMessage ? styles.myMessage : styles.otherMessage ]}
        />
      </>
    )
  }
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
  image: {
    borderRadius: 6,
    marginBottom: DEFAULT_PADDING,
    marginHorizontal: DEFAULT_PADDING,
    width: DEVICE_WIDTH * (2/3),
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: Colors.lightWhiteGray,
  },
})
