import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Component } from "react";
import { Dimensions, Image, View } from "react-native";
import { connect } from "react-redux";
const { width, height } = Dimensions.get("screen");

export class Splash extends Component {
  async componentDidMount() {
    await AsyncStorage.getItem("auth").then((res) => {
      let component = res ? "Home" : "Auth";
      setTimeout(() => {
        this.props.navigation.navigate(component);
      }, 1000);
    });
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
