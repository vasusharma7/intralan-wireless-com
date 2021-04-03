import React, { Component } from "react";
import Connections from "./Connections";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Settings from "./Settings";
import { Appbar } from "react-native-paper";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Playback from "./Playback";
import { connect } from "react-redux";
const Tab = createMaterialBottomTabNavigator();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      title: "I am being Developed",
      routes: [
        {
          key: "connections",
          screen: Connections,
          title: "Connections",
          icon: "network",
        },
        { key: "settings", screen: Settings, title: "Settings", icon: "tools" },
        {
          key: "playback",
          screen: Playback,
          title: "File Select",
          icon: "file",
        },
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
            style={{
              alignItems: "center",
            }}
          />
        </Appbar.Header>
        <Tab.Navigator
          initialRouteName="Connections"
          activeColor="#fff"
          inactiveColor="#000"
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

const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
    localPeer: state.stream.localPeer,
    remotePeer: state.stream.remotePeer,
    connStatus: state.data.connStatus,
    screenStatus: state.data.screenStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocalPeer: (info) => dispatch(setLocalPeer(info)),
    setRemotePeer: (info) => dispatch(setRemotePeer(info)),
    setScreenStatus: (status) => dispatch(setScreenStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
