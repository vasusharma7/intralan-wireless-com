import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Button, StyleSheet } from "react-native";
import { RTCView } from "react-native-webrtc";

import {} from "../redux/streamRedux/streamAction";
export class Stream extends Component {
  constructor(props) {
    super(props);
    this.state = { currentTime: 0 };
  }

  onPlay() {
    console.log(this.props.stream);
    this.setState({ play: true });
  }

  onPause() {
    this.setState({ play: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "stretch",
            justifyContent: "space-around",
          }}
        >
          <Button title="Play" onPress={() => this.onPlay()} color="red" />
          <RTCView
            streamURL={this.state.play ? this.props.stream.toURL() : ""}
          />
          <Button title="Pause" onPress={() => this.onPause()} color="red" />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
const mapStateToProps = (state) => ({
  stream: state.stream.stream,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stream);
