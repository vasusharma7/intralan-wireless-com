import React, { Component } from "react";
import {
  Alert,
  Image,
  Button,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { store } from "../redux/store";
import { streamInit } from "../redux/streamRedux/streamAction";
import { Title } from "react-native-paper";
import { setConnStatus } from "../redux/dataRedux/dataAction";
const { width, height } = Dimensions.get("screen");
export class FileTransfer extends Component {
  constructor(props) {
    super(props);
    // this.state = store.getState().stream;
  }
  render() {
    return (
      <>
        {this.props.streamMetaData.permission ? (
          this.props.streamInit ? (
            <>
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "#000",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Title style={{ color: "white", textAlign: "center" }}>
                  {this.props?.streamMetaData?.name ||
                    "<File Name Not Avaialble>"}
                </Title>
                <Title style={{ color: "white", textAlign: "center" }}>
                  {this.props?.streamMetaData?.size ||
                    "<File Size Not Avaialble>"}
                </Title>
                <Image
                  source={require("../assets/connecting.gif")}
                  style={{
                    width: 300,
                    height: 300,
                  }}
                />
                <Title style={{ color: "white", textAlign: "center" }}>
                  Waiting for the peer to grant Receive Permission
                </Title>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.props.setConnStatus(null)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "#000",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Title style={{ color: "white", textAlign: "center" }}>
                  {this.props?.streamMetaData?.name ||
                    "<File Name Not Avaialble>"}
                </Title>
                <Title style={{ color: "white", textAlign: "center" }}>
                  {this.props?.streamMetaData?.size ||
                    "<File Size Not Avaialble>"}
                </Title>
                <Image
                  source={require("../assets/connecting.gif")}
                  style={{
                    width: 300,
                    height: 300,
                  }}
                />
                <Title
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: width / 22.5,
                  }}
                >
                  {this.props.localPeer?.metadata?.username} is Requesting for
                  File Transfer Approval
                </Title>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "space-around",
                    justifyContent: "space-around",
                    alignItems: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.props.localPeer.receiveFile()}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      this.props.localPeer.rejectFile();
                    }}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )
        ) : (
          <>
            <AnimatedCircularProgress
              size={(1 * width) / 2}
              width={15}
              fill={this.props.progress}
              tintColor="#0466aa"
              backgroundColor="rgba(1,1,1,0.7)"
              style={{
                alignSelf: "center",
              }}
            >
              {() => <Text>{this.props.progress}%</Text>}
            </AnimatedCircularProgress>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    // setConnStatus: (status) => dispatch(setConnStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FileTransfer);

const styles = {
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    margin: width / 40,
    borderColour: "transparent",
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "#0fefaa",
    padding: width / 35,
  },
};
