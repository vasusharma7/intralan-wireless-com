import {
  LOCAL_PEER,
  REMOTE_PEER,
  AV_STREAM,
  SET_VEDIO_REF,
} from "./streamActionTypes";

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
