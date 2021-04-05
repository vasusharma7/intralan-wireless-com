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
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { store } from "../redux/store";
import Timer from "./components/Timer";
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
        <Image
          source={user}
          style={{
            width: 175,
            height: 175,
          }}
        />
        <Timer />
        <TouchableOpacity
          onPress={() => {
            this.props.setConnStatus(null);
            try {
              this.props.localPeer.endCall();
              this.props.remotePeer.endCall();
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
)(InCall);
