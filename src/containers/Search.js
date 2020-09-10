import React, { Component } from "react";
import CustomOAuthButton from '../CustomOAuthButton';
import { Auth, API } from 'aws-amplify';
import Spinner from 'react-spinkit';
import "../css/Home.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';


import {
  Form,
  Select,
} from 'antd';


var pako = require('pako');
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
      data: [],
      searchText: '',
      searchedColumn: '',
      netid: '',
      location: '',
      from: '',
      to: '',

    };

    this.getColumnSearchProps = dataIndex => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.select(), 100);
        }
      },
      render: text =>
        this.state.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
            text
          ),
    });

    this.handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      this.setState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };

    this.handleReset = clearFilters => {
      clearFilters();
      this.setState({ searchText: '' });
    };

    var None = ""

    this.columns = [
      {
        title: 'index',
        datIndex: "barcode",
        key: 'barcode',
        render: (a, b, c) => (
          <Space size="middle">
            {10 * (this.curpage - 1) + c + 1}
          </Space>
        ),
      },
      {
        title: 'facility',
        dataIndex: 'facility',
        key: 'facility',
      },
      {
        title: 'subject_netid',
        dataIndex: 'subject_netid',
        key: 'subject_netid',

        ...this.getColumnSearchProps('netid'),
      },
      {
        title: 'test_type',
        dataIndex: 'test_type',
        key: 'test_type',
      },
      {
        title: 'status',
        dataIndex: 'status',
        key: 'status',

      },
      {
        title: 'results',
        dataIndex: 'results',
        key: 'results',

      },
      {
        title: 'time',
        dataIndex: 'time',
        key: 'time',
      }
      ,
      {
        title: 'barcode_data',
        dataIndex: 'barcode_data',
        key: 'barcode_data',
        ...this.getColumnSearchProps('barcode_data'),
      }
      ,
      {
        title: 'last_status_update',
        dataIndex: 'last_status_update',
        key: 'last_status_update',
      }
      ,
      {
        title: 'notes',
        dataIndex: 'notes',
        key: 'notes',
      }
      ,
      {
        title: 'pooling',
        dataIndex: 'pooling',
        key: 'pooling',
      }
      ,
      {
        title: 'txid',
        dataIndex: 'txid',
        key: 'txid',
        ...this.getColumnSearchProps('txid'),
      }
      ,
      {
        title: 'street_address',
        dataIndex: 'street_address',
        key: 'street_address',
        ...this.getColumnSearchProps('street_address'),
      }
      ,
      {
        title: 'city',
        dataIndex: 'city',
        key: 'city',
      }
      ,
      {
        title: 'state',
        dataIndex: 'state',
        key: 'state',
      }
      ,
      {
        title: 'zip',
        dataIndex: 'zip',
        key: 'zip',
        ...this.getColumnSearchProps('zip'),
      }
      ,
      {
        title: 'county',
        dataIndex: 'county',
        key: 'county',
        ...this.getColumnSearchProps('county'),
      }
      ,
      {
        title: 'phone',
        dataIndex: 'phone',
        key: 'phone',
        ...this.getColumnSearchProps('phone'),
      }
      ,
      {
        title: 'res_type',
        dataIndex: 'res_type',
        key: 'res_type',
      }
      ,
      {
        title: 'dorm_name',
        dataIndex: 'dorm_name',
        key: 'dorm_name',
        ...this.getColumnSearchProps('dorm_name'),
      }
    ];




    this.submitDateRange = this.submitDateRange.bind(this);
    this.convertToCSV = this.convertToCSV.bind(this);
    this.goBack = this.goBack.bind(this);
    this.onChange = this.onChange.bind(this);
    this.tableChange = this.tableChange.bind(this);
    this.getColumnSearchProps = this.getColumnSearchProps.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.selectChange = this.selectChange.bind(this);
    this.netidChange = this.netidChange.bind(this);
    this.reset = this.reset.bind(this);
  }


  reset() {
    this.setState({

      formstate: 0,
      data: [],
      searchText: '',
      searchedColumn: '',
      netid: '',
      location: '',
      from: '',
      to: '',
    })
  }




  submitDateRange() {

    var body = {
    }

    if (this.state.netid != undefined && this.state.netid != '') {
      body.netid = this.state.netid;
    }
    if (this.state.from != undefined && this.state.from != '') {
      body.from = this.state.from;
    }
    if (this.state.to != undefined && this.state.to != '') {
      body.to = this.state.to;
    }
    if (this.state.location != undefined && this.state.location != '') {
      body.location = this.state.location;
    }

    Auth.currentSession().then(async session => {
      const token = session.idToken.jwtToken;
      let myInit = {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        queryStringParameters: body
      }
      const result = await API.get("starsSearch", "/starsSearch", myInit);

      // Decode base64 (convert ascii to binary)
      var strData = atob(result.data);

      // Convert binary string to character-number array
      var charData = strData.split('').map(function (x) { return x.charCodeAt(0); });

      // Turn number array into byte-array
      var binData = new Uint8Array(charData);

      // Pako magic
      var data = pako.inflate(binData);

      // Convert gunzipped byteArray back to ascii string:
      var strData = ""
      var chunks = Math.floor(data.length / 5000);


      var dataChunks = [];
      for (var i = 0; i < data.length; i += chunks)
        dataChunks.push(data.slice(i, i + chunks));




      var strData = "";

      for (var j = 0; j < dataChunks.length; j++) {
        strData += String.fromCharCode.apply(null, new Uint16Array(dataChunks[j]));
      }

      var obj = JSON.parse(strData);

      // Output to console

      this.setState({
        formstate: 1,
        data: obj
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

  goBack() {
    this.reset();
    this.setState({
      formstate: 0
    });
  }

  convertToCSV() {
    const arr = this.state.data;
    const array = [Object.keys(arr[0])].concat(arr)

    var b = array.map(it => {
      return Object.values(it).toString()
    }).join('\n')

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(b));
    element.setAttribute('download', "exported-csv");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

  }


  resetAll() {
    this.setState({

    });
  }

  tableChange(pag, filt, sorter, extra) {
    this.curpage = pag.current;
  }

  netidChange(event) {
    this.setState({ 'netid': event.target.value });

  }

  onChange(value, dateString) {
    console.log('Selected Time: ', value);

    dateString = [dateString[0] + ":00", dateString[1] + ":00"]

    console.log('Formatted Selected Time: ', dateString);

    this.datestring = dateString;

    this.setState({ 'from': dateString[0], 'to': dateString[1] })

  }

  selectChange(event) {
    this.setState({ 'location': event });
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
                <div class="col-sm-12 " style={{ marginTop: "10vh" }}>
                  <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    initialValues={{ size: "large" }}
                    size={"large"}
                  >


                    <Form.Item label="Instructions">
                      Enter <b>one or more</b> of the following, and then click search.
                    </Form.Item>

                    <Form.Item label="NetID">
                      <Input onChange={this.netidChange} />
                    </Form.Item>
                    <Form.Item label="Location">
                      <Select onChange={this.selectChange}>
                        <Select.Option value="McKale">McKale</Select.Option>
                        <Select.Option value="Phoenix">Phoenix</Select.Option>
                        <Select.Option value="Rec Center">Rec Center</Select.Option>
                        <Select.Option value="Likins">Likins</Select.Option>
                        <Select.Option value="Women and Gender Studies">Women and Gender Studies</Select.Option>
                        <Select.Option value="Arbol de la Vida">Arbol de la Vida</Select.Option>
                        <Select.Option value="CATZ">CATZ</Select.Option>
                        <Select.Option value="Flagstaff">Flagstaff</Select.Option>
                        <Select.Option value="Any">Any</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item label="Date Range">
                      <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        onChange={this.onChange}
                        onOk={onOk}
                      />
                    </Form.Item>
                    <Form.Item title="sbutton" label=" " style={{ color: "white" }}>
                      <Button onClick={this.submitDateRange}> Search</Button>
                    </Form.Item>

                  </Form>
                </div>
              </div>
            </div>
          </div>
          : null}

        {this.state.formstate == 1 ?
          <div>
            {/* <h3>Results from {this.datestring[0]} - {this.datestring[1]} found {this.state.data.length} samples</h3>  */}
            <Table pagination={{ position: ["topRight", "bottomRight"] }} columns={this.columns} onChange={this.tableChange} dataSource={this.state.data} />
            <Button bsstyle="primary" onClick={this.convertToCSV}>Download CSV</Button>
            <Button onClick={this.goBack}>Go Back</Button>

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
