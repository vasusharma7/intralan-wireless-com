import { CONNECTION, METADATA, TOGGLE_SEARCH } from "./dataActionTypes";

const initalState = {
  connections: {},
  info: {},
  search: false,
};

export const dataReducer = (state = initalState, action) => {
  switch (action.type) {
    case CONNECTION:
      return {
        ...state,
        connections: { ...state.connections, ...action.payload },
      };
    case METADATA:
      return {
        ...state,
        info: { ...state.info, ...action.payload },
      };
    case TOGGLE_SEARCH:
      return {
        ...state,
        search: !state.search,
      };
    default:
      return state;
  }
};
export default dataReducer;
