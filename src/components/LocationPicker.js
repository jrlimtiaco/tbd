import React, { Component } from "react"
import { FlatList, Modal, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"

import * as Icon from "@expo/vector-icons"
import Text from "./common/Text"

import { Colors, Fonts } from "../constants/style"

const API_KEY = "AIzaSyBTO4ymkNSBsV7kWtKCdZNPdwPgslpLAYI"
const COUNTRY_FORMAT = "country:us"

class LocationPicker extends Component {
  state = {
    data: [],
    input: null,
  }

  _onChangeText = async input => {
    if (!input) {
      return this.setState({ data: [], input: null })
    } else {
      this.setState({ input: input.trim() })
    }
    try {
      const result = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${input}&components=${COUNTRY_FORMAT}`
      )
      const data = await result.json()
      this.setState({ data: data.predictions })
    } catch (err) {
      console.log("## LocationPicker _onChangeText err: ", err)
    }
  }

  _filterRowData = rowData => {
    const data = rowData.description.split(",")
    return { title: data[0] }
  }

  _renderItem = ({ item }) => {
    const filterRowData = this._filterRowData(item)
    return (
      <TouchableOpacity
        key={filterRowData.title}
        style={styles.itemContainerStyle}
        onPress={() => {
          this.props.selectLocation(filterRowData)
          this.setState({ data: [], input: null })
          this.props.onClose()
        }}
      >
        <Icon.Feather name="map-pin" size={30} />
        <Text size="large" style={styles.rowDataText}>
          {filterRowData.title}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { onClose, selectLocation, visible } = this.props
    const { data, input } = this.state
    return (
      <Modal
        animationType={"fade"}
        onRequestClose={onClose}
        supportedOrientations={["portrait"]}
        transparent={false}
        visible={visible}
      >
        <SafeAreaView style={styles.container}>
          <Text
            color={Colors.darkGray}
            size="xxxxxlarge"
            style={{ paddingLeft: 15, paddingVertical: 20 }}
            type={Fonts.CerealExtraBold}
          >
            Destination
          </Text>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            clearButtonMode="while-editing"
            defaultValue={input}
            onChangeText={this._onChangeText}
            placeholder='Try "New York"'
            placeholderTextColor={Colors.gray}
            returnKeyType="done"
            style={styles.textInput}
            underlineColorAndroid="transparent"
            onSubmitEditing={() => {
              if (input) {
                selectLocation(input)
              }
              this.setState({ data: [], input: null })
              onClose()
            }}
          />
          <FlatList
            contentContainerStyle={styles.list}
            data={data}
            ItemSeparatorComponent={() => <View style={styles.separatorStyle} />}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            keyExtractor={item => item.id}
            renderItem={this._renderItem}
          />
        </SafeAreaView>
      </Modal>
    )
  }
}

export default LocationPicker

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainerStyle: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 15,
  },
  list: {
    marginHorizontal: 15,
  },
  rowDataText: {
    marginLeft: 10,
  },
  separatorStyle: {
    backgroundColor: Colors.lightGray,
    height: 1,
  },
  textInput: {
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
    fontFamily: Fonts.CerealExtraBold,
    fontSize: 20,
    marginHorizontal: 15,
    paddingVertical: 10,
  },
})
