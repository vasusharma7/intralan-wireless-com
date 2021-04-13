import React, { Component } from "react";
import { Alert, Dimensions, Text, View } from "react-native";
import { connect } from "react-redux";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { store } from "../redux/store";
const { width, height } = Dimensions.get("screen");
export class FileTransfer extends Component {
  constructor(props) {
    super(props);
    // this.state = store.getState().stream;
  }
  render() {
    return (
      <View
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatedCircularProgress
          size={(1 * width) / 2}
          width={15}
          fill={this.props.progress}
          tintColor="#00e0ff"
          backgroundColor="#3d5875"
          style={{
            alignSelf: "center",
          }}
        >
          {() => <Text>{this.props.progress}%</Text>}
        </AnimatedCircularProgress>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fileInit: state.stream.streamInit,
    localPeer: state.stream.localPeer,
    remotePeer: state.stream.remotePeer,
    fileProgress: state.stream.fileProgress,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTransfer);
