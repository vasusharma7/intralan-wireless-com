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
import accept from "../assets/accept.gif";
import decline from "../assets/decline.gif";
import user from "../assets/user.png";
import reject from "../assets/reject.png";
import answer from "../assets/answer.png";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { store } from "../redux/store";

export class IncomingCall extends Component {
  constructor(props) {
    super(props);
    this.state = { ...store.getState() };
  }
  //   componentDidMount() {
  //     console.log(this.props);
  //   }
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
        <Image
          source={user}
          style={{
            width: 175,
            height: 175,
          }}
        />
        <View
          style={{
            flex: 1,
            width: "100%",
            marginTop: height / 4,
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              //   this.state.stream.remotePeer.answerCall();
              this.props.setConnStatus(null);
              this.props.localPeer.answerCall();
            }}
          >
            <Image
              source={answer}
              style={{
                alignSelf: "flex-start",
                width: 100,
                height: 100,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Image
              source={reject}
              style={{
                alignSelf: "flex-end",
                width: 100,
                height: 100,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IncomingCall);
