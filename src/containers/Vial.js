import React, { Component } from "react";
import CustomOAuthButton from '../CustomOAuthButton';
import { Auth, API } from 'aws-amplify';
import Spinner from 'react-spinkit';
import "../css/Home.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default class Vial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formState: 0,
      barcode: '',
      fname: '',
      lname: '',
      dob: '',
      uid: '',
      spinner: false,
      err: "",
      vialBarcodeFinal: '',
      rejectReason: ''
    };

    this.buffer = ""
    this.st0buffer = ""

    this.stepOneSubmit = this.stepOneSubmit.bind(this);
    this.verify = this.verify.bind(this);
    this.cancel = this.cancel.bind(this);
    this.reject = this.reject.bind(this);
    this.preject = this.preject.bind(this);
    this.resetAll = this.resetAll.bind(this);
    this.rejectCancel = this.rejectCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  resetAll(){
    this.setState({
      formState: 0,
      barcode: '',
      fname: '',
      lname: '',
      dob: '',
      uid: '',
      spinner: false,
      err: "",
      vialBarcodeFinal: '',
      rejectReason: '',
      note: ''
    });
  }

  _handleKeyDown = (event) => {

    if (event.key == "Backspace") {

      if (this.state.formState == 2){
        return;
      }

      this.st0buffer = "";
      this.buffer = "";
      this.setState({ barcode: "" });
      event.preventDefault();
      return;
    }

    if (event.key == "Enter") {

      if (this.state.formState == 0) {

        if (this.st0buffer.length > 5) {
          console.log("subbmiting with " + this.st0buffer);
          this.stepOneSubmit(this.st0buffer);
          this.st0buffer = "";
          this.setState({ barcode: "" });
          event.preventDefault();
          return;
        } else {
          this.st0buffer = "";
          this.setState({ barcode: "" });
          toast.info("Unknown enter press detected, resetting...", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          event.preventDefault();
          return;
        }
      }

      if (this.state.formState == 1) {

        if (this.buffer == "submit2020") {
          this.verify();
          event.preventDefault();
          return;
        }

        if (this.buffer.startsWith("r")) {
          this.preject();
          event.preventDefault();
          return;
        }



        if (this.buffer.startsWith("x")) {
          if (this.state.formState == 1) {
            this.buffer = "";
            this.cancel();
            event.preventDefault();
            return;
          }

        }
        this.buffer = "";
        event.preventDefault();
        return;
      }

      console.log(this.state.formState);
      // if (this.state.formState == 2) {
      //   if (this.buffer.startsWith("x")) {
      //     this.buffer = "";
      //     this.rejectCancel();
      //     event.preventDefault();
      //     return;
      //   }

      //   if (this.buffer.startsWith("y")) {
      //     this.reject();
      //     event.preventDefault();
      //     return;
      //   }
      // }
    }

    if (event.key.length !== 1) {
      event.preventDefault();
      return;
    }

    console.log(event.key)

    if (this.state.formState == 0) {
      this.st0buffer += event.key;
      this.setState({ barcode: this.st0buffer });
      event.preventDefault();
      return;
    }
    // if (this.state.formState == 1) {
    //   this.buffer += event.key;
    //   this.setState({ tempCassetteBarcode: this.buffer });
    //   event.preventDefault();
    //   return;
    // }
    // if (this.state.formState == 2) {
    //   this.buffer += event.key;
    //   this.setState({ tempCassetteBarcode: this.buffer });
    //   event.preventDefault();
    //   return;
    // }

    if (this.state.formState == 2) {
      return;
    }
    event.preventDefault();
  }

  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
  }

  handleChange(event) {    this.setState({rejectReason: event.target.value});  }



  stepOneSubmit(mycode) {
    this.setState({ vialBarcodeFinal: mycode, 'spinner': true });
    Auth.currentSession().then(async session => {
      const token = session.idToken.jwtToken;
      let myInit = {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: { vialBarcode: mycode }
      }
      const result = await API.post("barcodeLookup", "/barcodeLookup", myInit);
      this.setState({ 'formState': 1, 'spinner': false });
      this.setState(result);
      this.st0buffer = "";
    }).catch(error => {
      console.log("Error in Auth.currentSession: " + error);
      this.setState({ 'spinner': false });

      toast.error("Got an error from the server, it's possible that this is an invalid barcode!", {
        position: "top-center",
        autoClose: 10000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return [];
    });
  }

  renderDormForm() {
    const submitEnabled = true;
    return (
      <div>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
          pauseOnHover
        />
        {this.state.spinner == true ? (
          <Spinner />
        ) : (
            <div>
              {this.state.formState == 0 ? (
                <div>
                  <div className="form-group">
                    <label><h3>Vial Barcode #</h3></label>
                    <div className="cursor">
                      <i></i>
                      <div
                        disabled={true}
                        id="bcode99"
                        className="formatted-input form-control"
                        value={this.state.barcode}
                      // onChange={this.handleChange}
                      >{this.state.barcode}</div>
                      
                    </div>
                  </div>
                  <button
                    type="submit"
                    value="Submit"
                    className="btn btn-lg btn-blue mb-8 mt-4"
                    onClick={() => this.stepOneSubmit(this.st0buffer)}
                  > Submit </button>
                </div>
              ) : null}

              <div>
                {this.state.formState == 1 ? (
                  <div>

                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <th scope="row" className="bg-primary">
                            <h3 style={{ color: "white" }}>NetID:</h3>
                          </th>
                          <td>
                            <h3>{this.state.uid}</h3>
                          </td>
                        </tr>
                        <tr>
                          <th scope="row" className="bg-primary">
                            <h3 style={{ color: "white" }}>Name:</h3>
                          </th>
                          <td>
                            <h3>
                              {this.state.lname}, {this.state.fname}
                            </h3>
                          </td>
                        </tr>
                        <tr>
                          <th id="altfocus" scope="row" className="bg-primary">
                            <h3 style={{ color: "white" }}>DOB:</h3>
                          </th>
                          <td>
                            <h3>
                              {this.state.dob.substring(0, 4)}/
                                {this.state.dob.substring(4, 6)}/
                                {this.state.dob.substring(6, 8)}
                            </h3>
                          </td>
                        </tr>
                        <tr>
                          <th id="altfocus" scope="row" className="bg-primary">
                            <h3 style={{ color: "white" }}>Test Type:</h3>
                          </th>
                          <td>
                            <h3>
                              {this.state.test_type}
                            </h3>
                          </td>
                        </tr>
                        <tr>
                          <th id="altfocus" scope="row" className="bg-primary">
                            <h3 style={{ color: "white" }}>Status:</h3>
                          </th>
                          <td>
                            <h3>
                              {this.state.status}
                            </h3>
                          </td>
                        </tr>
                        <tr>
                          <th id="altfocus" scope="row" className="bg-primary">
                            <h3 style={{ color: "white" }}>Time:</h3>
                          </th>
                          <td>
                            <h3>
                              {this.state.status_time}
                            </h3>
                          </td>
                        </tr>
                        <tr>
                          <th id="altfocus" scope="row" className="bg-primary">
                            <h3 style={{ color: "white" }}>Note:</h3>
                          </th>
                          <td>
                            <h3>
                              {this.state.note}
                            </h3>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div>
                      <div className="col-xs-4" >
                        <div className="dropdown" style={{ marginTop: "1.5rem !important" }}>
                          <button className="btn btn-default dropdown-toggle" style={{ marginTop: "1.5em", height: "50px" }} type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            More...
                          <span className="caret"></span>
                          </button>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                            <li><a onClick={this.cancel} href="#">Cancel</a></li>
                            <li role="separator" className="divider"></li>
                            <li role="separator" className="divider"></li>
                            <li role="separator" className="divider"></li>
                            <li role="separator" className="divider"></li>
                            <li><a onClick={this.preject} href="#">Reject</a></li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-xs-4" style={{ textAlign: "center" }}>
                      </div>
                      <div className="col-xs-4">
                        <button
                          onClick={this.verify}
                          type="button"
                          style={{ color: "white", background: "green" }}
                          className="btn btn-btn btn-lg btn-blue mb-8 mt-4"
                        >
                          Verify
                          </button>
                      </div>
                    </div>
                  </div>
                ) : null}
                {this.state.formState == 2 ? <div>
                  <h3> Confirm Reject? </h3>

                  <div className="col-xs-12">
                    <label>Reject Reason: </label>
                    <input type="text" value={this.state.rejectReason} style={{width: "100%"}} onChange={this.handleChange} />      
                  </div>


                  <div className="col-xs-2">
                  </div>
                  <div className="col-xs-4" style={{ textAlign: "center" }}>
                    <button
                      onClick={this.reject}
                      type="button"
                      className="btn btn-lg btn-red mb-8 mt-4"
                    >
                      Reject
                    </button>
                  </div>
                  <div className="col-xs-4" style={{ textAlign: "center" }}>
                    <button
                      onClick={this.rejectCancel}
                      type="button"
                      className="btn btn-lg btn-gray mb-8 mt-4"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-xs-2">
                  </div>
                </div> : null}
              </div>
            </div>
          )}
      </div>
    );
  }
  sendStatus(bool) {
    this.setState({ 'spinner': true });
    Auth.currentSession().then(async session => {
      const token = session.idToken.jwtToken;
      let myInit = {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: { vialBarcode: this.state.vialBarcodeFinal, accepted: bool, note: this.state.rejectReason == '' ? '' : this.state.rejectReason}
      }
      this.buffer = "";
      this.st0buffer = "";
      await API.post("vialScannerStatus", "/vialScannerStatus", myInit);
      this.resetAll();
      if (bool) {
        toast.success('🦄 Confirmed!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error('🤬 Rejected!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

    }).catch(e => {

      if (e.response.status === 400) {
        console.log(e.response.data); // Data contains your body

        toast.info(e.response.data.error, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.info("network error", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      this.setState({ 'spinner': false });
      return [];
    });
  }

  verify() {
    this.sendStatus(true);
  }
  preject() {
    this.buffer = "";
    this.setState({ formState: 2 })
  }
  reject() {
    this.sendStatus(false);
  }
  cancel() {
    this.resetAll();
  }
  rejectCancel() {
    this.setState({ formState: 1 })
  }

  renderLander() {
    return (
      <div className="lander">
        <h3>COVID-19 Vial Scanner, v1</h3>
        <p>Log-in with your NetID.</p>
        <CustomOAuthButton variant="primary" size="lg">LOGIN</CustomOAuthButton>
      </div>
    );
  }

  renderUnauthorized() {
    return (
      <div className="lander">
        <h3>COVID-19 Vial Scanner</h3>
        <p>Log-in with your NetID</p>
        <div className="alert alert-danger" role="alert">You do not have the appropriate permissions to use this application.</div>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {(this.props.authn === 'signedIn' && this.props.authz) && this.renderDormForm()}
        {(this.props.authn === 'signedIn' && !this.props.authz) && this.renderUnauthorized()}
        {(this.props.authn !== 'signedIn') && this.renderLander()}
      </div>
    );
  }
}
