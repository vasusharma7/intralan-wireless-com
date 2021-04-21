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
import Flog from './screens/Flog'
import Clog from './screens/Clog'
import Mlog from './screens/Mlog'


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
    console.log(global.config);
    this.props.initSearch("192.168.1.0/24");
  };

  render() {
    return (
      <StyletronProvider value={engine}>
        {localStorage.getItem("loggedIn") === true && (
          <Redirect
            to={{ pathname: "/home", state: localStorage.getItem("peerId") }}
          />
        )}
        <BaseProvider theme={DarkTheme}>
          <video
            style={{
              borderWidth: 1,
              display: "none",
              borderColor: "black",
              height: 100,
              width: 100,
            }}
            controls
            ref={global.config.videoRef}
            autoPlay
          ></video>
          <Centered>
            <BrowserRouter>
              <Switch>
                <Route exact path="/home" render={() => <Home />}></Route>
                <Route exact path="/" render={() => <Landing />}></Route>
                <Route exact path="/login" render={() => <Login />}></Route>
                <Route exact path="/files" render={() => <Files />}></Route>
                <Route exact path="/flog" render={() => <Flog />}></Route>
                <Route exact path="/mlog" render={() => <Mlog />}></Route>
                <Route exact path="/clog" render={() => <Clog />}></Route>
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
