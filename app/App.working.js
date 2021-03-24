require("node-libs-expo/globals");
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
const socketIOClient = require("socket.io-client");
const Netmask = require("netmask").Netmask;
import Home from "./screens/Home";
import "./config.js";

export default function App() {
  const [connections, setConnections] = useState({});
  const [info, setInfo] = useState({});
  const [search, setSearch] = useState(true);
  const [interval, assignInterval] = useState(-1);
  const [block, setBlock] = useState("192.168.1.0/24");
  const [ips, setIps] = useState([]);
  const [waitTime, setWaitTime] = useState(1000);

  useEffect(() => {
    const generator = new Netmask(block);
    const collector = [];
    generator.forEach((ip) => collector.push(ip));
    setIps(collector);
  }, [block]);

  useEffect(() => {
    console.log("connections found : ", Object.keys(connections).length);
    for (let ip in connections) {
      if (!info[ip])
        connections[ip].on("broadcast", (data) => {
          console.log("receiving broadcast data", data);
          setInfo({ ...info, [ip]: data });
          connections[ip].off("broadcast");
        });
    }
  }, [connections]);

  useEffect(() => {
    console.log("info found : ", Object.keys(info).length);
  }, [info]);

  const sleep = (milliseconds) => {
    let timeStart = new Date().getTime();
    while (true) {
      let elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > milliseconds) {
        break;
      }
    }
  };

  const connect = async (ip) => {
    return new Promise(async (resolve, reject) => {
      const socket = await socketIOClient(`http://${ip}:5000`);
      socket.on("connect", () => {
        console.log(socket.id, socket.connected);
        setConnections({ ...connections, [ip]: socket });
      });
      // socket.on("disconnect", () => {
      //   console.log("disconnected");
      // });
      resolve(ip);
    });
  };

  const startSearch = async () => {
    if (!ips.length) return;
    let int = setInterval(async () => {
      if (!search) {
        clearInterval(interval);
        assignInterval(-1);
        return;
      }
      if (interval == -1) assignInterval(int);
      console.log("starting searching....", ips.length);
      await Promise.all(ips.map(async (ip) => await connect(ip)))
        .then((res) => console.log(res.length))
        .catch((ips) => console.log(ips));
    }, 5000);
  };
  const startBroadcast = () => {
    //doesn't work as of now - http module gives errors in react native
    global.utils.sockets.on("connection", (client) => {
      io.emit("broadcast", {
        ip: "192.158.1.12",
        port: 5000,
        username: "Vasu Sharma",
      });
      console.log(client.id);
    });
  };
  useEffect(() => {
    if (interval !== -1) clearInterval(interval);
    startSearch();
    // startBroadcast();
  }, [ips]);
  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      {/* <View style={styles.container}>
        <StatusBar style="auto" />
      </View> */}
      <Home connections={info} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
