import React, { Component } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import nodejs from "nodejs-mobile-react-native";
import Home from "./screens/Home";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Settings from "./screens/Settings";
import Connections from "./screens/Connections";

const socketIOClient = require("socket.io-client");
const Netmask = require("netmask").Netmask;
const Tab = createMaterialBottomTabNavigator();

import "./config.js";

const options = {
  taskName: "Example",
  taskTitle: "ExampleTask title",
  taskDesc: "ExampleTask description",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap",
  },
  color: "#ff00ff",
  parameters: {
    delay: 1000,
  },
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: {},
      info: {},
      search: true,
      interval: -1,
      block: "",
      ips: [],
      waitTime: 1000,
    };
  }
  handleBlockChange = () => {
    const generator = new Netmask(this.state.block);
    const collector = [];
    generator.forEach((ip) => collector.push(ip));
    this.setState({ ips: collector }, this.handleIpsChange);
  };

  handleConnectionChange = () => {
    console.log(
      "connections found : ",
      Object.keys(this.state.connections).length
    );
    for (let ip in this.state.connections) {
      if (!this.state.info[ip])
        this.state.connections[ip].on("broadcast", (data) => {
          console.log("receiving broadcast data", data);
          this.setState(
            {
              info: { ...this.state.info, [ip]: data },
            },
            this.handleInfoChnage
          );
          this.state.connections[ip].off("broadcast");
        });
    }
  };

  handleInfoChnage = () => {
    console.log("info found : ", Object.keys(this.state.info).length);
  };
  sleep = (milliseconds) => {
    let timeStart = new Date().getTime();
    while (true) {
      let elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > milliseconds) {
        break;
      }
    }
  };

  connect = async (ip) => {
    return new Promise(async (resolve, reject) => {
      const socket = await socketIOClient(`http://${ip}:5000`);
      socket.on("connect", () => {
        console.log(socket.id, socket.connected);
        this.setState(
          {
            connections: { ...this.state.connections, [ip]: socket },
          },
          this.handleConnectionChange
        );
      });
      // socket.on("disconnect", () => {
      //   console.log("disconnected");
      // });
      resolve(ip);
    });
  };

  startSearch = async () => {
    if (!this.state.ips.length) return;
    // console.log("I am starting an interval");
    let int = setInterval(async () => {
      if (!this.state.search) {
        clearInterval(this.state.interval);
        this.setState({ interval: -1 });
        return;
      }
      if (this.state.interval == -1) this.setState({ interval: int });

      console.log("Search Starting....", this.state.ips.length);
      await Promise.all(
        this.state.ips.map(async (ip) => await this.connect(ip))
      )
        .then((res) => console.log(res.length))
        .catch((ips) => console.log(ips));
    }, 10000);
  };
  handleIpsChange = () => {
    if (this.state.interval !== -1) clearInterval(this.state.interval);
    this.startSearch();
  };

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  async componentDidMount() {
    this.setState({ block: "192.168.1.0/24" }, this.handleBlockChange);
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName="Connections"
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        barStyle={{ backgroundColor: "lime" }}
        key={this.state.connections.length}
      >
        <Tab.Screen
          name="Connections"
          component={() => <Connections connections={this.state.info} />}
          options={{
            tabBarLabel: "Connections",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="network" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="tools" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
}

export default App;
