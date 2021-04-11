const cors = require("cors");
const express = require("express");
require("./config");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.options("*", cors());
const http = require("http").Server(app);
var io = require("socket.io")(http);
const config = require('./config')
global.config = config
const ip = Object.values(require("os").networkInterfaces()).reduce(
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
//io.origins('*//*:*');
io.sockets.on("connection", (client) => {
  io.emit("broadcast", {
    ip: ip,
    port: 5000,
    username: "Anup Nair",
    peerId: "vasu_007",
  });
  // sessionStorage.setItem("ip",ip)
  console.log(client.id);
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

peerServer.on("error", (err) => {
  console.log("peerjs error", err);
});

peerServer.on("connection", (peer) => {
  console.log(peer.id)
  // global.config.peerConnections[peer.id] = peer;
  // console.log(global.config.peerConnections);
  console.log("peer connection");
});

