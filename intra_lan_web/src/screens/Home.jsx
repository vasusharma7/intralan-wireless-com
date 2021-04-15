import React, { Component } from "react";
import { Button } from "baseui/button";
import { Avatar } from "baseui/avatar";
import { Display2 } from "baseui/typography";
import { connect } from "react-redux";
import { startSearch } from "../redux/searchRedux/searchAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import Navbar from "./Navbar";
import PeerClient from "../peer";
import Incoming from "./Incoming";
import InCall from "./InCall";

class Home extends Component {
  constructor(props) {
    super(props);

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

  setScreen = () => {
    switch (this.props.connStatus) {
      case "incoming":
        return <Incoming></Incoming>;
      case "inCall":
        return <InCall></InCall>;
      default:
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
            </div>
          </>
        );
    }
  };

  render() {
    console.log(this.props.connStatus)
    return this.setScreen()
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
    startSearch: () => dispatch(startSearch()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
