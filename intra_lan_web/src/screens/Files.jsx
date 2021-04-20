import React, { Component } from "react";
import FileBase64 from "react-file-base64";
import { Modal } from "baseui/modal";
export default class Files extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: true };
  }
  decodeFromBase64(input) {
    input = input.replace(/\s/g, "");
    return atob(input);
  }

  render() {
    return (
      <>
        <Modal
          isOpen={
            (this.props.open === "fileSelect" ||
              this.props.open === "fileSave") &&
            this.state.modalOpen
          }
          onClose={() => this.props.setConnStatus(null)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              width: "30vw",
              backgroundColor: "#333",
            }}
          >
            {this.props.open === "fileSelect" ? (
              <FileBase64
                onDone={(file) => {
                  const data = file.base64.slice(file.base64.indexOf(",") + 1);
                  console.log(file.base64);
                  const metadata = {
                    size: data.length,
                    name: file.file.name,
                    type: file.file.type,
                  };
                  // console.log(file, data, metadata);
                  this.props.remotePeer.setFile(data);
                  this.props.remotePeer.setRes(metadata);
                  this.props.remotePeer.conn.send({
                    operation: "file",
                    ...metadata,
                    permission: true,
                  });
                  this.setState({ modalOpen: false });
                  this.props.setConnStatus(null);
                }}
              />
            ) : (
              <>
                {/* <Base64Downloader
                  base64={this.props.localPeer.file}
                  downloadName={this.props.localPeer.res.name}
                >
                  Click to download
                </Base64Downloader> */}
                <a
                  download={this.props.localPeer.res.name}
                  href={this.props.localPeer.file}
                >
                  Download
                </a>
              </>
            )}
          </div>
        </Modal>
      </>
    );
  }
}
