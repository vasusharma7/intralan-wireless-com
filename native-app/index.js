import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import App from "./App";
import { NavigationContainer } from "@react-navigation/native";
import Settings from "./screens/Settings";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { name as appName } from "./app.json";
const MyHeadlessTask = async () => {};
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "crimson",
    accent: "gray",
  },
};

const RNRedux = () => (
  <NavigationContainer>
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </PaperProvider>
  </NavigationContainer>
);

AppRegistry.registerHeadlessTask("NodeServiceEvent", () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => RNRedux);
