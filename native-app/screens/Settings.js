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
import { stopSearch } from "../redux/searchRedux/searchAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import { PeerClient } from "../peer";
import { startNode } from "../redux/nodeRedux/nodeAction";
const { width, height } = Dimensions.get("screen");
import AsyncStorage from "@react-native-async-storage/async-storage";
import NodeService from "../Service";
import BackgroundService from "react-native-background-actions";
import Icon from "react-native-vector-icons/MaterialIcons";
import { openNotificationSettings } from "nodejs-mobile-react-native";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      node: false,
    };
  }
  async componentDidMount() {
    await AsyncStorage.getItem("node").then((data) => {
      if (!data) return;
      let node = JSON.parse(data).node;
      this.setState({ node });
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
            <Text style={styles.instructions}>Reset Discovery Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await AsyncStorage.getAllKeys().then(async (keys) => {
                // keys = keys.filter((val) => val !== "userData");
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
