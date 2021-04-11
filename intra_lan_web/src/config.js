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
const info = {}
info["ip"] = ip
global.config = {
  info: info,
  username: "Anup Nair",
};


module.exports = global.config