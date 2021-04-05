import React, { Component } from "react";
import { connect } from "react-redux";
import { Dimensions, Text, View } from "react-native";
const { width, height } = Dimensions.get("screen");
export class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mins: "00",
      secs: "00",
      timeElapsed: 0,
    };
  }
  //hours are not handled as of now
  incrementTimer() {
    setInterval(() => {
      this.setState({ timeElapsed: new Date() - this.state.startTime }, () => {
        this.setState(
          {
            secs: `${
              Math.floor(this.state.timeElapsed / 1000) % 60 < 10 ? "0" : ""
            }${Math.floor(this.state.timeElapsed / 1000) % 60}`,
          },
          () =>
            this.setState({
              mins: `${
                Math.floor(this.state.timeElapsed / (60 * 1000)) < 10 ? "0" : ""
              }${Math.floor(this.state.timeElapsed / (60 * 1000))}`,
            })
        );
      });
    }, 1000);
  }
  componentDidMount() {
    this.setState({ startTime: new Date() });
    this.incrementTimer();
  }
  render() {
    return (
      <View>
        <Text style={{ fontSize: width / 20 }}>{`${this.state.mins} : ${
          this.state.secs
        }`}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
