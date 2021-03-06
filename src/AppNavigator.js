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
import Calendar from "./components/Calendar"
import Chat from "./components/Chat"
import Checklist from "./components/Checklist"
import CreateTrip from "./components/CreateTrip"
import Details from "./components/Details"
import EditTrip from "./components/EditTrip"
import HomeScreen from './components/HomeScreen'
import Invites from './components/Invites'
import Itinerary from './components/Itinerary'
import NameTrip from "./components/NameTrip"
import Loader from "./components/common/Loader"
import LocationPicker from "./components/LocationPicker"
import Login from "./components/auth/Login"
import Polls from "./components/Polls"
import Search from "./components/Search"
import Signup from "./components/auth/Signup"
import Slideshow from "./components/Slideshow"
import Suggestions from "./components/Suggestions"
import Trips from "./components/Trips"
import UserList from "./components/UserList"

import { InviteCountTab } from "./components/InviteCount"
import UnreadCount, { TAB } from "./components/UnreadCount"

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
  CALENDAR,
  CHAT,
  CHECKLIST,
  CREATE_TRIP,
  DETAILS,
  EDIT_TRIP,
  INVITES,
  ITINERARY,
  LOCATION,
  LOGIN,
  NAME_TRIP,
  POLLS,
  SEARCH,
  SIGNUP,
  SLIDESHOW,
  SUGGESTIONS,
  TRIP,
  TRIPS,
  USER_LIST,
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
  [LOCATION]: LocationPicker,
  [CALENDAR]: Calendar,
  [SEARCH]: Search,
  [USER_LIST]: UserList,
}, {
  headerLayoutPreset: "center",
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
  [LOCATION]: LocationPicker,
  [CALENDAR]: Calendar,
  [TRIPS]: Trips,
  [SEARCH]: Search,
  [INVITES]: Invites,
}, {
  headerLayoutPreset: "center",
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
        <>
          <Icon.Feather
            color={focused ? Colors.black : Colors.gray}
            name={iconName}
            size={horizontal ? 20 : 26}
            style={{ marginBottom: -3 }}
          />
          {routeName === ACCOUNT && <InviteCountTab />}
          {routeName === TRIP && <UnreadCount type={TAB} />}
        </>
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
  [SLIDESHOW]: Slideshow,
})
