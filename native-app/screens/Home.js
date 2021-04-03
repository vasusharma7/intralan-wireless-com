import React, { Component } from "react";
import Connections from "./Connections";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Settings from "./Settings";
import { Appbar } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
const Tab = createMaterialBottomTabNavigator();

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      title: "Connections",
      routes: [
        {
          key: "connections",
          screen: Connections,
          title: "Connections",
          icon: "network",
        },
        { key: "settings", screen: Settings, title: "Settings", icon: "tools" },
      ],
    };
  }

  render() {
    return (
      <>
        <Appbar.Header>
          <Appbar.Content
            title="IntraLAN Communication"
            subtitle={this.state.title}
          />
        </Appbar.Header>
        <Tab.Navigator
          initialRouteName="Connections"
          activeColor="#fff"
          inactiveColor="#3e2465"
          barStyle={{ backgroundColor: "crimson" }}
        >
          {this.state.routes.map(({ key, screen, title, icon }) => (
            <Tab.Screen
              name={title}
              component={screen}
              key={key}
              options={{
                tabBarLabel: title,
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name={icon} color={color} size={26} />
                ),
              }}
            />
          ))}
        </Tab.Navigator>
      </>
    );
  }
}
