const { NetworkInfo } = require("react-native-network-info");

let info = {};
NetworkInfo.getIPV4Address().then((ip) => {
  info["ip"] = ip;
  let rawBlock = ip.split(".");
  info["smallBlock"] = rawBlock.slice(0, 3).join(".") + ".0/24";
  info["mediumBlock"] = rawBlock.slice(0, 2).join(".") + ".0.0/23";
  info["largeBlock"] = rawBlock.slice(0, 1).join(".") + ".0.0.0/8";
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
