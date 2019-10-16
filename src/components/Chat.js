import React, { Component } from "react"
import { FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import ChatInput from "./ChatInput"
import ChatMessage from "./ChatMessage"
import Flex from "./common/Flex"

import ChatContainer from "../containers/ChatContainer"

import { Colors, DEFAULT_PADDING } from "../constants/style"

class Chat extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "Chat",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
    }
  }

  _chat

  _onFocus = () => {
    if (this._chat) {
      this._chat.scrollToOffset({ offset: 0, animated: true })
    }
  }

  _renderItem = ({ item }) => {
    return (
      <ChatMessage
        isMyMessage={item.createdBy === firebase.auth().currentUser.uid}
        message={item}
      />
    )
  }

  render() {
    return (
      <Subscribe to={[ChatContainer]}>
        {(chatContainer) => {
          return (
            <Flex>
              <FlatList
                ref={ref => (this._chat = ref)}
                data={chatContainer.state.chat}
                inverted
                keyExtractor={item => item.id}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
              />
              <ChatInput
                onFocus={this._onFocus}
              />
            </Flex>
          )
        }}
      </Subscribe>
    )
  }
}

export default Chat

const styles = StyleSheet.create({
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
  },
})
