import React, { Component } from 'react'
import { Avatar } from "baseui/avatar";
import { Button } from 'baseui/button';
import Timer from '../components/Timer'
export default class InCall extends Component {
    render() {
        return (
            <div style = {{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", backgroundColor : "black", height: "100vh", width : "100vw"}}>
                <Avatar
                name={localStorage.getItem("name")}
                size="250px"
                src="https://api.adorable.io/avatars/285/10@adorable.io.png"
                >
                </Avatar>
                <Timer></Timer>
                <Button style = {{marginTop: 140, borderRadius: 20, backgroundColor: "red", color: "white"}}>End Call</Button>
            </div>

            
        )
    }
}
