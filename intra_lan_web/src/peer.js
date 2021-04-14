// const { NetworkInfo } = require("react-native-network-info");
// import { mediaDevices } from "react-native-webrtc";
// require("react-native-webrtc");
import Peer from "peerjs";
import { store } from "./redux/store";
import { setAVStream, setLocalPeer } from "./redux/streamRedux/streamAction";
import { setConnStatus } from "./redux/dataRedux/dataAction";
// import nodejs from "nodejs-mobile-react-native";
// import RNFetchBlob from "rn-fetch-blob";
// var RNFS = require("react-native-fs");
// import DocumentPicker from "react-native-document-picker";
// import { Buffer } from "buffer";
// import FileViewer from "react-native-file-viewer";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { addMessage, chatInit } from "./redux/messageRedux/messageAction";
const axios = require("axios");
export default class PeerClient {
  constructor(connection, localPeerId) {
    this.connection = connection;
    this.authInfo = JSON.parse(localStorage.getItem("authInfo"));
    // this.localPeerId = localPeerId ? this.authInfo.uid : null;
    this.localPeerId = this.authInfo.uid;
    this.establishConnection();
    this.fileBuffer = [];
    this.chunksize = 32 * 1024;
    this.state = store.getState();
    this.offset = 0;
    this.getMediaSource();
    // this.dirLocation = `${RNFetchBlob.fs.dirs.DownloadDir}/intraLANcom`;
    // this.cacheLocation = `${RNFetchBlob.fs.dirs.CacheDir}/temp`;
  }
  establishConnection = () => {
    //gey my ip
    // this.ip = this.connection?.ip ? this.connection.ip : ip;
    if (this.connection) store.dispatch(setConnStatus("connecting"));
    this.peer = new Peer(this.localPeerId, {
      host: "127.0.0.1", //replace with ip
      port: 5000,
      path: "/peerjs",
      secure: false,
      debug: true,
    });
    console.log("firing listeners");
    this.fireEventListeners();
  };
  disconnectSelf = () => {
    // nodejs.channel.send(JSON.stringify({ clearId: this.localPeerId }));
  };
  getMediaSource = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log(stream);
      this.stream = stream;
    } catch (err) {
      console.log(err);
    }
  };

  fireEventListeners = () => {
    this.peer.on("error", (err) => {
      if (this.localPeerId) this.disconnectSelf();
      this.establishConnection();
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
        // nodejs.channel.send(JSON.stringify({ authInfo: this.authInfo }));
        // nodejs.channel.send(JSON.stringify({ localPeerId: peerId }));
        axios
          .post(`http://localhost:5000/setLocalPeerId`, {
            localPeerId: this.peerId,
          })
          .then((res) => {})
          .catch(() => {});
        store.dispatch(setLocalPeer(this));
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
      this.call = call;
      console.log("call received");
      store.dispatch(setConnStatus("incoming"));
      this.answerCall();
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
    this.call.on("close", function () {
      store.dispatch(setConnStatus(null));
      console.log("The call is closed");
    });
  }

  // async saveFile(res, conn) {
  //   if (res.file === "EOF") {
  //     alert(
  //       "Success",
  //       `File Saved Successfully to location ${this.fileLocation}`
  //     );
  //     await FileViewer.open(this.fileLocation);
  //   } else {
  //     if (res.chunk == 0) {
  //       RNFetchBlob.fs.isDir(this.dirLocation).then(async (isDir) => {
  //         if (!isDir) {
  //           try {
  //             await RNFetchBlob.fs.mkdir(dirLocation);
  //           } catch {
  //             alert(
  //               "Oops !",
  //               "Could not create App Directory in Downloads folder"
  //             );
  //             console.log("something went wrong in creating folder");
  //           }
  //         }
  //       });
  //       this.fileLocation = `${this.dirLocation}/${res.name}`;
  //       await RNFetchBlob.fs
  //         .writeFile(this.fileLocation, "", "utf8")
  //         .then(() => {});
  //     }
  //     await RNFetchBlob.fs
  //       .appendFile(this.fileLocation, res.file, "base64")
  //       .then((resp) => {
  //         console.log("chunk arrived", res.chunk, resp);
  //       })
  //       .catch(console.error);
  //     conn.send({ success: true, chunk: res.chunk, operation: "file" });
  //   }
  // }
  // async sendFile() {
  //   if (this.offset === 0)
  //     try {
  //       const res = await DocumentPicker.pick({
  //         type: [DocumentPicker.types.allFiles],
  //         readContent: true,
  //       });
  //       console.log(
  //         res.uri,
  //         res.type, // mime type
  //         res.name,
  //         res.size
  //       );
  //       this.res = res;
  //     } catch (err) {
  //       if (DocumentPicker.isCancel(err)) {
  //         // User cancelled the picker, exit any dialogs or menus and move on
  //       } else {
  //         throw err;
  //       }
  //     }
  //   console.log("sending file", this.offset / this.chunksize);
  //   if (this.offset > this.res.size)
  //     this.conn.send({
  //       ...this.res,
  //       file: "EOF",
  //       operation: "file",
  //     });
  //   else {
  //     await RNFetchBlob.fs
  //       .writeFile(this.cacheLocation, "", "utf8")
  //       .then(async () => {
  //         await RNFetchBlob.fs
  //           .slice(
  //             this.res.uri,
  //             this.cacheLocation,
  //             this.offset,
  //             this.offset + this.chunksize
  //           )
  //           .then(async (resp) => {
  //             const file = await RNFS.readFile(this.cacheLocation, "base64");
  //             console.log(resp);
  //             this.conn.send({
  //               ...this.res,
  //               file: file,
  //               operation: "file",
  //               chunk: this.offset / this.chunksize,
  //             });
  //             this.offset += this.chunksize;
  //           });
  //       });
  //   }
  // }

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
        alert("User declined your call or went offline :(");
      }
    }, 20000);

    // store.dispatch(setAVStream(stream));

    this.call.on("stream", function (stream) {
      console.log("peer is streaming", this.peerId, stream);
      store.dispatch(setAVStream(stream));
      store.dispatch(setConnStatus("inCall")); //change to picked-up status
      // onReceiveStream(stream, "peer-camera");
    });
    this.call.on("close", function () {
      store.dispatch(setConnStatus(null));
      console.log("The call is closed");
    });
  };
  initChat = () => {
    store.dispatch(chatInit(true));
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
      store.dispatch(chatInit(false));
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
      console.log("Remote peer has opened connection.");
      if (type === "call") {
        this.startCall();
      } else if (type === "file") {
        this.sendFile();
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
      if (data.success) {
        this.sendFile();
      }
    });
  };
}
