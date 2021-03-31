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
        localPeer: state.payload,
      };
    }
    case REMOTE_PEER: {
      return {
        ...state,
        remotePeer: state.payload,
      };
    }
    case AV_STREAM: {
      return {
        ...state,
        stream: state.payload,
      };
    }
    default:
      return state;
  }
};
export default streamReducer;
