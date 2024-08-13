import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import Box from "@material-ui/core/Box";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import LinkButton from "../../../common/ui/components/LinkButton";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";

/* Add Sports Category Function for Add and Update Sports Category*/

const AddSportsCategory = (props) => {
  const { modelSend, sportsCategorySave, flag, setShowModalCategory } = props;
  const [open, setOpen] = useState(flag);
  let sports_category = props.sports_category;
  let currentIndex = props.indexValue;
  let rowSend = props.rowSend;
  const [mode] = useState(modelSend);
  const handleClose = () => {
    setOpen(false);
    setShowModalCategory(false);
  };

  let defaultCategory = {
    category_code: "",
    category_name: "",
    gender: "NA",
    type: "Individual",
  };

  const [sportsCategory, setSportsCategory] = useState(
    modelSend === "edit" ? rowSend : defaultCategory
  );
  const { category_code, category_name, gender, type } = sportsCategory;

  const handleChangeCategory = (e) => {
    if (e.target.name === "category_code") {
      setSportsCategory({
        ...sportsCategory,
        [e.target.name]: e.target.value.toUpperCase(),
      });
    } else {
      setSportsCategory({ ...sportsCategory, [e.target.name]: e.target.value });
    }
  };

  const [dialogErrors, setDialogErrors] = useState({});

  /* For Save and Update Sports Category With Validation */

  const handleCategorySave = async (e) => {
    e.preventDefault();
    setDialogErrors({});
    const scheme = yup.object().shape({
      category_code: yup
        .string()
        .typeError("Please enter category code")
        .min(3, "Minimum of 3 character")
        .max(6, "Maximum of 6 characters")
        .test(
          "category_code",
          "Category Code is already present! ",
          function (category_code) {
            let category_codeCheck = sports_category.filter((code) => {
              return code.category_code === category_code;
            });
            var category_codeIndexCheck = -1;
            if (category_codeCheck.length > 0) {
              category_codeIndexCheck = sports_category.indexOf(
                category_codeCheck[0]
              );
            }
            if (
              category_codeCheck.length > 0 &&
              currentIndex !== category_codeIndexCheck
            ) {
              return this.createError({
                message: "Category code is already present! ",
              });
            } else {
              return true;
            }
          }
        )
        .required("Please enter category code"),

      category_name: yup
        .string()
        .typeError("Please enter category name")
        .required("Please enter category name"),

      gender: yup
        .string()
        .typeError("Please enter gender")
        .required("Please enter gender"),
    });

    await scheme
      .validate(sportsCategory, { abortEarly: false })

      .then(() => {
        sportsCategorySave(sportsCategory, mode);
        setShowModalCategory(false);
        handleClose();
      })
      .catch((e) => {
        let errorObj = {};
        if (e?.inner !== undefined)
          e.inner.map((error) => {
            return (errorObj[error.path] = error.message);
          });
        setDialogErrors({
          ...errorObj,
        });
      });
  };

  return (
    <Dialog
      disableEscapeKeyDown
      disableBackdropClick
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-lookup"
      maxWidth={"sm"}
    >
      <DialogTitle id="form-dialog-lookup">
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            {" "}
            {modelSend === "Add"
              ? "Add Sports Category"
              : "Edit Sports Category"}
          </Box>
          <Box>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <TextField
          required
          margin="dense"
          type="text"
          name="category_code"
          value={category_code.toUpperCase() || ""}
          onChange={(e) => handleChangeCategory(e)}
          label="Category Code"
          fullWidth
          inputProps={{ maxLength: 6 }}
          error={Boolean(dialogErrors.category_code)}
          helperText={dialogErrors.category_code}
        />

        <TextField
          required
          margin="dense"
          type="text"
          name="category_name"
          value={category_name || ""}
          onChange={(e) => handleChangeCategory(e)}
          label="Category Name"
          fullWidth
          error={Boolean(dialogErrors.category_name)}
          helperText={dialogErrors.category_name}
        />

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="genderId">Gender</InputLabel>
            <Select
              required
              labelId="genderId"
              id="genderId"
              value={
                gender === "F"
                  ? "F"
                  : gender === "M"
                  ? "M"
                  : gender === "Others"
                  ? "Others"
                  : "NA"
              }
              name="gender"
              label="Gender"
              inputlabelprops={{ shrink: true }}
              onChange={(e) => handleChangeCategory(e)}
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
              <MenuItem value="NA">Open For All</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="typeId">Type</InputLabel>
            <Select
              required
              labelId="typeId"
              id="typeId"
              value={
                type === "Team"
                  ? "Team"
                  : type === "Doubles"
                  ? "Doubles"
                  : "Individual"
              }
              name="type"
              label="Type"
              inputlabelprops={{ shrink: true }}
              onChange={(e) => handleChangeCategory(e)}
            >
              <MenuItem value="Team">Team</MenuItem>
              <MenuItem value="Individual">Individual</MenuItem>
              <MenuItem value="Doubles">Doubles</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <LinkButton
          cursor="pointer"
          color="primary"
          variant="contained"
          onClick={(e) => handleCategorySave(e)}
        >
          {modelSend === "Add" ? "Save" : "Update"}
        </LinkButton>

        <LinkButton cursor="pointer" onClick={handleClose} variant="contained">
          Cancel
        </LinkButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddSportsCategory;
