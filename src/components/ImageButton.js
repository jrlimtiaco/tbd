import React, { Component } from "react"
import { Modal, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native"
import { Camera } from 'expo-camera'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import * as Icon from "@expo/vector-icons"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from 'expo-permissions'

import Text from "./common/Text"

import { Colors, DEFAULT_PADDING } from "../constants/style"

@connectActionSheet
class ImageButton extends Component {
  state = {
    hasCameraPermission: null,
    showCamera: false,
    type: Camera.Constants.Type.back
  }

  _camera

  _closeCamera = () => {
    this.setState({ showCamera: false })
  }

  _showCamera = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted',
      showCamera: true,
    })
  }

  _switchCameraMode = () => {
    const type = this.state.type === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    this.setState({ type })
  }

  _takePicture = async () => {
    if (this._camera) {
      const photo = await this._camera.takePictureAsync()
      this._resizePhoto(photo)
    }
  }

  _renderCamera = () => {
    if (this.state.hasCameraPermission === null) {
      return null
    } else if (this.state.hasCameraPermission === false) {
      return (
        <View style={styles.container}>
          <StatusBar hidden />
          <TouchableOpacity onPress={this._closeCamera} style={styles.closeButton}>
            <Icon.Ionicons color={Colors.darkGray} name="ios-close" size={40} />
          </TouchableOpacity>
          <Text>No access to camera</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.cameraContainer}>
          <StatusBar hidden />
          <TouchableOpacity onPress={this._closeCamera} style={styles.closeButton}>
            <Icon.Ionicons color={Colors.white} name="ios-close" size={40} />
          </TouchableOpacity>
          <Camera ref={ref => (this._camera = ref)} style={styles.cameraContainer} type={this.state.type}>
          <View style={styles.footer}>
            <View style={styles.spacer} />
            <TouchableOpacity onPress={this._takePicture} style={styles.button}>
              <View style={styles.buttonInner} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._switchCameraMode} style={styles.spacer}>
              <Text color={Colors.white}>Flip</Text>
            </TouchableOpacity>
          </View>
          </Camera>
        </View>
      )
    }
  }

  _showImageLibrary = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    if (status === "granted") {
      const photo = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      })
      this._resizePhoto(photo)
    }
  }

  _resizePhoto = async (photo) => {
    const resize = photo.height > photo.width ? { height: 400 } : { width: 250 }
    const resizedPhoto = await ImageManipulator.manipulateAsync(photo.uri, [{ resize }])
    if (this.state.showCamera) {
      this.setState({ showCamera: false })
    }
    this.props.setImage(resizedPhoto)
  }

  _showImageOptions = () => {
    this.props.showActionSheetWithOptions({
        options: ["Take a Photo", "Choose from your Library", "Cancel"],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this._showCamera()
            break
          case 1:
            this._showImageLibrary()
            break
          default:
            break
        }
      }
    )
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this._showImageOptions}
        style={this.props.style}
      >
        {this.props.children}
        <Modal
          animationType="slide"
          onRequestClose={() => null}
          transparent={false}
          visible={this.state.showCamera}
        >
          {this._renderCamera()}
        </Modal>
      </TouchableOpacity>
    )
  }
}

export default ImageButton

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 40,
    justifyContent: "space-around",
    height: 80,
    width: 80,
  },
  buttonInner: {
    backgroundColor: Colors.white,
    borderColor: Colors.black,
    borderRadius: 35,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  cameraContainer: {
    flex: 1,
  },
  closeButton: {
    left: 0,
    top: 0,
    padding: 20,
    position: "absolute",
    zIndex: 100,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    alignItems: "center",
    backgroundColor: Colors.black,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: DEFAULT_PADDING,
    bottom: 0,
    left: 0,
    right: 0,
    position: "absolute",
  },
  spacer: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
})
