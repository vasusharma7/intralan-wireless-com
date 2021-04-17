import React from "react";
import { Button } from "baseui/button";
import { H5 } from "baseui/typography";
import { Modal } from "baseui/modal";
import { connect } from "react-redux";
import {
  updateConnections,
  updateInfo,
  setConnStatus,
} from "../redux/dataRedux/dataAction";
import { stopSearch } from "../redux/searchRedux/searchAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import logo from "../assets/wifi.gif";

class Stream extends React.Component {
  paint() {
    switch (this.props.connStatus) {
      case "ringing": {
        return (
          <H5 style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Ringing....
          </H5>
        );
      }
      case "connecting": {
        return (
          <H5 style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Connecting....
          </H5>
        );
      }
      case "connecting": {
        return (
          <H5 style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Transfering File.....
          </H5>
        );
      }
      case "searching": {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <H5 style={{ color: "white", fontSize: 20, textAlign: "center" }}>
              Searching
            </H5>
            <img
              src={logo}
              style={{
                width: 200,
                height: 350,
              }}
              alt="wifi"
            />
            <H5
              style={{
                color: "white",
                fontSize: 20,
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              {`Found ${Object.keys(this.props.info).length} connections`}
            </H5>

            <Button
              style={{ marginBottom: 20 }}
              onClick={() => this.props.stopSearch()}
            >
              Stop Searching
            </Button>
          </div>
        );
      }
      default:
        return (
          <H5 style={{ color: "white", fontSize: 20, textAlign: "center" }}>
            Hey ! If you are here, you are in trouble
          </H5>
        );
    }
  }
  render() {
    return (
      //   <View style={{ flex: 1 }}>
      <Modal
        isOpen={true}
        onClose={() => this.props.setConnStatus(null)}
        style={{ margin: 1 }}
      >
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

export default connect(mapStateToProps, mapDispatchToProps)(Stream);
