import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../../../common/ui/components/Button";
import useHttp from "../../../../hooks/useHttp";
import ErrorLabel from "../../../common/ui/components/ErrorLabel";
import * as yup from "yup";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import SportsConfig from "../config/SportsConfig";
import AddAgeGroup from "./AddAgeGroup";
import AddFormat from "./AddFormat";
import AddProfile from "./AddProfile";
import AddSportsCategory from "./AddSportsCategory";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Paper from "@material-ui/core/Paper";
import InputField from "../../../common/ui/components/InputField";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons//Cancel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AddRole from "./AddRole";
import ConfirmationDialog from "../../../common/ui/components/ConfirmDialog";
import { Card } from "@material-ui/core";
import { FormGroup, FormControlLabel, FormControl } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "30px",
  },
  button: {
    alignSelf: "flex-start",
  },
  buttonAlign: {
    paddingLeft: "1%",
  },
  mousePointerCategory: {
    cursor: "pointer",
    marginTop: "20px",
    marginLeft: "700px",
  },
  mousePointerAge: {
    cursor: "pointer",
    marginTop: "20px",
    marginLeft: "740px",
  },
  mousePointerFormat: {
    cursor: "pointer",
    marginTop: "20px",
    marginLeft: "710px",
  },
  totalAlign: {
    paddingBottom: "10%",
    paddingLeft: "10%",
  },
  DescField: {
    width: "35vw",
    marginBottom: "9px",
    marginTop: "20px",
  },
  textBoxSpacing: {
    maxWidth: "35vw",
    padding: "10px",
    margin: "4px",
  },
  tableAlign: {
    width: "90%",
    paddingBottom: "20px",
    margin: "10px",
  },
  DescInput: {
    height: "100px",
    textAlign: "Top",
  },
  center: {
    paddingLeft: "20px",
  },

  textBoxSpacingName: {
    width: "250px",
    marginBottom: "19px",
  },
  sportsBrand: {
    width: "254px",
    height: "40px",
  },
  sportsCategory: {
    margin: "10px",
    marginLeft: "5px",
    fontSize: "13px",
  },
  field: {
    paddingBottom: "30px",
    marginTop: "0px",
  },
  cardAlign: {
    marginBottom: "20px",
    backgroundColor: "#F5F5F5",
  },
}));

/*  Sport Function For Adding and Updating Sports */

