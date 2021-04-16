import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Button,
  StyleSheet,
  PermissionsAndroid,
  Image,
  Dimensions,
} from "react-native";
import { RTCView } from "react-native-webrtc";
import RNFetchBlob from "rn-fetch-blob";
import DocumentPicker from "react-native-document-picker";
import FileViewer from "react-native-file-viewer";
import RNFS from "react-native-fs";
import {} from "../redux/streamRedux/streamAction";
const { width, height } = Dimensions.get("screen");

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
      const cacheLocation = `${RNFetchBlob.fs.dirs.CacheDir}/temp`;
      const fileLocation = `${dirLocation}/${res.name}`;
      const chunksize = 16 * 1024;
      // let file = await RNFS.readFile(res.uri, "base64");
      // while (file.length) {
      //   let chunk = Buffer.from(file.slice(0, 64 * 1024));
      //   file = file.slice(64 * 1024, file.length);
      //   console.log(chunk);
      //   console.log(
      //     "----------------------------------------------------------------------"
      //   );
      // }

      // console.log(Buffer.from(file.slice(0, 16 * 1024)));

      let test = [];
      await RNFetchBlob.fs.writeFile(fileLocation, "", "utf8").then(() => {});
      for (let i = 0; i < res.size; i += chunksize) {
        // console.log(file.slice(i, i + chunksize));
        // test.push(file.slice(i, i + chunksize));
        console.log("bytes written from", i);
        await RNFetchBlob.fs
          .writeFile(cacheLocation, "", "utf8")
          .then(async () => {
            await RNFetchBlob.fs
              .slice(res.uri, cacheLocation, i, i + chunksize)
              .then(async (res) => {
                console.log(res);
                await RNFetchBlob.fs
                  .appendFile(fileLocation, cacheLocation, "uri")
                  .then((res) => {
                    console.log(res);
                  })
                  .catch(console.error);
              });
          });
        // RNFetchBlob.fs
        //   .appendFile(fileLocation, file.slice(i, i + chunksize), "base64")
        //   .then((rest) => {
        //     console.log("chunk written", rest);
        //   })
        //   .catch((err) => console.log(err));
        // console.log("\n");
        // sleep(2000);
      }

      // test = test.join("");
      // let blob = await this.base64ToBlob(file);
      // console.log("btoB64 resp === ", blob);

      // console.log("end", buffer, test === file);
      // console.log(RNFS.DocumentDirectoryPath);
      RNFetchBlob.fs.isDir(dirLocation).then(async (isDir) => {
        if (!isDir) {
          try {
            await RNFetchBlob.fs.mkdir(dirLocation);
          } catch {
            console.log("something went wrong in creating folder");
          }
        }
      });
      // await RNFetchBlob.fs
      //   .writeFile(fileLocation, "", "utf8")
      //   .then(async () => {
      //     await RNFetchBlob.fs
      //       .writeStream(fileLocation, "base64", true)
      //       .then((stream) =>
      //         Promise.all(test.map((chunk) => stream.write(chunk)))
      //       )
      //       .catch(console.error);
      //   });
      // try {
      //   RNFetchBlob.fs.writeFile(fileLocation, file, "base64").then((rslt) => {
      //     console.log("File written successfully", rslt);
      //   });
      // } catch (err) {
      //   console.log(err);
      // }
      await FileViewer.open(fileLocation);
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
    // this.requestPermissions();
  }
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require("../assets/file.png")}
          style={{
            width: Math.max(300, 0.3 * width),
            height: height / 3,
            marginBottom: 20,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "stretch",
            justifyContent: "space-around",
          }}
        >
          <Button title="Pick" onPress={() => this.pick()} color="#17A3B2" />
          {/* <RTCView
            style={{ display: "none" }}
            streamURL={this.props.stream ? this.props.stream.toURL() : ""}
          />  */}
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
