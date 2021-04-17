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
      <View>
        {this.state.messages.length ? (
          <>
            <GiftedChat
              key={this.state.messages.length}
              messages={[
                {
                  _id: 1618665868445,
                  createdAt: "2021-04-17T13:24:28.445Z",
                  text: "Save this message",
                  user: { _id: 1618559790276, name: "Vasu" },
                },
              ]}
              onSend={() => {}}
              user={{
                _id: global.config.authInfo.uid,
              }}
            />
          </>
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
)(ChatScreen);
