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
import { Title } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("screen");
export class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      contact: "",
      email: "",
    };
  }

  onClickListener = () => {
    if (
      Object.keys(this.state).filter((val) => this.state[val].length === 0)
        .length
    ) {
      Alert.alert("Please enter all details");
      return;
    }
    console.log(this.state);
    let uid = new Date().getTime();
    Alert.alert("IntraLANCom ID", `Your Unique ID is ${uid}`, [
      {
        text: "Proceed",
        onPress: async () => {
          await AsyncStorage.setItem(
            "auth",
            JSON.stringify({ uid: uid, ...this.state })
          ).then(() => {
            global.config.authInfo = { uid: uid, ...this.state };
            this.props.navigation.navigate({
              name: "Splash",
              key: "Splash",
              params: { auth: true },
            });
          });
        },
      },
      {
        text: "Cancel",
        onPress: () => {},
      },
    ]);
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Title style={{ color: "white", textAlign: "center", paddingTop: 10 }}>
          IntraLAN Mobile
        </Title>
        <Text style={{ color: "white", textAlign: "center", paddingTop: 10 }}>
          Connect safe, secure and fast
        </Text>
        <View style={styles.container1}>
          <Image
            source={require("../assets/splash.gif")}
            style={{ width: width / 2, height: height / 3 }}
          />
          <View style={styles.container2}>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputs}
                placeholder="Name"
                keyboardType="default"
                value={this.state.username}
                underlineColorAndroid="transparent"
                onChangeText={(username) => this.setState({ username })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputs}
                value={this.state.contact}
                placeholder="Contact No."
                keyboardType="number-pad"
                underlineColorAndroid="transparent"
                onChangeText={(contact) => this.setState({ contact })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.inputs}
                value={this.state.email}
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
    backgroundColor: "#4385F5",
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4385F5",
  },
  container2: {
    flex: 1,
    width: width,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#4385F5",
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
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "transparent",
    justifyContent: "center",
    backgroundColor: "#222",
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
    backgroundColor: "#0a0124",
  },
  loginText: {
    color: "white",
  },
});
// primary: "#00203f",
//     accent: "#adf0d1",
