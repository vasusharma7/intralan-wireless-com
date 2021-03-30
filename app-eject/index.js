import { registerRootComponent } from "expo";
import { AppRegistry } from "react-native";
import React from "react";
import App from "./App";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately

import { Provider } from "react-redux";
// import { name as appName } from "./app.json";
import { setHeartBeat, store } from "./store";

const MyHeadlessTask = async () => {
  console.log("Receiving HeartBeat!");
  store.dispatch(setHeartBeat(true));
  setTimeout(() => {
    store.dispatch(setHeartBeat(false));
  }, 1000);
};

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerHeadlessTask("Heartbeat", () => MyHeadlessTask);
registerRootComponent(RNRedux);
// AppRegistry.registerComponent(appName, () => );
