const { NetworkInfo } = require("react-native-network-info");
import { mediaDevices } from "react-native-webrtc";
require("react-native-webrtc");
import Peer from "react-native-peerjs";
import { store } from "./redux/store";
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
    this.peer.on("error", (err) => {
      console.log("listen", err);
    });
    this.peer.on("signal", (data) => {
      if (data.renegotiate || data.transceiverRequest) return;
    });
    this.peer.on("open", (peerId) => {
      this.peerId = peerId;
      console.log("Local peer open with ID", peerId, this.connection);
      this.connection && this.connect();
    });

    this.peer.on("connection", (conn) => {
      console.log("Local peer has received connection.");
      conn.on("error", (err) => {
        console.log("peer", err);
      });
      conn.on("open", () => {
        console.log("Local peer has opened connection.", this.peerId);
        console.log("conn", conn);
        conn.on("data", (data) =>
          console.log("Received from remote peer", data)
        );
        console.log("Local peer sending data.");
        conn.send("Hello, this is the LOCAL peer!");
      });
    });
    this.peer.on("call", function(call) {
      call.answer(window.localStream);

      // Receive data
      call.on("stream", function(stream) {
        // Store a global reference of the other user stream
        // window.peer_stream = stream;
        console.log("call answer", stream);
        // Display the stream of the other user in the peer-camera video element !
        // onReceiveStream(stream, "peer-camera");
      });

      // Handle when the call finishes
      // call.on("close", function() {
      //   console.log("The videocall has finished");
      // });

      // use call.close() to finish a call
    });
  };
  getPeerId = () => {
    return this.peerId;
  };
  startVideo = () => {
    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == "videoinput" &&
          sourceInfo.facing == (isFront ? "front" : "environment")
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 640,
            height: 480,
            frameRate: 30,
            facingMode: isFront ? "user" : "environment",
            deviceId: videoSourceId,
          },
        })
        .then((stream) => {
          // Got stream!
          console.log("console media", stream);
          const call = this.peer.call(this.connection.peerId, stream);

          call.on("stream", function(stream) {
            console.log("peer is streaming", this.peerId, stream);

            // onReceiveStream(stream, "peer-camera");
          });
        })
        .catch((error) => {
          console.log("error media", error);
          // Log error
        });
    });
  };

  handleMessage = (data) => {
    console.log("receiving data from peer ", data);
  };
  connect = () => {
    this.startVideo();
    // const conn = this.peer.connect(this.connection.peerId, {
    //   metadata: {
    //     username: this.connection.username,
    //   },
    // });
    // conn.on("error", (err) => {
    //   console.log("conn", err);
    // });
    // conn.on("data", this.handleMessage);
  };
}

module.exports = { PeerClient };
