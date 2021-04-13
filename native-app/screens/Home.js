import React, { Component } from "react";
import Connections from "./Connections";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Settings from "./Settings";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { connect } from "react-redux";
import Playback from "./Playback";
import Message from './Message';
import IncomingCall from "./IncomingCall";
import InCall from "./InCall";

const Tab = createMaterialBottomTabNavigator();

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      color: "black",
      routes: [
        {
          key: "connections",
          screen: Connections,
          title: "Connections",
          icon: "network",
        },
        {
          key: "playback",
          screen: Playback,
          title: "File Select",
          icon: "file",
        },
        {
          key: "chat",
          screen: Message,
          title: 'My Messages',
          icon: "message"
        },
        { key: "settings", screen: Settings, title: "Settings", icon: "tools" },
      ],
    };
  }
  paintTheScreen() {
    switch (this.props.connStatus) {
      // switch ("inCall") {
        case "incoming":
          return <IncomingCall />;
          case "inCall":
            case "ringing":
              return <InCall />;
              default:
                return (
                  <>
          
           
            <Tab.Navigator
              initialRouteName="Connections"
              activeColor="#99EFF8"
              inactiveColor="#fff"
              barStyle={{ backgroundColor: this.state.color }}
              >
              {this.state.routes.map(({ key, screen, title, icon }) => (
                <Tab.Screen
                name={title}
                component={screen}
                key={key}
                options={{
                  tabBarLabel: title,
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons
                    name={icon}
                    color={color}
                    size={26}
                    />
                    ),
                  }}
                  />
                  ))}
            </Tab.Navigator>
          </>
        );
      }
    }
    render() {
      return (
        this.paintTheScreen()
      )
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
