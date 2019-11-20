import React, { useMemo } from "react"
import { StyleSheet, View } from "react-native"
import moment from "moment"

import FlexImage from "./common/FlexImage"
import Text from "./common/Text"

import { DEVICE_WIDTH } from "../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

const ChatMessage = ({ chatMessage, showName }) => {
  const { createdAt, createdBy, image, message } = chatMessage

  const header = useMemo(() => {
    return (
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text size="small">
            {`${createdBy.firstName.substring(0, 1)}${createdBy.lastName.substring(0, 1)}`}
          </Text>
        </View>
        <Text style={styles.name}>
          {createdBy.firstName}
        </Text>
        <Text color={Colors.gray} size="xsmall">
          {moment(createdAt).format("h:mm a")}
        </Text>
      </View>
    )
  }, [createdAt, createdBy])

  if (!image) {
    return (
      <>
        <View style={styles.container}>
          <Text type={Fonts.CerealBook}>
            {message}
          </Text>
        </View>
        {showName && header}
      </>
    )
  } else if (!message) {
    return (
      <>
        <FlexImage
          source={{ uri: image }}
          style={styles.image}
        />
        {showName && header}
      </>
    )
  } else {
    return (
      <>
        <View style={styles.container}>
          <Text type={Fonts.CerealBook}>
            {message}
          </Text>
        </View>
        <FlexImage
          source={{ uri: image }}
          style={styles.image}
        />
        {showName && header}
      </>
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
    height: 40,
    width: 40,
  },
  container: {
    alignSelf: "flex-start",
    borderColor: Colors.darkGray,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: DEFAULT_PADDING * 0.75,
    marginHorizontal: DEFAULT_PADDING,
    padding: DEFAULT_PADDING * 0.75,
  },
  image: {
    alignSelf: "flex-start",
    borderRadius: 6,
    marginBottom: DEFAULT_PADDING,
    marginHorizontal: DEFAULT_PADDING,
    width: DEVICE_WIDTH * (2/3),
  },
  name: {
    marginHorizontal: 5,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: DEFAULT_PADDING / 2,
    marginHorizontal: DEFAULT_PADDING,
  },
})
