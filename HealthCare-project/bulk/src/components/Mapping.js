/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import PublishSharpIcon from '@material-ui/icons/PublishSharp';
import GetAppIcon from '@material-ui/icons/GetApp';
import excelIcon from "../img/Microsoft_Excel_2013_logo.svg.png";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Axios from "axios";
import { ToastError, ToastSuccess } from '../service/toast/Toast';
import customStyles from './CustomStyle';
import { ToastContainer } from "react-toastify";
import moment from 'moment'

const FileSaver = require('file-saver');

function Mapping(props) {
    const [isLoading, setLoading] = React.useState(false);
    const classes = customStyles();
    const [pairUploadStatus, setPairUploadStatus] = useState(false);
    const [groupUploadStatus, setGroupUploadStatus] = useState(false);
    const [payerFileStatus, setPayerFileStatus] = useState({});
    const [groupFileStatus, setGroupFileStatus] = useState({});

    const currentPath = window.location.pathname

    useEffect(() => {
        checkStatus();
    }, [])

    const checkStatus = async () => {
        setLoading(true);
        let url = process.env.REACT_APP_BEATS_MAPPING_UPLOAD_STATUS
        await Axios({
            method: 'GET',
            url: url,
            headers: {
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + sessionStorage.getItem("idToken")
            },
        }).then((response) => {
            setLoading(false);
            if (response && response.data && response.data[0]) {
                setPayerFileStatus({
                    date: moment(response.data[0].created_on).format('MMM DD hh:mm A'),
                    type: response.data[0].file_processing_status
                })
            }

            if (response && response.data && response.data[1]) {
                setGroupFileStatus({
                    date: moment(response.data[1].created_on).format('MMM DD hh:mm A'),
                    type: response.data[1].file_processing_status
                })
            }
        }).catch(err => {
            setLoading(false);
        })
    }

    const uploadFile = async (fileToUpload, type) => {
        if (!fileToUpload) {
            console.log('Please select a file to upload');
            return;
        }
        if (!fileToUpload.type.includes('application/vnd.openxml')) {
            ToastError('Please upload only xlsx file');
            return;
        }
        let userId = JSON.parse(sessionStorage.getItem("attributes"))[2].value;
        let fileName = 'PayerIDMapping.xlsx';
        let s3MappingPath = 'payer-mapping/';
        if (type === 'group') {
            fileName = 'GroupNameMapping.xlsx';
            s3MappingPath = 'group-mapping/';
        }
        let path = s3MappingPath +
            "upload" +
            "/" +
            userId +
            "/" +
            fileName;
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
                Axios({
                    method: "POST",
                    url: process.env.REACT_APP_BEATS_MAPPING_QUEUE_NOTIFICATION,
                    data: path,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        Authorization: "Bearer " + sessionStorage.getItem("idToken")
                    }
                }).then((response) => {
                    ToastSuccess("Validation in Progress");
                    setTimeout(() => {
                        checkStatus();
                    }, 90000);
                }).catch((error) => {
                    console.log("Error in Queue" + error);
                });
            });
        }).catch(() => {
            ToastError("Error Occured while uploading the file");
            setLoading(false);
        })
    }

    const downloadFile = async (type, notTemplate, uploadStatus, checkStatus) => {
        let userId = JSON.parse(sessionStorage.getItem("attributes"))[2].value;
        let fileName = 'PayerIDMapping.xlsx';
        let s3MappingPath = 'payer-mapping/';
        if (type === 'group') {
            fileName = 'GroupNameMapping.xlsx';
            s3MappingPath = 'group-mapping/';
        }
        let path = s3MappingPath +
            "download" +
            "/" +
            userId +
            "/" +
            fileName;
        if (uploadStatus) {
            path = s3MappingPath +
                "upload" +
                "/" +
                userId +
                "/" +
                fileName;
        }
        if (!notTemplate) {
            path = s3MappingPath +
                "template" +
                "/" +
                fileName;
        }
        setLoading(true);
        await Axios({
            method: 'POST',
            url: process.env.REACT_APP_BEATS_FETCH_PRESIGNED_URL_FOR_DOWNLOAD,
            data: {
                key: path,
                type: type
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
                if (checkStatus) {
                    if (type === 'payer') {
                        setPairUploadStatus('success');
                    }
                    if (type === 'group') {
                        setGroupUploadStatus('success');
                    }
                } else {
                    var blob = new Blob([response.data], { type: "application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                    FileSaver.saveAs(blob, fileName);
                    ToastSuccess("File downloaded successfully");
                }
                setLoading(false);
            }).catch((error) => {
                if (type === 'payer') {
                    setPairUploadStatus(false);
                }
                if (type === 'group') {
                    setGroupUploadStatus(false);
                }
                ToastError("No file to download");
                setLoading(false);
            });
        }).catch(() => {
            ToastError("Error Occured while downloading the file");
            setLoading(false);
        })
    }

    const onClickContinue = async () => {
        setLoading(true);
        let config = {
            method: "get",
            url: process.env.REACT_APP_BEATS_FETCH_SCREEN_STATUS_FOR_MAPPING,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("idToken"),
            },
        };

        let response = await Axios(config);
        if (response.status === 200) {
            if (response.data.screenToNavigate === "ADMIN_CONFIG") {
                props.history.push('/AdminConfiguration');
            } else {
                props.history.push('/Dashboard');
            }
        }
        setLoading(false);
    }

    return (
        <Grid container spacing={3} className={`${currentPath === "/Mapping" ? 'box-shadow-page' : ''}`}>
            <Grid item xs={12} sm={12} className="box-shadow-inner">
                <Backdrop className={classes.backdrop} open={isLoading}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <ToastContainer />
                <Grid item xs={12} sm={12}>
                    <h5 className="btitle">Mapping</h5>
                </Grid>
                <Grid item xs={12} sm={12} md={12} className="pd0">
                    <p className="txt-left btitle linkprim">Please read the following before you update mapping:</p>
                </Grid>
                <Grid container spacing={3} className="mr0 txt-left">
                    <Grid item xs={12} sm={12}>
                        <ul className='grid-li'>
                            <li>Use the below templates to do the mapping. Do not remove or alter any existing values, columns, or rows.</li>
                            <li>If you do not have a corresponding mapping for any of the existing values indicated in this sheet, please leave this blank.</li>
                            <li>New uploads will overwrite the entire existing mapping, so everytime you upload the mapping sheeet, you need to provide all values not just the new mapping values</li>
                        </ul>
                    </Grid>
                </Grid>
                <Grid container spacing={3} className="mr0 txt-left">
                    <Grid item xs={12} sm={12}>
                        <table style={{ borderSpacing: '20px', borderCollapse: 'separate' }}>
                            <thead>
                                <tr>
                                    <th className='linkprim' style={{ minWidth: '130px' }}>Mapping</th>
                                    <th className='linkprim'>Description</th>
                                    <th className='linkprim txt-center' style={{ minWidth: '120px' }}>Template</th>
                                    <th className='linkprim txt-center' >Upload</th>
                                    <th className='linkprim txt-center' style={{ minWidth: '150px' }}>Validation status</th>
                                    <th className='linkprim txt-center' style={{ minWidth: '280px' }}>Download successfully uploaded file</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Payer ID</strong></td>
                                    <td>Please provide your Payer ID mappings in the attached template</td>
                                    <td className='txt-center'>
                                        <a href='#' onClick={() => downloadFile('payer', false, false)} title='Download Template' style={{ position: 'relative', top: '8px' }}>
                                            <img src={excelIcon} alt="Download Template" title="Download Template" style={{ width: '30px', position: 'relative', top: '10px' }} />
                                        </a>
                                    </td>
                                    <td className='txt-center'>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="fileUpload1"
                                            value=''
                                            onChange={e => uploadFile(e.target.files[0], 'payer')}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor='fileUpload1' style={{ cursor: 'pointer', position: 'relative', top: '20px' }}>
                                            <PublishSharpIcon style={{ 'color': "green" }} />
                                        </label>
                                    </td>
                                    <td className='txt-center'>
                                        {payerFileStatus && payerFileStatus.type == 'Completed' ? <a href='#' onClick={() => downloadFile('payer', true, false)} title='Upload Status' style={{ color: 'green', fontSize: '14px' }}>
                                            Last upload was successful at {payerFileStatus.date}
                                        </a> : ''}
                                        {payerFileStatus && payerFileStatus.type && payerFileStatus.type != 'Completed' ? <a href='#' onClick={() => downloadFile('payer', true, true)} title='Upload Status' style={{ color: 'red', fontSize: '14px' }}>
                                            Last upload failed at {payerFileStatus.date}
                                        </a> : ''}
                                        {
                                            !payerFileStatus.type && <span>No files uploaded</span>
                                        }
                                    </td>
                                    <td className='txt-center'>
                                        <a href='#' onClick={() => downloadFile('payer', true, false)} title='Download existing payer ID mapping' style={{ position: 'relative', top: '20px' }}>
                                            <GetAppIcon style={{ 'color': "green" }} />
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>Client ID / Group Name</strong></td>
                                    <td>Upload this mapping if you use Client ID / Group Name to categorize rendering NPIs</td>
                                    <td className='txt-center'>
                                        <a href='#' onClick={() => downloadFile('group', false, false)} title='Download Template' style={{ position: 'relative', top: '8px' }}>
                                            <img src={excelIcon} alt="Download Template" title="Download Template" style={{ width: '30px', position: 'relative', top: '10px' }} />
                                        </a>
                                    </td>
                                    <td className='txt-center'>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="fileUpload2"
                                            value=''
                                            onChange={e => uploadFile(e.target.files[0], 'group')}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor='fileUpload2' style={{ cursor: 'pointer', position: 'relative', top: '20px' }}>
                                            <PublishSharpIcon style={{ 'color': "green" }} />
                                        </label>
                                    </td>
                                    <td className='txt-center'>
                                        {groupFileStatus && groupFileStatus.type == 'Completed' ? <a href='#' onClick={() => downloadFile('group', true, false)} title='Upload Status' style={{ color: 'green', fontSize: '14px' }}>
                                            Last upload was successful at {groupFileStatus.date}
                                        </a> : ''}
                                        {groupFileStatus && groupFileStatus.type && groupFileStatus.type != 'Completed' ? <a href='#' onClick={() => downloadFile('group', true, true)} title='Upload Status' style={{ color: 'red', fontSize: '14px' }}>
                                            Last upload failed at {groupFileStatus.date}
                                        </a> : ''}
                                        {
                                            !groupFileStatus.type && <span>No files uploaded</span>
                                        }
                                    </td>
                                    <td className='txt-center'>
                                        <a href='#' onClick={() => downloadFile('group', true, false)} title='Download existing group name mapping' style={{ position: 'relative', top: '20px' }}>
                                            <GetAppIcon style={{ 'color': "green" }} />
                                        </a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Grid>
                </Grid>
                {currentPath === "/Mapping" && <Grid container className="pb30 pt30" style={{ textAlign: 'center' }}>
                    <Grid item xs={12} sm={12} md={12}>
                        <button className="btn-primary" onClick={onClickContinue}>Continue</button>
                    </Grid>
                </Grid>}
            </Grid>
        </Grid>
    );
}
export default Mapping;