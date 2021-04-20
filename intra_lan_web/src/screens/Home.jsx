import React, { Component } from "react";
import { Button } from "baseui/button";
import { Avatar } from "baseui/avatar";
import { Display4, Display2, H5 } from "baseui/typography";
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
import { FiPhoneCall, FiFilePlus, FiMessageSquare } from "react-icons/fi";
import axios from "axios";
import Ringing from "./Ringing";
import "react-notifications-component/dist/theme.css";
import ReactNotification from "react-notifications-component";
import Message from "./Message";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "Anup",
      myip: "",
      search: false,
      modalOpen: false,
      connection: "",
      download: "",
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
    axios({
      method: "GET",
      url: "http://localhost:5000/myip",
    })
      .then((res) => {
        localStorage.setItem("myip", res.data.ip);
      })
      .catch((e) => {
        console.log(e);
      });
    axios({
      method: "GET",
      url: "http://localhost:5000/downloads",
    })
      .then((res) => {
        localStorage.setItem("download", res.data.download);
      })
      .catch((e) => {
        console.log(e);
      });
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
      case "ringing":
        return <Ringing></Ringing>;
      case "fileSelect":
      case "chatWindow":
        return <Message></Message>;
      case "fileSave":
        return (
          <Files
            open={this.props.connStatus}
            remotePeer={this.props.remotePeer}
            localPeer={this.props.localPeer}
            setConnStatus={this.props.setConnStatus}
          />
        );
      default:
        return (
          <>
            <ReactNotification></ReactNotification>
            <Navbar></Navbar>
            <Modal
              isOpen={this.state.modalOpen}
              onClose={() => this.setState({ modalOpen: false })}
            >
              <div
                style={{
                  backgroundColor: "rgba(1,1,1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: "70vh",
                  width: "30vw",
                  borderRadius: "20px",
                }}
              >
                <H5>Contact Panel</H5>
                <Display4>{this.state.connection.username}</Display4>
                <Display4>{this.state.connection.ip}</Display4>

                <Button
                  onClick={() => {
                    this.exec(this.state.connection, "call");
                  }}
                  kind="secondary"
                  style={{ width: "20vw" }}
                >
                  <ListItemLabel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FiPhoneCall
                        size="30"
                        style={{ marginRight: "20" }}
                        color="green"
                      ></FiPhoneCall>
                      <p>Call</p>
                    </div>
                  </ListItemLabel>
                </Button>

                <Button
                  onClick={() => {
                    this.exec(this.state.connection, "file");
                  }}
                  kind="secondary"
                  style={{ width: "20vw" }}
                >
                  <ListItemLabel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FiFilePlus
                        size="30"
                        color="yellow"
                        style={{ marginRight: "20" }}
                      ></FiFilePlus>
                      <p>File Transfer</p>
                    </div>
                  </ListItemLabel>
                </Button>
                <Button
                  onClick={() => {
                    this.exec(this.state.connection, "chatWindow");
                  }}
                  kind="secondary"
                  style={{ width: "20vw" }}
                >
                  <ListItemLabel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FiMessageSquare
                        size="30"
                        color="blue"
                        style={{ marginRight: "20" }}
                      ></FiMessageSquare>
                      <p>Chat</p>
                    </div>
                  </ListItemLabel>
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
              <p>My IP : {localStorage.getItem("myip")}</p>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "40px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <H5 color="black">Dialing List</H5>
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
                        style={{
                          width: "50vw",
                          borderRadius: "20px",
                        }}
                      >
                        <ListItem>
                          <ListItemLabel>
                            <H5>
                              {this.props.info[ip]["username"]} | {ip}
                            </H5>
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
