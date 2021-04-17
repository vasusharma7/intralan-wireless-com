const cors = require("cors");
const express = require("express");
require("./config");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(cors());
app.options("*", cors());

const http = require("http").Server(app);
var io = require("socket.io")(http);
const os = require("os");
const getIp = () => {
  return Object.values(os.networkInterfaces()).reduce(
    (r, list) =>
      r.concat(
        list.reduce(
          (rr, i) =>
            rr.concat((i.family === "IPv4" && !i.internal && i.address) || []),
          []
        )
      ),
    []
  )[0];
};

//io.origins('*//*:*');
io.sockets.on("connection", (client) => {
  io.emit("broadcast", {
    ip: getIp(),
    port: 5000,
    ...global?.config?.authInfo,
    peerId: global?.config?.metadata["localPeerId"],
  });
  // console.log(client.id);
});

app.get("/", (req, res) =>
  res.send("Hello I am Intra LAN WireLess Communication Application!")
);

http.listen(port, () => {
  console.log(`Broadcasting on port ${port}`);
});
const peerServer = require("peer").ExpressPeerServer(http, {
  debug: true,
});
app.use("/peerjs", peerServer);

app.post("/setLocalPeerId", (req, res) => {
  console.log("setting local Peer Id", req.body.localPeerId);
  const { localPeerId } = req.body;
  global.config.metadata["localPeerId"] = localPeerId;
  console.log(global.config.metadata["localPeerId"]);
});

app.get("/myip",(req,res) => {
  const ip = getIp()
  return res.status(200).json({ip : ip})
})

peerServer.on("error", (err) => {
  console.log("peerjs error", err);
});

peerServer.on("connection", (peer) => {
  global.config.peerConnections[peer.id] = peer;
  // console.log(global?.config?.peerConnections);
  console.log("peer connection");
});
