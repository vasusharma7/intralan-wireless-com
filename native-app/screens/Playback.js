import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Button, StyleSheet, PermissionsAndroid } from "react-native";
import { RTCView } from "react-native-webrtc";
import RNFetchBlob from "react-native-fetch-blob";
var RNFS = require("react-native-fs");
import DocumentPicker from "react-native-document-picker";
import FileViewer from "react-native-file-viewer";
import {} from "../redux/streamRedux/streamAction";
class Playback extends Component {
  constructor(props) {
    super(props);
    this.state = { currentTime: 0, play: false };
  }
  sleep = (milliseconds) => {
    let timeStart = new Date().getTime();
    while (true) {
      let elapsedTime = new Date().getTime() - timeStart;
      if (elapsedTime > milliseconds) {
        break;
      }
    }
  };
  async pick() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        readContent: true,
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      const dirLocation = `${RNFetchBlob.fs.dirs.DownloadDir}/intraLANcom`;
      const fileLocation = `${dirLocation}/${res.name}`;
      const chunksize = 65535;
      const file = await RNFS.readFile(res.uri, "base64");
      let test = [];
      for (let i = 0; i < file.length; i += chunksize) {
        // console.log(file.slice(i, i + chunksize));
        test.push(file.slice(i, i + chunksize));
        // console.log("\n");
        // sleep(2000);
      }
      test = test.join("");
      console.log("end", test.slice(-15, -1), test === file);
      // console.log(RNFS.DocumentDirectoryPath);
      // RNFetchBlob.fs.isDir(dirLocation).then(async (isDir) => {
      //   if (!isDir) {
      //     try {
      //       await RNFetchBlob.fs.mkdir(dirLocation);
      //     } catch {
      //       console.log("something went wrong in creating folder");
      //     }
      //   }
      // });
      // try {
      //   RNFetchBlob.fs.writeFile(fileLocation, file, "base64").then((rslt) => {
      //     console.log("File written successfully", rslt);
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
      // await FileViewer.open(fileLocation);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }
  requestPermissions = async () => {
    try {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]).then((granted) => {
        if (granted["android.permission.READ_EXTERNAL_STORAGE"] === "granted")
          console.log("You can read storage");
        else console.log("You cannot read storage");

        if (granted["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted")
          console.log("You can write storage");
        else console.log("You cannot write storage");
      });
    } catch (err) {
      console.warn(err);
    }
  };
  componentDidMount() {
    this.requestPermissions();
  }
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "stretch",
            justifyContent: "space-around",
          }}
        >
          <Button title="Pick" onPress={() => this.pick()} color="red" />
          <RTCView
            style={{ display: "none" }}
            streamURL={this.props.stream ? this.props.stream.toURL() : ""}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
const mapStateToProps = (state) => ({
  stream: state.stream.stream,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playback);
