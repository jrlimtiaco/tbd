import React, { Component } from "react"
import { ActivityIndicator, StyleSheet } from "react-native"

import Container from "./Container"

export default () => (
  <Container style={styles.container}>
    <ActivityIndicator size="large" />
  </Container>
)

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
})
