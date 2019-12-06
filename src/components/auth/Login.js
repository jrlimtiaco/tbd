import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"

import Button from "../common/Button"
import Container from "../common/Container"
import firebase from "firebase"
import Input from "../common/Input"
import Text from "../common/Text"

import { DEVICE_HEIGHT } from "../../constants/dimensions"
import { SIGNUP } from "../../constants/routes"
import { Colors, Fonts } from "../../constants/style"

class Login extends Component {
  state = {
    email: null,
    password: null,
    pending: false,
  }

  _login = async () => {
    const { email, password } = this.state
    if ([email, password].some(field => !field)) {
      return [this._email, this._password].forEach(input => input.validate())
    } else {
      this._email.validate()
      if (this._email.hasErrors()) return
    }
    try {
      this.setState({ pending: true })
      await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (err) {
      Alert.alert("Error", err.message)
      this.setState({ pending: false })
    }
  }

  _navigateToSignUp = () => {
    this.setState({ email: null, password: null })
    this._email.clearErrors()
    this._password.clearErrors()
    this.props.navigation.navigate(SIGNUP)
  }

  render() {
    return (
      <Container>
        <View style={styles.container}>
          <Text align="center" size="xxlarge">
            Plan your trip with{" "}
            <Text align="center" color={Colors.darkGray} size="xxxxlarge" type={Fonts.CerealExtraBold}>
              Flock
            </Text>
          </Text>
          <Input
            ref={ref => (this._email = ref)}
            containerStyle={styles.input}
            id="email"
            onChangeText={text => this.setState({ email: text })}
            onSubmitEditing={() => this._password.focus()}
            placeholder="Email"
            required
            returnKeyType="next"
            value={this.state.email}
          />
          <Input
            ref={ref => (this._password = ref)}
            containerStyle={styles.input}
            id="password"
            onChangeText={text => this.setState({ password: text })}
            onSubmitEditing={this._login}
            placeholder="Password"
            required
            returnKeyType="done"
            secureTextEntry
            value={this.state.password}
          />
          <Button
            disabled={this.state.pending}
            onPress={this._login}
            pending={this.state.pending}
            style={styles.login}
            transparent
          >
            <Text type={Fonts.CerealBold}>
              Log in
            </Text>
          </Button>
          <Text align="center" color={Colors.darkGray} size="small">
            Don't have an account yet?
          </Text>
          <TouchableOpacity
            onPress={this._navigateToSignUp}
            style={styles.createAccount}
          >
            <Text type={Fonts.CerealBold}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </Container>
    )
  }
}

export default Login

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: DEVICE_HEIGHT * 0.05,
  },
  createAccount: {
    alignSelf: "center",
  },
  input: {
    marginVertical: 10,
  },
  login: {
    alignSelf: "center",
    borderWidth: 2,
    marginVertical: 20,
    width: "50%",
  },
})
