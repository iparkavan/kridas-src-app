import React,{useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Grid from "@material-ui/core/Grid";
import Datepickermod from "./datepicker";
import Timepicker from "./Timepicker";
import InputBase from "@material-ui/core/InputBase";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import moment from 'moment';

import {
    createStyles
} from "@material-ui/core/styles";
import {
    withStyles
} from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import { ToastError, ToastSuccess } from "../service/toast/Toast";
import InputLabel from '@mui/material/InputLabel';

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
      },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: "#fff",
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #C72C35',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: theme.spacing(1),
    },
}));

const BootstrapInput = withStyles((theme) =>
    createStyles({
        root: {
            "label + &": {
                marginTop: theme.spacing(3),
            },
        },
        input: {},
    })
)(InputBase);

const time = ["12:00 AM",
    "12:30 AM",
    "1:00 AM",
    "1:30 AM",
    "2:00 AM",
    "2:30 AM",
    "3:00 AM",
    "3:30 AM",
    "4:00 AM",
    "4:30 AM",
    "5:00 AM",
    "5:30 AM",
    "6:00 AM",
    "6:30 AM",
    "7:00 AM",
    "7:30 AM",
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
    "10:30 PM",
    "11:00 PM",
    "11:30 PM",
    ];

const getFormattedTime = (fromTime) => {
        if(!fromTime || typeof fromTime !== 'string') return fromTime;
        let formattedTime =  moment(fromTime, ["HH.mm"]).format("hh:mm A");
        if(formattedTime.charAt(0) === '0'){
            formattedTime = formattedTime.slice(1); 
        }
        const indexOfTime = time.findIndex((ele)=> ele === formattedTime);
        return indexOfTime;
}

