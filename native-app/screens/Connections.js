import { BottomNavigation, Text } from "react-native-paper";
import React, { Component } from "react";
import { Platform, View, Alert } from "react-native";
import { Appbar, List } from "react-native-paper";
import { connect } from "react-redux";
import { updateConnections, updateInfo } from "../redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import { PeerClient } from "../peer";
import CallModal from "../CallModal";
class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  startCall = (connection) => {
    const remotePeer = new PeerClient(connection);

    this.props.setRemotePeer(remotePeer);
  };

  render() {
    return this.props.callStatus === "ringing" ? (
      <CallModal />
    ) : (
      <>
        <Appbar.Header>
          <Appbar.Content
            title="IntraLAN Communication"
            subtitle="Under Developement :)"
          />
        </Appbar.Header>
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
    callStatus: state.data.callStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnections: (connections) =>
      dispatch(updateConnections(connections)),
    updateInfo: (info) => dispatch(updateInfo(info)),
    setLocalPeer: (info) => dispatch(setLocalPeer(info)),
    setRemotePeer: (info) => dispatch(setRemotePeer(info)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connections);
