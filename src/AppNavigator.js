import React from 'react'
import { createBottomTabNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation'

import * as Icon from "@expo/vector-icons"
import AccountScreen from './components/AccountScreen'
import AddItineraryItem from './components/AddItineraryItem'
import AddPoll from './components/AddPoll'
import AddSuggestion from './components/AddSuggestion'
import AddTripItem from './components/AddTripItem'
import AppContainers from "./AppContainers"
import AuthHandler from './AuthHandler'
import Chat from "./components/Chat"
import Checklist from "./components/Checklist"
import CreateTrip from "./components/CreateTrip"
import Details from "./components/Details"
import EditTrip from "./components/EditTrip"
import HomeScreen from './components/HomeScreen'
import Itinerary from './components/Itinerary'
import NameTrip from "./components/NameTrip"
import Loader from "./components/common/Loader"
import Login from "./components/auth/Login"
import Polls from "./components/Polls"
import Signup from "./components/auth/Signup"
import Suggestions from "./components/Suggestions"

import { Colors, Fonts } from "./constants/style"

import {
  ACCOUNT,
  ADD_CHECKLIST_ITEM,
  ADD_ITINERARY_ITEM,
  ADD_POLL,
  ADD_SUGGESTION,
  APP,
  AUTH,
  AUTH_HANDLER,
  CHAT,
  CHECKLIST,
  CREATE_TRIP,
  DETAILS,
  EDIT_TRIP,
  ITINERARY,
  LOGIN,
  NAME_TRIP,
  POLLS,
  SIGNUP,
  SUGGESTIONS,
  TRIP,
} from "./constants/routes"

const TripStack = createStackNavigator({
  [TRIP]: HomeScreen,
  [CREATE_TRIP]: CreateTrip,
  [ADD_CHECKLIST_ITEM]: AddTripItem,
  [CHECKLIST]: Checklist,
  [DETAILS]: Details,
  [EDIT_TRIP]: EditTrip,
  [ITINERARY]: Itinerary,
  [ADD_ITINERARY_ITEM]: AddItineraryItem,
  [ADD_POLL]: AddPoll,
  [POLLS]: Polls,
  [SUGGESTIONS]: Suggestions,
  [ADD_SUGGESTION]: AddSuggestion,
  [NAME_TRIP]: NameTrip,
  [CHAT]: Chat,
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      shadowColor: "#000000",
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {
        height: 1,
        width: 1
      }
    },
    headerTitleStyle: {
      color: Colors.darkGray,
      fontFamily: Fonts.CerealExtraBold,
      fontSize: 25,
    },
  })
})

TripStack.navigationOptions = ({ navigation }) => {
  if (navigation.state.index > 0) {
    return { tabBarVisible: false }
  } else {
    return { tabBarVisible: true }
  }
}

const AccountStack = createStackNavigator({
  [ACCOUNT]: AccountScreen,
  [CREATE_TRIP]: CreateTrip,
}, {
  navigationOptions: ({ navigation }) => ({
    headerStyle: {
      shadowColor: "#000000",
      shadowOpacity: 0.2,
      shadowRadius: 2,
      shadowOffset: {
        height: 1,
        width: 1
      }
    },
    headerTitleStyle: {
      color: Colors.darkGray,
      fontFamily: Fonts.CerealExtraBold,
      fontSize: 25,
    },
  })
})

AccountStack.navigationOptions = ({ navigation }) => {
  if (navigation.state.index > 0) {
    return { tabBarVisible: false }
  } else {
    return { tabBarVisible: true }
  }
}

const AppStack = createBottomTabNavigator({
  [TRIP]: TripStack,
  [ACCOUNT]: AccountStack,
}, {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state
      let iconName
      if (routeName === TRIP) {
        iconName = "map-pin"
      } else {
        iconName = "user"
      }
      return (
        <Icon.Feather
          color={focused ? Colors.black : Colors.gray}
          name={iconName}
          size={horizontal ? 20 : 26}
          style={{ marginBottom: -3 }}
        />
      )
    },
    tabBarOptions: {
      activeTintColor: Colors.black,
      labelStyle: {
        fontWeight: "bold",
      },
    },
  }),
})

class App extends React.Component {
  static router = AppStack.router

  render() {
    return (
      <AppContainers>
        {({ pending }) => pending
          ? <Loader />
          : <AppStack navigation={this.props.navigation} />
        }
      </AppContainers>
    )
  }
}

const AuthStack = createStackNavigator({
  [LOGIN]: Login,
  [SIGNUP]: Signup,
}, {
  navigationOptions: {
    header: null,
  }
})

export default createSwitchNavigator({
  [AUTH_HANDLER]: AuthHandler,
  [APP]: App,
  [AUTH]: AuthStack,
})
