import React, { Component } from "react"
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import config from "../config"

import * as Icon from "@expo/vector-icons"
import Flex from "./common/Flex"
import Headline from "./common/Headline"
import Text from "./common/Text"

import { Colors, DEFAULT_PADDING, Fonts } from "../constants/style"

const COUNTRY_FORMAT = "country:us"

class LocationPicker extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIcon}>
          <Icon.AntDesign color={Colors.darkGray} name="left" size={25} />
        </TouchableOpacity>
      ),
    }
  }

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
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${config.googleApiKey}&input=${input}&components=${COUNTRY_FORMAT}`
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
          const selectLocation = this.props.navigation.getParam("selectLocation")
          if (selectLocation) {
            selectLocation(filterRowData)
          }
          this.props.navigation.goBack()
        }}
      >
        <Icon.Feather name="map-pin" size={30} />
        <Text size="large" style={styles.rowDataText}>
          {filterRowData.title}
        </Text>
      </TouchableOpacity>
    )
  }

  _onSubmitEditing = () => {
    const selectLocation = this.props.navigation.getParam("selectLocation")
    if (this.state.input && selectLocation) {
      selectLocation(this.state.input)
    }
    this.props.navigation.goBack()
  }

  render() {
    const { data, input } = this.state
    return (
      <Flex>
        <View style={styles.headline}>
          <Headline>Destination</Headline>
        </View>
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
          onSubmitEditing={this._onSubmitEditing}
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
      </Flex>
    )
  }
}

export default LocationPicker

const styles = StyleSheet.create({
  headline: {
    marginHorizontal: 15,
  },
  headerIcon: {
    paddingHorizontal: DEFAULT_PADDING / 2,
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
