import React, { Component } from 'react'
import {
    Card,
    StyledBody,
    StyledAction
  } from "baseui/card";
  import { Button } from "baseui/button";
  import {useStyletron} from 'baseui';
import {Grid, Cell} from 'baseui/layout-grid';
import {Avatar} from 'baseui/avatar'
import {
    Display1,
    Display2,
    Display3,
    Display4,
  } from 'baseui/typography';
  import { connect } from "react-redux";
  import { startSearch, initSearch } from "../redux/searchRedux/searchAction";
  import { updateConnections, updateInfo } from "../redux/dataRedux/dataAction";
  import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
  // import {Connections} from './Connections'
  
class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            userName : 'Anup',
            myip: '192.168.1.1',
            search: false,
        }
    }
    
    render() {
        return (
            <div style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                <div>
                        <Avatar
                            name="Anup Nair"
                            size="320px"
                            src="https://ambitioustracks.com/wp-content/uploads/2017/01/1.-fundadores.png"
                        />
                        <Display2 marginBottom="scale500">
                        Welcome {this.state && this.state.userName}
                        </Display2>
                        <p>
                        My IP : {this.state && this.state.myip}
                        </p>
                </div>
  
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
      connections: state.data.connections,
      info: state.data.info,
      localPeer: state.stream.localPeer,
      remotePeer: state.stream.remotePeer,
      connStatus: state.data.connStatus,
      screenStatus: state.data.screenStatus,
      search: state.search.search,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      setLocalPeer: (info) => dispatch(setLocalPeer(info)),
      setRemotePeer: (info) => dispatch(setRemotePeer(info)),
    //   setScreenStatus: (status) => dispatch(setScreenStatus(status)),
        startSearch: (info) => dispatch(startSearch(info)),
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home);