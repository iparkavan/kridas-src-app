import React, { useEffect, useState } from "react";
import useHttp from "../../../hooks/useHttp";
import LookupTableConfig from "../../master/lookupTable/config/LookupTableConfig";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "../../common/ui/components/Button";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import * as yup from "yup";
import { FormHelperText, Box } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import ConfirmationDialog from "../../common/ui/components/ConfirmDialog";
import LinkButton from "../../common/ui/components/LinkButton";
import CloseIcon from "@material-ui/icons/Close";
import { Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  btn: {
    padding: "2--px",
    margin: "10px",
  },

  center: {
    padding: "8px",
  },

  padding: {
    padding: "10px",
  },

  tableAlign: {
    width: "95%",
    marginLeft: "20px",
  },

  buttonAlign: {
    marginRight: "3%",
    marginBottom: "15px",
    float: "right",
  },

  field: {
    width: "250px",
    margin: "5px",
  },

  iconAlign: {
    verticalAlign: "middle",
  },

  dividerAlign: {
    background: "none",
    borderTop: "1px dashed #C4C4C4",
  },
}));

const Social = (props) => {
  const classes = useStyles();
  const { setUserDetails, userDetails } = props;
  let { social } = props.userDetails;
  const { sendRequest: fetchLookupType } = useHttp();
  const [dialogopen, setDialogOpen] = React.useState(false);
  const [lookupType, setLookupType] = useState();
  let socialObj = { link: "", type: "", desc: "", index: "-1", mode: "Add" };
  const [socialLink, setSocialLink] = useState(socialObj);
  const [socialErrors, setSocialErrors] = useState({});
  const [, setClear] = useState({});
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("Deleted Successfully");
  const [open, setOpen] = useState(false);
  let socialDeclaration = "social";

  const [rowIndex, setRowIndex] = useState(-1);

  //FETCHING DATA BY METHOD
  useEffect(() => {
    const lookuptype = LookupTableConfig.getLookupTableByType("SOC");
    const transformLookupTableData = (data) => {
      setLookupType(data);
    };
    fetchLookupType(lookuptype, transformLookupTableData);
    return () => {
      setClear({});
    };
  }, [fetchLookupType]);

  //DIALOUGE BOX BUTTON
  const socialAdd = async (e) => {
    e.preventDefault();
    setSocialErrors({});
    const scheme = yup.object().shape({
      type: yup
        .string()
        .typeError("Please enter social type")
        .required("Social type is required")
        .test("type", "Social type is already present ", async function (type) {
          if (socialLink.mode === "Add") {
            if (social !== null) {
              let typeCheck = social.filter((sType) => {
                return sType.type === type;
              });
              let socialTypeIndex = -1;
              if (typeCheck.length > 0) {
                socialTypeIndex = social.indexOf(typeCheck[0]);
              }
              if (typeCheck.length > 0) {
                return this.createError({
                  message: "Social type is already present ",
                });
              } else {
                return true;
              }
            } else {
              return true;
            }
          } else {
            return true;
          }
        }),
      link: yup
        .string()
        .typeError("Please enter social link")
        .required("Social link is required"),
    });
    await scheme
      .validate(socialLink, { abortEarly: false })
      .then(() => {
        if (socialLink.mode === "Edit") {
          if (social === null) social = [];
          social[socialLink.index] = socialLink;
          let newArray = social.map(function (item) {
            delete item.mode;
            delete item.index;
            return item;
          });
          setUserDetails({ ...userDetails, [socialDeclaration]: newArray });
        } else {
          let obj = socialLink;
          delete obj.mode;
          delete obj.index;
          setUserDetails({
            ...userDetails,
            [socialDeclaration]: [...(social || []), obj],
          });
        }
        handleClose();
      })
      .catch((e) => {
        let errorObj = {};
        if (e?.inner !== undefined)
          e.inner.map((error) => {
            return (errorObj[error.path] = error.message);
          });
        setSocialErrors({
          ...errorObj,
        });
      });
  };

  //SOCIAL LINK TABLE BUTTONS
  function arrayDelete(array, n) {
    if (n > -1) {
      array.splice(n, 1);
    }
    return array;
  }

  const DeleteTable = (index) => {
    handleConfirmOpen();
    setRowIndex(index);
  };

  const ConfirmDelete = () => {
    let arraySocial = [...social];
    let sendData = arrayDelete(arraySocial, rowIndex);
    setUserDetails({ ...userDetails, [socialDeclaration]: sendData });
    setSnackMsg("deleted successfully");
    setSnackOpen(true);
    handleConfirmClose(true);
  };

  const editDialog = (index, row) => {
    row.mode = "Edit";
    row.index = index;
    handleOpen(true);
    setSocialLink({ ...socialLink, ...row });
  };

  //HANDLER
  const handleSocial = (e) => {
    setSocialLink({ ...socialLink, [e.target.name]: e.target.value });
  };

  //DialougeBox
  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSocialLink(socialObj);
  };

  //ConfirmBox
  const handleConfirmOpen = () => {
    setOpen(true);
  };

  const handleConfirmClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div>
        <Button
          className={classes.buttonAlign}
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<AddCircleIcon />}
          onClick={handleOpen}
        >
          {" "}
          Add{" "}
        </Button>
        <div className={classes.tableAlign}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Social Type</TableCell>
                  <TableCell>Social Link</TableCell>
                  <TableCell align="right">Options</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {social?.length > 0 ? (
                  social?.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell
                        className={classes.padding}
                        component="th"
                        scope="row"
                      >
                        {row.type}
                      </TableCell>
                      <TableCell className={classes.padding}>
                        {row.link}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit" className={classes.iconSpace}>
                          <IconButton
                            aria-label="Edit"
                            size="small"
                            onClick={() => editDialog(index, row)}
                            key={index}
                          >
                            <EditIcon style={{ fontSize: "medium" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            aria-label="Delete"
                            size="small"
                            onClick={() => DeleteTable(index)}
                            key={index}
                          >
                            <DeleteIcon style={{ fontSize: "medium" }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <div className={classes.center}>No Data available</div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      <Dialog
        disableEscapeKeyDown
        disableBackdropClick
        open={dialogopen}
        onClose={handleClose}
        aria-labelledby="form-dialog-lookup"
        maxWidth={"lg"}
      >
        <DialogTitle id="form-dialog-lookup">
          <Box display="flex" alignItems="center">
            <Box flexGrow={1}> Social Link</Box>
            <Box>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider className={classes.dividerAlign} />
        </DialogTitle>

        <DialogContent>
          <FormControl className={classes.field}>
            <InputLabel id="demo-simple-select-helper-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              required
              name="type"
              label="Social Type"
              rowsMax={4}
              multiline={true}
              value={socialLink?.type || ""}
              disabled={socialLink.mode === "Edit" ? true : false}
              inputlabelprops={{ shrink: true }}
              onChange={(e) => handleSocial(e)}
            >
              {lookupType?.map((type, index) => (
                <MenuItem value={type?.lookup_key} key={index}>
                  {type?.lookup_value}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText style={{ color: "red" }}>
              {" "}
              {Boolean(socialErrors.type)}
              {socialErrors.type}
            </FormHelperText>
          </FormControl>

          <div>
            <TextField
              className={classes.field}
              required
              id="outlined-name"
              variant="outlined"
              label="Social Link"
              name="link"
              rowsMax={4}
              multiline={true}
              value={socialLink?.link || ""}
              inputlabelprops={{ shrink: true }}
              onChange={(e) => handleSocial(e)}
              error={Boolean(socialErrors.link)}
              helperText={socialErrors.link}
            />
          </div>
        </DialogContent>

        <DialogActions>
          <LinkButton
            className={classes.btn}
            variant="contained"
            color="primary"
            type="button"
            onClick={(e) => socialAdd(e)}
          >
            {" "}
            {socialLink?.mode === "Edit" ? "Update" : "Add"}
          </LinkButton>

          <LinkButton
            cursor="pointer"
            onClick={handleClose}
            variant="contained"
          >
            {" "}
            Cancel
          </LinkButton>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={open}
        handleClose={handleConfirmClose}
        title="Delete Social"
        children="Are you want to delete this social?"
        handleConfirm={ConfirmDelete}
      />

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
      >
        <MuiAlert
          elevation={6}
          onClose={() => setSnackOpen(false)}
          variant="filled"
          severity="success"
        >
          {snackMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
};
export default Social;
