const { NetworkInfo } = require("react-native-network-info");
import { mediaDevices } from "react-native-webrtc";
import { Alert } from "react-native";
require("react-native-webrtc");
import Peer from "react-native-peerjs";
import { store } from "./redux/store";
import { setAVStream } from "./redux/streamRedux/streamAction";
import { setConnStatus } from "./redux/dataRedux/dataAction";
import nodejs from "nodejs-mobile-react-native";
import RNFetchBlob from "react-native-fetch-blob";
var RNFS = require("react-native-fs");
import DocumentPicker from "react-native-document-picker";
import { Buffer } from "buffer";
import FileViewer from "react-native-file-viewer";
const sleep = (milliseconds) => {
  let timeStart = new Date().getTime();
  while (true) {
    let elapsedTime = new Date().getTime() - timeStart;
    if (elapsedTime > milliseconds) {
      break;
    }
  }
};
class PeerClient {
  constructor(connection) {
    this.connection = connection;
    NetworkInfo.getIPV4Address().then((ip) => {
      this.ip = connection?.ip ? connection.ip : ip;
      if (this.connection) store.dispatch(setConnStatus("connecting"));
      this.peer = new Peer(null, {
        host: this.ip,
        port: 5000,
        path: "/peerjs",
        secure: false,
        debug: true,
      });
      this.fileBuffer = [];
      this.chunksize = 32 * 1024;
      this.state = store.getState();
      this.offset = 0;
      console.log("firing listeners");
      this.fireEventListeners();
      this.getMediaSource();
      this.dirLocation = `${RNFetchBlob.fs.dirs.DownloadDir}/intraLANcom`;
      this.cacheLocation = `${RNFetchBlob.fs.dirs.CacheDir}/temp`;
    });
  }
  getMediaSource = () => {
    mediaDevices.enumerateDevices().then((sourceInfos) => {
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
        switch (this.connection.operation) {
          case "call": {
            store.dispatch(setConnStatus(null));
            this.connect("call");
            break;
          }
          case "file": {
            //add one more state - maybe change previous one to searching and this one to connecting !!
            this.connect("file");
            break;
          }
          case "message": {
            this.connect("message")
            break;
          }
          default: {
            store.dispatch(setConnStatus(null));
          }
        }
      } else {
        nodejs.channel.send(JSON.stringify({ localPeerId: peerId }));
      }
    });

    this.peer.on("connection", (conn) => {
      this.metadata = conn.metadata;
      console.log("Local peer has received connection.");
      conn.on("error", (err) => {
        console.log("peer", err);
      });
      conn.on("open", () => {
        console.log("data on open");
        console.log("Local peer has opened connection.", this.peerId);
        this.fileBuffer = [];
        conn.on("data", (data) => {
          if (data?.operation === "file") {
            this.saveFile(data, conn);
          } else {
            console.log("Local peer sending some data.");
            conn.send("Hello, this is the LOCAL peer!");
          }
        });
      });
    });
    this.peer.on("call", async (call) => {
      this.call = call;
      console.log("call received");
      store.dispatch(setConnStatus("incoming"));
    });
  };
  async answerCall() {
    store.dispatch(setConnStatus("inCall"));
    this.call.answer(this.stream);
    // Receive data
    this.call.on("stream", (stream) => {
      store.dispatch(setConnStatus("inCall"));
      this.call.answer(this.stream);
      console.log("call answer", stream);
      store.dispatch(setAVStream(stream));
    });
    this.call.on("close", function() {
      store.dispatch(setConnStatus(null));
      console.log("The call is closed");
    });
  }

  async saveFile(res, conn) {
    if (res.file === "EOF") {
      Alert.alert(
        "Success",
        `File Saved Successfully to location ${this.fileLocation}`
      );
      await FileViewer.open(this.fileLocation);
    } else {
      if (res.chunk == 0) {
        RNFetchBlob.fs.isDir(this.dirLocation).then(async (isDir) => {
          if (!isDir) {
            try {
              await RNFetchBlob.fs.mkdir(dirLocation);
            } catch {
              Alert.alert(
                "Oops !",
                "Could not create App Directory in Downloads folder"
              );
              console.log("something went wrong in creating folder");
            }
          }
        });
        this.fileLocation = `${this.dirLocation}/${res.name}`;
        await RNFetchBlob.fs
          .writeFile(this.fileLocation, "", "utf8")
          .then(() => {});
      }
      await RNFetchBlob.fs
        .appendFile(this.fileLocation, res.file, "base64")
        .then((resp) => {
          console.log("chunk arrived", res.chunk, resp);
        })
        .catch(console.error);
      conn.send({ success: true, chunk: res.chunk });
    }
  }
  async sendFile() {
    if (this.offset === 0)
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
          readContent: true,
        });
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size
        );
        this.res = res;
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }
    console.log("sending file", this.offset / this.chunksize);
    if (this.offset > this.res.size)
      this.conn.send({
        ...this.res,
        file: "EOF",
        operation: "file",
      });
    else {
      await RNFetchBlob.fs
        .writeFile(this.cacheLocation, "", "utf8")
        .then(async () => {
          await RNFetchBlob.fs
            .slice(
              this.res.uri,
              this.cacheLocation,
              this.offset,
              this.offset + this.chunksize
            )
            .then(async (resp) => {
              const file = await RNFS.readFile(this.cacheLocation, "base64");
              console.log(resp);
              this.conn.send({
                ...this.res,
                file: file,
                operation: "file",
                chunk: this.offset / this.chunksize,
              });
              this.offset += this.chunksize;
            });
        });
    }
  }

  endCall = () => {
    store.dispatch(setConnStatus(null));
    console.log("endCall");
    this?.call && this.call.close();
  };

  getPeerId = () => {
    return this.peerId;
  };
  startCall = () => {
    console.log("console media", this.stream, this.connection.peerId);

    this.call = this.peer.call(this.connection.peerId, this.stream);
    store.dispatch(setConnStatus("ringing"));
    setTimeout(() => {
      if (this.state.data.connStatus === "ringing") {
        store.dispatch(setConnStatus(null));
        Alert.alert("User declined your call or went offline :(");
      }
    }, 20000);

    // store.dispatch(setAVStream(stream));

    this.call.on("stream", function(stream) {
      console.log("peer is streaming", this.peerId, stream);
      store.dispatch(setAVStream(stream));
      store.dispatch(setConnStatus("inCall")); //change to picked-up status
      // onReceiveStream(stream, "peer-camera");
    });
    this.call.on("close", function() {
      store.dispatch(setConnStatus(null));
      console.log("The call is closed");
    });
  };

  sendMessage = (data) => {
    console.log("receiving data from peer ", data);
    console.log(this.peerId)
    // this.conn.send({
    //   message: data
    // })
  };

  recieveMessage = () => {
    this.conn.on("message", (data) => {
      console.log(data)
      // Dispatch data to redux and update state
    })
  }
  connect = (type) => {
    const conn = this.peer.connect(this.connection.peerId, {
      metadata: {
        username: global.config.username,
      },
    });
    this.conn = conn;
    conn.on("error", (err) => {
      console.log("conn", err);
    });
    conn.on("open", () => {
      store.dispatch(setConnStatus(null));
      console.log("Remote peer has opened connection.");
      if (type === "call") {
        this.startCall();
      } else if (type === "file") {
        this.sendFile();
      }
      else if (type === "message"){
        console.log('Sending message')
        this.sendMessage();
      }
    });
    conn.on("data", (data) => {
      console.log(data);
      if (data.success) {
        this.sendFile();
      }
    });
  };
}

module.exports = { PeerClient };
