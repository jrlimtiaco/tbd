import React, { Component } from "react"
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native"

import Button from "../common/Button"
import Container from "../common/Container"
import firebase from "firebase"
import Input from "../common/Input"
import Text from "../common/Text"

import { DEVICE_HEIGHT } from "../../constants/dimensions"
import { Colors, Fonts } from "../../constants/style"

class Login extends Component {
  state = {
    email: null,
    firstName: null,
    lastName: null,
    password: null,
    passwordConfirm: null,
    pending: false,
  }

  _signup = async () => {
    const { email, firstName, lastName, password, passwordConfirm } = this.state
    if ([email, firstName, lastName, password, passwordConfirm].some(field => !field)) {
      return [this._email, this._firstName, this._lastName, this._password, this._passwordConfirm].forEach(input => input.validate())
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
          firstName,
          lastName,
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
            Sign up
          </Text>
          <View style={styles.row}>
            <View style={styles.firstName}>
              <Input
                ref={ref => (this._firstName = ref)}
                autoFocus
                containerStyle={styles.input}
                id="first name"
                onChangeText={firstName => this.setState({ firstName })}
                onSubmitEditing={() => this._lastName.focus()}
                placeholder="First Name"
                required
                returnKeyType="next"
                value={this.state.firstName}
              />
            </View>
            <View style={styles.lastName}>
              <Input
                ref={ref => (this._lastName = ref)}
                containerStyle={styles.input}
                id="last name"
                onChangeText={lastName => this.setState({ lastName })}
                onSubmitEditing={() => this._email.focus()}
                placeholder="Last Name"
                required
                returnKeyType="next"
                value={this.state.lastName}
              />
            </View>
          </View>
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
            style={styles.signUp}
            transparent
          >
            <Text type={Fonts.CerealBold}>Sign up</Text>
          </Button>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.cancel}
          >
            <Text color={Colors.red} type={Fonts.CerealBold}>
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
    marginTop: DEVICE_HEIGHT * 0.05,
  },
  cancel: {
    alignSelf: "center",
  },
  input: {
    marginVertical: 10,
  },
  firstName: {
    flex: 1,
    marginRight: 2,
  },
  lastName: {
    flex: 1,
    marginLeft: 2,
  },
  row: {
    flexDirection: "row",
  },
  signUp: {
    alignSelf: "center",
    borderWidth: 2,
    marginVertical: 20,
    width: "50%",
  },
})
