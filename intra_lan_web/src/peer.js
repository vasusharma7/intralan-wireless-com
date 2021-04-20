import Peer from "peerjs";
import { store } from "./redux/store";
import { setAVStream, setLocalPeer, streamInit } from "./redux/streamRedux/streamAction";
import { setConnStatus } from "./redux/dataRedux/dataAction";
import { addMessage, chatInit } from "./redux/messageRedux/messageAction";
import "react-notifications-component/dist/theme.css";
import { store as NotifStore } from "react-notifications-component";
const axios = require("axios");

export default class PeerClient {

  constructor(connection, localPeerId) {
    console.log(connection);
    this.connection = connection;
    this.authInfo = JSON.parse(localStorage.getItem("authInfo"));
    this.localPeerId = localStorage.getItem("uid");
    this.establishConnection();
    this.fileBuffer = [];
    this.maxRetries = 5;
    this.chunksize = 64 * 1024;
    this.state = store.getState();
    this.offset = 0;
    this.getMediaSource();
    this.localPeerId = localPeerId ? this.authInfo.uid : null;
  }

  // Event Listener Handlers
  establishConnection = () => {
    if (this.connection) store.dispatch(setConnStatus("connecting"));
    this.peer = new Peer(this.connection ? null : this.localPeerId, {
      host: this.connection ? this.connection.ip : "127.0.0.1", //replace with ip
      // host: "192.168.1.6", //replace with ip
      port: 5000,
      path: "/peerjs",
      secure: false,
      debug: true,
    });
    console.log("firing listeners");
    this.fireEventListeners();
  };
  fireEventListeners = () => {
    this.peer.on("error", (err) => {
      if (this.localPeerId) this.disconnectSelf();
      if (this.maxRetries--) this.establishConnection();
      console.log("listen", err);
    });

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
        axios
          .post(`http://localhost:5000/setLocalPeerId`, {
            localPeerId: this.peerId,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });
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
              this.res = data;
              this.receiveFile();
            } else {
              this.saveFile(data, conn);
            }
          } else if (data?.operation === "chat") {
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
      this.call.on("close", function () {
        store.dispatch(setConnStatus(null));
        console.log("The call is closed");
      });
      // this.answerCall();
    });
  };
  disconnectSelf = () => {

  }

  // Get the audio media stream 
  getMediaSource = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log(stream);
      this.stream = stream;
    } catch (err) {
      console.log(err);
    }
  };
  

  // Calling related functions
  async answerCall() {
    store.dispatch(setConnStatus("inCall"));
    this.call.answer(this.stream);
    // Receive data
    this.call.on("stream", (stream) => {
      store.dispatch(setConnStatus("inCall"));
      this.call.answer(this.stream);
      console.log("call answer", stream);
      store.dispatch(setAVStream(stream));

      global.config.videoRef.current.srcObject = stream;
    });
  }
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
    this.call.on("stream", function (stream) {
      console.log("peer is streaming", this.peerId, stream);
      store.dispatch(setAVStream(stream));

      //see some workaround for this - the inCall component is rendered late and it gives undefined
      global.config.videoRef.current.srcObject = stream;
      store.dispatch(setConnStatus("inCall")); //change to picked-up status
    });
    this.call.on("close", function () {
      store.dispatch(setConnStatus(null));
      console.log("The call is closed");
    });
  };
  endCall = () => {
    this.conn.send({ operation: "call", action: "decline" });
    store.dispatch(setConnStatus(null));
    console.log("endCall");
    this?.call && this.call.close();
  };
  rejectCall = () => {
    this.conn.send({ operation: "call", action: "decline" });
    store.dispatch(setConnStatus(null));
  };

  // File Transfer functions
  async setFile(file) {
    this.file = file;
  }
  async setRes(res) {
    this.res = res;
  }
  async receiveFile() {
    console.log(this.res);
    console.log("receiving....");
    this.conn.send({ operation: "file", fileReceive: true });
    // store.dispatch(setConnStatus("fileTransfer"));
    // this.recieveFile(data);
  }
  async saveFile(res, conn) {
    console.log("saving", res.chunk);
    if (res.file === "EOF") {
      console.log(this.file);
      store.dispatch(setConnStatus(null));
      NotifStore.addNotification({
        title: "Success",
        message: `File saved successfully to ${localStorage.getItem(
          "download"
        )}`,
        type: "success",
        container: "top-center",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
          pauseOnHover: true,
        },
      });
    } else {
      // store
      //   .dispatch
      // setFileProgress(
      //   Math.round(((this.chunksize * res.chunk) / res.size) * 100)
      // )
      // ();
      // store.dispatch(setConnStatus("fileTransfer"));
      if (res.chunk === 0) {
        this.file = "";
      }
      axios
        .post("http://localhost:5000/saveFile", {
          data: res.file,
          name: this.res.name,
          chunk: res.chunk,
        })
        .then(() => {
          conn.send({ success: true, chunk: res.chunk, operation: "file" });
        })
        .catch((err) => {
          console.log(err);
          alert("Issues in saving chunk");
        });
    }
  }
  async selectFile() {
    //watchout this thing---
    this.offset = 0;
    store.dispatch(setConnStatus("fileSelect"));
    // store.dispatch(setStreamMetaData({ ...this.res, permission: true }));
    // this.conn.send({ operation: "file", ...this.res, permission: true });
    // store.dispatch(setConnStatus("fileTransfer"));
  }
  async sendFile() {
    console.log(
      "sending file",
      this.offset / this.chunksize,
      this.file.slice(this.offset, this.offset + this.chunksize)
    );
    // store.dispatch(
    //   setFileProgress(
    //     Math.round((this.offset / this.res.size).toFixed(2) * 100)
    //   )
    // );
    if (this.offset > this.res.size) {
      this.conn.send({
        ...this.res,
        file: "EOF",
        operation: "file",
      });
      store.dispatch(setConnStatus(null));
    } else {
      this.conn.send({
        ...this.res,
        file: this.file.slice(this.offset, this.offset + this.chunksize),
        operation: "file",
        chunk: this.offset / this.chunksize,
      });
      this.offset += this.chunksize;
    }
  }
  async rejectFile() {
    this.conn.send({ operation: "file", fileReceive: false });
    store.dispatch(setConnStatus(null));
  }

  getPeerId = () => {
    return this.peerId;
  };
  
  // Chat functions
  initChat = () => {
    store.dispatch(chatInit(true));
    this.conn.send({
      peerId: this.peerId,
      operation: "chat",
      message: "intralan-chat-init",
      time: new Date(),
    });
    store.dispatch(setConnStatus("chatWindow"));
  };
  frameMessage = (data) => {
    return {
      _id: new Date().getTime(),
      text: data.message,
      createdAt: data.time,
      title : data.username,
      position : 'right',
      date : new Date(),
      user: {
        _id: data.peerId,
        name: data.username,
      },
    };
  };

  frameRecievedMessage = (data) => {
    return {
      id: new Date().getTime(),
      text: data.message,
      createdAt: data.time,
      title : data.username,
      date: new Date(),
      position : 'left',
    };
  };
  sendMessage = (message) => {
    // console.log("receiving data from peer ", data);
    // console.log(this.peerId);
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
      store.dispatch(setConnStatus("chatWindow"));
      return;
    } else if (data.message === "intralan-chat-end") {
      store.dispatch(setConnStatus(null));
      // this.conn.close();
      return;
    }
    store.dispatch(
      addMessage({
        senderId: this.connection
          ? this.connection.peerId
          : this.metadata.peerId,
        ...this.frameRecievedMessage(data),
      })
    );
  };

  chatEnd = () => {
    this.conn.send({ operation: "chat", message: "intralan-chat-end" });
  };



  // Connection Handler
  connect = (type) => {
    this.conn = this.peer.connect(this.connection.peerId, {
      metadata: this.authInfo,
    });
    this.conn.serialization = "json";
    this.conn.on("error", (err) => {
      console.log("conn", err);
    });
    this.conn.on("open", () => {
      store.dispatch(setConnStatus(null));
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
      console.log("data", data);
      // if (typeof data == "string") data = JSON.parse(data);
      console.log(data);
      if (data?.operation === "chat") {
        this.recieveMessage(data);
      }
      if (data?.operation === "call") {
        if (data.action === "decline") {
          store.dispatch(setConnStatus(null));
          console.log("Call Disconnected !");
        }
      }
      if (data?.operation === "call") {
        if (data.action === "end") {
          store.dispatch(setConnStatus(null));
          console.log("Call terminated");
        }
      }
      if (data?.operation === "file") {
        if (data.success) {
          this.sendFile();
        } else if (data.fileReceive === true) {
          // store.dispatch(setStreamMetaData(this.res));
          this.sendFile();
        } else {
          //clear resources
          console.log("Peer revoked your request");
          // store.dispatch(setStreamMetaData({}));
          store.dispatch(setConnStatus(null));
        }
      }
    });
  };
}
