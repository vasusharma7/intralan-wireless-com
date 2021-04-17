import React, { Component } from "react";
import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, View } from "react-native";
import { List, Text } from "react-native-paper";

export class ChatSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      users: [],
    };
  }
  async componentDidMount() {
    await AsyncStorage.getItem("userData").then((userData) => {
      if (!userData) return;
      userData = JSON.parse(userData);
      const users = Object.keys(userData);
      this.setState({ userData: userData });
      this.setState({ users: Object.keys(userData) });
      console.log(userData, users);
    });
  }
  render() {
    return (
      <View>
        {this.state.users.length ? (
          this.state.users.map((key) => {
            return (
              <List.Item
                key={key}
                title={this.state.userData[key]["messages"][0].user.name}
                description={`PeerId : ${
                  this.state.userData[key]["messages"][0].user._id
                }`}
                left={(props) => <List.Icon {...props} icon="chat" />}
                onPress={() => {
                  this.props.navigation.navigate({
                    name: "ChatScreen",
                    key: "ChatScreen",
                    params: {
                      messages: this.state.userData[key]["messages"],
                    },
                  });
                }}
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
)(ChatSelect);
