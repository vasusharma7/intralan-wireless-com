import { combineReducers } from "redux";

import { dataReducer } from "./dataRedux/dataReducer";
import { streamReducer } from "./streamRedux/streamReducer";

export const rootReducer = combineReducers({
  data: dataReducer,
  stream: streamReducer,
});
