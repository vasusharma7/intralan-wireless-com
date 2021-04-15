const { NetworkInfo } = require("react-native-network-info");

let info = {};
NetworkInfo.getIPV4Address().then((ip) => {
  info["ip"] = ip;
});
global.config = {
  appTitle: "IntraLAN Communication",
  info: info,
  authInfo: {
    username: "",
    uid: "",
    contact: "",
    email: "",
  },
};
