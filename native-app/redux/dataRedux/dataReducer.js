import { CONNECTION, METADATA } from "./dataActionTypes";

const initalState = {
  connections: {},
  info: {},
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
    default:
      return state;
  }
};
export default dataReducer;
