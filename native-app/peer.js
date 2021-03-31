const { NetworkInfo } = require("react-native-network-info");
require("react-native-webrtc");
import Peer from "react-native-peerjs";

class PeerClient {
  constructor(connection) {
    this.connection = connection;
    NetworkInfo.getIPV4Address().then((ip) => {
      this.ip = connection ? connection.ip : ip;
      this.peer = new Peer("", {
        host: this.ip,
        port: 5000,
        path: "/peerjs",
        secure: false,
      });
      console.log("firing listeners");
      this.fireEventListeners();
    });
  }
  fireEventListeners = () => {
    this.peer.on("error", console.log);

    this.peer.on("open", (peerId) => {
      this.peerId = peerId;
      console.log("Local peer open with ID", peerId);
    });

    this.peer.on("connection", (conn) => {
      console.log("Local peer has received connection.");
      conn.on("error", console.log);
      conn.on("open", () => {
        console.log("Local peer has opened connection.");
        console.log("conn", conn);
        conn.on("data", (data) =>
          console.log("Received from remote peer", data)
        );
        console.log("Local peer sending data.");
        conn.send("Hello, this is the LOCAL peer!");
      });
    });
  };
  getPeerId = () => {
    return this.peerId;
  };
  handleMessage = (data) => {
    console.log("receiving data from peer ", data);
  };
  connect = () => {
    conn = peer.connect(this.connection.peerId, {
      metadata: {
        username: this.connection.username,
      },
    });

    conn.on("data", this.handleMessage);
  };
}

module.exports = { PeerClient };
