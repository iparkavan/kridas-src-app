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


const AddState = (props) => {
    const [open, setOpen] = useState(true);
    let country_states = props.country_states;
    let currentIndex = props.indexValue;
    let rowSend = props.rowSend;
    let modelSend = props.modelSend
    const [mode] = useState(modelSend);
    const handleClose = () => {
        setOpen(false);
        props.showModal(false)
    };
    let defaultState = {
        state_code: "",
        state_name: "",
        is_delete: "N",
    }
    const [state, setState] = useState(modelSend === "edit" ? rowSend : defaultState)
    const { state_code, state_name } = (state)

    const handleChangeState = (e) => {
        if (e.target.name === "state_code") {
            setState({ ...state, [e.target.name]: e.target.value.toUpperCase() })
        } else {
            setState({ ...state, [e.target.name]: (e.target.value) })
        }
    }
    const [dialogErrors, setDialogErrors] = useState({});
    const handleStateSave = async (e) => {
        e.preventDefault();
        setDialogErrors({});
        const scheme = yup.object().shape(
            {
                state_code: yup
                    .string()
                    .typeError("Please enter  state code")
                    .max(5, "Maximum of 5 characters")
                    .test('state_code', 'State Code is already present ', function (state_code) {
                        let stateCodeCheck = country_states.filter((code) => {
                            return code.state_code === state_code;
                        });
                        var stateCodeIndexCheck = -1;
                        if (stateCodeCheck.length > 0) {
                            stateCodeIndexCheck = country_states.indexOf(stateCodeCheck[0]);
                        }
                        if (stateCodeCheck.length > 0 && currentIndex !== stateCodeIndexCheck) {
                            return this.createError({ message: 'State code is already present ' });
                        }
                        else {
                            return true;
                        }
                    })
                    .required("Please enter  state code"),
                state_name: yup
                    .string()
                    .max(100, "Maximum of 100 character")
                    .typeError("Please enter  state name")
                    .matches(/^[aA-zZ\s]+$/, "Symbol and number are not allowed  ")
                    .required("Please enter  state name"),
            }
        );
        await scheme
            .validate(state, { abortEarly: false })
            .then(() => {
                props.countryDetailState(state, mode);
                props.showModal(false)
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
            maxWidth={"lg"}
        >
            <DialogTitle id="form-dialog-lookup">

                <Box display="flex" alignItems="center">
                    <Box flexGrow={1} >   {modelSend === "Add" ? "Add State" : "Edit State"}</Box>
                    <Box>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

            </DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    type="text"
                    name="state_name"
                    value={state_name || ""}
                    onChange={e => handleChangeState(e)}
                    label="State Name"
                    fullWidth
                    error={Boolean(dialogErrors.state_name)}
                    helperText={dialogErrors.state_name}

                />
                <TextField
                    margin="dense"
                    type="text"
                    name="state_code"
                    onChange={e => handleChangeState(e)}
                    label="State Code"
                    value={state_code || ""}
                    fullWidth
                    error={Boolean(dialogErrors.state_code)}
                    helperText={dialogErrors.state_code}

                />
            </DialogContent>
            <DialogActions>

                <LinkButton
                    cursor="pointer"
                    color="primary"
                    variant="contained"
                    onClick={(e) => handleStateSave(e)}
                >
                    {modelSend === "Add" ? "Save" : "Edit"}
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

export default AddState;