const { NetworkInfo } = require("react-native-network-info");

let info = {};
NetworkInfo.getIPV4Address().then((ip) => {
  info["ip"] = ip;
});
global.config = {
  appTitle: "NetCon",
  info: info,
  authInfo: {
    username: "",
    peerId: "",
    contact: "",
    email: "",
  },
};
