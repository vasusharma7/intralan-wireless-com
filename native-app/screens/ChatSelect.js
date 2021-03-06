import React, { Component } from "react";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, ScrollView, View } from "react-native";
import { List, Text, Appbar } from "react-native-paper";

export class ChatSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      peerIds: [],
    };
  }
  async componentDidMount() {
    await AsyncStorage.getItem("userData").then((userData) => {
      if (!userData) return;
      userData = JSON.parse(userData);
      const peerIds = Object.keys(userData);
      this.setState({ userData: userData });
      this.setState({ peerIds: peerIds });
      console.log(userData);
    });
  }
  render() {
    return (
      <ScrollView>
        {this.state.peerIds.length ? (
          this.state.peerIds.map((key) => {
            return this.state.userData[key]["info"] &&
              this.state.userData[key]["messages"] ? (
              <List.Item
                key={key}
                title={this.state.userData[key]["info"].username}
                description={`PeerId : ${
                  this.state.userData[key]["info"].peerId
                }`}
                left={(props) => <List.Icon {...props} icon="chat" />}
                onPress={() => {
                  this.props.navigation.navigate({
                    name: "Chat History",
                    key: "Chat History",
                    params: {
                      messages: this.state.userData[key]["messages"],
                    },
                  });
                }}
              />
            ) : (
              <></>
            );
          })
        ) : (
          <>
            <Text style={{ textAlign: "center", fontSize: 18 }}>
              No Recent Chats
            </Text>
          </>
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
)(ChatSelect);
