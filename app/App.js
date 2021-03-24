import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import StaticServer from "react-native-static-server";
import WebView from "react-native-webview";

class App extends React.Component {
  state = {
    url: null,
  };
  componentDidMount() {
    this.server = new StaticServer(6000);
    this.server.start().then((url) => {
      this.setState({ url });
    });
  }

  componentWillUnmount() {
    // if (this.server && this.server.isRunning()) {
    //   this.server.stop();
    // }
  }

  render() {
    if (!this.state.url) {
      return (
        <SafeAreaView>
          <Text>Hello World</Text>
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView>
        <Text>{this.state.url}</Text>
        <View style={{ height: "100%", width: "100%" }}>
          {/* <WebView
            style={{ flex: 1, marginBottom: 20 }}
            source={{ uri: this.state.url }}
          /> */}
        </View>
      </SafeAreaView>
    );
  }
}
export default App;
