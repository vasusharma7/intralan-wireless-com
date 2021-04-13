import { CHAT_INIT, ADD_MESSAGE } from "./messageActionTypes";

const initalState = {
  chatInit: null,
  messages: [],
};

export const messageReducer = (state = initalState, action) => {
  switch (action.type) {
    case ADD_MESSAGE: {
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
