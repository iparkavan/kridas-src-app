import { Grid, createStyles, withStyles, InputBase } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Axios from "axios";
import Box from '@mui/material/Box';
import ManageClientsTab from './ManageClientsTab';
import ManageUsersTab from './ManageUsersTab';
import CustomSelect from './common/CustomSelect';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import customStyles from './CustomStyle';
import { ToastContainer } from 'react-toastify';
import { ToastError, ToastSuccess } from '../service/toast/Toast';
import SessionTimeOut from './common/SessionTimeOut';
import { Prompt } from 'react-router-dom';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const BootstrapInput = withStyles((theme) =>
    createStyles({
        root: {
            "label + &": {
                marginTop: theme.spacing(3),
            },
        },
        input: {},
    })
)(InputBase);

const CLEAN_UP_DASHBOARD = [
    { value: '2', label: 'Every 2 days' },
    { value: '3', label: 'Every 3 days' },
    { value: '4', label: 'Every 4 days' },
    { value: '5', label: 'Every 5 days' },
    { value: '6', label: 'Every 6 days' },
    { value: '7', label: 'Every 7 days' }
];

const CLEAN_UP_SUMMARY = [
    { value: '5', label: 'Every 5 days' },
    { value: '10', label: 'Every 10 days' },
    { value: '15', label: 'Every 15 days' },
    { value: '20', label: 'Every 20 days' },
    { value: '30', label: 'Every 30 days' }
];


