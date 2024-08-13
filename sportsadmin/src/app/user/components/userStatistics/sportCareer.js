import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import * as yup from "yup";
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LinkButton from "../../../common/ui/components/LinkButton"
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";


const useStyles = makeStyles(() => ({
    fromDate: {
        width:'18vw'
    },
    toDate: {
        width:'18vw',
        marginLeft: '70px'
    },
    Dropdown: {
        width: '43vw',
        height: '7vh'
    },
}));



/*  Sports Career Function for Add and Update Sports Career*/

const SportsCareer = (props) => {
    const { modelSend, sportsCareerSave, flag, setShowModalCareer } = props
    const classes = useStyles();
    const [open, setOpen] = useState(flag);
    let sport_role = props.sports_role;
    let sport_profile = props.sports_profile;
    let rowSend = props.rowSend;
    const [mode] = useState(modelSend);
    const [dialogErrors, setDialogErrors] = useState({});
    let defaultCareer = {
        from: "",
        to: "",
        url: "",
        name: "",
        profiles: [],
        roles: [],
    }
    const [career, setCareer] = useState(modelSend === "edit" ? rowSend : defaultCareer)
    const { from, to, url, name, roles, profiles } = (career)


    const handleChangeCareer = (e) => {
        setCareer({ ...career, [e.target.name]: e.target.value })
    }

    const handleClose = () => {
        setOpen(false);
        setShowModalCareer(false)
    };



    /* For Save and Update Sports Career With Validation */

    const handleCareerSave = async (e) => {
        e.preventDefault();
        setDialogErrors({});
        const scheme = yup.object().shape(
            {
                from: yup
                    .string()
                    .typeError("Please enter From Date")
                    .required("Please enter From Date"),
                to: yup
                    .string()
                    .typeError("Please enter To Date")
                    .required("Please enter To Date"),

                name: yup
                    .string()
                    .matches(/^[aA-zZ\s]+$/, "Symbol and Number are not allowed ")
                    .typeError("Please enter name")
                    .required("Please enter name"),

                url: yup
                    .string()
                    .matches(
                        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,

                        ' Please enter Valid URL'
                    )
                    .typeError("Please enter URL")
                    .required("Please enter URL"),
            }
        );

        await scheme
            .validate(career, { abortEarly: false })

            .then(() => {
                sportsCareerSave(career, mode);
                setShowModalCareer(false)
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
                    <Box flexGrow={1} > {modelSend === "Add" ? "Add Sports Career" : "Edit Sports Career"}</Box>
                    <Box>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent>
                <div>
                    <TextField
                        className={classes.fromDate}
                        required
                        margin="dense"
                        type="Date"
                        format="dd/MM/yyyy"
                        name="from"
                        value={from || ""}
                        onChange={e => handleChangeCareer(e)}
                        label="From"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{ inputProps: { min: "1930-01-01", max : `${new Date().toISOString().slice(0, 10)}`} }}
                        error={Boolean(dialogErrors.from)}
                        helperText={dialogErrors.from}

                    />

                    <TextField
                        className={classes.toDate}
                        required
                        margin="dense"
                        type="Date"
                        format="dd/MM/yyyy"
                        name="to"
                        value={to || ""}
                        onChange={e => handleChangeCareer(e)}
                        label="To"
                        InputProps={{ inputProps: { min: from, max : `${new Date().toISOString().slice(0, 10)}`} }}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(dialogErrors.to)}
                        helperText={dialogErrors.to}

                    />
                </div>
                <div>
                    <TextField
                        required
                        margin="dense"
                        type="text"
                        name="url"
                        placeholder="URL must contain .com at the end"
                        value={url || ""}
                        onChange={e => handleChangeCareer(e)}
                        label="URL"
                        fullWidth
                        error={Boolean(dialogErrors.url)}
                        helperText={dialogErrors.url}

                    />
                </div>
                <div>
                    <TextField
                        required
                        margin="dense"
                        type="text"
                        name="name"
                        value={name || ""}
                        onChange={e => handleChangeCareer(e)}
                        label="Name"
                        fullWidth
                        error={Boolean(dialogErrors.name)}
                        helperText={dialogErrors.name}

                    />
                </div>
                <FormControl variant='outlined' margin={"normal"}>
                    <InputLabel id="role">Select Role</InputLabel>
                    <Select
                        className={classes.Dropdown}
                        size="small"
                        type="text"
                        variant="outlined"
                        label="role"
                        name="roles"
                        multiple={true}
                        value={roles || ""}
                        onChange={e => handleChangeCareer(e)}

                    >
                        {sport_role.map((role) => (
                            <MenuItem key={role.role_code} value={role.role_code}>
                                {role.role_code}
                            </MenuItem>

                        ))}
                    </Select>
                </FormControl>

                <FormControl variant='outlined' style={{ width: '100%' }} margin={"normal"}>
                    <InputLabel id="profile">Select Profile</InputLabel>
                    <Select
                        className={classes.Dropdown}
                        size="small"
                        type="text"
                        variant="outlined"
                        label="profile"
                        multiple={true}
                        name="profiles"
                        value={profiles || ""}
                        onChange={e => handleChangeCareer(e)}

                    >
                        {sport_profile.map((profile) => (
                            <MenuItem key={profile.profile_code} value={profile.profile_code}>
                                {profile.profile_code}
                            </MenuItem>

                        ))}
                    </Select>
                </FormControl>
            </DialogContent>

            <DialogActions>
                <LinkButton
                    cursor="pointer"
                    color="primary"
                    variant="contained"
                    onClick={(e) => handleCareerSave(e)}
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

export default SportsCareer;