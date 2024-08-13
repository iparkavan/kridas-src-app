import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useHttp from "../../../../hooks/useHttp";
import userConfig from "../../config/userConfig";
import { makeStyles } from "@material-ui/styles";
import PageContainer from "../../../common/layout/components/PageContainer";
import InputField from "../../../common/ui/components/InputField";
import * as yup from "yup";
import Button from "../../../common/ui/components/Button";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons//Cancel';
import ErrorLabel from "../../../common/ui/components/ErrorLabel";
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AddCircleIcon from "@material-ui/icons/AddCircle";
import SportsCareer from "./sportCareer"
import ConfirmationDialog from '../../../common/ui/components/ConfirmDialog'
import { Card, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import EditIcon from "@material-ui/icons/Edit";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import { Divider } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import { FormGroup, FormControlLabel, FormControl } from "@material-ui/core";


const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "20px",
        marginTop: "10px"
    },
    button: {
        alignSelf: "flex-start",
    },
    DescField: {
        width: '41vw'
    },
    DescInput: {
        height: '100px',
        textAlign: 'Top'
    },
    selectCategory: {
        width: '41vw'
    },
    heading: {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "22px",
        marginTop: "15px",
        marginLeft: "10px",
        marginBottom: "10px"
    },
    buttonAlign: {
        margin: "10px",
        width: "130px",
        marginLeft: '15px',
        fontSize: "13px",
    },

    TotalAlign: {
        display: "flex"
    },

    iconAlign: {
        margin: "13px"
    },
    status: {
        width: "15vw"
    },
    cardAlign: {
        marginTop: "20px",
        marginBottom: "20px",
        backgroundColor: "#F5F5F5"
    },
    tableAlign: {
        width: "100%",
        paddingBottom: '20px',
        margin: '10px'
    },
    LinkInput: {
        width: "85vh"
    },
    IconDelete: {
        paddingLeft: "40px"
    },
    Linkheading: {
        marginTop: "10px",
        fontSize: "20px"
    },
    Linkheading1: {
        fontSize: "20px"
    },
    statusheading: {
        fontSize: "16px"
    },
    addbtn: {
        width: "10vh",
        height: "5vh",
        marginLeft: "5px",
        marginTop: "11px",
        marginBottom: "28px"


    },
    dividerAlign: {
        background: "none",
        width: "97vh",
        borderTop: "1.3px dashed #C4C4C4",
    },
    sportsCareerAlign: {
        margin: '1%'
    },
    message: {
        color: "red"
    },

}));


