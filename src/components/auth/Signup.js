import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"

import Button from "../common/Button"
import Container from "../common/Container"
import firebase from "firebase"
import Input from "../common/Input"
import Text from "../common/Text"

import { Colors, Fonts } from "../../constants/style"

class Login extends Component {
  state = {
    email: null,
    password: null,
    passwordConfirm: null,
    pending: false,
  }

  _signup = async () => {
    const { email, password, passwordConfirm } = this.state
    if ([email, password, passwordConfirm].some(field => !field)) {
      return [this._email, this._password, this._passwordConfirm].forEach(input => input.validate())
    } else {
      this._email.validate()
      if (this._email.hasErrors()) return
      if (password !== passwordConfirm) return Alert.alert("Error", "Passwords do not match.")
    }
    try {
      this.setState({ pending: true })
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      await firebase.firestore()
        .collection("Users")
        .doc(`${firebase.auth().currentUser.uid}`)
        .set({
          currentTrip: null,
          email,
          trips: [],
        })
    } catch (err) {
      Alert.alert("Error", err.message)
      this.setState({ pending: false })
    }
  }

  render() {
    return (
      <Container>
        <View style={styles.container}>
          <Text color={Colors.darkGray} size="xxxxlarge" type={Fonts.CerealExtraBold}>
            Signup
          </Text>
          <Input
            ref={ref => (this._email = ref)}
            autoFocus
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
            onSubmitEditing={() => this._passwordConfirm.focus()}
            placeholder="Password"
            required
            returnKeyType="next"
            secureTextEntry
            value={this.state.password}
          />
          <Input
            ref={ref => (this._passwordConfirm = ref)}
            containerStyle={styles.input}
            id="passwordConfirm"
            onChangeText={text => this.setState({ passwordConfirm: text })}
            onSubmitEditing={this._signup}
            placeholder="Re-enter password"
            required
            returnKeyType="done"
            secureTextEntry
            value={this.state.passwordConfirm}
          />
          <Button
            disabled={this.state.pending}
            onPress={this._signup}
            pending={this.state.pending}
          >
            <Text type={Fonts.CerealBold}>Signup</Text>
          </Button>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.cancel}
          >
            <Text color={Colors.red} size="xsmall" type={Fonts.CerealBold}>
              Cancel
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
  },
  cancel: {
    alignSelf: "center",
  },
  input: {
    marginVertical: 10,
  },
})
