import { LOCAL_PEER, REMOTE_PEER, AV_STREAM } from "./streamActionTypes";

const initalState = {
  remotePeer: null,
  localPeer: null,
  stream: null,
};

export const streamReducer = (state = initalState, action) => {
  switch (action.type) {
    case LOCAL_PEER: {
      return {
        ...state,
        localPeer: action.payload,
      };
    }
    case REMOTE_PEER: {
      return {
        ...state,
        remotePeer: action.payload,
      };
    }
    case AV_STREAM: {
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
