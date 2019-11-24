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
    <View style={styles.titleContainer}>
      <Text align="center" style={styles.title} size="xxlarge">
        {title}
      </Text>
    </View>
    <View style={styles.descriptionContainer}>
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
  descriptionContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    padding: CARD_PADDING,
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
  title: {
    color: Colors.darkGray,
    fontFamily: Fonts.CerealExtraBold,
  },
  titleContainer: {
    backgroundColor: Colors.lightGray,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingVertical: DEFAULT_PADDING / 2,
  },
})

export default EmptyListCard
