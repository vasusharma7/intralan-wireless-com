import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Card, StyledBody, StyledAction } from "baseui/card";
import { Button } from "baseui/button";
import { Display3 } from "baseui/typography";
import { Avatar } from "baseui/avatar";
import Navbar from "./Navbar";

const dateformat = require("dateformat");
export default class Clog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calls: [],
      back: false,
    };
  }

  componentDidMount = async () => {
    console.log(localStorage.getItem("userCalls"));
    let calls = await JSON.parse(localStorage.getItem("userCalls"));
    this.setState({
      calls: calls.calls,
    });
    console.log(this.state.calls);
  };

  goback = () => {
    this.setState({
      back: true,
    });
  };
  render() {
    return (
      <>
        <Navbar></Navbar>
        {this.state?.back && <Redirect push to="/home"></Redirect>}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Display3 color="black" style={{ textAlign: "center" }}>
            Call Logs
          </Display3>
          <hr></hr>
          <Button kind="secondary" onClick={() => this.goback()}>
            Go back
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.state.calls.map((val) => {
            return (
              <Card style={{ height: "auto", width: "30vw", margin: 20 }}>
                <StyledBody>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      name={val.username}
                      src="https://images.vexels.com/media/users/3/137415/isolated/preview/0e475bb9b17b3fa4f94f31fba1635b8f-telephone-call-icon-logo-by-vexels.png"
                      size="160px"
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h4>Username : {val.username}</h4>
                      <h4>PeerID: {val.peerId}</h4>
                      <h4>IP address: {val.ip}</h4>
                      <h4>
                        Time :{" "}
                        {dateformat(
                          val.date,
                          "dddd, mmmm dS, yyyy, h:MM:ss TT"
                        )}
                      </h4>
                    </div>
                  </div>
                </StyledBody>
                <StyledAction></StyledAction>
              </Card>
            );
          })}
        </div>
      </>
    );
  }
}
