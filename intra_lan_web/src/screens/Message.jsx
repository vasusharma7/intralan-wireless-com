import React, { Component } from "react";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { connect } from "react-redux";
import { MessageList, SideBar } from "react-chat-elements";
import { Button } from "baseui/button";
import { Input } from "baseui/input";

import "react-chat-elements/dist/main.css";
import { H3 } from "baseui/typography";
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.onSend = this.onSend.bind(this);
  }
  componentDidMount() {
    this.setState({
      messages: [],
      curMessage: "",
    });
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        if (this.state.curMessage === "") {
          console.log("empty msg");
        } else {
          this.onSend();
        }
      }
    };
    document.addEventListener("keydown", listener);
  }

  onEnd = () => {
    this.props.setConnStatus(null);
    this.props.chatInit
      ? this.props.remotePeer.chatEnd()
      : this.props.localPeer.chatEnd();
  };

  onSend() {
    if (this.props.chatInit)
      this.props.remotePeer.sendMessage(this.state.curMessage);
    else this.props.localPeer.sendMessage(this.state.curMessage);
    this.setState({
      curMessage: "",
    });
  }

  setMessage = (e) => {
    this.setState({
      curMessage: e.target.value,
    });
  };
  render() {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100vh",
          }}
        >
          <div style={{ width: "20vw" }}>
            <SideBar
              type="light"
              top={
                <div>
                  <H3 color="black">NetCon Chat</H3>
                  <Button onClick={() => this.onEnd()}>End Session</Button>
                </div>
              }
              center={<div></div>}
              bottom={<div></div>}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80vw",
              justifyContent: "flex-end",
              backgroundColor: "black",
              padding: 20,
            }}
          >
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={this.props.messages}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "10vh",
                alignItems: "center",
              }}
            >
              <Input
                onChange={this.setMessage}
                placeholder="Type a message"
                value={this.state.curMessage}
              ></Input>
              <Button
                style={{
                  borderRadius: 40,
                  height: "5vh",
                  backgroundColor: "blue",
                  color: "white",
                }}
                // kind="secondary"
                onClick={() => {
                  this.onSend();
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  remotePeer: state.stream.remotePeer,
  localPeer: state.stream.localPeer,
  chatInit: state.stream.streamInit,
  messages: state.message.messages,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConnStatus: (status) => dispatch(setConnStatus(status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Message);
