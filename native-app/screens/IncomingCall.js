import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import { connect } from "react-redux";
import user from "../assets/user.png";
import reject from "../assets/decline.gif";
import answer from "../assets/call_.gif";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { store } from "../redux/store";
import { Title } from "react-native-paper";

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
          paddingTop: height / 15,
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Title
          style={{ color: "black", textAlign: "center", marginBottom: 20 }}
        >
          Incoming Call
        </Title>
        <Image
          source={user}
          style={{
            width: 175,
            height: 175,
          }}
        />
        <Text style={{ fontSize: width / 20 }}>
          {this.props.localPeer?.metadata?.username}
        </Text>
        <View
          style={{
            flex: 1,
            width: "100%",
            marginTop: 50,
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
          <TouchableOpacity
            onPress={() => {
              this.props.localPeer.rejectCall();
            }}
          >
            <Image
              source={reject}
              style={{
                alignSelf: "flex-end",
                marginRight: -(width / 10),
                width: 150,
                height: 150,
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
