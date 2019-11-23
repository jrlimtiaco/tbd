import React from 'react'
import { View, StyleSheet } from 'react-native'

import { Colors, Fonts } from '../../constants/style'
import { isIOS } from '../../utils/device'

import Text from './Text'

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
    elevation: 5
  },
  container: {
    flexGrow: 1,
    margin: 18,
    borderRadius: 6
  },
  description: {
    textAlign: 'center',
    marginBottom: 18,
    width: "75%",
  },
  ios: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 9
  },
  textContainer: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: 18,
    alignItems: 'center'
  },
  title: {
    color: Colors.darkGray,
    fontFamily: Fonts.CerealExtraBold,
    marginBottom: 6,
  },
})

export default EmptyListCard
