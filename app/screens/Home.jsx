import React, { Component } from "react";
import { Platform, View, Text } from "react-native";
import { Appbar, List } from "react-native-paper";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate() {
    console.log("props", this.props);
  }
  render() {
    // return (
    //   <>
    //     <View>
    //       <Text>This is Home Component</Text>
    //     </View>
    //   </>
    // );
    return (
      <>
        <Appbar.Header>
          <Appbar.Content
            title="IntraLAN Wireless Communication"
            subtitle="Under Developement"
          />
        </Appbar.Header>
        <View>
          {Object.keys(this.props?.connections).map((ip) => {
            return (
              <List.Item
                title={this.props.connections[ip]["username"]}
                description={this.props.connections[ip]["ip"]}
                left={(props) => <List.Icon {...props} icon="network" />}
              />
            );
          })}
        </View>
      </>
    );
  }
}
