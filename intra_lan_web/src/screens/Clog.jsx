import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Card, StyledBody, StyledAction } from "baseui/card";
import { Button } from "baseui/button";
import { Display1, Display4 } from "baseui/typography";
import { Avatar } from "baseui/avatar";

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
        {this.state?.back && <Redirect push to="/home"></Redirect>}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Display1 color="black" style={{ textAlign: "center" }}>
            Call Logs
          </Display1>
          <hr></hr>
          <Button onClick={() => this.goback()}>Go back</Button>
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
                    <Avatar name={val.username} size="160px" />
                    {`Username : ${val.username}\nPeerID: ${
                      val.peerId
                    }\nIP address: ${val.ip}\nTime: ${dateformat(
                      val.date,
                      "dddd, mmmm dS, yyyy, h:MM:ss TT"
                    )}\n`}
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