const Sport = (props) => {
  let history = useHistory();
  const classes = useStyles();

  let defaultSportsDetails = {
    sports_name: "",
    sports_desc: "",
    sports_code: "",
    sports_format: [],
    sports_category: [],
    sports_age_group: [],
    // sports_brand: [],
    sports_profile: [],
    sports_role: [],
    is_stats_enabled: true,
  };

  const { data, action } = props;
  const [sportsInfo, setSportsInfo] = useState(defaultSportsDetails);
  const {
    sports_id,
    sports_format,
    sports_category,
    sports_age_group,
    sports_profile,
    sports_role,
  } = sportsInfo;
  const [, setDisplaytable] = useState(false);
  const [showModalAge, setShowModalAge] = useState(false);
  const [showModalFormat, setShowModalFormat] = useState(false);
  const [showModalCategory, setShowModalCategory] = useState(false);
  const [showModalProfile, setShowModalProfile] = useState(false);
  const [showModalRole, setShowModalRole] = useState(false);
  const { error, sendRequest } = useHttp();
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackError, setSnackError] = useState("success");
  const [errors, setErrors] = useState({});
  const [mode, setmode] = useState("Add");
  const [rowValue, setRowValue] = useState({});
  const [currentIndex, setIndex] = useState(-1);
  // const [brandCompany, setBrandCompany] = useState(sports_brand);
  const [, setClear] = useState({});
  const [rowIndex, setRowIndex] = useState(-1);
  const [openFormat, setOpenFormat] = useState(false);
  const [openAge, setOpenAge] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  let ageGroupKey = "sports_age_group";
  let formatKey = "sports_format";
  let categoryKey = "sports_category";
  let roleKey = "sports_role";
  // let brandKey = "sports_brand";
  let profileKey = "sports_profile";

  useEffect(() => {
    setSportsInfo(data);
    return () => {
      setClear({});
    };
  }, [data]);

  const handleChange = (e) => {
    setSportsInfo({
      ...sportsInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleStats = (e) => {
    setSportsInfo({
      ...sportsInfo,
      [e.target.name]: e.target.checked,
    });
  };
  /*  Save and Update Sports with Validation */

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    const scheme = yup.object().shape({
      sports_name: yup
        .string()
        .typeError("Please enter  Sports Name")
        .min(1, "Minimum of 1 character")
        .max(20, "Maximum of 20 characters")
        .test(
          "sports_name",
          "Sports Name is already present ",
          async function (sports_name) {
            try {
              let checkSportsName = await validateSportsName(sports_name);
              if (checkSportsName) {
                return this.createError({
                  message: "Sports Name is already present",
                });
              }
              return true;
            } catch (e) {
              return false;
            }
          }
        )
        .required("Please enter Sports Name"),
      sports_code: yup
        .string()
        .typeError("Please enter sports Code")
        .required("Please enter  sports Code")
        .min(6, "sports code Minimum of 6 character")
        .max(10, "sports code Maximum of 10 character"),
    });

    await scheme
      .validate(sportsInfo, { abortEarly: false })
      .then(() => {
        if (sports_category?.length === 0) {
          setSnackError("warning");
          setSnackMsg("Please Add Sports Category");
          setSnackOpen(true);
          return false;
        }

        if (sports_age_group?.length === 0) {
          setSnackError("warning");
          setSnackMsg("Please Add Sports Age Group");
          setSnackOpen(true);
          return false;
        }

        if (sports_format?.length === 0) {
          setSnackError("warning");
          setSnackMsg("Please Add Sports Format");
          setSnackOpen(true);
          return false;
        }

        if (sports_profile?.length === 0) {
          setSnackError("warning");
          setSnackMsg("Please Add Sports Profile");
          setSnackOpen(true);
          return false;
        }

        if (sports_role?.length === 0) {
          setSnackError("warning");
          setSnackMsg("Please Add Sports Role");
          setSnackOpen(true);
          return false;
        }

        if (props.action === "Add") {
          const sportsConfig = SportsConfig.addSports(sportsInfo);
          const transformData = (data) => {
            setSportsInfo(data);
            setSnackError("success");
            setSnackMsg("Sports Added Successfully");
            setSnackOpen(true);
            history.push(`/masters/sports`);
          };
          sendRequest(sportsConfig, transformData);
          return () => {
            setClear({});
          };
        }

        if (props.action === "Edit") {
          const sportsConfig = SportsConfig.EditSports(sportsInfo);
          const transformData = (data) => {
            setSportsInfo(data);
            updateMessage();
            history.push(`/masters/sports`);
          };
          sendRequest(sportsConfig, transformData);
          return () => {
            setClear({});
          };
        }
      })

      .catch((e) => {
        let errorObj = {};
        e.inner.map((error) => {
          return (errorObj[error.path] = error.message);
        });
        setErrors({
          ...errorObj,
        });
      });
  };

  /* For Validating Sports Name Duplicate Entry Occurance */

  const validateSportsName = async (sports_name) => {
    let flag = false;
    if (sports_name !== "") {
      const config = SportsConfig.getSportsByName(sports_name);
      const transformNameData = (data) => {
        if (
          data.data?.sports_id !== Number(sports_id) &&
          data.data?.sports_id !== undefined
        ) {
          flag = true;
        } else {
          flag = false;
        }
      };
      await sendRequest(config, transformNameData);
      return flag;
    }
  };

  const updateMessage = () => {
    setSnackError("success");
    setSnackMsg("Sports Updated Successfully");
    setSnackOpen(true);
  };

  /* For Cancel Button and Back Icon ,Navigation to the Sports Screen */

  const handleCancel = async (e) => {
    history.push(`/masters/sports`);
  };

  function arrayDelete(array, n) {
    if (n > -1) {
      array.splice(n, 1);
    }
    return array;
  }

  /* For Sports Age Group Add,Edit,Delete */

  /* Sports Age Group Add */

  function addDialogAge() {
    setIndex(-1);
    setShowModalAge(true);
    setmode("Add");
  }

  /* Sports Age Group Edit */

  function editDialogAge(index, row) {
    setRowValue(sports_age_group[index]);
    setIndex(index);
    setmode("edit");
    setShowModalAge(true);
  }

  /* Sports Age Group Delete */

  const handleConfirmOpenAge = () => {
    setOpenAge(true);
  };

  const handleConfirmCloseAge = () => {
    setOpenAge(false);
  };

  const DeleteDialogAgeGroup = (index) => {
    handleConfirmOpenAge();
    setRowIndex(index);
  };

  const ConfirmAgeDelete = () => {
    let arrayAgeGroup = [...sports_age_group];
    let sendData = arrayDelete(arrayAgeGroup, rowIndex);
    setSportsInfo({ ...sportsInfo, [ageGroupKey]: sendData });
    setSnackMsg("Deleted Successfully");
    setSnackOpen(true);
    handleConfirmCloseAge(true);
  };

  /* For Sports Format Add,Edit,Delete */

  /* Sports Format Add */

  function addDialogFormat() {
    setIndex(-1);
    setShowModalFormat(true);
    setmode("Add");
  }

  /* Sports Format Edit */

  function editDialogFormat(index, row) {
    setRowValue(sports_format[index]);
    setIndex(index);
    setmode("edit");
    setShowModalFormat(true);
  }

  /* Sports Format Delete */

  const handleConfirmOpenFormat = () => {
    setOpenFormat(true);
  };

  const handleConfirmCloseFormat = () => {
    setOpenFormat(false);
  };

  const DeleteSportsFormatTable = (index) => {
    handleConfirmOpenFormat();
    setRowIndex(index);
  };

  const ConfirmFormatDelete = () => {
    let arrayFormat = [...sports_format];
    let sendData = arrayDelete(arrayFormat, rowIndex);
    setSportsInfo({ ...sportsInfo, [formatKey]: sendData });
    setSnackMsg("Deleted Successfully");
    setSnackOpen(true);
    handleConfirmCloseFormat(true);
  };

  /* For Sports Category Add,Edit,Delete */

  /* Sports Category Add */

  function addDialogCategory() {
    setIndex(-1);
    setShowModalCategory(true);
    setmode("Add");
  }

  /*  Sports Category Edit */

  function editDialogCategory(index, row) {
    setRowValue(sports_category[index]);
    setIndex(index);
    setmode("edit");
    setShowModalCategory(true);
  }

  /*   Sports Category Delete */

  const handleConfirmOpenCategory = () => {
    setOpenCategory(true);
  };

  const handleConfirmCloseCategory = () => {
    setOpenCategory(false);
  };

  const DeleteDialogCategory = (index) => {
    handleConfirmOpenCategory();
    setRowIndex(index);
  };

  const ConfirmCategoryDelete = () => {
    let arrayCategory = [...sports_category];
    let sendData = arrayDelete(arrayCategory, rowIndex);
    setSportsInfo({ ...sportsInfo, [categoryKey]: sendData });
    setSnackMsg("Deleted Successfully");
    setSnackOpen(true);
    handleConfirmCloseCategory(true);
  };

  /* For Sports Role Add,Edit,Delete */

  /* Add Role */

  function addRole() {
    setIndex(-1);
    setShowModalRole(true);
    setmode("Add");
  }

  /* Edit Role */

  function editDialogRole(index, row) {
    setRowValue(sports_role[index]);
    setIndex(index);
    setmode("edit");
    setShowModalRole(true);
  }

  /* Delete Role */

  const handleConfirmOpenRole = () => {
    setOpenRole(true);
  };

  const handleConfirmCloseRole = () => {
    setOpenRole(false);
  };

  const DeleteDialogRole = (index) => {
    handleConfirmOpenRole();
    setRowIndex(index);
  };

  const ConfirmRoleDelete = () => {
    let arrayRole = [...sports_role];
    let sendData = arrayDelete(arrayRole, rowIndex);
    setSportsInfo({ ...sportsInfo, [roleKey]: sendData });
    setSnackMsg("Deleted Successfully");
    setSnackOpen(true);
    handleConfirmCloseRole(true);
  };

  /* For Sports Profile Add,Edit,Delete */

  /* Sports Profile Add */

  function addDialogProfile() {
    setIndex(-1);
    setShowModalProfile(true);
    setmode("Add");
  }

  /* Sports Profile Edit */

  function editDialogProfile(index, row) {
    setRowValue(sports_profile[index]);
    setIndex(index);
    setmode("edit");
    setShowModalProfile(true);
  }

  /* Sports Profile Delete */

  const handleConfirmOpenProfile = () => {
    setOpenProfile(true);
  };

  const handleConfirmCloseProfile = () => {
    setOpenProfile(false);
  };

  const DeleteDialogProfile = (index) => {
    handleConfirmOpenProfile();
    setRowIndex(index);
  };

  const ConfirmProfileDelete = () => {
    let arrayProfile = [...sports_profile];
    let sendData = arrayDelete(arrayProfile, rowIndex);
    setSportsInfo({ ...sportsInfo, [profileKey]: sendData });
    setSnackMsg("Deleted Successfully");
    setSnackOpen(true);
    handleConfirmCloseProfile(true);
  };

  /* Sports Age Group */

  function sendSportsAgeGroupProps(state, mode) {
    if (state != null) {
      if (mode === "edit") {
        sports_age_group[currentIndex] = state;
        setSportsInfo({ ...sportsInfo, [ageGroupKey]: [...sports_age_group] });
        setDisplaytable(true);
      } else {
        setSportsInfo({
          ...sportsInfo,
          [ageGroupKey]: [...sports_age_group, state],
        });
        setDisplaytable(true);
      }
    }
    return;
  }

  /* Sports Format */

  function sendSportsFormatProps(format, format_mode) {
    if (format != null) {
      if (format_mode === "edit") {
        sports_format[currentIndex] = format;
        setSportsInfo({ ...sportsInfo, [formatKey]: [...sports_format] });
        setDisplaytable(true);
      } else {
        setSportsInfo({
          ...sportsInfo,
          [formatKey]: [...sports_format, format],
        });
        setDisplaytable(true);
      }
    }
    return;
  }

  /* Sports Category */

  function sendSportsCategoryProps(category, category_mode) {
    if (category != null) {
      if (category_mode === "edit") {
        sports_category[currentIndex] = category;
        setSportsInfo({ ...sportsInfo, [categoryKey]: [...sports_category] });
        setDisplaytable(true);
      } else {
        setSportsInfo({
          ...sportsInfo,
          [categoryKey]: [...sports_category, category],
        });
        setDisplaytable(true);
      }
    }
    return;
  }

  /* Sports Profile */

  function sendSportsProfileProps(profile, profile_mode) {
    if (profile != null) {
      if (profile_mode === "edit") {
        sports_profile[currentIndex] = profile;
        setSportsInfo({ ...sportsInfo, [profileKey]: [...sports_profile] });
        setDisplaytable(true);
      } else {
        setSportsInfo({
          ...sportsInfo,
          [profileKey]: [...sports_profile, profile],
        });
        setDisplaytable(true);
      }
    }
  }

  /* Sports Role */

  function sendSportsAddRoleProps(role, role_mode) {
    if (role != null) {
      if (role_mode === "edit") {
        sports_role[currentIndex] = role;
        setSportsInfo({ ...sportsInfo, [roleKey]: [...sports_role] });
        setDisplaytable(true);
      } else {
        setSportsInfo({ ...sportsInfo, [roleKey]: [...sports_role, role] });
        setDisplaytable(true);
      }
    }
    return;
  }

  /* For Sports Brand, Get All Brand Company Type */

  /* useEffect(() => {
        if (sports_brand != null) {
            const brandConfig = SportsConfig.getCompanyByType(sports_brand);
            const transformBrandData = (data) => {
                setBrandCompany(data.data);
            };
            sendRequest(brandConfig, transformBrandData);
            return () => {
                setClear({});
            };
        }
    }, [sendRequest, sports_brand]); */

  /* For Sports Brand */

  /*  const onChangeBrandValue = (e) => {
         let array = [];
         array = [...array, ...e.target.value]
         setSportsInfo({ ...sportsInfo, [brandKey]: array });
     }; */

  return (
    <>
      <div className={classes.root}>
        {showModalAge && (
          <AddAgeGroup
            sports_age_group={sports_age_group}
            flag={showModalAge}
            ageGroupSave={sendSportsAgeGroupProps}
            setShowModalAge={setShowModalAge}
            indexValue={currentIndex}
            rowSend={rowValue}
            modelMode={mode}
            modelSend={mode}
          />
        )}
        {showModalFormat && (
          <AddFormat
            sports_format={sports_format}
            flag={showModalFormat}
            setShowModalFormat={setShowModalFormat}
            formatSave={sendSportsFormatProps}
            showModalFormat={setShowModalFormat}
            indexValue={currentIndex}
            rowSend={rowValue}
            modelMode={mode}
            modelSend={mode}
          />
        )}
        {showModalCategory && (
          <AddSportsCategory
            sports_category={sports_category}
            flag={showModalCategory}
            sportsCategorySave={sendSportsCategoryProps}
            setShowModalCategory={setShowModalCategory}
            indexValue={currentIndex}
            rowSend={rowValue}
            modelMode={mode}
            modelSend={mode}
          />
        )}
        {showModalProfile && (
          <AddProfile
            sports_profile={sports_profile}
            flag={showModalProfile}
            setShowModalProfile={setShowModalProfile}
            profileSave={sendSportsProfileProps}
            showModalProfile={setShowModalProfile}
            indexValue={currentIndex}
            rowSend={rowValue}
            modelMode={mode}
            modelSend={mode}
          />
        )}
        {showModalRole && (
          <AddRole
            sports_add_role={sports_role}
            flag={showModalRole}
            sportsAddRoleSave={sendSportsAddRoleProps}
            setShowModalAge={setShowModalRole}
            indexValue={currentIndex}
            rowSend={rowValue}
            modelMode={mode}
            modelSend={mode}
          />
        )}
        <div>
          <form>
            <div>
              <InputField
                className={classes.textBoxSpacingName}
                required
                size="small"
                type="text"
                variant="outlined"
                label="Sports Name"
                name="sports_name"
                value={sportsInfo?.sports_name || ""}
                onChange={handleChange}
                error={Boolean(errors.sports_name)}
                helperText={errors.sports_name}
              />
            </div>

            <div>
              <InputField
                className={classes.textBoxSpacingName}
                required
                size="small"
                type="text"
                variant="outlined"
                label="Sports Code"
                name="sports_code"
                value={sportsInfo?.sports_code || ""}
                onChange={handleChange}
                error={Boolean(errors.sports_code)}
                helperText={errors.sports_code}
              />
            </div>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
              <Typography>Statistics </Typography>
              <FormGroup>
                <div>
                  <FormControlLabel
                    label={
                      sportsInfo?.is_stats_enabled === true
                        ? "Enabled"
                        : "Disabled"
                    }
                    control={
                      <Checkbox
                        name="is_stats_enabled"
                        checked={
                          sportsInfo?.is_stats_enabled === true ? true : false
                        }
                        onChange={(e) => handleStats(e)}
                      />
                    }
                  />
                </div>
              </FormGroup>
            </FormControl>

            {/* <FormControl variant='outlined'  >
                            <InputLabel id="company_id">Sports Brand</InputLabel>
                            <Select
                                multiple={true}
                                className={classes.sportsBrand}
                                size="small"
                                variant="outlined"
                                label="CompanyId"
                                name="sports_brand"
                                value={sportsInfo?.sports_brand || ""}
                                onChange={onChangeBrandValue}
                            >
                                {brandCompany?.map((company) => (
                                    <MenuItem key={company.company_id} value={company.company_id}>
                                        {company.company_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}

            <div className={classes.field}>
              <InputField
                className={classes.DescField}
                size="small"
                variant="outlined"
                label="Sports Description"
                name="sports_desc"
                value={sportsInfo?.sports_desc || ""}
                onChange={handleChange}
                multiline={true}
                InputProps={{ classes: { input: classes.DescInput } }}
                rows={5}
                rowsMax={40}
                error={Boolean(errors.sports_desc)}
                helperText={errors.sports_desc}
              />
            </div>
          </form>
          <Card className={classes.cardAlign}>
            <Button
              className={classes.sportsCategory}
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => addDialogCategory()}
            >
              Sports Category
            </Button>
            <div style={{ display: "flex" }}>
              <div className={classes.tableAlign}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Category Code</TableCell>
                        <TableCell>Category Name</TableCell>
                        <TableCell>Gender</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell align="right">Options</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sports_category?.length > 0 ? (
                        sports_category?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {row.category_code}
                            </TableCell>
                            <TableCell>{row.category_name}</TableCell>
                            <TableCell>{row.gender}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell align="right">
                              <Tooltip
                                title="Edit"
                                className={classes.iconSpace}
                              >
                                <IconButton
                                  aria-label="Edit"
                                  size="small"
                                  onClick={() => editDialogCategory(index, row)}
                                  key={index}
                                >
                                  <EditIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  aria-label="Delete"
                                  size="small"
                                  onClick={() => DeleteDialogCategory(index)}
                                  key={index}
                                >
                                  <DeleteIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <div className={classes.center}>No Data Available</div>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <ConfirmationDialog
              open={openCategory}
              handleClose={handleConfirmCloseCategory}
              title="Delete Sports Category"
              children="Are you sure want to delete this Category?"
              handleConfirm={ConfirmCategoryDelete}
            />
          </Card>

          <Card className={classes.cardAlign}>
            <Button
              className={classes.sportsCategory}
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => addDialogAge()}
            >
              Age Group
            </Button>
            <div style={{ display: "flex" }}>
              <div className={classes.tableAlign}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Age Group Code</TableCell>
                        <TableCell>Age Group</TableCell>
                        <TableCell>Minimum Age</TableCell>
                        <TableCell>Maximum Age</TableCell>
                        <TableCell>Minimum Players</TableCell>
                        <TableCell>Maximum Players</TableCell>
                        <TableCell align="right">Options</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sports_age_group?.length > 0 ? (
                        sports_age_group?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {row.age_group_code}
                            </TableCell>
                            <TableCell>{row.age_group}</TableCell>
                            <TableCell>{row.min_age}</TableCell>
                            <TableCell>{row.max_age}</TableCell>
                            <TableCell>{row.min_players}</TableCell>
                            <TableCell>{row.max_players}</TableCell>
                            <TableCell align="right">
                              <Tooltip
                                title="Edit"
                                className={classes.iconSpace}
                              >
                                <IconButton
                                  aria-label="Edit"
                                  size="small"
                                  onClick={() => editDialogAge(index, row)}
                                  key={index}
                                >
                                  <EditIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  aria-label="Delete"
                                  size="small"
                                  onClick={() => DeleteDialogAgeGroup(index)}
                                  key={index}
                                >
                                  <DeleteIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <div className={classes.center}>No Data Available</div>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <ConfirmationDialog
              open={openAge}
              handleClose={handleConfirmCloseAge}
              title="Delete Sports Age Group"
              children="Are you sure want to delete this Age Group?"
              handleConfirm={ConfirmAgeDelete}
            />
          </Card>
          <Card className={classes.cardAlign}>
            <Button
              className={classes.sportsCategory}
              Sports
              Format
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => addDialogFormat()}
            >
              Sports Format
            </Button>
            <div style={{ display: "flex" }}>
              <div className={classes.tableAlign}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Format Code</TableCell>
                        <TableCell>Format Name</TableCell>
                        <TableCell align="right">Options</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sports_format?.length > 0 ? (
                        sports_format?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {row.format_code}
                            </TableCell>
                            <TableCell>{row.format_name}</TableCell>
                            <TableCell align="right">
                              <Tooltip
                                title="Edit"
                                className={classes.iconSpace}
                              >
                                <IconButton
                                  aria-label="Edit"
                                  size="small"
                                  onClick={() => editDialogFormat(index, row)}
                                  key={index}
                                >
                                  <EditIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  aria-label="Delete"
                                  size="small"
                                  onClick={() => DeleteSportsFormatTable(index)}
                                  key={index}
                                >
                                  <DeleteIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <div className={classes.center}>No Data Available</div>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <ConfirmationDialog
              open={openFormat}
              handleClose={handleConfirmCloseFormat}
              title="Delete Sports Format"
              children="Are you sure want to delete this Format?"
              handleConfirm={ConfirmFormatDelete}
            />
          </Card>
          <Card className={classes.cardAlign}>
            <Button
              className={classes.sportsCategory}
              Sports
              Format
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => addDialogProfile()}
            >
              Sports Profile
            </Button>
            <div style={{ display: "flex" }}>
              <div className={classes.tableAlign}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Profile Code</TableCell>
                        <TableCell>Profile Name</TableCell>
                        <TableCell>Profile Description</TableCell>
                        <TableCell align="right">Options</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sports_profile?.length > 0 ? (
                        sports_profile?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {row.profile_code}
                            </TableCell>
                            <TableCell>{row.profile_name}</TableCell>
                            <TableCell>{row.profile_description}</TableCell>
                            <TableCell align="right">
                              <Tooltip
                                title="Edit"
                                className={classes.iconSpace}
                              >
                                <IconButton
                                  aria-label="Edit"
                                  size="small"
                                  onClick={() => editDialogProfile(index, row)}
                                  key={index}
                                >
                                  <EditIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  aria-label="Delete"
                                  size="small"
                                  onClick={() => DeleteDialogProfile(index)}
                                  key={index}
                                >
                                  <DeleteIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <div className={classes.center}>No Data Available</div>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <ConfirmationDialog
              open={openProfile}
              handleClose={handleConfirmCloseProfile}
              title="Delete Sports Profile"
              children="Are you sure want to delete this Profile?"
              handleConfirm={ConfirmProfileDelete}
            />
          </Card>
          <Card className={classes.cardAlign}>
            <Button
              className={classes.sportsCategory}
              variant="contained"
              color="primary"
              startIcon={<AddCircleIcon />}
              onClick={() => addRole()}
            >
              Sports Role
            </Button>
            <div style={{ display: "flex" }}>
              <div className={classes.tableAlign}>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Role Code</TableCell>
                        <TableCell>Role Name</TableCell>
                        <TableCell>Role Description</TableCell>

                        <TableCell align="right">Options</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sports_role?.length > 0 ? (
                        sports_role?.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.role_code}</TableCell>
                            <TableCell component="th" scope="row">
                              {row.role_name}
                            </TableCell>
                            <TableCell>{row.role_desc}</TableCell>

                            <TableCell align="right">
                              <Tooltip
                                title="Edit"
                                className={classes.iconSpace}
                              >
                                <IconButton
                                  aria-label="Edit"
                                  size="small"
                                  onClick={() => editDialogRole(index, row)}
                                  key={index}
                                >
                                  <EditIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  aria-label="Delete"
                                  size="small"
                                  onClick={() => DeleteDialogRole(index)}
                                  key={index}
                                >
                                  <DeleteIcon style={{ fontSize: "medium" }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <div className={classes.center}>No Data Available</div>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
            <ConfirmationDialog
              open={openRole}
              handleClose={handleConfirmCloseRole}
              title="Delete Sports Role"
              children="Are you sure want to delete this Role?"
              handleConfirm={ConfirmRoleDelete}
            />
          </Card>
          <div className={classes.buttonAlign}>
            <Button
              style={{ marginRight: 20 }}
              className={classes.button}
              color="primary"
              onClick={(e) => handleSave(e)}
              startIcon={<SaveIcon />}
            >
              {action === "Add" ? "Save" : "Update"}
            </Button>
            <Button
              className={classes.button}
              onClick={handleCancel}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
          </div>

          {error && <ErrorLabel>Unable to Add Sports - {error}</ErrorLabel>}
        </div>
        <Snackbar
          open={snackOpen}
          autoHideDuration={3000}
          onClose={() => setSnackOpen(false)}
        >
          <MuiAlert
            elevation={6}
            onClose={() => setSnackOpen(false)}
            variant="filled"
            severity={snackError}
          >
            {snackMsg}
          </MuiAlert>
        </Snackbar>
      </div>
    </>
  );
};

export default Sport;
