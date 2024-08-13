import { Backdrop, Button, CircularProgress, Grid, IconButton, makeStyles } from '@material-ui/core'
import React from 'react'
import CustomTable from './common/SuperUsersTable';
import { EXISTING_SUPER_USER_TABLE_HEADER } from './table_constants';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import moment from 'moment';
import Axios from "axios";
import { ToastError, ToastSuccess} from '../service/toast/Toast';
import { ToastContainer } from 'react-toastify';


const SuperUser = () => {

    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(async () => {
        fetchAdminUsers();
    }
        , [])

    const defaultSuperUserTableData = [
        {
            preconfigured_users_id: '',
            organization_name: '',
            user_email: '',
            role: 'Admin',
            status: '',
            modified_on: '',
        }
    ]

    const timeout = React.useRef(null);
    const classes = useStyles();
    const [isLoading, setLoading] = React.useState("");
    const [superUserData, setSuperUserData] = React.useState(defaultSuperUserTableData);
    const [isSaveButtonClicked, setIsSaveButtonClicked] = React.useState(false);
    let emptyField = false;

    const logout = () => {
        sessionStorage.clear();
        localStorage.clear();
        setLoading(true);
        timeout.current = setTimeout(stopLoader, 5000);
        window.location = '/SignIn';
    };

    const stopLoader = () => {
        clearTimeout(timeout.current);
        setLoading(false);
    };

    const onClickAdd = () => {
        setIsSaveButtonClicked(false);
        let temp_array = [...defaultSuperUserTableData, ...superUserData];
        setSuperUserData(temp_array);
    }

    const onChangeTableInput = (keyName, index, keyValue, rowData) => {
        let temp_array = [...superUserData];
        let temp_value = keyValue

        if (keyName === 'email' && temp_value) {
            temp_value = temp_value.trim();
        }
        temp_array[index][keyName] = temp_value;
        setSuperUserData(temp_array);
    }

    const onClickSave = () => {
        setIsSaveButtonClicked(true);
        saveAdminUsers();
    }

    const pageRefresh = (e) => {
        e.preventDefault();
        ToastError('Unsaved Changes Discarded!');
        window.location.reload();
    }

    const handleEdit = (row) => {
        row.editClicked = true;
        let newSuperUserData = [];
        for (let i = 0; i < superUserData.length; i++) {
            if (superUserData[i].preconfigured_users_id === row.preconfigured_users_id) {
                newSuperUserData.push(row);
            } else {
                newSuperUserData.push(superUserData[i]);
            }
        }
        setSuperUserData(newSuperUserData);
    }

    const fetchAdminUsers = async () => {
        try{
            let url = process.env.REACT_APP_BEATS_FETCH_ADMIN_USERS;
            let config = {
                method: "get",
                url: url,
                headers: {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*",
                    Authorization: "Bearer " + sessionStorage.getItem("idToken")
                },
            };
            setLoading(true);
            let response = await Axios(config);
            setSuperUserData(response.data);
            setLoading(false);
        }catch(error){
            console.log(error);
            ToastError('Error Fetching Admin Users!');
            setLoading(false);
        }
    }

    const saveAdminUsers = async() => {
        setLoading(true);
        superUserData.forEach((superUser) => {
            if ('editClicked' in superUser) {
                delete superUser.editClicked;
            }
            superUser.modified_on = moment(Math.round(+new Date()/1000)).format('MM/DD/YYYY HH:mm:ss');
            if(superUser.email === '' || superUser.organization_name === '' || 
            superUser.status === '' || superUser.user_type === ''){
                ToastError('All Fields Required');
                emptyField = true;
                setLoading(false);
            }
        })
        if(!emptyField){
            try{
                let url = process.env.REACT_APP_BEATS_SAVE_ADMIN_USERS;
                let config = {
                    method: "post",
                    url: url,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                    },
                    data: superUserData
                };
                let response = await Axios(config);
                ToastSuccess('Admin Users Updated Successfully!');
            }catch(error){
                console.log(error);
                ToastError('Error Fetching Admin Users!');
                setLoading(false);
            }
            fetchAdminUsers();
            setLoading(false);
        }

    }

    return (
        <>
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer />
            <Grid className={classes.root} container direction='column'>
                <Grid container direction='row' justifyContent='space-between'>
                    <Grid item>
                        <b className={classes.bHead}>Platform Admin - Configuring Admin Users</b>
                    </Grid>
                    <Grid item>
                        <div className={classes.logout} title="Logout" onClick={logout} >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="20"
                                viewBox="0 0 24 24"
                            >
                                <path d="M16 10v-5l8 7-8 7v-5h-8v-4h8zm-16-8v20h14v-2h-12v-16h12v-2h-14z" fill="#C72C35" />
                            </svg>
                        </div>
                    </Grid>
                </Grid>
                <Grid className={classes.gridAdmin} item>
                    <b>Manage Admin Users</b> <Button onClick={onClickAdd} className={classes.addUserButton}> <IconButton className={classes.addIcon}><AddRoundedIcon /></IconButton>Add User</Button>
                </Grid>
                <Grid item>
                    <CustomTable
                        header={EXISTING_SUPER_USER_TABLE_HEADER}
                        tableData={superUserData}
                        onChangeTableInput={onChangeTableInput}
                        setSuperUserData={setSuperUserData}
                        handleEdit={handleEdit}
                        isSaveButtonClicked={isSaveButtonClicked}
                    />
                </Grid>
            </Grid>
            <Grid className={classes.btnsGrid} container direction='row' justifyContent='center'>
                <Grid item>
                    <Button onClick={(e) => pageRefresh(e)} className={classes.cancelButton}>Cancel</Button>
                </Grid>
                <Grid item>
                    <Button onClick={onClickSave} className={classes.saveButton}>Save</Button>
                </Grid>
            </Grid>
        </>
    )
}


const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2em',
        overflow: 'hidden'
    },
    bHead: {
        color: '#C72C35'
    },
    gridAdmin: {
        marginTop: '4em'
    },
    addUserButton: {
        backgroundColor: '#C72C35',
        color: 'white',
        textTransform: 'none',
        height: '1.75em',
        "&:hover": {
            backgroundColor: "#C72C35"
        },
        marginLeft: '4em',
        cursor: 'pointer',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    logout: {
        cursor: 'pointer'
    },
    btnsGrid: {
        marginTop: '4em'
    },
    cancelButton: {
        backgroundColor: '#d3d3d3',
        width: 200,
        color: 'black',
        textTransform: 'none',
        "&:hover": {
            backgroundColor: "#d3d3d3"
        },
        marginRight: '2em',
        cursor: 'pointer',
        borderRadius: 20
    },
    saveButton: {
        backgroundColor: 'green',
        width: 200,
        color: 'white',
        textTransform: 'none',
        "&:hover": {
            backgroundColor: "green"
        },
        marginLeft: '2em',
        cursor: 'pointer',
        borderRadius: 20
    },
    addIcon: {
        color: 'white',
        '& svg': {
            fontSize: 18
        },
        margin: 0,
        padding: 0
    }
}))

export default SuperUser