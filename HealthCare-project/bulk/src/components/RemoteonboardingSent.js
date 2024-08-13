import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import logodb from '../img/Beats-health-logo.png';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LeftsideMenu from './LeftsideMenu';

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
}));

export default function MiniDrawer() {
    const classes = useStyles();
    const [open] = React.useState(false);

    return (
        <div className={classes.root}>
            <CssBaseline />
         
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <img src={logodb} className="dblogo" alt="Beats Logo" />
                    {/*  <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton> */}
                </div>

                <LeftsideMenu/>

                {/*    <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List> */}
            </Drawer>
            <main id="maindiv" className={classes.content}>


                <div className={classes.root}>

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} >
                            <h5 className="btitle">Remote Onboarding Details</h5>
                        </Grid>

                        <Grid item xs={12} sm={12} >
                            <Paper className="pad5p txt-center bx-shadow dbbox">
                                 <Paper className=" pad20 txt-center bx-shadow dbbox txtform700">
                                 <Grid container className="pb30 pt30">
                                    <Grid item xs={12} sm={12} md={12} className="mb50">
                                        <Box component="div" className="righticons">
                                            <CheckCircleIcon />
                                        </Box>
                                        <p className="txtbdr mb20">Request Sent</p>
                                    
                                        <a href="/Dashboard" className="btn-primary " >Home</a>
                                    </Grid>
                                </Grid>
                               </Paper>
                            </Paper>
                        </Grid>


                    </Grid>
                </div>

            </main>
        </div>
    );
}