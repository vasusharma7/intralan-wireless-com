import React, { Component } from 'react'
import { Avatar } from "baseui/avatar";
import { Button } from 'baseui/button';
import { Display2 } from 'baseui/typography';
import { connect } from "react-redux";
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { store } from '../redux/store'

class Incoming extends Component {
    constructor(props){
        super(props)
        this.state = { ...store.getState() };
        console.log(this.props)
    }
    handleReject = () => {
        this.props.localPeer.rejectCall()
    }
    handlleAccept = () => {
        this.props.setConnStatus(null);
        this.props.localPeer.answerCall();
    }

    render() {
        return (
            <div style = {{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", backgroundColor : "black", height: "100vh", width : "100vw"}}>
                <Display2 style={{marginBottom:40 }}>Incoming call</Display2>
                <Avatar
                name={localStorage.getItem("name")}
                size="250px"
                src="https://api.adorable.io/avatars/285/10@adorable.io.png"
                >
                </Avatar>
                <Button style = {{marginTop: 140, borderRadius: 20, backgroundColor: "green", color: "white"}}>Accept Call</Button>
                <Button onClick={this.handleReject} style = {{marginTop: 20, borderRadius: 20, backgroundColor: "red", color: "white"}}>Decline Call</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    remotePeer: state.stream.remotePeer,
    localPeer: state.stream.localPeer,
  });
  
  const mapDispatchToProps = (dispatch) => {
    return {
      setConnStatus: (status) => dispatch(setConnStatus(status)),
    };
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Incoming);
