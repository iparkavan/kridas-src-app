import React from "react";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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



const CustomPhone = (props, ref) => {

    return (
        <TextField
            // fullWidth
            size='small'
            {...props}
            inputRef={ref}
            variant="outlined"
            label={props.label}
        />
    )
}

export default React.forwardRef(CustomPhone)