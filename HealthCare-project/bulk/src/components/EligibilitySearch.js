/* eslint-disable no-useless-computed-key */
import React, { useEffect, useState } from 'react'
import LeftsideMenu from './LeftsideMenu'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import logodb from '../img/Beats-health-logo.png';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputBase, MenuItem, Select } from '@material-ui/core';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import moment from 'moment';
import Datepickermod from './datepicker';
import { ToastSuccess, ToastError } from '../service/toast/Toast';
import { ToastContainer } from 'react-toastify';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import SimCardDownloadRoundedIcon from '@mui/icons-material/SimCardDownloadRounded';
import Axios from 'axios';
import { ELIGIBILITY_DROPDOWN_DATA, ELIGIBILITY_TABLE_COLUMNS } from './constants/eligibilityDataConstants';
import FileSaver from 'file-saver';
// import { DEFAULT_GRID_OPTIONS } from "@material-ui/x-grid";
import SessionTimeOut from './common/SessionTimeOut';


function EligibilitySearch() {
    const defaultFormData = {
        fromDate: new Date(),
        toDate: new Date(),
        searchKey: '',
        searchValue: ''
    }
    const defaultPaging = {
        totalRecordCount: 0,
        filteredRecordCount: 0
    }
    const classes = useStyles();
    const [open] = React.useState(false);
    const [selectedData, setSelectedData] = React.useState([]);
    const [formData, setFormData] = React.useState(defaultFormData);
    const [IsModalOpen, setIsModalOpen] = React.useState(false);
    const [claimTableData, setClaimTableData] = React.useState([]);
    const [paging, setPaging] = React.useState(defaultPaging);
    const [isLoading, setLoading] = React.useState(false);
    // const {rowHeight, headerHeight} = DEFAULT_GRID_OPTIONS;
    const [dropdownData, setDropdownData] = useState([]);

    useEffect(() => {
        getClaimData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        let temp_data = ELIGIBILITY_DROPDOWN_DATA;
        temp_data.sort((a, b) => a.Label.toLowerCase() > b.Label.toLowerCase() ? 1 : -1);
        setDropdownData(temp_data);
    }, [])

    function checkDate(start, end) {
        var mStart = moment(start);
        var mEnd = moment(end);
        if (mStart.isSame(mEnd) || mStart.isBefore(mEnd)) {
            return true;
        } else {
            return false;
        }
    }

    const getClaimData = async () => {
        let from_date = formData.fromDate ? moment(formData.fromDate).format('YYYY-MM-DD') : '';
        if (!from_date) {
            ToastError('From Date is not valid');
            return;
        }
        let to_date = formData.toDate ? moment(formData.toDate).format('YYYY-MM-DD') : '';
        if (!to_date) {
            ToastError('From Date is not valid');
            return;
        }
        if (!checkDate(formData.fromDate, formData.toDate)) {
            ToastError('End date cannot be before start date');
            return;
        };
        if (formData.searchKey && !formData.searchValue) {
            ToastError('Please enter a value in filter');
            return;
        }
        let temp_key = formData.searchValue;
        if (formData.searchKey === "from_date_of_service" || formData.searchKey === "date_of_birth" || formData.searchKey === 'created_on') {
            let isDateValid = moment(temp_key).isValid();
            if (isDateValid) {
                temp_key = moment(temp_key).format('YYYY-MM-DD');
            } else {
                ToastError('Date is not valid');
                return;
            }
        }
        let payload = {
            //"page": pageNumber,
            //"size": pageSize,
            "fromDate": from_date,
            "toDate": to_date,
            "searchKey": formData.searchKey,
            "searchValue": temp_key
        }
        setLoading(true);
        try {
            let config = {
                method: "post",
                url: process.env.REACT_APP_BEATS_ELIGIBILITY_SEARCh,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                },
                data: payload
            };
            let responseData = await Axios(config);
            console.log(" responseData ", responseData)
            if (responseData && responseData.status === 200 && responseData.data && responseData.data.patientRecords.length > 0) {
                let temp_data = responseData.data.patientRecords;
                setPaging({
                    totalRecordCount: responseData.data.totalRecordCount,
                    filteredRecordCount: responseData.data.filteredRecordCount
                })
                setClaimTableData(temp_data);
            } else {
                setClaimTableData([]);
                setPaging({
                    totalRecordCount: responseData?.data?.totalRecordCount ? responseData?.data?.totalRecordCount : 0,
                    filteredRecordCount: responseData?.data?.filteredRecordCount ? responseData?.data?.filteredRecordCount : 0
                })
            }
            setLoading(false);
        } catch (err) {
            console.log(err);
            ToastError("No data found");
            setLoading(false);
        }
    }
    const handleDelete = () => {
        if (selectedData.length > 0) {
            handleClickOpen();
        } else {
            ToastError('Please Select at least one row to delete');
        }
    }
    const handleExport = () => {
        if (claimTableData.length > 0) {
            let from_date = formData.fromDate ? moment(formData.fromDate).format('YYYY-MM-DD') : '';
            if (!from_date) {
                ToastError('From Date is not valid');
                return;
            }
            let to_date = formData.toDate ? moment(formData.toDate).format('YYYY-MM-DD') : '';
            if (!to_date) {
                ToastError('From Date is not valid');
                return;
            }
            if (!checkDate(formData.fromDate, formData.toDate)) {
                ToastError('End date cannot be before start date');
                return;
            };
            let selected_data_temp = []
            selectedData && selectedData.forEach(item => {
                let find = claimTableData.find(obj => obj.patient_eligibility_id === item);
                if (find) {
                    selected_data_temp.push(
                        {"patientEligibilityId":find.patient_eligibility_id}
                    )
                }
            })
            let payload = {
                fromDate: from_date,
                toDate: to_date,
                searchKey: formData.searchKey,
                searchValue: formData.searchValue,
                patientEligibilityIdList: selected_data_temp
            }
            setLoading(true);
            Axios({
                method: "POST",
                url: process.env.REACT_APP_BEATS_ELIGIBILITY_EXPORT,
                data: payload,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + sessionStorage.getItem("idToken")
                }
            }).then((response) => {
                let fileName = 'patient_detail.xlsx';
                let path = response.data;
                setLoading(true);
                Axios({
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
            }).catch((error) => {
                console.log("Error in Queue" + error);
                setLoading(false);
            });
        } else {
            ToastError('No records to export');
            setLoading(false);
        }
    }
    const setPatientDetailsdata = (keyName, keyValue) => {
        if (keyName === 'searchKey') {
            formData.searchValue = '';
        }
        if (keyName === 'searchKey' && (keyValue === "from_date_of_service" || keyValue === "date_of_birth" || keyValue === 'created_on')) {
            setFormData({
                ...formData,
                ...{ [keyName]: keyValue },
                ...{ ['searchValue']: moment() }
            })
        } else {
            setFormData({
                ...formData,
                ...{ [keyName]: keyValue }
            })
        }
    }
    const clearFilter = () => {
        setFormData({
            ...formData,
            ...{ ['searchValue']: '' }
        })
    }

    const handleClickOpen = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const handleContinue = async () => {
        setIsModalOpen(false);
        setLoading(true);
        let selected_dat_temp = []
        selectedData.forEach(item => {
            let find = claimTableData.find(obj => obj.patient_eligibility_id === item);
            if (find) {
                selected_dat_temp.push({
                    patient_eligibility_id: find.patient_eligibility_id
                })
            }
        });

        try {
            console.log("Delete URL " + process.env.REACT_APP_BEATS_ELIGIBILITY_DELETE);
            let config = {
                method: "post",
                url: process.env.REACT_APP_BEATS_ELIGIBILITY_DELETE,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                },
                data: selected_dat_temp
            };
            let responseData = await Axios(config);
            setClaimTableData([]);
            if (responseData && responseData.status === 200) {
                ToastSuccess("Selected records are deleted successfully");
                getClaimData();
                setSelectedData([])
            }
            // setLoading(false);
        } catch (err) {
            console.log(err);
            ToastError("Error Occured while deleting the data");
            setLoading(false);
        }
    };

    const onClickSearch = () => {
        getClaimData();
    }

    function customToolBar() {
        return (
            <GridToolbarContainer style={{ padding: '5px', borderBottom: '1px solid #ccc' }}>
                <Grid style={{ minWidth: '60%' }}>
                    <p style={{ marginTop: '20px' }}>Total records: {paging.totalRecordCount} | Filtered records: {paging.filteredRecordCount} out of {paging.totalRecordCount} records</p>
                </Grid>
                <Grid container style={{ justifyContent: 'right' }}>
                    {selectedData.length > 0 && <Grid item>
                        <IconButton className={classes.icnBtn}><DeleteForeverRoundedIcon style={{ color: 'red' }} onClick={handleDelete} /></IconButton>
                    </Grid>}
                    {claimTableData.length > 0 && <Grid item>
                        <IconButton className={classes.icnBtn}><SimCardDownloadRoundedIcon style={{ color: 'green' }} onClick={handleExport} /></IconButton>
                    </Grid>}
                </Grid>
            </GridToolbarContainer>
        );
    }

    // window.onscroll = function (ev) {
    //     if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
    //         if (claimTableData.length > 0) {
    //             let page_number = paging.pageNumber + 1;
    //             let page_size = paging.pageSize + 10;
    //             getClaimData(page_number, page_size);
    //         }
    //     }
    // };
    return (
        <div className={classes.root}>
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <CssBaseline />
            <ToastContainer />
            <SessionTimeOut />
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
            <div style={{ marginTop: '20px', width: '94%' }}>
                <Paper className="pad20 txt-center bx-shadow dbbox" elevation={6}>
                    <Grid item style={{ padding: '20px 0', borderRadius: '5px', boxShadow: '2px 2px 3px 2px rgb(0 0 0 / 20%)' }}>
                        <h5>Search your Eligibility</h5>
                        <Grid container className={classes.cntnr}>
                            <Grid item style={{ width: '330px' }}>
                                <Datepickermod
                                    label={"Start date (mm/dd/yyyy)"}
                                    value={formData.fromDate}
                                    maxDate={Date.now()}
                                    dateChanged={(val) => setPatientDetailsdata("fromDate", val)}
                                />
                            </Grid>
                            <Grid item style={{ width: '330px' }}>
                                <Datepickermod
                                    label={"End date (mm/dd/yyyy)"}
                                    value={formData.toDate}
                                    minDate={formData.fromDate}
                                    dateChanged={(val) => {
                                        setPatientDetailsdata("toDate", val);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.cntnr}>
                            <Grid item>
                                <Select
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
                                    className={classes.slct}
                                    displayEmpty
                                    value={formData.searchKey}
                                    onChange={e => setPatientDetailsdata('searchKey', e.target.value)}
                                    renderValue={formData.searchKey !== "" ? undefined : () => "Please select"}
                                >
                                    <MenuItem value=''>Please select</MenuItem>
                                    {dropdownData.map((item) => (
                                        <MenuItem value={item.value}>{item.Label}</MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12} sm={5} className="pad0 table-search">
                                <Box className={classes.root}>
                                    {(formData.searchKey !== "from_date_of_service" && formData.searchKey !== "date_of_birth" && formData.searchKey !== 'created_on') ? <InputBase
                                        className={classes.input}
                                        value={formData.searchValue}
                                        placeholder={
                                            formData.searchKey === "from_date_of_service" ||
                                                formData.searchKey === "date_of_birth" || formData.searchKey === 'created_on'
                                                ? "MM/DD/YYYY"
                                                : "Search string . . ."
                                        }
                                        inputProps={{ "aria-label": "Start Typing . . ." }}
                                        onChange={(e) => {
                                            setPatientDetailsdata('searchValue', e.target.value);
                                        }}
                                    /> :
                                        <span className='search-picker'><Datepickermod
                                            value={formData.searchValue}
                                            dateChanged={(val) => {
                                                setPatientDetailsdata("searchValue", val);
                                            }}
                                        /></span>
                                    }
                                    <div
                                        title={"Clear Filter"}
                                        style={{
                                            position: "absolute",
                                            right: "110px",
                                            top: "15px",
                                            fontSize: "25px",
                                            fontWeight: "bolder",
                                            cursor: "pointer",
                                        }}
                                        onClick={clearFilter}
                                    >
                                        X
                                    </div>

                                    <IconButton
                                        className={classes.iconButton}
                                        aria-label="search"
                                        style={{ right: "30px!important" }}
                                        onClick={() => onClickSearch()}
                                    >
                                        Search
                                    </IconButton>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                    <div style={{ textAlign: 'left', position: 'relative', top: '20px', height: '400px' }}>
                        <DataGrid
                            title='All Eligibility'
                            rows={claimTableData}
                            getRowId={(row)=>row.patient_eligibility_id}
                            columns={ELIGIBILITY_TABLE_COLUMNS}
                            rowsPerPageOptions={[]}
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModal) => {
                                setSelectedData(newSelectionModal)
                            }}
                            components={{
                                Toolbar: customToolBar
                            }}
                            componentsProps={{
                                toolbar: { minHeight: '10px' }
                            }}
                            hideFooter
                        />
                    </div>
                </Paper>

            </div>
            <Dialog
                open={IsModalOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"

            >
                <DialogTitle id="alert-dialog-title">

                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ color: '#333' }}>
                        {`${selectedData.length} out of ${claimTableData.length} records will be deleted`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} style={{ textTransform: 'capitalize', background: '#e8e8e8' }}>Cancel</Button>
                    <Button onClick={handleContinue} style={{ background: '#C72C35', color: '#fff', textTransform: 'capitalize' }}>
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

// __________________________________________________________________________ Material Styles ______________________________________________________

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'row'
    }, backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
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
    dropdownStyle:
    {
        borderRadius: "3%",
        backgroundColor: 'white',
    },
    cntnr: {
        flexGrow: 1,
        marginTop: 30,
        justifyContent: 'center'
    },
    slct: {
        width: 260
    },
    txtField: {
        width: 400
    },
    formCntrlLabel: {
        marginTop: 20
    },
    srchButton: {
        background: '#C72C35',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#C72C35'
        },
        textTransform: 'none'
    },
    closeIconButton: {
        '&:hover': {
            background: 'none'
        }
    },
    btnCntnr: {
        marginTop: 20,
        justifyContent: 'right'
    },
    gridDiv: {
        width: 1290,
        minHeight: 400
    },
    icnBtn: {
        '&:hover': {
            backgroundColor: 'none',
            background: 'none'
        }
    },
    isModalDialog: {
        backgroundColor: 'red'
    }
}));

export default EligibilitySearch