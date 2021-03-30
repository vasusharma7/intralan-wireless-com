import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { connect } from "react-redux";
import NodeService from "./Service";
import nodejs from "nodejs-mobile-react-native";

class Settings extends Component {
  constructor(props) {
    super(props);
  }
  startNode = () => {
    nodejs.start("main.js");
    nodejs.channel.addListener(
      "message",
      (msg) => {
        // alert("From node: " + msg);
        console.log("From node: " + msg);
      },
      this
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.view}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.startNode()}
          >
            <Text style={styles.instructions}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => NodeService.stopService()}
          >
            <Text style={styles.instructions}>Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => nodejs.channel.send("A message!")}
          >
            <Text style={styles.instructions}>Invoke</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  view: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "gray",
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    color: "white",
  },
});
