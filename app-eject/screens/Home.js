import React, { Component } from "react";
import { Platform, View, Text, Alert } from "react-native";
import { Appbar, List } from "react-native-paper";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps) === JSON.stringify(this.props)) return;
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
            subtitle="Under Developement :)"
          />
        </Appbar.Header>
        <View>
          {Object.keys(this.props?.connections).map((ip) => {
            return (
              <List.Item
                key={ip}
                title={this.props.connections[ip]["username"]}
                description={this.props.connections[ip]["ip"]}
                left={(props) => <List.Icon {...props} icon="network" />}
                onPress={() => Alert.alert("Pending Work", "WIP")}
              />
            );
          })}
        </View>
      </>
    );
  }
}
