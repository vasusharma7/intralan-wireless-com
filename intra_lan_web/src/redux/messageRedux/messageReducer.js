import { CHAT_INIT, ADD_MESSAGE } from "./messageActionTypes";

const initalState = {
  chatInit: null,
  messages: [],
};

const saveMessage = async (message, state) => {
    let userData = localStorage.getItem("userData")
    console.log(message);
    if(!userData){
      userData = {}
      let userx = {"messages" : [message]}
      let id = message.senderId
      userData[id] = userx
      localStorage.setItem("userData", JSON.stringify(userData));
    }
    userData = JSON.parse(userData);
    let peerId = message.senderId;
    console.log(peerId)
    let user = userData[peerId] || {};
    let messages = user["messages"] || [];
    messages.unshift(message);
    user["messages"] = messages;
    userData[peerId] = user;
    // console.log("in reducer", user);
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log(userData)
};
export const messageReducer = (state = initalState, action) => {
  switch (action.type) {
    case CHAT_INIT: {
      // if(!localStorage.getItem("userData")){
      //     localStorage.setItem("userData", {})
      // }
      return {
        ...state,
        chatInit: action.payload,
        messages: [],
      };
    }
    case ADD_MESSAGE: {
      console.log("in reducer", action.payload, state);
      saveMessage(action.payload, state);
      let temp = state.messages;
      temp = [ ...temp, action.payload];
      return {
        ...state,
        messages: temp,
      };
    }
    default:
      return state;
  }
};
export default messageReducer;
