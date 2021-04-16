import {
  LOCAL_PEER,
  REMOTE_PEER,
  AV_STREAM,
  SET_VEDIO_REF,
} from "./streamActionTypes";
import { createRef } from "react";
const initalState = {
  remotePeer: null,
  localPeer: null,
  stream: null,
  videoRef: createRef(),
};

export const streamReducer = (state = initalState, action) => {
  switch (action.type) {
    case LOCAL_PEER: {
      return {
        ...state,
        localPeer: action.payload,
      };
    }
    case SET_VEDIO_REF: {
      console.log(action.payload);
      return {
        ...state,
        videoRef: action.payload,
      };
    }
    case REMOTE_PEER: {
      return {
        ...state,
        remotePeer: action.payload,
      };
    }
    case AV_STREAM: {
      // console.log("in avstream", state);
      // state.videoRef.current.srcObject = action.payload;
      return {
        ...state,
        stream: action.payload,
      };
    }
    default:
      return state;
  }
};
export default streamReducer;
