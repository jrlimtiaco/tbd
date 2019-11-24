import React from 'react'
import { View, StyleSheet } from 'react-native'

import { DEVICE_WIDTH } from '../../constants/dimensions'
import { Colors, DEFAULT_PADDING, Fonts } from '../../constants/style'
import { isIOS } from '../../utils/device'

import Text from './Text'

const CARD_PADDING = DEVICE_WIDTH * 0.05

const EmptyListCard = ({ description, title }) => (
  <View
    style={[
      styles.container,
      isIOS ? styles.ios : styles.android,
    ]}
  >
    <View style={styles.textContainer}>
      <Text style={styles.title} size="xxlarge">
        {title}
      </Text>
      <Text style={styles.description}>
        {description}
      </Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  android: {
    elevation: 5,
  },
  container: {
    borderRadius: 6,
    flexGrow: 1,
    margin: CARD_PADDING,
    marginTop: CARD_PADDING + DEFAULT_PADDING,
  },
  description: {
    marginBottom: CARD_PADDING,
    textAlign: 'center',
    width: "75%",
  },
  ios: {
    shadowColor: Colors.black,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: CARD_PADDING,
  },
  title: {
    color: Colors.darkGray,
    fontFamily: Fonts.CerealExtraBold,
    marginBottom: 6,
  },
})

export default EmptyListCard
