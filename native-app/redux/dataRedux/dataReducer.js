import {
  CONNECTION,
  METADATA,
  TOGGLE_SEARCH,
  CALL_STATUS,
  SCREEN_STATUS,
} from "./dataActionTypes";

const initalState = {
  connections: {},
  info: {},
  search: false,
  connStatus: null,
  screenStatus: null,
};

export const dataReducer = (state = initalState, action) => {
  switch (action.type) {
    case CONNECTION:
      return {
        ...state,
        connections:
          action.payload === null
            ? {}
            : { ...state.connections, ...action.payload },
      };
    case METADATA:
      return {
        ...state,
        info:
          action.payload === null ? {} : { ...state.info, ...action.payload },
      };
    case TOGGLE_SEARCH:
      return {
        ...state,
        search: !state.search,
      };

    case CALL_STATUS:
      return {
        ...state,
        connStatus: action.payload,
      };
    case SCREEN_STATUS:
      return {
        ...state,
        screenStatus: action.payload,
      };
    default:
      return state;
  }
};
export default dataReducer;
