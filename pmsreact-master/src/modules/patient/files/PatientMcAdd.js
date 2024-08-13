import React, { useState, Fragment, useEffect, useReducer } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import FormControl from "@material-ui/core/FormControl";

import Container from "@material-ui/core/Container";

import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";

import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import SaveRoundedIcon from "@material-ui/icons/SaveRounded";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import Helper from "../../helper/helper";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ErrorBoundary from "../../../component/errorboundry/ErrorBoundary";
import TimeKeeper from "react-timekeeper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Radio from "@material-ui/core/Radio";
import Checkbox from "@material-ui/core/Checkbox";
import UserService from "../../../service/UserService";
import AuthService from "../../../service/AuthService";
import PatientService from "../../../service/PatientService";

import moment from "moment";

const PatientMcAdd = (props) => {
	let history = useHistory();

	const { patientIdParam } = useParams();

	const [state, dispatch] = useReducer(Helper.reducer, initialState);

	const handleDocChange = (event) => {
		// dispatch({ field: "selectedDoc", value: event.target.value.id === undefined ? event.target.value : event.target.value.id });
		dispatch({ field: "selectedDoc", value: event.target.value });
		dispatch({ field: "selectedDocName", value: event.target.value.firstName });
	};

	const [clickedPatientMCChangeBtn, setClickedPatientMCChangeBtn] = useState("outlined");

	useEffect(() => {
		dispatch({ field: "mcnumber", value: Math.floor(100000000 + Math.random() * 900000000) });
		dispatch({ field: "excusedfromdate", value: new Date() });
		dispatch({ field: "excusedtilldate", value: new Date() });

		dispatch({ field: "fitfromdate", value: new Date() });
		dispatch({ field: "fittilldate", value: new Date() });
		dispatch({ field: "proofofattendancedate", value: new Date() });
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("object submitted successfuy ..");

		let excuseDutyStartDate = null;
		let excuseDutyEndDate = null;
		let unfitdays = "";

		let fitDutyStartDate = null;
		let fitDutyEndDate = null;

		let proofAttendStartDateTime = null;
		let proofAttendEndDateTime = null;

		if (state.selectedDoc === "0") {
			alert("Select doctor and proceed!");
			return false;
		}

		if (state.excusedFromDuty) {
			excuseDutyStartDate = moment(state.excusedfromdate);
			excuseDutyEndDate = moment(state.excusedtilldate);
			unfitdays = parseInt(excuseDutyEndDate.diff(excuseDutyStartDate, "days"), 10) + 1;

			dispatch({ field: "unfitdays", value: unfitdays });

			proofAttendStartDateTime = null;
			proofAttendEndDateTime = null;
		}

		if (state.fitForDuty) {
			fitDutyStartDate = moment(state.fitDutyStartDate).format("DD-MM-YYYY");
			fitDutyEndDate = moment(state.fitDutyEndDate).format("DD-MM-YYYY");

			proofAttendStartDateTime = null;
			proofAttendEndDateTime = null;
		}

		if (state.proofOfAttendance) {
			proofAttendStartDateTime = `${moment(state.proofAttendStartDateTime).format("DD-MM-YYYY")} ${state.fromTime}`;
			proofAttendEndDateTime = `${moment(state.proofAttendEndDateTime).format("DD-MM-YYYY")} ${state.toTime}`;

			fitDutyStartDate = null;
			fitDutyEndDate = null;

			excuseDutyStartDate = null;
			excuseDutyEndDate = null;
			unfitdays = "";
		}

		let formObj = {
			companyId: AuthService.getUserInfo().companyDTO.id,
			patientId: patientIdParam,
			doctorId: state.selectedDoc.id,
			doctorName: state.selectedDocName,
			medicalCertificateNo: state.mcnumber,
			notes: state.notes,
			excuseDutyStartDate: moment(state.excusedfromdate).format("DD-MM-YYYY"),
			excuseDutyEndDate: moment(state.excusedtilldate).format("DD-MM-YYYY"),
			excuseDutyDays: `${unfitdays}`,
			fitDutyStartDate: fitDutyStartDate,
			fitDutyEndDate: fitDutyEndDate,
			proofAttendStartDateTime: proofAttendStartDateTime,
			proofAttendEndDateTime: proofAttendEndDateTime,
			courtAttendance: state.radioValue,
		};

		//	console.log("object" + JSON.stringify(formObj));

		PatientService.mcReport(formObj)
			.then((response) => {
				//Create a Blob from the PDF Stream
				const file = new Blob([response.data], { type: "application/pdf" });
				//Build a URL from the file
				const fileURL = URL.createObjectURL(file);
				//Open the URL on new Window
				window.open(fileURL);
				history.push(`/patient/detail/${patientIdParam}`);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleFromDateChange = (name, date) => {
		dispatch({ field: name, value: date });

		if (name === "excusedtilldate") {
			let tempdays = moment(date).endOf("day").diff(moment(state.excusedfromdate).startOf("day"), "days") + 1;

			if (tempdays <= 0 || moment(date).startOf("day").isBefore(moment(state.excusedfromdate).startOf("day"))) {
				tempdays = 0;
			}

			dispatch({ field: "unfitdays", value: tempdays });
		} else if (name === "excusedfromdate") {
			let tempdays = moment(state.excusedtodate).endOf("day").diff(moment(date).startOf("day"), "days") + 1;

			if (tempdays <= 0 || moment(state.excusedtodate).startOf("day").isBefore(moment(date).startOf("day"))) {
				tempdays = 0;
			}

			dispatch({ field: "unfitdays", value: tempdays });
		}
	};

	const handleChange = (event) => {
		dispatch({ field: event.target.name, value: event.target.value });
	};

	const handleSessionChange = (event) => {
		if (event.target.name === "excusedfromsession" && state.excusedfromsession !== event.target.value) {
			if (event.target.value === 20) {
				dispatch({ field: "unfitdays", value: state.unfitdays - 0.5 });
			} else if (event.target.value === 10) {
				dispatch({ field: "unfitdays", value: state.unfitdays + 0.5 });
			}
		}

		if (event.target.name === "excusedtillsession" && state.excusedtillsession !== event.target.value) {
			if (event.target.value === 10) {
				dispatch({ field: "unfitdays", value: state.unfitdays - 0.5 });
			} else if (event.target.value === 20) {
				dispatch({ field: "unfitdays", value: state.unfitdays + 0.5 });
			}
		}

		dispatch({ field: event.target.name, value: event.target.value });
	};

	const handleCheckboxChange = (event) => {
		dispatch({ field: event.target.name, value: event.target.checked });

		if (event.target.name === "proofOfAttendance") {
			dispatch({ field: "excusedFromDuty", value: false });
			dispatch({ field: "fitForDuty", value: false });
		} else if (event.target.name !== "proofOfAttendance") {
			dispatch({ field: "proofOfAttendance", value: false });
		}
	};

	const handleCancel = () => {
		history.goBack();
	};

	useEffect(() => {
		dispatch({ field: "selectedDoc", value: "0" });
		reloadDoctorsList();
	}, []);

	function reloadDoctorsList() {
		UserService.fetchAllDoctors(AuthService.getUserInfo().companyDTO.id).then((res) => {
			dispatch({ field: "doctors", value: res.data });
		});
	}

	return (
		<>
			<div className='adm-wrap'>
				<Fragment>
					<ErrorBoundary>
						<Container>
							<div style={{ display: "flex", justifyContent: "space-between", padding: "30px 0px", textAlign: "left" }}>
								<div>ADD MEDICAL LEAVE CERTIFICATE</div>
								<div>
									<Button
										variant={"outlined"}
										color='primary'
										size='small'
										style={{ fontSize: 10 }}
										type='submit'
										onClick={handleCancel}
										endIcon={<CancelOutlinedIcon />}>
										Cancel
									</Button>
									&nbsp;
									<Button
										variant={clickedPatientMCChangeBtn}
										color='primary'
										size='small'
										style={{ fontSize: 10 }}
										type='button'
										onClick={handleSubmit}
										endIcon={<SaveRoundedIcon />}>
										Save Medical Leave Certificate
									</Button>
								</div>
							</div>

							<div style={{ display: "grid", gridTemplateColumns: "1fr", alignItems: "center", width: "80%" }}>
								<div style={{ display: "grid", gridTemplateColumns: "300px 1fr 1fr", gridGap: "5px", alignItems: "center", paddingBottom: "20px" }}>
									<div>Medical Leave Number</div>
									<div>
										<TextField
											type='text'
											label='Medical Leave #'
											width='200px'
											margin='dense'
											name='mcnumber'
											value={state.mcnumber}
											onChange={handleChange}
										/>
									</div>
									<div>
										<span>
											<InputLabel>Issued by Doctor</InputLabel>
										</span>
										<span>
											<FormControl>
												<Select value={state.selectedDoc} margin='dense' onChange={handleDocChange} displayEmpty>
													<MenuItem value='0'>
														<em>Select Doctor</em>
													</MenuItem>
													{state.doctors.map((doc, i) => (
														<MenuItem key={i} value={doc}>
															{doc.firstName}
														</MenuItem>
													))}
												</Select>
											</FormControl>
										</span>
									</div>
								</div>
								<div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gridGap: "5px", alignItems: "center" }}>
									<div>
										<FormControlLabel
											control={<Checkbox checked={state.excusedFromDuty} onChange={handleCheckboxChange} name='excusedFromDuty' color='primary' />}
											label='Excused from duty'
										/>
									</div>
									<div style={{ marginTop: "5px" }}>
										{state.excusedFromDuty ? (
											<>
												<span style={{ paddingRight: "10px" }}>
													<MuiPickersUtilsProvider utils={DateFnsUtils}>
														<KeyboardDatePicker
															clearable
															label={"From"}
															name='excusedfromdate'
															margin='dense'
															value={state.excusedfromdate}
															onChange={(date) => handleFromDateChange("excusedfromdate", date)}
															format={Helper.getInputDateFormatByDash()}
														/>
													</MuiPickersUtilsProvider>
												</span>
												<span>
													<FormControl>
														<InputLabel>Session</InputLabel>
														<Select name='excusedfromsession' value={state.excusedfromsession} onChange={handleSessionChange}>
															<MenuItem value={10}>Morning Session</MenuItem>
															<MenuItem value={20}>Evening Session</MenuItem>
														</Select>
													</FormControl>
												</span>{" "}
											</>
										) : (
											""
										)}
									</div>
								</div>
								<div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gridGap: "5px", alignItems: "center" }}>
									<div>{state.excusedFromDuty ? <>Unfit for {state.unfitdays} days</> : ""}</div>
									<div style={{ marginTop: "5px" }}>
										{state.excusedFromDuty ? (
											<>
												<span style={{ paddingRight: "10px" }}>
													<MuiPickersUtilsProvider utils={DateFnsUtils}>
														<KeyboardDatePicker
															clearable
															label={"To"}
															name='excusedtilldate'
															margin='dense'
															value={state.excusedtilldate}
															onChange={(date) => handleFromDateChange("excusedtilldate", date)}
															format={Helper.getInputDateFormatByDash()}
														/>
													</MuiPickersUtilsProvider>
												</span>
												<span>
													<FormControl>
														<InputLabel>Session</InputLabel>
														<Select name='excusedtillsession' value={state.excusedtillsession} onChange={handleSessionChange}>
															<MenuItem value={10}>Morning Session</MenuItem>
															<MenuItem value={20}>Evening Session</MenuItem>
														</Select>
													</FormControl>
												</span>
											</>
										) : (
											""
										)}
									</div>
								</div>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "300px 1fr",
										gridGap: "5px",
										alignItems: "center",
										paddingTop: "20px",
										paddingBottom: "20px",
									}}>
									<div>
										<FormControlLabel
											control={<Checkbox checked={state.fitForDuty} onChange={handleCheckboxChange} name='fitForDuty' color='primary' />}
											label='Fit for light duty'
										/>
									</div>
									<div style={{ marginTop: "5px" }}>
										{state.fitForDuty ? (
											<>
												<div style={{ paddingRight: "10px" }}>
													<MuiPickersUtilsProvider utils={DateFnsUtils}>
														<KeyboardDatePicker
															clearable
															label={"From"}
															name='fitfromdate'
															margin='dense'
															value={state.fitfromdate}
															onChange={(date) => handleFromDateChange("fitfromdate", date)}
															format={Helper.getInputDateFormatByDash()}
														/>
													</MuiPickersUtilsProvider>
												</div>

												<div style={{ paddingRight: "10px" }}>
													<MuiPickersUtilsProvider utils={DateFnsUtils}>
														<KeyboardDatePicker
															clearable
															label={"From"}
															name='fittilldate'
															value={state.fittilldate}
															onChange={(date) => handleFromDateChange("fittilldate", date)}
															format={Helper.getInputDateFormatByDash()}
														/>
													</MuiPickersUtilsProvider>
												</div>
											</>
										) : (
											""
										)}
									</div>
								</div>

								<div
									style={{
										display: "grid",
										gridTemplateColumns: "300px 200px 1fr 1fr",
										gridGap: "5px",
										alignItems: "center",
										paddingTop: "20px",
										paddingBottom: "20px",
										paddingLeft: "10px",
										backgroundColor: "#f2f2f2",
									}}>
									<div>
										<FormControlLabel
											control={
												<Checkbox checked={state.proofOfAttendance} onChange={handleCheckboxChange} name='proofOfAttendance' color='primary' />
											}
											label='Proof of attendance at practice'
										/>
									</div>
									<div style={{ marginTop: "5px" }}>
										{state.proofOfAttendance ? (
											<span style={{ paddingRight: "10px" }}>
												<MuiPickersUtilsProvider utils={DateFnsUtils}>
													<KeyboardDatePicker
														clearable
														label={"date"}
														name='proofofattendancedate'
														margin='dense'
														value={state.proofofattendancedate}
														onChange={(date) => handleFromDateChange("proofofattendancedate", date)}
														format={Helper.getInputDateFormatByDash()}
													/>
												</MuiPickersUtilsProvider>
											</span>
										) : (
											""
										)}
									</div>

									{state.proofOfAttendance ? (
										<div style={{ paddingLeft: "20px" }}>
											<span>From: &nbsp;</span>
											<span style={{ position: "absolute", zIndex: "99999" }}>
												{state.showFromTime && (
													<TimeKeeper
														time={state.fromTime}
														onChange={(newTime) => {
															dispatch({ field: "fromTime", value: newTime.formatted12 });
														}}
														onDoneClick={() => {
															dispatch({ field: "showFromTime", value: false });
															dispatch({ field: "showToTime", value: false });
														}}
														switchToMinuteOnHourSelect={true}
														closeOnMinuteSelect={true}
													/>
												)}
											</span>

											<span>
												{!state.showFromTime ? (
													<span
														onClick={() => {
															dispatch({ field: "showFromTime", value: true });
															dispatch({ field: "showToTime", value: false });
														}}
														style={{
															fontSize: "16px",
															color: "#DC143C",
															backgroundColor: "#f7e9e9",
															padding: "5px",
														}}>
														{state.fromTime}
													</span>
												) : (
													""
												)}
											</span>
										</div>
									) : (
										""
									)}

									{state.proofOfAttendance ? (
										<div>
											<span>To: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
											<span style={{ position: "absolute", zIndex: "99999" }}>
												{state.showToTime && (
													<TimeKeeper
														time={state.toTime}
														onChange={(newTime) => {
															dispatch({ field: "toTime", value: newTime.formatted12 });
														}}
														onDoneClick={() => {
															dispatch({ field: "showToTime", value: false });
															dispatch({ field: "showFromTime", value: false });
														}}
														switchToMinuteOnHourSelect={true}
														closeOnMinuteSelect={true}
													/>
												)}
											</span>

											<span>
												{!state.showToTime ? (
													<span
														onClick={() => {
															dispatch({ field: "showToTime", value: true });
															dispatch({ field: "showFromTime", value: false });
														}}
														style={{
															fontSize: "16px",
															color: "#DC143C",
															backgroundColor: "#f7e9e9",
															padding: "5px",
														}}>
														{state.toTime}
													</span>
												) : (
													""
												)}
											</span>
										</div>
									) : (
										""
									)}
								</div>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "300px 1fr",
										gridGap: "5px",
										alignItems: "center",
										paddingTop: "20px",
										paddingBottom: "20px",
									}}>
									<div>Notes</div>
									<div>
										<InputLabel>Notes (Optional)</InputLabel>
										<TextField multiline fullWidth margin='dense' rows='1' name='notes' defaultValue='' value={state.notes} onChange={handleChange} />
									</div>
								</div>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr",
										gridGap: "5px",
										alignItems: "center",
										paddingTop: "20px",
										paddingBottom: "20px",
									}}>
									<div>
										<FormLabel component='legend'>Legal </FormLabel>
										<RadioGroup aria-label='gender' name='radioValue' value={state.radioValue} onChange={handleChange}>
											<FormControlLabel
												value={"Valid for absence from court attendance"}
												control={<Radio />}
												label='Valid for absence from court attendance'
											/>
											<FormControlLabel
												value={"Invalid for absence from court attendance"}
												control={<Radio />}
												label='Invalid for absence from court attendance'
											/>
										</RadioGroup>
									</div>
									<div>&nbsp;</div>
								</div>
							</div>

							<div style={{ display: "flex", justifyContent: "space-between", padding: "30px 0px", textAlign: "left" }}>
								<div>
									<Button
										variant={"outlined"}
										color='primary'
										size='small'
										style={{ fontSize: 10 }}
										type='submit'
										onClick={handleCancel}
										endIcon={<CancelOutlinedIcon />}>
										Cancel
									</Button>
									&nbsp;
									<Button
										variant={clickedPatientMCChangeBtn}
										color='primary'
										size='small'
										style={{ fontSize: 10 }}
										type='button'
										onClick={handleSubmit}
										endIcon={<SaveRoundedIcon />}>
										Generate Medical Leave Certificate
									</Button>
								</div>
							</div>
						</Container>
					</ErrorBoundary>
				</Fragment>
			</div>
		</>
	);
};

export default PatientMcAdd;

const initialState = {
	mcnumber: "",
	excusedfromdate: "",
	excusedfromsession: 10,
	excusedtilldate: "",
	excusedtillsession: 20,
	fitfromdate: "",
	fittilldate: "",
	proofofattendancedate: "",
	fromTime: "00:00 am",
	toTime: "00:00 pm",
	showToTime: false,
	showFromTime: false,
	notes: "",
	radioValue: "0",
	doctors: [],
	selectedDoc: "0",
	selectedDocName: "",
	excusedFromDuty: false,
	fitForDuty: false,
	proofOfAttendance: false,
	unfitdays: 1,
};
