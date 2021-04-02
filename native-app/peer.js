const { NetworkInfo } = require("react-native-network-info");
import { mediaDevices } from "react-native-webrtc";
require("react-native-webrtc");
import Peer from "react-native-peerjs";
import { store } from "./redux/store";
import { setAVStream } from "./redux/streamRedux/streamAction";
import nodejs from "nodejs-mobile-react-native";
class PeerClient {
  constructor(connection) {
    this.connection = connection;
    NetworkInfo.getIPV4Address().then((ip) => {
      this.ip = connection?.ip ? connection.ip : ip;
      this.peer = new Peer(null, {
        host: this.ip,
        port: 5000,
        path: "/peerjs",
        secure: false,
        debug: true,
      });

      console.log("firing listeners");
      this.fireEventListeners();
      this.getMediaSource();
    });
  }
  getMediaSource = () => {
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      // console.log(sourceInfos);
      let audioSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (sourceInfo.kind == "audioinput") {
          audioSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          this.stream = stream;
        })
        .catch((error) => {
          console.log("error in getting media media", error);
          // Log error
        });
    });
  };
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
      if (this.connection) {
        this.connect();
      } else {
        nodejs.channel.send(JSON.stringify({ localPeerId: peerId }));
      }
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
    this.peer.on("call", (call) => {
      console.log("call received");
      call.answer(this.stream);
      this.call = call;
      // Receive data
      call.on("stream", (stream) => {
        call.answer(this.stream);
        // Store a global reference of the other user stream
        // window.peer_stream = stream;
        console.log("call answer", stream);
        store.dispatch(setAVStream(stream));
        // call.answer(this.stream);

        // Display the stream of the other user in the peer-camera video element !
        // onReceiveStream(stream, "peer-camera");
      });

      // Handle when the call finishes
      call.on("close", function() {
        console.log("The call is closed");
      });

      // use call.close() to finish a call
    });
  };
  endCall = () => {
    console.log("endCall");
    this?.call && this.call.close();
  };

  getPeerId = () => {
    return this.peerId;
  };
  startCall = () => {
    console.log("console media", this.stream, this.connection.peerId);

    const call = this.peer.call(this.connection.peerId, this.stream);
    this.call = call;

    // store.dispatch(setAVStream(stream));

    call.on("stream", function(stream) {
      console.log("peer is streaming", this.peerId, stream);
      store.dispatch(setAVStream(stream));
      // onReceiveStream(stream, "peer-camera");
    });
    call.on("close", function() {
      console.log("The call is closed");
    });
  };

  handleMessage = (data) => {
    console.log("receiving data from peer ", data);
  };
  connect = () => {
    this.startCall();
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
