import { CHAT_INIT, ADD_MESSAGE } from "./messageActionTypes";
import { store } from "../store";
export const addMessage = (message) => {
  const state = store.getState();
  return {
    type: ADD_MESSAGE,
    payload: message,
    state: state,
  };
};
export const chatInit = (message) => {
  return {
    type: CHAT_INIT,
    payload: message,
  };
};
