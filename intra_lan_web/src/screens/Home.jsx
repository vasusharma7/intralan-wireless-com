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

export default class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            userName : 'Anup',
            myip: '192.168.1.1'
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
                        <Button kind="secondary">Start Search</Button>
                </div>
  
            </div>
        )
    }
}
