import React, { Component } from "react";
import { Button } from "baseui/button";
import { Display2, Display4 } from "baseui/typography";
import { connect } from "react-redux";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { store } from "../redux/store";
import Sound from "react-sound";
import ringtone from "../assets/ringtone.mp3";
import bg from "../assets/ripple2.gif";
class Incoming extends Component {
  constructor(props) {
    super(props);
    this.state = { ...store.getState() };
    console.log(this.props);
  }
  handleReject = (e) => {
    e.preventDefault();
    try {
      this.props.localPeer.rejectCall();
    } catch (err) {
      console.log("something is fishy in dev");
    }
  };
  handlleAccept = () => {
    this.props.setConnStatus(null);
    this.props.localPeer.answerCall();
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#323332",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Sound url={ringtone} playStatus={Sound.status.PLAYING} />
        <Display2 style={{ marginBottom: 40 }}>Incoming call</Display2>
        <Display4 style={{ marginBottom: 20 }}>
          {this.props.localPeer?.metadata.username !== undefined
            ? this.props.localPeer?.metadata.username
            : "User"}
        </Display4>
        <Display4 style={{ marginBottom: 40 }}>
          {this.props.localPeer?.metadata.ip !== undefined
            ? this.props.localPeer?.metadata.ip
            : ""}
        </Display4>
        <img
          src={bg}
          alt="call"
          style={{
            height: "40vh",
          }}
        ></img>
        <Button
          onClick={this.handlleAccept}
          style={{
            marginTop: 140,
            borderRadius: 20,
            backgroundColor: "green",
            color: "white",
          }}
        >
          Accept Call
        </Button>
        <Button
          onClick={this.handleReject}
          style={{
            marginTop: 20,
            borderRadius: 20,
            backgroundColor: "red",
            color: "white",
          }}
        >
          Decline Call
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  remotePeer: state.stream.remotePeer,
  localPeer: state.stream.localPeer,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConnStatus: (status) => dispatch(setConnStatus(status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Incoming);
