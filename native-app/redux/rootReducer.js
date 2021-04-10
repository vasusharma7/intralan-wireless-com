import { combineReducers } from "redux";

import { dataReducer } from "./dataRedux/dataReducer";
import { streamReducer } from "./streamRedux/streamReducer";
import { searchReducer } from "./searchRedux/searchReducer";
import { nodeReducer } from "./nodeRedux/nodeReducer";
import { messageReducer } from "./messageRedux/messageReducer";
export const rootReducer = combineReducers({
  data: dataReducer,
  stream: streamReducer,
  search: searchReducer,
  node: nodeReducer,
  message: messageReducer,
});
