// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.
var forever = require("forever-monitor");

var child = new forever.Monitor("./broadcast.js", {
  max: 3,
  silent: true,
  args: [],
});

child.on("exit", function () {
  console.log("[node] your-filename.js has exited after 3 restarts");
});

child.start();

// const broadcast = require("./broadcast.js");
var rn_bridge = require("rn-bridge");

// Echo every message received from react-native.
rn_bridge.channel.on("message", (msg) => {
  rn_bridge.channel.send(msg);
});

// Inform react-native node is initialized.
rn_bridge.channel.send(`Node was initialized`);

rn_bridge.app.on("pause", (pauseLock) => {
  console.log("[node] app paused.");
  rn_bridge.channel.send(`I am paused`);
});
