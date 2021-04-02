import { self } from "react-native-threads";

// listen for messages
self.onmessage = (message) => {};

// send a message, strings only
self.postMessage("hello");
