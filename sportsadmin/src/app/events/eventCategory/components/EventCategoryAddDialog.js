// import React, { useState, useEffect } from "react";
// import Dialog from "@material-ui/core/Dialog";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
// import DialogActions from "@material-ui/core/DialogActions";
// import TextField from "@material-ui/core/TextField";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";

// import PropTypes from "prop-types";

// import MasterData from "../../../../utils/masterdata";
// //import MasterService from "../../../service/MasterService";
// //import classes from "../master.module.css";

// import useHttp from "../../../../hooks/useHttp";
// import EventCategoryConfig from "../config/EventCategoryConfig";

// const EventCategoryAddDialog = (props) => {
//   const { open, close, postSave, EventCategoryAddDialog, labels, mode, editItem } = props;
//   const [eventCategoryKey, seteventCategoryKey] = useState("");
//   const [eventCategoryValue, seteventCategoryValue] = useState("");
//   const [eventCategoryError, seteventCategoryError] = useState("");
//   const [eventCategoryError, seteventCategoryError] = useState("");
// //   const [errorWarning, setErrorWarning] = useState("");
//   //const [isSaving, setIsSaving] = useState(false);

//   const { isSaving, saveError, sendRequest } = useHttp();

//   useEffect(() => {
//     setEventCategory(mode === MasterData.pageMode.Edit ? editItem.EventCategoryKey : "");
//     setEventCategoryValue(
//       mode === MasterData.pageMode.Edit ? editItem.EventCategoryValue : ""
//     );
//     setEventCategoryError("");
//     setEventCategoryError("");
//     setErrorWarning("");
//     //setIsSaving(false);
//   }, [props]);

//   // Verify if all necessary fields are entered before form submission
//   const isRequiredFieldsAvailable = () => {
//     let submitForm = true;
//     let keyError = "";
//     let valueError = "";

//     keyError =
//       EventCategory.trim().length === 0 ? "Please enter " + props.labels.key : "";
//     EventCategoryError(keyError);

//     valueError =
//       EventCategory.trim().length === 0
//         ? "Please enter " + props.labels.value
//         : "";
//     EventCategoryError(valueError);

//     submitForm = keyError.length > 0 || valueError > 0 ? false : true;
//     setErrorWarning(submitForm ? "" : "Highlighted fields must be corrected.");

//     return submitForm;
//   };

//   const submitForm = (e) => {
//     e.preventDefault();

//     if (!isRequiredFieldsAvailable()) {
//       return;
//     }

//     //disable the submit button
//     //setIsSaving(true);

//     const submitState = {
//       EventCategoryKey: EventCategoryKey,
//       EventCategoryType: EventCategoryType,
//       EventCategoryValue: EventCategoryValue,
//     };

//     console.log(submitState);

//     const config = EventCategoryConfig.addNewEventCategoryValue(submitState);

//     const transformData = (data) => {
//       postSave({ EventCategoryType: EventCategoryType, EventCategoryKey: EventCategoryKey });
//     };

//     sendRequest(config, transformData);

//     /* if (mode === MasterData.pageMode.Edit) {
//       MasterService.updateEventCategoryValue(submitState)
//         .then((response) => {
//           postSave({ EventCategoryType: EventCategoryType, EventCategoryKey: EventCategoryKey });
//         })
//         .catch((response) => {
//           console.log(response);
//         })
//         .finally(() => {
//           setIsSaving(false);
//         });
//     } else {
//       MasterService.addEventCategoryValue(submitState)
//         .then((response) => {
//           postSave({ EventCategoryType: EventCategoryType, EventCategoryKey: EventCategoryKey });
//         })
//         .catch((response) => {
//           console.log(response);
//           setErrorWarning(props.labels.key + " already exists!!!");
//         })
//         .finally(() => {
//           setIsSaving(false);
//         });
//     } */
//   };

//   return (
//     <form noValidate>
//       <Dialog
//         open={open}
//         onClose={close}
//         aria-labelledby="form-dialog-lookup"
//         maxWidth={"lg"}
//       >
//         <DialogTitle id="form-dialog-lookup">
//           {mode === MasterData.pageMode.Edit ? "Edit list item" : labels.title}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             {mode === MasterData.pageMode.Edit ? "" : labels.contentText}
//             {errorWarning.length > 0 ? (
//               <Typography variant="subtitle1" gutterBottom>
//                 {/*  <span className={`${classes.LeftMargin5} ${classes.ErrorText}`}>
//                   {errorWarning}
//                 </span> */}
//               </Typography>
//             ) : (
//               ""
//             )}
//           </DialogContentText>
//           <TextField
//             autoFocus
//             required
//             margin="dense"
//             id="EventCategory"
//             name="EventCategory"
//             label={labels.key}
//             type="text"
//             value={EventCategory}
//             onChange={(e) => {
//               setEventCategoryy(e.target.value);
//             }}
//             inputProps={{ maxLength: 3 }}
//             fullWidth
//             error={EventCategoryError.length > 0 ? true : false}
//             helperText={lookupKeyError}
//             disabled={mode === MasterData.pageMode.Edit ? true : false}
//           />
//           <TextField
//             required
//             margin="dense"
//             id="EventCategoryValue"
//             name="EventCategoryValue"
//             label={labels.value}
//             type="text"
//             value={EventCategoryValue}
//             onChange={(e) => {
//               setEventCategoryValue(e.target.value);
//             }}
//             fullWidth
//             inputProps={{ maxLength: 255 }}
//             error={EventCategoryValueError.length > 0 ? true : false}
//             helperText={EventCategoryValueError}
//           />
//           {isSaving ? (
//             <Typography variant="body2" gutterBottom>
//               <span style={{ color: "green" }}>Saving...</span>
//             </Typography>
//           ) : (
//             ""
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button
//             onClick={close}
//             color="primary"
//             disabled={isSaving ? true : false}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={submitForm}
//             color="primary"
//             disabled={isSaving ? true : false}
//           >
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </form>
//   );
// };

// EventCategoryAddDialog.propTypes = {
//   open: PropTypes.bool.isRequired,
//   close: PropTypes.func.isRequired,
//   postSave: PropTypes.func.isRequired,
//   EventCategoryType: PropTypes.string.isRequired,
//   companyId: PropTypes.number.isRequired,
//   labels: PropTypes.object,
//   mode: PropTypes.string,
//   editItem: PropTypes.object,
// };

// EventCategoryAddDialog.defaultProps = {
//   labels: {
//     title: "Add EventCategory item",
//     contentText: "Add new EventCategory to list",
//     key: "Key (max 5 chars)",
//     value: "Value",
//   },
//   mode: "ADD",
// };

// export default EventCategoryAddDialog;
