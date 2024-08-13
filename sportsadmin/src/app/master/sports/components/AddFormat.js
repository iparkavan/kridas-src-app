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


/* Add Format Function For Add and Edit Sports Format */

const AddFormat = (props) => {
    const { modelSend, formatSave, flag, setShowModalFormat } = props
    let sports_format = props.sports_format;
    let currentIndex = props.indexValue;
    const [open, setOpen] = useState(flag);
    let rowSend = props.rowSend;
    const [mode] = useState(modelSend);
    const handleClose = () => {
        setOpen(false);
        setShowModalFormat(false)
    };
    let defaultFormat = {
        format_code: "",
        format_name: "",
    }

    const [format, setFormat] = useState(modelSend === "edit" ? rowSend : defaultFormat)
    const { format_code, format_name } = (format)
    const [dialogErrors, setDialogErrors] = useState({});


    const handleChangeFormat = (e) => {
        if (e.target.name === "format_code") {
            setFormat({ ...format, [e.target.name]: e.target.value.toUpperCase() })
        }
        else {
            setFormat({ ...format, [e.target.name]: e.target.value })
        }
    }


    /* For Save and Update Sports Format with Validation */

    const handleFormatSave = async (e) => {
        e.preventDefault();
        setDialogErrors({});
        const scheme = yup.object().shape(
            {
                format_code: yup
                    .string()
                    .typeError("Please enter format code code")
                    .min(3, "Minimum of 3 character")
                    .max(6, "Maximum of 6 characters")
                    .test('format_code', 'Format Code is already present! ', function (format_code) {
                        let format_codeCheck = sports_format.filter((code) => {
                            return code.format_code === format_code;
                        });
                        var format_codeIndexCheck = -1;
                        if (format_codeCheck.length > 0) {
                            format_codeIndexCheck = sports_format.indexOf(format_codeCheck[0]);
                        }
                        if (format_codeCheck.length > 0 && currentIndex !== format_codeIndexCheck) {
                            return this.createError({ message: 'Format code is already present! ' });
                        }
                        else {
                            return true;
                        }
                    })
                    .required("Please enter format code code"),

                format_name: yup
                    .string()
                    .typeError("Please enter  format name")
                    .required("Please enter format name"),
            }
        );

        await scheme
            .validate(format, { abortEarly: false })
            .then(() => {
                formatSave(format, mode);
                setShowModalFormat(false)
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
                    <Box flexGrow={1} > {modelSend === "Add" ? "Add Sports Format" : "Edit Sports Format"}</Box>
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
                    name="format_code"
                    onChange={e => handleChangeFormat(e)}
                    label="Format Code"
                    value={format_code.toUpperCase() || ""}
                    fullWidth
                    inputProps={{ maxLength: 6 }}
                    error={Boolean(dialogErrors.format_code)}
                    helperText={dialogErrors.format_code}
                />
                <TextField
                    required
                    margin="dense"
                    type="text"
                    name="format_name"
                    value={format_name || ""}
                    onChange={e => handleChangeFormat(e)}
                    label="Format Name"
                    fullWidth
                    error={Boolean(dialogErrors.format_name)}
                    helperText={dialogErrors.format_name}

                />
            </DialogContent>
            <DialogActions>



                <LinkButton
                    cursor="pointer"
                    color="primary"
                    variant="contained"
                    onClick={(e) => handleFormatSave(e)}
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

export default AddFormat;