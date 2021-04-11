import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from "react-native";
const { width, height } = Dimensions.get("screen");
export class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      contact: "",
      email: "",
    };
  }

  onClickListener = () => {
    Alert.alert("IntraLANCom ID", `Your Unique ID is ${new Date().getTime()}`);
    console.log(this.state);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.container1}>
          <Image
            source={require("../assets/login_main.gif")}
            style={{ width: width }}
          />
          <View style={styles.container2}>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
                source={require("../assets/login.gif")}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Name"
                keyboardType="default"
                underlineColorAndroid="transparent"
                onChangeText={(name) => this.setState({ name })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
                source={require("../assets/login.gif")}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Contact No."
                keyboardType="number-pad"
                underlineColorAndroid="transparent"
                onChangeText={(contact) => this.setState({ contact })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
                source={require("../assets/login.gif")}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid="transparent"
                onChangeText={(email) => this.setState({ email })}
              />
            </View>

            {/* <View style={styles.inputContainer}>
          <Image
            style={styles.inputIcon}
            source={require("../assets/login.gif")}
          />
          <TextInput
            style={styles.inputs}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            onChangeText={(password) => this.setState({ password })}
          />
        </View> */}

            <TouchableHighlight
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => this.onClickListener()}
            >
              <Text style={styles.loginText}>Authenticate</Text>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffe6cb",
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff9e4",
    paddingTop: height / 10,
  },
  container2: {
    flex: 1,
    width: width,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffe6cb",
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#00203f",
  },
  loginText: {
    color: "white",
  },
});
// primary: "#00203f",
//     accent: "#adf0d1",
