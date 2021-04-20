import {
  LOCAL_PEER,
  REMOTE_PEER,
  AV_STREAM,
  SET_VEDIO_REF,
  STREAM_INIT
} from "./streamActionTypes";
import { store } from "../store";
import { chatInit } from "../messageRedux/messageAction";
export const setVideoRef = (ref) => {
  return {
    type: SET_VEDIO_REF,
    payload: ref,
  };
};
export const setLocalPeer = (peer) => {
  return {
    type: LOCAL_PEER,
    payload: peer,
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

export const streamInit = (value) => {
  store.dispatch(chatInit());
  return {
    type: STREAM_INIT,
    payload: value,
  };
};

