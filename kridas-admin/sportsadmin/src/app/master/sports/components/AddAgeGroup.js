import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import LinkButton from "../../../common/ui/components/LinkButton";
import CloseIcon from '@material-ui/icons/Close';
import { Box } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";


/* Add Age Group Function For Add and Edit Age Group*/

const AddAgeGroup = (props) => {
    const { modelSend, ageGroupSave, flag, setShowModalAge } = props
    const [open, setOpen] = useState(flag);
    let sports_age_group = props.sports_age_group;
    let currentIndex = props.indexValue;
    let rowSend = props.rowSend;
    const [mode] = useState(modelSend);
    const handleClose = () => {
        setOpen(false);
        setShowModalAge(false)
    };
    let defaultAgeGroup = {
        age_group_code: "",
        age_group: "",
        min_age: "",
        max_age: "",
        min_players: "",
        max_players: "",

    }

    const [ageGroup, setAgeGroup] = useState(modelSend === "edit" ? rowSend : defaultAgeGroup)
    const { age_group_code, age_group, min_age, max_age, min_players, max_players } = (ageGroup)
    const [dialogErrors, setDialogErrors] = useState({});

    const handleChangeAgeGroup = (e) => {
        if (e.target.name === "age_group_code") {
            setAgeGroup({ ...ageGroup, [e.target.name]: e.target.value.toUpperCase() })
        }
        else {
            setAgeGroup({ ...ageGroup, [e.target.name]: e.target.value })
        }
    }

    const onChangeAgeNumber = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setAgeGroup({ ...ageGroup, [e.target.name]: (e.target.value) })
        }
    }



    /* Age Group Save And Update with Validation */

    const handleAgeGroupSave = async (e) => {
        e.preventDefault();
        setDialogErrors({});
        const scheme = yup.object().shape(
            {
                age_group_code: yup
                    .string()
                    .typeError("Please enter age group code")
                    .min(3, "Minimum of 3 character")
                    .max(6, "Maximum of 6 characters")
                    .test('age_group_code', 'Age Group Code is already present! ', function (age_group_code) {
                        let ageGroupCodeCheck = sports_age_group.filter((code) => {
                            return code.age_group_code === age_group_code;
                        });
                        var ageGroupCodeIndexCheck = -1;
                        if (ageGroupCodeCheck.length > 0) {
                            ageGroupCodeIndexCheck = sports_age_group.indexOf(ageGroupCodeCheck[0]);
                        }
                        if (ageGroupCodeCheck.length > 0 && currentIndex !== ageGroupCodeIndexCheck) {
                            return this.createError({ message: 'Age Group code is already present!' });
                        }
                        else {
                            return true;
                        }

                    })
                    .required("Please enter age group code"),

                age_group: yup
                    .string()
                    .typeError("Please enter  age group")
                    .required("Please enter age group"),
                max_age: yup
                    .string()
                    .typeError("Please enter maximum age")
                    .required("Please enter maximum age"),
                max_players: yup
                    .string()
                    .typeError("Please enter maximum players")
                    .required("Please enter maximum players"),
            }
        );

        await scheme
            .validate(ageGroup, { abortEarly: false })

            .then(() => {
                ageGroupSave(ageGroup, mode);
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
                    <Box flexGrow={1} > {modelSend === "Add" ? "Add Age Group" : "Edit Age Group"}</Box>
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
                    name="age_group_code"
                    placeholder="Must be capital letter"
                    onChange={e => handleChangeAgeGroup(e)}
                    label="Age Group Code"
                    value={age_group_code.toUpperCase() || ""}
                    fullWidth
                    inputProps={{ maxLength: 6 }}
                    error={Boolean(dialogErrors.age_group_code)}
                    helperText={dialogErrors.age_group_code}
                />
                <TextField
                    required
                    margin="dense"
                    type="text"
                    name="age_group"
                    value={age_group || ""}
                    onChange={e => handleChangeAgeGroup(e)}
                    label="Age Group"
                    fullWidth
                    error={Boolean(dialogErrors.age_group)}
                    helperText={dialogErrors.age_group}

                />
                <TextField
                    margin="dense"
                    type="text"
                    name="min_age"
                    value={min_age}
                    placeholder="0"
                    onChange={e => onChangeAgeNumber(e)}
                    label="Minimum Age"
                    fullWidth
                    error={Boolean(dialogErrors.min_age)}
                    helperText={dialogErrors.min_age}

                />
                <TextField
                    required
                    margin="dense"
                    type="text"
                    name="max_age"
                    value={max_age}
                    placeholder="0"
                    onChange={e => onChangeAgeNumber(e)}
                    label="Maximum Age"
                    fullWidth
                    error={Boolean(dialogErrors.max_age)}
                    helperText={dialogErrors.max_age}

                />
                <TextField
                    margin="dense"
                    type="text"
                    name="min_players"
                    value={min_players}
                    placeholder="0"
                    onChange={e => onChangeAgeNumber(e)}
                    label="Minimum Players"
                    fullWidth
                    error={Boolean(dialogErrors.min_players)}
                    helperText={dialogErrors.min_players}

                />
                <TextField
                    required
                    margin="dense"
                    type="text"
                    name="max_players"
                    value={max_players}
                    placeholder="0"
                    onChange={e => onChangeAgeNumber(e)}
                    label="Maximum Players"
                    fullWidth
                    error={Boolean(dialogErrors.max_players)}
                    helperText={dialogErrors.max_players}

                />
            </DialogContent>

            <DialogActions>



                <LinkButton
                    cursor="pointer"
                    color="primary"
                    variant="contained"
                    onClick={(e) => handleAgeGroupSave(e)}
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

export default AddAgeGroup;