import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NodeService from "../Service";
import nodejs from "nodejs-mobile-react-native";
import { PeerClient } from "../peer";
import { updateConnections, updateInfo } from "../redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";

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
        this.props.setLocalPeer(localPeer);
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
    // console.log(this.props.connections);
    // const remotePeer = new PeerClient(
    //   this.props.connections[Object.keys(this.props.connections)[0]]
    // );
    const remotePeer = new PeerClient({
      ip: "192.168.1.7",
      username: "Vasu",
      peerId: "peer8",
    });

    this.props.setRemotePeer(remotePeer);
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

const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
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
)(Settings);

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
