const cors = require("cors");
const express = require("express");
// require("./config");
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
    peerId: global.config.metadata["localPeerId"],
  });
  sessionStorage.setItem("ip",ip)
  console.log(client.id);
});

app.get("/", (req, res) =>
  res.send("Hello I am Intra LAN WireLess Communication Application!")
);

http.listen(port, () => {
  console.log(`Broadcasting on port ${port}`);
});

app.use(
  "/peerjs",
  require("peer").ExpressPeerServer(http, {
    debug: true,
  })
);
