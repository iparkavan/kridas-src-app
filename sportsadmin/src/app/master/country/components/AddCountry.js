import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CountryConfig from "../config/CountryConfig";
import useHttp from "../../../../hooks/useHttp";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useHistory } from 'react-router-dom';
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import * as yup from "yup";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AddState from "../components/AddState";
import InputField from '../../../common/ui/components/InputField';
import PageContainer from "../../../common/layout/components/PageContainer";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons//Cancel';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "../../../common/ui/components/Button";
import ConfirmationDialog from '../../../common/ui/components/ConfirmDialog'

const useStyles = makeStyles((theme) => ({

    tableAlign: {
        paddingLeft: "25px",
        padding: "1%",
        width: "66%",
    },

    iconSpace: {
        width: "35px"
    },

    center: {
        paddingLeft: "20px"
    },
    field: {
        width: "250px",
        marginLeft: '22px',
        paddingBottom: '15px',
        marginTop: "0px"
    },
    buttonAlign: {
        paddingLeft: "20px",
        paddingTop: "2%"

    },
    addState: {
        margin: "10px",
        marginLeft: '25px',
        fontSize: "13px",

    },


}));
function AddCountry() {
    const classes = useStyles();
    let history = useHistory();
    let InitalState = {
        country_name: "",
        country_code: "",
        country_currency: "",
        country_states: []
    }
    const [errors, setErrors] = useState({});
    const [currentIndex, setIndex] = useState(-1);
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState("");
    const [snackError, setSnackError] = useState("success");
    const { sendRequest } = useHttp();
    const [countryDetails, setCountryDetails] = useState(InitalState)
    const { country_name, country_code, country_currency, country_states } = countryDetails
    const [mode, setmode] = useState("Add");
    const [showModal, setShowModal] = useState(false);
    const [rowValue, setRowValue] = useState({});
    const [clear, setClear] = useState({});
    const [open, setOpen] = useState(false);
    const [rowIndex, setRowIndex] = useState(-1);
    let key = "country_states"


    if (clear) {

    }

    const handlechange = (e) => {
        if (e.target.name === "country_code") {
            setCountryDetails({ ...countryDetails, [e.target.name]: e.target.value.toUpperCase() })
        }
        else {
            setCountryDetails({ ...countryDetails, [e.target.name]: e.target.value })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        const scheme = yup.object().shape(
            {
                country_code: yup
                    .string()
                    .typeError("Please enter  country code")
                    .min(2, "Country code Minimum of 2 character")
                    .max(3, "Country code Maximum of 3 character")
                    .test('country_code', 'Country code is already Present ', async function (country_code) {
                        try {
                            let checkCountry_code = await validateCountryCode(country_code);
                            if (checkCountry_code) {
                                return this.createError({ message: 'Country code is already Present' });
                            }
                            return true;
                        } catch (e) {
                            return false;
                        }
                    })
                    .required("Please enter  country code")
                ,
                country_name: yup
                    .string()
                    .typeError("Please enter  country name")
                    .matches(/^[aA-zZ\s]+$/, "Symbol and Number are not allowed ")
                    .required("Please enter  country name"),

                country_currency: yup
                    .string()
                    .typeError("Please enter country currency")
                    .min(3, "Currency Minimum  of 3 character")
                    .max(5, "Currency Maximum of 5 character")
                    .matches(/^[aA-zZ\s]+$/, "Symbol and Number are not allowed ")
                    .required("Please enter  country currency"),
            });
        await scheme
            .validate(countryDetails, { abortEarly: false })
            .then(() => {
                if (country_states.length === 0) {
                    setSnackError("warning");
                    setSnackMsg("Country must have atleast one state");
                    setSnackOpen(true);
                    return false;
                }
                let newArray = country_states.map(function (item) {
                    delete item.is_delete;
                    return item;
                });

                setCountryDetails({ ...countryDetails, [key]: newArray })

                let tempData = { ...countryDetails }
                let jsonData = JSON.stringify(tempData?.country_states);
                tempData.country_states = jsonData

                const config = CountryConfig.addNewCountryTableValue(tempData);
                const transformDate = (data) => {
                    setCountryDetails(data);
                    history.push(`/masters/country`);
                };
                sendRequest(config, transformDate);
                setSnackError("success");
                setSnackMsg("Country add successfully");
                setSnackOpen(true);
                return () => {
                    setClear({});
                }
            })
            .catch((e) => {
                let errorObj = {};
                e.inner.map((error) => {
                    return (
                        errorObj[error.path] = error.message
                    )
                });
                setErrors({
                    ...errorObj,
                });
            });
    }
    const validateCountryCode = async (country_code) => {
        let flag = false;
        const config = CountryConfig.getCountryCode(country_code);
        const transformDate = (data) => {
            if (data) {
                flag = true;
            }
            else {
                flag = false;
            }
        };
        await sendRequest(config, transformDate);
        return flag;
    }
    function addDialog() {
        setIndex(-1)
        setShowModal(true)
        setmode("Add");
    }
    function editDialog(index, row) {
        setRowValue(country_states[index])
        setIndex(index)
        setmode("edit");
        setShowModal(true)
    }
    const Cancelbtn = () => {
        history.push(`/masters/country`);
    }
    function arrayDelete(array, n) {
        if (n > -1) {
            array.splice(n, 1);
        }
        return array;
    }
    const handleConfirmOpen = () => {
        setOpen(true);
    };

    const handleConfirmClose = () => {
        setOpen(false);
    };



    const DeleteTable = (index) => {
        handleConfirmOpen();
        setRowIndex(index)
    }


    const ConfirmDelete = () => {
        let arraystates = [...country_states];
        let sendData = arrayDelete(arraystates, rowIndex)
        setCountryDetails({ ...countryDetails, [key]: sendData })
        setSnackMsg("deleted successfully")
        setSnackOpen(true);
        handleConfirmClose(true)
    }

    function sendCountryProps(state, mode) {
        if (state != null) {
            if (mode === "edit") {
                country_states[currentIndex] = state
                setCountryDetails({ ...countryDetails, [key]: [...country_states] })

            } else {
                setCountryDetails({ ...countryDetails, [key]: [...country_states, state] })

            }
        }
        return;
    }
    return (
        <>
            {showModal && <AddState country_states={country_states} countryDetailState={sendCountryProps} showModal={setShowModal} indexValue={currentIndex} rowSend={rowValue} modelMode={mode} modelSend={mode} />}
            <PageContainer heading="Add Country"></PageContainer>

            <div >
                <form>
                    <div >
                        <InputField className={classes.field}
                            required
                            variant="outlined"
                            margin="dense"
                            value={country_name || ''}
                            onChange={e => handlechange(e)}
                            name="country_name"
                            type="text"
                            label="Country Name"
                            error={Boolean(errors.country_name)}
                            helperText={errors.country_name}
                        />
                    </div>
                    <div className={classes.align}>
                        <InputField className={classes.field}
                            required
                            variant="outlined"
                            type="text"
                            name="country_code"
                            value={country_code || ''}
                            onChange={e => handlechange(e)}
                            margin="dense"
                            label="Country Code"
                            error={Boolean(errors.country_code)}
                            helperText={errors.country_code}
                        />
                    </div>
                    <div>
                        <InputField className={classes.field}
                            required
                            variant="outlined"
                            margin="dense"
                            name="country_currency"
                            value={country_currency || ''}
                            onChange={e => handlechange(e)}
                            type="text"
                            label="Country Currency"
                            error={Boolean(errors.country_currency)}
                            helperText={errors.country_currency}
                        />
                    </div>
                    <Button className={classes.addState} variant="contained" startIcon={<AddCircleIcon />} color="primary" onClick={() => addDialog()} > Add State</Button>

                </form>
                <div className={classes.tableAlign}>

                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>State Name</TableCell>
                                    <TableCell>State Code</TableCell>
                                    <TableCell align="right">Options</TableCell>
                                </TableRow>
                            </TableHead>
                            {country_states.length > 0 ? (<TableBody>
                                {country_states.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell component="th" scope="row">
                                            {row.state_name}
                                        </TableCell>
                                        <TableCell>{row.state_code}</TableCell>
                                        <TableCell align="right">
                                            <Tooltip title="Edit" className={classes.iconSpace}>
                                                <IconButton
                                                    aria-label="Edit"
                                                    size="small"
                                                    onClick={() => editDialog(index, row)} key={index}>
                                                    <EditIcon style={{ fontSize: "medium" }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" >
                                                <IconButton
                                                    aria-label="Delete"
                                                    size="small"
                                                    onClick={() => DeleteTable(index)} key={index}
                                                >
                                                    <DeleteIcon style={{ fontSize: "medium" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>) : "No Data available"}
                        </Table>
                    </TableContainer>

                </div>
                <div className={classes.buttonAlign}>

                    <Button style={{ marginRight: 20 }} cursor="pointer" variant="contained" color="primary" startIcon={<SaveIcon />} onClick={(e) => handleSubmit(e)}> Save </Button>

                    <Button cursor="pointer" variant="contained" onClick={Cancelbtn} startIcon={<CancelIcon />}>Cancel</Button>
                </div>

                <ConfirmationDialog
                    open={open}
                    handleClose={handleConfirmClose}
                    title="Delete State"
                    children="Are you sure want to delete this state?"
                    handleConfirm={ConfirmDelete}
                />
                <Snackbar open={snackOpen}
                    autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
                    <MuiAlert elevation={6} onClose={() => setSnackOpen(false)} variant='filled' severity={snackError}>
                        {snackMsg}
                    </MuiAlert>
                </Snackbar>
            </div>
        </>
    )
}

export default AddCountry;