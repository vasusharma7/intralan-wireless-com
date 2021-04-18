import React, { Component } from "react";
import { Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { connect } from "react-redux";

export class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }
  componentDidMount() {
    this.setState({ messages: this.props.route.params.messages }, () => {
      console.log(this.state.messages);
    });
  }
  render() {
    return (
      <>
        <GiftedChat
          messages={this.state.messages}
          onSend={() => {}}
          renderComposer={() => <></>}
          user={{
            _id: global.config.authInfo.peerId,
          }}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatScreen);
