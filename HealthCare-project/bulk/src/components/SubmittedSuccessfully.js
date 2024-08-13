import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Grid from '@material-ui/core/Grid';
import logo from "../img/beats-health.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({

    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
 
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    mainlogo: {
        img: {
           maxWidth: '80%',
 

        },
    },
}));

const SubmittedSuccessfully = () => {
    const classes = useStyles();
    return (
        <div className={classes.root} justify="center" alignItems="center"  >
        <CssBaseline />
        <Grid container className="h100" justify="center" alignItems="center">
           <Box component="div" className="signin h100 "   style={{ display: "content" }, { minWidth: "auto"}} >
                <Box component="div" className="mainlogo">
                    <h5 className="btitle">
                        {sessionStorage.getItem("organisation")}
                    </h5>
                </Box>

                <Box component="div" boxShadow={3} className="signinbox " >
                    <Box component="div" className="signinbox-in">
                        <Box component="div" className="righticons">
                            <CheckCircleIcon />
                        </Box>
                        <h6 className="btitle">Thank you. Insurance details submitted</h6>
                        <p>For any further details, please contact your provider</p>
                    </Box>
                    <Box component="div" className="righticons">
                        &nbsp;
                    </Box>
                </Box>
            </Box>
        </Grid>
     </div>
    );
};

export default SubmittedSuccessfully;