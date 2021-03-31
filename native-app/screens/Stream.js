import React, { Component } from "react";
import { connect } from "react-redux";
import Player from "react-native-streaming-audio-player";
import { updateConnections, updateInfo } from "../redux/dataRedux/dataAction";
import {} from "../redux/streamRedux/streamAction";

export class Stream extends Component {
  constructor(props) {
    super(props);
    this.state = { currentTime: 0 };
    this.onUpdatePosition = this.onUpdatePosition.bind(this);
  }

  onPlay() {
    Player.play(this.props.stream, {
      title: source,
      artist: source.artist,
      album_art_uri: source.arworkUrl,
    });
  }

  onPause() {
    Player.pause();
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
          <Button title="Pause" onPress={() => this.onPause()} color="red" />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  stream: state.stream.stream,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Stream);
