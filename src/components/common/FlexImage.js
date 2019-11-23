import React, { useEffect, useState } from "react"
import { Image, StyleSheet } from "react-native"

import { DEVICE_WIDTH } from "../../constants/dimensions"
import { Colors, DEFAULT_PADDING, Fonts } from "../../constants/style"

const FlexImage = ({ resizeMode, source, style }) => {
  const [aspectRatio, setAspectRatio] = useState(1)

  useEffect(() => {
    Image.getSize(
      source.uri,
      (width, height) => setAspectRatio(width / height),
      (err) => console.log("## Image getSize:", err)
    )
  }, [source])

  return (
    <Image
      resizeMode={resizeMode || "contain"}
      source={source}
      style={[styles.image, { aspectRatio }, style]}
    />
  )
}

export default FlexImage

const styles = StyleSheet.create({
  image: {
    width: "100%",
  },
})
