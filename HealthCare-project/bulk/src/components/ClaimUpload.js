import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@mui/material';
import { Backdrop, Button, CircularProgress, Drawer, FormControlLabel, FormLabel, Grid, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from '@material-ui/core';
import clsx from 'clsx';
import logodb from '../img/Beats-health-logo.png';
import LeftsideMenu from './LeftsideMenu';
import PublishIcon from '@mui/icons-material/Publish';
import { ToastError, ToastSuccess } from '../service/toast/Toast';
import Axios from 'axios';
import FileSaver from 'file-saver';
import excelIcon from "../img/Microsoft_Excel_2013_logo.svg.png";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import { relationshipMenuItems, helathbenefitplanItems } from '../components/constants/claimUploadDataConstants'
import moment from 'moment'
import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import SessionTimeOut from './common/SessionTimeOut';


function ClaimUpload() {
    const defaultFormData = {
        firstName: '',
        relationship: 'Relationship to Subscriber (Self)',
        NPInumber: '',
        middleName: '',
        lastName: '',
        healthBenefit: 30,
        payer: '',
        patientAccountNumber: '',
        birthDate: new Date(Date.now()),
        endDate: new Date(Date.now()),
        startDate: new Date(Date.now()),
        subscriberID: '',
        uploadBatchFile: 'uploadBatchFile',
        clientID: ''
    }
    const [formData, setFormData] = React.useState(defaultFormData);
    const classes = useStyles();
    const [open] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [isButtonClicked, setIsButtonClicked] = React.useState(false);
    const [uploadedFileName, setUploadedFileName] = React.useState('');
    const [widgetName, setWidgetName] = React.useState('');
    const [payerDataList, setPayerDataList] = React.useState([])
    const [serviceTypeDataList, setServiceTypeDataList] = React.useState([])
    const history = useHistory();
    const unique_id = uuid();

    const formChange = (keyName, keyValue) => {
        setFormData({
            ...formData,
            ...{ [keyName]: keyValue }
        })
    }

    useEffect(() => {
        getServiceType();
        getPayerData();
    }, [])

    const getServiceType = async () => {
        await Axios({
            method: 'GET',
            url: process.env.REACT_APP_BEATS_LIST_SERVICE_TYPE_API,
            headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + sessionStorage.getItem("idToken")
            },
        }).then(response => {
            if (response.data) {
                let temp_data = response.data
                temp_data.sort((a, b) => a.service_name.toLowerCase() > b.service_name.toLowerCase() ? 1 : -1);
                setServiceTypeDataList(temp_data)
            } else {
                setServiceTypeDataList([])
            }
        })
    }

    const getPayerData = async () => {
        await Axios({
            method: 'POST',
            url: process.env.REACT_APP_BEATS_GET_PAYER_TYPE_API,
            data: {
                recordType: 'claims'
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + sessionStorage.getItem("idToken")
            },
        }).then(response => {
            if (response.data) {
                let temp_data = response.data
                temp_data.sort((a, b) => a.external_payer_name.toLowerCase() > b.external_payer_name.toLowerCase() ? 1 : -1);
                setPayerDataList(temp_data)
            } else {
                setPayerDataList([])
            }
        })
    }

    const uploadFile = async (fileToUpload, type) => {
        if (!fileToUpload) {
            console.log('Please select a file to upload');
            return;
        }
        console.log("fileToUpload.type " + fileToUpload.type);

        if (!fileToUpload.type.includes('application/vnd.openxml') && !fileToUpload.type.includes('application/vnd.ms-excel')) {
            ToastError('Please upload only xlsx/ xls file');
            return;
        }
        let timeStamp = Math.round(+new Date() / 1000);
        let userId = JSON.parse(sessionStorage.getItem("attributes"))[2].value;
        let fileName = timeStamp + '_' + fileToUpload.name;
        let s3MappingPath = 'bulk-claims-upload';
        let path = s3MappingPath + "/" + userId + "/" + fileName;
        setLoading(true);
        await Axios({
            method: 'POST',
            url: process.env.REACT_APP_BEATS_FETCH_PRESIGNED_URL_FOR_UPLOAD,
            data: {
                key: path,
                type: type
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + sessionStorage.getItem("idToken")
            },
        }).then(response => {
            console.log("URL " + response);
            Axios({
                method: "PUT",
                url: response.data,
                data: fileToUpload,
                headers: { "Content-Type": "multipart/form-data" }
            }).then(() => {
                // ToastSuccess("File Upload Successfully");
                setUploadedFileName(fileName);
                setLoading(false);
            });
        }).catch(() => {
            ToastError("Error Occured while uploading the file");
            setLoading(false);
        })
    }
    const downLoadTemplate = async () => {
        let fileName = 'upload-template.xlsx';
        let path = 'bulk-claims-upload/template/upload-template.xlsx';
        setLoading(true);
        await Axios({
            method: 'POST',
            url: process.env.REACT_APP_BEATS_FETCH_PRESIGNED_URL_FOR_DOWNLOAD,
            data: {
                key: path
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + sessionStorage.getItem("idToken")
            },
        }).then(response => {
            Axios({
                method: "GET",
                url: response.data,
                responseType: 'arraybuffer'
            }).then((response) => {
                var blob = new Blob([response.data]);
                FileSaver.saveAs(blob, fileName);
                ToastSuccess("File downloaded successfully");
                setLoading(false);
            }).catch((error) => {
                ToastError("No file to download");
                setLoading(false);
            });
        }).catch(() => {
            ToastError("Error Occured while downloading the file");
            setLoading(false);
        })
    }
    const completeVerification = async () => {
        if (formData.uploadBatchFile === 'uploadBatchFile') {
            if (!uploadedFileName) {
                ToastError("Please select a file to upload");
                return;
            }
            if (!widgetName || (widgetName && widgetName.trim() === '')) {
                ToastError("Please select a widget name");
                return;
            }
            let userId = JSON.parse(sessionStorage.getItem("attributes"))[2].value;
            let payload = {
                "email": userId,
                "file_path": `bulk-claims-upload/${userId}/${uploadedFileName}`,
                "file_name": uploadedFileName,
                "widget_name": widgetName,
                "file_type": 'claims'
            }
            setLoading(true);
            try {
                let config = {
                    method: "post",
                    url: process.env.REACT_APP_BEATS_BULK_UPLOAD_QUEUE_NOTIFICATION,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                    },
                    data: payload
                };
                let responseData = await Axios(config);
                console.log(" responseData ", responseData)
                if (responseData.status === 200) {
                    ToastSuccess("Validation in Progress");
                    setUploadedFileName('');
                    setWidgetName('');
                    history.push("/summary");
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.log(err);
                ToastError("Error Occured while uploading the file");
                setLoading(false);
            }
        } else {
            setIsButtonClicked(true);
            const { firstName, relationship, NPInumber, middleName, lastName, healthBenefit, payer, birthDate,
                endDate, startDate, subscriberID, patientAccountNumber, clientID } = { ...formData }
            let regex = new RegExp(/^[0-9\b]+$/);
            let isError = false;
            if (!firstName || firstName.trim() === '') {
                ToastError("First Name is required");
                isError = true
            }
            if (!lastName || lastName.trim() === '') {
                ToastError("Last Name is required");
                isError = true
            }
            if (!NPInumber || NPInumber.length !== 10 || !regex.test(NPInumber)) {
                ToastError("Please enter a valid NPI number");
                isError = true
            }
            if (!birthDate) {
                ToastError("Birth date is required");
                isError = true
            }
            if (!startDate) {
                ToastError("Start date is required");
                isError = true
            }
            if (!endDate) {
                ToastError("End date is required");
                isError = true
            }
            if (Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) > 90) {
                ToastError('Number of days between From and To Date of Service should be less than 90 days');
                isError = true;
            }
            if (!payer) {
                ToastError("Payer is required");
                isError = true
            }
            if (!subscriberID || subscriberID.trim() === '') {
                ToastError("Subscriber ID is required");
                isError = true
            }
            if (!checkDate(startDate, endDate)) {
                ToastError("End date should be greater than or equal to start date");
                isError = true
            }
            if (!clientID || clientID.trim() === '') {
                ToastError("Client ID is required");
                isError = true
            }
            if (!isError) {
                setLoading(true);
                let payLoad = {
                    "patientFirstName": firstName.trim(),
                    "patientMiddleName": middleName.trim(),
                    "patientLastName": lastName.trim(),
                    "patientBirthDate": moment(birthDate).format('YYYY-MM-DD'),
                    "fromDateOfService": moment(startDate).format('YYYY-MM-DD'),
                    "toDateOfService": moment(endDate).format('YYYY-MM-DD'),
                    "mrnPatientAccountNo": patientAccountNumber,
                    "patientUniqueId": unique_id,
                    "payerId": payer,
                    "serviceType": healthBenefit,
                    "recordType": 'claims',
                    "memberId": subscriberID,
                    "providerNpi": NPInumber,
                    "clientID": clientID,
                    "relationship": relationship
                }
                try {
                    let config = {
                        method: "post",
                        url: process.env.REACT_APP_BEATS_SAVE_CLAIM_DATA,
                        headers: {
                            "Content-Type": "application/json",
                            "Access-Control-Allow-Origin": "*",
                            Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                        },
                        data: payLoad
                    };
                    let responseData = await Axios(config);
                    console.log(" responseData ", responseData)
                    if (responseData.status === 200) {
                        ToastSuccess("File uploaded successfully");
                        setUploadedFileName('');
                        setWidgetName('');
                        history.push("/SearchClaim");
                    }
                    setLoading(false);
                } catch (err) {
                    console.log(err);
                    ToastError("Error Occured while uploading the file");
                    setLoading(false);
                }
            }
        }
    }
    const handleDobChange = (date) => {
        formChange('birthDate', date);
    }
    const handlestartDateChange = (date) => {
        formChange('startDate', date);
    }
    const handleEndDateChange = (date) => {
        formChange('endDate', date);
    }
    function checkDate(start, end) {
        var mStart = moment(start);
        var mEnd = moment(end);
        if (mStart.isBefore(mEnd) || mStart.isSame(mEnd)) {
            return true;
        } else {
            return false;
        }
    }

    const onClickCancel = () => {
        history.push('/Dashboard');
    }
    return (
        <div className={classes.root}>
            <CssBaseline />
            <SessionTimeOut />
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer />
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <img src={logodb} className="dblogo" alt="Beats Logo" />
                </div>
                <LeftsideMenu />
            </Drawer>
            <div>
                <b><h5>Claim Verification</h5></b>



                <RadioGroup value={formData.uploadBatchFile} onChange={(e) => formChange('uploadBatchFile', e.target.value)} style={{ marginTop: '10px', marginLeft: '20px' }}>
                    <FormControlLabel value='claimEligibilityRealtime' control={<Radio />} label='Claim Eligibility Realtime' />
                    <Paper className={classes.paper} style={{ marginTop: '10px', marginLeft: '30px' }} elevation={6}>
                        <div>
                            <FormLabel style={{ color: '#C72C35' }}>Patient Details</FormLabel>
                            <div style={{ display: 'flex' }}>
                                <TextField disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                    onChange={(e) => formChange('firstName', e.target.value)} variant='outlined'
                                    label='First Name' className={classes.txtField} value={formData.firstName}
                                    error={isButtonClicked && (!formData.firstName || formData.firstName.trim() === '') ? true : false} />
                                <TextField disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                    onChange={(e) => formChange('middleName', e.target.value)} variant='outlined'
                                    label='Middle Name(Optional)' className={classes.txtField}
                                    value={formData.middleName} />
                                <TextField disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                    onChange={(e) => formChange('lastName', e.target.value)} variant='outlined'
                                    label='Last Name' className={classes.txtField}
                                    error={isButtonClicked && (!formData.lastName || formData.firstName.trim() === '') ? true : false} value={formData.lastName} />
                            </div>
                            <Grid container>
                                <Grid item>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                            //disableToolbar
                                            error={isButtonClicked && !formData.birthDate ? true : false}
                                            autoOk={true}
                                            variant='inline'
                                            inputVariant='outlined'
                                            format='MM/dd/yyyy'
                                            margin='normal'
                                            id='dob-date'
                                            label='Date Of Birth'
                                            value={formData.birthDate}
                                            onChange={handleDobChange}
                                            KeyboardButtonProps={
                                                { 'aria-label': 'change date' }
                                            }
                                            required
                                            style={{ width: '300px', marginLeft: '10px', marginBottom: '10px' }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item style={{ marginLeft: 10, marginTop: 5 }}>
                                    <TextField disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                        onChange={(e) => formChange('patientAccountNumber', e.target.value)} variant='outlined'
                                        label='Patient Account Number' className={classes.txtField}
                                        value={formData.patientAccountNumber} />
                                </Grid>
                            </Grid>


                            <FormLabel style={{ color: '#C72C35' }}>Rendering NPI</FormLabel>
                            <div>
                                <TextField error={isButtonClicked && !formData.NPInumber ? true : false}
                                    disabled={formData.uploadBatchFile === 'uploadBatchFile'} className={classes.txtField}
                                    variant='outlined' label='NPI NUMBER' value={formData.NPInumber} type={'number'}
                                    onChange={(e) => formChange('NPInumber', e.target.value)} />
                                <TextField disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                    onChange={(e) => formChange('clientID', e.target.value)} variant='outlined'
                                    label='Client ID' className={classes.txtField}
                                    error={isButtonClicked && (!formData.clientID || formData.clientID.trim() === '') ? true : false} value={formData.clientID} />
                            </div>
                            <div style={{ display: 'flex' }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                        error={isButtonClicked && !formData.startDate ? true : false}
                                        disableToolbar
                                        variant='inline'
                                        autoOk={true}
                                        inputVariant='outlined'
                                        format='MM/dd/yyyy'
                                        style={{ width: '300px', margin: '10px' }}
                                        margin='normal'
                                        id='strt-date'
                                        label='Start Date'
                                        value={formData.startDate}
                                        onChange={handlestartDateChange}
                                        KeyboardButtonProps={
                                            { 'aria-label': 'change date' }
                                        }
                                        required
                                    />
                                </MuiPickersUtilsProvider>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                        disableToolbar
                                        error={isButtonClicked && !formData.endDate ? true : false}
                                        variant='inline'
                                        autoOk={true}
                                        inputVariant='outlined'
                                        format='MM/dd/yyyy'
                                        style={{ width: '300px', margin: '10px' }}
                                        margin='normal'
                                        id='end-date'
                                        label='End Date'
                                        value={formData.endDate}
                                        onChange={handleEndDateChange}
                                        KeyboardButtonProps={
                                            { 'aria-label': 'change date' }
                                        }
                                        required
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                    variant='outlined'
                                    MenuProps={{
                                        classes: {
                                            paper: classes.dropdownStyle
                                        },
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        },
                                        getContentAnchorEl: null,
                                        transitionDuration: 0
                                    }}
                                    style={{ width: '300px', margin: '10px' }}
                                    className={classes.slct}
                                    displayEmpty
                                    value={formData.relationship}
                                    onChange={(e) => formChange('relationship', e.target.value)}
                                // renderValue={formData.relationship !== "" ? undefined : () => "Relationship to Subscriber (Self)"}
                                >
                                    {relationshipMenuItems.map((relationshipItem) => {
                                        return <MenuItem value={relationshipItem}>{relationshipItem}</MenuItem>
                                    })}
                                </Select>
                                <Select
                                    disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                    variant='outlined'
                                    MenuProps={{
                                        classes: {
                                            paper: classes.dropdownStyle
                                        },
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        },
                                        getContentAnchorEl: null,
                                        transitionDuration: 0
                                    }}
                                    style={{ width: '300px', margin: '10px' }}
                                    className={classes.slct}
                                    displayEmpty
                                    value={formData.healthBenefit}
                                    onChange={(e) => formChange('healthBenefit', e.target.value)}
                                // renderValue={formData.healthBenefit !== "" ? undefined : () => "Health Benefit Plan Coverage"}
                                >
                                    {serviceTypeDataList.map((serviceObj) => {
                                        return <MenuItem value={serviceObj.service_type_Id}>{serviceObj.service_name}</MenuItem>
                                    })}
                                </Select>
                            </div>
                            <FormLabel style={{ color: '#C72C35' }}>Insurance Details</FormLabel>
                            <p style={{ marginTop: '10px' }}>Enter Patient's Insurance Card Details</p>
                            <div style={{ display: 'flex' }}>
                                <Select
                                    disabled={formData.uploadBatchFile === 'uploadBatchFile'}
                                    error={isButtonClicked && !formData.payer ? true : false}
                                    variant='outlined'
                                    MenuProps={{
                                        classes: {
                                            paper: classes.dropdownStyle
                                        },
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        },
                                        getContentAnchorEl: null,
                                        transitionDuration: 0
                                    }}
                                    style={{ width: '300px', margin: '10px' }}
                                    className={classes.slct}
                                    displayEmpty
                                    value={formData.payer}
                                    onChange={(e) => formChange('payer', e.target.value)}
                                    renderValue={formData.payer !== "" ? undefined : () => "Select Payer"}
                                >
                                    {payerDataList.map((payer) => {
                                        return <MenuItem value={payer.claims_payer_id}>{payer.external_payer_name}</MenuItem>
                                    })}
                                </Select>
                                <TextField error={isButtonClicked && !formData.subscriberID ? true : false}
                                    disabled={formData.uploadBatchFile === 'uploadBatchFile'} className={classes.txtField}
                                    variant='outlined' label='Subscriber ID' value={formData.subscriberID}
                                    onChange={(e) => formChange('subscriberID', e.target.value)} />
                            </div>
                        </div>
                    </Paper>
                    <Grid container direction='column'>

                        <Grid item>
                            <div style={{ display: 'flex' }}>
                                <FormControlLabel value='uploadBatchFile' control={<Radio />} label='Upload Batch File' />
                                <Button disabled={formData.uploadBatchFile !== 'uploadBatchFile'}>
                                    <input type="file" className="form-control-file" id="fileUpload" value='' onChange={e => uploadFile(e.target.files[0])} style={{ display: 'none' }} />
                                    <label htmlFor='fileUpload' style={{ cursor: 'pointer' }}>
                                        <PublishIcon style={{ 'color': "green", verticalAlign: 'middle' }} /> <span style={{ verticalAlign: 'middle' }}>Upload File</span>
                                    </label>
                                </Button>
                            </div>
                        </Grid>
                        <Grid item>
                            <div style={{ display: 'flex' }}>
                                <p  >(Please use this template to provide patient and insurance details)</p>
                                <img src={excelIcon} style={{ width: '20px', height: '20px', marginLeft: '20px', cursor: 'pointer' }} alt='' onClick={() => downLoadTemplate()}></img>
                            </div>
                        </Grid>
                        <Grid item style={{ marginTop: '10px' }}>
                            {uploadedFileName && <p style={{ padding: '5px 0 15px 0', color: ' brown', display: 'block' }}>{uploadedFileName}</p>}
                            <TextField value={widgetName} onChange={(e) => setWidgetName(e.target.value)} style={{ width: '100%' }} disabled={formData.uploadBatchFile !== 'uploadBatchFile'} className={classes.txtField} variant='outlined' placeholder='Tag this batch run providing a name to report status in summary dashboard(15 characters)' />
                        </Grid>
                        <Grid item style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Button style={{ margin: '10px' }} onClick={() => onClickCancel()}>Cancel</Button>
                                <Button style={{ background: '#C72C35', color: 'white', margin: '10px' }} onClick={completeVerification}>Process Now</Button>
                            </div>
                        </Grid>

                    </Grid>
                </RadioGroup>
            </div>
        </div>
    )
}


// ----------------------------------------------------------------------------------- Material Styles --------------------------------------------------

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        overflow: 'hidden'
    }, backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        overflow: 'hidden'
    },
    paper: {
        padding: 20,
        margin: 40,
        borderRadius: 4
    },
    slct: {
        width: 300
    },
    txtField: {
        width: '300px',
        margin: '10px',

    }
}));

export default ClaimUpload