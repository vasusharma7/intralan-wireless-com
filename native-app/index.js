import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { AppRegistry } from "react-native";
import React from "react";
// import { Provider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import App from "./App";
import Settings from "./Settings";
import { name as appName } from "./app.json";

const MyHeadlessTask = async () => {};
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "red",
    accent: "blue",
  },
};
const RNRedux = () => (
  <NavigationContainer>
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  </NavigationContainer>
);

AppRegistry.registerHeadlessTask("NodeServiceEvent", () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
