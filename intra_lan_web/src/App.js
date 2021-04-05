import { Component } from 'react';
import { FaBeer } from 'react-icons/fa';
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {DarkTheme, BaseProvider, styled} from 'baseui';
import  { Route, BrowserRouter } from 'react-router-dom'
import { startSearch, initSearch } from "./redux/searchRedux/searchAction";
import { updateConnections, updateInfo } from "./redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "./redux/streamRedux/streamAction";
import { connect } from "react-redux";

import './App.css';
import Home from './screens/Home';
import Navbar from './screens/Navbar';

const engine = new Styletron();
const Centered = styled('div', {
  height: '100%',
  width : '100%'
});
const Netmask = require("netmask").Netmask;
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      connections: {},
      info : {},
      search: false,
    }
  }

  componentDidMount = () => {
    this.props.initSearch("192.168.1.0/24");
  }

  render(){
  return  (
    <StyletronProvider value={engine}>
    <BaseProvider theme={DarkTheme}>
      <Centered>
    <BrowserRouter>
    <div className="App">
    <Navbar></Navbar>

    <Home/>
    </div>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConnections: (connections) => dispatch(updateConnections(connections)),
    updateInfo: (info) => dispatch(updateInfo(info)),
    initSearch: (block) => dispatch(initSearch(block)),
    setLocalPeer: (peer) => dispatch(setLocalPeer(peer)),
    setRemotePeer: (peer) => dispatch(setRemotePeer(peer)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

