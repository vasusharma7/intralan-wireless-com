import { FAB, Text } from "react-native-paper";
import React, { Component } from "react";
import {
  Platform,
  View,
  Alert,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Appbar, List, Button } from "react-native-paper";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import {
  setConnStatus,
  setScreenStatus,
  updateConnections,
  updateInfo,
} from "../redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import { startSearch, stopSearch } from "../redux/searchRedux/searchAction";
import { PeerClient } from "../peer";
import Stream from "./Stream";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { color } from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome5";
const { width, height } = Dimensions.get("screen");
class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      connection: null,
      userData: {},
    };
  }
  exec = (connection, operation) => {
    const remotePeer = new PeerClient({ ...connection, operation: operation });
    this.props.setRemotePeer(remotePeer);
    this.setState({ modalOpen: false });
  };

  componentDidMount = async () => {
    await AsyncStorage.getItem("auth")
      .then((data) => {
        data = JSON.parse(data);
        this.setState({
          userData: data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  render() {
    return (
      <>
        <Appbar.Header
          style={{
            backgroundColor: "#04045B",
          }}
        >
          <Appbar.Content
            title="NetCon Mobile"
            subtitle="Connect fast, safe and secure"
            style={{
              alignItems: "center",
            }}
          />
        </Appbar.Header>
        <Modal isVisible={this.state.modalOpen}>
          <View
            style={{
              backgroundColor: "rgba(1,1,1,0.7)",
            }}
          />
          <Button
            icon="phone"
            mode="contained"
            style={{ margin: 10 }}
            onPress={() => {
              this.exec(this.state.connection, "call");
            }}
          >
            Call
          </Button>
          <Button
            icon="file"
            mode="contained"
            style={{ margin: 10 }}
            onPress={() => {
              this.exec(this.state.connection, "file");
            }}
          >
            File Transfer
          </Button>
          <Button
            icon="message"
            mode="contained"
            style={{ margin: 10 }}
            onPress={() => {
              this.exec(this.state.connection, "message");
            }}
          >
            Chat
          </Button>
          <Button
            color="gray"
            icon="cancel"
            mode="contained"
            style={{ margin: 10 }}
            onPress={() => {
              this.setState({ modalOpen: false });
            }}
          >
            Cancel
          </Button>
        </Modal>
        {this.props.connStatus !== null && <Stream />}
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 40,
              paddingBottom: 40,
              backgroundColor: "#04066D",
              borderRadius: 30,
              marginTop: 20,
              marginLeft: 7,
              marginRight: 7,
            }}
          >
            <View style={{ marginRight: 30 }}>
              <Icon size={50} color="white" name="user" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: 10,
                }}
              >
                Welcome {this.state.userData.username}
              </Text>
              <Text style={{ color: "white" }}>
                My Peer ID: {this.state.userData.uid}
              </Text>
              <Text style={{ color: "white" }}>
                E-mail: {this.state.userData.email}
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 30,
            }}
          >
            {"Available Connections\n"}
            {this.props?.info && Object.keys(this.props?.info).length === 0 && (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ marginTop: 30, fontSize: 17 }}>
                  Tap on the search button to look for connections
                </Text>
                <Image
                  source={require("../assets/search.gif")}
                  style={{ width: width / 2, height: height / 3 }}
                />
              </View>
            )}
          </Text>
          {this.props?.info &&
            Object.keys(this.props?.info).map((ip) => {
              return (
                <List.Item
                  key={ip}
                  titleStyle={{ fontSize: 30 }}
                  title={
                    this.props.info[ip]["username"] === undefined
                      ? "User"
                      : this.props.info[ip]["username"]
                  }
                  descriptionStyle={{ fontSize: 15, fontWeight: "bold" }}
                  description={`IP: ${this.props.info[ip]["ip"]}\nPeerId: ${
                    this.props.info[ip]["peerId"] === ""
                      ? "Anonymous"
                      : this.props.info[ip]["peerId"]
                  }`}
                  rippleColor="#00f"
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="network"
                      color="#2B139D"
                      style={{ height: 60, width: 60 }}
                    />
                  )}
                  onPress={() =>
                    this.setState({ connection: this.props.info[ip] }, () =>
                      this.setState({ modalOpen: true })
                    )
                  }
                />
              );
            })}
        </View>
        {JSON.stringify(this.props.info) !== JSON.stringify({}) ? (
          <FAB
            style={styles.fab1}
            icon="delete"
            onPress={() => {
              this.props.updateInfo(null);
            }}
          />
        ) : (
          <></>
        )}

        <FAB
          style={styles.fab2}
          icon="magnify"
          onPress={() => {
            this.props.setConnStatus("searching");
            setTimeout(() => this.props.startSearch(), 1000);
          }}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
    localPeer: state.stream.localPeer,
    remotePeer: state.stream.remotePeer,
    connStatus: state.data.connStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocalPeer: (info) => dispatch(setLocalPeer(info)),
    setRemotePeer: (info) => dispatch(setRemotePeer(info)),
    setScreenStatus: (status) => dispatch(setScreenStatus(status)),
    stopSearch: () => dispatch(stopSearch()),
    startSearch: () => dispatch(startSearch()),
    setConnStatus: (status) => dispatch(setConnStatus(status)),
    updateInfo: (data) => dispatch(updateInfo(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connections);
const styles = StyleSheet.create({
  fab1: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: width * 0.2,
    backgroundColor: "#0fefaa",
  },
  fab2: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#0fefaa",
  },
});
