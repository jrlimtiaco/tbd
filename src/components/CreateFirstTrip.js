import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { withNavigation } from "react-navigation"

import Button from "./common/Button"
import Flex from "./common/Flex"
import Text from "./common/Text"

import { CREATE_TRIP } from "../constants/routes"
import { Colors, Fonts } from "../constants/style"

class CreateFirstTrip extends Component {
  render() {
    const { navigation } = this.props
    return (
      <Flex style={styles.createContainer}>
        <Text size="xxxxxlarge" type={Fonts.CerealExtraBold}>
          Where to?
        </Text>
        <Text size="medium" style={styles.createText}>
          Start planning your first adventure
        </Text>
        <Button
          onPress={() => navigation.navigate(CREATE_TRIP)}
          style={styles.createButton}
          transparent
        >
          <Text size="medium">
            Create Trip
          </Text>
        </Button>
      </Flex>
    )
  }
}

export default withNavigation(CreateFirstTrip)

const styles = StyleSheet.create({
  createButton: {
    borderWidth: 2,
  },
  createContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  createText: {
    padding: 20,
  },
})
