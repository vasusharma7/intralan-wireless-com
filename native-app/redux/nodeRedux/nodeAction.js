import { START_NODE } from "./nodeActionTypes";
import nodejs from "nodejs-mobile-react-native";
import { PeerClient } from "../../peer";
import { store } from "../store";
import { setLocalPeer } from "../streamRedux/streamAction";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const handleNodeEvents = (msg) => {
  const state = store.getState();
  const event = Object.keys(msg)[0];
  switch (event) {
    case "firedUp": {
      Alert.alert("From node: " + msg[event]);
      echoNode();
      return;
    }
    case "echo": {
      console.log("echo localPeer", state.stream.localPeer);
      if (!state.stream.localPeer) {
        const peer = new PeerClient(null, "vasu_007");
        // const peer = new PeerClient(null, "vasu_007");
        store.dispatch(setLocalPeer(peer));
      }
      return;
    }
    default:
      Alert.alert("From node: " + msg[event]);
  }
};
export const echoNode = () => {
  return async (dispatch) => {
    console.log("Message arrived");
    await AsyncStorage.getItem("node").then((res) => {
      if (res) {
        res = JSON.parse(res);
        if (res.node) {
          nodejs.start("main.js");
        }
      }
    });
    addNodeEventListener();
    nodejs.channel.send(JSON.stringify({ echo: "echo" }));
  };
};
export const startNode = () => {
  return (dispatch) => {
    console.log("Starting node");
    nodejs.start("main.js");
    addNodeEventListener();
  };
};

export const addNodeEventListener = () => {
  nodejs.channel.addListener(
    "message",
    (msg) => {
      if (typeof msg == "string") {
        msg = JSON.parse(msg);
      }
      handleNodeEvents(msg);
    },
    this
  );
};
