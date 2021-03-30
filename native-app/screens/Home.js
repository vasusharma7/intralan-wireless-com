import React, { Component } from "react";
import Connections from "./Connections";
import Settings from "./Settings";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "connections", title: "Connections", icon: "network" },
        { key: "settings", title: "Settings", icon: "settings" },
      ],
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps) === JSON.stringify(this.props)) return;
    console.log("received new props in Home:) -> ", this.props);
  }
  // renderScene = BottomNavigation.SceneMap({
  //   connections: Connections,
  //   settings: Settings,
  // });
  setIndex = (ind) => this.setState({ index: ind });
  bottomNavigation = () =>
    createMaterialBottomTabNavigator(
      {
        settings: { screen: Settings, icon: "settings" },
        connections: { screen: Connections, icon: "network" },
      },
      {
        initialRouteName: "connections",
        activeColor: "#F44336",
      }
    );
  render() {
    return <></>;
  }
}
