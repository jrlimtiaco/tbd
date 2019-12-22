import React, { useCallback, useState } from "react"
import { AsyncStorage, ScrollView, StyleSheet, View } from "react-native"
import * as Icon from "@expo/vector-icons"

import Button from "./common/Button"
import Text from "./common/Text"

import { DEVICE_WIDTH } from "../constants/dimensions"
import { APP } from "../constants/routes"
import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

export const SLIDESHOW_KEY = "SLIDESHOW_KEY"

const slides = [
  {
    icon: "map",
    text: "Itinerary & Checklist",
    subText: "Easily collaborate on a trip itinerary and checklist",
  },
  {
    icon: "edit",
    text: "Polls & Suggestions",
    subText: "Make the most of your trip with polls and suggestions",
  },
  {
    icon: "message-square",
    text: "Chat",
    subText: "Easily communicate with everyone through the built in chat",
  },
]

const Slide = ({ slide }) => {
  return (
    <View style={styles.slideContainer}>
      <View style={styles.slideImage}>
        <Icon.Feather name={slide.icon} size={100} />
      </View>
      <Text size="xxxlarge" style={styles.text}>
        {slide.text}
      </Text>
      <Text style={styles.subText}>
        {slide.subText}
      </Text>
    </View>
  )
}

const SlideIndicators = ({ activeIndex, slides }) => {
  return (
    <View style={styles.indicatorContainer}>
      {slides.map((slide, index) => (
        <View
          key={index}
          style={[
            styles.indicator,
            index === activeIndex && styles.indicatorActive
          ]}
        />
      ))}
    </View>
  )
}

const Slideshow = ({ navigation }) => {
  const [index, setIndex] = useState(0)

  const onMomentumScrollEnd = useCallback(e => {
    const offsetX = e.nativeEvent.contentOffset.x
    const index = Math.round(offsetX / DEVICE_WIDTH)
    setIndex(index)
  }, [])

  const onPress = useCallback(async () => {
    await AsyncStorage.setItem(SLIDESHOW_KEY, SLIDESHOW_KEY)
    navigation.navigate(APP)
  }, [navigation])

  return (
    <View>
      <ScrollView
        bounces
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
      >
        {slides.map((slide, index) => <Slide key={index} slide={slide} />)}
      </ScrollView>
      <SlideIndicators activeIndex={index} slides={slides} />
      <Button onPress={onPress} transparent style={styles.button}>
        <Text>Get Started</Text>
      </Button>
    </View>
  )
}

export default Slideshow

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    borderColor: Colors.darkGray,
    borderWidth: 2,
    width: DEVICE_WIDTH / 2
  },
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  indicator: {
    backgroundColor: Colors.white,
    borderColor: Colors.darkGray,
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    marginHorizontal: 5,
    width: 18,
  },
  indicatorActive: {
    backgroundColor: Colors.darkGray,
    borderRadius: 10,
    borderWidth: 0,
    height: 20,
    width: 20,
  },
  indicatorContainer: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    marginVertical: DEFAULT_PADDING,
  },
  slideContainer: {
    height: 350,
    width: DEVICE_WIDTH,
  },
  slideImage: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  subText: {
    color: Colors.darkGray,
    marginBottom: DEFAULT_PADDING,
    paddingHorizontal: DEFAULT_PADDING * 2,
    textAlign: "center",
  },
  text: {
    fontFamily: Fonts.CerealExtraBold,
    marginBottom: DEFAULT_PADDING / 2,
    textAlign: "center",
  },
})
