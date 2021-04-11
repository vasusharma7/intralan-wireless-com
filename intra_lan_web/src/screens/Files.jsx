import React, { Component } from 'react'
import { FileUploader } from "baseui/file-uploader";
import Navbar from './Navbar'
export default class Files extends Component {
    constructor(props){
        super(props)
    }
    handleFile = (e) => {
        console.log(e)
    }
    render() {
        return (
            <>
            <Navbar></Navbar>
            <div style={{display:'flex', flexDirection:'column',marginTop:"40px" ,alignItems:'center', justifyContent:'center'}}>
                <FileUploader name="Select file to send" onDrop={this.handleFile} />
            </div>
            </>
        )
    }
}
