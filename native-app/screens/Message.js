import React, { Component } from 'react'
import { SafeAreaView, Text, Dimensions,TextInput, Button } from "react-native";
const {  height } = Dimensions.get("screen");
import { setConnStatus } from "../redux/dataRedux/dataAction";
import { connect } from "react-redux";

class Message extends Component {
    constructor(props){
        super(props);
        this.state = {
          message : ""  
        }
    }
 
    
    componentDidMount = () => {
        console.log(this.props.localPeer);
    }
    
    onChangeText = (e) => {
        this.setState({
          message: e
        })
    }

    sendMessage = () => {
      console.log(this.state.message)
      this.props.localPeer.sendMessage(this.state.message)
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
             <TextInput
              onChangeText={this.onChangeText}
              placeholder="Enter a message"
            />
            <Button title="Sendd" onPress = {this.sendMessage}  >
            </Button>
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
