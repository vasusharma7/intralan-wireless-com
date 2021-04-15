import React, { Component } from "react";
import {
  View,
  Button,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import { connect } from "react-redux";
import end from "../assets/end.png";
import user from "../assets/user.png";
import decline from "../assets/decline.gif";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { store } from "../redux/store";
import Timer from "./components/Timer";
import { RTCView } from "react-native-webrtc";
export class InCall extends Component {
  constructor(props) {
    super(props);
    this.state = { ...store.getState() };
  }
  componentDidMount() {
    console.log(this.props);
    this.setState({ startTime: new Date() });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          paddingTop: height / 10,
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <RTCView
          style={{ display: "none" }}
          streamURL={this.props.stream ? this.props.stream.toURL() : ""}
        />
        <Image
          source={user}
          style={{
            width: 175,
            height: 175,
          }}
        />
        {/* add a call initiator check here */}
        <Text style={{ fontSize: width / 20 }}>
          {this.props.localPeer?.metadata?.username ||
            this.props.remotePeer?.connection?.username}
        </Text>
        {this.props.connStatus === "inCall" ? (
          <>
            <Timer />
            <TouchableOpacity
              onPress={() => {
                this.props.setConnStatus(null);
                try {
                  this.props.localPeer?.endCall();
                  this.props.remotePeer?.endCall();
                } catch (err) {
                  console.log("Something is fishy in development !", err);
                }
              }}
            >
              <Image
                source={end}
                style={{
                  alignSelf: "flex-start",
                  width: 100,
                  height: 100,
                }}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={{ color: "black", fontSize: width / 20 }}>
              Ringing..
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: "center",
                width: 200,
                height: 200,
              }}
              onPress ={() => {
                this.props.setConnStatus(null);
              }}
            >
              <Image
                source={decline}
                style={{
                  alignSelf: "flex-start",
                  width: 100,
                  height: 100,
                }}
              />
              </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  remotePeer: state.stream.remotePeer,
  localPeer: state.stream.localPeer,
  connStatus: state.data.connStatus,
  stream: state.stream.stream,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConnStatus: (status) => dispatch(setConnStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InCall);
