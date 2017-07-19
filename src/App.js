import React, { Component } from 'react';
import AWS from 'aws-sdk/dist/aws-sdk-react-native'
import logo from './logo.svg';
import './App.css';
import LoginController from './LoginController';
import FavoritesSelector from './FavoritesSelector';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      identity: {},
      isLoggedIn: false
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogin(identity) {
    // Called by Login on successful authentication
    this.setState({identity: identity});
    this.setState({isLoggedIn: true});
  }

  handleLogout() {
    AWS.config.credentials.clearCachedId();
    this.setState({identity: {}});
    this.setState({isLoggedIn: false});
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Crusoe</h2>
        </div>
        <div className="App-body">
          <LoginController isLoggedIn={this.state.isLoggedIn} handleLogin={this.handleLogin} handleLogout={this.handleLogout} identity={this.state.identity}/>
          <FavoritesSelector isLoggedIn={this.state.isLoggedIn}/>
        </div>
      </div>
    );
  }
}

export default App;
