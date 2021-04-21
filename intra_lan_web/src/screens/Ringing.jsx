import React, { Component } from "react";
import { Avatar } from "baseui/avatar";
import { Button } from "baseui/button";
import { Display2, Display4 } from "baseui/typography";
import { connect } from "react-redux";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { store } from "../redux/store";
import bg from "../assets/ripple2.gif";

class Ringing extends Component {
  constructor(props) {
    super(props);
    this.state = { ...store.getState() };
    console.log(this.props);
  }
  handleReject = (e) => {
    e.preventDefault();

    // try {
    //   this.props.localPeer.endCall();
    //   this.props.remotePeer?.endCall();
    // } catch {}
    try {
      this.props.localPeer?.endCall();
    } catch (err) {
      console.log("Something is fishy in development !", err);
    }
    try {
      this.props.remotePeer?.endCall();
    } catch (err) {
      console.log("Something is fishy in development !", err);
    }
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
        <Display2 style={{ marginBottom: 40 }}>Calling...</Display2>
        <Display4 style={{ marginBottom: 20 }}>
          {this.props.remotePeer?.connection?.username !== undefined
            ? this.props.remotePeer?.connection?.username
            : "User"}
        </Display4>
        <Display4 style={{ marginBottom: 40 }}>
          {this.props.remotePeer?.connection?.ip !== undefined
            ? this.props.remotePeer?.connection?.ip
            : ""}
        </Display4>
        {/* <Avatar
          name={localStorage.getItem("name")}
          size="250px"
          src="https://api.adorable.io/avatars/285/10@adorable.io.png"
        ></Avatar> */}
        <img
          src={bg}
          alt="ring"
          style={{
            height: "40vh",
          }}
        />
        <Button
          onClick={this.handleReject}
          style={{
            marginTop: 60,
            borderRadius: 20,
            backgroundColor: "red",
            color: "white",
          }}
        >
          End Call
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

export default connect(mapStateToProps, mapDispatchToProps)(Ringing);
