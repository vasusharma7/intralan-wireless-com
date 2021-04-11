import { CHAT_INIT, ADD_MESSAGE } from "./messageActionTypes";

export const addMessage = (message) => {
  return {
    type: ADD_MESSAGE,
    payload: message,
  };
};

export const chatInit = (value) => {
  return {
    type: CHAT_INIT,
    payload: value,
  };
};
