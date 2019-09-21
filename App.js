import React from "react"
import Root from "./src/Root"
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

const App = () => {
  return (
    <ActionSheetProvider>
      <Root />
    </ActionSheetProvider>
  )
}

export default App
