import React, { Component } from "react";
import CustomOAuthButton from '../CustomOAuthButton';
import { Auth, API } from 'aws-amplify';
import Spinner from 'react-spinkit';
import "../css/Home.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker, Space } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Table } from 'antd';

import { Navbar, Button } from "react-bootstrap";


const { RangePicker } = DatePicker;


function onOk(value) {
  console.log('onOk: ', value);
}

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.date1 = React.createRef();
    this.date2 = React.createRef();

    this.datestring = null;
    this.curpage = 1;

    this.state = {
      formstate: 0,
      data: []

    };
  
  this.mock_date = [
    {
        "barcode": "AN0000001",
        "timestamp": "2020-08-17 18:12:28",
        "netid": "windhamg",
        "fname": "Gary D",
        "lname": "Windham",
        "dob": "19701224"
    }
]
    
  this.columns = [
    {
      title: 'index',
      datIndex: "barcode",
      key: 'barcode',
      render: (a,b,c) => (
        <Space size="middle">
        {10 * (this.curpage - 1) + c+1}
      </Space>
      )
    },
    {
      title: 'Barcode',
      dataIndex: 'barcode',
      key: 'barcode',
    },
    {
      title: 'Last Status Update',
      dataIndex: 'last_status_update',
      key: 'last_status_update',
    },
    {
      title: 'Collection Time',
      dataIndex: 'collection_timestamp',
      key: 'collection_timestamp',
    },
    {
      title: 'NetID',
      dataIndex: 'netid',
      key: 'netid',
    },
    {
      title: 'First Name',
      dataIndex: 'fname',
      key: 'fname',
    },
    {
      title: 'Last Name',
      dataIndex: 'lname',
      key: 'lname',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dob',
      key: 'dob',
      render :(a,b,c) => (
        <Space size="middle">
          {a.substring(0,4)} / {a.substring(4,6)} / {a.substring(5,7)}
        </Space>
      )
    },
  ];

    


    this.submitDateRange = this.submitDateRange.bind(this);
    this.convertToCSV = this.convertToCSV.bind(this);
    this.goBack = this.goBack.bind(this);
    this.onChange = this.onChange.bind(this);
    this.tableChange = this.tableChange.bind(this);

  }

  onChange(value, dateString) {
    console.log('Selected Time: ', value);
  
    dateString = [dateString[0]+":00", dateString[1]+":00"]
  
    console.log('Formatted Selected Time: ', dateString);

    this.datestring = dateString;
  
  }

  submitDateRange(){

    if (this.datestring == null){
      return;
    }

    var body = {
        "startTime": this.datestring[0],
        "endTime": this.datestring[1]
    }

    Auth.currentSession().then(async session => {
      const token = session.idToken.jwtToken;
      let myInit = {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: body
      }
      const result = await API.post("pcrUnprocessedSamples", "/pcrUnprocessedSamples", myInit);
      this.setState({
        formstate: 1,
        data: result.samples
      });
      
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

  goBack(){
    this.setState({
      formstate: 0
    });
  }

  convertToCSV() {
    const arr = this.state.data;
    const array = [Object.keys(arr[0])].concat(arr)
  
    var b =  array.map(it => {
      return Object.values(it).toString()
    }).join('\n')

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(b));
    element.setAttribute('download', "exported-csv");
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);

    console.log(b);
  }
  

  

  // componentDidMount() { 
  //   this.date1.datetimepicker({
  //     inline: true,
  //     sideBySide: true
  //   });
  // }
  // componentWillUnmount() {  }

  resetAll(){
    this.setState({

    });
  }

  tableChange(pag, filt, sorter, extra){
    this.curpage = pag.current;

  }

  renderDormForm() {
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
        {this.state.formstate == 0 ? 
        <div>

          <div class="container">
              <div class="row">
                  <div class="col-sm-12 " style={{textAlign:"center", marginTop:"20vh"}}>
                    <h3> Enter Range: </h3>
                  </div>
                  <div class="col-sm-1 col-md-3 col-lg-4"></div>
                  <div class="col-sm-10 col-md-6 col-lg-4">
                    <Space direction="vertical" size={12}>
                      <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={this.onChange}
                        onOk={onOk}
                      />
                    </Space>
                  </div>
                  <div class="col-sm-12 "></div>

                  <div class="col-sm-1 col-md-3 col-lg-4"></div>
                  <div class="col-sm-10 col-md-6 col-lg-4">
                    <Button style={{marginTop:"10px"}} bsstyle="primary" onClick={this.submitDateRange}>Submit</Button>
                  </div>
                  
                  <div class="col-sm-1 col-md-3 col-lg-4"></div>
              </div>
          </div>
        </div>
        : null}

        {this.state.formstate == 1 ? 
        <div>
          <h3>Results from {this.datestring[0]} - {this.datestring[1]} found {this.state.data.length} samples</h3> 
          <Table columns={this.columns} onChange={this.tableChange} dataSource={this.state.data} />
          <Button bsstyle="primary" onClick={this.convertToCSV}>Download CSV</Button>
          <button className="btn btn-default" onClick={this.goBack}>Go Back</button>

        </div>
        : null}
        
      </div>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h3>PCR CSV</h3>
        <p>Log-in with your NetID.</p>
        <CustomOAuthButton variant="primary" size="lg">LOGIN</CustomOAuthButton>
      </div>
    );
  }

  renderUnauthorized() {
    return (
      <div className="lander">
        <h3>PCR CSV</h3>
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
