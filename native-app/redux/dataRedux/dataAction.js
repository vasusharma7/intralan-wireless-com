import { CONNECTION, METADATA } from "./dataActionTypes";

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
