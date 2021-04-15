import React, { Component } from 'react'
import { Button } from "baseui/button";
import {Avatar} from 'baseui/avatar'
import {
    Display2,
  } from 'baseui/typography';
import { connect } from "react-redux";
import { startSearch } from "../redux/searchRedux/searchAction";
  // import { updateConnections, updateInfo } from "../redux/dataRedux/dataAction";
import { setLocalPeer, setRemotePeer } from "../redux/streamRedux/streamAction";
import Navbar from './Navbar';
import InCall from './InCall' 
import Incoming from './Incoming';

  class Home extends Component {
    constructor(props){
      super(props)
      this.state = {
            userName : 'Anup',
            myip: '',
            search: false,
        }
    }
    componentDidMount = () => {    
      this.setState({
        myip : sessionStorage.getItem("ip"),
        userName : sessionStorage.getItem("name"),
      })
    }
    
    render() {
        return (
          <>
            <Navbar></Navbar>
            <div style={{display:'flex', flexDirection:'column',marginTop:"40px" ,alignItems:'center', justifyContent:'center'}}>
                        <Avatar
                            name={this.state.name}
                            size="320px"
                            src="https://ambitioustracks.com/wp-content/uploads/2017/01/1.-fundadores.png"
                        />
                        <Display2 marginBottom="scale500">
                        Welcome {this.state && this.state.userName}
                        </Display2>
                        <p>
                        My IP : {this.state && this.state.myip}
                        </p>
                        <Button kind="secondary" onClick={this.props.startSearch}>Search</Button>
                        {/* <InCall></InCall> */}
                        <Incoming></Incoming>
  
            </div>

          </>
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
      startSearch: () => dispatch(startSearch()),
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home);