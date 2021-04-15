import { Component } from "react";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import { DarkTheme, BaseProvider, styled } from "baseui";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import { initSearch } from "./redux/searchRedux/searchAction";
import { updateConnections, updateInfo } from "./redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "./redux/streamRedux/streamAction";
import { connect } from "react-redux";
import "./App.css";
import Home from "./screens/Home";
import Landing from "./screens/Landing";
import Login from "./screens/Login";
import Files from "./screens/Files";
import "./config";
import PeerClient from "./peer.js";

const engine = new Styletron();
const Centered = styled("div", {
  height: "100%",
  width: "100%",
});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: {},
      info: {},
      search: false,
    };
  }

  componentDidMount = async () => {
    // startBroadcast()
    if (!this.props.localPeer) {
      console.log("component mounted...");
      const peer = new PeerClient(null, "vasu_007");
      // const peer = new PeerClient(null, "vasu_007");
      this.props.setLocalPeer(peer);
    }
    console.log(global.config);
    this.props.initSearch("192.168.1.0/24");
  };

  render() {
    return (
      <StyletronProvider value={engine}>
        {sessionStorage.getItem("loggedIn") === true && (
          <Redirect
            to={{ pathname: "/home", state: sessionStorage.getItem("peerID") }}
          />
        )}
        <BaseProvider theme={DarkTheme}>
          <Centered>
            <BrowserRouter>
              <Switch>
                <Route exact path="/home" render={() => <Home />}></Route>
                <Route exact path="/" render={() => <Landing />}></Route>
                <Route exact path="/login" render={() => <Login />}></Route>
                <Route exact path="/files" render={() => <Files />}></Route>
              </Switch>
            </BrowserRouter>
          </Centered>
        </BaseProvider>
      </StyletronProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    connections: state.data.connections,
    info: state.data.info,
    search: state.search.search,
    connStatus: state.data.connStatus,
    localPeer: state.stream.localPeer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnections: (connections) =>
      dispatch(updateConnections(connections)),
    updateInfo: (info) => dispatch(updateInfo(info)),
    initSearch: (block) => dispatch(initSearch(block)),
    setLocalPeer: (peer) => dispatch(setLocalPeer(peer)),
    setRemotePeer: (peer) => dispatch(setRemotePeer(peer)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
