import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NodeService from "../Service";
import nodejs from "nodejs-mobile-react-native";
import { PeerClient } from "../peer";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleNodeEvents = async (msg) => {
    const event = Object.keys(msg)[0];
    switch (event) {
      case "firedUp": {
        const localPeer = new PeerClient();
        await AsyncStorage.setItem("localPeer", JSON.stringify(localPeer));
        Alert.alert("From node: " + msg[event]);
        nodejs.channel.send(
          JSON.stringify("localPeerId", localPeer.getPeerId())
        );
        return;
      }
      default:
        Alert.alert("From node: " + msg[event]);
    }
  };

  startNode = () => {
    nodejs.start("main.js");

    nodejs.channel.addListener(
      "message",
      (msg) => {
        msg = JSON.parse(msg);
        this.handleNodeEvents(msg);
      },
      this
    );
  };
  startConnection = () => {
    const remotePeer = new PeerClient(this.props.connections[0]);
    remotePeer.connect();
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.startNode()}
          >
            <Text style={styles.instructions}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => NodeService.stopService()}
          >
            <Text style={styles.instructions}>Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.startConnection()}
          >
            <Text style={styles.instructions}>Connect</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => nodejs.channel.send("A message!")}
          >
            <Text style={styles.instructions}>Invoke</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  view: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "gray",
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});
