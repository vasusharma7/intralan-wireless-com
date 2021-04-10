import {
  INIT,
  SEARCH_START,
  SEARCH_STOP,
  TOGGLE_SEARCH,
} from "./searchActionTypes";
import { store } from "../store";
import {
  updateInfo,
  updateConnections,
  setConnStatus,
} from "../dataRedux/dataAction";
const Netmask = require("netmask").Netmask;

const socketIOClient = require("socket.io-client");
sleep = (milliseconds) => {
  let timeStart = new Date().getTime();
  while (true) {
    let elapsedTime = new Date().getTime() - timeStart;
    if (elapsedTime > milliseconds) {
      break;
    }
  }
};

export const initSearch = (block) => {
  console.log("initialising search....");
  const ips = [];
  const generator = new Netmask(block);
  generator.forEach((ip) => ips.push(ip));

  return {
    type: INIT,
    payload: { block: block, ips: ips },
  };
};
export const startSearch = () => {
  return (dispatch) => {
    const state = store.getState();

    if (!state.search.search) {
      console.log("stopping search");
      dispatch(toggleSearch());
      return;
    }

    if (!state.search.searchData.ips.length) return;
    setTimeout(async () => {
      console.log("Search Starting....", state.search.searchData.ips.length);

      await Promise.all(
        state.search.searchData.ips.map(async (ip) => await connect(ip))
      )
        .then(async (res) => {
          console.log("success", res.length);
          await new Promise((r) => setTimeout(r, 5000));
          dispatch(startSearch());
        })
        .catch((ips) => console.log(ips));
    }, 0);
  };
};

handleConnectionChange = (connections) => {
  const state = store.getState();
  store.dispatch(updateConnections(connections));
  console.log("connections found : ", Object.keys(connections).length);
  for (let ip in connections) {
    // if (!this.state.info[ip])
    //add a peer js id change listener here and uncomment the above line to reduce overhead
    connections[ip].on("broadcast", (data) => {
      console.log("receiving broadcast data", data);
      handleInfoChnage({ ...state.data.info, [ip]: data });
      connections[ip].off("broadcast");
    });
  }
};

handleInfoChnage = (info) => {
  store.dispatch(updateInfo(info));
  console.log("info found : ", Object.keys(info).length);
};

connect = async (ip) => {
  const state = store.getState();
  if (ip === global.config.info.ip) {
    console.log("self IP");
    return;
  }
  // console.log(ip)
  return new Promise(async (resolve, reject) => {
    const socket = await socketIOClient(`http://${ip}:5000`);
    socket.on("connect", () => {
      console.log(socket.id, socket.connected);
      !Object.keys(state.data.connections).includes(ip) &&
        handleConnectionChange({
          ...state.data.connections,
          [ip]: socket,
        });
    });
    resolve(ip);
  });
};
export const toggleSearch = () => {
  return {
    type: TOGGLE_SEARCH,
  };
};
export const stopSearch = () => {
  store.dispatch(setConnStatus(null));
  return {
    type: SEARCH_STOP,
  };
};
