// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.
require("./config");
const broadcast = require("./broadcast.js");
const utils = require("./utils");
var rn_bridge = require("rn-bridge");
let start = 0;
// Echo every message received from react-native.
rn_bridge.channel.on("message", (msg) => {
  msg = JSON.parse(msg);
  utils.appEventHandler(msg);

  rn_bridge.channel.send(msg);
});

// Inform react-native node is initialized.
rn_bridge.channel.send(JSON.stringify({ firedUp: `Node was initialized` }));

// setInterval(() => {
//   rn_bridge.channel.send("I am sending you a message");
// }, 2000);
