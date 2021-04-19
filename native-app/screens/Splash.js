import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Dimensions, Image, View, Text } from "react-native";
import { Title } from "react-native-paper";
import { connect } from "react-redux";
const { width, height } = Dimensions.get("screen");

export class Splash extends Component {
  constructor(props) {
    super(props);
    this.state = { message: "" };
  }
  performUpdate = async () => {
    await AsyncStorage.getItem("auth").then((res) => {
      if (res) {
        global.config.authInfo = JSON.parse(res);
      }
      const cond = this.props.route?.params?.auth || res;
      // console.log("splash", this.props.route?.params?.auth, res);
      let component = cond ? "Home" : "Auth";
      this.setState({
        message: cond
          ? "Authenticated | Lets Fly...."
          : "Let's dive in to register....",
      });
      setTimeout(() => {
        this.props.navigation.replace(component);
      }, 1000);
    });
  };
  async componentDidMount() {
    this.performUpdate();
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#222",
        }}
      >
        <Image
          source={require("../assets/wifi.gif")}
          style={{ width: Math.max(400, (3 * width) / 4), height: height / 2 }}
        />

        <Title style={{ color: "white", textAlign: "center", paddingTop: 10 }}>
          NetCon Mobile
        </Title>
        <Text style={{ color: "white", textAlign: "center", paddingTop: 10 }}>
          Connect safe, secure and fast
        </Text>
        <Title
          style={{
            color: "white",
            textAlign: "center",
            paddingTop: 10,
            fontSize: 15,
          }}
        >
          {this.state.message}
        </Title>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Splash);
