import React, { Component } from "react";
import { connect } from "react-redux";
import { Display3 } from "baseui/typography";
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
    this.setState({
      interval: setInterval(() => {
        this.setState(
          { timeElapsed: new Date() - this.state.startTime },
          () => {
            this.setState(
              {
                secs: `${
                  Math.floor(this.state.timeElapsed / 1000) % 60 < 10 ? "0" : ""
                }${Math.floor(this.state.timeElapsed / 1000) % 60}`,
              },
              () =>
                this.setState({
                  mins: `${
                    Math.floor(this.state.timeElapsed / (60 * 1000)) < 10
                      ? "0"
                      : ""
                  }${Math.floor(this.state.timeElapsed / (60 * 1000))}`,
                })
            );
          }
        );
      }, 1000),
    });
  }
  componentDidMount() {
    this.setState({ startTime: new Date() });
    this.incrementTimer();
  }
  componentWillUnmount() {
    clearInterval(this.state.interval);
  }
  render() {
    return (
      <div style = {{marginTop : 100}}>
        <Display3>{`${this.state.mins} : ${
          this.state.secs
        }`}</Display3>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);