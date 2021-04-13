import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert
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
import Icon from 'react-native-vector-icons/MaterialIcons';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: AsyncStorage.getItem("node")
    };
    console.log(this.state.items)
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
        <Text style={{textAlign:"center", backgroundColor:"black", color: "white", fontSize : 40, paddingTop: 0.2*height, paddingBottom : 10, height: 0.3*height}}>Settings</Text>
        <View
          style={{
            borderBottomColor: 'white',
            borderBottomWidth: 1,
          }}
        />
        <View style={styles.view}>
          <View>
            <Text style = {{paddingLeft : 15, fontSize : 20, paddingTop : 10, fontWeight : "bold", color: "white"}}>Connection</Text>
          </View>
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
            <Icon size={25} style={styles.inputIcon} name="near-me"></Icon>
            <Text style={styles.instructions}>Enable Network Discovery
            </Text>
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
              Alert.alert("Stopping broadcast..")
              await AsyncStorage.setItem(
                "node",
                JSON.stringify({ node: false })
              );
              NodeService.stopService();
              BackgroundService.stop();
              await AsyncStorage.removeItem("localPeer")
            }}
          >
              <Icon size={25} style={styles.inputIcon} name="near-me-disabled"></Icon>
            <Text style={styles.instructions}>Disable Network Discovery</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => this.startConnection()}
          >
            <Text style={styles.instructions}>Connect</Text>
          </TouchableOpacity> */}
           
           <View>
            <Text style = {{paddingLeft : 15, fontSize : 20, paddingTop : 10, fontWeight : "bold", color: "white"}}>Calls</Text>
          </View>
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
             <Icon style={styles.inputIcon} size={25} name="phone-disabled"></Icon>
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
    backgroundColor: "#2C2C2F",
  },
  view: {
    flex: 0.6,
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius : 10,
    flex: 1,
    flexDirection: "row",
    height: 40
  },
  text: {
    fontSize: 20,
    color: "white",
  },
  inputIcon: {
    marginLeft: 5,
    marginRight: 5,
    color:"#99EFF8"
  },
});
