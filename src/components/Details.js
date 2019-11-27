import React, { Component } from "react"
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Polls from "./Polls"
import Suggestions from "./Suggestions"
import Text from "./common/Text"
import UnreadCount, { POLL, SUGGESTION } from "./UnreadCount"

import { ADD_POLL, ADD_SUGGESTION, POLLS, SUGGESTIONS } from "../constants/routes"
import { Colors, Fonts, DEFAULT_PADDING } from "../constants/style"

const items = [
  {
    id: "polls",
    icon: "check-square",
    route: POLLS,
    title: "Vote/Polls",
  },
  {
    id: "suggestions",
    icon: "message-circle",
    route: SUGGESTIONS,
    title: "Suggestions",
  },
]

class Details extends Component {
  static navigationOptions = ({ navigation }) => {
    const create = navigation.getParam("create")
    return {
      headerTitle: "Polls & Suggestions",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={create} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="plus" size={25} />
        </TouchableOpacity>
      ),
    }
  }

  state = {
    tab: POLLS,
  }

  componentDidMount() {
    this.props.navigation.setParams({ create: this._create })
  }

  _create = () => {
    this.props.navigation.navigate(this.state.tab === POLLS ? ADD_POLL : ADD_SUGGESTION)
  }

  _renderTab = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => this.setState({ tab: item.route })}
        style={[
          styles.tabItem,
          this.state.tab === item.route && { backgroundColor: "rgba(201,201,201,0.5)" }
        ]}
      >
        <Icon.Feather name={item.icon} size={15} />
        <Text size="small" style={styles.tabText}>
          {item.title}
        </Text>
        {item.id === "polls" && <UnreadCount type={POLL} />}
        {item.id === "suggestions" && <UnreadCount type={SUGGESTION} />}
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Flex>
        <View style={styles.tabs}>
          {items.map(this._renderTab)}
        </View>
        <View style={styles.container}>
          {this.state.tab === POLLS && (
            <Polls />
          )}
          {this.state.tab === SUGGESTIONS && (
            <Suggestions />
          )}
        </View>
      </Flex>
    )
  }
}

export default Details

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DEFAULT_PADDING,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
  tabs: {
    alignItems: "center",
    flexDirection: "row",
  },
  tabItem: {
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
    borderLeftWidth: 1,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: DEFAULT_PADDING,
  },
  tabText: {
    paddingLeft: 5,
  },
})
