import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { startCase } from "lodash"
import moment from "moment"

import FlexImage from "./common/FlexImage"
import Text from "./common/Text"

import { DEVICE_WIDTH } from "../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

const ChatMessage = ({ chatMessage, isFirstMessage }) => {
  const { createdAt, createdBy, image, message } = chatMessage

  const avatar = useMemo(() => {
    return (
      <View style={styles.avatar}>
        <Text size="small">
          {`${createdBy.firstName.substring(0, 1).toUpperCase()}${createdBy.lastName.substring(0, 1).toUpperCase()}`}
        </Text>
      </View>
    )
  }, [createdBy])

  const name = useMemo(() => {
    return (
      <View style={styles.row}>
        <Text style={styles.name}>
          {startCase(createdBy.firstName)}
        </Text>
        <Text color={Colors.gray} size="xsmall">
          {moment(createdAt).format("h:mm a")}
        </Text>
      </View>
    )
  }, [createdAt, createdBy])

  if (!image) {
    return (
      <View style={[styles.wrapper, isFirstMessage && styles.firstMessage]}>
        {isFirstMessage && avatar}
        <View style={styles.container}>
          {isFirstMessage && name}
          <View style={[styles.message, !isFirstMessage && styles.extraSpacing]}>
            <Text type={Fonts.CerealBook}>
              {message}
            </Text>
          </View>
        </View>
      </View>
    )
  } else if (!message) {
    return (
      <View style={[styles.wrapper, isFirstMessage && styles.firstMessage]}>
        {isFirstMessage && avatar}
        <View style={styles.container}>
          {isFirstMessage && name}
          <FlexImage
            source={{ uri: image }}
            style={[styles.image, !isFirstMessage && styles.extraSpacing]}
          />
        </View>
      </View>
    )
  } else {
    return (
      <View style={[styles.wrapper, isFirstMessage && styles.firstMessage]}>
        {isFirstMessage && avatar}
        <View style={styles.container}>
          {isFirstMessage && name}
          <View style={[styles.message, !isFirstMessage && styles.extraSpacing]}>
            <Text type={Fonts.CerealBook}>
              {message}
            </Text>
          </View>
          <FlexImage
            source={{ uri: image }}
            style={[styles.image, !isFirstMessage && styles.extraSpacing]}
          />
        </View>
      </View>
    )
  }
}

export default ChatMessage

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    borderColor: Colors.black,
    borderWidth: 2,
    borderRadius: 20,
    justifyContent: "center",
    marginLeft: 10,
    height: 40,
    width: 40,
  },
  container: {
    flex: 1,
  },
  extraSpacing: {
    marginLeft: 60,
  },
  firstMessage: {
    marginTop: DEFAULT_PADDING * 0.75,
  },
  image: {
    alignSelf: "flex-start",
    borderRadius: 6,
    marginBottom: DEFAULT_PADDING,
    marginLeft: 10,
    width: DEVICE_WIDTH * 0.6,
  },
  message: {
    alignSelf: "flex-start",
    marginBottom: DEFAULT_PADDING * 0.75,
    marginHorizontal: 10,
  },
  name: {
    fontFamily: Fonts.CerealExtraBold,
    marginLeft: 10,
    marginRight: 5,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
  },
  wrapper: {
    flexDirection: "row",
  },
})
