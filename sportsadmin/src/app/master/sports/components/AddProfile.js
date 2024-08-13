import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import LinkButton from "../../../common/ui/components/LinkButton";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import { Box } from "@material-ui/core";


/* Add Profile Function For Add and Edit Sports Profile */

const AddProfile = (props) => {
    const { modelSend, profileSave, flag, setShowModalProfile } = props
    let sports_profile = props.sports_profile;
    let currentIndex = props.indexValue;
    const [open, setOpen] = useState(flag);
    let rowSend = props.rowSend;
    const [mode] = useState(modelSend);
    const handleClose = () => {
        setOpen(false);
        setShowModalProfile(false)
    };
    let defaultProfile = {
        profile_code: "",
        profile_name: "",
        profile_description: "",
    }

    const [profile, setProfile] = useState(modelSend === "edit" ? rowSend : defaultProfile)
    const { profile_code, profile_name, profile_description } = (profile)
    const [dialogErrors, setDialogErrors] = useState({});

    const handleChangeProfile = (e) => {
        if (e.target.name === "profile_code") {
            setProfile({ ...profile, [e.target.name]: e.target.value.toUpperCase() })
        }
        else {
            setProfile({ ...profile, [e.target.name]: e.target.value })
        }
    }

    /* For Save and Update Sports Profile with Validation */

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setDialogErrors({});
        const scheme = yup.object().shape(
            {
                profile_code: yup
                    .string()
                    .typeError("Please enter profile code")
                    .min(3, "Minimum of 3 character")
                    .max(6, "Maximum of 6 characters")
                    .test('profile_code', 'Profile Code is already present! ', function (profile_code) {
                        let profile_codeCheck = sports_profile.filter((code) => {
                            return code.profile_code === profile_code;
                        });
                        var profile_codeIndexCheck = -1;
                        if (profile_codeCheck.length > 0) {
                            profile_codeIndexCheck = sports_profile.indexOf(profile_codeCheck[0]);
                        }
                        if (profile_codeCheck.length > 0 && currentIndex !== profile_codeIndexCheck) {
                            return this.createError({ message: 'Profile code is already present! ' });
                        }
                        else {
                            return true;
                        }
                    })
                    .required("Please enter Profile code "),

                profile_name: yup
                    .string()
                    .typeError("Please enter  Profile name")
                    .required("Please enter Profile name"),
            }
        );

        await scheme
            .validate(profile, { abortEarly: false })
            .then(() => {
                profileSave(profile, mode);
                setShowModalProfile(false)
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
                    <Box flexGrow={1} > {modelSend === "Add" ? "Add Sports Profile" : "Edit Sports Profile"}</Box>
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
                    name="profile_code"
                    onChange={e => handleChangeProfile(e)}
                    label="Profile Code"
                    value={profile_code.toUpperCase() || ""}
                    fullWidth
                    inputProps={{ maxLength: 6 }}
                    error={Boolean(dialogErrors.profile_code)}
                    helperText={dialogErrors.profile_code}
                />
                <TextField
                    required
                    margin="dense"
                    type="text"
                    name="profile_name"
                    value={profile_name || ""}
                    onChange={e => handleChangeProfile(e)}
                    label="Profile Name"
                    fullWidth
                    error={Boolean(dialogErrors.profile_name)}
                    helperText={dialogErrors.profile_name}
                />

                <TextField
                    margin="dense"
                    type="text"
                    name="profile_description"
                    value={profile_description || ""}
                    onChange={e => handleChangeProfile(e)}
                    label="Description"
                    fullWidth
                    error={Boolean(dialogErrors.profile_description)}
                    helperText={dialogErrors.profile_description}

                />
            </DialogContent>
            <DialogActions>



                <LinkButton
                    cursor="pointer"
                    color="primary"
                    variant="contained"
                    onClick={(e) => handleProfileSave(e)}
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

export default AddProfile;