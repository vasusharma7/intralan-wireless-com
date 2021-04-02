import {
  CONNECTION,
  METADATA,
  TOGGLE_SEARCH,
  CALL_STATUS,
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

export const toggleSearch = () => {
  return {
    type: TOGGLE_SEARCH,
  };
};

export const setCallStatus = (status) => {
  return {
    type: CALL_STATUS,
    payload: status,
  };
};
