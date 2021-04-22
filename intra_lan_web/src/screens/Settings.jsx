import { Button } from "baseui/button";
import { Display4 } from "baseui/typography";
import React, { Component } from "react";
import Navbar from "./Navbar";
import st from "../assets/settings.gif";
import { initSearch, stopSearch } from "../redux/searchRedux/searchAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import {
  updateConnections,
  updateInfo,
  setScreenStatus,
} from "../redux/dataRedux/dataAction";
import { connect } from "react-redux";
import { Avatar } from "baseui/avatar";
class Settings extends Component {
  componentDidMount = () => {
    console.log(this.props);
  };
  render() {
    return (
      <>
        <Navbar></Navbar>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            marginLeft: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 40,
              width: "40vw",
            }}
          >
            <div style={{ margin: 40 }}>
              <Display4 color="black">Settings</Display4>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: 40,
                width: "50vw",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: 20 }}>
                <Avatar
                  name={localStorage.getItem("name")}
                  size="80px"
                  src="http://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png"
                ></Avatar>
              </div>
              <div>
                <p>Name : {this.props?.localPeer?.authInfo?.name}</p>
                <p>My IP : {localStorage.getItem("myip")}</p>
                <p>My Peer ID : {this.props?.localPeer?.authInfo?.peerId}</p>
              </div>
            </div>

            <Button style={{ margin: 10 }} kind="secondary">
              Turn Off Discovery
            </Button>
            <Button style={{ margin: 10 }} kind="secondary">
              Turn On Discovery
            </Button>
            <Button style={{ margin: 10 }} kind="secondary">
              Reset Discovery settings
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "87vh",
            }}
          >
            <img alt="settings" src={st}></img>
          </div>
        </div>
      </>
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
    initSearch: (data) => dispatch(initSearch(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
