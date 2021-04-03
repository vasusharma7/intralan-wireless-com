import { BottomNavigation, FAB, Text } from "react-native-paper";
import React, { Component } from "react";
import { Platform, View, Alert, StyleSheet } from "react-native";
import { Appbar, List } from "react-native-paper";
import { connect } from "react-redux";
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
class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  startCall = (connection) => {
    const remotePeer = new PeerClient({ ...connection, operation: "file" });
    this.props.setRemotePeer(remotePeer);
  };

  render() {
    return (
      <>
        {this.props.connStatus !== null && <Stream />}
        <View>
          {this.props?.info &&
            Object.keys(this.props?.info).map((ip) => {
              return (
                <List.Item
                  key={ip}
                  title={this.props.info[ip]["username"]}
                  description={this.props.info[ip]["ip"]}
                  left={(props) => <List.Icon {...props} icon="network" />}
                  onPress={() => this.startCall(this.props.info[ip])}
                />
              );
            })}
        </View>
        <FAB
          style={styles.fab}
          icon="magnify"
          onPress={() => {
            this.props.setConnStatus("searching");
            setTimeout(() => this.props.startSearch(), 1000);
            // setTimeout(() => {
            //   this.props.setConnStatus(null);
            // }, 4000);
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connections);
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#0fefaa",
  },
});
