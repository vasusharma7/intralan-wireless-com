import React, { Component } from "react";
import { Alert, Button, Dimensions, Text, View } from "react-native";
import { connect } from "react-redux";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { store } from "../redux/store";
import { streamInit } from "../redux/streamRedux/streamAction";
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
        {this.props.streamMetaData.permission ? (
          this.props.streamInit ? (
            <>
              <Text>Waiting for File Receive Permission</Text>
            </>
          ) : (
            <>
              <Text>User is Requesting Approval for File Transfer</Text>
              <Button
                title="Accept"
                onPress={() => this.localPeer.receiveFile()}
              />
              <Button
                title="Reject"
                onPress={() => this.localPeer.rejectFile()}
              />
            </>
          )
        ) : (
          <>
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
          </>
        )}
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
    streamMetaData: state.stream.streamMetaData,
  };
};

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTransfer);
