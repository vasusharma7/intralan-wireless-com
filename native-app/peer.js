const { NetworkInfo } = require("react-native-network-info");
import { mediaDevices } from "react-native-webrtc";
import { Alert } from "react-native";
require("react-native-webrtc");
import Peer from "react-native-peerjs";
import { store } from "./redux/store";
import {
  setAVStream,
  setFileProgress,
  setLocalPeer,
  setStreamMetaData,
  streamInit,
} from "./redux/streamRedux/streamAction";
import { setConnStatus } from "./redux/dataRedux/dataAction";
import nodejs from "nodejs-mobile-react-native";
import RNFetchBlob from "rn-fetch-blob";
var RNFS = require("react-native-fs");
import DocumentPicker from "react-native-document-picker";

import FileViewer from "react-native-file-viewer";

import { addMessage } from "./redux/messageRedux/messageAction";

const Sound = require("react-native-sound");
Sound.setCategory("Playback");

const whoosh = new Sound("ringtone.mp3", Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log("failed to load the sound", error);
    return;
  }
  // loaded successfully
  console.log(
    "duration in seconds: " +
      whoosh.getDuration() +
      "number of channels: " +
      whoosh.getNumberOfChannels()
  );
});
whoosh.play((success) => {
  if (success) {
    console.log("successfully finished playing");
  } else {
    console.log("playback failed due to audio decoding errors");
  }
});
whoosh.setNumberOfLoops(-1);
whoosh.setVolume(1);
whoosh.stop(() => {
  whoosh.play();
});
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
  constructor(connection, localPeerId) {
    this.connection = connection;
    this.authInfo = global.config.authInfo;
    // this.localPeerId = localPeerId ? this.authInfo.uid : null;
    this.localPeerId = this.authInfo.uid;
    this.establishConnection();
    this.fileBuffer = [];
    this.chunksize = 64 * 1024;
    this.state = store.getState();
    this.maxRetries = 5;
    this.offset = 0;
    this.res = {};
    this.getMediaSource();
    this.dirLocation = `${RNFetchBlob.fs.dirs.DownloadDir}/intraLANcom`;
    this.cacheLocation = `${RNFetchBlob.fs.dirs.CacheDir}/temp`;
  }
  establishConnection = () => {
    NetworkInfo.getIPV4Address().then((ip) => {
      this.ip = this.connection?.ip ? this.connection.ip : ip;
      if (this.connection) store.dispatch(setConnStatus("connecting"));
      this.peer = new Peer(this.connection ? null : this.localPeerId, {
        host: this.ip,
        port: 5000,
        path: "/peerjs",
        secure: false,
        debug: true,
      });
      console.log("firing listeners");
      this.fireEventListeners();
    });
  };
  disconnectSelf = () => {
    nodejs.channel.send(JSON.stringify({ clearId: this.localPeerId }));
  };
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
      store.dispatch(streamInit(false));
      if (this.maxRetries--) {
        if (this.localPeerId) this.disconnectSelf();
        this.establishConnection();
      }
      console.log("listen", err);
    });
    // this.peer.on("signal", (data) => {
    //   if (data.renegotiate || data.transceiverRequest) return;
    // });
    this.peer.on("open", async (peerId) => {
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
            this.connect("message");
            break;
          }
          default: {
            store.dispatch(setConnStatus(null));
          }
        }
      } else {
        // await AsyncStorage.setItem(
        //   "localPeer",
        //   JSON.stringify(this.state.stream.localPeer)
        // );
        nodejs.channel.send(JSON.stringify({ authInfo: this.authInfo }));
        nodejs.channel.send(JSON.stringify({ localPeerId: peerId }));
        store.dispatch(setLocalPeer(this));
      }
    });

    this.peer.on("connection", (conn) => {
      this.conn = conn;
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
            if (data.permission === true) {
              store.dispatch(setStreamMetaData(data));
              store.dispatch(setConnStatus("fileTransfer"));
            } else {
              this.saveFile(data, conn);
            }
          } else if (data?.operation === "chat") {
            this.conn = conn;
            this.recieveMessage(data);
          } else {
            console.log("Local peer sending some data.");
            conn.send("Hello, this is the LOCAL peer!");
          }
        });
      });
    });
    this.peer.on("call", async (call) => {
      this.playRingtone();
      setTimeout(() => {
        if (this.state.data.connStatus === "inComing") {
          store.dispatch(setConnStatus(null));
          this.conn.send({ operation: "call", action: "decline" });
          whoosh.stop();
        }
      }, 20000);
      store.dispatch(streamInit(false));
      this.call = call;
      console.log("call received");
      store.dispatch(setConnStatus("incoming"));
    });
  };
  playRingtone = () => {
    whoosh.play((success) => {
      if (success) {
        console.log("successfully finished playing");
      } else {
        console.log("playback failed due to audio decoding errors");
      }
    });
  };
  async answerCall() {
    whoosh.stop();
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
  async receiveFile() {
    this.conn.send({ operation: "file", fileReceive: true });
    store.dispatch(setConnStatus("fileTransfer"));
    // this.recieveFile(data);
  }
  async rejectFile() {
    this.conn.send({ operation: "file", fileReceive: false });
    this.props.setConnStatus(null);
  }
  async saveFile(res, conn) {
    if (res.file === "EOF") {
      store.dispatch(setConnStatus(null));
      Alert.alert(
        "Success",
        `File Saved Successfully to location ${this.fileLocation}`
      );
      await FileViewer.open(this.fileLocation);
    } else {
      store.dispatch(
        setFileProgress(
          Math.round(((this.chunksize * res.chunk) / res.size) * 100)
        )
      );
      if (res.chunk == 0) {
        this.res = res;
        store.dispatch(setConnStatus("fileTransfer"));
        store.dispatch(streamInit(false));
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
      conn.send({ success: true, chunk: res.chunk, operation: "file" });
    }
  }
  async selectFile() {
    this.offset = 0;
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
        store.dispatch(setConnStatus(null));
        // User cancelled the picker, exit any dialogs or menus and move on
        return;
      } else {
        throw err;
      }
    }
    store.dispatch(setStreamMetaData({ ...this.res, permission: true }));
    this.conn.send({ operation: "file", ...this.res, permission: true });
    store.dispatch(setConnStatus("fileTransfer"));
  }
  async sendFile() {
    console.log("sending file", this.offset / this.chunksize);
    store.dispatch(
      setFileProgress(
        Math.round((this.offset / this.res.size).toFixed(2) * 100)
      )
    );
    if (this.offset > this.res.size) {
      this.conn.send({
        ...this.res,
        file: "EOF",
        operation: "file",
      });
      store.dispatch(setConnStatus(null));
    } else {
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
  rejectCall = () => {
    whoosh.stop();
    store.dispatch(setConnStatus(null));
    this.conn.send({ operation: "call", action: "decline" });
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
  initChat = () => {
    this.conn.send({
      peerId: this.peerId,
      operation: "chat",
      message: "intralan-chat-init",
      time: new Date(),
    });
  };
  frameMessage = (data) => {
    return {
      _id: new Date().getTime(),
      text: data.message,
      createdAt: data.time,
      user: {
        _id: data.peerId,
        name: data.username,
      },
    };
  };
  sendMessage = (message) => {
    // console.log("receiving data from peer ", data);
    // console.log(this.peerId);
    console.log("sending", data);
    const data = {
      message: message,
      time: new Date(),
      username: this.authInfo.username,
      peerId: this.localPeerId,
    };
    store.dispatch(addMessage(this.frameMessage(data)));
    this.conn.send({
      ...data,
      operation: "chat",
    });
  };

  recieveMessage = (data) => {
    console.log("receiving", data);
    if (data.message === "intralan-chat-init") {
      store.dispatch(streamInit(false));
      return;
    }
    store.dispatch(addMessage(this.frameMessage(data)));
  };

  connect = (type) => {
    this.conn = this.peer.connect(this.connection.peerId, {
      metadata: this.authInfo,
    });
    this.conn.on("error", (err) => {
      console.log("conn", err);
    });
    this.conn.on("open", () => {
      store.dispatch(setConnStatus(null));
      store.dispatch(streamInit(true));
      console.log("Remote peer has opened connection.");
      if (type === "call") {
        this.startCall();
      } else if (type === "file") {
        this.selectFile();
      } else if (type === "message") {
        console.log("Sending message");
        this.initChat();
      }
    });
    this.conn.on("data", (data) => {
      console.log(data);
      if (data?.operation === "chat") {
        this.recieveMessage(data);
      }
      if (data?.operation === "call") {
        if (data.action === "decline") {
          store.dispatch(setConnStatus(null));
          Alert.alert("User declined your call !");
        }
      }
      if (data?.operation === "file") {
        if (data.fileReceive) {
          store.dispatch(setStreamMetaData(this.res));
          this.sendFile();
        } else {
          //clear resources
          store.dispatch(setStreamMetaData({}));
          store.dispatch(setConnStatus(null));
        }
      }
      if (data.success) {
        this.sendFile();
      }
    });
  };
}

module.exports = { PeerClient };