export default function Reschedule({
    patientId,
    patientName,
    dateOfBirth,
    age,
    addressLine1,
    addressLine2,
    city,
    state,
    zip,
    contactNumber,
    email,
    date_of_service,
    refetchData,
    displayText,
    specialty,
    visitReason,
    appStartTime,
    appEndTime,
    physicianId,
    sucessMessage,
}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const [specialityData, setSpecialityData] = useState([]);
    const [physicianData, setPhysicianData] = useState([]);
    const [visitReasonData, setVisitReasonData] = useState([]);
    const [specialityCategory,setSpecialityCategory] = useState({});
    const [phyCategory, setphyCategory] = useState({});

    const initialState = {
        apptStartTime: getFormattedTime(appStartTime), 
        apptEndTime: getFormattedTime(appEndTime), 
        physician:physicianId, 
        speciality:specialty,
        visit_reason:visitReason,
        dateOfService:date_of_service
    };
    const [value, setValue] = React.useState(initialState);

    const [needToRefetchData, setNeedToRefetchData] = useState(false);
    const [dataMofified, setDataModified] = useState(false);

    useEffect(() => {
        if (specialty)
            setPhysicianData(phyCategory[specialty]);
    }, [phyCategory])


    const getPhyName=(arr)=>{
        // debugger;
        let x="";
        arr.forEach((n)=>{
          if(n){
            x+=n.trim();
            x=x+" "
          }
        })
    
        return x.trim();
      }
    const fetchData = async ()=>{
        let physiciansConfig = {
            method: "post",
            url: process.env.REACT_APP_BEATS_GET_PHYSICIANS,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + sessionStorage.getItem("idToken"),
            },
        };
        let specialitiesConfig = {
            method: "get",
            url: process.env.REACT_APP_BEATS_GET_SPECIALTIES_API,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                Authorization: "Bearer " + sessionStorage.getItem("idToken"),
            },
        };

          setLoading(true);
          try{
            let specialitiesData = await axios(specialitiesConfig);
            let physiciansData = await axios(physiciansConfig);
   
            setOpen(true);
            setLoading(false);
            const specData = specialitiesData.data;
            const specCategory = specData.reduce((catsSoFar, { specialty_name, specialty_id, visit_reason }) => {
                if (!catsSoFar[specialty_name]) catsSoFar[specialty_name] = [];
                // catsSoFar[specialty_name].push(specialty_id);
                catsSoFar[specialty_name].push(visit_reason);
                return catsSoFar;
              }, {});

            // Phy_By_Spec_Group
            // {
            //     Heart:[{
            //         physicianId: 1
            //         Name: "Dr.Physcian 1"
            //     },{
            //         physicianId:2
            //         Name: "Dr.Physician 2"
            //     }],
            //     Allergist:[{
            //         physicianId:2,
            //         Name: "Dr.Allergist2"
            //     }]
            // }
              const phy_By_SpecGroup = physiciansData.data.reduce((catsSoFar,{physician_id, first_name, middle_name, last_name, specialties})=>{
                if (!catsSoFar[specialties]) catsSoFar[specialties] = [];
                catsSoFar[specialties].push({
                    physician_id:physician_id,
                    // name: first_name.trim()+" "+ middle_name.trim() +" "+ last_name.trim()
                    name:getPhyName([first_name,middle_name,last_name])
                });
                return catsSoFar;
            },{}); 

            const distinctSpec = Object.keys(specCategory);
            setSpecialityCategory(specCategory);              
            setSpecialityData(distinctSpec);
            setphyCategory(phy_By_SpecGroup); // Group physicians based on speciality.
            setVisitReasonData(specCategory[specialty]);

            // To auto populate, already schduled apptmt start and end time.
            // TODO: Need to uncomment once the type in  DB is change to varchar type.
            // if(appStartTime && appEndTime){
            //     setValue(preValue => ({ 
            //         ...preValue, 
            //         "apptStartTime": {value:time.indexOf(appStartTime), textContent:appStartTime},
            //         "apptEndTime": time.indexOf(appEndTime)
            //      }));
    
            // }

          }catch(error){
            setLoading(false);
            ToastError("Failed To Fetch Physicians Information!");
            console.log(error);
          }

    };

    const handleOpen = () => {
        setValue(initialState);
        setDataModified(false);
        setNeedToRefetchData(false);
        fetchData();
    };

    const handleClose = () => {
        setOpen(false);
    };
  
    const handleChange = (name, value, textContent) => {
        if(name=="speciality"){
            setValue(preValue => ({
                ...preValue,
                physician:"", 
                speciality:value,
                visit_reason:"" }));
            specialityCategory[value] ? setVisitReasonData(specialityCategory[value]) : setVisitReasonData([]);
            phyCategory[value] ? setPhysicianData(phyCategory[value]) : setPhysicianData([]);
        }
        else if(name=="apptStartTime"){
            setValue(preValue => ({ 
                ...preValue, 
                [name]: value,
             }));

        } 
        else if(name=="dateOfService"){
            setValue(preValue => ({ ...preValue, [name]: value }));
            setNeedToRefetchData(true);
        }
        else{
            setValue(preValue => ({ ...preValue, [name]: value }));
        }
        setDataModified(true);
    };

    
    const timeList = time.map((t,index) =>
        <MenuItem value={index}> {t} </MenuItem>
    );
    const endTimeList = time.map((t, index) =>
    <MenuItem value={index} disabled={index <= value.apptStartTime}> {t} </MenuItem>)

  /*  const endTimeList = value.apptStartTime!==-1 ? (time.map((t, index) =>{
        if(value.apptStartTime===-1 && index===-1){
            return <MenuItem value={t} disabled> {t} </MenuItem>
        }
        else if(value.apptStartTime===time.length-1 && index===time.length-1 ){
            return <MenuItem value={t} disabled> {t} </MenuItem>
        }
        else if(value.apptStartTime!==time.length-1 && index <= value.apptStartTime ){
            return <MenuItem value={t} disabled> {t} </MenuItem>
        }
        else{
            return <MenuItem value={t} disabled={false}> {t} </MenuItem>
       // }

    }
    )) : "";*/

    const specialistMenuList = specialityData.map((specName)=>
        <MenuItem value={specName}> {specName} </MenuItem>
    );

    const visitReasonMenuList = visitReasonData.map((visit_reason)=>
        <MenuItem value={visit_reason}> {visit_reason} </MenuItem>
    );

    // const physicianMenuList = phyCategory[specialty]&&phyCategory[specialty].length > 0 ? (phyCategory[specialty].map(({physician_id, name})=>
    //     <MenuItem value={name}> {name} </MenuItem>
    // )) : [];
    const physicianMenuList = physicianData && physicianData.length > 0 ? (physicianData.map(({ physician_id, name }) =>
        <MenuItem value={physician_id}> {name} </MenuItem>
    )) : [];

    const onScheduleApptmt = () => {
        // Update only if some data is modified.
        if (!dataMofified) {
            ToastError("No changes made. Please click cancel if you do not wish to reschedule");
        } else {

            // Validate appointment start time, end time, speciality, visit reason and physician are selected.
            let data = { ...value };
             
            data.apptStartTime = moment(time[value?.apptStartTime], ["h:mm A"]).format("HH:mm");
            data.apptEndTime  = moment(time[value?.apptEndTime], ["h:mm A"]).format("HH:mm");
            let isError = false;
            if (data.apptStartTime == "") {
                ToastError("Select appointment start time");
                isError = true;
            }
            if (data.apptEndTime == "") {
                ToastError("Select appointment end time");
                isError = true;
            }
            if (data.physician == "") {
                ToastError("Select physician");
                isError = true;
            }
            if (data.speciality == "") {
                ToastError("Select speciality");
                isError = true;
            }
            if (data.visit_reason == "") {
                ToastError("Select visit reason");
                isError = true;
            }

            // If all the required parameters are provided, reschedule appointment.
            if (!isError) {
                const appointmentState = displayText == "Reschedule"? "Rescheduled": "ScheduleFollowup";
                let rescheduleData = {
                    ...data,
                    apptStartTime: data.apptStartTime,
                    apptEndTime: data.apptEndTime,
                    patient_id: patientId,
                    apptmt_state: appointmentState
                };
                let config = {
                    method: "post",
                    url: process.env.REACT_APP_BEATS_UPDATE_PATIENT_API,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + sessionStorage.getItem("idToken"),
                    },
                    data: rescheduleData,
                };
                setLoading(true);
                axios(config)
                    .then((response) => {
                        setLoading(false);
                        ToastSuccess(sucessMessage);
                        setOpen(false);
                        refetchData();
                    })
                    .catch((error) => {
                        setLoading(false);
                        ToastError("Failed to reschedule appointment");
                        console.log(error);
                    })
            }

        }
    };

    return (
        <div>
            <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

            <Button variant="contained" className="btn-primary Reschedule-btn mr15" onClick={handleOpen} >
                {displayText}
            </Button>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 300,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper + " reschedule"} >

                        <Grid container spacing={3} justify="center">
                            <Grid item xs={12}>

                                <h2 className="title1"> Patient Details </h2>

                                <Grid   className="detail-list" container spacing={2} >

                                    <Grid item xs={4}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                Patient Name
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {patientName}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                Date of Birth
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {dateOfBirth}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                Age
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {age}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                Address Line 1
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {addressLine1}
                                            </Grid>

                                        </Grid>
                                    </Grid>


                                    <Grid item xs={4}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                Address Line 2
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {addressLine2}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                City
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {city}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                State
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {state}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                PIN Code
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {zip}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                Contact Number
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {contactNumber}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid item xs={8}>
                                        <Grid container className="detail-list" spacing={1}>
                                            <Grid item xs={12}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >
                                                Email
                                            </Grid>
                                            <Grid item xs={12}
                                                className="details-value" >
                                                {email}
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Divider variant="middle" className=" dividercls width100p" />
                                    <Grid Grid item xs={
                                        12
                                    } >
                                        <h2 className="title1  " style={{ paddingBottom: "0px", marginTop: "-15px", fontSize: "22px" }}>Appointment Details </h2>
                                    </Grid>
                                    

                                    <Grid item xs={4}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6} className="details-label">
                                                Date of Appt.
                                            </Grid>
                                            <Grid item xs={6}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >

                                            </Grid>
                                            <Grid Grid item xs={
                                                12
                                            }
                                                className="details-value datetop0" >

                                                <Datepickermod
                                                    value={((value.dateOfService) && (value.dateOfService.length === 20 || value.dateOfService.length === 24)) ? value.dateOfService.split("T")[0] + "T12:00:00Z" : value.dateOfService}
                                                    dateChanged={(val) => handleChange("dateOfService",val)} 
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={4}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6} className="details-label">
                                                Start Time  
                                            </Grid>
                                            <Grid item xs={6}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >

                                            </Grid>
                                            <Grid Grid item xs={
                                                12
                                            }
                                                className="details-value datetop0 timelist" >
                                                <FormControl fullWidth>
                                                
                                               <Select
                                                labelId="start-time"
                                                id="start-time"
                                                value={value.apptStartTime}
                                                label="Age"
                                                onChange={(event)=>handleChange("apptStartTime",event.target.value, event.currentTarget.innerText)}
                                                className="selectborder"
                                                >
                                                    {timeList}    
                                                </Select>
                                                </FormControl>
                                              
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                     <Grid item xs={4}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6} className="details-label">
                                               End Time  
                                            </Grid>
                                            <Grid item xs={6}
                                                className="details-label"
                                                style={{ color: "#828282" }}
                                            >

                                            </Grid>
                                            <Grid Grid item xs={
                                                12
                                            }
                                                className="details-value datetop0" >

                                                 <FormControl fullWidth>
                                                    <Select
                                                        labelId="end-time"
                                                        id="end-time"
                                                        value={value.apptEndTime}
                                                        label="Age"
                                                        onChange={(event) => handleChange("apptEndTime", event.target.value)}
                                                        className="selectborder"
                                                    >
                                                        {endTimeList}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Grid container spacing={1}>



                                            <Grid item xs={6} className="details-label">
                                                Specialty
                                            </Grid>
                                            
                                            <Grid item xs={12} className="details-value">
                                                 <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={value.speciality}
                                                        label="Age"
                                                        onChange={(event) => handleChange("speciality", event.target.value)}
                                                        className="selectborder"
                                                    >
                                                        {specialistMenuList}
                                                    </Select>
                                                </FormControl>

                                                
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                     

                                    <Grid item xs={6}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} className="details-label">
                                                Reason for Appt.
                                            </Grid>
                                           
                                            <Grid item xs={12} className="details-value">

                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={value.visit_reason}
                                                        label="Age"
                                                        onChange={(event) => handleChange("visit_reason", event.target.value)}
                                                        className="selectborder"
                                                    >
                                                                                                                {visitReasonMenuList}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} className="details-label">
                                                Attending Physician
                                            </Grid>
                                            
                                            <Grid item xs={12} className="details-value">

                                                <FormControl fullWidth>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={value.physician}
                                                        label="Age"
                                                        onChange={(event) => handleChange("physician", event.target.value)}
                                                        className="selectborder"
                                                    >
                                                        {physicianMenuList}
                                                    </Select>
                                                </FormControl>
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
                                                <Button
                                                    variant="contained"
                                                    className="btn-primary"
                                                    onClick={onScheduleApptmt}
                                                >
                                                    Schedule Appointment
                                                </Button>

                                            </Grid>
                                        </Grid></Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}