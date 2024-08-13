import { AppBar, Backdrop, Box, CircularProgress, CssBaseline, Drawer, Grid, Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { ToastContainer } from "react-toastify";
import EditIcon from "@material-ui/icons/Edit";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { CloudUpload } from "@material-ui/icons";
import axios from "axios";
import PropTypes from "prop-types";

import LeftsideMenu from "./LeftsideMenu";
import logodb from "../img/Beats-health-logo.png";
import customStyles from "./CustomStyle";
import MyDetailsComponent from "./MyDetailsComponent";
import AdminConfiguration from "./AdminConfiguration";
import Mapping from "./Mapping";
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import SummaryPage from "./SummaryPage";
import ManageClients from "./ManageClients";
import SessionTimeOut from './common/SessionTimeOut';

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
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function MyProfileComponent() {

    const classes = customStyles();
    const [open] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [subscriberDetails, setSubscriberDetails] = React.useState({});
    const [pictures, setProfilePicture] = React.useState({ image: "", url: "" });
    const uploadInputRef = React.useRef(null);
    const email = JSON.parse(localStorage.getItem("attributes")).find(x => x.name === 'email').value;
    const [passwordData, setPasswordData] = React.useState({});

    React.useEffect(() => {
        let urlParam = window.location.search
        if (urlParam === '?mapping') {
            setValue(1)
        }
        fetchSubscriberDetails()
    }, []);

    const passwordFormChange = (keyName, keyValue) => {
        setPasswordData({
            ...passwordData,
            ...{ [keyName]: keyValue }
        })
    }

    const createPhoneNumber = (keyName, keyValue, type) => {
        if (keyValue.length > 9) {
            let formatedValue = keyValue.replaceAll('-', '');
            let newNumber = `${formatedValue.substring(0, 3)}-${formatedValue.substring(3, 6)}-${formatedValue.substring(6)}`;
            onChangeFormData(keyName, newNumber, type);
        } else {
            onChangeFormData(keyName, keyValue, type);
        }
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const onDrop = (event) => {
        let obj = event.target.files[0];
        obj["image"] = obj;
        obj["url"] = URL.createObjectURL(obj);
        setProfilePicture(obj);
    };

    const fetchSubscriberDetails = async () => {
        if (sessionStorage.role === 'Admin') {
            let fetchConfig = {
                method: "get",
                url: process.env.REACT_APP_BEATS_FETCH_SUBSCRIBER_DETAILS,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.idToken,
                }
            };

            try {
                setLoading(true);
                let fetchSubscriberDetailsRes = await axios(fetchConfig);
                setLoading(false);
                if (fetchSubscriberDetailsRes && fetchSubscriberDetailsRes.data) {
                    setSubscriberDetails(fetchSubscriberDetailsRes.data);
                }
            } catch (e) {
                console.log("failed to fetch Provider Image");
            }
        }
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const uploadProfile = async () => {
        let pictureObj = pictures;
        const attributeData = JSON.parse(localStorage.attributes);
        let providerId = attributeData.find((x) => x.name === "sub").value;
        if (pictureObj["image"] === "") {
            ToastError("Please select image file to upload");
            return false;
        }
        var data = new FormData();
        let filename = pictureObj["image"].name;
        data.append("file", pictureObj["image"]);
        const result = await toBase64(pictureObj["image"]).catch((e) => Error(e));
        if (result instanceof Error) {
            console.log("Error: ", result.message);
            return;
        }

        let convertedFile = result.split(",")[1];
        data.append("file", convertedFile);
        let fileData = {
            fileData: convertedFile,
        };

        let config = {
            method: "post",
            url: process.env.REACT_APP_BEATS_PROFILE_UPLOAD,
            headers: {
                "Content-Type": "application/json",
                providerid: providerId,
                filename: filename,
                "type-of-file": pictureObj["image"].type,
                Authorization: "Bearer " + sessionStorage.idToken
            },
            data: fileData,
        };

        setLoading(true);
        axios(config)
            .then(function (response) {
                setLoading(false);
                ToastSuccess("Profile picture is updated successfully");
                let filename = pictures["image"].name;
                setProfilePicture({ ...pictures, image: "" });
                let newArray = attributeData.filter((val) => val.name !== "url");
                let providerId = attributeData.find((val) => val.name === "sub").value;
                newArray.push({ name: "url", value: providerId + "/" + filename });
                localStorage.setItem("attributes", JSON.stringify(newArray));
            })
            .catch(function (error) {
                setLoading(false);
                console.log(error);
                ToastError(error.response.data.error);
                setProfilePicture({ url: "", image: "" });
            });
    };
    const openFileUploader = () => {
        uploadInputRef.current.click();
    };
    const onChangeFormData = (keyName, keyValue, type) => {
        if (type === 'blngInvcAddress') {
            let tempaddress = { ...subscriberDetails.blngInvcAddress }
            tempaddress[keyName] = keyValue
            setSubscriberDetails({
                ...subscriberDetails,
                ...{ 'blngInvcAddress': tempaddress }
            })
        } else {
            let tempaddress = { ...subscriberDetails.physicalAddress }
            tempaddress[keyName] = keyValue
            setSubscriberDetails({
                ...subscriberDetails,
                ...{ 'physicalAddress': tempaddress }
            })
        }
    }
    const updateSubscriberDetails = async () => {

        let physycalAddressError = true
        Object.keys(subscriberDetails.physicalAddress).forEach(item => {
            if ((item === 'address_line1' && subscriberDetails.physicalAddress[item].trim() === '')
                || (item === 'city' && subscriberDetails.physicalAddress[item].trim() === '')
                || (item === 'contact_number' && subscriberDetails.physicalAddress[item].trim() === '')
                || (item === 'state' && subscriberDetails.physicalAddress[item].trim() === '')
                || (item === 'zip_code' && subscriberDetails.physicalAddress[item].trim() === '')
                || (item === 'country' && subscriberDetails.physicalAddress[item].trim() === '')) {
                physycalAddressError = false;
            }
        })

        let blngInvcAddressError = true
        Object.keys(subscriberDetails.blngInvcAddress).forEach(item => {
            if ((item === 'address_line1' && subscriberDetails.blngInvcAddress[item].trim() === '')
                || (item === 'city' && subscriberDetails.blngInvcAddress[item].trim() === '')
                || (item === 'contact_number' && subscriberDetails.blngInvcAddress[item].trim() === '')
                || (item === 'state' && subscriberDetails.blngInvcAddress[item].trim() === '')
                || (item === 'zip_code' && subscriberDetails.blngInvcAddress[item].trim() === '')
                || (item === 'country' && subscriberDetails.blngInvcAddress[item].trim() === '')) {
                blngInvcAddressError = false;
            }
        })

        const numberPattern = new RegExp(/^[0-9\b]+$/);

        let billingContactNumber = subscriberDetails.blngInvcAddress.contact_number && subscriberDetails.blngInvcAddress.contact_number.replaceAll('-', '');
        let physicalContactNumber = subscriberDetails.physicalAddress.contact_number && subscriberDetails.physicalAddress.contact_number.replaceAll('-', '');

        if ((billingContactNumber && (!numberPattern.test(billingContactNumber) || billingContactNumber.length !== 10)) || (physicalContactNumber && (!numberPattern.test(physicalContactNumber) || physicalContactNumber.length !== 10))) {
            ToastError("Please enter a valid contact number");
            return;
        }

        if (!blngInvcAddressError || !physycalAddressError) {
            ToastError('Please fill all the required field')
            return;
        }

        let saveConfig = {
            method: "post",
            url: process.env.REACT_APP_BEATS_UPDATE_SUBSCRIBER_DETAILS,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.idToken,
            },
            data: subscriberDetails,
        };

        try {
            setLoading(true);
            let updateSubscriberDetailsRes = await axios(saveConfig);
            setLoading(false);
            if (updateSubscriberDetailsRes.status === 200) {
                ToastSuccess("Successfully Updated.");
            }
        } catch (e) {
            console.log("failed to fetch Provider Image");
            setLoading(true);
        }
    }

    const updatePass = () => {

        const { currentPass, newPassword, confirmPass } = { ...passwordData }

        let payload = {
            oldPassword: currentPass,
            newPassword: newPassword
        }

        if (!newPassword || !confirmPass || !currentPass) {
            ToastError("Please fill all three fields");
            return;
        }

        if (newPassword !== confirmPass) {
            ToastError("New password and confirm password is not matching");
            return;
        }
        let config = {
            method: "post",
            url: process.env.REACT_APP_BEATS_UPDAT_PASSWORD,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.idToken,
                "is-update": "update",
            },
            data: payload,
        };
        setLoading(true);
        axios(config)
            .then(function (response) {
                setLoading(false);
                ToastSuccess("Successfully Updated.");
            })
            .catch(function (error) {
                setLoading(false);
                ToastError("Update Failed!");
                console.log(error);
            });
    };


    return (
        <div className={classes.root}>
            <SessionTimeOut />
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CssBaseline />
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
            <main id="maindiv" className={classes.content}>
                <div>
                    <Grid className="disblock">
                        <div className="maintab">
                            <AppBar position="static">
                                {process.env.REACT_APP_REGION === 'US' &&
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="simple tabs example"
                                    >
                                        <Tab label="Healthcare Provider Details"  {...a11yProps(0)} />
                                        {sessionStorage.role === 'Admin' && <Tab label="My Mappings" {...a11yProps(1)} />}
                                        {/* {sessionStorage.role === 'Admin' && <Tab label="Admin configuration" {...a11yProps(2)} />} */}
                                        {sessionStorage.role === 'Admin' && <Tab label="Admin configuration" {...a11yProps(2)} />}
                                    </Tabs>
                                }
                                {process.env.REACT_APP_REGION === 'INDIA' &&
                                    <Tabs
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="simple tabs example"
                                    >
                                        <Tab label="My Profile"  {...a11yProps(0)} />
                                        {sessionStorage.role === 'Admin' && <Tab label="My Mappings" {...a11yProps(1)} />}
                                        {/* {sessionStorage.role === 'Admin' && <Tab label="Admin configuration" {...a11yProps(2)} />} */}
                                        {sessionStorage.role === 'Admin' && <Tab label="Admin configuration" {...a11yProps(2)} />}
                                    </Tabs>
                                }

                            </AppBar>
                            <TabPanel value={value} index={0}>
                                <Grid item xs={12} sm={12}>
                                    <Paper className="pad20  bx-shadow dbbox">
                                        <Box className="toprightuploadicon  bx-shadow">
                                            <CloudUpload onClick={uploadProfile}></CloudUpload>
                                        </Box>
                                        <Box className="toprighticon  bx-shadow">
                                            <input
                                                type="file"
                                                ref={uploadInputRef}
                                                style={{ display: "none" }}
                                                onChange={(event) => {
                                                    onDrop(event);
                                                }}
                                            />
                                            <EditIcon onClick={openFileUploader}></EditIcon>
                                        </Box>{" "}
                                        <p className="title1 mb20">My Profile</p>
                                        <MyDetailsComponent
                                            subscriberDetails={subscriberDetails}
                                            email={email}
                                            onChangeFormData={onChangeFormData}
                                            updateSubscriberDetails={updateSubscriberDetails}
                                            passwordFormChange={passwordFormChange}
                                            createPhoneNumber={createPhoneNumber}
                                            pictures={pictures}
                                        />
                                        <Grid container className="signinbototm mt30">
                                            <Grid item xs={12} sm={9} md={9}>
                                                <button className="btn-primary" onClick={updatePass}>
                                                    Save
                                                </button>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Grid item xs={12} sm={12}>
                                    <Paper className="MuiPaper-root pad20  bx-shadow dbbox MuiPaper-elevation1 MuiPaper-rounded">
                                        <Grid container spacing={3}>
                                            <Mapping />
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </TabPanel>
                            {/* <TabPanel value={value} index={2}>
                                <Grid item xs={12} sm={12}>
                                    <Paper className="MuiPaper-root pad20  bx-shadow dbbox MuiPaper-elevation1 MuiPaper-rounded">
                                        <Grid container spacing={3}>
                                            <AdminConfiguration flow="fetch" />
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </TabPanel> */}
                            <TabPanel value={value} index={2}>
                                <Grid item xs={12} sm={12}>
                                    <Paper className="MuiPaper-root pad20  bx-shadow dbbox MuiPaper-elevation1 MuiPaper-rounded">
                                        <Grid container spacing={3}>
                                            <ManageClients flow="fetch"/>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            </TabPanel>
                        </div>
                    </Grid>
                </div>
            </main>
        </div>
    )
}