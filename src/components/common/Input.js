import React, { Component } from "react"
import { Keyboard, StyleSheet, TextInput, TextInputProps, View } from "react-native"

import Text from "./Text"

import { Colors, Fonts } from "../../constants/style"

class Input extends Component {
  state = {
    error: null,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value && this.state.error) {
      this.validate()
    }
  }

  blur = () => this._input && this._input.blur()

  clearErrors = () => this.setState({ error: null })

  focus = () => this._input && this._input.focus()

  hasErrors = () => !!this.state.error

  isFocused = () => this._input && this._input.isFocused()

  onBlur = () => {
    this.validate()
    this.props.onBlur && this.props.onBlur()
  }

  validate = () => {
    const { id, required, value } = this.props
    if (required && !value) {
      if (id === "passwordConfirm") return this.setState({ error: `Please confirm password.` })
      return this.setState({ error: `Please enter ${id}.` })
    }
    if (id === "email" && value && !/(.+)@(.+){1,}\.(.+){1,}/.test(value)) {
      if (required) return this.setState({ error: `Must be a valid ${id}.` })
      return this.setState({ error: `Invalid ${id}.` })
    }
    // if (id === "phone" && numbersOnly(value).length !== 10) {
    //   if (required) return this.setState({ error: `Must be a valid ${id}.` })
    //   return this.setState({ error: `Invalid ${id}.` })
    // }
    this.clearErrors()
  }

  render() {
    const {
      autoCapitalize,
      containerStyle,
      errorStyle,
      errorTextStyle,
      maxLength = 50,
      onSubmitEditing = Keyboard.dismiss,
      placeholderTextColor = Colors.lightGray,
      style,
      value,
    } = this.props
    const { error } = this.state
    return (
      <View style={containerStyle}>
        <TextInput
          {...this.props}
          ref={ref => (this._input = ref)}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          maxLength={maxLength}
          onBlur={this.onBlur}
          onSubmitEditing={onSubmitEditing}
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, style, error && errorStyle]}
          underlineColorAndroid="transparent"
          value={value}
        />
        {error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}
      </View>
    )
  }
}

export default Input

const styles = StyleSheet.create({
  error: {
    color: Colors.red,
    fontSize: 11,
    marginTop: 5,
  },
  input: {
    alignSelf: "stretch",
    borderBottomColor: Colors.darkGray,
    borderBottomWidth: 1,
    fontFamily: Fonts.CerealMedium,
    fontSize: 14,
    paddingVertical: 5,
  },
})
