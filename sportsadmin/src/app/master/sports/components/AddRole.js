import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import Box from '@material-ui/core/Box';
import LinkButton from "../../../common/ui/components/LinkButton"
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";

/* Add Sports Category Function for Add and Update Sports Category*/

const AddRole = (props) => {
    const { modelSend, sportsAddRoleSave, flag, setShowModalAge } = props
    let sports_role = props.sports_add_role;
    const [open, setOpen] = useState(flag);
    let currentIndex = props.indexValue;
    let rowSend = props.rowSend;
    const [mode] = useState(modelSend);
    const handleClose = () => {
        setOpen(false);
        setShowModalAge(false)
    };

    let defaultRole = {
        role_code: "",
        role_name: "",
        role_desc: "",
    }

    const [sportRole, setsportRole] = useState(modelSend === "edit" ? rowSend : defaultRole)
    const { role_code, role_name, role_desc } = (sportRole)
    const [dialogErrors, setDialogErrors] = useState({});

    const handleChangeRole = (e) => {
        if (e.target.name === "role_code") {
            setsportRole({ ...sportRole, [e.target.name]: e.target.value.toUpperCase() })
        }
        else {
            setsportRole({ ...sportRole, [e.target.name]: e.target.value })
        }
    }


    /* For Save and Update Sports Category With Validation */

    const handleAddRoleSave = async (e) => {
        e.preventDefault();
        setDialogErrors({});
        const scheme = yup.object().shape(
            {
                role_code: yup
                    .string()
                    .typeError("Please enter role code")
                    .min(3, "Minimum of 3 character")
                    .max(6, "Maximum of 6 characters")
                    .test('role_code', 'Role Code is already present! ', function (role_code) {
                        let role_codeCheck = sports_role.filter((code) => {
                            return code.role_code === role_code;
                        });
                        var role_codeIndexCheck = -1;
                        if (role_codeCheck.length > 0) {
                            role_codeIndexCheck = sports_role.indexOf(role_codeCheck[0]);
                        }
                        if (role_codeCheck.length > 0 && currentIndex !== role_codeIndexCheck) {
                            return this.createError({ message: 'Role code is already present! ' });
                        }
                        else {
                            return true;
                        }
                    })
                    .required("Please enter role code"),

                role_name: yup
                    .string()
                    .typeError("Please enter role name")
                    .required("Please enter role name"),
            }
        );

        await scheme
            .validate(sportRole, { abortEarly: false })
            .then(() => {
                sportsAddRoleSave(sportRole, mode);
                setShowModalAge(false)
                handleClose();
            })
            .catch((e) => {
                let errorObj = {};
                if (e?.inner !== undefined)
                    e.inner.map((error) => {
                        return (
                            errorObj[error.path] = error.message
                        )
                    });
                setDialogErrors({
                    ...errorObj,
                });
            });
    }



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
                    <Box flexGrow={1} > {modelSend === "Add" ? "Add Sports Role" : "Edit Sports Role"}</Box>
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
                    name="role_code"
                    value={role_code.toUpperCase() || ""}
                    onChange={e => handleChangeRole(e)}
                    label="Role Code"
                    fullWidth
                    inputProps={{ maxLength: 6 }}
                    error={Boolean(dialogErrors.role_code)}
                    helperText={dialogErrors.role_code}

                />

                <TextField
                    required
                    margin="dense"
                    type="text"
                    name="role_name"
                    value={role_name || ""}
                    onChange={e => handleChangeRole(e)}
                    label="Role Name"
                    fullWidth
                    error={Boolean(dialogErrors.role_name)}
                    helperText={dialogErrors.role_name}

                />

                <TextField
                    margin="dense"
                    type="text"
                    name="role_desc"
                    value={role_desc || ""}
                    onChange={e => handleChangeRole(e)}
                    label="Role Description"
                    fullWidth
                    error={Boolean(dialogErrors.role_desc)}
                    helperText={dialogErrors.role_desc}

                />

            </DialogContent>


            <DialogActions>
                <LinkButton
                    cursor="pointer"
                    color="primary"
                    variant="contained"
                    onClick={(e) => handleAddRoleSave(e)}
                >
                    {modelSend === "Add" ? "Save" : "Update"}
                </LinkButton>

                <LinkButton
                    cursor="pointer"
                    onClick={handleClose}
                    variant="contained"
                >
                    Cancel
                </LinkButton>
            </DialogActions>
        </Dialog>

    )
}

export default AddRole;