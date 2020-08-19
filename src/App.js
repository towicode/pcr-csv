import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
// import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import CustomOAuthButton from './CustomOAuthButton';
import Amplify, {Auth, Hub, API} from 'aws-amplify';
import config from "./config";
import {authz} from "./authorization";
import Routes from "./Routes";
import t3logo from './images/t3logo.png';

const oauth = {
  domain: config.cognito.DOMAIN,
  scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
  redirectSignIn: config.cognito.REDIRECT_SIGNIN,
  redirectSignOut: config.cognito.REDIRECT_SIGNOUT,
  responseType: 'code' // or token
};

Amplify.configure({
  Auth: {
    oauth: oauth,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "barcodeLookup",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: "pcrUnprocessedSamples",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: "authzVialScanner",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: "vialScannerStatus",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
});
// Auth.configure({
//   oauth: oauth,
//   region: config.cognito.REGION,
//   userPoolId: config.cognito.USER_POOL_ID,
//   userPoolWebClientId: config.cognito.APP_CLIENT_ID
// });

class App extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    this.refreshAuthNZ = this.refreshAuthNZ.bind(this);
    this.state = {
      authn: 'loading',
      authz: false
    };
    // let the Hub module listen on Auth events
    Hub.listen('auth', (data) => {
      const { payload } = data;
      this.onAuthEvent(payload);
    });
  }

  componentDidMount() {
//    console.log('on component mount');
    // check the current user when the App component is loaded
    Auth.currentAuthenticatedUser().then(user => {
      authz().then(res => {
        this.refreshAuthNZ({
          data: {
            authn: 'signedIn',
            authz: res
          }
        });
       // console.log('signed in as: ' + JSON.stringify(user));
      });
    }).catch(e => {
      this.refreshAuthNZ({
        data: {
          authn: 'signIn',
          authz: false
        }
      });
//      console.log('not signed in: ' + e.response);
    });
  }

  onAuthEvent(payload) {
    // The Auth module will emit events when user signs in, signs out, etc
    switch (payload.event) {
      case 'signIn':
        authz()
        .then(res => {
          this.refreshAuthNZ({
            data: {
              authn: 'signedIn',
              authz: res
            }
          });
        });
        break;
      case 'signIn_failure':
        this.refreshAuthNZ({
          data: {
            authn: 'signIn',
            authz: false
          }
        });
        //          console.log('not signed in');
        //          console.log("!!!! state = " + JSON.stringify(this.state));
        break;
      default:
        break;
    }
  }

  signOut() {
    this.refreshAuthNZ({
      data: {
        authn: 'signIn',
        authz: false
      }
    });
    Auth.signOut({ global: true });
  }

  // refresh user state
  refreshAuthNZ(res) {
    console.log(res);
    this.setState({authn: res.data.authn});
    this.setState({authz: res.data.authz});
  }

  render() {
    const { authn } = this.state;
    return (
      authn !== 'loading' &&
      <div className="App container">
        <Navbar>
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-xs-6 col-sm-4 my-2">
                <a href="https://www.arizona.edu/test-trace-treat" title="Test All Test Smart | Home" target="_blank" className="remove-external-link-icon"><img src={t3logo} style={{maxWidth: '200px'}} alt="Test Trace Treat | Home"/></a>
              </div>
              <div className="col-md-1 col-md-offset-7 col-sm-1 col-sm-offset-6 col-xs-offset-2 col-xs-1">
                {authn === 'signIn' && <CustomOAuthButton>Login</CustomOAuthButton>}
                {authn === 'signedIn' && <Button bsstyle="primary" onClick={this.signOut}>Logout</Button>}
              </div>
            </div>
          </div>
        </Navbar>
        <Routes childProps={{authn: this.state.authn, authz: this.state.authz}} />
      </div>
    );
  }
}

export default App;
