import React, { Component } from "react";
import {Button} from 'baseui/button'
import { connect } from "react-redux";
import {Modal} from "baseui/modal";
import {
  setConnStatus,
  setScreenStatus,
} from "../redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import { startSearch, stopSearch } from "../redux/searchRedux/searchAction";
import {PeerClient}  from "../peer";
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
        <Modal isOpen={this.state.modalOpen}>
          <div
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
          <div style={{ margin: 10 }} />
          <Button
            title="File Transfer"
            // icon="file"
            onClick={() => {
              this.exec(this.state.connection, "file");
            }}
          />
        </Modal>
        {this.props.connStatus !== null && <Stream />}
        <div>
          {this.props?.info &&
            Object.keys(this.props?.info).map((ip) => {
              return (
                <Button
                  key={ip}
                  title={this.props.info[ip]["username"]}
                  description={this.props.info[ip]["ip"]}
                  // left={(props) => <p {...props} icon="network" />}
                  onClick={() =>
                    this.setState({ connection: this.props.info[ip] }, () =>
                      this.setState({ modalOpen: true })
                    )
                  }
                />
              );
            })}
        </div>
        <Button kind="secondary" onClick={() => {
            this.props.setConnStatus("searching");
            setTimeout(() => this.props.startSearch(), 1000)}
            }>
            Start Search
          </Button>
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

