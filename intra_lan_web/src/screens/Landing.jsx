import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Display1 } from "baseui/typography";
import { Button } from "baseui/button";
export default class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gologin: false,
    };
  }
  gotoLogin = () => {
    this.setState({
      gologin: true,
    });
  };
  componentDidMount() {
    const authInfo = {};
    authInfo["name"] = localStorage.getItem("name");
    authInfo["email"] = localStorage.getItem("email");
    authInfo["uid"] = localStorage.getItem("id");
    localStorage.setItem("authInfo", JSON.stringify(authInfo));
    // global.config.authInfo = authInfo;
  }
  render() {
    return (
      <div
        style={{
          background: "#4385F5",
          height: "100vh",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {this.state.gologin === true && (
          <Redirect push to={{ pathname: "/login" }} />
        )}
        <div style={{ marginLeft: "40px" }}>
          <Display1>Welcome to IntraLAN web</Display1>
          <Button onClick={this.gotoLogin}>Get Started</Button>
        </div>
        <img alt="lan" src="https://i.pinimg.com/originals/1c/aa/40/1caa406fbe764228551a30045e0ec271.gif"></img>
      </div>
    );
  }
}
