import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
const socketIOClient = require("socket.io-client");
const Netmask = require("netmask").Netmask;

export default function App() {
  const [connections, setConnections] = useState({});
  const [info, setInfo] = useState({});
  const [search, setSearch] = useState(true);
  const [interval, assignInterval] = useState(-1);
  const [block, setBlock] = useState(new Netmask("192.168.1.0/25"));
  const [waitTime, setWaitTime] = useState(500);
  useEffect(() => {
    console.log("connections found : ", Object.keys(connections).length);
  }, [connections]);
  useEffect(() => {
    console.log("info found : ", Object.keys(info).length);
  }, [info]);

  const startSearch = async (e) => {
    e.preventDefault();
    Alert.alert(`wait time is  ${waitTime}`);
    // let int = setTimeout(async () => {
    if (!search) {
      clearInterval(interval);
      assignInterval(-1);
      return;
    }
    // if (interval == -1) assignInterval(int);
    console.log("starting searching....");
    await new Promise((resolve, reject) => {
      block.forEach(async (ip, long, index) => {
        const socket = await socketIOClient(`http://${ip}:5000`);
        setTimeout(() => {
          console.log(socket.connected, ip);
          if (socket.connected && !Object.keys(connections).includes(ip)) {
            console.log(ip, socket.connected);
            socket.on("broadcast", (data) => {
              setConnections({ ...connections, ip: socket });
              console.log("receiving broadcast data", data);
              setInfo({ ...info, ip: data });
              socket.off("broadcast");
            });
          }
          if (ip === block.last) {
            resolve();
          }
        }, waitTime);
      });
    }).then(() => {
      console.log("search complete");
    });
    // }, 0);
  };
  useEffect(() => {});

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button onPress={startSearch} title="Search">
        SEARCH
      </Button>
    </View>
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
