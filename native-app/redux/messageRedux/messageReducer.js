import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHAT_INIT, ADD_MESSAGE } from "./messageActionTypes";

const initalState = {
  chatInit: null,
  messages: [],
};

const saveMessage = async (message) => {
  await AsyncStorage.getItem("userData").then(async (userData) => {
    let peerId = message.user._id.toString();
    // console.log(peerId, message);
    userData = JSON.parse(userData);
    let user = userData[peerId] || {};
    let messages = user["messages"] || [];
    messages.push(message);
    user["messages"] = messages;
    userData[peerId] = user;
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
  });
};
export const messageReducer = (state = initalState, action) => {
  switch (action.type) {
    case ADD_MESSAGE: {
      saveMessage(action.payload);
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
