const appEventHandler = (msg) => {
  const event = Object.keys(msg)[0];
  switch (event) {
    case "localPeerId": {
      global.config.metadata["localPeerId"] = msg[event];
      return;
    }
    case "authInfo": {
      global.config.authInfo = msg[event];
      return;
    }
    case "clearId": {
      if (
        global.config.peerConnections !== {} &&
        global.config.peerConnections[msg[event]]
      ) {
        global.config.peerConnections[msg[event]].socket.close();
        delete global.config.peerConnections[msg[event]];
      }
      return;
    }
    default:
      console.table(msg);
  }
};
module.exports = { appEventHandler };
