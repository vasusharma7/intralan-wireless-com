import { INIT, SEARCH_STOP, TOGGLE_SEARCH } from "./searchActionTypes";

const initalState = {
  search: true,
  searchData: { ips: [], block: "" },
};

export const searchReducer = (state = initalState, action) => {
  switch (action.type) {
    case INIT: {
      return {
        ...state,
        searchData: action.payload,
      };
    }
    case SEARCH_STOP: {
      return {
        ...state,
        search: false,
      };
    }
    case TOGGLE_SEARCH: {
      return {
        ...state,
        search: true,
      };
    }
    default:
      return state;
  }
};
export default searchReducer;
