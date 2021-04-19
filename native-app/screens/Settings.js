import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import { connect } from "react-redux";
import {
  updateConnections,
  updateInfo,
  setScreenStatus,
} from "../redux/dataRedux/dataAction";
import { Menu, Divider, Button } from "react-native-paper";
import { initSearch, stopSearch } from "../redux/searchRedux/searchAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import { PeerClient } from "../peer";
import { startNode } from "../redux/nodeRedux/nodeAction";
const { width, height } = Dimensions.get("screen");
import AsyncStorage from "@react-native-async-storage/async-storage";
import NodeService from "../Service";
import BackgroundService from "react-native-background-actions";
import Icon from "react-native-vector-icons/MaterialIcons";
import { openNotificationSettings } from "nodejs-mobile-react-native";
const numBlocks = 2;
const Filler = () => (
  <View
    style={{
      borderRightColor: "white",
      borderWidth: 1,
      height: width / 7,
    }}
  />
);
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: false,
      visible: true,
      range: "small",
    };
  }
  openMenu = () => this.setState({ visible: true });

  closeMenu = () => this.setState({ visible: false });
  async componentDidMount() {
    await AsyncStorage.getItem("node").then((data) => {
      if (!data) return;
      let node = JSON.parse(data).node;
      this.setState({ node });
    });
    await AsyncStorage.getItem("range").then((range) => {
      if (!range) return;
      this.setState({ range: range });
    });
  }
  render() {
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            ...styles.view,
            backgroundColor: "black",
            flex: 0.4,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Image
            source={require("../assets/ic_launcher.png")}
            style={{ height: width * 0.25, width: width * 0.25, margin: 10 }}
          />
          <Text
            style={{
              textAlign: "center",
              backgroundColor: "black",
              color: "white",
              fontSize: 40,
              // paddingTop: 0.09 * height,
              height: 0.1 * height,
            }}
          >
            Settings
          </Text>
        </View>
        <Text
          style={{
            color: "white",
            paddingBottom: 5,
            backgroundColor: "black",
            textAlign: "center",
          }}
        >
          {"My IP : " + (global.config.info.ip || "Not Avaialble")}
        </Text>
        <View
          style={{
            borderBottomColor: "white",
            borderBottomWidth: 1,
          }}
        />
        <View style={styles.view}>
          <View>
            <Text
              style={{
                paddingLeft: 15,
                fontSize: 20,
                paddingTop: 10,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Connection
            </Text>
          </View>
          <TouchableOpacity
            disabled={this.state.node}
            style={{
              ...styles.button,
              backgroundColor: this.state.node ? "gray" : "white",
            }}
            onPress={async () => {
              this.props.startNode();
              await AsyncStorage.getItem("node").then(async (res) => {
                await AsyncStorage.setItem(
                  "node",
                  JSON.stringify({ node: true })
                );
                this.setState({ node: true });
                await BackgroundService.updateNotification({
                  taskDesc: "Discoverable in the network..",
                });
              });
            }}
          >
            <Icon size={25} style={styles.inputIcon} name="near-me" />
            <Text style={styles.instructions}>Enable Network Discovery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!this.state.node}
            style={{
              ...styles.button,
              backgroundColor: !this.state.node ? "gray" : "white",
            }}
            onPress={async () => {
              Alert.alert("Stopping broadcast..");
              await AsyncStorage.setItem(
                "node",
                JSON.stringify({ node: false })
              );

              NodeService.stopService();
              this.setState({ node: false });
              BackgroundService.stop();
              await AsyncStorage.removeItem("localPeer");
              Alert.alert("Success", "It is recommended to restart the app");
            }}
          >
            <Icon size={25} style={styles.inputIcon} name="near-me-disabled" />
            <Text style={styles.instructions}>Disable Network Discovery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              openNotificationSettings();
            }}
          >
            <Icon size={25} style={styles.inputIcon} name="notifications" />
            <Text style={styles.instructions}>
              Show/Hide Tray Notifications
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.view}>
          <View>
            <Text
              style={{
                paddingLeft: 15,
                fontSize: 20,
                paddingTop: 10,
                marginBottom: 5,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Search Range
            </Text>
          </View>
        </View>
        <View style={styles.wrap}>
          <TouchableOpacity
            onPress={async () => {
              this.props.initSearch(global.config.info.smallBlock);
              await AsyncStorage.setItem("range", "small");
              this.setState({ range: "small" });
            }}
          >
            <View
              style={{
                ...styles.options,
                borderTopLeftRadius: 10,
                borderLeftColor: "white",
                borderLeftWidth: 1,
                borderBottomLeftRadius: 10,
                backgroundColor:
                  this.state.range === "small" ? "#00203f" : "transparent",
              }}
            >
              <Text style={styles.optionsText}>Small</Text>
              <Text style={{ ...styles.optionsText, fontSize: width / 50 }}>
                Small Home Networks
              </Text>
            </View>
          </TouchableOpacity>
          <Filler />
          <TouchableOpacity
            onPress={async () => {
              this.props.initSearch(global.config.info.mediumBlock);
              await AsyncStorage.setItem("range", "large");
              this.setState({ range: "large" });
              Alert.alert("Note !", "Searching Peers will take longer time");
            }}
          >
            <View
              style={{
                ...styles.options,
                borderTopRightRadius: 10,
                borderRightColor: "white",
                borderRightWidth: 1,
                borderBottomRightRadius: 10,
                backgroundColor:
                  this.state.range === "large" ? "#00203f" : "transparent",
              }}
            >
              <Text style={styles.optionsText}>Large</Text>
              <Text style={{ ...styles.optionsText, fontSize: width / 50 }}>
                Fairly Large Newtorks
              </Text>
            </View>
          </TouchableOpacity>
          {/* <Filler />
          <TouchableOpacity
            onPress={() => {
              this.props.initSearch(global.config.info.largeBlock);
            }}
          >
            <View style={styles.options}>
              <Text style={styles.optionsText}>High</Text>
              <Text style={{ ...styles.optionsText, fontSize: width / 70 }}>
                Entire Network
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>
        <View style={styles.view}>
          <View>
            <Text
              style={{
                paddingLeft: 15,
                fontSize: 20,
                paddingTop: 10,
                fontWeight: "bold",
                color: "white",
              }}
            >
              Issues ?
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await AsyncStorage.removeItem("node");
              NodeService.stopService();
              BackgroundService.stop();
              await AsyncStorage.removeItem("localPeer");
              Alert.alert(
                "Success",
                "It is recommended to close the app and try again"
              );
            }}
          >
            <Icon size={25} style={styles.inputIcon} name="restore" />
            <Text style={styles.instructions}>
              Reset Network Discovery Settings
            </Text>
          </TouchableOpacity>
          <Text
            style={{ color: "white", marginLeft: 10, fontSize: width / 40 }}
          >
            ( Reset discovery settings if not working as expected )
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await AsyncStorage.getAllKeys().then(async (keys) => {
                keys = keys.filter((val) => val !== "userData");
                Promise.all(
                  keys.map(async (key) => await AsyncStorage.removeItem(key))
                ).then(() => this.props.navigation.navigate("Splash"));
              });
            }}
          >
            <Icon size={25} style={styles.inputIcon} name="logout" />
            <Text style={styles.instructions}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
    remotePeer: state.stream.remotePeer,
    localPeer: state.stream.localPeer,
    search: state.search.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnections: (connections) =>
      dispatch(updateConnections(connections)),
    updateInfo: (info) => dispatch(updateInfo(info)),
    stopSearch: () => dispatch(stopSearch()),
    setLocalPeer: (peer) => dispatch(setLocalPeer(peer)),
    setRemotePeer: (peer) => dispatch(setRemotePeer(peer)),
    setScreenStatus: (status) => dispatch(setScreenStatus(status)),
    startNode: () => dispatch(startNode()),
    initSearch: (data) => dispatch(initSearch(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2C2C2F",
  },
  options: {
    color: "white",
    width: width / 3,
    height: width / 7,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
  },
  optionsText: {
    textAlign: "center",
    color: "white",
  },
  wrap: {
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: (width / 3) * numBlocks,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
  },
  view: {
    flex: 0.6,
  },
  button: {
    backgroundColor: "white",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    flexDirection: "row",
    height: 40,
  },
  text: {
    fontSize: 20,
    color: "white",
  },
  inputIcon: {
    marginLeft: 5,
    marginRight: 5,
    color: "#99EFF8",
  },
});
