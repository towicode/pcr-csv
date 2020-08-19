import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import { Auth } from 'aws-amplify';

class CustomOAuthButton extends Component {
  signIn() {
    const config = Auth.configure();
    const {
        domain,
        redirectSignIn,
        redirectSignOut,
        responseType } = config.oauth;

    const clientId = config.userPoolWebClientId;
    // The url of the Cognito Hosted UI
    const url = 'https://' + domain + '/oauth2/authorize?redirect_uri=' + redirectSignIn + '&response_type=' + responseType + '&client_id=' + clientId + '&identity_provider=UAIdP';
    // Launch hosted UI
    window.location.assign(url);
  }

  render() {
    return (
      <Button variant={this.props.variant ? this.props.variant: 'primary'} size={this.props.size ? this.props.size : 'default'} onClick={this.signIn}>{this.props.children}</Button>
    )
  }
}

export default CustomOAuthButton;
