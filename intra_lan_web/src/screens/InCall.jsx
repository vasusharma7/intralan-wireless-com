import React, { Component } from "react";
import { Avatar } from "baseui/avatar";
import { Button } from "baseui/button";
import Timer from "../components/Timer";
import { connect } from "react-redux";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { store } from "../redux/store";
import { setVideoRef } from "../redux/streamRedux/streamAction";
import "../config";
global.config.videoRef = React.createRef();
class InCall extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.state = { ...store.getState() };
  }
  componentDidUpdate() {
    console.log("i m in update", this.props.stream);
    // this.videoRef.current.srcObject = this.props.stream;
  }
  componentDidMount() {
    this.props.setVideoRef(this.videoRef);
  }
  handleEnd = () => {
    this.props.setConnStatus(null);
    try {
      this.props.localPeer?.endCall();
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
          backgroundColor: "black",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Avatar
          name={localStorage.getItem("name")}
          size="250px"
          src="https://api.adorable.io/avatars/285/10@adorable.io.png"
        ></Avatar>
        <Timer></Timer>
        <video
          style={{
            borderWidth: 1,
            display: "none",
            borderColor: "black",
            height: 100,
            width: 100,
          }}
          controls
          ref={global.config.videoRef}
          autoPlay
        ></video>
        <Button
          onClick={this.handleEnd}
          style={{
            marginTop: 140,
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
  connStatus: state.data.connStatus,
  stream: state.stream.stream,
  videoRef: state.stream.videoRef,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setVideoRef: (ref) => dispatch(setVideoRef(ref)),
    setConnStatus: (status) => dispatch(setConnStatus(status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InCall);