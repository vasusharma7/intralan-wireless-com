import React, { Component } from "react";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, View } from "react-native";
import { Appbar, List, Text } from "react-native-paper";
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
      <View>
        <Appbar.Header
          style={{
            backgroundColor: "#04045B",
          }}
        >
          <Appbar.Content
            title={"Call Logs"}
            style={{
              alignItems: "center",
            }}
          />
        </Appbar.Header>
        {this.state.calls.length ? (
          this.state.calls.map((call) => {
            return (
              <List.Item
                key={call.date}
                title={call.username}
                description={`PeerId : ${call.peerId}\nTime:${(
                  call.time / 1000
                ).toFixed(2)}(sec)\t|\tDate:${new Date(call.date)}`}
                left={(props) => <List.Icon {...props} icon="phone" />}
                onPress={() => {}}
              />
            );
          })
        ) : (
          <></>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CallLog);