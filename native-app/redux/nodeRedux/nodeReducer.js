import { START_NODE } from "./nodeActionTypes";

const initalState = {};

export const nodeReducer = (state = initalState, action) => {
  switch (action.type) {
    case START_NODE: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};
export default nodeReducer;
