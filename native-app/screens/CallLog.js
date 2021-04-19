import React, { Component } from "react";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ScrollView, View } from "react-native";
import { Appbar, List, Text } from "react-native-paper";
const dateFormat = require("dateformat");
export class CallLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calls: [],
    };
  }
  async componentDidMount() {
    await AsyncStorage.getItem("userData").then((userData) => {
      if (!userData) return;
      userData = JSON.parse(userData);
      this.setState({ calls: userData.calls || [] }, () => {
        console.log(userData);
      });
    });
  }
  render() {
    return (
      <ScrollView>
        {this.state.calls.length ? (
          this.state.calls.map((call) => {
            return (
              <List.Item
                key={call.date}
                titleStyle={{ fontSize: 30 }}
                title={call.username === undefined ? "User" : call.username}
                descriptionNumberOfLines={3}
                description={`PeerId : ${
                  call.peerId === undefined ? "Anonymous" : call.peerId
                }\nDuration:${(call.time / 1000).toFixed(
                  2
                )}(sec)\nDate: ${dateFormat(
                  call.date,
                  "dddd, mmmm dS, yyyy, h:MM:ss TT"
                )}`}
                left={(props) => (
                  <List.Icon
                    {...props}
                    style={{ height: 60, width: 40 }}
                    icon="phone"
                  />
                )}
                onPress={() => {}}
              />
            );
          })
        ) : (
          <></>
        )}
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CallLog);
