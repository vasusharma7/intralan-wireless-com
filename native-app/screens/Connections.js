import { BottomNavigation, Text } from "react-native-paper";
import React, { Component } from "react";
import { Platform, View, Alert } from "react-native";
import { Appbar, List } from "react-native-paper";
import { connect } from "react-redux";
import { updateConnections, updateInfo } from "../redux/dataRedux/dataAction";
class Connections extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(prevProps) === JSON.stringify(this.props)) return;
    // console.log("received new props in Connections:) -> ", this.props);
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
            title="IntraLAN Communication"
            subtitle="Under Developement :)"
          />
        </Appbar.Header>
        <View>
          {this.props?.info &&
            Object.keys(this.props?.info).map((ip) => {
              return (
                <List.Item
                  key={ip}
                  title={this.props.info[ip]["username"]}
                  description={this.props.info[ip]["ip"]}
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
const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnections: (connections) =>
      dispatch(updateConnections(connections)),
    updateInfo: (info) => dispatch(updateInfo(info)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Connections);
