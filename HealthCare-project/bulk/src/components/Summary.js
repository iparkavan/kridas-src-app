import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, makeStyles, Paper, TextField } from '@material-ui/core'
import React from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Axios from "axios";
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import FileSaver from 'file-saver';
import moment from 'moment';

const Summary = (props) => {
    const { color, comments, verification, createdOn, uploadedFileUrl, user, totRecordsUploaded, totRecordsERA, complete,
        inProgress, retry, transactionFailed, validationFailed, total, nameTag, fileUploadId, status } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [txtValue, setTxtValue] = React.useState('');
    const [del, setDel] = React.useState(false);
    const [IsModalOpen, setIsModalOpen] = React.useState(false);

    const handleEdit = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleDialogClose = () => {
        setIsModalOpen(false);
    }
    const handleContinue = async () => {
        setDel(true);
        props.setLoading(true);
        let payload = {
            file_upload_id: fileUploadId
        }
        try {
            let config = {
                method: "post",
                url: process.env.REACT_APP_BEATS_DELETE_WIDGET,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                },
                data: payload
            };
            let responseData = await Axios(config);
            if (responseData.status === 200) {
                ToastSuccess("Widget deleted successfully");
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
            props.setLoading(false);
        }
    }
    const saveEdit = async () => {
        setOpen(false);
        props.setLoading(true);
        let payload = {
            file_upload_id: fileUploadId,
            widget_name: txtValue,
        }
        try {
            let config = {
                method: "post",
                url: process.env.REACT_APP_BEATS_SAVE_WIDGET_NAME,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                },
                data: payload
            };
            let responseData = await Axios(config);
            if (responseData.status === 200) {
                ToastSuccess("Widget Name updated successfully");
                //TODO set txtValue to nameTag
                props.fetchSummaryDashboard();
            }
        } catch (err) {
            console.log(err);
            props.setLoading(false);
        }
    }
    const handleDelete = async () => {
        setIsModalOpen(true);
    }
    const onClickDownload = async (url) => {
        let splittedUrl = url && url.split('/')
        let fileName = splittedUrl ? splittedUrl[2] : 'template.xlsx';
        let path = url;
        props.setLoading(true);
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
                responseType: 'arraybuffer',
                headers: {
                    "Content-Type": "application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                }
            }).then((response) => {
                var blob = new Blob([response.data], { type: "application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                FileSaver.saveAs(blob, fileName);
                ToastSuccess("File downloaded successfully");
                props.setLoading(false);
            }).catch((error) => {
                ToastError("No file to download");
                props.setLoading(false);
            });
        }).catch(() => {
            ToastError("Error Occured while downloading the file");
            props.setLoading(false);
        })
    }

    const onClickExport = (status) => {
        let payload = {
            file_upload_id: fileUploadId,
            processing_status: status
        }
        props.setLoading(true);
        let summaryUrl = verification.toUpperCase() === 'ELIGIBILITY'?process.env.REACT_APP_BEATS_ELIGIBILITY_SUMMARY_EXPORT:process.env.REACT_APP_BEATS_CLAIM_SUMMARY_EXPORT
        Axios({
            method: "POST",
            url: summaryUrl,
            data: payload,
            headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + sessionStorage.getItem("idToken")
            }
        }).then((response) => {
            let fileName = `${nameTag}_${status}.xlsx`;
            let path = response.data;
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
                    props.setLoading(false);
                }).catch((error) => {
                    ToastError("No file to download");
                    props.setLoading(false);
                });
            }).catch(() => {
                ToastError("Error Occured while downloading the file");
                props.setLoading(false);
            })
        }).catch((error) => {
            console.log("Error Occured while downloading the file" + error);
            props.setLoading(false);
        });
    }

    if (del === false) {
        return (
            <>
                <Paper style={{ padding: '10px', border: '1px solid #333' }}>
                    <Grid container direction='row' alignItems='center' spacing={8} style={{ justifyContent: 'center' }}>
                        <Grid item style={{ padding: '32px 0 32px 0' }}>
                            <DeleteOutlineOutlinedIcon className={classes.delIcon} onClick={handleDelete} />
                        </Grid>
                        <Grid item title={nameTag} style={{ padding: '32px 0 32px 0', width: '280px', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {nameTag}
                        </Grid>
                        <Grid item style={{ padding: '32px 0 32px 0' }}>
                            <ModeEditOutlineOutlinedIcon onClick={handleEdit} />
                            <Dialog
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="alert-dialog-title"
                            >
                                <DialogTitle>{"Change the Name of this Claims Verification ?"}</DialogTitle>
                                <DialogContent>
                                    <TextField
                                        variant='outlined'
                                        value={txtValue}
                                        onChange={e => setTxtValue(e.target.value)}
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Enter New Name"
                                        type="text"
                                        fullWidth
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>DISCARD</Button>
                                    <Button onClick={saveEdit} autoFocus>SAVE</Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </Grid>
                    <Paper elevation={1} style={{ justifyContent: 'center', backgroundColor: "#ffcccb" }} className={classes.childPaper}>
                        <b>{verification.toUpperCase()} VERIFICATION</b>
                    </Paper>
                    <Paper elevation={1} className={classes.childPaper}>
                    <div style={{whiteSpace: 'nowrap'}}>Batch Status :</div>
                        <b style={{ marginLeft: '43px', fontSize: '14px', color: {color}, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {comments !== null && comments !== '' ? status + ' ' + '(' + comments + ')' : status}
                        </b>
                    </Paper>
                    <Paper elevation={1} className={classes.childPaper}>
                    <div style={{whiteSpace: 'nowrap'}}>Created On :</div> <b style={{ marginLeft: '20px', fontSize: 15 }}>{createdOn ? moment(createdOn).format('MMMM DD YYYY, HH:mm') : ''}</b>
                    </Paper>
                    <Paper elevation={1} className={classes.childPaper}>
                        <a onClick={() => onClickDownload(uploadedFileUrl)}>Link to Uploaded File</a>
                    </Paper>
                    <Paper elevation={1} className={classes.childPaper}>
                        <div style={{whiteSpace: 'nowrap'}}>User :</div> <span title={user} style={{ marginLeft: '20px', width: '240px', overflow: 'hidden', textOverflow: 'ellipsis' }}><b>{user}</b></span>
                    </Paper>
                    <Paper elevation={1} className={classes.childPaper}>
                    <div style={{whiteSpace: 'nowrap'}}>Total Records Uploaded :</div> <b style={{ marginLeft: '55px' }}>{totRecordsUploaded ? totRecordsUploaded : ''}</b>
                    </Paper>
                    <Paper elevation={1} className={classes.childPaper}>
                    <div style={{whiteSpace: 'nowrap'}}>Total Records Linked To ERA :</div> <b style={{ marginLeft: '17px' }}>{totRecordsERA ? totRecordsERA : 'N/A'}</b>
                    </Paper>
                    <Paper elevation={1} className={classes.longChildpaper}>
                        <Grid container direction='column'>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={8}>Complete : </Grid>
                                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'right' }}>
                                    <span className='link-text' onClick={() => onClickExport('Complete')}><b>{complete ? complete : ''}</b></span>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={8}>In Progress : </Grid>
                                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'right' }}>
                                    <span className='link-text' onClick={() => onClickExport('In Progress')}><b>{inProgress ? inProgress : ''}</b></span>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={8}>Retry : </Grid>
                                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'right' }}>
                                    <span className='link-text' onClick={() => onClickExport('Retry')}><b>{retry ? retry : ''}</b></span>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={8}>Transaction Failed : </Grid>
                                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'right' }}>
                                    <span className='link-text' onClick={() => onClickExport('Transaction Failed')}><b>{transactionFailed ? transactionFailed : ''}</b></span>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={8}>Validation Failed : </Grid>
                                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'right' }}>
                                    <span className='link-text' onClick={() => onClickExport('Validation Failed')}><b>{validationFailed ? validationFailed : ''}</b></span>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <hr style={{ width: '100%', margin: '10px 0' }} />
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={8}>Total : </Grid>
                                <Grid item xs={12} sm={6} md={4} style={{ textAlign: 'right' }}>
                                    <span className='link-text' onClick={() => onClickExport('')}><b>{total ? total : ''}</b></span>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid container alignItems='center' style={{ justifyContent: 'left' }}>Last Updated : {moment(new Date()).format('MMM DD YYYY hh:mm')}</Grid>
                </Paper>
                <Dialog
                    open={IsModalOpen}
                    onClose={handleDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"

                >
                    <DialogTitle id="alert-dialog-title">

                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{ color: '#333' }}>
                            Are you sure you want to delete this widget?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} style={{ textTransform: 'capitalize', background: '#e8e8e8' }}>Cancel</Button>
                        <Button onClick={handleContinue} style={{ background: '#C72C35', color: '#fff', textTransform: 'capitalize' }}>
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    } else {
        return (<></>)
    }
}

const useStyles = makeStyles((theme) => ({
    childPaper: {
        display: 'flex',
        height: 40,
        border: '1px solid #ccc',
        // justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
        borderRadius: 3,
        margin: '10px 0',
        padding: '20px'
    },
    longChildpaper: {
        display: 'flex',
        border: '1px solid #ccc',
        justifyContent: 'center',
        alignItems: 'center',
        verticalAlign: 'middle',
        borderRadius: 3,
        margin: '10px 0',
        padding: '20px'
    },
    root: {
        padding: 20,
        border: '1px solid #ccc',
        width: '400px',
        borderRadius: 5,
        marginBottom: 20
    },
    delIcon: {
        color: '#C72C35'
    }
}))

export default Summary
