import React, { Component } from "react";
import {
  SafeAreaView,
  Text,
  Dimensions,
  TextInput,
  Button,
  View,
  StyleSheet,
} from "react-native";
const { width, height } = Dimensions.get("screen");
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { connect } from "react-redux";
import { GiftedChat } from "react-native-gifted-chat";

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.onSend = this.onSend.bind(this);
  }
  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Welcome to IntraLAN",
          createdAt: new Date(Date.now()),
          user: {
            _id: this.props.remotePeer,
            name: "Dummy",
          },
        },
      ],
    });
  }
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });
    // console.log(messages)
    // Change later to use peer ids
    if (this.props.chatInit)
      this.props.remotePeer.sendMessage(messages[0].text);
    else this.props.localPeer.sendMessage(messages[0].text);
  }
  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={{
          _id: this.props.localPeer,
        }}
      />
    );
  }
}
const mapStateToProps = (state) => ({
  remotePeer: state.stream.remotePeer,
  localPeer: state.stream.localPeer,
  chatInit: state.message.chatInit,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setConnStatus: (status) => dispatch(setConnStatus(status)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message);
