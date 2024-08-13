import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "../../../common/ui/components/Button";

const useStyles = makeStyles((theme) => ({
    btn: {
        padding: '2--px',
        margin: '10px',
        
    },
    button: {
        float: "right",
        marginRight: "20px"
    },
    btnHide:{
        display:"none",
    }

})
)

const VerificationButton = (props) => {
    const { applied_status } = props.profile
    const classes = useStyles();
    const [mode] = useState(null)
    return (
        <>
            <div className={classes.button}>
                <Button 
                    className={applied_status!== "S" ? classes.btnHide : classes.btn}
                    color="primary"
                    onClick={props.handleApprove}
                    mode={mode}> Approval </Button>
                <Button
                    className={applied_status!== "S" ? classes.btnHide : classes.btn}
                    onClick={props.handleReject}
                    mode={mode}> Rejection </Button>
            </div>

        </>
    )
}

export default VerificationButton