const UserStatisticsEdit = (props) => {
    const classes = useStyles();
    let history = useHistory();
    const UserStatisticsId = props.match.params.userStatisticsId;
    const [errors, setErrors] = useState({});
    const { error, sendRequest } = useHttp();
    const [snackOpen, setSnackOpen] = useState(false);
    const [snackMsg, setSnackMsg] = useState("Updated Successfully");
    const [snackError, setSnackError] = useState("success");
    const [rowValue, setRowValue] = useState({});
    const [currentIndex, setIndex] = useState(-1);
    const [showModalCareer, setShowModalCareer] = useState(false);
    const [openCareer, setOpenCareer] = useState(false);
    const [, setClear] = useState("");
    const [formValueses, setFormValueses] = useState([{ link: "" }])
    const [rowIndex, setRowIndex] = useState(-1);
    const [, setDisplaytable] = useState(false);
    const [linkMsg, setLinkMsg] = useState(false);
    const [mode, setmode] = useState("Add");
    const [userStatisticsInfo, setUserStatisticsInfo] = useState({
        sports_name: "",
        category_name: "",
        playing_status: "",
        statistics_desc: "",
        sports_role: "",
        sports_profile: "",
        sport_career: [],
        sportwise_statistics: "",
        statistics_links: "",
        statistics_docs: "",
        first_name: "",
        user_id: "",
        skill_level: "",
        sports_id: "",
        sports_code: ""

    })
    const { sports_role, sports_profile, sport_career } = userStatisticsInfo;
    let careerKey = "sport_career";
    let code = userStatisticsInfo?.sports_code;
    const UserId = userStatisticsInfo.user_id

    useEffect(() => {
        const UserStatisticsConfig = userConfig.getUserStatisticsById(UserStatisticsId);
        const transformCategoryData = (data) => {
            const actualData = data.data;
            setUserStatisticsInfo({
                user_id: actualData.user_id,
                skill_level: actualData.skill_level,
                sports_id: actualData.sports_id,
                sports_name: actualData.sports_name,
                category_name: actualData.category_name,
                playing_status: actualData.playing_status,
                statistics_desc: actualData.statistics_desc,
                sports_role: actualData.sports_role,
                sports_profile: actualData.sports_profile,
                sport_career: actualData.sport_career,
                sportwise_statistics: actualData.sportwise_statistics,
                statistics_links: actualData.statistics_links,
                statistics_docs: actualData.statistics_docs,
                first_name: actualData.first_name,
                sports_code: actualData.sports_code,

            });

            let objdata = actualData.statistics_links?.map((e) => {
                let obj = {};
                obj["link"] = e
                return obj;
            })

            setFormValueses(objdata || [{ link: "" }]);
        };
        sendRequest(UserStatisticsConfig, transformCategoryData);
        return () => {
            setClear({});
        };
    }, [sendRequest, UserStatisticsId]);

    const handleChange = (e) => {
        setUserStatisticsInfo({
            ...userStatisticsInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async (e, UserId) => {
        e.preventDefault();
        const scheme = yup.object().shape(
            {
                sports_name: yup
                    .string()
                    .typeError("Please enter  Sports Name")
                    .max(50, "Maximum of 50 characters")
                    .matches(/^[aA-zZ\s]+$/, "Symbol and Number are not allowed ")
                    .required("Please enter  Sports Name"),


                link: yup
                    .string()
                    .nullable(true)
                    .matches(
                        /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,

                        ' Please enter Valid Url'
                    )
                    .transform((curr, orig) => orig === '' ? null : curr),
            }



        );

        await scheme

            .validate(userStatisticsInfo, { abortEarly: false })
            .then(() => {

                if (formValueses.length > 0 && formValueses[formValueses.length - 1].link === "")
                    formValueses.splice(-1)
                setLinkMsg(false);

                let statistics_links = [];

                statistics_links = formValueses.map(values => values.link);
                userStatisticsInfo.statistics_links = JSON.stringify(statistics_links);

                const userStatisticsConfig = userConfig.updateUserStatistics({
                    ...userStatisticsInfo,
                    user_statistics_id: UserStatisticsId,
                });

                const transformData = (data) => {
                    setUserStatisticsInfo(data);
                    history.push(`/user/edit/${UserId}`);
                };
                setSnackError("success");
                setSnackMsg("User Statistics updated successfully");
                setSnackOpen(true);
                sendRequest(userStatisticsConfig, transformData);


            })

            .catch((e) => {
                let errorObj = {};
                e.inner?.map((error) => {
                    return (

                        errorObj[error.path] = error.message
                    )
                });
                setErrors({
                    ...errorObj,
                });
            });

    };

    const handleCancel = async (e, UserId) => {
        e.preventDefault();
        history.push(`/user/edit/${UserId}`);
    };




    let handleChangeLink = (i, e) => {

        let newFormValues = [...formValueses];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValueses(newFormValues);
    }

    let addFormFields = () => {
        if (formValueses === []) {
            setFormValueses([...formValueses, { link: "" }])
            setLinkMsg(false);
        }
        else if ((formValueses[formValueses.length - 1]?.link === "")) {
            setLinkMsg(true);
        }
        else {
            setFormValueses([...formValueses, { link: "" }])
            setLinkMsg(false);
        }
    }


    let removeFormFields = (i) => {
        setLinkMsg(false);
        let newFormValues = [...formValueses];
        newFormValues.splice(i, 1);
        setFormValueses(newFormValues)
    }


    const handleEdit = async (e, user_statistics_id, sports_code) => {
        e.preventDefault();
        history.push(`/masters/sportsStatistics/${user_statistics_id}/${sports_code}`)
    }


    function arrayDelete(array, n) {
        if (n > -1) {
            array.splice(n, 1);
        }
        return array;
    }

    /* For Sports Category Add,Edit,Delete */

    /* Sports Category Add */

    function addDialogCareer() {
        setIndex(-1)
        setShowModalCareer(true)
        setmode("Add");
    }


    /*  Sports Category Edit */

    function editDialogCareer(index, row) {
        setRowValue(sport_career[index])
        setIndex(index)
        setShowModalCareer(true)
        setmode("edit");
    }

    /*   Sports Career Delete */

    const handleConfirmOpenCareer = () => {
        setOpenCareer(true);
    };

    const handleConfirmCloseCareer = () => {
        setOpenCareer(false);
    };

    const DeleteDialogCareer = (index) => {
        handleConfirmOpenCareer();
        setRowIndex(index)
    }

    const ConfirmCareerDelete = () => {
        let arrayCareer = [...sport_career];
        let sendData = arrayDelete(arrayCareer, rowIndex)
        setUserStatisticsInfo({ ...userStatisticsInfo, [careerKey]: sendData })
        setSnackMsg("Deleted Successfully")
        setSnackOpen(true);
        handleConfirmCloseCareer(true)
    }

    /* Sports Career */

    function sendSportsCareerProps(career, career_mode) {

        if (career != null) {
            if (career_mode === "edit") {
                sport_career[currentIndex] = career
                setUserStatisticsInfo({ ...userStatisticsInfo, [careerKey]: [...sport_career] })
                setDisplaytable(true);
            } else {
                setUserStatisticsInfo({ ...userStatisticsInfo, [careerKey]: [...sport_career, career] })
                setDisplaytable(true);
            }
        }
        return;
    }


    return (
        <>
            <PageContainer heading="Edit User Statistics">
                <div className={classes.root}>
                    {showModalCareer && <SportsCareer sports_role={sports_role} sports_profile={sports_profile} userStatisticsId={UserStatisticsId} sport_career={sport_career} flag={showModalCareer} sportsCareerSave={sendSportsCareerProps} setShowModalCareer={setShowModalCareer} indexValue={currentIndex} rowSend={rowValue} modelMode={mode} modelSend={mode} />}

                    <div style={{ display: "flex" }}>
                        <InputField
                            style={{ marginRight: 100 }}
                            required
                            size="small"
                            type="text"
                            variant="outlined"
                            label="User Name"
                            name="first_name"
                            value={userStatisticsInfo.first_name || ""}
                            onChange={handleChange}
                            error={Boolean(errors.first_name)}
                            helperText={errors.first_name}
                            disabled={true}
                        />

                        <InputField
                            required
                            size="small"
                            type="text"
                            variant="outlined"
                            label="Sports Name"
                            name="sports_name"
                            value={userStatisticsInfo.sports_name || ""}
                            onChange={handleChange}
                            error={Boolean(errors.sports_name)}
                            helperText={errors.sports_name}
                            disabled={true}
                        />
                    </div>

                    <div style={{ display: "flex" }}>
                        <InputField
                            style={{ marginRight: 100 }}
                            required
                            size="small"
                            type="text"
                            variant="outlined"
                            label="Skill Level"
                            name="category_name"
                            value={userStatisticsInfo.category_name || ""}
                            onChange={handleChange}
                            error={Boolean(errors.category_name)}
                            helperText={errors.category_name}
                            disabled={true}
                        />

                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <Typography className={classes.statusheading}>Playing Status </Typography>
                            <FormGroup>
                                <div className={classes.statusGrid}>
                                    <FormControlLabel
                                        name="playing_status"
                                        control={
                                            <Checkbox
                                                name="playing_status"
                                                borderColor="primary.600"
                                                value="AC"
                                                checked={userStatisticsInfo.playing_status === "AC" ? true : false}
                                                onChange={(e) => handleChange(e, true)}
                                            />
                                        }
                                        label="Active"
                                    />
                                    <FormControlLabel
                                        name="playing_status"
                                        control={
                                            <Checkbox
                                                name="playing_status"
                                                borderColor="primary.600"
                                                value="IN"
                                                checked={userStatisticsInfo.playing_status === "IN" ? true : false}
                                                onChange={(e) => handleChange(e, true)}
                                            />
                                        }
                                        label="InActive"
                                    />
                                </div>
                            </FormGroup>
                        </FormControl>
                    </div>

                    <InputField
                        className={classes.DescField}
                        size="small"
                        type="text"
                        variant="outlined"
                        label="Statistics Description"
                        name="statistics_desc"
                        multiline={true}
                        rows={3}
                        rowsMax={20}
                        value={userStatisticsInfo.statistics_desc || ""}
                        onChange={handleChange}
                        error={Boolean(errors.statistics_desc)}
                        helperText={errors.statistics_desc}
                    />

                    <Typography className={classes.Linkheading}>External Stats URL </Typography>
                    <Divider className={classes.dividerAlign} />

                    <form >
                        {formValueses && formValueses?.map((element, index) => (
                            <div className={classes.TotalAlign} key={index}>
                                <div className={classes.fieldAlign}>
                                    <InputField
                                        className={classes.LinkInput}
                                        type="text" label="Link" name="link"
                                        variant="outlined" value={element.link || ""}
                                        onChange={e => handleChangeLink(index, e)}
                                        error={Boolean(errors.link)}
                                        helperText={errors.link}
                                    />
                                </div>

                                <div className={classes.iconAlign}>
                                    {index ?
                                        <Tooltip title="Delete">
                                            <DeleteIcon className={classes.IconDelete} color="primary" onClick={() => removeFormFields(index)}>Remove</DeleteIcon>
                                        </Tooltip>
                                        : null}
                                </div>
                            </div>
                        ))}

                        {linkMsg && <p className={classes.message} >Please fill the data </p>}
                        <Button className={classes.addbtn} variant="contained" startIcon={<AddCircleIcon />} color="primary" onClick={() => addFormFields()} > Add </Button>
                    </form>


                    <Typography className={classes.Linkheading1}>External Statistics Update </Typography>
                    {code && code.length > 0 && <div>
                        <Button
                            style={{ marginRight: 20 }}
                            className={classes.button}
                            color="primary"
                            onClick={(e) => handleEdit(e, UserStatisticsId, userStatisticsInfo.sports_code)}
                            startIcon={<EditIcon />}
                        >
                            Edit Statistics
                        </Button>
                    </div>}



                    <Card className={classes.cardAlign}>
                        <Button className={classes.sportsCareerAlign} variant="contained" color="primary" startIcon={<AddCircleIcon />} onClick={() => addDialogCareer()} >Sports Career</Button>
                        <div style={{ display: "flex" }}>
                            <div className={classes.tableAlign}>
                                <TableContainer component={Paper}>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>From</TableCell>
                                                <TableCell>To</TableCell>
                                                <TableCell>URL</TableCell>
                                                <TableCell>Name</TableCell>
                                                <TableCell>Role</TableCell>
                                                <TableCell>Profile</TableCell>
                                                <TableCell align="right">Options</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>{sport_career?.length > 0 ?
                                            sport_career?.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell component="th" scope="row">
                                                        {row.from}
                                                    </TableCell>
                                                    <TableCell>{row.to}</TableCell>
                                                    <TableCell>{row.url}</TableCell>
                                                    <TableCell>{row.name}</TableCell>
                                                    <TableCell>{row.roles.join(",")}</TableCell>
                                                    <TableCell>{row.profiles.join(",")}</TableCell>
                                                    <TableCell align="right">
                                                        <Tooltip title="Edit" className={classes.iconSpace}>
                                                            <IconButton
                                                                aria-label="Edit"
                                                                size="small"
                                                                onClick={() => editDialogCareer(index, row)} key={index}
                                                            >
                                                                <EditIcon style={{ fontSize: "medium" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" >
                                                            <IconButton
                                                                aria-label="Delete"
                                                                size="small"
                                                                onClick={() => DeleteDialogCareer(index)} key={index}
                                                            >
                                                                <DeleteIcon style={{ fontSize: "medium" }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            )) : <div className={classes.center}>No Data Available</div>}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </div>
                        <ConfirmationDialog
                            open={openCareer}
                            handleClose={handleConfirmCloseCareer}
                            title="Delete Sports Career"
                            children="Are you sure want to delete this Career?"
                            handleConfirm={ConfirmCareerDelete}
                        />
                    </Card>

                    <div style={{ display: "flex" }}>
                        <Button
                            style={{ marginRight: 20 }}
                            className={classes.button}
                            color="primary"
                            onClick={(e) => handleUpdate(e, UserId)}
                            startIcon={<SaveIcon />}
                        >
                            Update
                        </Button>

                        <Button
                            className={classes.button}
                            onClick={(e) => handleCancel(e, UserId)}
                            startIcon={<CancelIcon />}
                        >
                            Cancel
                        </Button>
                    </div>
                    {error && <ErrorLabel>Unable to edit User Statistics - {error}</ErrorLabel>}
                </div>
            </PageContainer>
            <Snackbar open={snackOpen}
                autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
                <MuiAlert elevation={6} onClose={() => setSnackOpen(false)} variant='filled' severity={snackError}>
                    {snackMsg}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default UserStatisticsEdit;