import React, { useState } from "react";
import { Button, Text, View, Image } from "react-native";
import { store } from "../redux/store";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import {
  updateConnections,
  updateInfo,
  setConnStatus,
} from "../redux/dataRedux/dataAction";
import { stopSearch } from "../redux/searchRedux/searchAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import wifi from "../assets/wifi.gif";
import connecting from "../assets/connecting2.gif";
class Stream extends React.Component {
  paint() {
    switch (this.props.connStatus) {
      case "connecting": {
        return (
          <>
            <View
              style={{
                flex: 1,
                backgroundColor: "#1c1c1c",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={connecting}
                style={{
                  width: 300,
                  height: 300,
                }}
              />
              <Text
                style={{ color: "white", fontSize: 20, textAlign: "center" }}
              >
                Connecting....
              </Text>
              <Button
                onPress={() => this.props.setConnStatus(null)}
                title={"Cancel"}
              />
            </View>
          </>
        );
      }
      // case "connecting": {
      //   return (
      //     <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
      //       Transfering File.....
      //     </Text>
      //   );
      // }
      case "searching": {
        return (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(1,1,1,0.7)",
              padding: 0,
              margin: 0,
            }}
          >
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
              Searching
            </Text>
            <Image
              source={wifi}
              style={{
                width: 200,
                height: 200,
              }}
            />
            <Text
              style={{
                color: "white",
                fontSize: 20,
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              {`Found ${Object.keys(this.props.info).length} connection(s)`}
            </Text>

            <Button
              onPress={() => this.props.stopSearch()}
              title={"Stop Search"}
            />
            <Text
              style={{
                marginTop: 10,
                color: "white",
                fontSize: 10,
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              Found Connections will be added to the dialing list
            </Text>
          </View>
        );
      }
      default:
        return (
          <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Hey ! If you are here, you are in trouble
          </Text>
        );
    }
  }
  render() {
    return (
      //   <View style={{ flex: 1 }}>
      <Modal isVisible={true} style={{ margin: 1 }}>
        {this.paint()}
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
    search: state.search.search,
    connStatus: state.data.connStatus,
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
    setConnStatus: (status) => dispatch(setConnStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stream);
