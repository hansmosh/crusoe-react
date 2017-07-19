import React, { Component } from 'react';
import AWS from 'aws-sdk/dist/aws-sdk-react-native'
import GoogleLogin from 'react-google-login';

class LoginController extends Component {

  constructor(props) {
    super(props);
    this.googleSignIn = this.googleSignIn.bind(this);
  }

  awsRefresh() {
    // This clear cache only exists to handle situations where you switch users without having properly logged out
    AWS.config.credentials.clearCachedId();
    return new Promise(function (resolve, reject) {
      AWS.config.credentials.refresh(function(err) {
        if (err) { reject(err); }
        else { resolve(AWS.config.credentials.identityId); }
      });
    });
  }

  googleSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:9ae5ac17-aac4-4ef3-9967-c254eddb8e0a",
        Logins: {
          'accounts.google.com': id_token
        }
      })
    });
    this.awsRefresh().then(identityId => {
      this.props.handleLogin({
        id: identityId,
        email: googleUser.getBasicProfile().getEmail()
      })
    })
    .catch(error => {
      // TODO: need to log out user. If switching users without clearing Local Storage in the browser, you can't even log in as a different user.
      console.log("Failed to refresh AWS credentials with Google user");
      console.log(error);
    })
  }

  googleSignInFailure(error) {
    console.log("Failed to authenticate with Google");
    console.log(error);
  }

  render() {
    let button = null;
    if (this.props.isLoggedIn) {
      button = <button onClick={this.props.handleLogout}>Log Out</button>;
    } else {
      button = <GoogleLogin
        clientId="348539732529-cgdpd7b35tnmf5nbha97s2qrlo2lnvtc.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={this.googleSignIn}
        onFailure={this.googleSignInFailure}
      />
    }
    return (
      <div className="LoginController">
        {button}
        {this.props.identity.email}
     </div>
    );
  }
}

export default LoginController;
