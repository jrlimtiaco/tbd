import React, { Component } from "react"
import { FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { Subscribe } from "unstated"
import firebase from "firebase"

import * as Icon from "@expo/vector-icons"
import ChatInput from "./ChatInput"
import ChatMessage from "./ChatMessage"
import Flex from "./common/Flex"

import ChatContainer from "../containers/ChatContainer"
import ProfileContainer from "../containers/ProfileContainer"

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
        chatMessage={item}
      />
    )
  }

  _setLastReadMessage = (messageId, currentTripId) => {
    firebase
      .firestore()
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .collection("LastRead")
      .doc(currentTripId)
      .set({ message: messageId }, { merge: true })
  }

  render() {
    return (
      <Subscribe to={[ChatContainer, ProfileContainer]}>
        {(chatContainer, profileContainer) => {
          const { chat } = chatContainer.state
          const { lastRead, profile } = profileContainer.state
          if (chat.length) {
            const lastMessageInChat = chat[0]
            if (lastMessageInChat.id !== lastRead.message) {
              this._setLastReadMessage(lastMessageInChat.id, profile.currentTrip)
            }
          }
          return (
            <Flex>
              <FlatList
                ref={ref => (this._chat = ref)}
                data={chat}
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
