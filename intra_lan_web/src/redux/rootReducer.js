import { combineReducers } from "redux";

import { dataReducer } from "./dataRedux/dataReducer";
import { streamReducer } from "./streamRedux/streamReducer";
import { searchReducer } from "./searchRedux/searchReducer";

export const rootReducer = combineReducers({
  data: dataReducer,
  stream: streamReducer,
  search: searchReducer,
});
