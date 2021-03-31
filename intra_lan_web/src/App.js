import { Component } from 'react';
import { FaBeer } from 'react-icons/fa';
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {DarkTheme, BaseProvider, styled} from 'baseui';
import  { Route, BrowserRouter } from 'react-router-dom'

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

    }
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

export default App;
