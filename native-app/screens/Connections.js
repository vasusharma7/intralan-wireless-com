import { FAB, Text } from "react-native-paper";
import React, { Component } from "react";
import { Button, Platform, View, Alert, StyleSheet } from "react-native";
import { Appbar, List } from "react-native-paper";
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
class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      connection: null,
    };
  }
  exec = (connection, operation) => {
    const remotePeer = new PeerClient({ ...connection, operation: operation });
    this.props.setRemotePeer(remotePeer);
    this.setState({ modalOpen: false });
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
            title="IntraLAN Mobile"
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
            title="Call"
            icon="phone"
            onPress={() => {
              this.exec(this.state.connection, "call");
            }}
          />
          <View style={{ margin: 10 }} />
          <Button
            title="File Transfer"
            icon="file"
            onPress={() => {
              this.exec(this.state.connection, "file");
            }}
          />
          <View style={{ margin: 10 }} />
          <Button
            title="Chat"
            icon="message"
            onPress={() => {
              this.exec(this.state.connection, "message");
            }}
          />
          <View style={{ margin: 10 }} />
          <Button
            color="gray"
            title="Cancel"
            icon="cancel"
            onPress={() => {
              this.setState({ modalOpen: false });
            }}
          />
        </Modal>
        {this.props.connStatus !== null && <Stream />}
        <View>
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              fontWeight: "bold",
              marginTop: 30,
            }}
          >
            Available Connections
          </Text>
          {this.props?.info &&
            Object.keys(this.props?.info).map((ip) => {
              return (
                <List.Item
                  key={ip}
                  title={this.props.info[ip]["username"]}
                  description={this.props.info[ip]["ip"]}
                  left={(props) => <List.Icon {...props} icon="network" />}
                  onPress={() =>
                    this.setState({ connection: this.props.info[ip] }, () =>
                      this.setState({ modalOpen: true })
                    )
                  }
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
