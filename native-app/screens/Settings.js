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
import {
  updateConnections,
  updateInfo,
  setScreenStatus,
} from "../redux/dataRedux/dataAction";
import { stopSearch } from "../redux/searchRedux/searchAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NodeService from "../Service";
import nodejs from "nodejs-mobile-react-native";
import { PeerClient } from "../peer";
import BackgroundService from "react-native-background-actions";
import { startNode } from "../redux/nodeRedux/nodeAction";
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  startConnection = () => {
    // console.log(this.props.connections);
    // const remotePeer = new PeerClient(
    //   this.props.connections[Object.keys(this.props.connections)[0]]
    // );
    //testing
    const remotePeer = new PeerClient({
      ip: "192.168.1.207",
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
            onPress={async () => {
              await AsyncStorage.getItem("node").then(async (res) => {
                await AsyncStorage.setItem(
                  "node",
                  JSON.stringify({ node: true })
                );
              });
              this.props.startNode();
            }}
          >
            <Text style={styles.instructions}>Start NodeJS</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.stopSearch()}
          >
            <Text style={styles.instructions}>
              {this.props.search ? "Stop Search" : "Start Search"}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              await AsyncStorage.setItem(
                "node",
                JSON.stringify({ node: false })
              );
              NodeService.stopService();
              BackgroundService.stop();
              await AsyncStorage.removeItem("localPeer");
            }}
          >
            <Text style={styles.instructions}>Stop NodeJS</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => this.startConnection()}
          >
            <Text style={styles.instructions}>Connect</Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              try {
                this.props.localPeer?.endCall();
                this.props.remotePeer?.endCall();
              } catch {
                console.log("igonoring some errros");
              }
            }}
          >
            <Text style={styles.instructions}>Disconnect Call</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => nodejs.channel.send("A message!")}
          >
            <Text style={styles.instructions}>Invoke</Text>
          </TouchableOpacity> */}
        </View>
      </View>
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
