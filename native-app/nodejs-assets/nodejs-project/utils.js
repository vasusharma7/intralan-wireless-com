const appEventHandler = (msg) => {
  const event = Object.keys(msg)[0];
  switch (event) {
    case "localPeerId": {
      global.config.metadata["localPeerId"] = msg[event];
      return;
    }
    default:
      console.table(msg);
  }
};
module.exports = { appEventHandler };
