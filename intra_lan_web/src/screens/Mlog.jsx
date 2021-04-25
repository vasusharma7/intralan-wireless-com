import React, { Component } from "react";
import "react-chat-elements/dist/main.css";
import { SideBar, MessageList } from "react-chat-elements";
import { Redirect } from "react-router-dom";
import { Button } from "baseui/button";
import Navbar from "./Navbar";
export default class Mlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      keys: [],
    };
  }
  componentDidMount = async () => {
    const data = await JSON.parse(localStorage.getItem("userData"));
    if (!data) return;
    this.setState({
      data: data,
      curMessages: [],
      back: false,
    });
    console.log(this.state.keys);
  };

  getChats = async () => {
    let ele = Object.keys(this.state.data).map((val) => {
      return (
        <div>
          <h3>Peer ID {val}</h3>
        </div>
      );
    });
    return ele;
  };

  goback = () => {
    this.setState({
      back: true,
    });
  };

  setChat = (val) => {
    const messages = this.state.data[val].messages.reverse();
    this.setState({
      curMessages: messages,
    });
    console.log(this.state.curMessages);
  };

  render() {
    this.getChats();
    return (
      <>
        <Navbar></Navbar>
        {this.state && this.state.back && (
          <Redirect push to={{ pathname: "/home" }} />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "86vh",
          }}
        >
          <div style={{ width: "30vw" }}>
            <SideBar
              type="light"
              top={
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "black",
                  }}
                >
                  <Button kind="secondary" onClick={() => this.goback()}>
                    Back
                  </Button>
                  <h3>My Chats</h3>
                  {Object.keys(this.state.data).map((val) => {
                    return (
                      <div>
                        <Button
                          kind="secondary"
                          style={{ width: "25vw", margin: 10 }}
                          onClick={() => this.setChat(val)}
                        >
                          Peer ID {val}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              }
              bottom={<div></div>}
            />
          </div>
          <div
            id="chatwindow"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "80vw",
              justifyContent: "flex-end",
              backgroundColor: "#C5CAC5",
              padding: 20,
            }}
          >
            <MessageList
              className="message-list"
              lockable={true}
              toBottomHeight={"100%"}
              dataSource={this.state.curMessages}
            />
          </div>
        </div>
      </>
    );
  }
}
