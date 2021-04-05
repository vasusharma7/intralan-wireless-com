import {
  CONNECTION,
  METADATA,
  TOGGLE_SEARCH,
  CALL_STATUS,
  SCREEN_STATUS,
} from "./dataActionTypes";

export const updateConnections = (data) => {
  return {
    type: CONNECTION,
    payload: data,
  };
};

export const updateInfo = (data) => {
  return {
    type: METADATA,
    payload: data,
  };
};

export const setConnStatus = (status) => {
  return {
    type: CALL_STATUS,
    payload: status,
  };
};
export const setScreenStatus = (status) => {
  return {
    type: SCREEN_STATUS,
    payload: status,
  };
};
