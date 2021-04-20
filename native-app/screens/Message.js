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
import { Appbar, List } from "react-native-paper";
import { Icon } from "react-native-vector-icons/MaterialIcons";

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.onSend = this.onSend.bind(this);
  }
  componentDidMount() {
    this.setState({
      messages: [],
    });
  }
  onSend(messages = []) {
    // this.setState((previousState) => {
    //   return {
    //     messages: GiftedChat.append(previousState.messages, messages),
    //   };
    // });
    // console.log(messages)
    // Change later to use peer ids
    if (this.props.chatInit)
      this.props.remotePeer.sendMessage(messages[0].text);
    else this.props.localPeer.sendMessage(messages[0].text);
  }
  render() {
    return (
      <>
        <Appbar.Header
          style={{
            backgroundColor: "#04045B",
          }}
        >
          <Appbar.Content
            title={
              this.props.chatInit
                ? this.props.remotePeer?.connection.username || "Annonymous"
                : this.props.localPeer?.metadata.username
            }
            subtitle={`PeerId : ${
              this.props.chatInit
                ? this.props.remotePeer?.connection.peerId || "Annonymous"
                : this.props.localPeer?.metadata.peerId
            }`}
            style={{
              alignItems: "center",
            }}
          />
          <Appbar.Action
            icon="close"
            onPress={() => {
              this.props.setConnStatus(null);
              this.props.chatInit
                ? this.props.remotePeer.chatEnd()
                : this.props.localPeer.chatEnd();
            }}
          />
        </Appbar.Header>
        <GiftedChat
          messages={this.props.messages}
          onSend={this.onSend}
          user={{
            _id: global.config.authInfo.peerId,
          }}
        />
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  remotePeer: state.stream.remotePeer,
  localPeer: state.stream.localPeer,
  chatInit: state.stream.streamInit,
  messages: state.message.messages,
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

// {
//   _id: 1,
//   text: "Welcome to IntraLAN",
//   createdAt: new Date(Date.now()),
//   user: {
//     _id: this.props.remotePeer,
//     name: "Dummy",
//   },
// },