const ManageClients = (props) => {

    React.useEffect(()=>{
        console.log("Fetch mode" + retrieveFlow);
        fetchAdminConfig();
    }, [])


    let domain_name = localStorage && JSON.parse(localStorage.getItem("attributes")).find(x => x.name === 'email').value;
    const defaultFormData = {
        domainName: domain_name && domain_name.substring(domain_name.lastIndexOf("@") + 1),
        dashboardCleanupDays: '20',
        summaryCleanupDays: '7'
    }

    const defaultTableData = [
        {
            users_id: '',
            userId: '',
            firstName: '',
            lastName: '',
            clients: [],
            email: '',
            operation: 'c'
        }
    ]

    const defaultClientTableData = [
        {
            clientName: '',
            clientDescription: '',
            operation: 'c'
        }
      ]

    const [formData, setFormData] = React.useState(defaultFormData);
    const [domainError, setDomainError] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [isLoading, setLoading] = React.useState(false);
    const [existingUserData, setExistingUserData] = React.useState([]);
    const [existingClientData, setExistingClientData] = React.useState([]);
    const [userListData, setUserListData] = React.useState(defaultTableData);
    const [clientListData, setClientListData] = React.useState(defaultClientTableData);
    const [clientAddButtonClicked, setClientAddButtonClicked] = React.useState(false);
    const [userAddButtonClicked, setUserAddButtonCLicked] = React.useState(false);
    const [saveButtonClicked, setSaveButtonClicked] = React.useState(false);
    const retrieveFlow = props.flow;
    const location = window.location.pathname;
    const classes = customStyles();

    const setFormDatafromChild = (data) => {
        setFormData(data);
    }


    function clientNameExists(clientName) {
        return existingClientData.some(function(element) {
          return element.clientName === clientName;
        }); 
      }

    const onChangeForm = (keyName, keyValue) => {
        let temp_value = keyValue
        if(keyName === 'domainName' && temp_value){
            temp_value = temp_value.trim();
        }
        setFormData({
            ...formData,
            ...{ [keyName]: temp_value }
        })
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onClickContinue = () => {
        setSaveButtonClicked(true);
        if(clientAddButtonClicked && (existingClientData.length !== clientListData.length) && onClickClientUpdateValidation(clientListData[0])){
            return;
        }
        if(userAddButtonClicked && !onClickUpdateValidation(userListData[0])){
            return;
        }
        saveAdminConfig();
    }

    React.useEffect(()=>{
        if(value === 1){
            saveAdminConfig();
        }
    }, [value]);

    const fetchAdminConfig = async () => {
        if (retrieveFlow !== undefined && retrieveFlow === "fetch" && sessionStorage.role === 'Admin') {
            let config = {
                method: "get",
                url: process.env.REACT_APP_BEATS_FETCH_ADMIN_CONFIG_DETAILS,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                },
            };
            setLoading(true);
            let response = await Axios(config);
            setLoading(false);
            console.log("response" + response);
            let newFormData = {};
            let userList = [];
            let userObj;
            let clientList = [];
            let clientObj;
            let domainArray = []
            if (response.status === 200 && response.data !== undefined) {
                newFormData.dashboardCleanupDays = response.data.dashboardCleanupFrequency;
                newFormData.summaryCleanupDays = response.data.summaryStatusCleanup;
                newFormData.adminConfigId = response.data.adminConfigId;
                response.data.users.forEach((user) => {
                    userObj = {};
                    userObj.users_id = user.users_id;
                    userObj.userId = user.userId;
                    userObj.firstName = user.firstName;
                    userObj.lastName = user.lastName;
                    userObj.email = user.email;
                    userObj.clients = user.clients;
                    // userObj.operation = 'c';
                    userList.push(userObj);
                    let domainName = user.email.substring(user.email.lastIndexOf("@") + 1);
                    domainName && domainArray.push(domainName)
                });
                
                
                response.data.clients.forEach((client) => {
                    clientObj = {};
                    clientObj.client_id = client.clientId;
                    clientObj.clientName = client.clientName;
                    clientObj.clientDescription = client.clientDescription;
                    // clientObj.operation = 'c';
                    clientList.push(clientObj);
                });
                for(let i=0;i<userList.length;i++){
                    let clientValues = [];
                    for(let j=0;j<userList[i].clients.length;j++){
                        for(let k=0;k<clientList.length;k++){
                            if(userList[i].clients[j] === clientList[k].client_id){
                                clientValues.push(clientList[k].clientName);
                            }
                        }
                    }
                    userList[i].clients = clientValues;
                }
                let uniqueDomainList = domainArray.filter((c, index) => {
                    return domainArray.indexOf(c) === index;
                });
                newFormData.domainName = uniqueDomainList?.length > 0 ? uniqueDomainList.toString() : formData.domainName;
                setUserListData(userList.length > 0 ? userList : defaultTableData);
                setClientListData(clientList.length > 0 ? clientList : defaultClientTableData);
                setFormDatafromChild(newFormData);
                setExistingUserData(userList);
                setExistingClientData(clientList);
            }
            setLoading(false);
        }
    }

    const onClickClientUpdateValidation = (array) => {
        const { clientName, clientDescription } = {...array};
        if(clientNameExists(clientName)){
            ToastError('Client Name already exists');
            return true;
        }
        if ( clientName.trim() === '') {
            ToastError('Client Name Cannot Be Empty');
            return true;
        }else if (clientDescription.trim() === '') {
            ToastError('Client Description Cannot Be Empty');
            return true;
        }
    }

    const onClickUpdateValidation = (array) => {
        const { firstName, lastName, email } = { ...array };
        let user_domain = email.substring(email.lastIndexOf("@") + 1);
        let regexDomain = /^\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let domainName = formData.domainName.split(',');
        const inValidDomainArray = ['gmail.com', 'yahoo.com', 'hotmail.com', 'icloud.com', 'outlook.com'];
        let isDomainInvalid = false;
        domainName.forEach(item => {
            if(inValidDomainArray.includes(item)){
                isDomainInvalid = true;
            }
        })
        if(isDomainInvalid){
            ToastError('Please provide email domain associated with company account');
            setDomainError(true);
            return;
        }
        let findDomain = '';
        let findInvalidValidDomain = domainName.find((item) => !regexDomain.test(item));
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let admin_email = JSON.parse(localStorage.getItem("attributes")).find(x => x.name === 'email').value;

        domainName.find((item) => {
            if (item === user_domain) {
                findDomain = item;
            }
        })

        if (!formData.domainName || findInvalidValidDomain) {
            ToastError('Domain is not valid');
            setDomainError(true);
            return;
        }
        if (firstName.trim() === '') {
            ToastError('First name is not valid');
            return false;
        } else if (lastName.trim() === '') {
            ToastError('Last name is not valid');
            return false;
        } else if (!regex.test(email) || !findDomain) {
            ToastError('Enter email associated with company domain(s)');
            return false;
        } else if (admin_email === email) {
            ToastError('user email should not be the same as admin user email');
            return false;
        } else {
            return true;
        }
    }

    const saveAdminConfig = async () => {
        setClientAddButtonClicked(false);
        setUserAddButtonCLicked(false);
        let newUserList = [];
        let newUserPayload = []
        let newClientList = [];
        let newClientPayload = [];
        let url = process.env.REACT_APP_BEATS_UPDATE_ADMIN_CONFIG_DETAILS;
        if (userListData && userListData.length === 1 && userListData[0].firstName === '') {
            newUserList = [];
        } else {
            newUserList = [...userListData];
            newUserList.forEach((item) => {
                let clientIds = [];
                let temp_item = {...item}
                item.clients.map((client) => {
                    for(let i=0;i<clientListData.length;i++){
                        if(clientListData[i].clientName === client){
                            clientIds.push(clientListData[i].client_id);
                        }
                    }
                })
                temp_item.clients = clientIds;
                if (!temp_item.Username) {
                    temp_item.Username = temp_item.userid || temp_item.email;
                }
                if (existingUserData.length > 0) {
                    newUserPayload.push(temp_item)
                } else {
                    newUserPayload.push({
                        "firstName": temp_item.firstName,
                        "lastName": temp_item.lastName,
                        "email": temp_item.email,
                        "clients": clientIds,
                        "operation": 'c'
                    })
                }
                clientIds = [];
            })
        }
        if (clientListData && clientListData.length === 1 && clientListData[0].clientName === '') {
            newClientList = [];
        } else {
            newClientList = [...clientListData];
            newClientList.forEach((item) => {
                if (existingClientData.length > 0) {
                    newClientPayload.push(item);
                } else {
                    newClientPayload.push({
                        "client_id": Math.random(),
                        "clientName": item.clientName,
                        "clientDescription": item.clientDescription,
                        "operation": 'c'
                    })
                }
            })
        }
        let payload = {
            "companyDomain": formData.domainName,
            "dashboardCleanupFrequency": parseInt(formData.dashboardCleanupDays),
            "summaryStatusCleanup": parseInt(formData.summaryCleanupDays),
            "users": newUserPayload,
            "adminConfigId": formData.adminConfigId,
            "clients":newClientPayload
        }
        try {
            let config = {
                method: "post",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                },
                data: payload
            };
            setLoading(true);
            let responseData = await Axios(config);
            if (responseData.status === 200) {
                if(value === 0){
                    ToastSuccess('Updated successfully');
                }
                fetchAdminConfig();
                if (location !== '/MyDetails') {
                    props.history.push('/Dashboard');
                }
            }
            setLoading(false);
            // fetchAdminConfig();
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

  return (
    <>
    <Prompt when={(clientAddButtonClicked || userAddButtonClicked) && !saveButtonClicked} 
    message={(location, action) => {
        if (action === 'PUSH') {
          console.log("Backing up...")
        }
    
        return location.pathname.startsWith("/MyDeatils")
          ? true
          : `Please click the save button to not lose any data, Do you still wish to leave?`
      }}
    />
    <SessionTimeOut />
    <Grid container spacing={3} className='admin-config'>
    <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
    </Backdrop>
    <ToastContainer />
        <Grid item xs={12} sm={12} md={12} className="pd0">
            <p className="txt-left btitle linkprim">New user configuration</p>
        </Grid>
        <Grid container spacing={3} className="mr0 txt-left">
            <Grid item xs={6} sm={6} md={3} className="pd0" style={{ paddingRight: '0' }}>
                <p className="txt-left mt12">Enter your company domain</p>
            </Grid>
            <Grid item xs={6} sm={6} md={5} className={`pd0 txt-left ${domainError && !formData.domainName ? 'requird' : ''}`}>
                <BootstrapInput
                    className='primary-input mb20 width100p'
                    value={formData.domainName}
                    onChange={(e) => onChangeForm('domainName', e.target.value)}
                />
                <p>(For example) oracle.com, nordstrom.com, </p>
            </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} className="pd0">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
                    <Tabs value={value} 
                    onChange={handleChange} 
                    variant='fullWidth'>
                    <Tab label="Manage Clients" {...a11yProps(0)} />
                    <Tab label="Manage Users" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ManageClientsTab
                     data={formData}
                     clientListData={clientListData}
                     setClientAddButtonClicked={setClientAddButtonClicked}
                     userListData={userListData}
                     setClientListData={setClientListData}
                     defaultClientTableData={defaultClientTableData}
                     onClickClientUpdateValidation={onClickClientUpdateValidation}/>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ManageUsersTab 
                    data={formData}
                    userListData={userListData}
                    setUserAddButtonCLicked={setUserAddButtonCLicked}
                    setUserListData={setUserListData}
                    clientListData={clientListData}
                    defaultTableData={defaultTableData}
                    onClickUpdateValidation={onClickUpdateValidation}/>
                </TabPanel>
            </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} className="pd0">
            <p className="txt-left btitle linkprim">Dashboard Cleanup Frequency</p>
        </Grid>
        <Grid container spacing={3} className="mr0 txt-left">
            <Grid item xs={6} sm={6} md={8} className="pd0" style={{ paddingRight: '0' }}>
                <p className="txt-left mt12">How frequently would you like to cleanup your search dashboard? (based on the upload date all transactions including processed and failed transactions will be removed from the dashboard)</p>
            </Grid>
            <Grid item xs={6} sm={6} md={2} className='pd0 txt-left'>
                <CustomSelect
                    onChange={onChangeForm}
                    defaultValue={{ value: formData.dashboardCleanupDays, label: `Every ${formData.dashboardCleanupDays} days` }}
                    type='dashboardCleanupDays'
                    options={CLEAN_UP_DASHBOARD}
                />
            </Grid>
        </Grid>
        <Grid container spacing={3} className="mr0 txt-left">
            <Grid item xs={6} sm={6} md={8} className="pd0" style={{ paddingRight: '0' }}>
                <p className="txt-left mt12">How frequently would you like to cleanup summary status dashboard? (based on the processed date all summary status will be removed from the dashboard)</p>
            </Grid>
            <Grid item xs={6} sm={6} md={2} className='pd0 txt-left'>
                <CustomSelect
                    onChange={onChangeForm}
                    defaultValue={{ value: formData.summaryCleanupDays, label: `Every ${formData.summaryCleanupDays} days` }}
                    type='summaryCleanupDays'
                    options={CLEAN_UP_SUMMARY}
                />
            </Grid>
        </Grid>
        <Grid container className="pb30 pt30" style={{ textAlign: 'center' }}>
            <Grid item xs={12} sm={12} md={12}>
                <button className="btn-primary" onClick={onClickContinue}>{location === '/MyDetails' ? 'Save' : 'Continue'}</button>
            </Grid>
        </Grid>
    </Grid>
    </>

  )
}

export default ManageClients