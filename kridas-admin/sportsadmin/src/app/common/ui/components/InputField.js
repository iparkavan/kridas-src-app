import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField as MuiTextField } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiInput-underline:before': {
            borderColor: theme.palette.common.blue,
        },
        '& .MuiOutlinedInput-root fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },

}));


export default function TextField(props) {
    const classes = useStyles();


    return <MuiTextField
        className={classes.field}
        margin='dense'
        id="outlined-name"
        variant="outlined"
        required={props.requiredfield}
        label={props.label}
        name={props.name}
        rows={props.rows}
        value={props.value}
        inputlabelprops={{ shrink: true }}
        error={props.error}
        {...props}
    />;
};