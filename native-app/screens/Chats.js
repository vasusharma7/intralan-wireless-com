import { createStackNavigator } from "@react-navigation/stack";
import React, { Component } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, View } from "react-native";
import { List, Text } from "react-native-paper";
import { connect } from "react-redux";
import { ChatScreen } from "./ChatScreen";
import { ChatSelect } from "./ChatSelect";

const ChatStack = createStackNavigator();
export class Chats extends Component {
  render() {
    return (
      <ChatStack.Navigator
        initialRouteName="Chats "
        screenOptions={{
          headerShown: false,
        }}
      >
        <ChatStack.Screen name="Chats " component={ChatSelect} />
        <ChatStack.Screen name="ChatScreen" component={ChatScreen} />
      </ChatStack.Navigator>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chats);
