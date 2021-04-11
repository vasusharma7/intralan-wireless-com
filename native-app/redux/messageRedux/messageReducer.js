import { CHAT_INIT, ADD_MESSAGE } from "./messageActionTypes";

const initalState = {
  chatInit: null,
  messages: [],
};

export const messageReducer = (state = initalState, action) => {
  switch (action.type) {
    case CHAT_INIT: {
      return {
        ...state,
        chatInit: action.payload,
        messages: [],
      };
    }
    case ADD_MESSAGE: {
      console.log("in reducer", action, state);
      let temp = state.messages;
      temp = [action.payload, ...temp];
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
