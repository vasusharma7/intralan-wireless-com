import { LOCAL_PEER, REMOTE_PEER, AV_STREAM } from "./streamActionTypes";

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
