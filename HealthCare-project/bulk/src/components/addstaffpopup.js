import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { makeStyles } from "@material-ui/core/styles";
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Datepickermod from "./datepicker";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import { createStyles, Theme } from "@material-ui/core/styles";
//import { Specialties_List_fetch, Title_List, Gender_List } from './Util/GetData';

export default function Addstaffpopup() {
    const drawerWidth = 240;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const BootstrapInput = withStyles((theme: Theme) =>
        createStyles({
            root: { "label + &": { marginTop: theme.spacing(3), }, },
            input: {},
        })
    )(InputBase);

    const useStyles = makeStyles((theme) => ({
        root: {
            display: "flex",
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: "none",
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: "nowrap",
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: "hidden",
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        formControl: {
            margin: theme.spacing(1),
            width: '100%',
            /**minWidth:120 */
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }));


    const MenuItemListGender = ["Male", "Female"].map((item, index) => (<MenuItem value={item}>{item}</MenuItem>));
    const MenuItemListTitle = ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.'].map((item, index) => (<MenuItem value={item}>{item}</MenuItem>));
    const MenuItemListSpecialty = [{ 'value': "a" }, { 'value': "b" }, { 'value': "c" }].map((item, index) => (<MenuItem value={item.value}>{item.value}</MenuItem>));

    return (
        <div>
            <Button size="large"
                variant="contained"
                style={{ backgroundColor: "red" }}
                onClick={handleClickOpen}>Add staff</Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Grid container spacing={3} justify="center">
                        <Grid item xs={12}>
                            <h2 className="title1"> Add Staff </h2>
                            <Grid className="detail-list" container spacing={2} >
                                <Divider variant="middle" className=" dividercls width100p mar0" />
                                <Grid item xs={12} >
                                </Grid>
                                <Grid item xs={3}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} className="details-label">
                                            Title
                                        </Grid>
                                        <Grid item xs={6}
                                            className="details-label"
                                            style={{ color: "#828282" }}
                                        >
                                        </Grid>
                                        <Grid item xs={12}
                                            className="details-value datetop0 timelist" >
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="start-time"
                                                    id="start-time"

                                                    className="selectborder"
                                                >
                                                    {MenuItemListTitle}
                                                </Select>
                                            </FormControl>

                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={5}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} className="details-label">
                                            First Name
                                        </Grid>
                                        <Grid item xs={6}
                                            className="details-label"
                                            style={{ color: "#828282" }}
                                        >

                                        </Grid>
                                        <Grid item xs={
                                            12
                                        }
                                            className="details-value datetop0 timelist" >
                                            <BootstrapInput className="primary-input   width100p" />

                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={4}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} className="details-label">
                                            Last Name
                                        </Grid>
                                        <Grid item xs={6}
                                            className="details-label"
                                            style={{ color: "#828282" }}
                                        >

                                        </Grid>
                                        <Grid item xs={
                                            12
                                        }
                                            className="details-value datetop0 timelist" >
                                            <BootstrapInput className="primary-input   width100p" />

                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={4}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} className="details-label">
                                            Gender
                                        </Grid>
                                        <Grid item xs={6}
                                            className="details-label"
                                            style={{ color: "#828282" }}
                                        >
                                        </Grid>
                                        <Grid item xs={
                                            12
                                        }
                                            className="details-value datetop0" >

                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="end-time"
                                                    id="end-time"

                                                    className="selectborder"
                                                >
                                                    {MenuItemListGender}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={8}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} className="details-label">
                                            License No. / NPI
                                        </Grid>
                                        <Grid item xs={6}
                                            className="details-label"
                                            style={{ color: "#828282" }}
                                        >

                                        </Grid>
                                        <Grid item xs={12}
                                            className="details-value datetop0" >
                                            <BootstrapInput className="primary-input   width100p" />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} className="details-label">
                                            Email
                                        </Grid>
                                        <Grid item xs={6}
                                            className="details-label"
                                            style={{ color: "#828282" }}
                                        >
                                        </Grid>
                                        <Grid item xs={12} className="details-value datetop0" >
                                            <BootstrapInput className="primary-input   width100p" />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6} className="details-label">
                                            Cell Number
                                        </Grid>

                                        <Grid item xs={12} className="details-value">
                                            <BootstrapInput className="primary-input   width100p" />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={7}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} className="details-label">
                                            Specialty
                                        </Grid>

                                        <Grid item xs={12} className="details-value">
                                            <FormControl fullWidth>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    className="selectborder"
                                                >
                                                    {MenuItemListSpecialty}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={5}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} className="details-label">
                                            Practicing Since
                                        </Grid>
                                        <Grid item xs={12} className="details-value">
                                            <BootstrapInput className="primary-input   width100p" />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12} className="mt20">
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} className="details-label mb20">
                                            <Button
                                                variant="contained"
                                                className="cancelbtn mr30"
                                                onClick={handleClose}
                                            >
                                                Cancel
                                            </Button>
                                            <Button variant="contained" className="btn-primary addstaffbtn" > Add Staff   </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>

                            </Grid>
                        </Grid>
                    </Grid>

                </DialogContent>
            </Dialog>
        </div>
    );
}