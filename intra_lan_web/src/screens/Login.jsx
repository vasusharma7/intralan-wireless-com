import React, { Component } from 'react'
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Display3} from 'baseui/typography';
import { Button } from 'baseui/button';
import { Redirect } from 'react-router-dom';

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            logIn : false,
            register: false,
            name : "",
            email : "",
            phno : ""
        }
    }
    handleName = (e) => {
        this.setState({
            name : e.target.value
        })
    }
    handleEmail = (e) => {
        this.setState({
            email : e.target.value
        })
    }
    handlePhone = (e) => {
        this.setState({
            phno : e.target.value
        })
    }
    
    handleReg = () => {
        console.log(this.state)
        sessionStorage.setItem("name", this.state.name)
        sessionStorage.setItem("email", this.state.email)
        sessionStorage.setItem("phone", this.state.phno)
        sessionStorage.setItem("uid", Date.now())
    }
    handleLogin = () => {
        console.log(this.state)
        if(sessionStorage.getItem("email") === this.state.email && sessionStorage.getItem("phone") == this.state.phno){
            console.log("Logged in")
            this.setState({
                logIn : true
            })
            
        }
        else{
            console.log("Invalid")
        }
    }  
    render() {
        return (
            <div style={{background:"#4385F5" ,height:"100vh", display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
                {this.state && this.state.logIn && <Redirect
                    push
                      to={{ pathname: '/home' }}
                    />}
                <div>
                    <Display3>Register</Display3>
                <FormControl label="Name">
                        <Input onChange={this.handleName}></Input>
                </FormControl>
                <FormControl label="Email">
                        <Input onChange={this.handleEmail}></Input>
                </FormControl>
                <FormControl label="Phone number">
                        <Input onChange={this.handlePhone}></Input>
                </FormControl>
                <Button onClick = {this.handleReg}>Register Now</Button>
                </div>
                <div>
                <Display3>Login</Display3>
                <FormControl label="Email">
                        <Input onChange={this.handleEmail}></Input>
                </FormControl>
                <FormControl label="Phone number">
                        <Input onChange={this.handlePhone}></Input>
                </FormControl>
                <Button onClick = {this.handleLogin}>Login Now</Button>
                </div>
            </div>
        )
    }
}
