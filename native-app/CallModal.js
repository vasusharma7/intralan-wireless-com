import React, { useState } from "react";
import { Button, Text, View } from "react-native";
import { store } from "./redux/store";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import {
  toggleSearch,
  updateConnections,
  updateInfo,
  setCallStatus,
} from "./redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "./redux/streamRedux/streamAction";
class CallModal extends React.Component {
  render() {
    return (
      //   <View style={{ flex: 1 }}>
      <Modal isVisible={true} style={{ margin: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: "black",
            padding: 0,
            margin: 0,
          }}
        >
          <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Ringing User
          </Text>
        </View>
      </Modal>
      //   </View>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
    remotePeer: state.stream.remotePeer,
    localPeer: state.stream.localPeer,
    search: state.data.search,
    callStatus: state.data.callStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnections: (connections) =>
      dispatch(updateConnections(connections)),
    updateInfo: (info) => dispatch(updateInfo(info)),
    toggleSearch: () => dispatch(toggleSearch()),
    setLocalPeer: (peer) => dispatch(setLocalPeer(peer)),
    setRemotePeer: (peer) => dispatch(setRemotePeer(peer)),
    setCallStatus: (status) => dispatch(setCallStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CallModal);
