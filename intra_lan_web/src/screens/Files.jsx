import React, { Component } from "react";
import { FileUploader } from "baseui/file-uploader";
import Navbar from "./Navbar";
import FileBase64 from "react-file-base64";
import { Modal } from "baseui/modal";
export default class Files extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: true };
  }
  handleFile = (e) => {
    console.log(e);
  };
  render() {
    return (
      <>
        <Modal
          isOpen={this.props.open === "fileSelect" && this.state.modalOpen}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "40px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileBase64
              onDone={(file) => {
                const data = file.base64.slice(file.base64.indexOf(",") + 1);
                const metadata = {
                  size: data.length,
                  name: file.file.name,
                  type: file.file.type,
                };
                console.log(file, data, metadata);
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
            {/* <FileUploader name="Select file to send" onDrop={this.handleFile} /> */}
          </div>
        </Modal>
      </>
    );
  }
}
