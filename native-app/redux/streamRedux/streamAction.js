import {
  LOCAL_PEER,
  REMOTE_PEER,
  AV_STREAM,
  STREAM_INIT,
  FILE_PROGRESS,
  STREAM_METADATA,
} from "./streamActionTypes";
import { store } from "../store";
import { chatInit } from "../messageRedux/messageAction";
export const setLocalPeer = (peer) => {
  return {
    type: LOCAL_PEER,
    payload: peer,
  };
};
export const setFileProgress = (data) => {
  return {
    type: FILE_PROGRESS,
    payload: data,
  };
};
export const setRemotePeer = (peer) => {
  return {
    type: REMOTE_PEER,
    payload: peer,
  };
};
export const setAVStream = (data) => {
  return {
    type: AV_STREAM,
    payload: data,
  };
};

export const setStreamMetaData = (data) => {
  return {
    type: STREAM_METADATA,
    payload: data,
  };
};
export const streamInit = (value) => {
  store.dispatch(chatInit());
  return {
    type: STREAM_INIT,
    payload: value,
  };
};
