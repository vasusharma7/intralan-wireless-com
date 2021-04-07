import React, { Component } from 'react'
import { SafeAreaView, Text, Dimensions } from "react-native";
const {  height } = Dimensions.get("screen");
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { connect } from "react-redux";

class Message extends Component {
    constructor(props){
        super(props);
    }
 
    
    componentDidMount = () => {
        console.log(this.props.localPeer);
    }
    
    
    render() {
        return (
        <SafeAreaView
        style={{
            flex: 1,
            flexDirection: "column",
            paddingTop: height / 10,
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "white",
          }}>
             <Text>IntraLAN Messaging</Text>
        </SafeAreaView>
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
  )(Message);
