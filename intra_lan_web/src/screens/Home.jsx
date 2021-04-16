import React, { Component } from "react";
import { Button } from "baseui/button";
import { Avatar } from "baseui/avatar";
import { Display2 } from "baseui/typography";
import { connect } from "react-redux";
import { startSearch } from "../redux/searchRedux/searchAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import Navbar from "./Navbar";
import PeerClient from "../peer";
import Incoming from "./Incoming";
import InCall from "./InCall";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import Stream from "./Stream";
import { Modal } from "baseui/modal";
import { ListItem, ListItemLabel } from "baseui/list";
import Files from "./Files";
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "Anup",
      myip: "",
      search: false,
      modalOpen: false,
    };
  }

  componentDidMount = () => {
    this.setState({
      myip: localStorage.getItem("ip"),
      userName: localStorage.getItem("name"),
    });
    // if (!this.props.localPeer) {
    console.log("component mounted...");
    const peer = new PeerClient(null, "vasu_007");
    this.props.setLocalPeer(peer);
    // }
  };
  exec = (connection, operation) => {
    const remotePeer = new PeerClient({ ...connection, operation: operation });
    this.props.setRemotePeer(remotePeer);
    this.setState({ modalOpen: false });
  };

  setScreen = () => {
    switch (this.props.connStatus) {
      case "incoming":
        return <Incoming></Incoming>;
      case "inCall":
        return <InCall></InCall>;
      case "searching":
        return <Stream />;
      case "fileSelect":
        return (
          <Files
            open={this.props.connStatus}
            remotePeer={this.props.remotePeer}
            setConnStatus={this.props.setConnStatus}
          />
        );
      default:
        return (
          <>
            <Navbar></Navbar>
            <Modal
              isOpen={this.state.modalOpen}
              onClose={() => this.setState({ modalOpen: false })}
            >
              <div
                style={{
                  backgroundColor: "rgba(1,1,1,0.7)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={() => {
                    this.exec(this.state.connection, "call");
                  }}
                >
                  <ListItem>
                    <ListItemLabel>Call</ListItemLabel>
                  </ListItem>
                </Button>

                <Button
                  onClick={() => {
                    this.exec(this.state.connection, "file");
                  }}
                >
                  <ListItem>
                    <ListItemLabel>File Transfer</ListItemLabel>
                  </ListItem>
                </Button>
                <Button
                  onClick={() => {
                    this.exec(this.state.connection, "chat");
                  }}
                >
                  <ListItem>
                    <ListItemLabel>Chat</ListItemLabel>
                  </ListItem>
                </Button>
              </div>
            </Modal>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "40px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Avatar
                name={this.state.name}
                size="320px"
                src="https://ambitioustracks.com/wp-content/uploads/2017/01/1.-fundadores.png"
              />
              <Display2 marginBottom="scale500">
                Welcome {this.state && this.state.userName}
              </Display2>
              <p>My IP : {this.state && this.state.myip}</p>
              <Button
                kind="secondary"
                onClick={() => {
                  this.props.setConnStatus("searching");
                  this.props.startSearch();
                }}
              >
                Search
              </Button>
            </div>
            <h1>Test</h1>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "40px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {this.props?.info &&
                Object.keys(this.props?.info).map((ip) => {
                  return (
                    <div>
                      <Button
                        onClick={() => {
                          this.setState(
                            { connection: this.props.info[ip] },
                            () => this.setState({ modalOpen: true })
                          );
                        }}
                      >
                        <ListItem>
                          <ListItemLabel>
                            {this.props.info[ip]["username"]} |{ip}
                          </ListItemLabel>
                        </ListItem>
                      </Button>
                    </div>
                  );
                })}
            </div>
          </>
        );
    }
  };

  render() {
    console.log(this.props.connStatus);
    return this.setScreen();
  }
}

const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
    localPeer: state.stream.localPeer,
    remotePeer: state.stream.remotePeer,
    stream: state.stream.stream,
    connStatus: state.data.connStatus,
    screenStatus: state.data.screenStatus,
    search: state.search.search,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocalPeer: (info) => dispatch(setLocalPeer(info)),
    setRemotePeer: (info) => dispatch(setRemotePeer(info)),
    startSearch: () => dispatch(startSearch()),
    setConnStatus: (status) => dispatch(setConnStatus(status)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
