import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHAT_INIT, ADD_MESSAGE } from "./messageActionTypes";
import { store } from "../store";
const initalState = {
  chatInit: null,
  messages: [],
};

const saveMessage = async (message, state) => {
  await AsyncStorage.getItem("userData").then(async (userData) => {
    let peerId = message.senderId;
    // console.log(peerId, message);
    userData = JSON.parse(userData);
    let user = userData[peerId] || {};
    let messages = user["messages"] || [];
    messages.unshift(message);
    user["messages"] = messages;
    userData[peerId] = user;
    // console.log("in reducer", user);
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
  });
};
export const messageReducer = (state = initalState, action) => {
  switch (action.type) {
    case ADD_MESSAGE: {
      saveMessage(action.payload, action.state);
      let temp = state.messages;
      temp = [action.payload, ...temp];
      return {
        ...state,
        messages: temp,
      };
    }
    case CHAT_INIT: {
      return {
        ...state,
        messages: [],
      };
    }
    default:
      return state;
  }
};
export default messageReducer;
