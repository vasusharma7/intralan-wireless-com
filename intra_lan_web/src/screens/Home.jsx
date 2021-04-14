import React, { Component } from "react";
import { Card, StyledBody, StyledAction } from "baseui/card";
import { Button } from "baseui/button";
import { useStyletron } from "baseui";

import { Grid, Cell } from "baseui/layout-grid";
import { Avatar } from "baseui/avatar";
import { Display1, Display2, Display3, Display4 } from "baseui/typography";
import { connect } from "react-redux";
import { startSearch, initSearch } from "../redux/searchRedux/searchAction";
import { updateConnections, updateInfo } from "../redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
// import {Connections} from './Connections'
import Navbar from "./Navbar";
import PeerClient from "../peer";
class Home extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = {
      userName: "Anup",
      myip: "",
      search: false,
    };
  }
  componentDidMount = () => {
    this.setState({
      myip: localStorage.getItem("ip"),
      userName: localStorage.getItem("name"),
    });
    // if (!this.props.localPeer) {
    console.log("component mounted...");
    const peer = new PeerClient(null, "vasu_007");
    this.props.setLocalPeer(peer);
    // }
  };
  componentDidUpdate() {
    console.log("came in update");
    this.videoRef.current.srcObject = this.props.stream;
  }
  render() {
    return (
      <>
        <Navbar></Navbar>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "40px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar
            name={this.state.name}
            size="320px"
            src="https://ambitioustracks.com/wp-content/uploads/2017/01/1.-fundadores.png"
          />
          <Display2 marginBottom="scale500">
            Welcome {this.state && this.state.userName}
          </Display2>
          <p>My IP : {this.state && this.state.myip}</p>
          <Button kind="secondary" onClick={this.props.startSearch}>
            Search
          </Button>
          <video
            key={this.props.stream}
            style={{
              borderWidth: 1,
              borderColor: "black",
              height: 100,
              width: 100,
            }}
            controls
            ref={this.videoRef}
            autoPlay
          ></video>
        </div>
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
    stream: state.stream.stream,
    connStatus: state.data.connStatus,
    screenStatus: state.data.screenStatus,
    search: state.search.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocalPeer: (info) => dispatch(setLocalPeer(info)),
    setRemotePeer: (info) => dispatch(setRemotePeer(info)),
    //   setScreenStatus: (status) => dispatch(setScreenStatus(status)),
    startSearch: () => dispatch(startSearch()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
