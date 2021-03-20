const cors = require("cors");

const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.options("*", cors());
const http = require("http").Server(app);
var io = require("socket.io")(http);

//io.origins('*//*:*');
const emit = setInterval(() => {
  io.emit("broadcast", { ip: "10.1.1.1", port: 12 });
}, 10);
io.sockets.on("connection", (client) => {
  //setTimeout(() => clearInterval(emit), 1000);

  io.emit("broadcast", {
    ip: "192.158.1.12",
    port: 5000,
    username: "Vasu Sharma",
  });
  console.log(client.id);
});

app.get("/", (req, res) => res.send("Hello World!"));

http.listen(port, () => {
  console.log(`Broadcasting on port ${port}`);
});
