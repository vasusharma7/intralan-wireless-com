import React, { Component } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { PermissionsAndroid, AppState } from "react-native";
import { connect } from "react-redux";
import { updateConnections, updateInfo } from "./redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "./redux/streamRedux/streamAction";
import BackgroundService from "react-native-background-actions";
import Home from "./screens/Home";
const socketIOClient = require("socket.io-client");

const Netmask = require("netmask").Netmask;

// const Tab = createMaterialBottomTabNavigator();
import "./config.js";

import AsyncStorage from "@react-native-async-storage/async-storage";

const { PeerClient } = require("./peer.js");
const sleep = async (delay) => await new Promise((r) => setTimeout(r, delay));
const veryIntensiveTask = async (taskDataArguments) => {
  // Example of an infinite loop task
  const { delay } = taskDataArguments;
  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      // console.log("running", i);
      await sleep(delay);
    }
  });
};

const options = {
  taskName: "IntraLAN Comm",
  taskTitle: "Synching with peers",
  taskDesc: "",
  taskIcon: {
    name: "ic_launcher",
    type: "mipmap",
  },
  color: "#ffffff",
  linkingURI: "intralancom://call",
  parameters: {
    delay: 10000,
  },
};
const rangeString = "192.168.29.0/24";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: {},
      info: {},
      interval: -1,
      count: 0,
      search: false,
      appState: AppState.currentState,
      block: "",
      ips: [],
      waitTime: 1000,
      permissions: [
        { permission: PermissionsAndroid.PERMISSIONS.CAMERA, title: "Camera" },
        {
          permission: PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          title: "Microphone",
        },
      ],
    };
  }
  handleBlockChange = () => {
    const generator = new Netmask(this.state.block);
    const collector = [];
    generator.forEach((ip) => collector.push(ip));
    this.setState({ ips: collector }, this.handleIpsChange);
  };

  handleConnectionChange = () => {
    this.props.updateConnections(this.connections);
    console.log(
      "connections found : ",
      Object.keys(this.state.connections).length
    );
    for (let ip in this.state.connections) {
      // if (!this.state.info[ip])
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
    this.props.updateInfo(this.state.info);
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
    if (ip === global.config.info.ip) {
      console.log("self IP");
      return;
    }
    return new Promise(async (resolve, reject) => {
      const socket = await socketIOClient(`http://${ip}:5000`);
      socket.on("connect", () => {
        console.log(socket.id, socket.connected);
        !Object.keys(this.state.connections).includes(ip) &&
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
    if (!this.props.search) {
      this.setState({ count: 0 });
      return;
    }
    if (!this.state.ips.length) return;

    if (this.state.count < 50) {
      this.setState(
        {
          interval: setTimeout(async () => {
            console.log("Search Starting....", this.state.ips.length);
            await Promise.all(
              this.state.ips.map(async (ip) => await this.connect(ip))
            )
              .then((res) => {
                console.log("success", res.length);
                this.startSearch();
              })
              .catch((ips) => console.log(ips));
          }, this.state.count * 1000),
        },
        () => {
          this.setState({
            count: this.state.count + 12,
          });
        }
      );
    } else {
      // this.props.toggleSearch()
    }
  };

  handleIpsChange = () => {
    if (this.state.interval !== -1) clearInterval(this.state.interval);
    this.startSearch();
  };

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  shouldComponentUpdate(props, state) {
    if (this.state.search !== props.search && props.search === true) {
      console.log("changing things");
      this.setState({ search: props.search }, () => this.startSearch());
    }
    return true;
  }
  requestPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Microphone Permission",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Microphone");
      } else {
        console.log("Microphone permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  connectWithPeerJS = async () => {
    await AsyncStorage.getItem("localPeer").then((localPeer) => {
      if (localPeer) {
        const peer = new PeerClient();
        this.props.setLocalPeer(peer);
      }
    });
  };
  async componentDidMount() {
    this.requestPermissions();
    await BackgroundService.start(veryIntensiveTask, options);
    this.connectWithPeerJS();

    this.setState({ block: rangeString }, this.handleBlockChange);
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      // this.setState({ block: rangeString }, this.handleBlockChange);
    } else {
      console.log("App has gone to background !");
      // clearInterval(this.state.interval);
      // this.setState({ interval: -1 });
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return <Home />;
  }
}
const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
    search: state.data.search,
    callStatus: state.data.callStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnections: (connections) =>
      dispatch(updateConnections(connections)),
    updateInfo: (info) => dispatch(updateInfo(info)),

    setLocalPeer: (peer) => dispatch(setLocalPeer(peer)),
    setRemotePeer: (peer) => dispatch(setRemotePeer(peer)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
