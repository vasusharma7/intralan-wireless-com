import React, { Component } from "react";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Display3 } from "baseui/typography";
import { Button } from "baseui/button";
import { Redirect } from "react-router-dom";
import "react-notifications-component/dist/theme.css";
import ReactNotification, { store } from "react-notifications-component";
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logIn: false,
      register: false,
      name: "",
      email: "",
      phone: "",
    };
  }
  handleName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  handleEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  handlePhone = (e) => {
    this.setState({
      phone: e.target.value,
    });
  };

  handleReg = () => {
    console.log(this.state);
    let peerId = Date.now();
    localStorage.setItem("name", this.state.name);
    localStorage.setItem("email", this.state.email);
    localStorage.setItem("phone", this.state.phone);
    localStorage.setItem("peerId", peerId);
    localStorage.setItem(
      "authInfo",
      JSON.stringify({
        name: this.state.name,
        email: this.state.email,
        phone: this.state.phone,
        peerId: localStorage.getItem("peerId"),
      })
    );
    store.addNotification({
      title: "Done",
      message: "Registered successfully",
      type: "success",
      // insert: "top",
      container: "top-center",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: {
        duration: 3000,
        pauseOnHover: true,
      },
    });
  };
  handleLogin = () => {
    console.log(this.state);
    if (
      localStorage.getItem("email") === this.state.email &&
      localStorage.getItem("phone") === this.state.phone
    ) {
      console.log("Logged in");
      this.setState({
        logIn: true,
      });
    } else {
      store.addNotification({
        title: "Error",
        message: "Incorrect credentials",
        type: "danger",
        // insert: "top",
        container: "top-center",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          pauseOnHover: true,
        },
      });
      console.log("Invalid");
    }
  };
  render() {
    return (
      <>
        <ReactNotification></ReactNotification>
        <div
          style={{
            background: "#4385F5",
            height: "100vh",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          {this.state && this.state.logIn && (
            <Redirect push to={{ pathname: "/home" }} />
          )}
          <div>
            <Display3>Register</Display3>
            <FormControl label="Name">
              <Input onChange={this.handleName}></Input>
            </FormControl>
            <FormControl label="Email">
              <Input onChange={this.handleEmail}></Input>
            </FormControl>
            <FormControl label="Phone number">
              <Input onChange={this.handlePhone}></Input>
            </FormControl>
            <Button onClick={this.handleReg}>Register Now</Button>
          </div>
          <div>
            <Display3>Login</Display3>
            <FormControl label="Email">
              <Input onChange={this.handleEmail}></Input>
            </FormControl>
            <FormControl label="Phone number">
              <Input onChange={this.handlePhone}></Input>
            </FormControl>
            <Button onClick={this.handleLogin}>Login Now</Button>
          </div>
        </div>
      </>
    );
  }
}
