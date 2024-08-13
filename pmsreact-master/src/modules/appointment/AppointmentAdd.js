import React, { useState, useEffect, useReducer } from "react";

import moment from "moment";
import "moment-timezone";

import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";

import InputAdornment from "@material-ui/core/InputAdornment";

import AuthService from "../../service/AuthService";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TimeKeeper from "react-timekeeper";
import AppointmentService from "../../service/AppointmentService";
import UserService from "../../service/UserService";

import validator from "email-validator";

import "react-phone-number-input/style.css";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

import { makeStyles } from "@material-ui/core/styles";

import MenuItem from "@material-ui/core/MenuItem";

import Helper from "../helper/helper";

import close from "../../assets/images/close.svg";
import Modal from "../../elements/ui/Modal/Modal";
import InputLabel from "@material-ui/core/InputLabel";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import EventAdd from "./EventAdd";

const AppointmentAdd = (props) => {
	let errorsObj = {};
	const [appointmentAdd, setAppointmentAdd] = useState(false);
	const [patientName, setPatientName] = useState("");
	const [patientEmail, setPatientEmail] = useState("");
	const [patientMobileNo, setPatientMobileNo] = useState("");
	const [patientId, setPatientId] = useState("");
	const [notes, setNotes] = useState();
	const [appointmentNotes, setAppointmentNotes] = useState();
	const [appointmentStart, setAppointmentStart] = useState();

	const [open, setOpen] = useState(false);

	const [resource, setResource] = useState();
	const [patients, setPatients] = useState([]);

	const [modal, setModal] = useState(props.modal);
	const [errors, setErrors] = useState("");

	const [addAppSelectedDoc, setAddAppSelectedDoc] = useState("");

	const [time, setTime] = useState("00:00 am");
	const [showTime, setShowTime] = useState(false);

	const [copied, setCopied] = useState(false);
	const [copiedAppointment, setCopiedAppointment] = useState({});

	const [eventType, setEventType] = React.useState("A");

	const handleChange = (event) => {
		setEventType(event.target.value);
	};

	const loading = open && patients.length === 0;

	React.useEffect(() => {
		let active = true;

		if (!loading) {
			return undefined;
		}

		(async () => {
			if (active) {
				//reloadPatientList("sivv");
			}
		})();

		return () => {
			active = false;
		};
	}, [loading]);

	React.useEffect(() => {
		if (!open) {
			setPatients([]);
		}
	}, []);

	const handleDocChange = (event) => {
		setAddAppSelectedDoc(event.target.value.id === undefined ? event.target.value : event.target.value.id);
		console.log("test print > " + event.target.value.id);
	};
	const handlePatientEmailChange = (event) => {
		setPatientEmail(event.target.value);
	};
	const handlePatientMobileNoChange = (event) => {
		setPatientMobileNo(event.target.value);
	};

	const handlePatientNameChange = (event, value) => {
		setPatientName(value);
		reloadPatientList(value);
	};

	const handleAppointmentNotesChange = (event) => {
		setAppointmentNotes(event.target.value);
	};

	function reloadPatientList(searchstr) {
		if (searchstr !== "" && searchstr.length >= 3) {
			setPatientName(searchstr);
			UserService.fetchPatientsBySearch({
				companyId: AuthService.getUserInfo().companyDTO.id,
				searchText: searchstr,
			}).then((res) => {
				if (res.data.length > 0) {
					setPatients(res.data);
				} else {
					setPatients([]);
					setPatientEmail("");
					setPatientMobileNo("");
					setPatientId("");
					setAppointmentNotes("");
					setPatientName(searchstr);
				}
			});
		}
	}

	useEffect(() => {
		setAppointmentStart(props.appointmentStart);
		// set current time
		//		setTime(moment().format("h:mm a"));

		setTime(props.time);

		var formObject = JSON.parse(localStorage.getItem("copyappointment"));

		if (formObject !== null) {
			setCopied(true);
			setCopiedAppointment(formObject);
		}
	}, [props.appointmentStart, props.time, props.eventsDates]);

	// duplicates, copied appointments
	const handlePaste = (e) => {
		setPatientEmail(copiedAppointment.patient.email);
		setPatientMobileNo(copiedAppointment.patient.mobileNo);
		setPatientId(copiedAppointment.patient.id);
		setAppointmentNotes(copiedAppointment.appointmentNotes);
		setPatientName(copiedAppointment.patient.patientName);
		setAddAppSelectedDoc(copiedAppointment.userId.id);
		setTime(moment(copiedAppointment.appointmentStarttime).format("h:mm a"));

		setCopied(false);
		//	setCopiedAppointment({});
		//localStorage.removeItem("copyappointment");
	};

	const handleRemove = (e) => {
		setPatientEmail("");
		setPatientMobileNo("");
		setPatientId("");
		setAppointmentNotes("");
		setPatientName("");
		setCopied(false);
		setCopiedAppointment({});
		localStorage.removeItem("copyappointment");
	};

	const setAddAppointmnet = (e) => {
		setErrors({});

		if (patientName === "") {
			errorsObj.patientname = "Patient Name Required.";
			setErrors(errorsObj);
			return false;
		}

		if (patientEmail !== "") {
			// console.log("dinesh " + validator.validate(patientEmail));

			if (!validator.validate(patientEmail)) {
				errorsObj.email = "Invalid Email Format.";
				setErrors(errorsObj);
				return false;
			}
		}

		if (patientMobileNo === "") {
			errorsObj.mobileNo = "Mobile Number is Required.";
			setErrors(errorsObj);

			return false;
		}

		if (Helper.validatePhoneNumber(AuthService.getUserInfo().companyDTO.companyDialCode, patientMobileNo)) {
			const phoneUtil = PhoneNumberUtil.getInstance();
			const parsedNumber = phoneUtil.parse("+" + AuthService.getUserInfo().companyDTO.companyDialCode + " " + patientMobileNo);
			setPatientMobileNo(phoneUtil.format(parsedNumber, PhoneNumberFormat.NATIONAL));
		} else {
			errorsObj.mobileNo = "Invalid Mobile Number.";
			setErrors(errorsObj);

			return false;
		}

		if (addAppSelectedDoc === "") {
			errorsObj.docname = "Doctor selection is Required.";
			setErrors(errorsObj);

			return false;
		}

		let objs = appointmentStart + " " + time;

		let isAppExists = false;

		for (let i = 0; i < props.eventsDates.length; i++) {
			if (moment(objs).isBetween(props.eventsDates[i].start, props.eventsDates[i].end, null, "[])")) {
				console.log(".... this is in between..");
				errorsObj.appointmentblocked = "Cannot create appointment. Holiday/blocked event.";
				setErrors(errorsObj);
				isAppExists = true;
				break;
			}
		}

		if (isAppExists) {
			return false;
		}

		// console.log("object.......dinesh...");
		// if (moment(objs).isBetween(props.eventsDates[0].start, props.eventsDates[0].end, null, "[])")) {
		// 	console.log(".... this is in between..");
		// 	errorsObj.appointmentblocked = "Cannot create appointment. Holiday/blocked event.";
		// 	setErrors(errorsObj);
		// 	return false;
		// }

		let formObject = {
			companyId: AuthService.getUserInfo().companyDTO.id,
			patientId: patientId,
			userId: addAppSelectedDoc,
			appointmentNotes: appointmentNotes,
			appointmentStarttime: moment(objs, "YYYY-MM-DD h:mm a").toDate(),
			appointmentDuration: AuthService.getUserInfo().companyDTO.calendarTimeslot,
			appointmentDurationType: "M", // M - Minutes
			appointmentTitle: patientName,
			appointmentStatus: "CON", // CON - Confirmed, CAN - Cancel
			appointmentType: eventType, // A-Appointment, E-Event
			loginId: AuthService.getUserInfo().userRoles[0].userId,
			patient: {
				id: patientId,
				patientName: patientName,
				companyId: AuthService.getUserInfo().companyDTO.id,
				email: patientEmail,
				mobileNo: patientMobileNo,
				loginId: AuthService.getUserInfo().userRoles[0].userId,
			},
		};

		AppointmentService.addAppointments(formObject).then((res) => {
			if (res.data.success) {
				//alert("Appointment Created");
				setModal(false);
				setResource(false);
				setAppointmentAdd(false);

				setPatientName("");
				setPatientId("");
				setAddAppSelectedDoc("");
				setPatientMobileNo("");
				setPatientEmail("");
				setPatients([]);
				setCopied(false);
				setCopiedAppointment({});
				errorsObj = {};
				setErrors("");
				localStorage.removeItem("copyappointment");

				//	props.handleSuccess("Appointment Added Successfully");
				handleSuccess("Appointment Added Successfully");
			}
		});
	};

	const handleSuccess = (params) => {
		props.handleSuccess(params);
	};

	const handleClose = (event) => {
		setPatientName("");
		setPatientId("");
		setAddAppSelectedDoc("");
		setPatientMobileNo("");
		setPatientEmail("");
		setPatients([]);
		setAppointmentNotes("");
		setEventType("A");

		errorsObj = {};
		setErrors("");

		props.handleClose();
	};

	return (
		<Modal show={props.modal} modalClosed={handleClose}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<div>
					<span>
						<FormControl component='fieldset'>
							<RadioGroup row name='eventType' value={eventType} onChange={handleChange}>
								<FormControlLabel value='A' control={<Radio />} label='Appointment' />
								<FormControlLabel value='E' control={<Radio />} label='Event' />
							</RadioGroup>
						</FormControl>
					</span>
				</div>

				<div>
					{copied ? (
						<span>
							<span style={{ fontSize: "10px", color: "orange" }}>You have a copied appointment.</span>&nbsp;
							<span>
								<Button variant='outlined' color='primary' size='small' style={{ fontSize: 9 }} type='submit' onClick={handlePaste}>
									Paste
								</Button>
							</span>
							&nbsp;&nbsp;
							<span>
								<Button variant='outlined' color='primary' size='small' style={{ fontSize: 9 }} type='submit' onClick={handleRemove}>
									Remove
								</Button>
							</span>
						</span>
					) : (
						""
					)}
					<span>
						&nbsp;&nbsp;&nbsp;
						<img src={close} style={{ cursor: "pointer" }} height='16px' alt='close' onClick={handleClose} />
					</span>
				</div>
			</div>
			{eventType === "A" ? (
				<div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
					<div style={{ margin: "10px" }}>
						<div
							style={{
								display: "grid",
								padding: "8px",
								gridGap: "10px",
								gridTemplateColumns: "1fr 1fr 1fr",
							}}>
							<div>
								<Autocomplete
									freeSolo
									style={{ width: "240px" }}
									open={open}
									onOpen={() => {
										setOpen(true);
									}}
									onClose={() => {
										setOpen(false);
									}}
									onChange={(event, value) => {
										console.log("calling on change" + value);

										if (value != null) {
											setPatientName(value.patientName);
											setPatientId(value.id);
											setPatientEmail(value.email);
											setPatientMobileNo(value.mobileNo);
										} else {
											setPatientId("");
											setPatientName("");
											setPatientEmail("");
											setPatientMobileNo("");
										}
									}}
									// calls every search string {event:Object value:string}
									onInputChange={(event, value) => {
										handlePatientNameChange(event, value);
									}}
									getOptionSelected={(option, value) => option.patientName === value.patientName}
									getOptionLabel={(option) => option.patientName}
									options={patients}
									loading={loading}
									clearOnEscape={true}
									inputValue={patientName}
									renderInput={(params) => (
										<TextField
											{...params}
											label='Patient Name'
											variant='filled'
											margin='dense'
											//	value={patientName}
											// onChange={handlePatientNameChange}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{loading ? <CircularProgress color='inherit' size={20} /> : null}
														{params.InputProps.endAdornment}
													</React.Fragment>
												),
											}}
										/>
									)}
								/>
								{/* {errors !== "" && errors.patientname && <p className='error'>{errors.patientname}</p>} */}
								<span style={{ fontSize: "12px", color: "#797979" }}>Patient# {patientId}</span>
							</div>

							<div>
								<TextField
									helperText='Mobile Number'
									value={patientMobileNo}
									onChange={handlePatientMobileNoChange}
									margin='dense'
									variant='filled'
									InputProps={{
										startAdornment: <InputAdornment position='start'>{"+" + AuthService.getUserInfo().companyDTO.companyDialCode}</InputAdornment>,
									}}
								/>

								{errors.mobileNo && <p className='error'>{errors.mobileNo}</p>}
							</div>
							<div>
								<TextField helperText='Email ID(Optional)' value={patientEmail} margin='dense' variant='filled' onChange={handlePatientEmailChange} />
								{errors.email && <p className='error'>{errors.email}</p>}
							</div>
						</div>
						<div
							style={{
								display: "grid",
								padding: "8px",
								gridGap: "10px",
								gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
							}}>
							<div>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<KeyboardDatePicker
										name='appointmentStarttime'
										type='string'
										disableToolbar
										autoOk={true}
										variant='inline'
										format='dd/MMM/yyyy'
										margin='dense'
										id='date-picker-inline'
										label='Scheduled'
										value={appointmentStart}
										onChange={() => {}}
										inputProps={{ datafieldtype: "appointmentStarttime" }}
										//  error={errCourseEndTime.length > 0 ? true : false}
										//  helperText={errCourseStartTime}
										InputLabelProps={{
											shrink: true,
										}}
										required
									/>
								</MuiPickersUtilsProvider>
							</div>
							<div style={{ display: "grid", alignSelf: "center" }}>
								<span style={{ position: "absolute", zIndex: "99999" }}>
									{showTime && (
										<TimeKeeper
											time={time}
											onChange={(newTime) => setTime(newTime.formatted12)}
											onDoneClick={() => setShowTime(false)}
											switchToMinuteOnHourSelect={true}
											closeOnMinuteSelect={true}
										/>
									)}

									<span>
										{!showTime && (
											<span
												onClick={() => {
													console.log("object tine " + time);
													setShowTime(true);
												}}
												style={{
													fontSize: "14px",
													color: "#DC143C",
													backgroundColor: "#f7e9e9",
													padding: "10px",
												}}>
												Time: {time}
											</span>
										)}
									</span>
								</span>
							</div>
							<div style={{ gridColumn: "3 / span 2" }}>
								<TextField
									fullWidth
									margin='dense'
									select
									label='Select Doctor'
									value={addAppSelectedDoc}
									onChange={handleDocChange}
									style={widthEighty}
									required>
									{props.doctors.map((doc, i) => (
										<MenuItem key={i} value={doc.id}>
											{doc.firstName}
										</MenuItem>
									))}
								</TextField>
								{errors.docname && <p className='error'>{errors.docname}</p>}
							</div>
						</div>
						<div style={{ gridColumn: "1/-1" }}>
							<InputLabel>Notes (Optional)</InputLabel>
							<TextField
								multiline
								fullWidth
								margin='dense'
								rows='1'
								defaultValue=''
								value={appointmentNotes}
								onChange={handleAppointmentNotesChange}
							/>
						</div>
						{errors.appointmentblocked && <p className='error'>{errors.appointmentblocked}</p>}
						<div style={{ textAlign: "center", gridColumn: "1/-1", paddingTop: "20px" }}>
							<Button variant='contained' color='primary' onClick={setAddAppointmnet}>
								+ Add Appointment
							</Button>
						</div>
					</div>
				</div>
			) : (
				<EventAdd appointmentStart={appointmentStart} handleSuccess={handleSuccess} handleClose={handleClose} />
			)}
		</Modal>
	);
};

export default AppointmentAdd;

const widthEighty = {
	width: "80%",
};
