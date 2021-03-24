import "./shim.js";
const cors = require("cors");
const express = require("express");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.options("*", cors());
const http = require("http").Server(app);

global.utils = {
  io: require("socket.io")(http),
};

app.get("/", (req, res) => res.send("Hello World!"));

http.listen(port, () => {
  console.log(`Broadcasting on port ${port}`);
});
